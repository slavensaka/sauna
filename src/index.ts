import { validMaps } from '../tests/fixtures/validMaps';
import { followPathAndCollectLetters } from './map';

function main(): void {
  try {
    const result = followPathAndCollectLetters(validMaps.doNotCollectLetterTwice.map);

    console.log('Collected letters:', result.collectedLetters);
    console.log('Path as characters:', result.pathAsCharacters);

  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
  }
}

if (require.main === module) {
  main();
}