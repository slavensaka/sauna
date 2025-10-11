export const invalidMaps = {
  missingStart: {
    map: [
      '     -A---+',
      '          |',
      '  x-B-+   C',
      '      |   |',
      '      +---+'
    ],
    expectedError: 'Missing start character'
  },

  missingEnd: {
    map: [
      '   @--A---+',
      '          |',
      '    B-+   C',
      '      |   |',
      '      +---+'
    ],
    expectedError: 'Missing end character'
  },

  multipleStarts: {
    map: [
      '   @--A-@-+',
      '          |',
      '  x-B-+   C',
      '      |   |',
      '      +---+'
    ],
    expectedError: 'Multiple start characters'
  },

  forkInPath: {
    map: [
      '        x-B',
      '          |',
      '   @--A---+',
      '          |',
      '     x+   C',
      '      |   |',
      '      +---+'
    ],
    expectedError: 'Fork in path'
  },

  brokenPath: {
    map: [
      '   @--A-+',
      '        |',
      '         ',
      '        B-x'
    ],
    expectedError: 'Broken path'
  },

  multipleStartingPaths: {
    map: [
      '  x-B-@-A-x'
    ],
    expectedError: 'Multiple starting paths'
  },

  fakeTurn: {
    map: [
      '  @-A-+-B-x'
    ],
    expectedError: 'Fake turn'
  }
};