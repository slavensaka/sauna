import { add } from '../../src/utils/math';

describe('Math Utils', () => {
  it('should add 2 + 2 = 4', () => {
    expect(add(2, 2)).toBe(4);
  });
});