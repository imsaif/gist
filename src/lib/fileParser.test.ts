import { describe, it, expect, vi } from 'vitest';
import {
  parseFileResponse,
  createFeatureFromUpdate,
  mergeFileUpdate,
  calculateFeatureProgress,
} from './fileParser';
import {
  createFeature,
  createGistDesignFile,
  createFileUpdate,
  createFeatureStates,
  createFeatureExecution,
} from './test-helpers';

describe('parseFileResponse', () => {
  it('extracts file_update tag and returns parsed JSON', () => {
    const content = 'Some text <file_update>{"product":{"name":"Acme"}}</file_update> more text';
    const result = parseFileResponse(content);
    expect(result.fileUpdate).toEqual({ product: { name: 'Acme' } });
    expect(result.displayContent).toBe('Some text  more text');
  });

  it('extracts before_after_update tag', () => {
    const content =
      'Text <before_after_update>{"items":[{"id":"ba-1","featureId":"f1","without":"bad","with":"good","source":"design-decision"}]}</before_after_update>';
    const result = parseFileResponse(content);
    expect(result.beforeAfterUpdate!.items).toHaveLength(1);
    expect(result.beforeAfterUpdate!.items[0].without).toBe('bad');
    expect(result.displayContent).toBe('Text');
  });

  it('extracts pattern_identified tag', () => {
    const content =
      'Text <pattern_identified>{"patternId":"explainability","reason":"Shows why"}</pattern_identified>';
    const result = parseFileResponse(content);
    expect(result.identifiedPattern).toEqual({ patternId: 'explainability', reason: 'Shows why' });
    expect(result.displayContent).toBe('Text');
  });

  it('extracts all three tags from a single response', () => {
    const content = [
      'Hello',
      '<file_update>{"product":{"name":"X"}}</file_update>',
      '<before_after_update>{"items":[]}</before_after_update>',
      '<pattern_identified>{"patternId":"undo-redo","reason":"test"}</pattern_identified>',
    ].join('\n');
    const result = parseFileResponse(content);
    expect(result.fileUpdate).not.toBeNull();
    expect(result.beforeAfterUpdate).not.toBeNull();
    expect(result.identifiedPattern).not.toBeNull();
    expect(result.displayContent).toBe('Hello');
  });

  it('returns null for missing tags', () => {
    const result = parseFileResponse('Just plain text');
    expect(result.fileUpdate).toBeNull();
    expect(result.beforeAfterUpdate).toBeNull();
    expect(result.identifiedPattern).toBeNull();
    expect(result.displayContent).toBe('Just plain text');
  });

  it('handles malformed JSON in file_update gracefully', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const result = parseFileResponse('<file_update>{not valid json}</file_update>');
    expect(result.fileUpdate).toBeNull();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('handles malformed JSON in before_after_update gracefully', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const result = parseFileResponse('<before_after_update>broken</before_after_update>');
    expect(result.beforeAfterUpdate).toBeNull();
    spy.mockRestore();
  });

  it('handles malformed JSON in pattern_identified gracefully', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const result = parseFileResponse('<pattern_identified>{bad}</pattern_identified>');
    expect(result.identifiedPattern).toBeNull();
    spy.mockRestore();
  });

  it('returns empty string display content when input is only tags', () => {
    const result = parseFileResponse('<file_update>{"product":{"name":"X"}}</file_update>');
    expect(result.displayContent).toBe('');
  });

  it('handles empty input', () => {
    const result = parseFileResponse('');
    expect(result.displayContent).toBe('');
    expect(result.fileUpdate).toBeNull();
  });

  it('handles multiline JSON inside tags', () => {
    const content = `<file_update>
{
  "product": {
    "name": "Multi Line"
  }
}
</file_update>`;
    const result = parseFileResponse(content);
    expect(result.fileUpdate!.product!.name).toBe('Multi Line');
  });
});

