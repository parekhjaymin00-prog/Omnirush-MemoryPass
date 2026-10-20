import { extractEntities } from './entities';
import type { Memory } from './types';

const fallbackStopwords = new Set(['remember', 'remembering', 'note', 'thing', 'stuff', 'today', 'tomorrow']);

/** Return a compact 1–3 word label suitable for a graph node. */
export function shortTitle(memory: Pick<Memory, 'text' | 'entities'>): string {
  const entities = memory.entities?.capitalizedPhrases ?? extractEntities(memory.text).capitalizedPhrases;
  const entity = entities.find((value) => value.trim().length > 0);
  if (entity) return entity.trim().split(/\s+/u).slice(0, 3).join(' ');

  const keywords = (memory.text.normalize('NFKC').toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [])
    .filter((word) => word.length > 1 && !fallbackStopwords.has(word))
    .filter((word, index, words) => words.indexOf(word) === index)
    .slice(0, 3);
  if (keywords.length > 0) return keywords.join(' ');
  return memory.text.trim().split(/\s+/u).slice(0, 3).join(' ') || 'Memory';
}
