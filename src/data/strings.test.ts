import { describe, expect, it } from 'vitest';
import { strings } from './strings';

describe('strings', () => {
  it('has the same keys for es and fr', () => {
    expect(Object.keys(strings.fr).sort()).toEqual(Object.keys(strings.es).sort());
  });
});
