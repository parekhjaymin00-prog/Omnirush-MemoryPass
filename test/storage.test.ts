import { describe, expect, it } from 'vitest';
import { loadMemories, resetMemories, saveMemories, STORAGE_KEY } from '../src/storage';
import type { Memory } from '../src/core/types';

const memory: Memory = { id: 'm1', text: 'Café note', createdAt: '2026-10-20T00:00:00.000Z', category: 'note', importance: 3, pinned: false, shareable: true, archived: false, entities: { capitalizedPhrases: [], regexEntities: [], facts: {} }, facts: {} };
const fake = () => { const values = new Map<string, string>(); return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); }, removeItem: (key: string) => { values.delete(key); } }; };

describe('memory storage', () => {
  it('round-trips, resets, and handles missing data', () => { const storage = fake(); expect(loadMemories(storage)).toEqual([]); expect(saveMemories(storage, [memory])).toBe(true); expect(storage.getItem(STORAGE_KEY)).toContain('schemaVersion'); expect(loadMemories(storage)).toEqual([memory]); expect(resetMemories(storage)).toBe(true); expect(loadMemories(storage)).toEqual([]); });
  it('returns an empty list for corrupt, wrong-version, or invalid data without throwing', () => { const storage = fake(); storage.setItem(STORAGE_KEY, '{bad'); expect(loadMemories(storage)).toEqual([]); storage.setItem(STORAGE_KEY, JSON.stringify({ schemaVersion: 2, memories: [memory] })); expect(loadMemories(storage)).toEqual([]); storage.setItem(STORAGE_KEY, JSON.stringify({ schemaVersion: 1, memories: [{ id: 'bad' }] })); expect(loadMemories(storage)).toEqual([]); });
});
