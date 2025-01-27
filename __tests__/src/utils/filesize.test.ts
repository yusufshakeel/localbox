import {humanReadableFileSize} from '@/utils/filesize';

describe('Testing file size', () => {
  describe('humanReadableFileSize', () => {
    it('should return 0 Bytes', () => {
      expect(humanReadableFileSize(0)).toBe('0 Bytes');
    });

    it('should return 1 Byte', () => {
      expect(humanReadableFileSize(1)).toBe('1 Byte');
    });

    it('should return N Bytes', () => {
      expect(humanReadableFileSize(999)).toBe('999 Bytes');
    });

    it('should return N KB', () => {
      expect(humanReadableFileSize(1000)).toBe('1 KB');
      expect(humanReadableFileSize(1999)).toBe('1.999 KB');
    });

    it('should return N MB', () => {
      expect(humanReadableFileSize(Math.pow(1000, 2))).toBe('1 MB');
      expect(humanReadableFileSize(Math.pow(1000, 2) + 1000)).toBe('1.001 MB');
    });

    it('should return N GB', () => {
      expect(humanReadableFileSize(Math.pow(1000, 3))).toBe('1 GB');
      expect(humanReadableFileSize(Math.pow(1000, 3) + 1e6)).toBe('1.001 GB');
    });

    it('should return N TB', () => {
      expect(humanReadableFileSize(Math.pow(1000, 4))).toBe('1 TB');
      expect(humanReadableFileSize(Math.pow(1000, 4) + 1e9)).toBe('1.001 TB');
    });
  });
});