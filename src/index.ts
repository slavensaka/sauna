import { validMaps } from '../tests/fixtures/validMaps';
import { Position, Direction, DirectionValue, nextMove } from './vector';
import { getCurrentDirection, getCharacterAtPositionXY, chooseNextMove } from './map';
import { dataFormatToJaggedMatrix, Output } from './jagged_matrix';

function main(): void {
  try {
    const { jaggedMatrix, startPosition } = dataFormatToJaggedMatrix(validMaps.basic.map);

    // Start positon set tu current s owe can loop 
    let currentPosition = startPosition;
    // Added initial path @, since were at that position already
    let result: Output = {
      collectedLetters: '',
      pathAsCharacters: '@'
    };

    let visitedPositions = new Set<string>();
    visitedPositions.add(`${startPosition.x},${startPosition.y}`);
    
    // Find initial direction using getCurrentDirection
    const initialMoves = getCurrentDirection(jaggedMatrix, currentPosition, undefined, true);
    // If return empty we don't have any more moves
    if (initialMoves.length === 0 || !initialMoves[0]) {
      throw new Error('No valid initial direction found');
    }
    let currentDirection = initialMoves[0].direction;


    // Main traversal loop
    let step = 1;
    while (step <= 50) {
      // Find all valid moves from current position
      const validMoves = getCurrentDirection(jaggedMatrix, currentPosition, visitedPositions);

      if (validMoves.length === 0) {
        console.log('No valid moves found!');
        break;
      }

      const currentChar = getCharacterAtPositionXY(jaggedMatrix, currentPosition);
      const chosenMove = chooseNextMove(validMoves, currentChar, currentDirection);

      if (!chosenMove) {
        console.log('No valid move found!');
        break;
      }
      // Move to chosen position
      currentPosition = chosenMove.position;
      currentDirection = chosenMove.direction;
      const posKey = `${chosenMove.position.x},${chosenMove.position.y}`;
      visitedPositions.add(posKey);
      result.pathAsCharacters += chosenMove.character;

      // Collect letters (A-Z)
      if (/^[A-Z]$/.test(chosenMove.character)) {
        result.collectedLetters += chosenMove.character;
      }

      // console.log(`Step ${step}: (${currentPosition.x}, ${currentPosition.y}) | '${chosenMove.character}' | ${chosenMove.direction.name}`);
      // console.log(`Current path: ${result.pathAsCharacters}`);

      // Check if we've reached the end
      if (chosenMove.character === 'x') {
        console.log('Reached the end!');
        break;
      }

      step++;
    }

    // console.log('\n=== FINAL RESULT ===');
    console.log('Total steps:', step);
    console.log('Collected Letters:', result.collectedLetters);
    console.log('Path as Characters:', result.pathAsCharacters);
    console.log('Path Length:', result.pathAsCharacters.length);

  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
  }
}
if (require.main === module) {
  main();
}