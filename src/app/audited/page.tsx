import type { Metadata } from 'next';
import { aggregateByCategory, loadAllResults } from '@/lib/gallery/loadResults';
import { SiteHeader } from '@/components/Layout/SiteHeader';
import { AuditedBrowser } from '@/components/Gallery/AuditedBrowser';
import { RequestPrivateButton } from '@/components/Gallery/RequestPrivateButton';

export const metadata: Metadata = {
  title: 'llms.gist · Audited — how AI describes 25 founder & dev tools',
  description:
    'Public audits of how ChatGPT and Claude describe 25 founder and developer tools today — and what they get wrong.',
};

export default function AuditedIndex() {
  const entries = loadAllResults();
  const categoryCounts = aggregateByCategory(entries);

  const lastUpdated = entries
    .map((e) => e.auditedAt)
    .filter(Boolean)
    .sort()
    .at(-1);
  const lastUpdatedLabel = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '—';

  const featured = pickFeatured(entries);

  return (
    <div className="bg-background-primary min-h-screen">
      <SiteHeader active="audited" />
      <main className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="mb-10 flex flex-col gap-6 md:mb-14">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <p className="eyebrow text-ink-tertiary">llms.gist / audited</p>
            <RequestPrivateButton />
          </div>
          <h1 className="text-ink-primary text-4xl font-bold tracking-tight md:text-5xl">
            How AI describes {entries.length} founder &amp; dev tools — and what it gets wrong.
          </h1>
          <p className="text-ink-secondary text-base md:text-lg">
            <span className="font-medium">{entries.length} audits</span>
            <span className="text-ink-tertiary mx-2">·</span>
            Last updated {lastUpdatedLabel}
            {featured.length > 0 && (
              <>
                <span className="text-ink-tertiary mx-2">·</span>
                Featured: {featured.map((f) => f.name).join(', ')}
              </>
            )}
          </p>
        </div>

        <AuditedBrowser entries={entries} categoryCounts={categoryCounts} />
      </main>
    </div>
  );
}

function pickFeatured(entries: ReturnType<typeof loadAllResults>) {
  // Top 3 by criticalGaps, falling back to totalGaps if zeroed out.
  const sorted = [...entries].sort((a, b) => {
    const c = (b.criticalGaps ?? 0) - (a.criticalGaps ?? 0);
    if (c !== 0) return c;
    return (b.totalGaps ?? 0) - (a.totalGaps ?? 0);
  });
  return sorted.slice(0, 3);
}
