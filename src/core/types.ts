import type { ExtractedEntities, MemoryFacts } from './entities';

/** A durable, shareable unit of user memory. */
export interface Memory {
  id: string;
  text: string;
  /** ISO 8601 timestamp, for example 2026-10-20T12:00:00.000Z. */
  createdAt: string;
  category: string;
  importance: 1 | 2 | 3 | 4 | 5;
  pinned: boolean;
  shareable: boolean;
  archived: boolean;
  entities: ExtractedEntities;
  facts: MemoryFacts;
}
