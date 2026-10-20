import { describe, expect, it } from 'vitest';
import { buildPassport, selectShareableMemories } from '../src/core/passport';

describe('passport', () => {
  const memories = [
    { id: 'archived', text: 'old secret', importance: 10, pinned: true, shareable: true, archived: true },
    { id: 'normal', text: 'I prefer concise plans.', importance: 5, shareable: true, createdAt: '2025-01-01' },
    { id: 'pinned', text: 'My email is jane@example.com.', importance: 1, pinned: true, shareable: true, createdAt: '2024-01-01' },
    { id: 'recent', text: 'I work remotely on Fridays.', importance: 5, shareable: true, createdAt: '2026-01-01' },
  ];

  it('filters archived memories and orders pinned, importance, then recency', () => {
    expect(selectShareableMemories(memories).map(({ id }) => id)).toEqual(['pinned', 'recent', 'normal']);
  });

  it('skips non-shareable memories', () => {
    expect(selectShareableMemories([{ id: 'private', text: 'do not share', shareable: false }])).toEqual([]);
  });

  it('redacts selected memory text and respects the character budget', () => {
    const result = buildPassport(memories, { characterBudget: 42 });
    expect(result.text).toContain('[REDACTED:email]');
    expect(result.text).not.toContain('old secret');
    expect(result.text.length).toBeLessThanOrEqual(42);
    expect(result.findings).toHaveLength(1);
  });
  it('returns an empty passport for no shareable memories or zero budget', () => {
    expect(buildPassport([], { characterBudget: 100 })).toEqual({ text: '', memories: [], findings: [] });
    expect(selectShareableMemories(memories, { characterBudget: 0 })).toEqual([]);
  });
});
