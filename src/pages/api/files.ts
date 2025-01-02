import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import {FilesApiResponse} from '@/types/api-responses';
import {PublicFolders} from '@/configs/folders';

export default function handler(req: NextApiRequest, res: NextApiResponse<FilesApiResponse>) {
  try {
    const allowedFolders = [
      PublicFolders.uploads,
      PublicFolders.audios,
      PublicFolders.videos,
      PublicFolders.images,
      PublicFolders.documents
    ];
    if (!allowedFolders.includes(req.query?.dir as PublicFolders || '')) {
      return res.status(400).json({ error: 'Bad request', message: 'Invalid dir' });
    }

    const folderPath = path.join(process.cwd(), `public/${req.query.dir}`); // Replace with your folder path
    const files = fs.readdirSync(folderPath); // Get the list of files
    const filteredFiles = req.query.sort === 'DESC'
      ? files.filter(f => f[0] !== '.').sort((a, b) => b.localeCompare(a))
      : files.filter(f => f[0] !== '.').sort((a, b) => a.localeCompare(b));

    res.status(200).json({ files: filteredFiles });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to list files', message: error.message });
  }
}
