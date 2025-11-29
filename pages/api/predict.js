import nextConnect from "next-connect";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { getEmbedding } from "../../../utils/embed";
import { findMostSimilar } from "../../../utils/similarity";

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = multer({ storage: multer.memoryStorage() });

const handler = nextConnect();
handler.use(upload.single("file"));

handler.post(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // resize image ke 224x224
  const buffer = await sharp(req.file.buffer)
    .resize(224, 224)
    .toBuffer();

  // get embedding
  const queryEmbedding = await getEmbedding(buffer);

  // load dataset embeddings
  const datasetPath = path.join(process.cwd(), "dataset");
  const folders = fs.readdirSync(datasetPath);

  let bestMatch = null;

  for (const folder of folders) {
    const folderPath = path.join(datasetPath, folder);
    const files = fs.readdirSync(folderPath);

    for (const file of files) {
      const imgBuffer = fs.readFileSync(path.join(folderPath, file));
      const emb = await getEmbedding(imgBuffer);

      const score = findMostSimilar(queryEmbedding, emb);

      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { model: folder, score };
      }
    }
  }

  res.json(bestMatch || { model: "Unknown", score: 0 });
});

export default handler;
