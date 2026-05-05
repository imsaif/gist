import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CATEGORY_LABELS, loadAllSlugs, loadResult } from '@/lib/gallery/loadResults';
import { resolveLogo, stripIconTitle } from '@/lib/gallery/logo';
import { renderDraftMarkdown } from '@/lib/gallery/renderDraftMarkdown';
import { SiteHeader } from '@/components/Layout/SiteHeader';
import { AuditUsageBlock } from '@/components/Gallery/AuditUsageBlock';
import { AuditStatsRail } from '@/components/Gallery/AuditStatsRail';
import { AuditPreviewTabs } from '@/components/Gallery/AuditPreviewTabs';
import { RequestPrivateButton } from '@/components/Gallery/RequestPrivateButton';

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
  const title = `Audit of how AI describes ${entry.name} · llms.gist`;
  const description =
    entry.headline?.description ?? `What ChatGPT and Claude say about ${entry.name} today.`;
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
  const headline = entry.headline;
  const llmsGistMarkdown = renderDraftMarkdown(entry.draftFile, entry.name);
  const categoryLabel = entry.category ? CATEGORY_LABELS[entry.category] : null;
  const description = composeDescription(entry);

  return (
    <div className="bg-background-primary min-h-screen">
      <SiteHeader active="audited" />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <nav className="mb-6">
          <Link href="/audited" className="text-ink-secondary hover:text-ink-primary text-sm">
            ← Back to audits
          </Link>
        </nav>

        <header className="mb-10 flex flex-col items-start gap-5">
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ background: `${logo.hex}1A`, color: logo.hex }}
              dangerouslySetInnerHTML={{
                __html: stripIconTitle(logo.svg).replace('<svg', '<svg width="32" height="32"'),
              }}
            />
            <div>
              {categoryLabel && <p className="eyebrow text-ink-tertiary mb-1">{categoryLabel}</p>}
              <h1 className="text-ink-primary text-3xl font-bold tracking-tight md:text-4xl">
                Audit of how AI describes {entry.name}
              </h1>
            </div>
          </div>
          {description && (
            <p className="text-ink-secondary max-w-3xl text-base leading-relaxed md:text-lg">
              {description}
            </p>
          )}
        </header>

        <section className="mb-12 grid gap-6 lg:grid-cols-[1fr_320px]">
          <AuditUsageBlock slug={entry.slug} />
          <AuditStatsRail
            slug={entry.slug}
            companyName={entry.name}
            criticalGaps={entry.criticalGaps ?? 0}
            totalGaps={entry.totalGaps ?? 0}
            readabilityScore={entry.readabilityScore}
            rawFileHref={`/audited/${entry.slug}/llms.gist`}
          />
        </section>

        <section className="mb-12">
          <AuditPreviewTabs
            chatgptText={headline?.chatgptSays ?? null}
            claudeText={headline?.claudeSays ?? null}
            llmsGistMarkdown={llmsGistMarkdown}
          />
        </section>

        {entry.allGaps && entry.allGaps.length > 0 && (
          <section className="mb-16">
            <h3 className="text-ink-primary mb-4 text-lg font-semibold">
              All {entry.totalGaps ?? entry.allGaps.length} issues
            </h3>
            <ul className="border-border-primary divide-border-primary divide-y overflow-hidden rounded-2xl border">
              {entry.allGaps.map((g) => (
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
          </section>
        )}

        <section className="border-border-primary mt-16 rounded-3xl border p-10 text-center">
          <h3 className="text-ink-primary mb-3 text-2xl font-bold">
            Want a hand-crafted llms.gist for your product?
          </h3>
          <p className="text-ink-secondary mx-auto mb-6 max-w-xl">
            We&apos;ll audit your site, write a tailored llms.gist, and email it to you. Never
            published in the public gallery.
          </p>
          <RequestPrivateButton refSlug={entry.slug} />
        </section>
      </main>
    </div>
  );
}

function composeDescription(entry: ReturnType<typeof loadResult>): string | null {
  if (!entry) return null;
  const headline = entry.headline?.description;
  const firstGap = entry.allGaps?.[0]?.description;
  if (headline && firstGap && headline !== firstGap) {
    return `${headline} ${firstGap}`;
  }
  return headline ?? firstGap ?? null;
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
