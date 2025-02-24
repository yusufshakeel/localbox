import type {NextApiRequest, NextApiResponse} from 'next';
import {HttpMethod} from '@/types/api';
import {hasAdminApiPrivileges} from '@/services/api-service';
import {db, PagesCollectionName} from '@/configs/database/pages';
import {Op} from 'minivium';

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  let whereClause: any = {};
  if (req.query.pageFor?.length) {
    whereClause = {
      where: {
        pageFor: {[Op.in]: (req.query.pageFor as string).split(',')}
      }
    };
  }

  const attributes = ['id', 'link', 'title', 'type', 'status', 'pageFor', 'permissions', 'createdAt', 'updatedAt'];
  const pages = await db.query.selectAsync(PagesCollectionName, {
    ...whereClause,
    attributes,
    orderBy: [
      { attribute: 'title' }
    ]
  });
  return res.status(200).json({pages});
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const allowedMethods = [HttpMethod.GET];
    const session = await hasAdminApiPrivileges(req, res, { allowedMethods });
    if (!session) {
      return;
    }

    if (req.method === HttpMethod.GET) {
      return await getHandler(req, res);
    }

    return res.status(400).json({ error: 'No handler' });
  } catch (error: any) {
    return res.status(500).json({message: error.message});
  }
}