import { describe, it, expect } from 'vitest';
import { parseGapAnalysis, sanitizeErrorForPrompt } from './parse';

const validGap = {
  id: 'g1',
  severity: 'critical',
  category: 'fabrication',
  description: 'desc',
  modelsAffected: ['chatgpt'],
  whatFileNeeds: 'fix',
};

describe('parseGapAnalysis', () => {
  it('parses a clean JSON response', () => {
    const out = parseGapAnalysis(JSON.stringify({ gaps: [validGap] }));
    expect(out.gaps).toHaveLength(1);
    expect(out.gaps[0].severity).toBe('critical');
  });

  it('extracts JSON from a response with leading prose', () => {
    const text = `Sure, here is the result:\n${JSON.stringify({ gaps: [validGap] })}`;
    const out = parseGapAnalysis(text);
    expect(out.gaps).toHaveLength(1);
  });

  it('throws when no JSON object is present', () => {
    expect(() => parseGapAnalysis('I cannot help with that.')).toThrow();
  });

  it('throws when gaps is not an array', () => {
    expect(() => parseGapAnalysis(JSON.stringify({ gaps: 'oops' }))).toThrow();
  });

  it('drops malformed gaps but keeps valid ones', () => {
    const out = parseGapAnalysis(
      JSON.stringify({
        gaps: [
          validGap,
          {
            severity: 'medium',
            category: 'fabrication',
            description: 'd',
            modelsAffected: ['chatgpt'],
            whatFileNeeds: 'f',
          }, // bad severity
          { ...validGap, modelsAffected: [] }, // empty models
          { ...validGap, category: 'made_up' }, // bad category
        ],
      })
    );
    expect(out.gaps).toHaveLength(1);
  });

  it('synthesizes id when missing', () => {
    const noId = { ...validGap };
    delete (noId as Record<string, unknown>).id;
    const out = parseGapAnalysis(JSON.stringify({ gaps: [noId] }));
    expect(out.gaps[0].id).toBe('conflict-1');
  });

  it('preserves draftFile when present', () => {
    const out = parseGapAnalysis(
      JSON.stringify({
        gaps: [],
        draftFile: { product: { name: 'X', description: null, audience: null } },
      })
    );
    expect(out.draftFile).toBeDefined();
  });
});

describe('sanitizeErrorForPrompt', () => {
  it('strips newlines', () => {
    expect(sanitizeErrorForPrompt('line1\nline2\nline3')).toBe('line1 line2 line3');
  });

  it('caps length', () => {
    expect(sanitizeErrorForPrompt('x'.repeat(500), 50)).toHaveLength(50);
  });

  it('collapses whitespace', () => {
    expect(sanitizeErrorForPrompt('  a   b\t\tc  ')).toBe('a b c');
  });
});
