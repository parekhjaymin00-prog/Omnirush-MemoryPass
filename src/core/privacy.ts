export type PrivacyFindingType =
  | 'email'
  | 'phone'
  | 'api-key'
  | 'credit-card'
  | 'aadhaar'
  | 'pan'
  | 'upi';

export interface PrivacyFinding {
  type: PrivacyFindingType;
  value: string;
  start: number;
  end: number;
  replacement: string;
}

export interface PrivacyResult {
  findings: PrivacyFinding[];
  redactedText: string;
}

const patterns: Array<{ type: PrivacyFindingType; pattern: RegExp }> = [
  { type: 'email', pattern: /\b[a-z0-9][a-z0-9._-]{1,254}@[a-z][a-z0-9.-]{1,62}\b/giu },
  { type: 'upi', pattern: /\b[a-z0-9][a-z0-9._-]{1,254}@[a-z][a-z0-9.-]{1,62}\b/giu },
  { type: 'api-key', pattern: /\b(?:sk|pk|rk|ghp|gho|github_pat|xoxb|xoxp|xoxa|xoxr|AKIA)[-_][A-Z0-9][A-Z0-9_-]{10,}\b|\b(?:api[_-]?key|access[_-]?token|auth[_-]?token|bearer)\s*[:=]\s*[^\s,;]+/giu },
  { type: 'pan', pattern: /\b[A-Z]{5}\d{4}[A-Z]\b/giu },
  { type: 'aadhaar', pattern: /(?<![\d -])(?:\d{4}[ -]\d{4}[ -]\d{4}|\d{12})(?![\d -])/g },
  { type: 'credit-card', pattern: /\b(?:\d[ -]?){13,19}\b/g },
  { type: 'phone', pattern: /(?<!\w)(?:\+?91[\s.-]?)?(?:[6-9]\d{4}[\s.-]?\d{5}|[6-9]\d{2}[\s.-]?\d{3}[\s.-]?\d{4}|\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})(?!\w)/g },
];

function passesLuhn(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let doubleDigit = false;
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index]);
    if (doubleDigit) { digit *= 2; if (digit > 9) digit -= 9; }
    sum += digit;
    doubleDigit = !doubleDigit;
  }
  return sum % 10 === 0;
}

function isValidFinding(type: PrivacyFindingType, value: string): boolean {
  if (type === 'credit-card') return passesLuhn(value);
  if (type === 'aadhaar') return value.replace(/\D/g, '').length === 12 && !/^0{4}/.test(value);
  return true;
}

export function detectSensitiveData(text: string): PrivacyFinding[] {
  const candidates: PrivacyFinding[] = [];
  for (const { type, pattern } of patterns) {
    for (const match of text.matchAll(pattern)) {
      const value = match[0];
      const start = match.index ?? 0;
      if (!isValidFinding(type, value)) continue;
      candidates.push({ type, value, start, end: start + value.length, replacement: `[REDACTED:${type}]` });
    }
  }
  candidates.sort((left, right) => left.start - right.start || right.end - left.end);
  const findings: PrivacyFinding[] = [];
  let coveredThrough = -1;
  for (const candidate of candidates) {
    if (candidate.start < coveredThrough) continue;
    findings.push(candidate);
    coveredThrough = candidate.end;
  }
  return findings;
}

export function redactSensitiveData(text: string): PrivacyResult {
  const findings = detectSensitiveData(text);
  let redactedText = '';
  let cursor = 0;
  for (const finding of findings) { redactedText += text.slice(cursor, finding.start) + finding.replacement; cursor = finding.end; }
  redactedText += text.slice(cursor);
  return { findings, redactedText };
}

export const scanPrivacy = detectSensitiveData;
export const redactPrivacy = redactSensitiveData;
