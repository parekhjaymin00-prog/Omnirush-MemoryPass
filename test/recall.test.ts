import { describe, expect, it } from 'vitest';
import { recallMemories } from '../src/core/recall';
import type { Memory } from '../src/core/types';

const memory = (id: string, text: string, createdAt = '2026-10-19T00:00:00.000Z'): Memory => ({
  id, text, createdAt, category: 'note', importance: 3, pinned: false, shareable: true,
  archived: false, entities: { capitalizedPhrases: [], regexEntities: [], facts: {} }, facts: {},
});

describe('recallMemories', () => {
  it('ranks by TF-IDF similarity and explains shared terms', () => {
    const results = recallMemories([
      memory('dog', 'Dogs enjoy walks in the park'),
      memory('quantum', 'Quantum physics explains particles'),
    ], 'walks in the park');

    expect(results[0].memory.id).toBe('dog');
    expect(results[0].score).toBeGreaterThan(results[1].score);
    expect(results[0].explanation).toContain('shared keywords');
  });

  it('includes shared extracted entities in the explanation and honors limit', () => {
    const result = recallMemories([memory('one', 'Alice visits New York')], 'I met Alice in New York', { limit: 1 });
    expect(result).toHaveLength(1);
    expect(result[0].explanation).toContain('shared entities');
  });
});
