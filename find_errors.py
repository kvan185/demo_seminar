import torch
import json
from pathlib import Path
from model import TransformerClassifier

def find_misclassified():
    processed_dir = Path("data/processed")
    results_dir = Path("results")
    
    # Load data
    test_data = torch.load(processed_dir / "test.pt")
    vocab = json.load(open(processed_dir / "vocab.json", "r", encoding="utf-8"))
    meta = json.load(open(processed_dir / "meta.json", "r", encoding="utf-8"))
    
    # Load best model
    model_path = results_dir / "model_Transformer_d64_ff128.pt"
    model = TransformerClassifier(
        vocab_size=meta["vocab_size"],
        d_model=64,
        d_ff=128,
        max_len=meta["max_len"],
        num_classes=meta["num_classes"]
    )
    model.load_state_dict(torch.load(model_path, map_location="cpu"))
    model.eval()
    
    input_ids = test_data["input_ids"]
    labels = test_data["labels"]
    texts = test_data["texts"]
    label_names = meta["label_names"]
    
    errors = []
    with torch.no_grad():
        logits = model(input_ids)
        preds = logits.argmax(dim=-1)
        
        for i in range(len(preds)):
            if preds[i] != labels[i]:
                errors.append({
                    "text": texts[i],
                    "true_label": label_names[labels[i]],
                    "pred_label": label_names[preds[i]]
                })
    
    return errors

if __name__ == "__main__":
    errors = find_misclassified()
    print(f"Tim thay {len(errors)} cau sai tren tap test:")
    for i, err in enumerate(errors[:10]): # Lay toi da 10 cau
        print(f"{i+1}. Text: {err['text']}")
        print(f"   Dung: {err['true_label']} | Doan: {err['pred_label']}")
        print("-" * 20)
