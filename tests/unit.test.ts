import { dataFormatToJaggedMatrix } from '../src/jagged_matrix';
import {
  isApprovedChar,
  isIntersection,
  checkIfOnlyLetter,
  getCharacterAtPositionXY,
  okForDirection
} from '../src/map';
import { Direction, nextMove, getOppositeDirection } from '../src/vector';

/**
 * Unit tests for jagged_matrix.ts functions
 */
describe('JaggedMatrix Functions', () => {
  describe('dataFormatToJaggedMatrix', () => {
    // Converts string array to 2D character matrix
    test('converts array of strings to 2D matrix', () => {
      const map = ['  @--A--+', '        |', ' x-B-+  C'];
      const result = dataFormatToJaggedMatrix(map);

      expect(result.jaggedMatrix).toBeDefined();
      expect(result.jaggedMatrix.length).toBe(3);
      expect(result.jaggedMatrix[0]).toEqual([' ', ' ', '@', '-', '-', 'A', '-', '-', '+']);
    });

    // Finds '@' character position
    test('finds start position correctly', () => {
      const map = ['  @--A--+', '        |', ' x-B-+  C'];
      const result = dataFormatToJaggedMatrix(map);

      expect(result.startPosition).toEqual({ x: 2, y: 0 });
    });

    // Finds 'x' character position
    test('finds end position correctly', () => {
      const map = ['  @--A--+', '        |', ' x-B-+  C'];
      const result = dataFormatToJaggedMatrix(map);

      expect(result.endPosition).toEqual({ x: 1, y: 2 });
    });

    // Throws error when '@' is missing
    test('throws error when start character is missing', () => {
      const map = ['  ---A--+', '        |', ' x-B-+  C'];

      expect(() => dataFormatToJaggedMatrix(map)).toThrow('Start character');
    });

    // Throws error when 'x' is missing
    test('throws error when end character is missing', () => {
      const map = ['  @--A--+', '        |', '  -B-+  C'];

      expect(() => dataFormatToJaggedMatrix(map)).toThrow('End character');
    });

    // Throws error when multiple '@' exist
    test('throws error when multiple start characters exist', () => {
      const map = ['  @--A-@+', '        |', ' x-B-+  C'];

      expect(() => dataFormatToJaggedMatrix(map)).toThrow('Multiple start');
    });

    // Throws error when multiple 'x' exist
    test('throws error when multiple end characters exist', () => {
      const map = ['  @--A--+', '        |', ' x-B-x  C'];

      expect(() => dataFormatToJaggedMatrix(map)).toThrow('Multiple end');
    });
  });
});

/**
 * Unit tests for map.ts functions
 */
