import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { Gap, DraftFile, GapCategory, GapSeverity, ReadabilityScore } from '@/types/audit';

export type GalleryCategory =
  | 'ai-llm'
  | 'dev-tools'
  | 'backend-devops'
  | 'productivity'
  | 'design'
  | 'fintech';

export const CATEGORY_LABELS: Record<GalleryCategory, string> = {
  'ai-llm': 'AI & LLM',
  'dev-tools': 'Developer Tools',
  'backend-devops': 'Backend & DevOps',
  productivity: 'Productivity & SaaS',
  design: 'Design & Creative',
  fintech: 'Fintech & Email',
};

export const CATEGORY_ORDER: GalleryCategory[] = [
  'ai-llm',
  'dev-tools',
  'backend-devops',
  'productivity',
  'design',
  'fintech',
];

interface CompanyEntry {
  slug: string;
  name: string;
  url: string;
  simpleIcon: string | null;
  category: GalleryCategory;
}

interface CompaniesFile {
  version: number;
  updatedAt: string;
  companies: CompanyEntry[];
}

export interface GalleryEntry {
  slug: string;
  name: string;
  url: string;
  simpleIcon: string | null;
  category: GalleryCategory;
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
const COMPANIES_FILE = join(process.cwd(), 'data/gallery/companies.json');

let _companiesCache: Map<string, CompanyEntry> | null = null;

function loadCompaniesIndex(): Map<string, CompanyEntry> {
  if (_companiesCache) return _companiesCache;
  const raw = readFileSync(COMPANIES_FILE, 'utf8');
  const parsed = JSON.parse(raw) as CompaniesFile;
  _companiesCache = new Map(parsed.companies.map((c) => [c.slug, c]));
  return _companiesCache;
}

function attachCategory(entry: GalleryEntry): GalleryEntry {
  if (entry.category) return entry;
  const company = loadCompaniesIndex().get(entry.slug);
  return company ? { ...entry, category: company.category } : entry;
}

export function loadAllResults(): GalleryEntry[] {
  if (!existsSync(RESULTS_DIR)) return [];
  const files = readdirSync(RESULTS_DIR).filter((f) => f.endsWith('.json'));
  return files
    .map((f) => JSON.parse(readFileSync(join(RESULTS_DIR, f), 'utf8')) as GalleryEntry)
    .filter((r) => r.status === 'ok')
    .map(attachCategory);
}

export function loadResult(slug: string): GalleryEntry | null {
  const file = join(RESULTS_DIR, `${slug}.json`);
  if (!existsSync(file)) return null;
  const entry = JSON.parse(readFileSync(file, 'utf8')) as GalleryEntry;
  return entry.status === 'ok' ? attachCategory(entry) : null;
}

export function loadAllSlugs(): string[] {
  if (!existsSync(RESULTS_DIR)) return [];
  return readdirSync(RESULTS_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''));
}

export interface CategoryCount {
  category: GalleryCategory;
  label: string;
  count: number;
}

export function aggregateByCategory(entries: GalleryEntry[]): CategoryCount[] {
  const counts = new Map<GalleryCategory, number>();
  for (const e of entries) {
    if (!e.category) continue;
    counts.set(e.category, (counts.get(e.category) ?? 0) + 1);
  }
  return CATEGORY_ORDER.filter((c) => counts.has(c)).map((c) => ({
    category: c,
    label: CATEGORY_LABELS[c],
    count: counts.get(c) ?? 0,
  }));
}
