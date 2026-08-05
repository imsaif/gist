import { describe, it, expect } from 'vitest';
import { parseReading } from './parse';

const ok = JSON.stringify({
  reading: 'A component library.',
  gaps: [{ id: 'no_audience', evidence: 'no audience named' }],
});

describe('parseReading', () => {
  it('parses a clean response', () => {
    expect(parseReading(ok).gaps).toHaveLength(1);
    expect(parseReading(ok).reading).toBe('A component library.');
  });

  it('extracts JSON from a fenced code block', () => {
    expect(parseReading('```json\n' + ok + '\n```').gaps).toHaveLength(1);
  });

  it('drops malformed gaps but keeps valid ones', () => {
    const mixed = JSON.stringify({
      reading: 'x',
      gaps: [{ id: 'no_audience', evidence: 'y' }, { id: 'bogus' }, 'nonsense', null],
    });
    expect(parseReading(mixed).gaps).toHaveLength(1);
  });

  it('deduplicates repeated gap ids', () => {
    const dupes = JSON.stringify({
      reading: 'x',
      gaps: [
        { id: 'no_audience', evidence: 'a' },
        { id: 'no_audience', evidence: 'b' },
      ],
    });
    expect(parseReading(dupes).gaps).toHaveLength(1);
  });

  it('returns zero gaps for a clean repo without throwing', () => {
    expect(parseReading(JSON.stringify({ reading: 'x', gaps: [] })).gaps).toEqual([]);
  });

  it('throws when there is no JSON at all', () => {
    expect(() => parseReading('the model refused')).toThrow();
  });

  it('throws when reading is missing', () => {
    expect(() => parseReading(JSON.stringify({ gaps: [] }))).toThrow();
  });
});
