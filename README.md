# Jamrud Finder v1

Cara pakai:

1. Isi folder /dataset dengan contoh foto tiap model:
   dataset/WF201/1.jpg
   dataset/WF203/1.jpg
   dst.

2. Ganti /model/mini-model.onnx dengan model ONNX beneran.

3. Jalankan lokal:
   npm install
   npm run dev

4. Deploy ke Vercel.

API endpoint:
  POST /api/predict
