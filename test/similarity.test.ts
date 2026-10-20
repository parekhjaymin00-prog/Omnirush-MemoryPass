import { describe, expect, it } from 'vitest';
import { buildTfIdfVectors, cosineSimilarity } from '../src/core/similarity';

describe('similarity', () => {
  it('builds TF-IDF vectors with a shared vocabulary', () => {
    const vectors = buildTfIdfVectors([['memory', 'memory'], ['graph', 'memory']]);

    expect(vectors).toHaveLength(2);
    expect(vectors[0]).toHaveLength(2);
    expect(vectors[0][1]).toBeGreaterThan(vectors[0][0]);
  });

  it('calculates cosine similarity and handles zero vectors', () => {
    expect(cosineSimilarity([1, 0], [1, 0])).toBeCloseTo(1);
    expect(cosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0);
    expect(cosineSimilarity([], [])).toBe(0);
  });
});
