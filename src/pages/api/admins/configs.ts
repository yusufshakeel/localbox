import type {NextApiRequest, NextApiResponse} from 'next';
import {HttpMethod} from '@/types/api';
import {hasAdminApiPrivileges} from '@/services/api-service';
import {db, ConfigsCollectionName} from '@/configs/database/configs';

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const attributes = ['id', 'key', 'value'];
  const configs = await db.query.selectAsync(ConfigsCollectionName, {
    attributes,
    orderBy: [
      { attribute: 'key' }
    ]
  });
  return res.status(200).json({configs});
}

async function patchHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const where = { id: req.body.id };
  const configExists = await db.query.selectAsync(ConfigsCollectionName, {
    where
  });
  const config = configExists[0];

  const dataToUpdate = {
    ...config,
    value: req.body.value
  };

  const updatedRows = await db.query.updateAsync(ConfigsCollectionName, dataToUpdate, {where});

  if (updatedRows) {
    return res.status(200).json({id: req.body.id});
  }
  return res.status(401).json({ error: 'Failed to update config' });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const allowedMethods = [HttpMethod.GET, HttpMethod.PATCH];
    const session = await hasAdminApiPrivileges(req, res, { allowedMethods });
    if (!session) {
      return;
    }

    if (req.method === HttpMethod.GET) {
      return await getHandler(req, res);
    }

    if (req.method === HttpMethod.PATCH) {
      return await patchHandler(req, res);
    }
  } catch (error: any) {
    return res.status(500).json({message: error.message});
  }
}