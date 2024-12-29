import jwt from 'jsonwebtoken';
import {
  ACCESS_TOKEN_TTL_IN_MILLISECONDS,
  JWT_SECRET,
  REFRESH_TOKEN_TTL_IN_MILLISECONDS
} from '@/configs/auth';

export const generateAccessToken = (payload: any) => {
  return jwt.sign(
    payload,
    JWT_SECRET as string,
    { expiresIn: ACCESS_TOKEN_TTL_IN_MILLISECONDS / 1000 }
  );
};

export const generateRefreshToken = (payload: any) => {
  return jwt.sign(
    payload,
    JWT_SECRET as string,
    { expiresIn: REFRESH_TOKEN_TTL_IN_MILLISECONDS / 1000 }
  );
};

export const verifyToken = (token: any) => {
  try {
    return jwt.verify(token, JWT_SECRET as string);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: any) {
    return null;
  }
};

export const verifyAuthorizationBearerToken = (req: any) => {
  if (!req.headers?.authorization) {
    return { statusCode: 400, message: 'Authorization token is missing' };
  }

  const payload: any = verifyToken(req.headers.authorization.split('Bearer ')[1]);
  if (!payload) {
    return { statusCode: 400, message: 'Invalid access token' };
  }

  return { statusCode: 200, payload };
};
