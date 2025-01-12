import {getFilename, getTimestampFromFilename, getUsernameFromFilename} from '@/utils/filename';

describe('Testing filename util', () => {
  describe('Testing getFilename', () => {
    describe('When filename starts with epoch timestamp', () => {
      it('Should remove the epoch timestamp and return the rest of the filename', () => {
        expect(getFilename('1733659240385-hello-world.txt')).toBe('hello-world.txt');
      });
    });

    describe('When filename starts with ISO timestamp', () => {
      it('Should remove the ISO timestamp and return the rest of the filename', () => {
        expect(getFilename('2024-12-08T12:01:42.922Z-hello-world.txt')).toBe('hello-world.txt');
      });
    });

    describe('When filename contains timestamp and username', () => {
      it('Should return the filename', () => {
        expect(getFilename('2024-12-08T12:01:42.922Z-__username__-hello-world.txt')).toBe('hello-world.txt');
      });
    });

    describe('When filename starts with something else', () => {
      it('Should return the filename as is', () => {
        expect(getFilename('hello-world.txt')).toBe('hello-world.txt');
      });
    });
  });

  describe('Testing getUsernameFromFilename', () => {
    describe('When filename starts with epoch timestamp and does not contain username', () => {
      it('Should return empty string', () => {
        expect(getUsernameFromFilename('1733659240385-hello-world.txt')).toBe('');
      });
    });

    describe('When filename starts with ISO timestamp and does not contain username', () => {
      it('Should return empty string', () => {
        expect(getUsernameFromFilename('2024-12-08T12:01:42.922Z-hello-world.txt')).toBe('');
      });
    });

    describe('When filename contains timestamp and username', () => {
      it('Should return the username', () => {
        expect(getUsernameFromFilename('2024-12-08T12:01:42.922Z-__username__-hello-world.txt')).toBe('username');
      });
    });

    describe('When filename starts with something else', () => {
      it('Should return empty string', () => {
        expect(getUsernameFromFilename('hello-world.txt')).toBe('');
      });
    });
  });

  describe('Testing getTimestampFromFilename', () => {
    describe('When filename starts with epoch timestamp', () => {
      it('should return the timestamp', () => {
        expect(getTimestampFromFilename('1733659240385-hello-world.txt')).toBe('1733659240385');
      });
    });

    describe('When filename starts with ISO timestamp', () => {
      it('should return the ISO timestamp', () => {
        expect(getTimestampFromFilename('2024-12-08T12:01:42.922Z-hello-world.txt')).toBe('2024-12-08T12:01:42.922Z');
      });
    });

    describe('When filename starts with something else', () => {
      it('should return empty string', () => {
        expect(getTimestampFromFilename('hello-world.txt')).toBe('');
      });
    });
  });
});