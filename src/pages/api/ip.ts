import type { NextApiRequest, NextApiResponse } from 'next';
import os from 'os';
import {findIps} from '@/utils/ip';
import {IpApiResponse} from '@/types/api-responses';

function getLocalIpAddress() {
  const networkInterfaces = os.networkInterfaces();
  return findIps(networkInterfaces)[0];
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<IpApiResponse | {error: string, message: string}>
) {
  try {
    const localIp = getLocalIpAddress();
    res.status(200).json({ip: localIp || 'IP not found'});
  } catch (error: any) {
    res.status(500).json({ error: 'Something went wrong', message: error.message });
  }
}
