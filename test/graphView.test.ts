import { describe, expect, it } from 'vitest';
import { getNeighborIds, truncateLabel } from '../src/core/graphView';

describe('graph view helpers', () => {
  it('truncates labels without splitting the ellipsis contract', () => {
    expect(truncateLabel('  Short note  ', 20)).toBe('Short note');
    expect(truncateLabel('A very long memory label', 10)).toBe('A very lo…');
  });
  it('finds neighbors in either edge direction', () => {
    expect([...getNeighborIds('b', [{ source: 'a', target: 'b', weight: 0.5 }, { source: 'b', target: 'c', weight: 0.7 }])]).toEqual(['a', 'c']);
  });
});
