import { NextApiRequest, NextApiResponse } from 'next';
import packageJson from '../../../package.json';
import {InfoType} from '@/types/info-type';

export default function handler(req: NextApiRequest, res: NextApiResponse<InfoType>) {
  const { name, version, description, license, author, homepage, licensePage } = packageJson;
  res.status(200).json({ name, version, description, license, author, homepage, licensePage });
}
