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
    let pathTraveled: string[] = [];
    // We have startPosition and even endPosition
    if (startPosition && endPosition) {
      pathTraveled.push('@');
      const initialDirection = getInitDirection(jaggedMatrix, startPosition, endPosition);
      console.log('initialDirection:', initialDirection)

      

      // for (let i = 0; i < jaggedMatrix.length; i++) {
      //   const row = jaggedMatrix[i];
      //   // console.log(row)
      //   if (row) {
      //     for (let j = 0; j < row.length; j++) {
            
           
      //       // console.log(startXY)
      //       // const startXY = getCharacterAtPositionXY(jaggedMatrix, startPosition);

      //       // console.log(`Position [${i}][${j}]: ${row[j]}`);
      //     }
      //   }
      // }








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