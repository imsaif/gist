import { describe, it, expect } from 'vitest';
import { buildGistFile, PLACEHOLDER } from './buildFile';

const base = { repo: 'widget', summary: 'A keyboard-first issue tracker.', answers: {} };

describe('buildGistFile', () => {
  it('includes the repo name and summary', () => {
    const out = buildGistFile(base);
    expect(out).toContain('# widget');
    expect(out).toContain('> A keyboard-first issue tracker.');
  });

  it('emits a placeholder for every unanswered section', () => {
    const out = buildGistFile(base);
    expect(out).toContain(PLACEHOLDER);
  });

  it('never invents content for an unanswered section', () => {
    const out = buildGistFile(base);
    const notFor = out.split('\n').find((l) => l.startsWith('- Not for:')) ?? '';
    expect(notFor).toContain(PLACEHOLDER);
  });

  it('uses the answer when one is given', () => {
    const out = buildGistFile({
      ...base,
      answers: { no_negative_audience: 'Teams who need custom workflows' },
    });
    expect(out).toContain('- Not for: Teams who need custom workflows');
    expect(out).not.toContain(`- Not for: ${PLACEHOLDER}`);
  });

  it('treats a whitespace-only answer as unanswered', () => {
    const out = buildGistFile({ ...base, answers: { no_negative_audience: '   ' } });
    expect(out).toContain(`- Not for: ${PLACEHOLDER}`);
  });

  it('always emits the required section headings', () => {
    const out = buildGistFile(base);
    for (const h of ['## Positioning', '### Not This']) expect(out).toContain(h);
  });

  it('contains no em-dashes', () => {
    expect(buildGistFile(base)).not.toContain('—');
  });
});
