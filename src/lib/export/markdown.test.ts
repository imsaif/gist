import { describe, it, expect } from 'vitest';
import { renderFullFeature, renderSummaryFeature, generateGistDesignMarkdown } from './markdown';
import {
  createFeature,
  createGistDesignFile,
  createFeatureStates,
  createFeatureExecution,
} from '../test-helpers';

describe('renderFullFeature', () => {
  it('renders feature name as h2', () => {
    const md = renderFullFeature(createFeature({ name: 'Search' }));
    expect(md).toContain('## Search');
  });

  it('renders intent section with goal', () => {
    const md = renderFullFeature(
      createFeature({ intent: { goal: 'Find items', coreAnxiety: null, notTryingTo: [] } })
    );
    expect(md).toContain('### Intent');
    expect(md).toContain('Find items');
  });

  it('renders core anxiety', () => {
    const md = renderFullFeature(
      createFeature({ intent: { goal: null, coreAnxiety: 'Missing results', notTryingTo: [] } })
    );
    expect(md).toContain('**Core Anxiety:** Missing results');
  });

  it('renders notTryingTo as bullet list', () => {
    const md = renderFullFeature(
      createFeature({
        intent: { goal: null, coreAnxiety: null, notTryingTo: ['browse', 'filter'] },
      })
    );
    expect(md).toContain('- browse');
    expect(md).toContain('- filter');
  });

  it('renders interaction model with numbered flow', () => {
    const md = renderFullFeature(
      createFeature({
        interactionModel: {
          primaryFlow: ['Type query', 'See results'],
          keyInteractions: [],
          errorHandling: [],
        },
      })
    );
    expect(md).toContain('1. Type query');
    expect(md).toContain('2. See results');
  });

  it('renders key interactions and error handling', () => {
    const md = renderFullFeature(
      createFeature({
        interactionModel: {
          primaryFlow: [],
          keyInteractions: ['Autocomplete'],
          errorHandling: ['Show retry'],
        },
      })
    );
    expect(md).toContain('- Autocomplete');
    expect(md).toContain('- Show retry');
  });

  it('renders design decisions', () => {
    const md = renderFullFeature(
      createFeature({
        designDecisions: [{ id: 'dd-1', chose: 'Inline edit', over: 'Modal', because: 'Faster' }],
      })
    );
    expect(md).toContain('Chose: Inline edit');
    expect(md).toContain('Over: Modal');
    expect(md).toContain('Because: Faster');
  });

  it('renders patterns with optional URL', () => {
    const md = renderFullFeature(
      createFeature({
        patternsUsed: [
          {
            id: 'p-1',
            patternId: 'explainability',
            patternName: 'Explainability',
            usage: 'Shows why',
            url: 'https://example.com',
          },
        ],
      })
    );
    expect(md).toContain('**Explainability**: Shows why');
    expect(md).toContain('[reference](https://example.com)');
  });

  it('renders patterns without URL', () => {
    const md = renderFullFeature(
      createFeature({
        patternsUsed: [
          { id: 'p-1', patternId: 'undo-redo', patternName: 'Undo/Redo', usage: 'Revert changes' },
        ],
      })
    );
    expect(md).toContain('**Undo/Redo**: Revert changes');
    expect(md).not.toContain('[reference]');
  });

  it('renders constraints', () => {
    const md = renderFullFeature(
      createFeature({
        constraints: [{ id: 'c-1', constraint: 'Max 5 results', designResponse: 'Paginate' }],
      })
    );
    expect(md).toContain('**Max 5 results**: Paginate');
  });

  it('renders notThis as bullet list', () => {
    const md = renderFullFeature(createFeature({ notThis: ['No infinite scroll'] }));
    expect(md).toContain('### Not This');
    expect(md).toContain('- No infinite scroll');
  });

  it('renders open questions as checkboxes', () => {
    const md = renderFullFeature(createFeature({ openQuestions: ['Add fuzzy matching?'] }));
    expect(md).toContain('- [ ] Add fuzzy matching?');
  });

  it('renders states section', () => {
    const md = renderFullFeature(
      createFeature({
        states: createFeatureStates({
          empty: 'Show placeholder',
          error: 'Retry button',
          edgeCases: ['Timeout'],
        }),
      })
    );
    expect(md).toContain('### States');
    expect(md).toContain('**Empty:** Show placeholder');
    expect(md).toContain('**Error:** Retry button');
    expect(md).toContain('- Timeout');
  });

  it('renders execution section', () => {
    const md = renderFullFeature(
      createFeature({
        execution: createFeatureExecution({
          layout: 'Grid',
          keyCopy: ['Search...'],
          stackAndComponents: 'React + Tailwind',
        }),
      })
    );
    expect(md).toContain('### Execution');
    expect(md).toContain('**Layout:** Grid');
    expect(md).toContain('- Search...');
    expect(md).toContain('**Stack & Components:** React + Tailwind');
  });

  it('omits sections that have no data', () => {
    const md = renderFullFeature(createFeature());
    expect(md).not.toContain('### Interaction Model');
    expect(md).not.toContain('### Design Decisions');
    expect(md).not.toContain('### Patterns Used');
    expect(md).not.toContain('### Constraints');
    expect(md).not.toContain('### Not This');
    expect(md).not.toContain('### Open Questions');
    expect(md).not.toContain('### States');
    expect(md).not.toContain('### Execution');
  });
});

