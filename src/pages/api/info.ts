import { NextApiRequest, NextApiResponse } from 'next';
import packageJson from '../../../package.json';
import {InfoApiResponse} from '@/types/api-responses';

export default function handler(req: NextApiRequest, res: NextApiResponse<InfoApiResponse>) {
  const { name, version, description, license, author, homepage, licensePage } = packageJson;
  res.status(200).json({ name, version, description, license, author, homepage, licensePage });
}
