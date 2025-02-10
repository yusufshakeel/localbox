import { handleDownload, handlePersonalDriveDownload } from '@/utils/download';

describe('download', () => {
  describe('handleDownload', () => {
    beforeEach(() => {
      jest.spyOn(document, 'createElement').mockImplementation(() => {
        return { click: jest.fn() } as unknown as HTMLAnchorElement;
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test('should create and trigger a download link for given directory and filename', () => {
      const createElementSpy = jest.spyOn(document, 'createElement');
      const linkMock = { click: jest.fn(), href: '', download: '' } as unknown as HTMLAnchorElement;
      createElementSpy.mockReturnValue(linkMock);

      handleDownload('testDir', 'testFile.txt');

      expect(linkMock.href).toBe('/api/files?downloadFilename=testFile.txt&dir=testDir');
      expect(linkMock.click).toHaveBeenCalled();
    });
  });

  describe('handlePersonalDriveDownload', () => {
    beforeEach(() => {
      jest.spyOn(document, 'createElement').mockImplementation(() => {
        return { click: jest.fn() } as unknown as HTMLAnchorElement;
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test('should create and trigger a download link for given filename in personal drive', () => {
      const createElementSpy = jest.spyOn(document, 'createElement');
      const linkMock = { click: jest.fn(), href: '', download: '' } as unknown as HTMLAnchorElement;
      createElementSpy.mockReturnValue(linkMock);

      handlePersonalDriveDownload('testFile.txt');

      expect(linkMock.href).toBe('/api/personal-drive?downloadFilename=testFile.txt');
      expect(linkMock.click).toHaveBeenCalled();
    });
  });
});