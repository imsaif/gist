import type { Metadata } from 'next';
import Link from 'next/link';
import { aggregateByCategory, loadAllResults } from '@/lib/gallery/loadResults';
import { SiteHeader } from '@/components/Layout/SiteHeader';
import { AuditedBrowser } from '@/components/Gallery/AuditedBrowser';
import { AuditHeroToggle } from '@/components/Audit';
import { LogoMarquee } from '@/components/LogoMarquee';

export const metadata: Metadata = {
  title: 'llms.gist — public llms.gist files for popular products',
  description:
    'Browse public llms.gist files for popular founder and developer tools. Drop one in your repo so AI tools describe your product correctly.',
};

export default function Home() {
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

  return (
    <div className="bg-background-primary min-h-screen">
      <SiteHeader />

      <section className="bg-background-grain bg-grain px-6 pt-16 pb-12 md:px-10 md:pt-24 md:pb-16 lg:px-14">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <p className="eyebrow text-ink-tertiary mb-5">llms.gist</p>
          <h1 className="text-ink-primary text-3xl leading-[1.1] font-bold tracking-[-0.02em] md:text-4xl lg:text-5xl">
            AI doesn&apos;t know your product.
            <br />
            <span className="text-brand-primary font-serif italic">llms.gist</span>{' '}
            <span className="text-ink-primary">makes sure it knows.</span>
          </h1>
          <p className="text-ink-secondary mt-6 max-w-xl text-base leading-relaxed md:text-lg">
            ChatGPT, Claude, and coding agents fabricate features, miss positioning, and blend you
            with competitors. Drop an{' '}
            <code className="bg-background-secondary rounded px-1 py-0.5 text-sm font-medium">
              llms.gist
            </code>{' '}
            file at{' '}
            <code className="bg-background-secondary rounded px-1 py-0.5 text-sm font-medium">
              /llms.gist
            </code>{' '}
            so they describe your product correctly.
          </p>
          <div className="mt-10 flex w-full justify-center">
            <AuditHeroToggle />
          </div>
          <p className="text-ink-tertiary mt-8 text-xs tabular-nums">
            {entries.length} public {entries.length === 1 ? 'file' : 'files'} below · Updated{' '}
            {lastUpdatedLabel}
          </p>
        </div>
      </section>

      <LogoMarquee />

      <main id="browse" className="scroll-mt-20 px-6 pb-20 md:px-10 lg:px-14">
        <div className="mb-8 pt-10">
          <h2 className="text-ink-primary text-2xl font-bold tracking-tight md:text-3xl">
            Find llms.gist files
          </h2>
        </div>
        <AuditedBrowser entries={entries} categoryCounts={categoryCounts} />
      </main>

      <footer className="text-ink-tertiary mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 pb-6 text-xs">
        <span>llms.gist · 2026</span>
        <Link href="/spec" className="hover:text-ink-primary transition-colors">
          Built on the open .gist spec
        </Link>
      </footer>
    </div>
  );
}
