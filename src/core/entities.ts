export type RegexEntityType = 'email' | 'url' | 'date' | 'phone';

export interface RegexEntity {
  type: RegexEntityType;
  value: string;
}

export interface MemoryFacts {
  livesIn?: string;
  worksAt?: string;
}

export interface ExtractedEntities {
  capitalizedPhrases: string[];
  regexEntities: RegexEntity[];
  facts: MemoryFacts;
}

const capitalizedWord = `[A-ZÀ-ÖØ-Þ][\\p{L}\\p{M}'-]*`;

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

export function extractEntities(text: string): ExtractedEntities {
  const capitalizedPhrases = unique(
    [...text.matchAll(new RegExp(`\\b${capitalizedWord}(?:\\s+${capitalizedWord})*`, 'gu'))]
      .map((match) => match[0].trim())
      .filter((phrase) => phrase !== 'I' && phrase !== 'The' && phrase !== 'A'),
  );

  const regexEntities: RegexEntity[] = [];
  const patterns: Array<[RegexEntityType, RegExp]> = [
    ['email', /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/giu],
    ['url', /\bhttps?:\/\/[^\s]+/giu],
    ['date', /\b(?:\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4})\b/g],
    ['phone', /\b(?:\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}\b/g],
  ];

  for (const [type, pattern] of patterns) {
    for (const match of text.matchAll(pattern)) {
      regexEntities.push({ type, value: match[0] });
    }
  }

  const facts: MemoryFacts = {};
  const livesIn = text.match(/\bI\s+live\s+in\s+([^.!?\n]+?)(?:\s+and\s+I\s+work\s+at|[.!?\n]|$)/i)?.[1]?.trim();
  const worksAt = text.match(/\bI\s+work\s+at\s+([^.!?\n]+)/i)?.[1]?.trim();
  if (livesIn) facts.livesIn = livesIn;
  if (worksAt) facts.worksAt = worksAt;

  return { capitalizedPhrases, regexEntities, facts };
}
