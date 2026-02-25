// ============================================
// gist.design File Types
// ============================================

export type SectionStatus = 'empty' | 'partial' | 'complete';

// Product Overview
export interface ProductOverview {
  name: string | null;
  description: string | null;
  audience: string | null;
  aiApproach: string | null;
}

// Positioning
export interface CompetitorComparison {
  id: string;
  vs: string;
  difference: string;
}

export interface Positioning {
  category: string | null;
  forWho: string | null;
  notForWho: string | null;
  comparisons: CompetitorComparison[];
}

// Product Context
export interface ProductContext {
  pricing: string | null;
  integratesWith: string[];
  requires: string[];
  stage: string | null;
}

// Intent section of a Feature
export interface Intent {
  goal: string | null;
  coreAnxiety: string | null;
  notTryingTo: string[];
}

// Interaction Model section
export interface InteractionModel {
  primaryFlow: string[];
  keyInteractions: string[];
  errorHandling: string[];
}

// Design Decision
export interface DesignDecision {
  id: string;
  chose: string;
  over: string;
  because: string;
}

// Pattern Implementation
export interface PatternImplementation {
  id: string;
  patternId: string;
  patternName: string;
  usage: string;
  url?: string;
}

// Feature Constraint
export interface FeatureConstraint {
  id: string;
  constraint: string;
  designResponse: string;
}

// Feature States (optional depth)
export interface FeatureStates {
  empty: string | null;
  loading: string | null;
  populated: string | null;
  error: string | null;
  edgeCases: string[];
}

// Feature Execution (optional depth)
export interface FeatureExecution {
  stackAndComponents: string | null;
  layout: string | null;
  keyCopy: string[];
  interactions: string | null;
  responsiveBehavior: string | null;
  visualReferences: string[];
}

// A single Feature in the gist.design file
export interface Feature {
  id: string;
  name: string;
  intent: Intent;
  interactionModel: InteractionModel;
  designDecisions: DesignDecision[];
  patternsUsed: PatternImplementation[];
  constraints: FeatureConstraint[];
  notThis: string[];
  openQuestions: string[];
  states?: FeatureStates;
  execution?: FeatureExecution;
}

// The full gist.design file
export interface GistDesignFile {
  product: ProductOverview;
  positioning: Positioning;
  context: ProductContext;
  features: Feature[];
}

// ============================================
// AI Response Parsing Types
// ============================================

// Update from AI response (via <file_update> tag)
export interface FileUpdate {
  product?: Partial<ProductOverview>;
  positioning?: {
    category?: string;
    forWho?: string;
    notForWho?: string;
    addComparisons?: CompetitorComparison[];
  };
  context?: {
    pricing?: string;
    integratesWith?: string[];
    requires?: string[];
    stage?: string;
  };
  featureId?: string;
  featureName?: string;
  intent?: {
    goal?: string;
    coreAnxiety?: string;
    notTryingTo?: string[];
  };
  interactionModel?: {
    primaryFlow?: string[];
    keyInteractions?: string[];
    errorHandling?: string[];
  };
  addDesignDecisions?: DesignDecision[];
  addPatterns?: PatternImplementation[];
  addConstraints?: FeatureConstraint[];
  notThis?: string[];
  openQuestions?: string[];
  states?: {
    empty?: string;
    loading?: string;
    populated?: string;
    error?: string;
    edgeCases?: string[];
  };
  execution?: {
    stackAndComponents?: string;
    layout?: string;
    keyCopy?: string[];
    interactions?: string;
    responsiveBehavior?: string;
    visualReferences?: string[];
  };
}

// Before/After item for developer brief
export interface BeforeAfterItem {
  id: string;
  featureId: string;
  without: string;
  with: string;
  source: 'not-this' | 'design-decision' | 'explicit-pain';
}

// Before/After update from AI (via <before_after_update> tag)
export interface BeforeAfterUpdate {
  items: BeforeAfterItem[];
}

// ============================================
// Session State Types
// ============================================

export interface FeatureProgress {
  featureId: string;
  sections: {
    intent: SectionStatus;
    interactionModel: SectionStatus;
    designDecisions: SectionStatus;
    patterns: SectionStatus;
    constraints: SectionStatus;
    notThis: SectionStatus;
    openQuestions: SectionStatus;
    states: SectionStatus;
    execution: SectionStatus;
  };
}

export type EntryState = 'building-new' | 'existing-product' | 'have-prd';

export interface Session {
  entryState: EntryState | null;
  currentFeatureId: string | null;
  featureProgress: FeatureProgress[];
}

// ============================================
// Developer Brief Export Type
// ============================================

export interface DeveloperBrief {
  setupInstructions: string;
  llmsTxtSnippet: string;
  verifySteps: string[];
  aiToolGuides: {
    cursor: string;
    claudeCode: string;
    chatgpt: string;
    claude: string;
    copilot: string;
  };
}
