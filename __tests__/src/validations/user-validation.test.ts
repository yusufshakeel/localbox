import {
  userCreateSchema,
  userUpdateSchema,
  userUpdatePasswordSchema,
  userUpdatePermissionsSchema,
  userUpdateProfileDetailsSchema
} from '@/validations/user-validation';

describe('user validation', () => {
  describe('userCreateSchema', () => {
    it('should pass with valid username, displayName, and password', () => {
      const validData = {
        username: 'validUser123',
        displayName: 'Valid Name',
        password: 'Password1234'
      };
      const result = userCreateSchema.safeParse(validData);
      expect(result.success).toBeTruthy();
    });

    it('should fail when username is missing', () => {
      const invalidData = {
        displayName: 'Valid Name',
        password: 'Secure123'
      };
      const result = userCreateSchema.safeParse(invalidData);
      expect(result.success).toBeFalsy();
      expect(result.error!.format().username?._errors).toContain('Username is required');
    });

    it('should fail when username is less than minimum chars', () => {
      const invalidData = {
        username: 'ab',
        displayName: 'Valid Name',
        password: 'Secure123'
      };
      const result = userCreateSchema.safeParse(invalidData);
      expect(result.success).toBeFalsy();
      expect(result.error!.format().username?._errors).toContain('Username must have at least 3 characters');
    });

    it('should fail when username is more than maximum chars', () => {
      const invalidData = {
        username: 'helloWorldHowAreYouToday',
        displayName: 'Valid Name',
        password: 'Secure123'
      };
      const result = userCreateSchema.safeParse(invalidData);
      expect(result.success).toBeFalsy();
      expect(result.error!.format().username?._errors).toContain('Username cannot have more than 20 characters');
    });

    it('should fail when username has invalid char', () => {
      const invalidData = {
        username: 'helloWorld1234?',
        displayName: 'Valid Name',
        password: 'Secure123'
      };
      const result = userCreateSchema.safeParse(invalidData);
      expect(result.success).toBeFalsy();
      expect(result.error!.format().username?._errors).toContain('Username must be alphanumeric');
    });

    it('should fail when displayName is missing', () => {
      const invalidData = {
        username: 'validUser123',
        password: 'Secure123'
      };
      const result = userCreateSchema.safeParse(invalidData);
      expect(result.success).toBeFalsy();
      expect(result.error!.format().displayName?._errors).toContain('Display name is required');
    });

    it('should fail when displayName is more than maximum chars', () => {
      const invalidData = {
        username: 'validUser123',
        password: 'Secure123',
        displayName: 'Hello World How Are You Today'
      };
      const result = userCreateSchema.safeParse(invalidData);
      expect(result.success).toBeFalsy();
      expect(result.error!.format().displayName?._errors).toContain('Display name cannot have more than 20 characters');
    });

    it('should fail when displayName has invalid char', () => {
      const invalidData = {
        username: 'validUser123',
        password: 'Secure123',
        displayName: 'Hello World 1234 !!!'
      };
      const result = userCreateSchema.safeParse(invalidData);
      expect(result.success).toBeFalsy();
      expect(result.error!.format().displayName?._errors).toContain('Display name must be alphanumeric');
    });

    it('should fail when password is missing', () => {
      const invalidData = {
        username: 'validUser123',
        displayName: 'Valid Name'
      };
      const result = userCreateSchema.safeParse(invalidData);
      expect(result.success).toBeFalsy();
      expect(result.error!.format().password?._errors).toContain('Password is required');
    });

    it('should fail when password is less than minimum chars', () => {
      const invalidData = {
        username: 'validUser123',
        displayName: 'Valid Name',
        password: 'Secure123'
      };
      const result = userCreateSchema.safeParse(invalidData);
      expect(result.success).toBeFalsy();
      expect(result.error!.format().password?._errors).toContain('Password must have at least 12 characters');
    });

    it('should fail when password is more than maximum chars', () => {
      const invalidData = {
        username: 'validUser123',
        displayName: 'Valid Name',
        password: 'SecurePassword1234567890abcdefghijklmnopqrstuvwxyz'
      };
      const result = userCreateSchema.safeParse(invalidData);
      expect(result.success).toBeFalsy();
      expect(result.error!.format().password?._errors).toContain('Password cannot have more than 32 characters');
    });

    it('should fail when password does not contain letters', () => {
      const invalidData = {
        username: 'validUser123',
        displayName: 'Valid Name',
        password: '12345678901234567890'
      };
      const result = userCreateSchema.safeParse(invalidData);
      expect(result.success).toBeFalsy();
      expect(result.error!.format().password?._errors).toContain('Password must contain at least one letter a-z A-Z');
    });

    it('should fail when password does not contain digits', () => {
      const invalidData = {
        username: 'validUser123',
        displayName: 'Valid Name',
        password: 'SecurePassword'
      };
      const result = userCreateSchema.safeParse(invalidData);
      expect(result.success).toBeFalsy();
      expect(result.error!.format().password?._errors).toContain('Password must contain at least one digit 0-9');
    });
  });

  describe('userUpdateSchema', () => {
    it('should pass with valid username, displayName, and status', () => {
      const validData = {
        username: 'validUser123',
        displayName: 'Valid Name',
        status: 'active'
      };
      const result = userUpdateSchema.safeParse(validData);
      expect(result.success).toBeTruthy();
    });

    it('should fail when personal drive storage limit is not string', () => {
      const validData = {
        username: 'validUser123',
        displayName: 'Valid Name',
        status: 'active',
        personalDriveStorageLimit: 1
      };
      const result = userUpdateSchema.safeParse(validData);
      expect(result.success).toBeFalsy();
      expect(result.error!.format().personalDriveStorageLimit?._errors).toContain('Expected string, received number');
    });

    it('should fail when personal drive storage limit is an empty string', () => {
      const validData = {
        username: 'validUser123',
        displayName: 'Valid Name',
        status: 'active',
        personalDriveStorageLimit: ''
      };
      const result = userUpdateSchema.safeParse(validData);
      expect(result.success).toBeFalsy();
      expect(result.error!.format().personalDriveStorageLimit?._errors).toContain('Personal Drive storage limit is required');
    });

    it('should fail when personal drive storage limit consists of chars other than digits', () => {
      const validData = {
        username: 'validUser123',
        displayName: 'Valid Name',
        status: 'active',
        personalDriveStorageLimit: '1234mb'
      };
      const result = userUpdateSchema.safeParse(validData);
      expect(result.success).toBeFalsy();
      expect(result.error!.format().personalDriveStorageLimit?._errors).toContain('Personal Drive storage limit must be a whole number');
    });
  });

  describe('userUpdatePasswordSchema', () => {
    it('should pass with valid password', () => {
      const validData = { password: 'Secure123456' };
      const result = userUpdatePasswordSchema.safeParse(validData);
      expect(result.success).toBeTruthy();
    });
  });

  describe('userUpdatePermissionsSchema', () => {
    it('should pass with valid permissions array', () => {
      const validData = { permissions: ['read', 'write'] };
      const result = userUpdatePermissionsSchema.safeParse(validData);
      expect(result.success).toBeTruthy();
    });
  });

  describe('userUpdateProfileDetailsSchema', () => {
    it('should pass with valid displayName', () => {
      const validData = { displayName: 'Valid Name' };
      const result = userUpdateProfileDetailsSchema.safeParse(validData);
      expect(result.success).toBeTruthy();
    });
  });
});