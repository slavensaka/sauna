// Map
import { Direction, Position, DirectionValue, nextMove } from './vector';
import { JaggedMatrixReturn} from './jagged_matrix';

// Approved characters 
export const approvedChar = {
  start: '@',
  end: 'x',
  horizontal_line: '-',
  vertical_line: '|',
  spin: '+',
  space: ' ',
  letter: /^[A-Z]$/ // real regex
} as const;


// If approved_char is expanded with more const it will work (true or false)
export function isApprovedChar(char: string): boolean {
  for (const key in approvedChar) {
    const value = approvedChar[key as keyof typeof approvedChar];

    if (value instanceof RegExp) {
      if (value.test(char)) return true;
    } else if (value === char) {
      return true;
    }
  }
  return false;
}

export function getCorrectDirection(
  jaggedMatrix: string[][],
  startPosition: Position,
  endPosition: Position
): { direction: DirectionValue; nextStepChar: string } {


  // Moving through 2d matrix by +1 as a snake,
  // based by one direciton
  for (const direction of Object.values(Direction)) {
    const nextStep = nextMove(startPosition, direction);
    const nextStepChar = getCharacterAtPositionXY(jaggedMatrix, nextStep);
    const isOkChar = isApprovedChar(nextStepChar);
    if (isOkChar) {
      const trueForDirection = okForDirection(nextStepChar, direction)
      if(trueForDirection) {
        return { direction, nextStepChar };
      }
    } else {
      console.error('Shouldn\'t be any other char, catch if I didnt expect something.');
    }
    // console.log(isApprovedChar)
  }
  return { direction: Direction.up, nextStepChar: ' ' }; // Fallback
}

export function getCharacterAtPositionXY(jaggedMatrix: string[][], startPosition: Position): string {
  const char = jaggedMatrix[startPosition.y]?.[startPosition.x] || ' ';
  return char;
}

export function okForDirection(char: string, dir: DirectionValue): boolean {
  // x, +, [A-Z] are ok for direction
  if (char === approvedChar['end'] ||
    char === approvedChar['spin'] ||
    /^[A-Z]$/.test(char)) {
    return true;
  }

  // Traveling vertically (up/down), and char is |, that's ok 
  if (dir.name === Direction.up.name || dir.name === Direction.down.name) {
    if (char === approvedChar['vertical_line']) {
      return true;
      // This is for going straight through intersections
    } else if(char === approvedChar['horizontal_line']) {
      return true;
    }
  }

  // Traveling horizontally (left/right), and char is -, that's ok
  if (dir.name === Direction.left.name || dir.name === Direction.right.name) {
    if (char === approvedChar['horizontal_line']) {
      return true;
      // This is for going straight through intersections
    } else if(char === approvedChar['vertical_line']) {
      return true;
    }
  }
  return false;
}