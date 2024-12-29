import {
  generateAccessToken,
  generateRefreshToken,
  verifyAuthorizationBearerToken,
  verifyToken
} from '@/services/jwt-service';

describe('Testing JWT service', () => {
  describe('generateAccessToken', () => {
    it('Should be able to generate access token', () => {
      const result = generateAccessToken({username: 'admin'});
      expect(result).not.toBeNull();
    });
  });

  describe('generateRefreshToken', () => {
    it('Should be able to generate refresh token', () => {
      const result = generateRefreshToken({username: 'admin'});
      expect(result).not.toBeNull();
    });
  });

  describe('verifyToken', () => {
    it('Should be able to verify access token', () => {
      const token = generateAccessToken({username: 'admin'});
      const result:any = verifyToken(token);
      expect(result.username).toBe('admin');
    });

    it('Should return null for invalid token', () => {
      const result:any = verifyToken('');
      expect(result).toBeNull();
    });
  });

  describe('verifyAuthorizationBearerToken', () => {
    it('should return 400 if authorization is missing', () => {
      expect(verifyAuthorizationBearerToken({})).toStrictEqual({
        statusCode: 400,
        message: 'Authorization token is missing'
      });
    });

    it('should return 400 if authorization is missing', () => {
      expect(verifyAuthorizationBearerToken({
        headers: {
          authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE5NDA4M2NmMTQ3In0.BJWRGDTesv9SX_D-NDP2vz2tiJQrEbIn2wiR-6sY5Mk'
        }
      })).toStrictEqual({
        statusCode: 400,
        message: 'Invalid access token'
      });
    });

    it('should return 400 if authorization is missing', () => {
      const token = generateAccessToken({username: 'admin'});
      expect(verifyAuthorizationBearerToken({
        headers: {
          authorization: `Bearer ${token}`
        }
      })).toStrictEqual({
        statusCode: 200,
        payload: expect.any(Object)
      });
    });
  });
});