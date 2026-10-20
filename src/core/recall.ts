import { extractEntities, type ExtractedEntities } from './entities';
import { cosineSimilarity, buildTfIdfVectors } from './similarity';
import { tokenize } from './tokenize';
import type { Memory } from './types';

export interface RecallOptions {
  /** Maximum number of memories to return. Defaults to all memories. */
  limit?: number;
  /** Maximum recency contribution to the score. */
  recencyBoost?: number;
}

export interface RecallResult {
  memory: Memory;
  score: number;
  explanation: string;
}

function entityValues(entities: ExtractedEntities): string[] {
  return [
    ...entities.capitalizedPhrases,
    ...entities.regexEntities.map((entity) => entity.value),
    ...Object.values(entities.facts),
  ];
}

function recencyFactor(createdAt: string): number {
  const timestamp = Date.parse(createdAt);
  if (!Number.isFinite(timestamp)) return 0;
  const ageDays = Math.max(0, (Date.now() - timestamp) / 86_400_000);
  return Math.exp(-ageDays / 30);
}

function explain(sharedKeywords: string[], sharedEntities: string[]): string {
  const parts: string[] = [];
  if (sharedKeywords.length > 0) parts.push(`shared keywords: ${sharedKeywords.join(', ')}`);
  if (sharedEntities.length > 0) parts.push(`shared entities: ${sharedEntities.join(', ')}`);
  return parts.length > 0 ? parts.join('; ') : 'matched by overall text similarity';
}

/** Rank memories against a query with TF-IDF cosine similarity and a small recency boost. */
export function recallMemories(
  memories: readonly Memory[],
  query: string,
  { limit = memories.length, recencyBoost = 0.05 }: RecallOptions = {},
): RecallResult[] {
  const queryTokens = tokenize(query);
  const queryEntities = extractEntities(query);
  const vectors = buildTfIdfVectors([queryTokens, ...memories.map((memory) => tokenize(memory.text))]);
  const queryVector = vectors[0];

  return memories
    .map((memory, index) => {
      const memoryTokens = tokenize(memory.text);
      const sharedKeywords = [...new Set(queryTokens.filter((token) => memoryTokens.includes(token)))];
      const memoryEntities = memory.entities ?? extractEntities(memory.text);
      const queryEntityValues = entityValues(queryEntities);
      const sharedEntities = [...new Set(queryEntityValues.filter((value) => entityValues(memoryEntities).includes(value)))];
      const similarity = cosineSimilarity(queryVector, vectors[index + 1]);
      const score = similarity + recencyBoost * recencyFactor(memory.createdAt);
      return { memory, score, explanation: explain(sharedKeywords, sharedEntities) };
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, Math.max(0, limit));
}

export const recall = recallMemories;
