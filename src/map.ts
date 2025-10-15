// Map
import { Direction, Position, DirectionValue, nextMove } from './vector';
import { JaggedMatrixReturn } from './jagged_matrix';

export let maxTraversalCount: number = 500;

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

export function isIntersection(char: string): boolean {
  return char === approvedChar.spin;
}

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

export function checkIfOnlyLetter(char: string) {
  if (approvedChar.letter.test(char)) {
    return true;
  }
  else {
    return false;
  }
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

export function okForDirection(char: string, dir: DirectionValue, allowIntersection: boolean = false): boolean {
  if (char === approvedChar['end']) {
    return true;
  }

  if (char === approvedChar['spin']) {
    return true;
  }

  if (/^[A-Z]$/.test(char)) {
    return true;
  }

  // Traveling horizontally (left/right), need horizontal line
  if (dir.name === Direction.left.name || dir.name === Direction.right.name) {
    if (char === approvedChar['horizontal_line']) {
      return true;
    }

    // Allow crossing vertical lines at intersections
    if (allowIntersection && char === approvedChar['vertical_line']) {
      return true;
    }
  }

  // Traveling vertically (up/down), need vertical line
  if (dir.name === Direction.up.name || dir.name === Direction.down.name) {
    if (char === approvedChar['vertical_line']) {
      return true;
    }

    // Allow crossing horizontal lines at intersections
    if (allowIntersection && char === approvedChar['horizontal_line']) {
      return true;
    }
  }

  return false;
}

export function chooseNextMove(
  validMoves: Array<{ direction: DirectionValue; position: Position; character: string; posKey: string }>,
  currentChar: string,
  currentDirection: DirectionValue
): { direction: DirectionValue; position: Position; character: string; posKey: string } | null {

  if (validMoves.length === 0) return null;

  // If only one valid move, take it (no choice)
  if (validMoves.length === 1) {
    return validMoves[0] ?? null;
  }

  // For non-intersections, prefer continuing straight
  if (currentChar !== '+') {
    const sameDirection = validMoves.find(move => move.direction.name === currentDirection.name);
    if (sameDirection) {
      return sameDirection;
    }
  }

  // At intersections with multiple options, check what moves are available
  const straightMove = validMoves.find(move => move.direction.name === currentDirection.name);
  const turnMoves = validMoves.filter(move => move.direction.name !== currentDirection.name);

  const hasStraightOption = straightMove !== undefined;
  const hasTurnOptions = turnMoves.length > 0;

  // If both straight and turn are available, prefer turn (this handles the B/C collection)
  if (hasStraightOption && hasTurnOptions) {
    return turnMoves[0] ?? null;
  }

  // Otherwise prefer straight if available
  if (hasStraightOption) {
    return straightMove;
  }

  // No straight option, take first available turn
  return validMoves[0] ?? null;
}

export function getCurrentDirection(
  jaggedMatrix: string[][],
  position: Position,
  visitedPositions?: Set<string>,
  returnFirst: boolean = false
): Array<{ direction: DirectionValue; position: Position; character: string; posKey: string }> {

  // Check if current position is an intersection or on a line (for crossing)
  const currentChar = getCharacterAtPositionXY(jaggedMatrix, position);
  const atIntersection = currentChar === approvedChar['spin'];

  const onHorizontalLine = currentChar === approvedChar['horizontal_line'];
  const onVerticalLine = currentChar === approvedChar['vertical_line'];
  const onLine = onHorizontalLine || onVerticalLine;

  // Allow crossing perpendicular lines at intersections OR when on a line
  const allowCrossing = atIntersection || onLine;

  const validMoves = [];
  for (const direction of Object.values(Direction)) {
    const nextPos = nextMove(position, direction);
    const nextChar = getCharacterAtPositionXY(jaggedMatrix, nextPos);
    const posKey = `${nextPos.x},${nextPos.y}`;

    // Check if move is valid (allow crossing perpendicular lines when appropriate)
    const isValidMove = okForDirection(nextChar, direction, allowCrossing);

    if (!isValidMove) {
      continue;
    }

    // Check if position has been visited
    const isVisited = visitedPositions && visitedPositions.has(posKey);

    if (isVisited) {
      // Allow revisiting if we're crossing perpendicular lines
      if (allowCrossing) {
        // Check if this is a perpendicular crossing
        const isTravelingLeft = direction.name === Direction.left.name;
        const isTravelingRight = direction.name === Direction.right.name;

        let isTravelingHorizontally = false;
        if (isTravelingLeft) {
          isTravelingHorizontally = true;
        }
        if (isTravelingRight) {
          isTravelingHorizontally = true;
        }

        const isTravelingUp = direction.name === Direction.up.name;
        const isTravelingDown = direction.name === Direction.down.name;

        let isTravelingVertically = false;
        if (isTravelingUp) {
          isTravelingVertically = true;
        }
        if (isTravelingDown) {
          isTravelingVertically = true;
        }

        if (isTravelingHorizontally && nextChar === approvedChar['vertical_line']) {
          // Crossing vertical line while traveling horizontally - allow it
        } else if (isTravelingVertically && nextChar === approvedChar['horizontal_line']) {
          // Crossing horizontal line while traveling vertically - allow it
        } else {
          continue; // Not a perpendicular crossing, skip this move
        }
      } else {
        continue; // Position visited and not allowed to cross
      }
    }

    // Move is valid and not visited (or allowed to revisit)
    validMoves.push({ direction, position: nextPos, character: nextChar, posKey });

    // If returnFirst is true, return immediately after finding first valid move
    if (returnFirst) {
      return validMoves;
    }
  }

  return validMoves;
}