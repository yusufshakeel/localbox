import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import path from 'path';
import { promisify } from 'util';
import fs from 'fs';

// Create the uploads folder if it doesn't exist
const uploadsFolder = path.join(process.cwd(), 'public/uploads');
if (!fs.existsSync(uploadsFolder)) {
  fs.mkdirSync(uploadsFolder, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsFolder,
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname.replace(/[^a-z0-9.]|\s+/gmi, '-').replace(/-{2,}/gmi,'-')}`);
    }
  })
}).single('file');

const uploadMiddleware = promisify(upload);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      await uploadMiddleware(req as any, res as any);
      return res.status(200).json({ message: 'File uploaded successfully' });
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
