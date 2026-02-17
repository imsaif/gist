// ============================================
// AI Readability Audit Types
// ============================================

export type LLMProvider = 'chatgpt' | 'claude' | 'perplexity';

export type GapSeverity = 'critical' | 'high' | 'medium';

export type GapCategory =
  | 'competitor_blending'
  | 'invisible_mechanics'
  | 'missing_decisions'
  | 'fabrication'
  | 'missing_boundaries'
  | 'positioning_drift';

export type ReadabilityScore = 'Poor' | 'Partial' | 'Good';

export interface LLMResponse {
  model: LLMProvider;
  content: string;
  durationMs: number;
  error?: string;
}

export interface Gap {
  id: string;
  severity: GapSeverity;
  category: GapCategory;
  description: string;
  modelsAffected: LLMProvider[];
  whatFileNeeds: string;
}

export interface GapAnalysisSummary {
  totalGaps: number;
  criticalGaps: number;
  readabilityScore: ReadabilityScore;
  worstModel: LLMProvider;
  bestModel: LLMProvider;
}

export interface GapAnalysis {
  gaps: Gap[];
  summary: GapAnalysisSummary;
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
