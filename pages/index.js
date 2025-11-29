import { useState } from "react";

export default function Home() {
  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    setImagePreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/predict", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>Jamrud Finder v1 👞💚</h1>
      <p>Upload foto untuk cek model terdekat.</p>

      <input type="file" onChange={handleUpload} />

      {imagePreview && (
        <div style={{ marginTop: 20 }}>
          <img src={imagePreview} width="200" />
        </div>
      )}

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>Prediksi: {result.model}</h3>
          <p>Skor: {result.score}</p>
        </div>
      )}
    </div>
  );
}
