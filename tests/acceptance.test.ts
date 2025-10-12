import { validMaps } from './fixtures/validMaps';

describe('Acceptance Tests for Sauna', () => {
  describe('Valid Basic Example', () => {
    it('Should solve basic example', () => {
      console.log(validMaps.basic.map);  
      expect(true).toBe(true);
    });
  });
  
});