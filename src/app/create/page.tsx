'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GistDesignFile, ProductOverview } from '@/types/file';
import { INITIAL_GIST_FILE } from '@/lib/createPrompt';
import { AuditResult, Gap } from '@/types/audit';
import { generateGistDesignMarkdown } from '@/lib/export/markdown';
import { GapFixer } from '@/components/Create/GapFixer';
import { Toast } from '@/components/Toast';

// ============================================
// Page Component
// ============================================

function CreateModeContent() {
  return <CreateModeInner />;
}

export default function CreateMode() {
  return (
    <Suspense fallback={<CreateModeLoading />}>
      <CreateModeContent />
    </Suspense>
  );
}

function CreateModeLoading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-text-tertiary">Loading...</div>
    </div>
  );
}

function loadAuditContext(): {
  file: GistDesignFile;
  initialFile: GistDesignFile | null;
  gaps: Gap[];
} | null {
  try {
    const stored = typeof window !== 'undefined' ? sessionStorage.getItem('audit_context') : null;
    if (!stored) return null;

    const auditResult: AuditResult = JSON.parse(stored);
    if (!auditResult.analysis) return null;

    sessionStorage.removeItem('audit_context');

    const draft = auditResult.analysis.draftFile;
    if (draft) {
      const prefilledFile: GistDesignFile = {
        product: {
          name: draft.product.name,
          description: draft.product.description,
          audience: draft.product.audience,
          aiApproach: null,
        },
        positioning: {
          category: draft.positioning.category,
          forWho: draft.positioning.forWho,
          notForWho: draft.positioning.notForWho,
          comparisons: [],
        },
        context: {
          pricing: draft.context.pricing,
          integratesWith: [],
          requires: [],
          stage: draft.context.stage,
        },
        features: [],
      };
      return {
        file: prefilledFile,
        initialFile: structuredClone(prefilledFile),
        gaps: auditResult.analysis.gaps,
      };
    }

    return { file: INITIAL_GIST_FILE, initialFile: null, gaps: auditResult.analysis.gaps };
  } catch (err) {
    console.error('Failed to load audit context:', err);
    return null;
  }
}

function CreateModeInner() {
  const router = useRouter();

  const [auditContext] = useState(loadAuditContext);
  const [file, setFile] = useState<GistDesignFile>(auditContext?.file ?? INITIAL_GIST_FILE);
  const [initialFile] = useState<GistDesignFile | null>(auditContext?.initialFile ?? null);
  const [auditGaps] = useState<Gap[]>(auditContext?.gaps ?? []);

  // UI state
  const [toast, setToast] = useState({ isVisible: false, message: '' });

  // Redirect to home if no audit context
  useEffect(() => {
    if (!auditContext) {
      router.replace('/');
    }
  }, [auditContext, router]);

  // Inline edit handlers
  const handleProductFieldChange = useCallback((field: keyof ProductOverview, value: string) => {
    setFile((prev) => ({
      ...prev,
      product: { ...prev.product, [field]: value },
    }));
  }, []);

  const handlePositioningFieldChange = useCallback(
    (field: 'category' | 'forWho' | 'notForWho', value: string) => {
      setFile((prev) => ({
        ...prev,
        positioning: { ...prev.positioning, [field]: value },
      }));
    },
    []
  );

  const handleContextFieldChange = useCallback((field: 'pricing' | 'stage', value: string) => {
    setFile((prev) => ({
      ...prev,
      context: { ...prev.context, [field]: value },
    }));
  }, []);

  // Download handler
  const handleDownload = useCallback(() => {
    const markdown = generateGistDesignMarkdown(file);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(file.product.name || 'untitled').toLowerCase().replace(/\s+/g, '-')}.gist.design`;
    a.click();
    URL.revokeObjectURL(url);
    setToast({ isVisible: true, message: 'File downloaded' });
  }, [file]);

  // Copy markdown handler
  const handleCopyMarkdown = useCallback(() => {
    const markdown = generateGistDesignMarkdown(file);
    navigator.clipboard.writeText(markdown);
    setToast({ isVisible: true, message: 'Copied to clipboard' });
  }, [file]);

  // If no audit context, we're redirecting — show loading
  if (!auditContext) {
    return <CreateModeLoading />;
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="border-border-light flex h-14 items-center justify-between border-b px-6">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-text-primary hover:text-accent-primary text-xl font-semibold transition-colors"
          >
            Gist
          </Link>
          <span className="text-text-tertiary">/</span>
          <span className="bg-bg-secondary flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="text-accent-primary h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.049.58.025 1.194-.14 1.743"
              />
            </svg>
            <span className="text-text-secondary">Fix gaps</span>
          </span>
        </div>
        <Link
          href="/"
          className="border-border-light text-text-secondary hover:bg-bg-secondary rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
        >
          New audit
        </Link>
      </header>

      {/* Gap fixer */}
      <div className="flex-1 overflow-y-auto">
        <GapFixer
          gaps={auditGaps}
          file={file}
          initialFile={initialFile}
          onProductFieldChange={handleProductFieldChange}
          onPositioningFieldChange={handlePositioningFieldChange}
          onContextFieldChange={handleContextFieldChange}
          onDownload={handleDownload}
          onCopyMarkdown={handleCopyMarkdown}
        />
      </div>

      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={() => setToast({ isVisible: false, message: '' })}
      />
    </div>
  );
}
