// Map
import { Direction, Position, DirectionValue } from './vector';

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

export function getInitDirection(
  jaggedMatrix: string[][],
  startPosition: Position,
  endPosition: Position
): DirectionValue {

  // Moving through 2d matrix by one as snake,
  // based by one direciton
  for (const direction of Object.values(Direction)) {
    console.log(direction)
    getCharacterAtPositionXY(jaggedMatrix, startPosition);
    // console.log(startPosition.x, )
    // console.log(jaggedMatrix,[startPosition.x],[startPosition.y])

    // test = jaggedMatrix[startPosition.x][startPosition.y];
    // isApprovedChar
  }
  return Direction.up;
}

export function getCharacterAtPositionXY(jaggedMatrix: string[][], startPosition: Position): string {
  const char = jaggedMatrix[startPosition.y]![startPosition.x]!

  return char;
}
