import type { Gap, GapAnalysis, GapCategory, GapSeverity, LLMProvider } from '@/types/audit';

const VALID_SEVERITIES: GapSeverity[] = ['critical', 'high'];
const VALID_CATEGORIES: GapCategory[] = [
  'contradiction',
  'fabrication',
  'category_conflict',
  'shared_inaccuracy',
  'audience_mismatch',
  'missing_differentiator',
  'pricing_confusion',
];
const VALID_MODELS: LLMProvider[] = ['chatgpt', 'claude'];

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function validateGap(raw: unknown, idx: number): Gap | null {
  if (!isObject(raw)) return null;
  const severity = raw.severity;
  const category = raw.category;
  if (typeof severity !== 'string' || !VALID_SEVERITIES.includes(severity as GapSeverity))
    return null;
  if (typeof category !== 'string' || !VALID_CATEGORIES.includes(category as GapCategory))
    return null;
  if (typeof raw.description !== 'string') return null;
  if (typeof raw.whatFileNeeds !== 'string') return null;
  const modelsAffected = Array.isArray(raw.modelsAffected)
    ? raw.modelsAffected.filter(
        (m): m is LLMProvider => typeof m === 'string' && VALID_MODELS.includes(m as LLMProvider)
      )
    : [];
  if (modelsAffected.length === 0) return null;

  const evidence = isObject(raw.evidence)
    ? {
        chatgptSays: typeof raw.evidence.chatgptSays === 'string' ? raw.evidence.chatgptSays : null,
        claudeSays: typeof raw.evidence.claudeSays === 'string' ? raw.evidence.claudeSays : null,
        siteContent: typeof raw.evidence.siteContent === 'string' ? raw.evidence.siteContent : null,
      }
    : undefined;

  return {
    id: typeof raw.id === 'string' && raw.id.length > 0 ? raw.id : `conflict-${idx + 1}`,
    severity: severity as GapSeverity,
    category: category as GapCategory,
    description: raw.description,
    modelsAffected,
    whatFileNeeds: raw.whatFileNeeds,
    ...(evidence ? { evidence } : {}),
  };
}

/**
 * Parse and validate a judge response. Returns a `GapAnalysis` with
 * well-typed gaps and a placeholder summary (caller is expected to
 * overwrite via deriveSummary). Throws on unrecoverable shape issues
 * so the caller can surface a clean error to the user instead of
 * pushing half-state onto the UI.
 *
 * Malformed gaps are dropped rather than failing the whole parse —
 * a partial usable result beats a hard failure.
 */
export function parseGapAnalysis(rawText: string): GapAnalysis {
  let raw: unknown;
  try {
    raw = JSON.parse(rawText);
  } catch {
    const match = rawText.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Judge response was not valid JSON');
    try {
      raw = JSON.parse(match[0]);
    } catch {
      throw new Error('Judge response contained no parseable JSON object');
    }
  }

  if (!isObject(raw)) throw new Error('Judge response was not a JSON object');
  if (!Array.isArray(raw.gaps)) throw new Error('Judge response missing "gaps" array');

  const gaps = raw.gaps.map((g, i) => validateGap(g, i)).filter((g): g is Gap => g !== null);

  const draftFile = isObject(raw.draftFile)
    ? (raw.draftFile as unknown as GapAnalysis['draftFile'])
    : undefined;

  return {
    gaps,
    // Placeholder — runAudit overwrites this with deriveSummary().
    summary: {
      totalGaps: gaps.length,
      criticalGaps: gaps.filter((g) => g.severity === 'critical').length,
      readabilityScore: 'Good',
      worstModel: 'chatgpt',
      bestModel: 'claude',
    },
    ...(draftFile ? { draftFile } : {}),
  };
}

/**
 * Sanitize a provider error message before embedding it into the next
 * LLM prompt. Strips newlines (so it can't break out of a quoted block),
 * caps length (so a 5KB stack trace doesn't blow the prompt budget),
 * and keeps it on a single line.
 */
export function sanitizeErrorForPrompt(err: string, maxLen = 200): string {
  return err.replace(/\s+/g, ' ').trim().slice(0, maxLen);
}
