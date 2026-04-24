import Link from 'next/link';
import type { Metadata } from 'next';
import { loadAllResults } from '@/lib/gallery/loadResults';
import { resolveLogo, stripIconTitle } from '@/lib/gallery/logo';

export const metadata: Metadata = {
  title: 'Audited — 25 products, inspected by ChatGPT + Claude',
  description:
    'We asked ChatGPT and Claude to describe 25 founder tools. Here is what they got wrong.',
};

export default function AuditedIndex() {
  const entries = loadAllResults().sort((a, b) => (b.criticalGaps ?? 0) - (a.criticalGaps ?? 0));

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <header className="mb-12 max-w-3xl">
        <p className="eyebrow text-ink-secondary mb-3">Audited</p>
        <h1 className="text-ink-primary mb-4 text-5xl font-bold tracking-tight md:text-6xl">
          What ChatGPT and Claude actually say about {entries.length} founder tools.
        </h1>
        <p className="text-ink-secondary text-xl">
          One click per tool. What the models invented, what they got confused about, and the{' '}
          <code className="bg-background-secondary rounded px-1.5 py-0.5 text-base">
            .gist.design
          </code>{' '}
          patch that would fix it.
        </p>
      </header>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((e) => {
          const logo = resolveLogo(e.simpleIcon);
          return (
            <li key={e.slug}>
              <Link
                href={`/audited/${e.slug}`}
                className="card-interactive group flex h-full flex-col gap-4 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: `${logo.hex}1A`, color: logo.hex }}
                    dangerouslySetInnerHTML={{
                      __html: stripIconTitle(logo.svg).replace(
                        '<svg',
                        '<svg width="24" height="24"'
                      ),
                    }}
                  />
                  <div className="flex-1">
                    <p className="text-ink-primary font-semibold">{e.name}</p>
                    <p className="text-ink-tertiary text-xs">
                      {new URL(e.url).hostname.replace(/^www\./, '')}
                    </p>
                  </div>
                  <ReadabilityChip score={e.readabilityScore} />
                </div>
                <p className="text-ink-secondary flex-1 text-sm leading-relaxed">
                  {e.headline?.description ?? 'Audited. See issues and patch.'}
                </p>
                <div className="text-ink-tertiary flex items-center justify-between text-xs">
                  <span>
                    {e.totalGaps ?? 0} issues · {e.criticalGaps ?? 0} critical
                  </span>
                  <span className="group-hover:text-brand-primary">See audit →</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      <section className="mt-16 flex flex-col items-start gap-4">
        <h2 className="text-ink-primary text-2xl font-bold">Audit your own product</h2>
        <p className="text-ink-secondary max-w-2xl">
          Enter a URL on the homepage and we&apos;ll show you how ChatGPT and Claude describe it —
          and what&apos;s wrong.
        </p>
        <Link
          href="/"
          className="bg-brand-primary hover:bg-brand-hover rounded-full px-6 py-3 font-medium text-white"
        >
          Run a free audit →
        </Link>
      </section>
    </main>
  );
}

function ReadabilityChip({ score }: { score: string | undefined }) {
  if (!score) return null;
  const palette =
    score === 'Good'
      ? 'bg-green-50 text-green-700'
      : score === 'Partial'
        ? 'bg-amber-50 text-amber-700'
        : 'bg-red-50 text-red-700';
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${palette}`}>{score}</span>;
}
