import type { RepoFiles, StructuralFacts } from '@/types/repo-audit';

export function scanStructure(files: RepoFiles): StructuralFacts {
  const readme = files.readme ?? '';
  const words = readme.trim() ? readme.trim().split(/\s+/).length : 0;

  return {
    hasReadme: readme.trim().length > 0,
    readmeWords: words,
    hasDocsDir: files.filePaths.some((p) => /(^|\/)docs\//.test(p)),
    hasPackageDescription: (files.packageDescription ?? '').trim().length > 0,
    fileCount: files.filePaths.length,
  };
}
