import type { MemoryGraph } from './graph';
import type { Memory } from './types';

function time(value: string): number {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

/** Keep memories created on or before the cutoff. Invalid dates are excluded. */
export function filterMemoriesByCutoff(memories: readonly Memory[], cutoff: string | Date): Memory[] {
  const cutoffTime = time(cutoff instanceof Date ? cutoff.toISOString() : cutoff);
  if (!Number.isFinite(cutoffTime)) return [];
  return memories.filter((memory) => {
    const createdAt = time(memory.createdAt);
    return Number.isFinite(createdAt) && createdAt <= cutoffTime;
  }).map((memory) => ({ ...memory }));
}

/** Filter graph nodes and retain only edges whose endpoints survive the cutoff. */
export function filterGraphByCutoff(
  graph: MemoryGraph,
  memories: readonly Memory[],
  cutoff: string | Date,
): MemoryGraph {
  const allowed = new Set(filterMemoriesByCutoff(memories, cutoff).map((memory) => memory.id));
  const nodes = graph.nodes.filter((node) => allowed.has(node.id)).map((node) => ({ ...node }));
  return {
    nodes,
    edges: graph.edges
      .filter((edge) => allowed.has(edge.source) && allowed.has(edge.target))
      .map((edge) => ({ ...edge })),
  };
}

export const filterTimeline = filterMemoriesByCutoff;