describe('Map Functions', () => {
  describe('isApprovedChar', () => {
    // Recognizes '@' as valid
    test('returns true for start character @', () => {
      expect(isApprovedChar('@')).toBe(true);
    });

    // Recognizes 'x' as valid
    test('returns true for end character x', () => {
      expect(isApprovedChar('x')).toBe(true);
    });

    // Recognizes '-' as valid
    test('returns true for horizontal line -', () => {
      expect(isApprovedChar('-')).toBe(true);
    });

    // Recognizes '|' as valid
    test('returns true for vertical line |', () => {
      expect(isApprovedChar('|')).toBe(true);
    });

    // Recognizes '+' as valid
    test('returns true for intersection +', () => {
      expect(isApprovedChar('+')).toBe(true);
    });

    // Recognizes space as valid (not traversable)
    test('returns true for space', () => {
      expect(isApprovedChar(' ')).toBe(true);
    });

    // Recognizes uppercase letters A-Z
    test('returns true for uppercase letters', () => {
      expect(isApprovedChar('A')).toBe(true);
      expect(isApprovedChar('M')).toBe(true);
      expect(isApprovedChar('Z')).toBe(true);
    });

    // Rejects lowercase letters
    test('returns false for lowercase letters', () => {
      expect(isApprovedChar('a')).toBe(false);
      expect(isApprovedChar('m')).toBe(false);
      expect(isApprovedChar('z')).toBe(false);
    });

    // Rejects numbers
    test('returns false for numbers', () => {
      expect(isApprovedChar('0')).toBe(false);
      expect(isApprovedChar('5')).toBe(false);
      expect(isApprovedChar('9')).toBe(false);
    });

    // Rejects invalid special characters
    test('returns false for invalid special characters', () => {
      expect(isApprovedChar('!')).toBe(false);
      expect(isApprovedChar('#')).toBe(false);
      expect(isApprovedChar('*')).toBe(false);
    });
  });

  describe('isIntersection', () => {
    // Identifies '+' as intersection
    test('returns true for + character', () => {
      expect(isIntersection('+')).toBe(true);
    });

    // Returns false for non-intersections
    test('returns false for other characters', () => {
      expect(isIntersection('-')).toBe(false);
      expect(isIntersection('|')).toBe(false);
      expect(isIntersection('@')).toBe(false);
      expect(isIntersection('A')).toBe(false);
    });
  });

  describe('checkIfOnlyLetter', () => {
    // Identifies uppercase letters A-Z
    test('returns true for uppercase letters', () => {
      expect(checkIfOnlyLetter('A')).toBe(true);
      expect(checkIfOnlyLetter('B')).toBe(true);
      expect(checkIfOnlyLetter('Z')).toBe(true);
    });

    // Returns false for non-letters
    test('returns false for non-letter characters', () => {
      expect(checkIfOnlyLetter('-')).toBe(false);
      expect(checkIfOnlyLetter('+')).toBe(false);
      expect(checkIfOnlyLetter('@')).toBe(false);
      expect(checkIfOnlyLetter('1')).toBe(false);
    });

    test('returns false for lowercase letters', () => {
      expect(checkIfOnlyLetter('a')).toBe(false);
      expect(checkIfOnlyLetter('z')).toBe(false);
    });
  });

  describe('getCharacterAtPositionXY', () => {
    const matrix = [
      ['@', '-', '-'],
      ['|', ' ', 'A'],
      ['x', '-', '+']
    ];

    // Gets character at valid coordinates
    test('returns correct character at valid position', () => {
      expect(getCharacterAtPositionXY(matrix, { x: 0, y: 0 })).toBe('@');
      expect(getCharacterAtPositionXY(matrix, { x: 2, y: 1 })).toBe('A');
      expect(getCharacterAtPositionXY(matrix, { x: 2, y: 2 })).toBe('+');
    });

    // Returns space for out of bounds
    test('returns space for out of bounds position', () => {
      expect(getCharacterAtPositionXY(matrix, { x: 10, y: 0 })).toBe(' ');
      expect(getCharacterAtPositionXY(matrix, { x: 0, y: 10 })).toBe(' ');
    });

    // Returns space for negative coordinates
    test('returns space for negative position', () => {
      expect(getCharacterAtPositionXY(matrix, { x: -1, y: 0 })).toBe(' ');
      expect(getCharacterAtPositionXY(matrix, { x: 0, y: -1 })).toBe(' ');
    });
  });

  describe('okForDirection', () => {
    // Allows 'x' in any direction
    test('returns true for end character in any direction', () => {
      expect(okForDirection('x', Direction.up)).toBe(true);
      expect(okForDirection('x', Direction.down)).toBe(true);
      expect(okForDirection('x', Direction.left)).toBe(true);
      expect(okForDirection('x', Direction.right)).toBe(true);
    });

    // Allows '+' in any direction
    test('returns true for intersection in any direction', () => {
      expect(okForDirection('+', Direction.up)).toBe(true);
      expect(okForDirection('+', Direction.down)).toBe(true);
      expect(okForDirection('+', Direction.left)).toBe(true);
      expect(okForDirection('+', Direction.right)).toBe(true);
    });

    // Allows letters in any direction
    test('returns true for letters in any direction', () => {
      expect(okForDirection('A', Direction.up)).toBe(true);
      expect(okForDirection('B', Direction.down)).toBe(true);
      expect(okForDirection('C', Direction.left)).toBe(true);
      expect(okForDirection('D', Direction.right)).toBe(true);
    });

    // Allows '-' when moving left/right
    test('returns true for horizontal line when traveling horizontally', () => {
      expect(okForDirection('-', Direction.left)).toBe(true);
      expect(okForDirection('-', Direction.right)).toBe(true);
    });

    // Blocks '-' when moving up/down
    test('returns false for horizontal line when traveling vertically', () => {
      expect(okForDirection('-', Direction.up)).toBe(false);
      expect(okForDirection('-', Direction.down)).toBe(false);
    });

    // Allows '|' when moving up/down
    test('returns true for vertical line when traveling vertically', () => {
      expect(okForDirection('|', Direction.up)).toBe(true);
      expect(okForDirection('|', Direction.down)).toBe(true);
    });

    // Blocks '|' when moving left/right
    test('returns false for vertical line when traveling horizontally', () => {
      expect(okForDirection('|', Direction.left)).toBe(false);
      expect(okForDirection('|', Direction.right)).toBe(false);
    });

    // Allows perpendicular crossing at intersections
    test('allows crossing perpendicular lines when allowIntersection is true', () => {
      expect(okForDirection('|', Direction.left, true)).toBe(true);
      expect(okForDirection('|', Direction.right, true)).toBe(true);
      expect(okForDirection('-', Direction.up, true)).toBe(true);
      expect(okForDirection('-', Direction.down, true)).toBe(true);
    });
  });
});

