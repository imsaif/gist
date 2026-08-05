import { describe, it, expect } from 'vitest';
import { scanStructure } from './scanner';
import type { RepoFiles } from '@/types/repo-audit';

const base: RepoFiles = {
  owner: 'acme',
  repo: 'widget',
  readme: null,
  packageDescription: null,
  filePaths: [],
};

describe('scanStructure', () => {
  it('reports an absent readme', () => {
    expect(scanStructure(base)).toEqual({
      hasReadme: false,
      readmeWords: 0,
      hasDocsDir: false,
      hasPackageDescription: false,
      fileCount: 0,
    });
  });

  it('counts readme words', () => {
    const f = scanStructure({ ...base, readme: 'one two  three\nfour' });
    expect(f.hasReadme).toBe(true);
    expect(f.readmeWords).toBe(4);
  });

  it('detects a docs directory at any depth', () => {
    expect(scanStructure({ ...base, filePaths: ['docs/intro.md'] }).hasDocsDir).toBe(true);
    expect(scanStructure({ ...base, filePaths: ['src/docs/x.md'] }).hasDocsDir).toBe(true);
    expect(scanStructure({ ...base, filePaths: ['src/docsify.ts'] }).hasDocsDir).toBe(false);
  });

  it('treats a whitespace-only description as absent', () => {
    expect(scanStructure({ ...base, packageDescription: '   ' }).hasPackageDescription).toBe(false);
  });

  it('counts files', () => {
    expect(scanStructure({ ...base, filePaths: ['a.ts', 'b.ts'] }).fileCount).toBe(2);
  });
});
