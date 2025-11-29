import nextConnect from "next-connect";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { getEmbedding } from "../../utils/embed";
import { findMostSimilar } from "../../utils/similarity";

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = multer({ storage: multer.memoryStorage() });

const handler = nextConnect();
handler.use(upload.single("file"));

handler.post(async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Resize ke 224x224 (format ML)
    const buffer = await sharp(req.file.buffer)
      .resize(224, 224)
      .toBuffer();

    // Generate embedding input
    const queryEmbedding = await getEmbedding(buffer);

    // Path dataset
    const datasetPath = path.join(process.cwd(), "dataset");
    const folders = fs.readdirSync(datasetPath);

    let bestMatch = null;

    for (const folder of folders) {
      const folderPath = path.join(datasetPath, folder);
      const files = fs.readdirSync(folderPath);

      for (const file of files) {
        const filePath = path.join(folderPath, file);
        if (!/\.(jpg|jpeg|png)$/i.test(file)) continue;

        const imgBuffer = fs.readFileSync(filePath);
        const emb = await getEmbedding(imgBuffer);

        const score = findMostSimilar(queryEmbedding, emb);

        if (!bestMatch || score > bestMatch.score) {
          bestMatch = { model: folder, score };
        }
      }
    }

    res.json(bestMatch || { model: "Unknown", score: 0 });
  } catch (err) {
    console.error("Error in /api/predict:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default handler;
