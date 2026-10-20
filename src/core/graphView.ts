import type { GraphEdge } from './graph';

export function truncateLabel(text: string, maxLength = 28): string {
  const normalized = text.trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, Math.max(1, maxLength - 1)).trimEnd()}…`;
}

export function getNeighborIds(nodeId: string, edges: readonly GraphEdge[]): Set<string> {
  const neighbors = new Set<string>();
  for (const edge of edges) {
    const source = typeof edge.source === 'string' ? edge.source : (edge.source as { id: string }).id;
    const target = typeof edge.target === 'string' ? edge.target : (edge.target as { id: string }).id;
    if (source === nodeId) neighbors.add(target);
    if (target === nodeId) neighbors.add(source);
  }
  return neighbors;
}
