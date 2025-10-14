import { validMaps } from '../tests/fixtures/validMaps';
import { Position, Direction, DirectionValue, nextMove } from './vector';
import { approvedChar, isApprovedChar, getCorrectDirection, getCharacterAtPositionXY, okForDirection } from './map';
import { dataFormatToJaggedMatrix } from './jagged_matrix';
// The result output
type Output = {
  collectedLetters: string;
  pathAsCharacters: string;
}



function main(): void {
  // 2d jagged created, start found, now direction
  const { jaggedMatrix, startPosition, endPosition } = dataFormatToJaggedMatrix(validMaps.basic.map);
  let pathTraveled: string[] = [];
  // We have startPosition and even endPosition
  pathTraveled.push('@'); // we have start char
  const result = getCorrectDirection(jaggedMatrix, startPosition, endPosition);
  let firstNextDirection = result.direction
  let firstNextStepChar = result.nextStepChar
  
  let nextDirection: DirectionValue;
  let nextPositionUse: Position;
  let nextChar: string;

  let loop: number = 1;

  while (loop < 10) {
    try {

      let nowPosition = nextMove(startPosition, result.direction)
      const nowChar = getCharacterAtPositionXY(jaggedMatrix, nowPosition);
      const isOkChar = isApprovedChar(nowChar);
      if (isOkChar) {
        const result = getCorrectDirection(jaggedMatrix, nowPosition, endPosition);
        const trueForDirection = okForDirection(nowChar, result.direction)

        if(trueForDirection) {
          console.log(result)
        }
      }
      
      // let nextStep = getCorrectDirection(jaggedMatrix, nowPosition, endPosition);
      
      // nextDirection = nextStep.direction;
      // nextPositionUse = nextStep.nextStep;
      // nextChar = nextStep.nextStepChar;

      // let nextPosition = nextMove(nextPositionUse, nextDirection)

      // pathTraveled.push(nextChar);
      // console.log(nextPosition)
      // if (nextChar === approvedChar.end) {
      //   // path.push(currentChar);
      //   break;
      // }
      // console.group(nextChar.length)

      //   const validMoves = findValidNextMoves(
      //   map,
      //   currentPos,
      //   currentDir,
      //   currentChar
      // );







      loop++;
      // throw new Error('Break point');
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : String(error));
      return;
    }
  }
}

if (require.main === module) {
  main();
}

// Re-export functions for testing
export { isApprovedChar } from './map';
export { dataFormatToJaggedMatrix } from './jagged_matrix';