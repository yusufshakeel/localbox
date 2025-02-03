import {formatDate, getEpochTimestampInMilliseconds, getISOStringDate} from '@/utils/date';

describe('Testing date util', () => {
  describe('Testing format date', () => {
    it('Should be able to format date', () => {
      expect(formatDate(1734261142000)).toBe('15 Dec 2024 04:42:22 pm');
      expect(formatDate('1734261142000')).toBe('15 Dec 2024 04:42:22 pm');
      expect(formatDate('2024-12-15T11:12:22.000Z')).toBe('15 Dec 2024 04:42:22 pm');
    });

    it('Should return empty string when timestamp is invalid', () => {
      expect(formatDate('haha')).toBe('');
      expect(formatDate('')).toBe('');
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

    it('should return ISO string date from the passed date', () => {
      expect(getISOStringDate('2025-01-01T12:34:56')).toBe('2025-01-01T07:04:56.000Z');
      expect(getISOStringDate(1735734896000)).toBe('2025-01-01T12:34:56.000Z');
    });
  });

  describe('getEpochTimestampInMilliseconds', () => {
    it('should be able to get epoch timestamp in milliseconds', () => {
      expect(getEpochTimestampInMilliseconds('2025-01-01T12:34:56Z')).toBe(1735734896000);
    });
  });
});