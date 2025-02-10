import { loginSchema } from '@/validations/login-validation';

describe('loginSchema', () => {
  it('should pass with valid username and password', () => {
    const validData = { username: 'user123', password: 'securePass123' };
    const result = loginSchema.safeParse(validData);
    expect(result.success).toBeTruthy();
  });

  it('should fail when username is missing', () => {
    const invalidData = { password: 'securePass123' };
    const result = loginSchema.safeParse(invalidData);
    expect(result.success).toBeFalsy();
    expect(result.error!.format().username?._errors).toContain('Username is required');
  });

  it('should fail when password is missing', () => {
    const invalidData = { username: 'user123' };
    const result = loginSchema.safeParse(invalidData);
    expect(result.success).toBeFalsy();
    expect(result.error!.format().password?._errors).toContain('Password is required');
  });

  it('should fail when username is an empty string', () => {
    const invalidData = { username: '', password: 'securePass123' };
    const result = loginSchema.safeParse(invalidData);
    expect(result.success).toBeFalsy();
    expect(result.error!.format().username?._errors).toContain('Username is required');
  });

  it('should fail when password is an empty string', () => {
    const invalidData = { username: 'user123', password: '' };
    const result = loginSchema.safeParse(invalidData);
    expect(result.success).toBeFalsy();
    expect(result.error!.format().password?._errors).toContain('Password is required');
  });
});
