export const validMaps = {
  basic: {
    map: [
      ' @---A---+',
      '         |',
      ' x-B-+   C',
      '     |   |',
      '     +---+'
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
  },

  doNotCollectLetterTwice: {
    map: [
      '     +-O-N-+',
      '     |     |',
      '     |   +-I-+',
      ' @-G-O-+ | | |',
      '     | | +-+ E',
      '     +-+     S',
      '             |',
      '             x'
    ],
    expectedLetters: 'GOONIES',
    expectedPath: '@-G-O-+|+-+|O||+-O-N-+|I|+-+|+-I-+|ES|x'
  },

  keepDirectionInCompactSpace: {
    map: [
      ' +-L-+',
      ' |  +A-+',
      '@B+ ++ H',
      ' ++    x'
    ],
    expectedLetters: 'BLAH',
    expectedPath: '@B+++B|+-L-+A+++A-+Hx'
  },

  ignoreStuffAfterEnd: {
    map: [
      '  @-A--+',
      '       |',
      '       +-B--x-C--D'
    ],
    expectedLetters: 'AB',
    expectedPath: '@-A--+|+-B--x'
  }
};