import type {NextApiRequest, NextApiResponse} from 'next';
import {HttpMethod} from '@/types/api';
import {hasAdminApiPrivileges} from '@/services/api-service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const allowedMethods = [
      HttpMethod.POST
    ];
    const session = await hasAdminApiPrivileges(req, res, {allowedMethods});
    if (!session) {
      return;
    }
  } catch (error: any) {
    return res.status(500).json({message: error.message});
  }
}