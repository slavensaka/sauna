// Vector 

// Defines the poisiton in 2D jagged matrices x,y
export type Position = { x: number; y: number };

// Defines the current direction, can only be one
export const Direction = {
  up: { name: 'up', oneStep: { x: 0, y: 1 } },
  down: { name: 'down', oneStep: { x: 0, y: -1 } },
  left: { name: 'left', oneStep: { x: -1, y: 0 } },
  right: { name: 'right', oneStep: { x: 1, y: 0 } }
} as const;

export type DirectionKey = keyof typeof Direction;
export type DirectionValue = typeof Direction[DirectionKey];

// Moving +1 on 2D map using the new Direction object
export function nextMove(position: Position, direction: DirectionValue): Position {
  return {
    x: position.x + direction.oneStep.x,
    y: position.y + direction.oneStep.y
  };
}

// Full state of the worm going through 2d "maze", letters eaten, path traveresed, already collected letters
// type FullState = {
//   position: Position;
//   direction: Direction;
//   letters: string;
//   path: string;
// };