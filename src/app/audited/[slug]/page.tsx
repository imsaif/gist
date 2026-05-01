import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { loadAllSlugs, loadResult } from '@/lib/gallery/loadResults';
import { resolveLogo, stripIconTitle } from '@/lib/gallery/logo';
import { SiteHeader } from '@/components/Layout/SiteHeader';
import type { GapCategory } from '@/types/audit';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return loadAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = loadResult(slug);
  if (!entry) return { title: 'Audit not found' };
  const title = `${entry.name} — audited by ChatGPT and Claude`;
  const description = entry.headline?.description ?? `AI readability audit for ${entry.name}`;
  return {
    title,
    description,
    openGraph: { title, description, type: 'article' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function AuditedDetail({ params }: Props) {
  const { slug } = await params;
  const entry = loadResult(slug);
  if (!entry) notFound();

  const logo = resolveLogo(entry.simpleIcon);
  const host = new URL(entry.url).hostname.replace(/^www\./, '');
  const headline = entry.headline;
  const auditedDate = new Date(entry.auditedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-background-primary min-h-screen">
      <SiteHeader active="audited" />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <nav className="mb-8">
          <Link href="/audited" className="text-ink-secondary hover:text-ink-primary text-sm">
            ← All 25 audits
          </Link>
        </nav>

        <header className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ background: `${logo.hex}1A`, color: logo.hex }}
              dangerouslySetInnerHTML={{
                __html: stripIconTitle(logo.svg).replace('<svg', '<svg width="32" height="32"'),
              }}
            />
            <div>
              <h1 className="text-ink-primary text-3xl font-bold md:text-4xl">{entry.name}</h1>
              <a
                href={entry.url}
                target="_blank"
                rel="noreferrer"
                className="text-ink-secondary hover:text-brand-primary text-sm"
              >
                {host} ↗
              </a>
            </div>
          </div>
          <div className="flex flex-col text-right text-xs">
            <span className="text-ink-tertiary">Audited</span>
            <span className="text-ink-secondary">{auditedDate}</span>
          </div>
        </header>

        {headline && (
          <section className="card-interactive mb-12 rounded-3xl p-8 md:p-10">
            <p className="eyebrow text-ink-secondary mb-3">{headlineEyebrow(headline.category)}</p>
            <h2 className="text-ink-primary mb-6 text-2xl leading-tight font-bold md:text-3xl">
              {headline.description}
            </h2>
            {headline.chatgptSays && (
              <blockquote className="border-brand-primary bg-background-secondary text-ink-secondary rounded-r-xl border-l-4 px-5 py-3 text-base italic">
                &ldquo;{headline.chatgptSays}&rdquo;
                <footer className="text-ink-tertiary mt-2 text-xs not-italic">
                  — what ChatGPT told a founder asking about {entry.name}
                </footer>
              </blockquote>
            )}
          </section>
        )}

        {headline && (headline.chatgptSays || headline.claudeSays || headline.siteContent) && (
          <section className="mb-12">
            <h3 className="text-ink-primary mb-4 text-lg font-semibold">Evidence</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <EvidenceCol label="ChatGPT says" text={headline.chatgptSays} />
              <EvidenceCol label="Claude says" text={headline.claudeSays} />
              <EvidenceCol label="Site says" text={headline.siteContent} />
            </div>
          </section>
        )}

        <section className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-[1fr_360px]">
          <div>
            <h3 className="text-ink-primary mb-4 text-lg font-semibold">
              All {entry.totalGaps ?? 0} issues
            </h3>
            <ul className="border-border-primary divide-border-primary divide-y overflow-hidden rounded-2xl border">
              {entry.allGaps?.map((g) => (
                <li key={g.id} className="p-4">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <SeverityChip severity={g.severity} />
                    <span className="text-ink-tertiary text-xs">
                      {g.category.replace(/_/g, ' ')}
                    </span>
                    <span className="text-ink-tertiary text-xs">
                      · {g.modelsAffected.join(', ')}
                    </span>
                  </div>
                  <p className="text-ink-primary text-sm">{g.description}</p>
                  {g.whatFileNeeds && (
                    <p className="text-ink-secondary mt-1 text-xs">
                      <strong>Patch:</strong> {g.whatFileNeeds}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <aside className="border-border-primary bg-background-secondary rounded-2xl border p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-ink-primary text-sm font-semibold">
                The <code className="text-brand-primary">.gist</code> patch
              </h3>
            </div>
            <DraftFilePreview draftFile={entry.draftFile} />
            <div className="mt-6 grid grid-cols-3 gap-2 text-center">
              <ScoreMetric label="Readability" value={entry.readabilityScore ?? '—'} />
              <ScoreMetric label="Issues" value={`${entry.totalGaps ?? 0}`} />
              <ScoreMetric label="Critical" value={`${entry.criticalGaps ?? 0}`} />
            </div>
          </aside>
        </section>

        <section className="border-border-primary mt-16 rounded-3xl border p-10 text-center">
          <h3 className="text-ink-primary mb-3 text-2xl font-bold">
            Run this audit on your own product.
          </h3>
          <p className="text-ink-secondary mb-6">
            Free. One URL, 60 seconds, and you&apos;ll know what ChatGPT invented about you.
          </p>
          <Link
            href="/"
            className="bg-brand-primary hover:bg-brand-hover inline-block rounded-full px-6 py-3 font-medium text-white"
          >
            Audit my product →
          </Link>
        </section>
      </main>
    </div>
  );
}

function EvidenceCol({ label, text }: { label: string; text: string | null }) {
  return (
    <div className="border-border-primary rounded-2xl border p-4">
      <p className="text-ink-tertiary mb-2 text-xs tracking-wide uppercase">{label}</p>
      <p className="text-ink-primary text-sm leading-relaxed">{text ?? <em>— no response</em>}</p>
    </div>
  );
}

function SeverityChip({ severity }: { severity: string }) {
  const palette =
    severity === 'critical'
      ? 'bg-red-50 text-red-700'
      : severity === 'high'
        ? 'bg-amber-50 text-amber-700'
        : 'bg-slate-100 text-slate-700';
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${palette}`}>
      {severity}
    </span>
  );
}

function ScoreMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-ink-primary text-lg font-bold">{value}</p>
      <p className="text-ink-tertiary text-xs">{label}</p>
    </div>
  );
}

function DraftFilePreview({ draftFile }: { draftFile: unknown }) {
  if (!draftFile) return <p className="text-ink-tertiary text-xs">Draft not generated.</p>;
  const df = draftFile as {
    product?: { name?: string | null; description?: string | null; audience?: string | null };
    positioning?: {
      category?: string | null;
      forWho?: string | null;
      notForWho?: string | null;
    };
    context?: { pricing?: string | null; stage?: string | null };
  };
  const rows: Array<[string, string | null | undefined]> = [
    ['category', df.positioning?.category],
    ['for', df.positioning?.forWho],
    ['not for', df.positioning?.notForWho],
    ['audience', df.product?.audience],
    ['pricing', df.context?.pricing],
    ['stage', df.context?.stage],
  ];
  return (
    <dl className="flex flex-col gap-2 text-xs">
      {rows.map(([k, v]) =>
        v ? (
          <div key={k} className="flex gap-2">
            <dt className="text-ink-tertiary w-20 flex-none tracking-wide uppercase">{k}</dt>
            <dd className="text-ink-secondary flex-1 break-words">{v}</dd>
          </div>
        ) : null
      )}
    </dl>
  );
}

function headlineEyebrow(category: GapCategory): string {
  switch (category) {
    case 'fabrication':
      return 'ChatGPT invented this';
    case 'category_conflict':
      return 'The models disagree on what this is';
    case 'contradiction':
      return 'Contradiction between models';
    case 'audience_mismatch':
      return 'Audience mismatch';
    case 'missing_differentiator':
      return 'Missing differentiator';
    case 'pricing_confusion':
      return 'Pricing confusion';
    case 'shared_inaccuracy':
      return 'Both models got this wrong';
    default:
      return 'Top issue';
  }
}
