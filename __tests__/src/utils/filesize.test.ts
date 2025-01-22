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
      expect(humanReadableFileSize(1000000)).toBe('1 MB');
      expect(humanReadableFileSize(1999000)).toBe('1.999 MB');
    });

    it('should return N GB', () => {
      expect(humanReadableFileSize(1000000000)).toBe('1 GB');
      expect(humanReadableFileSize(1999000000)).toBe('1.999 GB');
    });

    it('should return N TB', () => {
      expect(humanReadableFileSize(1000000000000)).toBe('1 TB');
      expect(humanReadableFileSize(1999000000000)).toBe('1.999 TB');
    });
  });
});