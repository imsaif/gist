// ============================================
// AI Readability Audit Types
// ============================================

export type LLMProvider = 'chatgpt' | 'claude';

export type GapSeverity = 'critical' | 'high';

export type GapCategory =
  | 'contradiction'
  | 'fabrication'
  | 'category_conflict'
  | 'shared_inaccuracy'
  | 'audience_mismatch'
  | 'missing_differentiator'
  | 'pricing_confusion';

export type ReadabilityScore = 'Poor' | 'Partial' | 'Good';

export interface LLMResponse {
  model: LLMProvider;
  content: string;
  durationMs: number;
  error?: string;
}

export interface ConflictEvidence {
  chatgptSays?: string | null;
  claudeSays?: string | null;
  siteContent?: string | null;
}

export interface Gap {
  id: string;
  severity: GapSeverity;
  category: GapCategory;
  description: string;
  modelsAffected: LLMProvider[];
  whatFileNeeds: string;
  evidence?: ConflictEvidence;
}

export interface GapAnalysisSummary {
  totalGaps: number;
  criticalGaps: number;
  readabilityScore: ReadabilityScore;
  worstModel: LLMProvider;
  bestModel: LLMProvider;
}

export interface DraftProductOverview {
  name: string | null;
  description: string | null;
  audience: string | null;
}

export interface DraftPositioning {
  category: string | null;
  forWho: string | null;
  notForWho: string | null;
}

export interface DraftContext {
  pricing: string | null;
  stage: string | null;
}

export interface DraftFile {
  product: DraftProductOverview;
  positioning: DraftPositioning;
  context: DraftContext;
}

export interface GapAnalysis {
  gaps: Gap[];
  summary: GapAnalysisSummary;
  draftFile?: DraftFile;
}

export interface FetchedContent {
  url: string;
  title: string;
  metaDescription: string;
  content: string;
  contentLength: number;
}

export interface AuditResult {
  url: string;
  fetchedAt: string;
  siteContent: FetchedContent;
  responses: Partial<Record<LLMProvider, LLMResponse>>;
  analysis: GapAnalysis | null;
}

export interface VerificationResult {
  before: string;
  after: string;
  fixedGaps: string[];
  remainingGaps: string[];
}

// SSE event types
export type AuditSSEEvent =
  | { event: 'fetched'; data: { url: string; contentLength: number } }
  | { event: 'llm_response'; data: LLMResponse }
  | { event: 'analysis'; data: GapAnalysis }
  | { event: 'error'; data: { message: string } }
  | { event: 'done'; data: Record<string, never> };
