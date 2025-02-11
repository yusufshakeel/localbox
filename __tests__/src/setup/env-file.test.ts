import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { setupEnvFile } from '@/setup/env-file';

jest.mock('fs');
jest.mock('crypto');

const mockCwd = '/mocked/path';

describe('setupEnvFile', () => {
  let mockReadFileSync: jest.Mock;
  let mockWriteFileSync: jest.Mock;
  let mockRandomBytes: jest.Mock;
  let envFilePath: string;

  beforeEach(() => {
    jest.spyOn(process, 'cwd').mockReturnValue(mockCwd);
    mockReadFileSync = fs.readFileSync as jest.Mock;
    mockWriteFileSync = fs.writeFileSync as jest.Mock;
    mockRandomBytes = crypto.randomBytes as jest.Mock;

    mockReadFileSync.mockReset();
    mockWriteFileSync.mockReset();
    mockRandomBytes.mockReset();

    mockRandomBytes.mockReturnValue(Buffer.from('mocked_random_secret'));
    envFilePath = path.join(mockCwd, '.env');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create a .env file if it does not exist', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    setupEnvFile();
    expect(mockWriteFileSync).toHaveBeenCalledWith(
      envFilePath,
      'AUTH_SECRET=bW9ja2VkX3JhbmRvbV9zZWNyZXQ=',
      'utf8'
    );
  });

  it('should update AUTH_SECRET if it already exists', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    mockReadFileSync.mockReturnValue('AUTH_SECRET=old_secret\nOTHER_KEY=value');
    setupEnvFile();
    expect(mockWriteFileSync).toHaveBeenCalledWith(
      envFilePath,
      'AUTH_SECRET=bW9ja2VkX3JhbmRvbV9zZWNyZXQ=\nOTHER_KEY=value',
      'utf8'
    );
  });

  it('should add AUTH_SECRET if not present', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    mockReadFileSync.mockReturnValue('OTHER_KEY=value');
    setupEnvFile();
    expect(mockWriteFileSync).toHaveBeenCalledWith(
      envFilePath,
      'OTHER_KEY=value\nAUTH_SECRET=bW9ja2VkX3JhbmRvbV9zZWNyZXQ=',
      'utf8'
    );
  });

  it('should not modify other environment variables', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    mockReadFileSync.mockReturnValue('EXISTING_KEY=some_value\nANOTHER_KEY=another_value');
    setupEnvFile();
    expect(mockWriteFileSync).toHaveBeenCalledWith(
      envFilePath,
      'EXISTING_KEY=some_value\nANOTHER_KEY=another_value\nAUTH_SECRET=bW9ja2VkX3JhbmRvbV9zZWNyZXQ=',
      'utf8'
    );
  });

  it('should return the correct env file path', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    const result = setupEnvFile();
    expect(result).toEqual({ envFilePath });
  });
});
