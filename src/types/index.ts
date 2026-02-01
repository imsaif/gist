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
// Critique Mode Types
// ============================================

export type CritiquePhase = 'upload' | 'analyze' | 'deep-dive' | 'synthesize';

export interface CritiqueIssue {
  id: string;
  severity: 'critical' | 'major' | 'minor';
  category: string;
  title: string;
  description: string;
  suggestion: string;
  patternId?: string;
}

export interface Critique {
  imageDescription: string | null;
  whatsWorking: string[];
  issues: CritiqueIssue[];
  patterns: { patternId: string; reason: string }[];
  priorityFixes: string[];
  currentPhase: CritiquePhase;
}

export interface CritiqueUpdate {
  imageDescription?: string;
  whatsWorking?: string[];
  addIssues?: CritiqueIssue[];
  updateIssues?: (Partial<CritiqueIssue> & { id: string })[];
  patterns?: { patternId: string; reason: string }[];
  priorityFixes?: string[];
  phase?: CritiquePhase;
}

// ============================================
// Stakeholder Mode Types
// ============================================

export type StakeholderPhase = 'context' | 'objections' | 'evidence' | 'synthesize';

export interface Objection {
  id: string;
  stakeholder: string;
  objection: string;
  counterArguments: string[];
  evidenceNeeded: string[];
}

export interface StakeholderPrep {
  designDecision: string | null;
  context: string[];
  objections: Objection[];
  talkingPoints: string[];
  riskMitigations: string[];
  currentPhase: StakeholderPhase;
}

export interface StakeholderUpdate {
  designDecision?: string;
  context?: string[];
  addObjections?: Objection[];
  updateObjections?: (Partial<Objection> & { id: string })[];
  talkingPoints?: string[];
  riskMitigations?: string[];
  phase?: StakeholderPhase;
}

// ============================================
// IA Mode Types
// ============================================

export type IAPhase = 'understand' | 'inventory' | 'structure' | 'navigation' | 'synthesize';

export interface ContentItem {
  id: string;
  name: string;
  type: 'page' | 'section' | 'component' | 'data';
  description: string;
  parent?: string;
  children?: string[];
}

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  children?: NavigationItem[];
}

export interface InformationArchitecture {
  projectName: string | null;
  contentInventory: ContentItem[];
  hierarchy: ContentItem[]; // Tree structure
  navigation: NavigationItem[];
  openQuestions: string[];
  currentPhase: IAPhase;
}

export interface IAUpdate {
  projectName?: string;
  addContent?: ContentItem[];
  updateContent?: (Partial<ContentItem> & { id: string })[];
  removeContentIds?: string[];
  navigation?: NavigationItem[];
  openQuestions?: string[];
  phase?: IAPhase;
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
