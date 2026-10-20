import { cosineSimilarity, buildTfIdfVectors } from './similarity';
import { tokenize } from './tokenize';
import type { Memory } from './types';

export type GraphMemory = Pick<Memory, 'id' | 'text'>;
export interface GraphNode extends GraphMemory {}

export interface GraphEdge {
  source: string;
  target: string;
  weight: number;
}

export interface MemoryGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface GraphOptions {
  similarityThreshold?: number;
  maxDegree?: number;
}

export function buildMemoryGraph(
  memories: readonly GraphMemory[],
  { similarityThreshold = 0.2, maxDegree = 3 }: GraphOptions = {},
): MemoryGraph {
  const nodes = memories.map((memory) => ({ id: memory.id, text: memory.text }));
  if (nodes.length < 2 || maxDegree <= 0) return { nodes, edges: [] };

  const vectors = buildTfIdfVectors(nodes.map((memory) => tokenize(memory.text)));
  const candidates: GraphEdge[] = [];

  for (let left = 0; left < nodes.length; left += 1) {
    for (let right = left + 1; right < nodes.length; right += 1) {
      const weight = cosineSimilarity(vectors[left], vectors[right]);
      if (weight >= similarityThreshold) {
        candidates.push({ source: nodes[left].id, target: nodes[right].id, weight });
      }
    }
  }

  candidates.sort((left, right) => right.weight - left.weight);
  const degrees = new Map(nodes.map((node) => [node.id, 0]));
  const edges: GraphEdge[] = [];

  for (const candidate of candidates) {
    const sourceDegree = degrees.get(candidate.source) ?? 0;
    const targetDegree = degrees.get(candidate.target) ?? 0;
    if (sourceDegree >= maxDegree || targetDegree >= maxDegree) continue;
    edges.push(candidate);
    degrees.set(candidate.source, sourceDegree + 1);
    degrees.set(candidate.target, targetDegree + 1);
  }

  return { nodes, edges };
}
