import { validMaps } from '../tests/fixtures/validMaps';
import { Position, Direction } from './vector';
import { approvedChar, isApprovedChar } from './map';
import { dataFormatToJaggedMatrix } from './jagged_matrix';
// The result output
type Output = {
  collectedLetters: string;
  pathAsCharacters: string;
}

function main(): void {
  try {
    const { jaggedMatrix, startPosition, endPosition } = dataFormatToJaggedMatrix(validMaps.basic.map);
    console.log('Jagged Matrix:', jaggedMatrix);





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