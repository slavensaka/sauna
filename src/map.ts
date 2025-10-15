// Map
import { Direction, Position, DirectionValue, nextMove } from './vector';
import { JaggedMatrixReturn } from './jagged_matrix';

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
  position: Position,
  currentDirection?: DirectionValue
): { direction: DirectionValue; nextStepChar: string } {

  // Find the first valid direction from current position
  for (const direction of Object.values(Direction)) {
    const nextPos = nextMove(position, direction);
    const nextChar = getCharacterAtPositionXY(jaggedMatrix, nextPos);
    if (isApprovedChar(nextChar)) {
      if (okForDirection(nextChar, direction)) {
        return { direction, nextStepChar: nextChar };
      }
    }
  }

  // Fallback if no valid direction found
  throw new Error(`No valid direction found from position (${position.x}, ${position.y})`);
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

  // Traveling vertically (up/down), need vertical line |
  if (dir.name === Direction.up.name || dir.name === Direction.down.name) {
    return char === approvedChar['vertical_line'];
  }

  // Traveling horizontally (left/right), need horizontal line -
  if (dir.name === Direction.left.name || dir.name === Direction.right.name) {
    return char === approvedChar['horizontal_line'];
  }
  return false;
}

function isHorizontal(direction: DirectionValue): boolean {
  return direction.name === 'left' || direction.name === 'right';
}

function isVertical(direction: DirectionValue): boolean {
  return direction.name === 'up' || direction.name === 'down';
}

export function chooseNextMove(
  validMoves: Array<{ direction: DirectionValue; position: Position; character: string; posKey: string }>,
  currentChar: string,
  currentDirection: DirectionValue
): { direction: DirectionValue; position: Position; character: string; posKey: string } | null {

  if (validMoves.length === 0) return null;

  // At intersection (+), turn perpendicular to current direction
  if (currentChar === '+') {
    const perpendicularMoves = validMoves.filter(move => {
      return isHorizontal(currentDirection) ? isVertical(move.direction) : isHorizontal(move.direction);
    });
    return perpendicularMoves[0] || validMoves[0] || null;
  }

  // Normal movement - continue in same direction if possible
  const sameDirection = validMoves.find(move => move.direction.name === currentDirection.name);
  return sameDirection || validMoves[0] || null;
}

export function getCurrentDirection(
  jaggedMatrix: string[][],
  position: Position,
  visitedPositions?: Set<string>,
  returnFirst: boolean = false
): Array<{ direction: DirectionValue; position: Position; character: string; posKey: string }> {

  const validMoves = [];
  for (const direction of Object.values(Direction)) {
    const nextPos = nextMove(position, direction);
    const nextChar = getCharacterAtPositionXY(jaggedMatrix, nextPos);
    const posKey = `${nextPos.x},${nextPos.y}`;

    // Check if move is valid and not visited (if visitedPositions provided)
    const isValidMove = okForDirection(nextChar, direction);
    const isNotVisited = !visitedPositions || !visitedPositions.has(posKey);

    if (isValidMove && isNotVisited) {
      validMoves.push({ direction, position: nextPos, character: nextChar, posKey });

      // If returnFirst is true, return immediately after finding first valid move
      if (returnFirst) {
        return validMoves;
      }
    }
  }

  return validMoves;
}