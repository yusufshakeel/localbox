import {getFilename} from '@/utils/filename';

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

    describe('When filename starts with something else', () => {
      it('Should return the filename as is', () => {
        expect(getFilename('hello-world.txt')).toBe('hello-world.txt');
      });
    });
  });
});