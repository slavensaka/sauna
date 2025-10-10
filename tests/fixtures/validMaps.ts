export const validMaps = {
  basic: {
    map: [
      '  @---A---+',
      '          |',
      '  x-B-+   C',
      '      |   |',
      '      +---+'
    ],
    expectedLetters: 'ACB',
    expectedPath: '@---A---+|C|+---+|+-B-x'
  },

  straightThroughIntersections: {
    map: [
      '  @',
      '  | +-C--+',
      '  A |    |',
      '  +---B--+',
      '    |      x',
      '    |      |',
      '    +---D--+'
    ],
    expectedLetters: 'ABCD',
    expectedPath: '@|A+---B--+|+--C-+|-||+---D--+|x'
  },

  lettersOnTurns: {
    map: [
      '  @---A---+',
      '          |',
      '  x-B-+   |',
      '      |   |',
      '      +---C'
    ],
    expectedLetters: 'ACB',
    expectedPath: '@---A---+|||C---+|+-B-x'
  }
};