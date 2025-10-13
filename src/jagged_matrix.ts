import { Position, Direction } from './vector';

// Result type for the function
export type JaggedMatrixReturn = {
  jaggedMatrix: string[][];
  startPosition: Position | null;
  endPosition: Position | null;
};

// Creates a 2D map with all the characters provided
// Returns object with jaggedMatrix, startPosition, endPosition
export function dataFormatToJaggedMatrix(arrayMap: string[]): JaggedMatrixReturn {
  const jaggedMatrix: string[][] = [];
  let startPosition: Position | null = null;
  let endPosition: Position | null = null;

  // Find start char in map creation loop to save from looping again
  // Find also the end char in map creation
  for (let y = 0; y < arrayMap.length; y++) {
    const row = arrayMap[y] ?? '';
    const rowChars = row.split('');
    jaggedMatrix.push(rowChars);

    for (let x = 0; x < rowChars.length; x++) {
      const char = rowChars[x];

      if (char === '@' && startPosition === null) {
        startPosition = { x, y };
      }

      if (char === 'x' && endPosition === null) {
        endPosition = { x, y };
      }
    }
  }

  // Log if not found
  if (startPosition === null) {
    console.log('Start character @ not found!');
  }
  if (endPosition === null) {
    console.log('End character x not found!');
  }

  return {
    jaggedMatrix,
    startPosition,
    endPosition
  };
}

