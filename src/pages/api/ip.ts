import type { NextApiRequest, NextApiResponse } from 'next';
import os from 'os';
import {findIps} from '@/utils/ip';

type Data = {
    ip: string;
};

function getLocalIpAddress() {
  const networkInterfaces = os.networkInterfaces();
  return findIps(networkInterfaces)[0];
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const localIp = getLocalIpAddress();
  res.status(200).json({ ip: localIp || 'IP not found' });
}
