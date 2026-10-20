import { describe, expect, it } from 'vitest';
import { buildMemoryGraph } from '../src/core/graph';
import { filterGraphByCutoff, filterMemoriesByCutoff } from '../src/core/timeline';
import type { Memory } from '../src/core/types';

const makeMemory = (id: string, createdAt: string, text = 'shared unicode café'): Memory => ({
  id, text, createdAt, category: 'note', importance: 3, pinned: false, shareable: true, archived: false,
  entities: { capitalizedPhrases: [], regexEntities: [], facts: {} }, facts: {},
});

describe('timeline filters', () => {
  it('filters by cutoff, including duplicates and unicode text', () => {
    const memories = [makeMemory('old', '2026-10-01T00:00:00.000Z'), makeMemory('same', '2026-10-10T00:00:00.000Z'), makeMemory('same', '2026-10-10T00:00:00.000Z'), makeMemory('new', '2026-11-01T00:00:00.000Z')];
    expect(filterMemoriesByCutoff(memories, '2026-10-10T00:00:00.000Z').map(({ id }) => id)).toEqual(['old', 'same', 'same']);
  });

  it('filters graph nodes and edges and handles empty or corrupt cutoff input', () => {
    const memories = [makeMemory('old', '2026-10-01T00:00:00.000Z'), makeMemory('new', '2026-11-01T00:00:00.000Z')];
    const graph = buildMemoryGraph(memories, { similarityThreshold: 0 });
    expect(filterGraphByCutoff(graph, memories, '2026-10-15T00:00:00.000Z')).toEqual({ nodes: [{ id: 'old', text: 'shared unicode café' }], edges: [] });
    expect(filterMemoriesByCutoff([], '2026-10-15T00:00:00.000Z')).toEqual([]);
    expect(filterMemoriesByCutoff(memories, 'not-a-date')).toEqual([]);
  });
  it('excludes memories with invalid dates', () => {
    expect(filterMemoriesByCutoff([makeMemory('bad', 'not-a-date')], '2026-10-15T00:00:00.000Z')).toEqual([]);
  });
});