describe('createFeatureFromUpdate', () => {
  it('creates feature with all fields from a full update', () => {
    const update = createFileUpdate({
      featureId: 'search',
      featureName: 'Search',
      intent: { goal: 'Find stuff', coreAnxiety: 'Missing results', notTryingTo: ['browse'] },
      interactionModel: {
        primaryFlow: ['type', 'search'],
        keyInteractions: ['autocomplete'],
        errorHandling: ['show empty'],
      },
      addDesignDecisions: [{ id: 'dd-1', chose: 'instant', over: 'button', because: 'speed' }],
      addPatterns: [
        {
          id: 'p-1',
          patternId: 'streaming-output',
          patternName: 'Streaming',
          usage: 'results stream in',
        },
      ],
      addConstraints: [{ id: 'c-1', constraint: '< 200ms', designResponse: 'cache results' }],
      notThis: ['no pagination'],
      openQuestions: ['fuzzy matching?'],
    });
    const feature = createFeatureFromUpdate(update);
    expect(feature.id).toBe('search');
    expect(feature.name).toBe('Search');
    expect(feature.intent.goal).toBe('Find stuff');
    expect(feature.intent.coreAnxiety).toBe('Missing results');
    expect(feature.intent.notTryingTo).toEqual(['browse']);
    expect(feature.interactionModel.primaryFlow).toEqual(['type', 'search']);
    expect(feature.designDecisions).toHaveLength(1);
    expect(feature.patternsUsed).toHaveLength(1);
    expect(feature.constraints).toHaveLength(1);
    expect(feature.notThis).toEqual(['no pagination']);
    expect(feature.openQuestions).toEqual(['fuzzy matching?']);
  });

  it('uses defaults for missing fields', () => {
    const feature = createFeatureFromUpdate(createFileUpdate());
    expect(feature.name).toBe('Untitled Feature');
    expect(feature.intent.goal).toBeNull();
    expect(feature.interactionModel.primaryFlow).toEqual([]);
    expect(feature.designDecisions).toEqual([]);
  });

  it('generates a feature ID when not provided', () => {
    const feature = createFeatureFromUpdate(createFileUpdate());
    expect(feature.id).toMatch(/^feature-/);
  });

  it('includes states when provided', () => {
    const update = createFileUpdate({
      states: { empty: 'Show placeholder', loading: 'Spinner', edgeCases: ['timeout'] },
    });
    const feature = createFeatureFromUpdate(update);
    expect(feature.states).toBeDefined();
    expect(feature.states!.empty).toBe('Show placeholder');
    expect(feature.states!.loading).toBe('Spinner');
    expect(feature.states!.populated).toBeNull();
    expect(feature.states!.edgeCases).toEqual(['timeout']);
  });

  it('omits states when not in update', () => {
    const feature = createFeatureFromUpdate(createFileUpdate());
    expect(feature.states).toBeUndefined();
  });

  it('includes execution when provided', () => {
    const update = createFileUpdate({
      execution: { layout: 'two-column', keyCopy: ['Search...'], stackAndComponents: 'React' },
    });
    const feature = createFeatureFromUpdate(update);
    expect(feature.execution).toBeDefined();
    expect(feature.execution!.layout).toBe('two-column');
    expect(feature.execution!.keyCopy).toEqual(['Search...']);
  });

  it('omits execution when not in update', () => {
    const feature = createFeatureFromUpdate(createFileUpdate());
    expect(feature.execution).toBeUndefined();
  });
});