describe('renderSummaryFeature', () => {
  it('renders feature name and intent goal', () => {
    const md = renderSummaryFeature(
      createFeature({
        name: 'Search',
        intent: { goal: 'Find items', coreAnxiety: null, notTryingTo: [] },
      })
    );
    expect(md).toContain('## Search');
    expect(md).toContain('Find items');
  });

  it('renders notThis section', () => {
    const md = renderSummaryFeature(createFeature({ notThis: ['No popups'] }));
    expect(md).toContain('### Not This');
    expect(md).toContain('- No popups');
  });

  it('omits sections not included in summary', () => {
    const md = renderSummaryFeature(
      createFeature({
        designDecisions: [{ id: 'dd-1', chose: 'A', over: 'B', because: 'C' }],
      })
    );
    expect(md).not.toContain('### Design Decisions');
  });
});

describe('generateGistDesignMarkdown', () => {
  it('renders product name as h1', () => {
    const file = createGistDesignFile({
      product: { name: 'Acme', description: null, audience: null, aiApproach: null },
    });
    const md = generateGistDesignMarkdown(file);
    expect(md).toContain('# Acme');
  });

  it('uses "Untitled Product" when name is null', () => {
    const file = createGistDesignFile();
    const md = generateGistDesignMarkdown(file);
    expect(md).toContain('# Untitled Product');
  });

  it('renders product description and audience', () => {
    const file = createGistDesignFile({
      product: {
        name: 'Acme',
        description: 'A tool for building',
        audience: 'Developers',
        aiApproach: null,
      },
    });
    const md = generateGistDesignMarkdown(file);
    expect(md).toContain('A tool for building');
    expect(md).toContain('**Audience:** Developers');
  });

  it('renders positioning section', () => {
    const file = createGistDesignFile({
      positioning: {
        category: 'SaaS',
        forWho: 'Teams',
        notForWho: 'Solo devs',
        comparisons: [{ id: 'c1', vs: 'CompA', difference: 'faster' }],
      },
    });
    const md = generateGistDesignMarkdown(file);
    expect(md).toContain('## Positioning');
    expect(md).toContain('**Category:** SaaS');
    expect(md).toContain('**For:** Teams');
    expect(md).toContain('**Not for:** Solo devs');
    expect(md).toContain('vs CompA: faster');
  });

  it('renders context section', () => {
    const file = createGistDesignFile({
      context: {
        pricing: 'Free',
        integratesWith: ['Slack', 'Jira'],
        requires: ['API key'],
        stage: 'Beta',
      },
    });
    const md = generateGistDesignMarkdown(file);
    expect(md).toContain('## Context');
    expect(md).toContain('**Pricing:** Free');
    expect(md).toContain('Slack, Jira');
    expect(md).toContain('**Stage:** Beta');
  });

  it('omits positioning section when empty', () => {
    const file = createGistDesignFile();
    const md = generateGistDesignMarkdown(file);
    expect(md).not.toContain('## Positioning');
  });

  it('omits context section when empty', () => {
    const file = createGistDesignFile();
    const md = generateGistDesignMarkdown(file);
    expect(md).not.toContain('## Context');
  });

  it('renders features separated by horizontal rules', () => {
    const file = createGistDesignFile({
      features: [createFeature({ name: 'Feature A' }), createFeature({ name: 'Feature B' })],
    });
    const md = generateGistDesignMarkdown(file);
    expect(md).toContain('## Feature A');
    expect(md).toContain('## Feature B');
    expect(md).toContain('---');
  });

  it('ends with a newline', () => {
    const file = createGistDesignFile();
    const md = generateGistDesignMarkdown(file);
    expect(md.endsWith('\n')).toBe(true);
  });
});
