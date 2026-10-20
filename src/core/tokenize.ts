export const DEFAULT_STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for', 'from',
  'has', 'have', 'he', 'i', 'in', 'is', 'it', 'its', 'of', 'on', 'or',
  'that', 'the', 'their', 'there', 'they', 'this', 'to', 'was', 'we',
  'were', 'will', 'with', 'you', 'your',
]);

const suffixes = [
  ['ingly', ''], ['edly', ''], ['ing', ''], ['ed', ''], ['ies', 'y'],
  ['sses', 'ss'], ['s', ''],
] as const;

function stem(token: string): string {
  for (const [suffix, replacement] of suffixes) {
    if (token.endsWith(suffix) && token.length - suffix.length >= 3) {
      let candidate = `${token.slice(0, -suffix.length)}${replacement}`;
      if (suffix === 'ing' && /([b-df-hj-np-tv-z])\1$/.test(candidate)) {
        candidate = candidate.slice(0, -1);
      }
      if (candidate.length >= 2) return candidate;
    }
  }
  return token;
}

export function tokenize(
  input: string,
  stopwords: ReadonlySet<string> = DEFAULT_STOPWORDS,
): string[] {
  if (!input) return [];

  return (input.normalize('NFKC').toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [])
    .filter((token) => !stopwords.has(token))
    .map(stem);
}