describe('mergeFileUpdate', () => {
  it('overwrites product scalar fields', () => {
    const file = createGistDesignFile({
      product: { name: 'Old', description: 'Old desc', audience: null, aiApproach: null },
    });
    const update = createFileUpdate({ product: { name: 'New', description: 'New desc' } });
    const merged = mergeFileUpdate(file, update);
    expect(merged.product.name).toBe('New');
    expect(merged.product.description).toBe('New desc');
  });

  it('preserves existing product fields when update has null/undefined', () => {
    const file = createGistDesignFile({
      product: { name: 'Keep', description: 'Keep desc', audience: 'Devs', aiApproach: null },
    });
    const update = createFileUpdate({ product: { name: 'Override' } });
    const merged = mergeFileUpdate(file, update);
    expect(merged.product.name).toBe('Override');
    expect(merged.product.audience).toBe('Devs');
  });

  it('overwrites positioning scalar fields', () => {
    const file = createGistDesignFile();
    const update = createFileUpdate({ positioning: { category: 'SaaS', forWho: 'Teams' } });
    const merged = mergeFileUpdate(file, update);
    expect(merged.positioning.category).toBe('SaaS');
    expect(merged.positioning.forWho).toBe('Teams');
  });

  it('appends comparisons via addComparisons', () => {
    const file = createGistDesignFile({
      positioning: {
        category: null,
        forWho: null,
        notForWho: null,
        comparisons: [{ id: 'c1', vs: 'CompA', difference: 'faster' }],
      },
    });
    const update = createFileUpdate({
      positioning: { addComparisons: [{ id: 'c2', vs: 'CompB', difference: 'cheaper' }] },
    });
    const merged = mergeFileUpdate(file, update);
    expect(merged.positioning.comparisons).toHaveLength(2);
    expect(merged.positioning.comparisons[1].vs).toBe('CompB');
  });

  it('appends context arrays', () => {
    const file = createGistDesignFile({
      context: { pricing: null, integratesWith: ['Slack'], requires: [], stage: null },
    });
    const update = createFileUpdate({
      context: { integratesWith: ['Jira'], requires: ['API key'] },
    });
    const merged = mergeFileUpdate(file, update);
    expect(merged.context.integratesWith).toEqual(['Slack', 'Jira']);
    expect(merged.context.requires).toEqual(['API key']);
  });

  it('creates a new feature when featureId is not in existing features', () => {
    const file = createGistDesignFile();
    const update = createFileUpdate({
      featureId: 'new-feature',
      featureName: 'New Feature',
      intent: { goal: 'Do something' },
    });
    const merged = mergeFileUpdate(file, update);
    expect(merged.features).toHaveLength(1);
    expect(merged.features[0].id).toBe('new-feature');
    expect(merged.features[0].intent.goal).toBe('Do something');
  });

  it('updates existing feature by ID', () => {
    const file = createGistDesignFile({
      features: [
        createFeature({
          id: 'f1',
          name: 'Feature 1',
          intent: { goal: 'Original', coreAnxiety: null, notTryingTo: ['a'] },
        }),
      ],
    });
    const update = createFileUpdate({
      featureId: 'f1',
      intent: { coreAnxiety: 'Users are confused', notTryingTo: ['b'] },
    });
    const merged = mergeFileUpdate(file, update);
    expect(merged.features).toHaveLength(1);
    expect(merged.features[0].intent.goal).toBe('Original'); // preserved
    expect(merged.features[0].intent.coreAnxiety).toBe('Users are confused'); // updated
    expect(merged.features[0].intent.notTryingTo).toEqual(['a', 'b']); // appended
  });

  it('appends design decisions to existing feature', () => {
    const file = createGistDesignFile({
      features: [
        createFeature({
          id: 'f1',
          designDecisions: [{ id: 'dd-1', chose: 'A', over: 'B', because: 'C' }],
        }),
      ],
    });
    const update = createFileUpdate({
      featureId: 'f1',
      addDesignDecisions: [{ id: 'dd-2', chose: 'X', over: 'Y', because: 'Z' }],
    });
    const merged = mergeFileUpdate(file, update);
    expect(merged.features[0].designDecisions).toHaveLength(2);
  });

  it('appends patterns to existing feature', () => {
    const file = createGistDesignFile({
      features: [createFeature({ id: 'f1' })],
    });
    const update = createFileUpdate({
      featureId: 'f1',
      addPatterns: [
        {
          id: 'p-1',
          patternId: 'explainability',
          patternName: 'Explainability',
          usage: 'Shows why',
        },
      ],
    });
    const merged = mergeFileUpdate(file, update);
    expect(merged.features[0].patternsUsed).toHaveLength(1);
  });

  it('appends constraints to existing feature', () => {
    const file = createGistDesignFile({
      features: [createFeature({ id: 'f1' })],
    });
    const update = createFileUpdate({
      featureId: 'f1',
      addConstraints: [{ id: 'c-1', constraint: 'Max 5 items', designResponse: 'Paginate' }],
    });
    const merged = mergeFileUpdate(file, update);
    expect(merged.features[0].constraints).toHaveLength(1);
  });

  it('appends notThis and openQuestions to existing feature', () => {
    const file = createGistDesignFile({
      features: [createFeature({ id: 'f1', notThis: ['no popups'], openQuestions: ['Q1'] })],
    });
    const update = createFileUpdate({
      featureId: 'f1',
      notThis: ['no modals'],
      openQuestions: ['Q2'],
    });
    const merged = mergeFileUpdate(file, update);
    expect(merged.features[0].notThis).toEqual(['no popups', 'no modals']);
    expect(merged.features[0].openQuestions).toEqual(['Q1', 'Q2']);
  });

  it('merges states into existing feature (scalars overwrite, edgeCases append)', () => {
    const file = createGistDesignFile({
      features: [
        createFeature({
          id: 'f1',
          states: createFeatureStates({ empty: 'old empty', edgeCases: ['case1'] }),
        }),
      ],
    });
    const update = createFileUpdate({
      featureId: 'f1',
      states: { empty: 'new empty', edgeCases: ['case2'] },
    });
    const merged = mergeFileUpdate(file, update);
    expect(merged.features[0].states!.empty).toBe('new empty');
    expect(merged.features[0].states!.edgeCases).toEqual(['case1', 'case2']);
  });

  it('initializes states when feature had none', () => {
    const file = createGistDesignFile({
      features: [createFeature({ id: 'f1' })],
    });
    const update = createFileUpdate({
      featureId: 'f1',
      states: { error: 'Show retry button' },
    });
    const merged = mergeFileUpdate(file, update);
    expect(merged.features[0].states!.error).toBe('Show retry button');
    expect(merged.features[0].states!.empty).toBeNull();
  });

  it('merges execution into existing feature', () => {
    const file = createGistDesignFile({
      features: [
        createFeature({
          id: 'f1',
          execution: createFeatureExecution({ layout: 'old', keyCopy: ['copy1'] }),
        }),
      ],
    });
    const update = createFileUpdate({
      featureId: 'f1',
      execution: { layout: 'new', keyCopy: ['copy2'] },
    });
    const merged = mergeFileUpdate(file, update);
    expect(merged.features[0].execution!.layout).toBe('new');
    expect(merged.features[0].execution!.keyCopy).toEqual(['copy1', 'copy2']);
  });

  it('does not mutate the original file', () => {
    const file = createGistDesignFile({
      features: [createFeature({ id: 'f1', notThis: ['original'] })],
    });
    const update = createFileUpdate({ featureId: 'f1', notThis: ['added'] });
    const merged = mergeFileUpdate(file, update);
    expect(file.features[0].notThis).toEqual(['original']); // unchanged
    expect(merged.features[0].notThis).toEqual(['original', 'added']);
  });

  it('preserves features not targeted by update', () => {
    const file = createGistDesignFile({
      features: [
        createFeature({ id: 'f1', name: 'Feature 1' }),
        createFeature({ id: 'f2', name: 'Feature 2' }),
      ],
    });
    const update = createFileUpdate({ featureId: 'f1', featureName: 'Updated F1' });
    const merged = mergeFileUpdate(file, update);
    expect(merged.features).toHaveLength(2);
    expect(merged.features[0].name).toBe('Updated F1');
    expect(merged.features[1].name).toBe('Feature 2');
  });

  it('handles update with no feature section', () => {
    const file = createGistDesignFile({
      features: [createFeature({ id: 'f1' })],
    });
    const update = createFileUpdate({ product: { name: 'Updated Name' } });
    const merged = mergeFileUpdate(file, update);
    expect(merged.product.name).toBe('Updated Name');
    expect(merged.features).toHaveLength(1); // unchanged
  });

  it('appends interaction model arrays to existing feature', () => {
    const file = createGistDesignFile({
      features: [
        createFeature({
          id: 'f1',
          interactionModel: {
            primaryFlow: ['step1'],
            keyInteractions: ['click'],
            errorHandling: ['retry'],
          },
        }),
      ],
    });
    const update = createFileUpdate({
      featureId: 'f1',
      interactionModel: {
        primaryFlow: ['step2'],
        keyInteractions: ['hover'],
        errorHandling: ['alert'],
      },
    });
    const merged = mergeFileUpdate(file, update);
    expect(merged.features[0].interactionModel.primaryFlow).toEqual(['step1', 'step2']);
    expect(merged.features[0].interactionModel.keyInteractions).toEqual(['click', 'hover']);
    expect(merged.features[0].interactionModel.errorHandling).toEqual(['retry', 'alert']);
  });
});

