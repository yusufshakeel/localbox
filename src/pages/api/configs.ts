import { NextApiRequest, NextApiResponse } from 'next';
import {HttpMethod} from '@/types/api';
import {hasApiPrivileges} from '@/services/api-service';
import {Pages} from '@/configs/pages';
import {ConfigsCollectionName, db} from '@/configs/database/configs';

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const allowedKeys = [
    'FILE_UPLOAD_MAX_SIZE_IN_BYTES'
  ];

  const where: any = {};
  if (allowedKeys.includes(req.query.key as string)) {
    where['key'] = req.query.key;
  }

  const attributes = ['key', 'value'];

  const configs = await db.query.selectAsync(ConfigsCollectionName, {
    where,
    attributes,
    orderBy: [
      { attribute: 'key' }
    ]
  });

  return res.status(200).json({configs});
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const allowedMethods = [HttpMethod.GET];
    const session = await hasApiPrivileges(req, res, {
      allowedMethods, permissions: Pages.uploads.permissions
    });
    if (!session) {
      return;
    }

    if (req.method === HttpMethod.GET) {
      return await getHandler(req, res);
    }
  } catch (error: any) {
    return res.status(500).json({message: error.message});
  }
}