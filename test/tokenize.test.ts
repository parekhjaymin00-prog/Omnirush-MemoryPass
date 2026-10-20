import { describe, expect, it } from 'vitest';
import { tokenize } from '../src/core/tokenize';

describe('tokenize', () => {
  it('lowercases, removes stopwords, and lightly stems words', () => {
    expect(tokenize('The runners were running quickly!')).toEqual(['runner', 'run', 'quickly']);
  });

  it('handles empty input and unicode text', () => {
    expect(tokenize('')).toEqual([]);
    expect(tokenize(' Café 東京 cats ')).toEqual(['café', '東京', 'cat']);
  });
});