/**
 * Unit tests for vector.ts functions
 */
describe('Vector Functions', () => {
  describe('nextMove', () => {
    // Moves up by decreasing y
    test('moves up correctly (decreases y)', () => {
      const position = { x: 5, y: 5 };
      const result = nextMove(position, Direction.up);

      expect(result).toEqual({ x: 5, y: 4 });
    });

    // Moves down by increasing y
    test('moves down correctly (increases y)', () => {
      const position = { x: 5, y: 5 };
      const result = nextMove(position, Direction.down);

      expect(result).toEqual({ x: 5, y: 6 });
    });

    // Moves left by decreasing x
    test('moves left correctly (decreases x)', () => {
      const position = { x: 5, y: 5 };
      const result = nextMove(position, Direction.left);

      expect(result).toEqual({ x: 4, y: 5 });
    });

    // Moves right by increasing x
    test('moves right correctly (increases x)', () => {
      const position = { x: 5, y: 5 };
      const result = nextMove(position, Direction.right);

      expect(result).toEqual({ x: 6, y: 5 });
    });

    // Preserves original position object
    test('does not modify original position', () => {
      const position = { x: 5, y: 5 };
      nextMove(position, Direction.up);

      expect(position).toEqual({ x: 5, y: 5 });
    });
  });

  describe('getOppositeDirection', () => {
    // Returns opposite of up
    test('returns down for up', () => {
      expect(getOppositeDirection(Direction.up)).toBe('down');
    });

    // Returns opposite of down
    test('returns up for down', () => {
      expect(getOppositeDirection(Direction.down)).toBe('up');
    });

    // Returns opposite of left
    test('returns right for left', () => {
      expect(getOppositeDirection(Direction.left)).toBe('right');
    });

    // Returns opposite of right
    test('returns left for right', () => {
      expect(getOppositeDirection(Direction.right)).toBe('left');
    });
  });

  describe('Direction constants', () => {
    // Verifies up direction properties
    test('Direction.up has correct properties', () => {
      expect(Direction.up.name).toBe('up');
      expect(Direction.up.oneStep).toEqual({ x: 0, y: -1 });
    });

    // Verifies down direction properties
    test('Direction.down has correct properties', () => {
      expect(Direction.down.name).toBe('down');
      expect(Direction.down.oneStep).toEqual({ x: 0, y: 1 });
    });

    // Verifies left direction properties
    test('Direction.left has correct properties', () => {
      expect(Direction.left.name).toBe('left');
      expect(Direction.left.oneStep).toEqual({ x: -1, y: 0 });
    });

    // Verifies right direction properties
    test('Direction.right has correct properties', () => {
      expect(Direction.right.name).toBe('right');
      expect(Direction.right.oneStep).toEqual({ x: 1, y: 0 });
    });
  });
});
