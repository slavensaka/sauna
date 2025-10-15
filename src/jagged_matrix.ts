import { Position } from './vector';
import { approvedChar } from './map';

// Result type for the function
export type JaggedMatrixReturn = {
  jaggedMatrix: string[][];
  startPosition: Position;
  endPosition: Position;
};

// The result output
export type Output = {
  collectedLetters: string;
  pathAsCharacters: string;
}

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

      if (char === approvedChar.start && startPosition === null) {
        startPosition = { x, y };
      }

      if (char === approvedChar.end && endPosition === null) {
        endPosition = { x, y };
      }
    }
  }

  // Throw error if not found
  if (startPosition === null) {
    throw new Error(`Start character '${approvedChar.start}' not found in the map!`);
  }
  if (endPosition === null) {
    throw new Error(`End character '${approvedChar.end}' not found in the map!`);
  }

  return {
    jaggedMatrix,
    startPosition,
    endPosition
  };
}

