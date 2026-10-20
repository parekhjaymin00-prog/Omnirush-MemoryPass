import { describe, expect, it } from 'vitest';
import { extractEntities } from '../src/core/entities';

describe('extractEntities', () => {
  it('extracts capitalized phrases and simple personal facts', () => {
    const result = extractEntities('Alice Smith moved to New York. I live in New York and I work at Acme Labs.');

    expect(result.capitalizedPhrases).toEqual(['Alice Smith', 'New York', 'Acme Labs']);
    expect(result.facts).toEqual({ livesIn: 'New York', worksAt: 'Acme Labs' });
  });

  it('extracts common regex entities', () => {
    const result = extractEntities('Email jane@example.com, visit https://example.com on 2026-10-20 or call 555-123-4567.');

    expect(result.regexEntities).toEqual([
      { type: 'email', value: 'jane@example.com' },
      { type: 'url', value: 'https://example.com' },
      { type: 'date', value: '2026-10-20' },
      { type: 'phone', value: '555-123-4567' },
    ]);
  });
  it('returns empty collections for empty and unicode-only text', () => {
    expect(extractEntities('')).toEqual({ capitalizedPhrases: [], regexEntities: [], facts: {} });
    expect(extractEntities('東京 café')).toEqual({ capitalizedPhrases: [], regexEntities: [], facts: {} });
  });
});
