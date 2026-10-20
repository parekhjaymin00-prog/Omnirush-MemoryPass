export type TokenDocument = readonly string[];

export function buildTfIdfVectors(documents: readonly TokenDocument[]): number[][] {
  const vocabulary = [...new Set(documents.flat())].sort();
  const documentCount = documents.length;

  return documents.map((document) => {
    const counts = new Map<string, number>();
    for (const token of document) counts.set(token, (counts.get(token) ?? 0) + 1);

    return vocabulary.map((term) => {
      const termFrequency = (counts.get(term) ?? 0) / Math.max(document.length, 1);
      const documentFrequency = documents.reduce(
        (count, candidate) => count + (candidate.includes(term) ? 1 : 0),
        0,
      );
      const inverseDocumentFrequency = Math.log((documentCount + 1) / (documentFrequency + 1)) + 1;
      return termFrequency * inverseDocumentFrequency;
    });
  });
}

export function cosineSimilarity(left: readonly number[], right: readonly number[]): number {
  const size = Math.max(left.length, right.length);
  let dotProduct = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;

  for (let index = 0; index < size; index += 1) {
    const leftValue = left[index] ?? 0;
    const rightValue = right[index] ?? 0;
    dotProduct += leftValue * rightValue;
    leftMagnitude += leftValue ** 2;
    rightMagnitude += rightValue ** 2;
  }

  if (leftMagnitude === 0 || rightMagnitude === 0) return 0;
  return dotProduct / Math.sqrt(leftMagnitude * rightMagnitude);
}
