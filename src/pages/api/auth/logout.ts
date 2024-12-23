import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'js-cookie';
import {AuthBaseResponse} from '@/types/api-responses';

export default function handler(req: NextApiRequest, res: NextApiResponse<AuthBaseResponse>) {
  Cookies.set('refresh_token', '', { secure: false, expires: new Date(0) });
  Cookies.set('access_token', '', { secure: false, expires: new Date(0) });
  return res.status(200).json({ message: 'Logged out' });
}