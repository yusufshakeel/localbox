import type { NextApiRequest, NextApiResponse } from 'next';
import { readdir } from 'fs/promises';
import path from 'path';
import {FilesApiResponse} from '@/types/api-responses';
import {PublicFolders} from '@/configs/folders';
import {HttpMethod} from '@/types/api';
import {hasApiPrivileges} from '@/services/api-service';
import {Pages} from '@/configs/pages';

export default async function handler(req: NextApiRequest, res: NextApiResponse<FilesApiResponse>) {
  try {
    const allowedMethods = [HttpMethod.GET];
    const hasPrivileges = await hasApiPrivileges(req, res, {
      allowedMethods,
      permissions: [
        ...Pages.uploads.permissions,
        ...Pages.audios.permissions,
        ...Pages.videos.permissions,
        ...Pages.images.permissions,
        ...Pages.documents.permissions
      ]
    });
    if (!hasPrivileges) {
      return;
    }

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
    const files = await readdir(folderPath); // Get the list of files
    const filteredFiles = req.query.sort === 'DESC'
      ? files.filter(f => f[0] !== '.').sort((a, b) => b.localeCompare(a))
      : files.filter(f => f[0] !== '.').sort((a, b) => a.localeCompare(b));

    res.status(200).json({ files: filteredFiles });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to list files', message: error.message });
  }
}
