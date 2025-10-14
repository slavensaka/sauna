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

export function getInitDirection(
  jaggedMatrix: string[][],
  startPosition: Position,
  endPosition: Position
): DirectionValue {


  // Moving through 2d matrix by +1 as a snake,
  // based by one direciton
  for (const direction of Object.values(Direction)) {

    const nextStep = nextMove(startPosition, direction);
    const nextStepChar = getCharacterAtPositionXY(jaggedMatrix, nextStep);
    // console.log('getCharacterAtPositionXY:', direction);
    // test = jaggedMatrix[startPosition.x][startPosition.y];
    const isOkChar = isApprovedChar(nextStepChar);
    if (isOkChar) {
      const trueForDirection = okForDirection(nextStepChar, direction)
      if(trueForDirection) {
        return direction;
      }
    } else {
      console.error('Shouldn\'t be any other char, catch if I didnt expect something.');
    }
    // console.log(isApprovedChar)
  }
  return Direction.up;
}

export function getCharacterAtPositionXY(jaggedMatrix: string[][], startPosition: Position): string {
  const char = jaggedMatrix[startPosition.y]?.[startPosition.x] || ' ';
  return char;
}

function okForDirection(char: string, dir: DirectionValue): boolean {
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

// function navigateMap(
//   map: JaggedMatrixReturn, 
//   pos: Position, 
//   dir: DirectionValue, 
//   letters: string[], 
//   path: string[], 
//   visitedLetters: Set<string>
// ): PathResult {
//   const nextPos = getNextPosition(pos, dir);
//   const char = getCharAt(map, nextPos.row, nextPos.col);
  
//   if (char === VALID_CHARS.END) {
//     path.push(char);
//     return { letters: letters.join(''), path: path.join('') };
//   }