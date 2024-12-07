import { NextApiRequest, NextApiResponse } from 'next';
import packageJson from '../../../package.json';

export type InfoType = {
  name: string,
  version: string,
  description: string,
  license: string,
  author: string,
  homepage: string,
  licensePage: string
};

export default function handler(req: NextApiRequest, res: NextApiResponse<InfoType>) {
  const { name, version, description, license, author, homepage, licensePage } = packageJson;
  res.status(200).json({ name, version, description, license, author, homepage, licensePage });
}
