import { validMaps } from '../tests/fixtures/validMaps';

// Defines the poisiton in 2D jagged matrices x,y
type Position = { x: number; y: number };

// Defines the current direction, can only be one
enum Direction {
  up = 'up',
  down = 'down',
  left = 'left',
  right = 'right'
}

// Full state of the worm going through 2d "maze", letters eaten, path traveresed, already collected letters
type FullState = {
  position: Position;
  direction: Direction;
  letters: string;
  path: string;
};

// The result output
type Output = {
  collectedLetters: string;
  pathAsCharacters: string;
}

// Jagged matrix holding our map
type JaggedMatrix = string[][];

// Approved characters 
const approved_char = {
  start: '@',
  end: 'x',
  horizontal_line: '-',
  vertical_line: '|',
  spin: '+',
  space: ' ',
  letter: /^[A-Z]$/ // real regex
} as const;


// If approved_char is expanded with more const it will work (true or false)
export function isApprovedChar(char: string): boolean {
  for (const key in approved_char) {
    const value = approved_char[key as keyof typeof approved_char];

    if (value instanceof RegExp) {
      if (value.test(char)) return true;
    } else if (value === char) {
      return true;
    }
  }
  return false;
}

// Creats a 2D map with all the characters provided
// Can be expanded with any other type of data format to turn it into a 2D map (jagged)
export function dataFormatToJaggedMatrix(arrayMap: string[]): JaggedMatrix {
  const jaggedMatrix: JaggedMatrix = [];

  for (let y = 0; y < arrayMap.length; y++) {
    const row = arrayMap[y] ?? '';
    jaggedMatrix.push(row.split(''));
  }
  return jaggedMatrix;
}

function main(): void {
  try {
    // console.log(exampleMap);

    // const pos: Position = { x: 1, y: 1 };
    // console.log(pos);

    // console.log(Direction.up);

    // const fullState: FullState = { position: pos, direction: Direction.up, letters: "ABC", path: "@---A---+", visitedLetters: new Set(["A"]) };
    // console.log(fullState);
    // let jaggedMatrix: JaggedMatrix;
    // jaggedMatrix = [['a', 'b', 'c'], ['d', 'e'], ['f']];
    // console.log(jaggedMatrix);

    // const char = 'G';
    // const isLetter = new RegExp(approved_char.letter).test(char);
    // console.log(isLetter);

    // // Examples
    // console.log(isApprovedChar('G'));
    // console.log(isApprovedChar('@'));
    // console.log(isApprovedChar('#'));

    // // Test the stringMapToJaggerMatrix function
    // const testMap = "abc\nde\nf";

    // const result = dataFormatToJaggedMatrix(secondMap);
    // console.log(result);

    console.log(validMaps.basic.map)

  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
  }
}

if (require.main === module) {
  main();
}