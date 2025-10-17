// Map
import { Direction, Position, DirectionValue, nextMove, getOppositeDirection } from './vector';
import { maxTraversalCount, JaggedMatrixReturn, dataFormatToJaggedMatrix } from './jagged_matrix';

// Approved characters 
export const approvedChar = {
  start: '@',
  end: 'x',
  horizontal_line: '-',
  vertical_line: '|',
  spin: '+',
  space: ' ', // approved but no go zone
  letter: /^[A-Z]$/ // real regex
} as const;

/**
 * Checks if a character is an intersection (+)
 * 
 * @param char - The character to check
 * @returns true if the character is '+', false otherwise
 */
export function isIntersection(char: string): boolean {
  return char === approvedChar.spin;
}

/**
 * Checks if a character is an approved character for the path
 * Validates against all characters defined in approvedChar including:
 * - Start (@), End (x), Lines (-, |), Intersection (+), Space, and Letters (A-Z)
 * 
 * @param char - The character to validate
 * @returns true if the character is approved, false otherwise
 * 
 * If approved_char is expanded with more const it will work returns true (true or false)
 */
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


/**
 * Checks if a character is a letter (A-Z)
 * 
 * @param char - The character to check
 * @returns true if the character is an uppercase letter, false otherwise
 */
export function checkIfOnlyLetter(char: string) {
  if (approvedChar.letter.test(char)) {
    return true;
  }
  else {
    return false;
  }
}

/**
 * Gets the character at a specific position in the jagged matrix
 * 
 * @param jaggedMatrix - The 2D map array
 * @param startPosition - The position to get the character from
 * @returns The character at the position, or space if out of bounds
 */
export function getCharacterAtPositionXY(jaggedMatrix: string[][], startPosition: Position): string {
  const char = jaggedMatrix[startPosition.y]?.[startPosition.x] || ' ';
  return char;
}

/**
 * Checks if the current move is a perpendicular crossing
 * A perpendicular crossing occurs when traveling horizontally through a vertical line
 * or traveling vertically through a horizontal line
 * 
 * @param isTravelingHorizontally - Whether currently traveling left or right
 * @param isTravelingVertically - Whether currently traveling up or down
 * @param nextChar - The character at the next position
 * @returns true if crossing a perpendicular line, false otherwise
 */
function isPerpendicularCrossing(
  isTravelingHorizontally: boolean,
  isTravelingVertically: boolean,
  nextChar: string
): boolean {
  return (
    (isTravelingHorizontally && nextChar === approvedChar.vertical_line) ||
    (isTravelingVertically && nextChar === approvedChar.horizontal_line)
  );
}

/**
 * Checks if a character is valid for traveling in a specific direction
 * Validates that horizontal movement uses '-' and vertical movement uses '|'
 * Also allows crossing perpendicular lines at intersections when allowIntersection is true
 * 
 * @param char - The character to validate
 * @param dir - The direction of travel
 * @param allowIntersection - Whether to allow crossing perpendicular lines (default: false)
 * @returns true if the character is valid for the direction, false otherwise
 */
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

/**
 * Chooses the next move from a list of valid moves based on current position and direction
 * Prioritizes continuing straight for non-intersections
 * At intersections, prefers turning over going straight when both options are available
 * 
 * @param validMoves - Array of valid move options
 * @param currentChar - The character at the current position
 * @param currentDirection - The current direction of travel
 * @returns The chosen move object, or null if no valid move exists
 */
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

/**
 * Gets all valid moves from the current position
 * Checks all four directions and validates each move
 * Allows crossing perpendicular lines at intersections or when on a line
 * Filters out visited positions unless crossing perpendicular lines
 * 
 * @param jaggedMatrix - The 2D map array
 * @param position - The current position to check from
 * @param visitedPositions - Optional set of visited position keys to avoid revisiting
 * @param returnFirst - If true, returns immediately after finding first valid move (default: false)
 * @returns Array of valid move objects with direction, position, character, and position key
 */
