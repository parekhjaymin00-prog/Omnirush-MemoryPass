import { describe, expect, it } from 'vitest';
import { addMemoryToCollection } from '../src/core/memoryActions';
import type { Memory } from '../src/core/types';

const existing: Memory = { id: 'old', text: 'Existing note', createdAt: '2026-10-20T00:00:00.000Z', category: 'note', importance: 3, pinned: false, shareable: true, archived: false, entities: { capitalizedPhrases: [], regexEntities: [], facts: {} }, facts: {} };

describe('addMemoryToCollection', () => {
  it('rejects empty and whitespace-only text visibly through an error result', () => {
    expect(addMemoryToCollection([], '', 'note', 3).error).toBe('empty');
    expect(addMemoryToCollection([], '   
  ', 'note', 3).error).toBe('empty');
  });
  it('adds trimmed text with extracted entities and handles duplicates without mutation', () => {
    const result = addMemoryToCollection([existing], '  I live in Kyoto.  ', 'place', 4, { id: 'new', createdAt: '2026-10-21T00:00:00.000Z' });
    expect(result.added?.text).toBe('I live in Kyoto.');
    expect(result.added?.facts.livesIn).toBe('Kyoto');
    expect(result.memories.map(({ id }) => id)).toEqual(['new', 'old']);
    const duplicate = addMemoryToCollection(result.memories, ' I live in Kyoto. ', 'place', 4);
    expect(duplicate.error).toBe('duplicate');
    expect(duplicate.memories).toHaveLength(2);
  });
});
