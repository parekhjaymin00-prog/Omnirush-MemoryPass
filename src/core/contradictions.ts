import { extractEntities, type MemoryFacts } from './entities';
import type { Memory } from './types';

export type ContradictoryFact = keyof MemoryFacts;

export interface ContradictionPair {
  memoryA: Memory;
  memoryB: Memory;
  factType: ContradictoryFact;
  values: [string, string];
  newer: Memory;
  older: Memory;
}

function factsFor(memory: Memory): MemoryFacts {
  const extracted = extractEntities(memory.text).facts;
  return { ...extracted, ...memory.entities.facts, ...memory.facts };
}

function timestamp(memory: Memory): number {
  const parsed = Date.parse(memory.createdAt);
  return Number.isFinite(parsed) ? parsed : 0;
}

/** Find pairs whose livesIn or worksAt facts disagree. */
export function findContradictions(memories: readonly Memory[]): ContradictionPair[] {
  const pairs: ContradictionPair[] = [];
  const factTypes: ContradictoryFact[] = ['livesIn', 'worksAt'];

  for (let left = 0; left < memories.length; left += 1) {
    for (let right = left + 1; right < memories.length; right += 1) {
      const leftFacts = factsFor(memories[left]);
      const rightFacts = factsFor(memories[right]);
      for (const factType of factTypes) {
        const leftValue = leftFacts[factType];
        const rightValue = rightFacts[factType];
        if (!leftValue || !rightValue || leftValue === rightValue) continue;
        const newer = timestamp(memories[left]) >= timestamp(memories[right]) ? memories[left] : memories[right];
        const older = newer === memories[left] ? memories[right] : memories[left];
        pairs.push({ memoryA: memories[left], memoryB: memories[right], factType, values: [leftValue, rightValue], newer, older });
      }
    }
  }

  return pairs;
}

/** Archive the older memory in each contradiction while preserving all other memory data. */
export function resolveContradictions(memories: readonly Memory[]): Memory[] {
  const resolved = memories.map((memory) => ({ ...memory }));
  const byId = new Map(resolved.map((memory) => [memory.id, memory]));
  for (const contradiction of findContradictions(memories)) {
    const older = byId.get(contradiction.older.id);
    if (older) older.archived = true;
  }
  return resolved;
}

export const detectContradictions = findContradictions;