function getCurrentDirection(
  jaggedMatrix: string[][],
  position: Position,
  visitedPositions?: Set<string>,
  returnFirst: boolean = false
): Array<{ direction: DirectionValue; position: Position; character: string; posKey: string }> {
  let atIntersection = false;
  let onHorizontalLine = false;
  let onVerticalLine = false;
  let onLine = false;
  let allowCrossing = false;
  let isTravelingLeft = false;
  let isTravelingRight = false;
  let isTravelingHorizontally = false;
  let isTravelingVertically = false;

  // Check if current position is an intersection or on a line (for crossing)
  const currentChar = getCharacterAtPositionXY(jaggedMatrix, position);
  if (currentChar === approvedChar.spin) atIntersection = true;
  if (currentChar === approvedChar.horizontal_line) onHorizontalLine = true;
  if (currentChar === approvedChar.vertical_line) onVerticalLine = true;
  if (onHorizontalLine || onVerticalLine) onLine = true;

  // Allow crossing perpendicular lines at intersections OR when on a line
  if (atIntersection || onLine) allowCrossing = true;

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
        if (direction.name === Direction.left.name) isTravelingLeft = true;
        if (direction.name === Direction.right.name) isTravelingRight = true;
        if (isTravelingLeft || isTravelingRight) isTravelingHorizontally = true;

        const isTravelingUp = direction.name === Direction.up.name;
        const isTravelingDown = direction.name === Direction.down.name;

        if (isTravelingUp) isTravelingVertically = true;
        if (isTravelingDown) isTravelingVertically = true;

        // Not a perpendicular crossing, skip this move
        if (!isPerpendicularCrossing(isTravelingHorizontally, isTravelingVertically, nextChar)) continue;

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

/**
 * Main function to navigate through a map, following the path and collecting letters
 * Starts at '@', follows the path, collects letters (A-Z), and stops at 'x'
 * Handles intersections, prevents going backwards, and avoids collecting letters twice from same position
 * 
 * @param map - Array of strings representing the map
 * @returns Object containing collected letters and the full path as characters
 * @throws Error if no valid initial direction, no valid moves, fake turn detected, or other path issues
 */
export function followPathAndCollectLetters(map: string[]): { collectedLetters: string; pathAsCharacters: string } {
  const { jaggedMatrix, startPosition } = dataFormatToJaggedMatrix(map);

  // Start position set to current so we can loop 
  let currentPosition = startPosition;
  // Main output of the letters and path
  // Added initial path @, since we're at that position already
  let output = {
    collectedLetters: '',
    pathAsCharacters: '@'
  };

  // Keep a tab on all visitedPositions
  let visitedPositions = new Set<string>();
  visitedPositions.add(`${startPosition.x},${startPosition.y}`);

  let collectedLetterPositions = new Set<string>();

  // Find initial direction using getCurrentDirection
  const initialMoves = getCurrentDirection(jaggedMatrix, currentPosition, undefined, true);
  // If return empty we don't have any more moves
  if (initialMoves.length === 0 || !initialMoves[0]) {
    throw new Error('No valid initial direction found');
  }
  let currentDirection = initialMoves[0].direction;

  // Main traversal loop
  let step = 1;
  while (step <= maxTraversalCount) {
    // Check if we're at an intersection
    const currentChar = getCharacterAtPositionXY(jaggedMatrix, currentPosition);
    // Find all valid moves from current position
    let validMoves;
    if (isIntersection(currentChar)) {
      validMoves = getCurrentDirection(jaggedMatrix, currentPosition, undefined);
    } else {
      validMoves = getCurrentDirection(jaggedMatrix, currentPosition, visitedPositions);
    }

    const oppositeDir = getOppositeDirection(currentDirection);

    const forwardMoves: Array<{ direction: DirectionValue; position: Position; character: string; posKey: string }> = [];

    for (const move of validMoves) {
      if (move.direction.name !== oppositeDir) {
        forwardMoves.push(move);
      }
    }

    let movesToUse;
    if (forwardMoves.length > 0) {
      movesToUse = forwardMoves;
    } else {
      movesToUse = validMoves;
    }

    if (movesToUse.length === 0) {
      throw new Error('No valid moves found');
    }

    // Check for fake turn: if at '+' and can only go straight (no perpendicular paths)
    if (isIntersection(currentChar) && movesToUse.length > 0) {
      const hasStraightMove = movesToUse.some(move => move.direction.name === currentDirection.name);
      const hasPerpendicularMove = movesToUse.some(move => move.direction.name !== currentDirection.name);

      // If at '+' and can only go straight (no perpendicular options), it's a fake turn
      if (hasStraightMove && !hasPerpendicularMove) {
        throw new Error('Fake turn');
      }
    }

    const chosenMove = chooseNextMove(movesToUse, currentChar, currentDirection);

    if (!chosenMove) {
      throw new Error('No valid move found');
    }

    // Move to chosen position
    currentPosition = chosenMove.position;
    currentDirection = chosenMove.direction;

    // Mark position as visited, with special handling for intersections
    const posKey = `${chosenMove.position.x},${chosenMove.position.y}`;
    const isAtIntersection = isIntersection(chosenMove.character);

    // Mark positions as visited, but allow revisiting letters and intersections
    const isLetter = checkIfOnlyLetter(chosenMove.character);

    // Don't mark letters or intersections as visited (can pass through multiple times)
    if (!isAtIntersection && !isLetter) {
      visitedPositions.add(posKey);
    }
    output.pathAsCharacters += chosenMove.character;

    // Collect letters (A-Z) only if not collected from this position before
    if (checkIfOnlyLetter(chosenMove.character)) {
      const letterPosKey = `${chosenMove.position.x},${chosenMove.position.y}`;
      // If it isn't in the collected letters move on
      // Otherwise add it
      if (!collectedLetterPositions.has(letterPosKey)) {
        output.collectedLetters += chosenMove.character;
        collectedLetterPositions.add(letterPosKey);
      }
    }
    // Check if we've reached the end
    // above it adds the end x and this just break it out
    if (chosenMove.character === approvedChar.end) {
      break;
    }
    step++;
  }
  return output;
}

