import { describe, expect, it } from 'vitest';
import { exportMemories, importMemories } from '../src/core/portable';
import type { Memory } from '../src/core/types';

const memory: Memory = {
  id: 'm1', text: 'Café 東京', createdAt: '2026-10-20T00:00:00.000Z', category: 'note', importance: 4,
  pinned: false, shareable: true, archived: false,
  entities: { capitalizedPhrases: [], regexEntities: [], facts: {} }, facts: {},
};

describe('portable memory exports', () => {
  it('round-trips unicode and duplicate memories', () => {
    const json = exportMemories([memory, memory], '2026-10-20T01:00:00.000Z');
    const result = importMemories(json);
    expect(result).toEqual({ ok: true, schemaVersion: 1, generatedAt: '2026-10-20T01:00:00.000Z', memories: [memory, memory] });
  });

  it('returns clear errors for corrupt input, wrong version, missing fields, and checksum changes', () => {
    expect(importMemories('{bad')).toEqual({ ok: false, error: 'Invalid JSON' });
    expect(importMemories(JSON.stringify({ schemaVersion: 2 }))).toEqual({ ok: false, error: 'Unsupported schema version: 2' });
    expect(importMemories(JSON.stringify({ schemaVersion: 1, generatedAt: '2026-10-20T00:00:00.000Z', memories: [] }))).toEqual({ ok: false, error: 'Missing checksum' });
    const parsed = JSON.parse(exportMemories([memory]));
    parsed.memories[0].text = 'tampered';
    expect(importMemories(JSON.stringify(parsed))).toEqual({ ok: false, error: 'Checksum mismatch' });
  });
  it('handles empty exports and rejects corrupt memory arrays', () => {
    const result = importMemories(exportMemories([]));
    expect(result.ok).toBe(true);
    expect(importMemories(JSON.stringify({ schemaVersion: 1, generatedAt: '2026-10-20T00:00:00.000Z', memories: [{}], checksum: '00000000' }))).toEqual({ ok: false, error: 'Missing or invalid memories' });
  });
});