describe('calculateFeatureProgress', () => {
  it('returns all empty for a blank feature', () => {
    const feature = createFeature();
    const progress = calculateFeatureProgress(feature);
    expect(progress.featureId).toBe('test-feature');
    expect(progress.sections.intent).toBe('empty');
    expect(progress.sections.interactionModel).toBe('empty');
    expect(progress.sections.designDecisions).toBe('empty');
    expect(progress.sections.patterns).toBe('empty');
    expect(progress.sections.constraints).toBe('empty');
    expect(progress.sections.notThis).toBe('empty');
    expect(progress.sections.openQuestions).toBe('empty');
    expect(progress.sections.states).toBe('empty');
    expect(progress.sections.execution).toBe('empty');
  });

  it('marks intent as partial when only goal is set', () => {
    const feature = createFeature({
      intent: { goal: 'Search', coreAnxiety: null, notTryingTo: [] },
    });
    expect(calculateFeatureProgress(feature).sections.intent).toBe('partial');
  });

  it('marks intent as partial when only notTryingTo has items', () => {
    const feature = createFeature({
      intent: { goal: null, coreAnxiety: null, notTryingTo: ['browsing'] },
    });
    expect(calculateFeatureProgress(feature).sections.intent).toBe('partial');
  });

  it('marks intent as complete when goal and notTryingTo both present', () => {
    const feature = createFeature({
      intent: { goal: 'Search', coreAnxiety: null, notTryingTo: ['browsing'] },
    });
    expect(calculateFeatureProgress(feature).sections.intent).toBe('complete');
  });

  it('marks interactionModel as partial when only one sub-array has items', () => {
    const feature = createFeature({
      interactionModel: { primaryFlow: ['step'], keyInteractions: [], errorHandling: [] },
    });
    expect(calculateFeatureProgress(feature).sections.interactionModel).toBe('partial');
  });

  it('marks interactionModel as complete when all sub-arrays have items', () => {
    const feature = createFeature({
      interactionModel: {
        primaryFlow: ['step'],
        keyInteractions: ['click'],
        errorHandling: ['retry'],
      },
    });
    expect(calculateFeatureProgress(feature).sections.interactionModel).toBe('complete');
  });

  it('marks designDecisions as partial with 1-2 items', () => {
    const feature = createFeature({
      designDecisions: [{ id: 'dd-1', chose: 'A', over: 'B', because: 'C' }],
    });
    expect(calculateFeatureProgress(feature).sections.designDecisions).toBe('partial');
  });

  it('marks designDecisions as complete with 3+ items', () => {
    const feature = createFeature({
      designDecisions: [
        { id: 'dd-1', chose: 'A', over: 'B', because: 'C' },
        { id: 'dd-2', chose: 'D', over: 'E', because: 'F' },
        { id: 'dd-3', chose: 'G', over: 'H', because: 'I' },
      ],
    });
    expect(calculateFeatureProgress(feature).sections.designDecisions).toBe('complete');
  });

  it('marks states as empty when feature has no states', () => {
    const feature = createFeature();
    expect(calculateFeatureProgress(feature).sections.states).toBe('empty');
  });

  it('marks states as partial when only loading is set', () => {
    const feature = createFeature({ states: createFeatureStates({ loading: 'Spinner' }) });
    expect(calculateFeatureProgress(feature).sections.states).toBe('partial');
  });

  it('marks states as complete when empty + error + edgeCases present', () => {
    const feature = createFeature({
      states: createFeatureStates({ empty: 'placeholder', error: 'retry', edgeCases: ['timeout'] }),
    });
    expect(calculateFeatureProgress(feature).sections.states).toBe('complete');
  });

  it('marks execution as empty when feature has no execution', () => {
    expect(calculateFeatureProgress(createFeature()).sections.execution).toBe('empty');
  });

  it('marks execution as partial when only stackAndComponents is set', () => {
    const feature = createFeature({
      execution: createFeatureExecution({ stackAndComponents: 'React' }),
    });
    expect(calculateFeatureProgress(feature).sections.execution).toBe('partial');
  });

  it('marks execution as complete when layout + keyCopy present', () => {
    const feature = createFeature({
      execution: createFeatureExecution({ layout: 'grid', keyCopy: ['Click here'] }),
    });
    expect(calculateFeatureProgress(feature).sections.execution).toBe('complete');
  });
});
