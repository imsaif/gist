'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GistIcon from '@/components/GistIcon';
import { LLMResponseCard } from '@/components/Audit/LLMResponseCard';
import { GapItem } from '@/components/Audit/GapItem';
import type { AuditResult, LLMProvider } from '@/types/audit';

const providers: LLMProvider[] = ['chatgpt', 'claude'];
const severityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2 };

export default function AuditReportPage() {
  const router = useRouter();
  const [result, setResult] = useState<AuditResult | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('audit_result');
    if (!raw) {
      router.replace('/');
      return;
    }
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResult(JSON.parse(raw) as AuditResult);

      setHydrated(true);
    } catch {
      router.replace('/');
    }
  }, [router]);

  if (!hydrated || !result) {
    return (
      <div className="bg-background-primary text-ink-tertiary flex min-h-screen items-center justify-center text-sm">
        Loading audit report…
      </div>
    );
  }

  const { responses, analysis, url } = result;
  const gaps = analysis?.gaps ?? [];
  const sortedGaps = [...gaps].sort(
    (a, b) => (severityOrder[a.severity] ?? 3) - (severityOrder[b.severity] ?? 3)
  );

  // Count gaps per model
  const gapCounts: Record<LLMProvider, number> = { chatgpt: 0, claude: 0 };
  for (const gap of gaps) {
    for (const model of gap.modelsAffected) gapCounts[model]++;
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

      <main className="mx-auto max-w-6xl space-y-10 px-6 py-12 pb-32">
        <div>
          <h1 className="text-ink-primary mb-1 text-2xl font-bold tracking-tight">Audit report</h1>
          <p className="text-ink-tertiary text-sm">{url}</p>
        </div>

        {/* What each model said */}
        <section>
          <h2 className="text-ink-primary mb-1 text-base font-semibold">
            What 2 LLMs said about your product
          </h2>
          <p className="text-ink-tertiary mb-5 text-sm">
            Each model was given your homepage content and asked to describe your product.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {providers.map((provider) => (
              <LLMResponseCard
                key={provider}
                response={responses[provider]}
                isLoading={false}
                gapCount={gapCounts[provider]}
              />
            ))}
          </div>
        </section>

        {/* Conflict table */}
        {sortedGaps.length > 0 && (
          <section>
            <h2 className="text-ink-primary mb-5 text-base font-semibold">
              {sortedGaps.length} conflict{sortedGaps.length !== 1 ? 's' : ''} found
            </h2>
            <div className="border-border-primary overflow-hidden rounded-xl border">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="bg-background-secondary">
                    <th className="text-ink-tertiary w-[45%] px-6 py-3.5 text-left text-xs font-semibold tracking-wider uppercase">
                      Issue
                    </th>
                    <th className="text-ink-tertiary w-[35%] px-6 py-3.5 text-left text-xs font-semibold tracking-wider uppercase">
                      Fix
                    </th>
                    <th className="text-ink-tertiary w-[20%] px-6 py-3.5 text-left text-xs font-semibold tracking-wider uppercase">
                      Severity
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-background-primary">
                  {sortedGaps.map((gap) => (
                    <GapItem key={gap.id} gap={gap} />
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {/* Sticky bottom CTA */}
      <div className="border-border-primary bg-background-primary/80 fixed right-0 bottom-0 left-0 z-50 border-t backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-ink-secondary text-sm">
            {sortedGaps.length} conflict{sortedGaps.length !== 1 ? 's' : ''} found
          </span>
          {sortedGaps.length > 0 && (
            <button
              onClick={() => router.push('/fix')}
              className="bg-brand-primary hover:bg-brand-hover inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-colors"
            >
              Fix conflicts
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
