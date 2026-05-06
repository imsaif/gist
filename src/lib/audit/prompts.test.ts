import { describe, it, expect } from 'vitest';
import { buildAuditPrompt, buildAnalysisPrompt, getMockAnalysis } from './prompts';

describe('buildAuditPrompt', () => {
  it('includes the URL in the prompt', () => {
    const prompt = buildAuditPrompt('https://example.com', 'Site content here');
    expect(prompt).toContain('https://example.com');
  });

  it('includes the site content', () => {
    const prompt = buildAuditPrompt('https://example.com', 'My product does X');
    expect(prompt).toContain('My product does X');
  });

  it('asks the four required questions', () => {
    const prompt = buildAuditPrompt('https://example.com', 'content');
    expect(prompt).toContain('What does this product do');
    expect(prompt).toContain('How does it work');
    expect(prompt).toContain('What makes it different');
    expect(prompt).toContain('Who is it for');
  });
});

describe('buildAnalysisPrompt', () => {
  it('includes both LLM responses', () => {
    const prompt = buildAnalysisPrompt('site', 'chatgpt says', 'claude says');
    expect(prompt).toContain('chatgpt says');
    expect(prompt).toContain('claude says');
  });

  it('truncates site content to 5000 chars', () => {
    const longContent = 'a'.repeat(6000);
    const prompt = buildAnalysisPrompt(longContent, 'gpt', 'claude');
    expect(prompt).toContain('[truncated]');
    expect(prompt).not.toContain(longContent);
  });

  it('truncates LLM responses to 2000 chars', () => {
    const longResponse = 'b'.repeat(3000);
    const prompt = buildAnalysisPrompt('site', longResponse, 'claude');
    expect(prompt).toContain('[truncated]');
    expect(prompt).not.toContain(longResponse);
  });

  it('does not truncate short content', () => {
    const prompt = buildAnalysisPrompt('short site', 'short gpt', 'short claude');
    expect(prompt).not.toContain('[truncated]');
  });

  it('includes conflict category definitions', () => {
    const prompt = buildAnalysisPrompt('site', 'gpt', 'claude');
    expect(prompt).toContain('contradiction');
    expect(prompt).toContain('fabrication');
    expect(prompt).toContain('category_conflict');
    expect(prompt).toContain('shared_inaccuracy');
    expect(prompt).toContain('audience_mismatch');
    expect(prompt).toContain('missing_differentiator');
    expect(prompt).toContain('pricing_confusion');
  });

  it('includes severity definitions', () => {
    const prompt = buildAnalysisPrompt('site', 'gpt', 'claude');
    expect(prompt).toContain('critical');
    expect(prompt).toContain('high');
  });

  it('includes evidence schema', () => {
    const prompt = buildAnalysisPrompt('site', 'gpt', 'claude');
    expect(prompt).toContain('chatgptSays');
    expect(prompt).toContain('claudeSays');
    expect(prompt).toContain('siteContent');
  });

  it('instructs to return empty gaps when LLMs agree', () => {
    const prompt = buildAnalysisPrompt('site', 'gpt', 'claude');
    expect(prompt).toContain('EMPTY gaps array');
    expect(prompt).toContain('"Good"');
  });

  it('includes JSON schema for expected response format', () => {
    const prompt = buildAnalysisPrompt('site', 'gpt', 'claude');
    expect(prompt).toContain('"gaps"');
    expect(prompt).toContain('"summary"');
    expect(prompt).toContain('"readabilityScore"');
    expect(prompt).toContain('"worstModel"');
    expect(prompt).toContain('"bestModel"');
  });

  it('instructs to exclude errored models', () => {
    const prompt = buildAnalysisPrompt('site', 'gpt', 'claude');
    expect(prompt).toContain('errored');
    expect(prompt).toContain('exclude');
  });
});

describe('getMockAnalysis', () => {
  it('returns valid GapAnalysis structure', () => {
    const mock = getMockAnalysis();
    expect(mock.gaps).toBeDefined();
    expect(Array.isArray(mock.gaps)).toBe(true);
    expect(mock.summary).toBeDefined();
    expect(mock.summary.totalGaps).toBe(mock.gaps.length);
  });

  it('has correct summary fields', () => {
    const mock = getMockAnalysis();
    expect(mock.summary.totalGaps).toBeGreaterThan(0);
    expect(mock.summary.criticalGaps).toBeGreaterThan(0);
    expect(['Poor', 'Partial', 'Good']).toContain(mock.summary.readabilityScore);
    expect(['chatgpt', 'claude']).toContain(mock.summary.worstModel);
    expect(['chatgpt', 'claude']).toContain(mock.summary.bestModel);
  });

  it('has gaps with valid severity and category', () => {
    const mock = getMockAnalysis();
    const validSeverities = ['critical', 'high'];
    const validCategories = [
      'contradiction',
      'fabrication',
      'category_conflict',
      'shared_inaccuracy',
      'audience_mismatch',
      'missing_differentiator',
      'pricing_confusion',
    ];
    for (const gap of mock.gaps) {
      expect(validSeverities).toContain(gap.severity);
      expect(validCategories).toContain(gap.category);
      expect(gap.id).toBeTruthy();
      expect(gap.description).toBeTruthy();
      expect(gap.whatFileNeeds).toBeTruthy();
      expect(gap.modelsAffected.length).toBeGreaterThan(0);
    }
  });

  it('has evidence on each gap', () => {
    const mock = getMockAnalysis();
    for (const gap of mock.gaps) {
      expect(gap.evidence).toBeDefined();
      // At least one evidence field should be present
      const ev = gap.evidence!;
      expect(ev.chatgptSays || ev.claudeSays || ev.siteContent).toBeTruthy();
    }
  });

  it('critical gap count matches actual critical gaps', () => {
    const mock = getMockAnalysis();
    const actualCritical = mock.gaps.filter((g) => g.severity === 'critical').length;
    expect(mock.summary.criticalGaps).toBe(actualCritical);
  });
});
