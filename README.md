# Đồ án Cuối kỳ: Xây dựng Transformer cho bài toán phân loại cảm xúc

**Môn học:** Seminar chuyên đề
**Sinh viên 1:** Nguyễn Khánh Văn
**MSSV1:** 3122410463
**Sinh viên 2:** Nguyễn Thành Khang
**MSSV2:** 3122410172

## 1. Giới thiệu
Đồ án này tập trung vào việc tự cài đặt thành phần cốt lõi của kiến trúc Transformer là **Self-Attention** từ đầu bằng PyTorch để giải quyết bài toán phân loại cảm xúc văn bản (Positive, Negative, Neutral).

## 2. Cấu trúc dự án
- `data/`: Chứa tập dữ liệu gốc `sentiment_raw.csv`.
- `model.py`: Chứa kiến trúc Transformer Encoder (phần tự cài đặt: Scaled Dot-Product Attention và Feed Forward Network).
- `train.py`: Script huấn luyện mô hình và thực hiện các thực nghiệm so sánh.
- `visualize.py`: Script tạo heatmap trực quan hóa trọng số Attention.
- `data_utils.py`: Chứa các hàm tiền xử lý dữ liệu và xây dựng từ điển.
- `results/`: Chứa các model checkpoint (.pt), đồ thị learning curve và heatmap.

## 3. Hướng dẫn sử dụng

### Cài đặt môi trường
```bash
pip install -r requirements.txt
```

### Tiền xử lý dữ liệu
Lệnh này sẽ xử lý dữ liệu thô, cắt câu tối đa 20 từ và tạo các file tensor:
```bash
python data_utils.py --max_len 20
```

### Huấn luyện và Thực nghiệm
Để chạy huấn luyện cho tất cả cấu hình (Transformer d=32, 64, 128 và Baseline MLP):
```bash
python train.py --run_all
```

### Trực quan hóa Attention
Để xem mô hình đang "chú ý" vào từ nào trong một câu cụ thể:
```bash
python visualize.py --model results/model_Transformer_d64_ff128.pt --sentence "the movie is completely amazing"
```

## 4. Kết quả thực nghiệm
Dưới đây là tóm tắt kết quả so sánh giữa các mô hình:

| Mô hình | Train Acc | Val Acc | Test Acc |
| :--- | :---: | :---: | :---: |
| **Transformer (d=64, ff=128)** | **99.05%** | **95.56%** | **97.78%** |
| Transformer (d=128, ff=256) | 99.76% | 96.67% | 97.78% |
| Transformer (d=32, ff=64) | 91.67% | 88.89% | 84.44% |
| MLP Baseline (d=64) | 87.62% | 76.67% | 81.11% |

**Nhận xét:** Kiến trúc Transformer cho thấy sự vượt trội rõ rệt so với Baseline MLP, đặc biệt là khả năng học các mối quan hệ ngữ cảnh thông qua cơ chế Self-Attention.
