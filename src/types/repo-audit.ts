export interface RepoFiles {
  owner: string;
  repo: string;
  readme: string | null;
  packageDescription: string | null;
  filePaths: string[];
}

export interface StructuralFacts {
  hasReadme: boolean;
  readmeWords: number;
  hasDocsDir: boolean;
  hasPackageDescription: boolean;
  fileCount: number;
}

export type GapId =
  'no_negative_audience' | 'no_comparison' | 'no_audience' | 'no_boundary' | 'no_rationale';

export interface Gap {
  id: GapId;
  evidence: string;
}

export interface Question {
  gapId: GapId;
  prompt: string;
  placeholder: string;
}

export interface AuditResult {
  reading: string;
  gaps: Gap[];
  questions: Question[];
  facts: StructuralFacts;
}
