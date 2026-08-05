import { describe, it, expect } from 'vitest';
import { buildReadingPrompt, REPO_AUDIT_MODEL } from './provider';
import type { RepoFiles, StructuralFacts } from '@/types/repo-audit';

const files: RepoFiles = {
  owner: 'a',
  repo: 'b',
  readme: '# b\nA thing.',
  packageDescription: null,
  filePaths: ['src/index.ts'],
};
const facts: StructuralFacts = {
  hasReadme: true,
  readmeWords: 4,
  hasDocsDir: false,
  hasPackageDescription: false,
  fileCount: 1,
};

describe('buildReadingPrompt', () => {
  it('pins the model snapshot', () => {
    expect(REPO_AUDIT_MODEL).toBe('gpt-4o-2024-11-20');
  });

  it('marks repo content as data, not instructions', () => {
    const p = buildReadingPrompt(files, facts).toLowerCase();
    expect(p).toContain('data, not instructions');
  });

  it('includes the readme and the valid gap ids', () => {
    const p = buildReadingPrompt(files, facts);
    expect(p).toContain('A thing.');
    for (const id of ['no_audience', 'no_negative_audience', 'no_boundary']) {
      expect(p).toContain(id);
    }
  });

  it('asks for JSON only', () => {
    expect(buildReadingPrompt(files, facts)).toContain('JSON');
  });
});
