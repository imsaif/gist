import { describe, it, expect } from 'vitest';
import { selectQuestions, MAX_QUESTIONS } from './questions';
import type { Gap } from '@/types/repo-audit';

const gap = (id: Gap['id']): Gap => ({ id, evidence: 'x' });

describe('selectQuestions', () => {
  it('returns nothing when there are no gaps', () => {
    expect(selectQuestions([])).toEqual([]);
  });

  it('maps a gap id to its question', () => {
    const [q] = selectQuestions([gap('no_negative_audience')]);
    expect(q.gapId).toBe('no_negative_audience');
    expect(q.prompt).toBe('Who is this deliberately not for?');
  });

  it('is stable: the same gaps always produce the same questions', () => {
    const gaps = [gap('no_comparison'), gap('no_audience')];
    expect(selectQuestions(gaps)).toEqual(selectQuestions(gaps));
  });

  it('ranks by inferential impact, not input order', () => {
    const out = selectQuestions([gap('no_rationale'), gap('no_audience')]);
    expect(out.map((q) => q.gapId)).toEqual(['no_audience', 'no_rationale']);
  });

  it('caps at MAX_QUESTIONS', () => {
    const all: Gap[] = [
      gap('no_audience'),
      gap('no_negative_audience'),
      gap('no_boundary'),
      gap('no_comparison'),
      gap('no_rationale'),
    ];
    expect(selectQuestions([...all, ...all]).length).toBeLessThanOrEqual(MAX_QUESTIONS);
  });

  it('ignores duplicate gap ids', () => {
    expect(selectQuestions([gap('no_audience'), gap('no_audience')]).length).toBe(1);
  });

  it('ignores unknown gap ids without throwing', () => {
    const bogus = { id: 'not_a_real_gap', evidence: 'x' } as unknown as Gap;
    expect(selectQuestions([bogus])).toEqual([]);
  });
});
