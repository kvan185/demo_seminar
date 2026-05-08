import torch
import json
from pathlib import Path
from model import TransformerClassifier

PROCESSED_DIR = Path("data/processed")
RESULTS_DIR = Path("results")
MODEL_PATH = RESULTS_DIR / "model_Transformer_d128_ff256.pt"

with open(PROCESSED_DIR / "vocab.json", "r", encoding="utf-8") as f:
    vocab = json.load(f)
with open(PROCESSED_DIR / "meta.json", "r", encoding="utf-8") as f:
    meta = json.load(f)

device = torch.device("cpu")
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
    return text.strip().lower().split()

def encode_text(text, vocab, max_len):
    tokens = tokenize(text)
    ids = [vocab.get(tok, vocab.get("[UNK]", 1)) for tok in tokens][:max_len]
    if len(ids) < max_len:
        ids += [vocab.get("[PAD]", 0)] * (max_len - len(ids))
    return ids

# Samples directly from training set
samples = [
    ("the soundtrack sounds boring for us", 0), # negative
    ("the film was remarkably fun now", 2),    # positive (this was test, but let's try)
    ("this was a bad watch", 0),               # negative
    ("the ending feels really fantastic", 2)    # positive
]

for s, target in samples:
    print(f"\n--- Testing: {s} (Target: {target}) ---")
    input_ids = encode_text(s, vocab, meta["max_len"])
    input_tensor = torch.tensor([input_ids], dtype=torch.long)
    
    with torch.no_grad():
        logits = model(input_tensor)
        probs = torch.softmax(logits, dim=-1)[0]
        pred_idx = torch.argmax(probs).item()
        print(f"Prediction: {meta['label_names'][pred_idx]} ({probs[pred_idx]:.4f})")
        print(f"All Probs: { {meta['label_names'][i]: f'{probs[i]:.4f}' for i in range(len(probs))} }")
