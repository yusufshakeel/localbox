import type { NextApiRequest, NextApiResponse } from 'next';
import { readdir } from 'fs/promises';
import fs from 'fs/promises';
import path from 'path';
import {FilesApiResponse} from '@/types/api-responses';
import {PublicFolders} from '@/configs/folders';
import {HttpMethod} from '@/types/api';
import {hasApiPrivileges} from '@/services/api-service';
import {Pages} from '@/configs/pages';
import {UserType} from '@/types/users';
import {hasPermissions} from '@/utils/permissions';
import {PermissionsType} from '@/types/permissions';
import {getUsernameFromFilename} from '@/utils/filename';

async function deleteHandler(req: NextApiRequest, res: NextApiResponse, session: any) {
  if (!req.body?.dir) {
    return res.status(400).json({ error: 'Bad request', message: 'dir is required' });
  }
  if (!req.body?.filename) {
    return res.status(400).json({ error: 'Bad request', message: 'fie is required' });
  }

  if (session.user.type === UserType.user) {
    const page = Pages[req.body.dir as keyof typeof Pages].id;
    const userHasPermissions = hasPermissions(
      session,
      [ `${page}:${PermissionsType.AUTHORIZED_USE}` ]
    );

    if (!userHasPermissions) {
      return res.status(400).json({
        error: 'Bad request', message: 'You do not have permissions to delete files'
      });
    }

    if (getUsernameFromFilename(req.body?.filename) !== session.user.username) {
      return res.status(400).json({
        error: 'Bad request', message: 'You do not have permissions to delete this file'
      });
    }
  }

  const filepath = path.join(process.cwd(), 'public', req.body.dir, req.body.filename);
  await fs.access(filepath);
  await fs.unlink(filepath);

  return res.status(200).json({ message: 'File deleted successfully.' });
}

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
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

  return res.status(200).json({ files: filteredFiles });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<FilesApiResponse>) {
  try {
    const allowedMethods = [HttpMethod.GET, HttpMethod.DELETE];
    const session = await hasApiPrivileges(req, res, {
      allowedMethods,
      permissions: [
        ...Pages.uploads.permissions,
        ...Pages.audios.permissions,
        ...Pages.videos.permissions,
        ...Pages.images.permissions,
        ...Pages.documents.permissions
      ]
    });
    if (!session) {
      return;
    }

    if (req.method === HttpMethod.GET) {
      return await getHandler(req, res);
    }

    if (req.method === HttpMethod.DELETE) {
      return await deleteHandler(req, res, session);
    }
  } catch (error: any) {
    res.status(500).json({ error: 'Something went wrong', message: error.message });
  }
}
