import { describe, it, expect } from 'vitest';
import {
  buildContextBlock,
  buildAuditContextBlock,
  getAuditInitialMessages,
  getCreateSystemPrompt,
  INITIAL_GIST_FILE,
} from './createPrompt';
import {
  createGistDesignFile,
  createFeature,
  createFeatureStates,
  createFeatureExecution,
} from './test-helpers';
import type { GapAnalysis } from '@/types/audit';

describe('buildContextBlock', () => {
  it('shows "(not set)" for empty file fields', () => {
    const ctx = buildContextBlock(INITIAL_GIST_FILE, null);
    expect(ctx).toContain('Name: (not set)');
    expect(ctx).toContain('Description: (not set)');
    expect(ctx).toContain('Audience: (not set)');
    expect(ctx).toContain('AI Approach: (not set)');
    expect(ctx).toContain('Features: (none yet)');
  });

  it('includes product name when set', () => {
    const file = createGistDesignFile({
      product: { name: 'Acme', description: null, audience: null, aiApproach: null },
    });
    const ctx = buildContextBlock(file, null);
    expect(ctx).toContain('Name: Acme');
  });

  it('includes positioning fields', () => {
    const file = createGistDesignFile({
      positioning: {
        category: 'SaaS',
        forWho: 'Teams',
        notForWho: 'Solo',
        comparisons: [{ id: 'c1', vs: 'Comp', difference: 'faster' }],
      },
    });
    const ctx = buildContextBlock(file, null);
    expect(ctx).toContain('Category: SaaS');
    expect(ctx).toContain('For: Teams');
    expect(ctx).toContain('Not for: Solo');
    expect(ctx).toContain('vs Comp: faster');
  });

  it('includes context fields', () => {
    const file = createGistDesignFile({
      context: { pricing: 'Free', integratesWith: ['Slack'], requires: ['API key'], stage: 'Beta' },
    });
    const ctx = buildContextBlock(file, null);
    expect(ctx).toContain('Pricing: Free');
    expect(ctx).toContain('Integrates with: Slack');
    expect(ctx).toContain('Requires: API key');
    expect(ctx).toContain('Stage: Beta');
  });

  it('serializes feature details', () => {
    const file = createGistDesignFile({
      features: [
        createFeature({
          id: 'search',
          name: 'Search',
          intent: { goal: 'Find items', coreAnxiety: 'Miss results', notTryingTo: ['browse'] },
          interactionModel: {
            primaryFlow: ['type', 'search'],
            keyInteractions: ['autocomplete'],
            errorHandling: ['retry'],
          },
          designDecisions: [{ id: 'dd-1', chose: 'Instant', over: 'Button', because: 'speed' }],
          patternsUsed: [
            {
              id: 'p-1',
              patternId: 'streaming-output',
              patternName: 'Streaming',
              usage: 'stream results',
            },
          ],
          constraints: [{ id: 'c-1', constraint: '<200ms', designResponse: 'cache' }],
          notThis: ['no pagination'],
          openQuestions: ['fuzzy?'],
        }),
      ],
    });
    const ctx = buildContextBlock(file, null);
    expect(ctx).toContain('Feature: Search (search)');
    expect(ctx).toContain('Goal: Find items');
    expect(ctx).toContain('Core Anxiety: Miss results');
    expect(ctx).toContain('Not trying to: browse');
    expect(ctx).toContain('Primary flow: type -> search');
    expect(ctx).toContain('Decisions: Instant over Button');
    expect(ctx).toContain('Patterns: Streaming');
    expect(ctx).toContain('Not this: no pagination');
    expect(ctx).toContain('Open questions: fuzzy?');
  });

  it('marks current feature with >>> markers', () => {
    const file = createGistDesignFile({
      features: [
        createFeature({ id: 'f1', name: 'Feature 1' }),
        createFeature({ id: 'f2', name: 'Feature 2' }),
      ],
    });
    const ctx = buildContextBlock(file, 'f2');
    expect(ctx).toContain('>>> CURRENTLY DISCUSSING');
    expect(ctx).toContain('<<<');
    // Feature 1 should not be marked
    const f1Index = ctx.indexOf('Feature 1');
    const markerIndex = ctx.indexOf('>>> CURRENTLY DISCUSSING');
    expect(markerIndex).toBeGreaterThan(f1Index);
  });

  it('includes states and execution in serialized features', () => {
    const file = createGistDesignFile({
      features: [
        createFeature({
          id: 'f1',
          states: createFeatureStates({ empty: 'placeholder', error: 'retry' }),
          execution: createFeatureExecution({ layout: 'grid', keyCopy: ['Click here'] }),
        }),
      ],
    });
    const ctx = buildContextBlock(file, null);
    expect(ctx).toContain('States:');
    expect(ctx).toContain('empty: placeholder');
    expect(ctx).toContain('Execution:');
    expect(ctx).toContain('layout: grid');
  });

  it('wraps output in === markers', () => {
    const ctx = buildContextBlock(INITIAL_GIST_FILE, null);
    expect(ctx).toContain('=== CURRENT FILE STATE ===');
    expect(ctx).toContain('=== END FILE STATE ===');
  });
});

