import { redactSensitiveData, type PrivacyFinding } from './privacy';

export interface PassportMemory {
  id?: string;
  text: string;
  importance?: number;
  pinned?: boolean;
  archived?: boolean;
  createdAt?: string | number | Date;
  updatedAt?: string | number | Date;
}

export interface PassportOptions {
  characterBudget?: number;
  separator?: string;
}

export interface PassportResult {
  text: string;
  memories: PassportMemory[];
  findings: PrivacyFinding[];
}

function timestamp(memory: PassportMemory): number {
  const value = memory.updatedAt ?? memory.createdAt;
  if (value === undefined) return 0;
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'number') return value;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function compareMemories(left: PassportMemory, right: PassportMemory): number {
  if (Boolean(left.pinned) !== Boolean(right.pinned)) return left.pinned ? -1 : 1;
  const importance = (right.importance ?? 0) - (left.importance ?? 0);
  if (importance !== 0) return importance;
  const recency = timestamp(right) - timestamp(left);
  if (recency !== 0) return recency;
  return (left.id ?? '').localeCompare(right.id ?? '');
}

export function selectShareableMemories(
  memories: readonly PassportMemory[],
  { characterBudget = 4000, separator = '\n' }: PassportOptions = {},
): PassportMemory[] {
  if (characterBudget <= 0) return [];
  const selected: PassportMemory[] = [];
  let used = 0;
  for (const memory of memories.filter((candidate) => !candidate.archived).slice().sort(compareMemories)) {
    const redacted = redactSensitiveData(memory.text).redactedText;
    const cost = redacted.length + (selected.length > 0 ? separator.length : 0);
    if (used + cost > characterBudget) continue;
    selected.push(memory);
    used += cost;
  }
  return selected;
}

export function buildPassport(
  memories: readonly PassportMemory[],
  options: PassportOptions = {},
): PassportResult {
  const separator = options.separator ?? '\n';
  const selected = selectShareableMemories(memories, options);
  const findings: PrivacyFinding[] = [];
  const redactedTexts = selected.map((memory) => {
    const result = redactSensitiveData(memory.text);
    findings.push(...result.findings);
    return result.redactedText.replace(/\s+/g, ' ').trim();
  });
  return { text: redactedTexts.join(separator), memories: selected, findings };
}

export const generatePassport = buildPassport;
