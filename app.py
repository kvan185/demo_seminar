import torch
import json
import math
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from pathlib import Path
from model import TransformerClassifier

app = Flask(__name__)
CORS(app)

# Configuration
PROCESSED_DIR = Path("data/processed")
RESULTS_DIR = Path("results")
MODEL_PATH = RESULTS_DIR / "model_Transformer_d128_ff256.pt"

# Load vocabulary and metadata
with open(PROCESSED_DIR / "vocab.json", "r", encoding="utf-8") as f:
    vocab = json.load(f)
with open(PROCESSED_DIR / "meta.json", "r", encoding="utf-8") as f:
    meta = json.load(f)

# Load model
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = TransformerClassifier(
    vocab_size=meta["vocab_size"],
    d_model=128,
    d_ff=256,
    max_len=meta["max_len"],
    num_classes=meta["num_classes"]
)
model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
model.eval()

def tokenize(text):
    # Loại bỏ dấu câu và chuyển về chữ thường
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
    if not text:
        return jsonify({"error": "Empty text"}), 400

    input_ids, tokens = encode_text(text, vocab, meta["max_len"])
    input_tensor = torch.tensor([input_ids], dtype=torch.long).to(device)

    with torch.no_grad():
        logits = model(input_tensor)
        probs = torch.softmax(logits, dim=-1)[0]
        pred_idx = torch.argmax(probs).item()
        
        # Get attention weights from the last forward pass
        # model.last_attention_weights shape: (1, seq_len, seq_len)
        attn_weights = model.last_attention_weights[0, :len(tokens), :len(tokens)].cpu().tolist()

    result = {
        "text": text,
        "tokens": tokens,
        "prediction": meta["label_names"][pred_idx],
        "confidence": float(probs[pred_idx]),
        "all_probs": {meta["label_names"][i]: float(probs[i]) for i in range(len(probs))},
        "attention": attn_weights
    }
    return jsonify(result)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
