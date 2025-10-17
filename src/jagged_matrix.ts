// Jagged 2d Matrix
import { Position } from './vector';
import { approvedChar } from './map';

export let maxTraversalCount: number = 500;

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

/**
 * Converts an array of strings into a 2D jagged matrix and locates start/end positions
 * Parses the map to find the start character '@' and end character 'x'
 * Validates that exactly one start and one end exist in the map
 * 
 * @param arrayMap - Array of strings representing the map rows
 * @returns Object containing the jagged matrix, start position, and end position
 * @throws Error if start character is not found
 * @throws Error if end character is not found
 * @throws Error if multiple start characters are found
 * @throws Error if multiple end characters are found
 * 
 * Creates a 2D map with all the characters provided
 * Returns object with jaggedMatrix, startPosition, endPosition
 */
export function dataFormatToJaggedMatrix(arrayMap: string[]): JaggedMatrixReturn {
  const jaggedMatrix: string[][] = [];
  let startPosition: Position | null = null;
  let endPosition: Position | null = null;

  // Find start char in dataFormat
  // Find also the end char in map creation
  // If count if > 1 error
  let startCount = 0;
  let endCount = 0;

  // Create the jagged matrix so we can use it
  for (let y = 0; y < arrayMap.length; y++) {
    const row = arrayMap[y] ?? '';
    const rowChars = row.split('');
    jaggedMatrix.push(rowChars);

    for (let x = 0; x < rowChars.length; x++) {
      const char = rowChars[x];

      if (char === approvedChar.start) {
        startCount++;
        if (startPosition === null) {
          startPosition = { x, y };
        }
      }

      if (char === approvedChar.end) {
        endCount++;
        if (endPosition === null) {
          endPosition = { x, y };
        }
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

  // Throw error if multiple starts or ends found
  if (startCount > 1) {
    throw new Error(`Multiple start characters '${approvedChar.start}' found in the map!`);
  }
  if (endCount > 1) {
    throw new Error(`Multiple end characters '${approvedChar.end}' found in the map!`);
  }

  return {
    jaggedMatrix,
    startPosition,
    endPosition
  };
}