describe('buildAuditContextBlock', () => {
  const mockAnalysis: GapAnalysis = {
    summary: {
      totalGaps: 3,
      criticalGaps: 1,
      readabilityScore: 'Partial',
      worstModel: 'chatgpt',
      bestModel: 'claude',
    },
    gaps: [
      {
        id: 'g1',
        severity: 'critical',
        category: 'competitor_blending',
        description: 'Models confuse this with competitors',
        modelsAffected: ['chatgpt', 'perplexity'],
        whatFileNeeds: 'Clear positioning section',
      },
      {
        id: 'g2',
        severity: 'high',
        category: 'missing_decisions',
        description: 'No design decisions documented',
        modelsAffected: ['chatgpt'],
        whatFileNeeds: 'Design decisions per feature',
      },
    ],
  };

  it('includes readability score', () => {
    const ctx = buildAuditContextBlock(mockAnalysis);
    expect(ctx).toContain('AI Readability Score: Partial');
  });

  it('includes gap counts', () => {
    const ctx = buildAuditContextBlock(mockAnalysis);
    expect(ctx).toContain('Total Gaps: 3 (1 critical)');
  });

  it('includes model info', () => {
    const ctx = buildAuditContextBlock(mockAnalysis);
    expect(ctx).toContain('Worst Model: chatgpt');
    expect(ctx).toContain('Best Model: claude');
  });

  it('lists gaps with severity and category labels', () => {
    const ctx = buildAuditContextBlock(mockAnalysis);
    expect(ctx).toContain('[CRITICAL] Competitor Blending');
    expect(ctx).toContain('[HIGH] Missing Decisions');
  });

  it('includes affected models and what file needs', () => {
    const ctx = buildAuditContextBlock(mockAnalysis);
    expect(ctx).toContain('Affected: chatgpt, perplexity');
    expect(ctx).toContain('File needs: Clear positioning section');
  });

  it('wraps in audit markers', () => {
    const ctx = buildAuditContextBlock(mockAnalysis);
    expect(ctx).toContain('=== AUDIT FINDINGS ===');
    expect(ctx).toContain('=== END AUDIT FINDINGS ===');
  });

  it('falls back to raw category when no label exists', () => {
    const analysis: GapAnalysis = {
      summary: {
        totalGaps: 1,
        criticalGaps: 0,
        readabilityScore: 'Poor',
        worstModel: 'chatgpt',
        bestModel: 'claude',
      },
      gaps: [
        {
          id: 'g1',
          severity: 'medium',
          category: 'unknown_cat' as never,
          description: 'test',
          modelsAffected: ['chatgpt'],
          whatFileNeeds: 'fix',
        },
      ],
    };
    const ctx = buildAuditContextBlock(analysis);
    expect(ctx).toContain('unknown_cat');
  });
});

describe('getAuditInitialMessages', () => {
  it('uses singular form for 1 gap', () => {
    const messages = getAuditInitialMessages(1);
    expect(messages).toHaveLength(1);
    expect(messages[0].content).toContain('1 gap was found');
    expect(messages[0].content).toContain('fixes this');
  });

  it('uses plural form for multiple gaps', () => {
    const messages = getAuditInitialMessages(5);
    expect(messages[0].content).toContain('5 gaps were found');
    expect(messages[0].content).toContain('fixes these');
  });

  it('returns assistant role messages', () => {
    const messages = getAuditInitialMessages(2);
    expect(messages[0].role).toBe('assistant');
  });
});

describe('getCreateSystemPrompt', () => {
  it('contains the pattern library', () => {
    const prompt = getCreateSystemPrompt();
    expect(prompt).toContain('Explainability');
    expect(prompt).toContain('explainability');
  });

  it('contains core instructions', () => {
    const prompt = getCreateSystemPrompt();
    expect(prompt).toContain('You are Gist');
    expect(prompt).toContain('gist.design');
    expect(prompt).toContain('<file_update>');
  });

  it('includes audit context when provided', () => {
    const auditCtx = '=== AUDIT FINDINGS ===\nTest audit data\n=== END AUDIT FINDINGS ===';
    const prompt = getCreateSystemPrompt(auditCtx);
    expect(prompt).toContain('Test audit data');
    expect(prompt).toContain('Audit Context');
  });

  it('omits audit context when not provided', () => {
    const prompt = getCreateSystemPrompt();
    expect(prompt).not.toContain('Audit Context');
  });
});
