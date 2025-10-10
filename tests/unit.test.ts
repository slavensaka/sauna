import { dataFormatToJaggedMatrix, isApprovedChar } from '../src/index';

describe('Unit Tests', () => {

  describe('JaggedMatrix', () => {
    test('Convert array of strings to 2D array', () => {
      const map = [
        '  @--A--+',
        '        |',
        ' x-B-+--C ',
      ];
      const result = dataFormatToJaggedMatrix(map);
      expect(result).toEqual([
        [' ', ' ', '@', '-', '-', 'A', '-', '-', '+'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
        [' ', 'x', '-', 'B', '-', '+', '-', '-', 'C', ' '],
      ]);
    });
  });

  describe('isApprovedChar', () => {
    test('returns true for start character @', () => {
      expect(isApprovedChar('@')).toBe(true);
    });

    test('returns true for end character x', () => {
      expect(isApprovedChar('x')).toBe(true);
    });

    test('returns true for horizontal line -', () => {
      expect(isApprovedChar('-')).toBe(true);
    });

    test('returns true for vertical line |', () => {
      expect(isApprovedChar('|')).toBe(true);
    });

    test('returns true for intersection +', () => {
      expect(isApprovedChar('+')).toBe(true);
    });

    test('returns true for space', () => {
      expect(isApprovedChar(' ')).toBe(true);
    });

    test('returns true for uppercase letters', () => {
      expect(isApprovedChar('A')).toBe(true);
      expect(isApprovedChar('B')).toBe(true);
      expect(isApprovedChar('Z')).toBe(true);
    });

    test('returns false for lowercase letters', () => {
      expect(isApprovedChar('a')).toBe(false);
      expect(isApprovedChar('b')).toBe(false);
      expect(isApprovedChar('z')).toBe(false);
    });

    test('returns false for numbers', () => {
      expect(isApprovedChar('0')).toBe(false);
      expect(isApprovedChar('5')).toBe(false);
      expect(isApprovedChar('9')).toBe(false);
    });


    test('returns false for invalid special characters', () => {
      expect(isApprovedChar('!')).toBe(false);
      expect(isApprovedChar('#')).toBe(false);
      expect(isApprovedChar('$')).toBe(false);
      expect(isApprovedChar('*')).toBe(false);
    });
  });
});