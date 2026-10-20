import { describe, expect, it } from 'vitest';
import { findContradictions, resolveContradictions } from '../src/core/contradictions';
import type { Memory } from '../src/core/types';

const memory = (id: string, createdAt: string, facts: Memory['facts']): Memory => ({
  id, text: '', createdAt, category: 'fact', importance: 3, pinned: false, shareable: true,
  archived: false, entities: { capitalizedPhrases: [], regexEntities: [], facts }, facts,
});

describe('contradictions', () => {
  it('finds conflicting location and workplace facts as pairs', () => {
    const older = memory('old', '2026-10-01T00:00:00.000Z', { livesIn: 'Boston', worksAt: 'Acme' });
    const newer = memory('new', '2026-10-02T00:00:00.000Z', { livesIn: 'Seattle', worksAt: 'Globex' });
    const pairs = findContradictions([older, newer]);
    expect(pairs).toHaveLength(2);
    expect(pairs.map((pair) => pair.factType)).toEqual(['livesIn', 'worksAt']);
    expect(pairs[0].older.id).toBe('old');
    expect(pairs[0].newer.id).toBe('new');
  });

  it('archives the older side without mutating the input', () => {
    const old = memory('old', '2026-10-01T00:00:00.000Z', { livesIn: 'Boston' });
    const current = memory('current', '2026-10-02T00:00:00.000Z', { livesIn: 'Seattle' });
    const resolved = resolveContradictions([old, current]);
    expect(resolved.find(({ id }) => id === 'old')?.archived).toBe(true);
    expect(resolved.find(({ id }) => id === 'current')?.archived).toBe(false);
    expect(old.archived).toBe(false);
  });
});
