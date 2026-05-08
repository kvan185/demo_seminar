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

# Test with sequence of UNKs
input_ids = [1] * 10 + [0] * 10
input_tensor = torch.tensor([input_ids], dtype=torch.long)

with torch.no_grad():
    logits = model(input_tensor)
    probs = torch.softmax(logits, dim=-1)[0]
    pred_idx = torch.argmax(probs).item()
    print(f"Prediction for UNKs: {meta['label_names'][pred_idx]} ({probs[pred_idx]:.4f})")
    print(f"All Probs: { {meta['label_names'][i]: f'{probs[i]:.4f}' for i in range(len(probs))} }")
