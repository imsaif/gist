'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GistIcon from '@/components/GistIcon';
import { GapFixer } from '@/components/Create/GapFixer';
import { Toast } from '@/components/Toast';
import { generateGistDesignMarkdown } from '@/lib/export/markdown';
import { buildFileFromAudit } from '@/lib/audit/buildFile';
import { INITIAL_GIST_FILE } from '@/lib/createPrompt';
import type { AuditResult, Gap } from '@/types/audit';
import type { GistDesignFile, ProductOverview } from '@/types/file';

export default function FixPage() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [file, setFile] = useState<GistDesignFile>(INITIAL_GIST_FILE);
  const [initialFile, setInitialFile] = useState<GistDesignFile | null>(null);
  const [gaps, setGaps] = useState<Gap[]>([]);
  const [toast, setToast] = useState({ isVisible: false, message: '' });

  useEffect(() => {
    const raw = sessionStorage.getItem('audit_result');
    if (!raw) {
      router.replace('/');
      return;
    }
    try {
      const result = JSON.parse(raw) as AuditResult;
      const ctx = buildFileFromAudit(result);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFile(ctx.file);

      setInitialFile(ctx.initialFile);

      setGaps(ctx.gaps);

      setHydrated(true);
    } catch {
      router.replace('/');
    }
  }, [router]);

  const handleProductFieldChange = useCallback((field: keyof ProductOverview, value: string) => {
    setFile((prev) => ({ ...prev, product: { ...prev.product, [field]: value } }));
  }, []);

  const handlePositioningFieldChange = useCallback(
    (field: 'category' | 'forWho' | 'notForWho', value: string) => {
      setFile((prev) => ({ ...prev, positioning: { ...prev.positioning, [field]: value } }));
    },
    []
  );

  const handleContextFieldChange = useCallback((field: 'pricing' | 'stage', value: string) => {
    setFile((prev) => ({ ...prev, context: { ...prev.context, [field]: value } }));
  }, []);

  const handleDownload = useCallback(() => {
    const markdown = generateGistDesignMarkdown(file);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'llms.gist';
    a.click();
    URL.revokeObjectURL(url);
    setToast({ isVisible: true, message: 'File downloaded' });
  }, [file]);

  const handleCopyMarkdown = useCallback(() => {
    const markdown = generateGistDesignMarkdown(file);
    navigator.clipboard.writeText(markdown);
    setToast({ isVisible: true, message: 'Copied to clipboard' });
  }, [file]);

  if (!hydrated) {
    return (
      <div className="bg-background-primary text-ink-tertiary flex min-h-screen items-center justify-center text-sm">
        Loading audit results…
      </div>
    );
  }

  return (
    <div className="bg-background-primary min-h-screen">
      <header className="flex h-14 items-center justify-between px-6">
        <Link href="/" className="text-ink-primary flex items-center gap-2 text-xl font-semibold">
          <GistIcon className="h-5 w-5" />
          llms.gist
        </Link>
        <Link
          href="/"
          className="text-ink-secondary hover:text-ink-primary text-sm font-medium transition-colors"
        >
          Back to audit
        </Link>
      </header>

      <main className="mx-auto max-w-7xl px-6 pb-16">
        <GapFixer
          gaps={gaps}
          file={file}
          initialFile={initialFile}
          onBackToAudit={() => router.push('/')}
          onProductFieldChange={handleProductFieldChange}
          onPositioningFieldChange={handlePositioningFieldChange}
          onContextFieldChange={handleContextFieldChange}
          onDownload={handleDownload}
          onCopyMarkdown={handleCopyMarkdown}
        />
      </main>

      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={() => setToast({ isVisible: false, message: '' })}
      />
    </div>
  );
}
