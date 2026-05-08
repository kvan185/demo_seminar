import torch
import json
from pathlib import Path
from model import TransformerClassifier

def main():
    processed_dir = Path("data/processed")
    results_dir = Path("results")
    vocab = json.load(open(processed_dir / "vocab.json", "r", encoding="utf-8"))
    meta = json.load(open(processed_dir / "meta.json", "r", encoding="utf-8"))
    test_data = torch.load(processed_dir / "test.pt")

    model_path = results_dir / "model_Transformer_d128_ff256.pt"
    model = TransformerClassifier(
        vocab_size=meta["vocab_size"],
        d_model=128, d_ff=256,
        max_len=meta["max_len"], num_classes=meta["num_classes"]
    )
    model.load_state_dict(torch.load(model_path, map_location="cpu"))
    model.eval()

    input_ids = test_data["input_ids"]
    labels = test_data["labels"]
    texts = test_data["texts"]
    
    found = False
    with torch.no_grad():
        logits = model(input_ids)
        preds = logits.argmax(dim=-1)
        for i in range(len(preds)):
            if preds[i] != labels[i]:
                print(f"Error found for d128 model:")
                print(f"Text: {texts[i]}")
                print(f"True: {meta['label_names'][labels[i]]} | Pred: {meta['label_names'][preds[i]]}")
                found = True
    
    if not found:
        print("No errors found for d128 model on test set!")

if __name__ == "__main__":
    main()
