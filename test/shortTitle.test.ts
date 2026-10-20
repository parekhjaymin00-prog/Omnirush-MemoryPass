import { describe, expect, it } from 'vitest';
import { shortTitle } from '../src/core/shortTitle';

const entities = (capitalizedPhrases: string[]) => ({ capitalizedPhrases, regexEntities: [], facts: {} });

describe('shortTitle', () => {
  it('prefers a detected entity and limits it to three words', () => {
    expect(shortTitle({ text: 'Met Jordan at the studio', entities: entities(['Jordan']) })).toBe('Jordan');
    expect(shortTitle({ text: 'Discussed a project', entities: entities(['The Very Important Project']) })).toBe('The Very Important');
  });

  it('falls back to distinct keywords', () => {
    expect(shortTitle({ text: 'I love quiet morning walks', entities: entities([]) })).toBe('love quiet morning');
  });

  it('returns a readable fallback for empty text', () => {
    expect(shortTitle({ text: '', entities: entities([]) })).toBe('Memory');
  });
});
