import type {NextApiRequest, NextApiResponse} from 'next';
import {HttpMethod} from '@/types/api';
import {hasAdminApiPrivileges} from '@/services/api-service';
import fs from 'fs/promises';
import path from 'path';

async function deleteHandler(req: NextApiRequest, res: NextApiResponse) {
  if (!req.body?.dir) {
    return res.status(400).json({ error: 'Bad request', message: 'dir is required' });
  }
  if (!req.body?.filename) {
    return res.status(400).json({ error: 'Bad request', message: 'fie is required' });
  }

  const filepath = path.join(process.cwd(), 'public', req.body.dir, req.body.filename);
  await fs.access(filepath);
  await fs.unlink(filepath);

  return res.status(200).json({ message: 'File deleted successfully.' });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const allowedMethods = [HttpMethod.DELETE];
    const session = await hasAdminApiPrivileges(req, res, { allowedMethods });
    if (!session) {
      return;
    }

    if (req.method === HttpMethod.DELETE) {
      return await deleteHandler(req, res);
    }

    return res.status(400).json({ error: 'No handler' });
  } catch (error: any) {
    return res.status(500).json({message: error.message});
  }
}