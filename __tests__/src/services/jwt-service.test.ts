import {generateAccessToken, generateRefreshToken, verifyToken} from '@/services/jwt-service';

describe('Testing JWT service', () => {
  it('Should be able to generate access token', () => {
    const result = generateAccessToken({username: 'admin'});
    expect(result).not.toBeNull();
  });

  it('Should be able to generate refresh token', () => {
    const result = generateRefreshToken({username: 'admin'});
    expect(result).not.toBeNull();
  });

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