import { describe, expect, it } from 'vitest';
import { buildMemoryGraph } from '../src/core/graph';

describe('buildMemoryGraph', () => {
  it('connects similar memories above a threshold', () => {
    const graph = buildMemoryGraph([
      { id: 'a', text: 'Dogs enjoy walks in the park' },
      { id: 'b', text: 'Dogs enjoy long walks outside' },
      { id: 'c', text: 'Quantum physics explains particles' },
    ], { similarityThreshold: 0.2 });

    expect(graph.nodes.map((node) => node.id)).toEqual(['a', 'b', 'c']);
    expect(graph.edges).toHaveLength(1);
    expect(new Set([graph.edges[0].source, graph.edges[0].target])).toEqual(new Set(['a', 'b']));
    expect(graph.edges[0].weight).toBeGreaterThan(0.2);
  });

  it('respects the maximum degree per node', () => {
    const graph = buildMemoryGraph([
      { id: 'a', text: 'memory graph notes' },
      { id: 'b', text: 'memory graph ideas' },
      { id: 'c', text: 'memory graph plans' },
      { id: 'd', text: 'memory graph tasks' },
    ], { similarityThreshold: 0, maxDegree: 1 });

    const degrees = new Map<string, number>();
    for (const edge of graph.edges) {
      degrees.set(edge.source, (degrees.get(edge.source) ?? 0) + 1);
      degrees.set(edge.target, (degrees.get(edge.target) ?? 0) + 1);
    }
    expect(Math.max(...degrees.values())).toBeLessThanOrEqual(1);
  });
  it('handles empty input and long duplicate text', () => {
    expect(buildMemoryGraph([])).toEqual({ nodes: [], edges: [] });
    const graph = buildMemoryGraph([{ id: 'a', text: '東京 '.repeat(1000) }, { id: 'b', text: '東京 ' .repeat(1000) }], { similarityThreshold: 0.9 });
    expect(graph.nodes).toHaveLength(2);
    expect(graph.edges).toHaveLength(1);
  });
});
