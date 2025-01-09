import { NextApiRequest, NextApiResponse } from 'next';
import packageJson from '../../../package.json';
import {InfoApiResponse} from '@/types/api-responses';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<InfoApiResponse | {error: string, message: string}>
) {
  try {
    const { name, version, description, license, author, homepage, licensePage } = packageJson;
    res.status(200).json({ name, version, description, license, author, homepage, licensePage });
  } catch (error: any) {
    res.status(500).json({ error: 'Something went wrong', message: error.message });
  }
}
