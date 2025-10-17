import { dataFormatToJaggedMatrix } from '../src/jagged_matrix';
import { followPathAndCollectLetters } from '../src/map';
import { validMaps } from './fixtures/validMaps';
import { invalidMaps } from './fixtures/invalidMaps';

/**
 * Acceptance tests for valid maps
 * Tests that the algorithm correctly navigates through valid maps,
 * collecting the expected letters and following the expected path
 */
describe('Valid Maps - Acceptance Tests', () => {
  // Test basic map with simple path and one intersection
  test('basic map', () => {
    const result = followPathAndCollectLetters(validMaps.basic.map);
    expect(result.collectedLetters).toBe(validMaps.basic.expectedLetters);
    expect(result.pathAsCharacters).toBe(validMaps.basic.expectedPath);
  });

  // Test map where path goes straight through intersections
  test('straight through intersections', () => {
    const result = followPathAndCollectLetters(validMaps.straightThroughIntersections.map);
    expect(result.collectedLetters).toBe(validMaps.straightThroughIntersections.expectedLetters);
    expect(result.pathAsCharacters).toBe(validMaps.straightThroughIntersections.expectedPath);
  });

  // Test map where letters are positioned at turn points
  test('letters on turns', () => {
    const result = followPathAndCollectLetters(validMaps.lettersOnTurns.map);
    expect(result.collectedLetters).toBe(validMaps.lettersOnTurns.expectedLetters);
    expect(result.pathAsCharacters).toBe(validMaps.lettersOnTurns.expectedPath);
  });

  // Test map with same letter at different positions - should collect each only once
  test('do not collect letter twice', () => {
    const result = followPathAndCollectLetters(validMaps.doNotCollectLetterTwice.map);
    expect(result.collectedLetters).toBe(validMaps.doNotCollectLetterTwice.expectedLetters);
    expect(result.pathAsCharacters).toBe(validMaps.doNotCollectLetterTwice.expectedPath);
  });

  // Test map with compact layout and multiple close intersections
  test('keep direction in compact space', () => {
    const result = followPathAndCollectLetters(validMaps.keepDirectionInCompactSpace.map);
    expect(result.collectedLetters).toBe(validMaps.keepDirectionInCompactSpace.expectedLetters);
    expect(result.pathAsCharacters).toBe(validMaps.keepDirectionInCompactSpace.expectedPath);
  });

  // Test that algorithm stops at 'x' and ignores any characters after it
  test('ignore stuff after end', () => {
    const result = followPathAndCollectLetters(validMaps.ignoreStuffAfterEnd.map);
    expect(result.collectedLetters).toBe(validMaps.ignoreStuffAfterEnd.expectedLetters);
    expect(result.pathAsCharacters).toBe(validMaps.ignoreStuffAfterEnd.expectedPath);
  });
});

/**
 * Acceptance tests for invalid maps
 * Tests that the algorithm correctly detects and throws errors
 * for various invalid map configurations
 */
describe('Invalid Maps - Acceptance Tests', () => {
  // Test map without '@' start character
  test('missing start character', () => {
    expect(() => {
      dataFormatToJaggedMatrix(invalidMaps.missingStart.map);
    }).toThrow();
  });


  // Test map without 'x' end character
  test('missing end character', () => {
    expect(() => {
      dataFormatToJaggedMatrix(invalidMaps.missingEnd.map);
    }).toThrow();
  });

  // Test map with more than one '@' start character
  test('multiple starts', () => {
    expect(() => {
      dataFormatToJaggedMatrix(invalidMaps.multipleStarts.map);
    }).toThrow();
  });

  // Test map where path splits into multiple directions (ambiguous)
  test('fork in path', () => {
    expect(() => {
      followPathAndCollectLetters(invalidMaps.forkInPath.map);
    }).toThrow();
  });

  // Test map where path has a gap (disconnected)
  test('broken path', () => {
    expect(() => {
      followPathAndCollectLetters(invalidMaps.brokenPath.map);
    }).toThrow();
  });

  // Test map where start has multiple valid directions to begin
  test('multiple starting paths', () => {
    expect(() => {
      followPathAndCollectLetters(invalidMaps.multipleStartingPaths.map);
    }).toThrow();
  });

  // Test map with '+' that's not actually an intersection (no perpendicular paths)
  test('fake turn', () => {
    expect(() => {
      followPathAndCollectLetters(invalidMaps.fakeTurn.map);
    }).toThrow();
  });
});
