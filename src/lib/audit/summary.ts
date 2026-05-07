import type {
  Gap,
  GapAnalysisSummary,
  LLMProvider,
  LLMResponse,
  ReadabilityScore,
} from '@/types/audit';

// Derive the audit summary from gaps + responses in code rather than asking the
// judge to compute it. The judge is fuzzy at counting and applying thresholds;
// we want the same gap list to always produce the same score.

export function deriveReadabilityScore(gaps: Gap[]): ReadabilityScore {
  const critical = gaps.filter((g) => g.severity === 'critical').length;
  const high = gaps.filter((g) => g.severity === 'high').length;
  if (critical === 0 && high === 0) return 'Good';
  if (critical >= 1 || critical + high >= 3) return 'Poor';
  return 'Partial';
}

function countGapsForModel(gaps: Gap[], model: LLMProvider): number {
  return gaps.filter((g) => g.modelsAffected.includes(model)).length;
}

export function deriveSummary(
  gaps: Gap[],
  responses: Partial<Record<LLMProvider, LLMResponse>>
): GapAnalysisSummary {
  const chatgptCount = countGapsForModel(gaps, 'chatgpt');
  const claudeCount = countGapsForModel(gaps, 'claude');

  // worstModel = the one with more gaps; tiebreak to the model that actually answered.
  let worstModel: LLMProvider;
  let bestModel: LLMProvider;
  if (chatgptCount === claudeCount) {
    const chatgptErrored = !responses.chatgpt || !!responses.chatgpt.error;
    worstModel = chatgptErrored ? 'claude' : 'chatgpt';
    bestModel = chatgptErrored ? 'chatgpt' : 'claude';
  } else if (chatgptCount > claudeCount) {
    worstModel = 'chatgpt';
    bestModel = 'claude';
  } else {
    worstModel = 'claude';
    bestModel = 'chatgpt';
  }

  return {
    totalGaps: gaps.length,
    criticalGaps: gaps.filter((g) => g.severity === 'critical').length,
    readabilityScore: deriveReadabilityScore(gaps),
    worstModel,
    bestModel,
  };
}
