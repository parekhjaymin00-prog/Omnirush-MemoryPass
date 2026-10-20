import { describe, expect, it } from 'vitest';
import { buildMemoryGraph } from '../src/core/graph';
import { findContradictions } from '../src/core/contradictions';
import { sampleMemories } from '../src/data/sample';

describe('sample memories', () => {
  it('loads a linked set with both expected contradiction types', () => { expect(sampleMemories).toHaveLength(25); expect(new Set(sampleMemories.map((memory) => memory.createdAt.slice(0, 10))).size).toBeGreaterThan(10); expect(buildMemoryGraph(sampleMemories, { similarityThreshold: 0.08 }).edges.length).toBeGreaterThan(0); const contradictions = findContradictions(sampleMemories); expect(contradictions.some((pair) => pair.factType === 'livesIn')).toBe(true); expect(contradictions.some((pair) => pair.factType === 'worksAt')).toBe(true); });
});
