import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import path from 'path';
import { promisify } from 'util';
import fs from 'fs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const dir = req.query.dir || 'uploads';
      const allowedFolders = ['uploads', 'temp-chats'];
      if (!allowedFolders.includes(dir as string || '')) {
        return res.status(400).json({ error: 'Bad request', message: 'Invalid dir' });
      }

      // Create the uploads folder if it doesn't exist
      const uploadsFolder = path.join(process.cwd(), `public/${dir}`);
      if (!fs.existsSync(uploadsFolder)) {
        fs.mkdirSync(uploadsFolder, { recursive: true });
      }

      let uploadedFileName = '';

      const upload = multer({
        storage: multer.diskStorage({
          destination: uploadsFolder,
          filename: (req, file, cb) => {
            uploadedFileName = `${new Date().toISOString()}-${file.originalname.replace(/[^a-z0-9.]|\s+/gmi, '-').replace(/-{2,}/gmi,'-')}`
            cb(null, uploadedFileName);
          }
        })
      }).single('file');

      const uploadMiddleware = promisify(upload);

      await uploadMiddleware(req as any, res as any);
      return res.status(200).json({ message: 'File uploaded successfully', uploadedFileName });
    } catch (error: any) {
      return res.status(500).json({ error: 'Failed to upload file', message: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export const config = {
  api: {
    bodyParser: false // Disables Next.js's default body parser
  }
};
