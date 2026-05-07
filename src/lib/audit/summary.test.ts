import { describe, it, expect } from 'vitest';
import { deriveReadabilityScore, deriveSummary } from './summary';
import type { Gap, LLMResponse } from '@/types/audit';

function gap(severity: 'critical' | 'high', models: ('chatgpt' | 'claude')[] = ['chatgpt']): Gap {
  return {
    id: 'g',
    severity,
    category: 'contradiction',
    description: '',
    modelsAffected: models,
    whatFileNeeds: '',
  };
}

const ok: LLMResponse = { model: 'chatgpt', content: 'x', durationMs: 1 };
const errored: LLMResponse = { model: 'chatgpt', content: '', durationMs: 1, error: 'boom' };

describe('deriveReadabilityScore', () => {
  it('returns Good with no gaps', () => {
    expect(deriveReadabilityScore([])).toBe('Good');
  });

  it('returns Partial with 1-2 high and no critical', () => {
    expect(deriveReadabilityScore([gap('high')])).toBe('Partial');
    expect(deriveReadabilityScore([gap('high'), gap('high')])).toBe('Partial');
  });

  it('returns Poor with any critical', () => {
    expect(deriveReadabilityScore([gap('critical')])).toBe('Poor');
  });

  it('returns Poor with 3+ gaps regardless of severity mix', () => {
    expect(deriveReadabilityScore([gap('high'), gap('high'), gap('high')])).toBe('Poor');
  });
});

describe('deriveSummary', () => {
  it('counts totalGaps and criticalGaps', () => {
    const s = deriveSummary([gap('critical'), gap('high')], { chatgpt: ok, claude: ok });
    expect(s.totalGaps).toBe(2);
    expect(s.criticalGaps).toBe(1);
  });

  it('picks worstModel as the one named in more gaps', () => {
    const s = deriveSummary(
      [gap('high', ['chatgpt']), gap('high', ['chatgpt']), gap('high', ['claude'])],
      { chatgpt: ok, claude: ok }
    );
    expect(s.worstModel).toBe('chatgpt');
    expect(s.bestModel).toBe('claude');
  });

  it('breaks ties toward the model that actually answered', () => {
    const s = deriveSummary([gap('high', ['chatgpt']), gap('high', ['claude'])], {
      chatgpt: errored,
      claude: ok,
    });
    expect(s.worstModel).toBe('claude');
    expect(s.bestModel).toBe('chatgpt');
  });
});
