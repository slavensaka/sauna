import { validMaps } from '../tests/fixtures/validMaps';
import { Position, Direction, DirectionValue, nextMove, getOppositeDirection } from './vector';
import { maxTraversalCount, isIntersection, checkIfOnlyLetter, getCurrentDirection, getCharacterAtPositionXY, chooseNextMove } from './map';
import { dataFormatToJaggedMatrix, Output } from './jagged_matrix';

function main(): void {
  try {
    const { jaggedMatrix, startPosition } = dataFormatToJaggedMatrix(validMaps.doNotCollectLetterTwice.map);

    // Start positon set tu current s owe can loop 
    let currentPosition = startPosition;
    // Main output of the letters and path
    // Added initial path @, since were at that position already
    let output: Output = {
      collectedLetters: '',
      pathAsCharacters: '@'
    };

    // Keep a tab on all visitedPositions
    let visitedPositions = new Set<string>();
    visitedPositions.add(`${startPosition.x},${startPosition.y}`);

    // 
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
        console.log('No valid moves found!');
        break;
      }

      const chosenMove = chooseNextMove(movesToUse, currentChar, currentDirection);

      if (!chosenMove) {
        console.log('No valid move found!');
        break;
      }

      // Move to chosen position
      currentPosition = chosenMove.position;
      currentDirection = chosenMove.direction;

      // Mark position as visited, with special handling for intersections
      const posKey = `${chosenMove.position.x},${chosenMove.position.y}`;
      const isAtIntersection = chosenMove.character === '+';

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
        // If it isnt in the collected letters move on
        // Otherwise add it
        if (!collectedLetterPositions.has(letterPosKey)) {
          output.collectedLetters += chosenMove.character;
          collectedLetterPositions.add(letterPosKey);
        }
      }
      // Check if we've reached the end
      // above it adds the end x and this just break it out
      if (chosenMove.character === 'x') {
        console.log('Reached the end!');
        break;
      }
      step++;
    }
    
    console.log('Collected Letters:', output.collectedLetters);
    console.log('Path as Characters:', output.pathAsCharacters);
    console.log('Path Length:', output.pathAsCharacters.length);

  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
  }
}
if (require.main === module) {
  main();
}