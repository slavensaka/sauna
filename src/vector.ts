// Vector 

// Defines the poisiton in 2D jagged matrices x,y
export type Position = { x: number; y: number };

// Defines the current direction, can only be one
export const Direction = {
  up: { name: 'up', oneStep: { x: 0, y: -1 } },
  down: { name: 'down', oneStep: { x: 0, y: 1 } },
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

// Filter out backwards move (opposite direction)
export const getOppositeDirection = (dir: DirectionValue): string => {
        switch (dir.name) {
          case 'up': return 'down';
          case 'down': return 'up';
          case 'left': return 'right';
          case 'right': return 'left';
          default: return '';
        }
      };