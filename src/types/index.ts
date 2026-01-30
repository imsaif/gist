// Message types
export interface IdentifiedPatternInMessage {
  patternId: string;
  reason: string;
  flowStepId?: string; // For Map mode - which step the pattern applies to
  decisionId?: string; // For Rationale mode - which decision the pattern applies to
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  identifiedPattern?: IdentifiedPatternInMessage;
}

// ============================================
// Brief Mode Types
// ============================================

export interface BriefDecision {
  decision: string;
  rationale: string;
}

export interface BriefPattern {
  patternId: string;
  reason: string;
  addedToBrief?: boolean;
}

export interface BriefReadyToDesign {
  prompt: string;
  checklist: string[];
}

export interface Brief {
  goal: string | null;
  context: string[];
  decisions: BriefDecision[];
  openQuestions: string[];
  patterns: BriefPattern[];
  successCriteria: string[];
  readyToDesign: BriefReadyToDesign | null;
}

export interface BriefUpdate {
  goal?: string | null;
  context?: string[];
  decisions?: BriefDecision[];
  openQuestions?: string[];
  patterns?: string[]; // Just pattern IDs
  successCriteria?: string[];
  readyToDesign?: BriefReadyToDesign | null;
}

// ============================================
// Rationale Mode Types
// ============================================

export type RationalePhase = 'problem' | 'context' | 'decisions' | 'review';

export interface RejectedAlternative {
  approach: string;
  reason: string;
}

export interface DecisionPattern {
  patternId: string;
  application: string; // How the pattern applies
  caution?: string; // Warnings about using this pattern here
}

export interface DesignDecision {
  id: string;
  title: string;
  what: string; // What was decided
  why: string; // Rationale
  rejected: RejectedAlternative[];
  patterns: DecisionPattern[];
  openQuestions: string[];
}

export interface DesignRationale {
  problem: string | null;
  context: string[]; // Users, constraints, timeline
  decisions: DesignDecision[];
  assumptions: string[]; // What we're betting on
  openQuestions: string[];
  currentPhase: RationalePhase;
}

export interface DesignRationaleUpdate {
  problem?: string | null;
  context?: string[];
  addDecisions?: DesignDecision[];
  updateDecisions?: (Partial<DesignDecision> & { id: string })[];
  assumptions?: string[];
  openQuestions?: string[];
  phase?: RationalePhase;
}

// Conversation phases for design map workshop
export type ConversationPhase = 'understand' | 'map' | 'explore' | 'alternatives' | 'synthesize';

// Flow state types
export type FlowStateType = 'happy' | 'empty' | 'error' | 'loading' | 'edge';

// Flow state within a step
export interface FlowState {
  type: FlowStateType;
  label: string;
  description: string;
}

// Decision made within a flow step
export interface FlowStepDecision {
  decision: string;
  rationale: string;
}

// Pattern tied to a flow step
export interface FlowStepPattern {
  patternId: string;
  reason: string;
}

// A single step in the user flow
export interface FlowStep {
  id: string; // stable kebab-case, e.g. "receive-email"
  title: string;
  description: string;
  states: FlowState[];
  decisions: FlowStepDecision[];
  patterns: FlowStepPattern[];
  openQuestions: string[];
}

// Alternative approach considered
export interface AlternativeConsidered {
  approach: string;
  description: string;
  pros: string[];
  cons: string[];
  rejected: boolean;
  rejectionReason?: string;
}

// The main Design Map artifact
export interface DesignMap {
  overview: string | null;
  flow: FlowStep[];
  constraints: string[];
  alternatives: AlternativeConsidered[];
  currentPhase: ConversationPhase;
}

// Update for adding or updating flow steps
export interface FlowStepUpdate {
  id: string;
  title?: string;
  description?: string;
  states?: FlowState[];
  decisions?: FlowStepDecision[];
  patterns?: FlowStepPattern[];
  openQuestions?: string[];
}

// Partial update from AI response
export interface DesignMapUpdate {
  overview?: string | null;
  addSteps?: FlowStepUpdate[];
  updateSteps?: FlowStepUpdate[]; // matched by id
  removeStepIds?: string[];
  constraints?: string[];
  alternatives?: AlternativeConsidered[];
  phase?: ConversationPhase;
}

// Chat state
export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

// App state
export interface AppState {
  chat: ChatState;
  designMap: DesignMap;
}
