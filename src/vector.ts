// Vector 

// Defines the poisiton in 2D jagged matrices x,y
export type Position = { x: number; y: number };

// Defines the current direction, can only be one
export enum Direction {
  up = 'up',
  down = 'down',
  left = 'left',
  right = 'right'
};

// Full state of the worm going through 2d "maze", letters eaten, path traveresed, already collected letters
// type FullState = {
//   position: Position;
//   direction: Direction;
//   letters: string;
//   path: string;
// };