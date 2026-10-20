import { extractEntities } from './entities';
import type { Memory } from './types';

export interface AddMemoryResult {
  memories: Memory[];
  added: Memory | null;
  error?: 'empty' | 'duplicate';
}

export function createMemory(id: string, text: string, category: string, importance: Memory['importance'], createdAt = new Date().toISOString()): Memory {
  const entities = extractEntities(text);
  return { id, text, createdAt, category, importance, pinned: importance >= 5, shareable: true, archived: false, entities, facts: entities.facts };
}

export function addMemoryToCollection(
  memories: readonly Memory[],
  rawText: string,
  category: string,
  importance: Memory['importance'],
  options: { id?: string; createdAt?: string } = {},
): AddMemoryResult {
  const text = rawText.trim();
  if (!text) return { memories: [...memories], added: null, error: 'empty' };
  if (memories.some((memory) => memory.text.trim() === text)) return { memories: [...memories], added: null, error: 'duplicate' };
  const added = createMemory(options.id ?? `memory-${Date.now()}`, text, category, importance, options.createdAt);
  return { memories: [added, ...memories], added };
}
