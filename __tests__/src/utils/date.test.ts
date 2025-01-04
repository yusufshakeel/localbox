import {formatDate, getISOStringDate} from '@/utils/date';

describe('Testing date util', () => {
  describe('Testing format date', () => {
    it('Should be able to format date', () => {
      expect(formatDate(1734261142000)).toBe('15 Dec 2024 04:42:22 pm');
    });
  });

  describe('getISOStringDate', () => {
    it('should be able to get current date', () => {
      // Mock the Date object
      const mockDate = new Date('2025-01-01T00:00:00.000Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as unknown as Date);

      // Assert the expected value
      expect(getISOStringDate()).toBe('2025-01-01T00:00:00.000Z');

      // Restore the original Date implementation
      jest.restoreAllMocks();
    });
  });
});