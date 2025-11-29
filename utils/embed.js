import ort from "onnxruntime-node";
import sharp from "sharp";
import path from "path";

let session = null;

export async function getEmbedding(buffer) {
  if (!session) {
    const modelPath = path.join(process.cwd(), "model", "mini-model.onnx");
    session = await ort.InferenceSession.create(modelPath);
  }

  const img = await sharp(buffer)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const tensor = new ort.Tensor("float32", new Float32Array(img.data), [
    1,
    img.info.channels,
    img.info.height,
    img.info.width,
  ]);

  const result = await session.run({ input: tensor });
  return result.output.data;
}
