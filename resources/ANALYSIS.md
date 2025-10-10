# Software Sauna Code Challenge - Analysis

## Problem Overview
Build a path-following algorithm that:
1. Starts at `@` character
2. Follows connected path characters
3. Collects letters (A-Z) along the way
4. Stops at `x` character
5. Returns collected letters and full path

## Input/Output Requirements

### Input
- 2D character map (jagged array - rows can have different lengths)
- Valid characters: `@`, `x`, `A-Z`, `+`, `-`, `|`, ` ` (space)

### Output
- **Letters**: String of collected letters in order
- **Path**: String of all characters traversed

## Core Algorithm Components

### 1. Map Parsing & Validation
- Find start position (`@`)
- Find end position (`x`)
- Validate map structure

### 2. Path Following Logic
- Track current position (x, y coordinates)
- Track current direction (up, down, left, right)
- Move step by step following connected paths

### 3. Direction Rules
- `-` connects horizontally (left-right)
- `|` connects vertically (up-down)  
- `+` is intersection (can turn)
- Letters can be on path or turns
- Continue straight through intersections when possible

### 4. Letter Collection
- Collect letters when encountered
- Don't collect same letter from same position twice

## Valid Path Characters
- `@` - Start (exactly one required)
- `x` - End (exactly one required)
- `A-Z` - Letters to collect
- `+` - Intersection/turn
- `-` - Horizontal path
- `|` - Vertical path
- ` ` - Empty space (not walkable)

## Error Conditions to Handle
1. **Missing start** - No `@` character
2. **Missing end** - No `x` character  
3. **Multiple starts** - More than one `@`
4. **Multiple ends** - More than one `x`
5. **Fork in path** - Multiple valid directions from one position
6. **Broken path** - Dead end before reaching `x`
7. **Invalid characters** - Characters not in valid set
8. **Fake turn** - `+` with only 2 connections in straight line

## Algorithm Steps

### Phase 1: Initialization
1. Parse input map into 2D array
2. Find start position (`@`)
3. Validate single start exists
4. Find end position (`x`) 
5. Validate single end exists

## Data Structures Needed

### Position
```typescript
type Position {
  x: number;
  y: number;
}
```

### Direction
```typescript
enum Direction {
  up = 'up',
  down = 'down', 
  left = 'left',
  right = 'right'
}
```

### Full State (Position, Direction, Letters, Path, Visisted Letters)
```typescript
type FullState {
  position: Position;
  direction: Direction;
  letters: string;
  path: string;
  visitedLetters: Set<string>;
}
```

### Output (Letters, Path)
```typescript
type Output {
  letters: string;
  path: string;
}
```

## Test Cases to Implement

### Valid Maps (6 examples)
1. A Basic example 
2. Go straight through intersections
3. Letters may be found on turns
4. Do not collect letter from the same location twice
5. Keep direction, even in a compact space
6. Ignore stuff after end of path

### Invalid Maps (7 error cases)
1. Missing start character
2. Missing end character
3. Multiple starts
4. Fork in path
5. Broken path
6. Multiple starting paths
7. Fake turn

## Implementation Strategy

### 1. Start Simple
- Hard-code first test case
- Get basic path following working
- Add letter collection

### 2. Add Validation
- Check for required start/end
- Detect multiple starts
- Validate characters

### 3. Handle Edge Cases
- Intersections and turns
- Duplicate letter prevention
- Fork detection
- Broken path detection

### 4. Comprehensive Testing
- Unit tests for each component
- Integration tests for full examples
- Error case testing

## Key Challenges

1. **Direction Changes** - Detecting when to turn at intersections
2. **Fork Detection** - Ensuring only one valid path forward
3. **Jagged Arrays** - Handling variable row lengths safely
4. **Letter Deduplication** - Same letter at same position
5. **Boundary Checking** - Staying within map bounds

## Technology Stack
- **TypeScript** - Type safety and modern JavaScript features
- **Node.js** - Runtime environment
- **Jest** - Testing framework with ts-jest for TypeScript support

## Project Structure
```
src/
├── index.ts              # Main entry point

tests/
├── acceptance.test.ts   # Acceptance tests 
├── unit.test.ts          # Unit tests for validation
└── fixtures/
    ├── validMaps.ts      # Valid test case maps
    └── invalidMaps.ts    # Invalid test case maps
```

## Success Criteria
- All 6 valid examples produce correct output
- All 7 invalid examples throw appropriate errors
- Code is readable with small functions
- Comprehensive test coverage with Jest
- Logic separated from I/O scaffolding
- Full TypeScript type safety