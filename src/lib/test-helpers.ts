import type {
  Feature,
  GistDesignFile,
  FileUpdate,
  BeforeAfterItem,
  FeatureStates,
  FeatureExecution,
} from '@/types/file';

export function createFeature(overrides: Partial<Feature> = {}): Feature {
  return {
    id: 'test-feature',
    name: 'Test Feature',
    intent: {
      goal: null,
      coreAnxiety: null,
      notTryingTo: [],
    },
    interactionModel: {
      primaryFlow: [],
      keyInteractions: [],
      errorHandling: [],
    },
    designDecisions: [],
    patternsUsed: [],
    constraints: [],
    notThis: [],
    openQuestions: [],
    ...overrides,
  };
}

export function createGistDesignFile(overrides: Partial<GistDesignFile> = {}): GistDesignFile {
  return {
    product: {
      name: null,
      description: null,
      audience: null,
      aiApproach: null,
    },
    positioning: {
      category: null,
      forWho: null,
      notForWho: null,
      comparisons: [],
    },
    context: {
      pricing: null,
      integratesWith: [],
      requires: [],
      stage: null,
    },
    features: [],
    ...overrides,
  };
}

export function createFileUpdate(overrides: Partial<FileUpdate> = {}): FileUpdate {
  return {
    ...overrides,
  };
}

export function createBeforeAfterItem(overrides: Partial<BeforeAfterItem> = {}): BeforeAfterItem {
  return {
    id: 'ba-1',
    featureId: 'test-feature',
    without: 'AI guesses everything',
    with: 'gist.design provides guidance',
    source: 'design-decision',
    ...overrides,
  };
}

export function createFeatureStates(overrides: Partial<FeatureStates> = {}): FeatureStates {
  return {
    empty: null,
    loading: null,
    populated: null,
    error: null,
    edgeCases: [],
    ...overrides,
  };
}

export function createFeatureExecution(
  overrides: Partial<FeatureExecution> = {}
): FeatureExecution {
  return {
    stackAndComponents: null,
    layout: null,
    keyCopy: [],
    interactions: null,
    responsiveBehavior: null,
    visualReferences: [],
    ...overrides,
  };
}
