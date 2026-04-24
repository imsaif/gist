import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { Gap, DraftFile, GapCategory, GapSeverity, ReadabilityScore } from '@/types/audit';

export interface GalleryEntry {
  slug: string;
  name: string;
  url: string;
  simpleIcon: string | null;
  auditedAt: string;
  status: 'ok' | 'error';
  error?: string;
  readabilityScore?: ReadabilityScore;
  totalGaps?: number;
  criticalGaps?: number;
  headline?: {
    category: GapCategory;
    severity: GapSeverity;
    description: string;
    chatgptSays: string | null;
    claudeSays: string | null;
    siteContent: string | null;
  };
  allGaps?: Gap[];
  draftFile?: DraftFile | null;
}

const RESULTS_DIR = join(process.cwd(), 'data/gallery/results');

export function loadAllResults(): GalleryEntry[] {
  if (!existsSync(RESULTS_DIR)) return [];
  const files = readdirSync(RESULTS_DIR).filter((f) => f.endsWith('.json'));
  return files
    .map((f) => JSON.parse(readFileSync(join(RESULTS_DIR, f), 'utf8')) as GalleryEntry)
    .filter((r) => r.status === 'ok');
}

export function loadResult(slug: string): GalleryEntry | null {
  const file = join(RESULTS_DIR, `${slug}.json`);
  if (!existsSync(file)) return null;
  const entry = JSON.parse(readFileSync(file, 'utf8')) as GalleryEntry;
  return entry.status === 'ok' ? entry : null;
}

export function loadAllSlugs(): string[] {
  if (!existsSync(RESULTS_DIR)) return [];
  return readdirSync(RESULTS_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''));
}
