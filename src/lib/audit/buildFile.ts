import { AuditResult, Gap } from '@/types/audit';
import { GistDesignFile } from '@/types/file';
import { INITIAL_GIST_FILE } from '@/lib/createPrompt';

export function buildFileFromAudit(result: AuditResult): {
  file: GistDesignFile;
  initialFile: GistDesignFile | null;
  gaps: Gap[];
} {
  const analysis = result.analysis;
  if (!analysis) return { file: INITIAL_GIST_FILE, initialFile: null, gaps: [] };

  const draft = analysis.draftFile;
  const gaps = analysis.gaps ?? [];

  if (draft?.product && draft?.positioning && draft?.context) {
    const prefilledFile: GistDesignFile = {
      product: {
        name: draft.product.name || '',
        description: draft.product.description || '',
        audience: draft.product.audience || '',
        aiApproach: null,
      },
      positioning: {
        category: draft.positioning.category || '',
        forWho: draft.positioning.forWho || '',
        notForWho: draft.positioning.notForWho || '',
        comparisons: [],
      },
      context: {
        pricing: draft.context.pricing || '',
        integratesWith: [],
        requires: [],
        stage: draft.context.stage || '',
      },
      features: [],
    };
    return {
      file: prefilledFile,
      initialFile: structuredClone(prefilledFile),
      gaps,
    };
  }

  return { file: INITIAL_GIST_FILE, initialFile: null, gaps };
}
