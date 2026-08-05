import type { Gap, GapId } from '@/types/repo-audit';

const VALID_IDS: GapId[] = [
  'no_negative_audience',
  'no_comparison',
  'no_audience',
  'no_boundary',
  'no_rationale',
];

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function extractJson(raw: string): unknown {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1] : raw;
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  if (start === -1 || end <= start) throw new Error('No JSON object in model response');
  try {
    return JSON.parse(candidate.slice(start, end + 1));
  } catch {
    throw new Error('Model response was not valid JSON');
  }
}

function validateGap(raw: unknown): Gap | null {
  if (!isObject(raw)) return null;
  const id = raw.id;
  if (typeof id !== 'string' || !VALID_IDS.includes(id as GapId)) return null;
  return { id: id as GapId, evidence: typeof raw.evidence === 'string' ? raw.evidence : '' };
}

export function parseReading(raw: string): { reading: string; gaps: Gap[] } {
  const parsed = extractJson(raw);
  if (!isObject(parsed)) throw new Error('Model response was not an object');
  if (typeof parsed.reading !== 'string' || parsed.reading.trim().length === 0) {
    throw new Error('Model response had no reading');
  }
  const list = Array.isArray(parsed.gaps) ? parsed.gaps : [];
  const seen = new Set<GapId>();
  const gaps: Gap[] = [];
  for (const item of list) {
    const g = validateGap(item);
    if (g && !seen.has(g.id)) {
      seen.add(g.id);
      gaps.push(g);
    }
  }
  return { reading: parsed.reading, gaps };
}
