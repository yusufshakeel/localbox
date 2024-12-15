import {formatDate} from '@/utils/date';

describe('Testing date util', () => {
  describe('Testing format date', () => {
    it('Should be able to format date', () => {
      expect(formatDate(1734261142000)).toBe('15 Dec 2024 04:42:22 pm');
    });
  });
});