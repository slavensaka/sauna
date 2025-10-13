import { validMaps } from '../tests/fixtures/validMaps';
import { Position, Direction } from './vector';
import { approvedChar, isApprovedChar, getInitDirection, getCharacterAtPositionXY } from './map';
import { dataFormatToJaggedMatrix } from './jagged_matrix';
// The result output
type Output = {
  collectedLetters: string;
  pathAsCharacters: string;
}



function main(): void {
  try {
    // 2d jagged created, start found, now direction
    const { jaggedMatrix, startPosition, endPosition } = dataFormatToJaggedMatrix(validMaps.basic.map);

    if (startPosition && endPosition) {
      const initialDirection = getInitDirection(jaggedMatrix, startPosition, endPosition);
      const startXY = getCharacterAtPositionXY(jaggedMatrix, startPosition);

      // Create an output object instance
      const output: Output = {
        collectedLetters: '',
        pathAsCharacters: startXY
      };


      console.log('Initial direction:', initialDirection);
      console.log('Start character:', startXY);
      console.log('Output so far:', output);




    } else {
      throw new Error('Could not find start or end position in the map');
    }

  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
  }
}

if (require.main === module) {
  main();
}

// Re-export functions for testing
export { isApprovedChar } from './map';
export { dataFormatToJaggedMatrix } from './jagged_matrix';