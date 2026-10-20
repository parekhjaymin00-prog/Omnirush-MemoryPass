import type { Memory } from './core/types';

export const STORAGE_KEY = 'memorypass.memories.v1';
export const STORAGE_SCHEMA_VERSION = 1;

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

interface StoredMemories {
  schemaVersion: number;
  memories: Memory[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isMemory(value: unknown): value is Memory {
  if (!isRecord(value)) return false;
  const entities = value.entities;
  const facts = value.facts;
  return typeof value.id === 'string' && typeof value.text === 'string'
    && typeof value.createdAt === 'string' && Number.isFinite(Date.parse(value.createdAt))
    && typeof value.category === 'string' && typeof value.importance === 'number'
    && Number.isInteger(value.importance) && value.importance >= 1 && value.importance <= 5
    && typeof value.pinned === 'boolean' && typeof value.shareable === 'boolean'
    && typeof value.archived === 'boolean' && isRecord(entities)
    && Array.isArray(entities.capitalizedPhrases)
    && entities.capitalizedPhrases.every((entry) => typeof entry === 'string')
    && Array.isArray(entities.regexEntities)
    && entities.regexEntities.every((entry) => isRecord(entry) && typeof entry.type === 'string' && typeof entry.value === 'string')
    && isRecord(entities.facts) && Object.values(entities.facts).every((entry) => typeof entry === 'string')
    && isRecord(facts) && Object.values(facts).every((entry) => typeof entry === 'string');
}

export function loadMemories(storage: StorageLike): Memory[] {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.schemaVersion !== STORAGE_SCHEMA_VERSION || !Array.isArray(parsed.memories)) return [];
    if (!parsed.memories.every(isMemory)) return [];
    return parsed.memories.map((memory) => ({ ...memory, entities: { ...memory.entities, facts: { ...memory.entities.facts } }, facts: { ...memory.facts } }));
  } catch {
    return [];
  }
}

export function saveMemories(storage: StorageLike, memories: readonly Memory[]): boolean {
  try {
    const payload: StoredMemories = { schemaVersion: STORAGE_SCHEMA_VERSION, memories: memories.map((memory) => ({ ...memory })) };
    storage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}

export function resetMemories(storage: StorageLike): boolean {
  try {
    storage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
