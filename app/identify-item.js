import vision from '@google-cloud/vision';
import fs from 'fs';
import path from 'path';

const client = new vision.ImageAnnotatorClient();

export default async function handler(req, res) {
  const { imageBlob } = req.body;

  // Save the image blob to a temporary file
  const tempFilePath = path.join(process.cwd(), 'temp.jpg');
  await fs.promises.writeFile(tempFilePath, Buffer.from(imageBlob.split(',')[1], 'base64'));

  const identifyItems = async (imageFile) => {
    const [result] = await client.objectLocalization(imageFile);
    const objects = result.localizedObjectAnnotations;

    const items = objects.map(object => ({
      name: object.name,
      category: object.product?.category || 'Unknown',
      score: object.score
    }));

    return items;
  };

  const items = await identifyItems(tempFilePath);

  // Delete the temporary file
  await fs.promises.unlink(tempFilePath);

  res.status(200).json(items);
}
