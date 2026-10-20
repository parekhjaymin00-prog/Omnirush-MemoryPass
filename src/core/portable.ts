import type { ExtractedEntities, MemoryFacts, RegexEntity } from './entities';
import type { Memory } from './types';

export const MEMORY_SCHEMA_VERSION = 1;

export interface MemoryExport {
  schemaVersion: number;
  generatedAt: string;
  memories: Memory[];
  checksum: string;
}

export type ImportMemoryResult =
  | { ok: true; schemaVersion: number; generatedAt: string; memories: Memory[] }
  | { ok: false; error: string };

function canonicalPayload(schemaVersion: number, generatedAt: string, memories: readonly Memory[]): string {
  return JSON.stringify({ schemaVersion, generatedAt, memories });
}

function checksum(value: string): string {
  let hash = 2166136261;
  for (const character of value) {
    hash ^= character.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isRegexEntity(value: unknown): value is RegexEntity {
  return isRecord(value) && typeof value.type === 'string' && typeof value.value === 'string';
}

function isFacts(value: unknown): value is MemoryFacts {
  return isRecord(value) && Object.values(value).every((entry) => typeof entry === 'string');
}

function isEntities(value: unknown): value is ExtractedEntities {
  return isRecord(value)
    && Array.isArray(value.capitalizedPhrases)
    && value.capitalizedPhrases.every((entry) => typeof entry === 'string')
    && Array.isArray(value.regexEntities)
    && value.regexEntities.every(isRegexEntity)
    && isFacts(value.facts);
}

function isMemory(value: unknown): value is Memory {
  if (!isRecord(value)) return false;
  return typeof value.id === 'string'
    && typeof value.text === 'string'
    && typeof value.createdAt === 'string'
    && Number.isFinite(Date.parse(value.createdAt))
    && typeof value.category === 'string'
    && typeof value.importance === 'number'
    && Number.isInteger(value.importance)
    && value.importance >= 1
    && value.importance <= 5
    && typeof value.pinned === 'boolean'
    && typeof value.shareable === 'boolean'
    && typeof value.archived === 'boolean'
    && isEntities(value.entities)
    && isFacts(value.facts);
}

export function exportMemories(memories: readonly Memory[], generatedAt = new Date().toISOString()): string {
  const payload = { schemaVersion: MEMORY_SCHEMA_VERSION, generatedAt, memories: memories.map((memory) => ({ ...memory })) };
  return JSON.stringify({ ...payload, checksum: checksum(canonicalPayload(payload.schemaVersion, payload.generatedAt, payload.memories)) });
}

export function importMemories(input: string): ImportMemoryResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(input);
  } catch {
    return { ok: false, error: 'Invalid JSON' };
  }
  if (!isRecord(parsed)) return { ok: false, error: 'Export must be an object' };
  if (parsed.schemaVersion !== MEMORY_SCHEMA_VERSION) return { ok: false, error: `Unsupported schema version: ${String(parsed.schemaVersion)}` };
  if (typeof parsed.generatedAt !== 'string' || !Number.isFinite(Date.parse(parsed.generatedAt))) return { ok: false, error: 'Missing or invalid generatedAt' };
  if (!Array.isArray(parsed.memories) || !parsed.memories.every(isMemory)) return { ok: false, error: 'Missing or invalid memories' };
  if (typeof parsed.checksum !== 'string') return { ok: false, error: 'Missing checksum' };
  const expected = checksum(canonicalPayload(parsed.schemaVersion, parsed.generatedAt, parsed.memories));
  if (parsed.checksum !== expected) return { ok: false, error: 'Checksum mismatch' };
  return { ok: true, schemaVersion: parsed.schemaVersion, generatedAt: parsed.generatedAt, memories: parsed.memories.map((memory) => ({ ...memory })) };
}

export const serializeMemories = exportMemories;
export const deserializeMemories = importMemories;
