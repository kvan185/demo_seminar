import csv
import torch
import json
import math
import re
import collections
from flask import Flask, request, jsonify
from flask_cors import CORS
from pathlib import Path
from model import TransformerClassifier, MLPBaseline

app = Flask(__name__)
CORS(app)

# Configuration
PROCESSED_DIR = Path("data/processed")
RESULTS_DIR = Path("results")
DATA_CSV = Path("data/sentiment_raw.csv")

# Load vocabulary and metadata
with open(PROCESSED_DIR / "vocab.json", "r", encoding="utf-8") as f:
    vocab = json.load(f)
with open(PROCESSED_DIR / "meta.json", "r", encoding="utf-8") as f:
    meta = json.load(f)

# Load all models
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

models = {}

# Transformer #1 (d32)
m1 = TransformerClassifier(meta["vocab_size"], 32, 64, meta["max_len"], meta["num_classes"])
m1.load_state_dict(torch.load(RESULTS_DIR / "model_Transformer_d32_ff64.pt", map_location=device))
m1.eval().to(device)
models["transformer_1"] = m1

# Transformer #2 (d64)
m2 = TransformerClassifier(meta["vocab_size"], 64, 128, meta["max_len"], meta["num_classes"])
m2.load_state_dict(torch.load(RESULTS_DIR / "model_Transformer_d64_ff128.pt", map_location=device))
m2.eval().to(device)
models["transformer_2"] = m2

# Transformer #3 (d128)
m3 = TransformerClassifier(meta["vocab_size"], 128, 256, meta["max_len"], meta["num_classes"])
m3.load_state_dict(torch.load(RESULTS_DIR / "model_Transformer_d128_ff256.pt", map_location=device))
m3.eval().to(device)
models["transformer_3"] = m3

# MLP Basic (d64)
m_basic = MLPBaseline(meta["vocab_size"], 64, meta["num_classes"])
m_basic.load_state_dict(torch.load(RESULTS_DIR / "model_MLPBaseline_d64.pt", map_location=device))
m_basic.eval().to(device)
models["basic"] = m_basic

def tokenize(text):
    text = re.sub(r'[^\w\s]', '', text)
    return text.strip().lower().split()

def encode_text(text, vocab, max_len):
    tokens = tokenize(text)
    ids = [vocab.get(tok, vocab.get("[UNK]", 1)) for tok in tokens][:max_len]
    orig_tokens = tokens[:max_len]
    length = len(ids)
    if length < max_len:
        ids += [vocab.get("[PAD]", 0)] * (max_len - length)
    return ids, orig_tokens

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    text = data.get("text", "")
    model_type = data.get("model_type", "transformer_3")
    
    if not text:
        return jsonify({"error": "Empty text"}), 400
    
    if model_type not in models:
        return jsonify({"error": "Invalid model type"}), 400

    model = models[model_type]
    input_ids, tokens = encode_text(text, vocab, meta["max_len"])
    input_tensor = torch.tensor([input_ids], dtype=torch.long).to(device)

    with torch.no_grad():
        logits = model(input_tensor)
        probs = torch.softmax(logits, dim=-1)[0]
        pred_idx = torch.argmax(probs).item()
        
        # Get attention weights if available
        attn_weights = None
        if hasattr(model, "last_attention_weights") and model.last_attention_weights is not None:
            attn_weights = model.last_attention_weights[0, :len(tokens), :len(tokens)].cpu().tolist()

    # Simple XAI: identify top contributing words (based on attention or just presence)
    # For transformer, we use attention. For basic, we just show all words.
    xai_info = []
    if attn_weights:
        # Sum of attention received by each word from all other words
        # (Simplified importance)
        importance = [sum(row[j] for row in attn_weights) for j in range(len(tokens))]
        for i, token in enumerate(tokens):
            xai_info.append({"token": token, "score": float(importance[i])})
        xai_info = sorted(xai_info, key=lambda x: x["score"], reverse=True)

    result = {
        "text": text,
        "tokens": tokens,
        "prediction": meta["label_names"][pred_idx],
        "confidence": float(probs[pred_idx]),
        "all_probs": {meta["label_names"][i]: float(probs[i]) for i in range(len(probs))},
        "attention": attn_weights,
        "xai": xai_info,
        "model_used": model_type
    }
    return jsonify(result)

@app.route("/csv-data", methods=["GET"])
def csv_data():
    try:
        limit = int(request.args.get("limit", 100))
        start = int(request.args.get("start", 0))
        filter_label = request.args.get("label", "")
        filter_split = request.args.get("split", "")
    except ValueError:
        return jsonify({"error": "Invalid pagination parameters"}), 400

    rows = []
    filtered_count = 0
    with open(DATA_CSV, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for idx, row in enumerate(reader):
            # Apply filters
            if filter_label and row.get("label_name") != filter_label:
                continue
            if filter_split and row.get("split") != filter_split:
                continue
            
            filtered_count += 1
            if filtered_count > start and len(rows) < limit:
                rows.append(row)
        
        headers = reader.fieldnames or []

    return jsonify({
        "headers": headers, 
        "rows": rows, 
        "start": start, 
        "limit": limit, 
        "total_filtered": filtered_count
    })

@app.route("/wordcloud", methods=["GET"])
def wordcloud():
    # Generate word cloud data from the raw CSV
    # Returns word frequencies per label
    word_freq = {label: collections.Counter() for label in meta["label_names"]}
    
    stop_words = {"the", "a", "an", "and", "or", "but", "is", "are", "was", "were", "to", "of", "in", "it"}
    
    with open(DATA_CSV, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            label = row.get("label_name")
            text = row.get("text", "")
            if label in word_freq:
                tokens = tokenize(text)
                for t in tokens:
                    if len(t) > 2 and t not in stop_words:
                        word_freq[label][t] += 1
    
    # Take top 50 words for each label
    result = {}
    for label in meta["label_names"]:
        result[label] = [{"text": word, "size": count} for word, count in word_freq[label].most_common(50)]
        
    return jsonify(result)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
