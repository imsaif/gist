import {
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  BellAlertIcon,
  ChartBarSquareIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { LandingWithAudit } from './LandingWithAudit';

function Section({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="py-16 md:py-20">
      {children}
    </section>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-ink-primary mb-4 text-4xl font-bold tracking-tight md:text-5xl">
      {children}
    </h2>
  );
}

function PillarCard({
  title,
  body,
  mockup,
}: {
  title: string;
  body: string;
  mockup: React.ReactNode;
}) {
  return (
    <div className="card-interactive overflow-hidden p-0">
      <div className="bg-background-grain bg-grain border-border-primary border-b p-5">
        {mockup}
      </div>
      <div className="p-6">
        <h3 className="text-ink-primary mb-2 text-xl font-semibold">{title}</h3>
        <p className="text-ink-secondary text-base leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

function AuditMock() {
  const rows = [
    { name: 'ChatGPT', score: 78 },
    { name: 'Claude', score: 81 },
    { name: 'Perplexity', score: 58 },
  ];
  return (
    <div className="bg-surface-primary border-border-primary rounded-xl border p-4 shadow-[0_2px_8px_rgba(51,65,85,0.04)]">
      <div className="text-ink-tertiary mb-3 text-[10px] font-medium tracking-wider uppercase">
        Visibility score
      </div>
      <div className="space-y-2.5">
        {rows.map((r) => (
          <div key={r.name} className="flex items-center gap-3">
            <span className="text-ink-secondary w-20 shrink-0 text-xs font-medium">{r.name}</span>
            <div className="bg-background-tertiary relative h-1.5 flex-1 overflow-hidden rounded-full">
              <div
                className="bg-brand-primary absolute inset-y-0 left-0 rounded-full"
                style={{ width: `${r.score}%` }}
              />
            </div>
            <span className="text-ink-primary w-7 text-right text-xs font-semibold">{r.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FixMock() {
  return (
    <div className="bg-surface-primary border-border-primary rounded-xl border p-4 font-mono text-xs shadow-[0_2px_8px_rgba(51,65,85,0.04)]">
      <div className="text-ink-tertiary mb-2 font-sans text-[10px] font-medium tracking-wider uppercase">
        .gist.design
      </div>
      <div className="space-y-1.5">
        <div className="text-ink-tertiary">## Positioning</div>
        <div className="flex gap-2">
          <span className="text-red-500">−</span>
          <span className="text-red-600/80 line-through decoration-red-500/40">
            For: project managers
          </span>
        </div>
        <div className="flex gap-2">
          <span className="text-emerald-600">+</span>
          <span className="text-emerald-700">For: product engineering teams</span>
        </div>
        <div className="flex gap-2">
          <span className="text-emerald-600">+</span>
          <span className="text-emerald-700">Not for: enterprise PMOs, agencies</span>
        </div>
      </div>
    </div>
  );
}

function TrackMock() {
  const points = [40, 44, 42, 48, 55, 58, 64, 67, 72];
  const max = 100;
  const w = 220;
  const h = 60;
  const step = w / (points.length - 1);
  const path = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${i * step} ${h - (p / max) * h}`)
    .join(' ');
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;
  return (
    <div className="bg-surface-primary border-border-primary rounded-xl border p-4 shadow-[0_2px_8px_rgba(51,65,85,0.04)]">
      <div className="mb-2 flex items-baseline justify-between">
        <div className="text-ink-tertiary text-[10px] font-medium tracking-wider uppercase">
          Score over time
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-ink-primary text-base font-bold">72</span>
          <span className="text-xs font-medium text-emerald-600">+12</span>
        </div>
      </div>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d={area} fill="rgb(22 32 54 / 0.08)" />
        <path d={path} fill="none" stroke="rgb(22 32 54)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function MarketingSections() {
  return (
    <>
      {/* How it works — Audit, Fix, Track */}
      <div className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <SectionHeading>Audit. Fix. Track.</SectionHeading>
          <p className="text-ink-secondary mb-10 max-w-2xl text-lg leading-relaxed">
            One-time audits find today&apos;s gaps. Monitoring catches tomorrow&apos;s drift.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <PillarCard
              title="Audit"
              body="Run your URL through ChatGPT, Claude, and Perplexity. Score the conflicts, fabrications, and positioning drift."
              mockup={<AuditMock />}
            />
            <PillarCard
              title="Fix"
              body="Gap fixer outputs a file patching what AI tools miss. Paste into Cursor, Claude Code, or your repo."
              mockup={<FixMock />}
            />
            <PillarCard
              title="Track"
              body="Weekly re-audits track your AI visibility score. Alerts when a model materially changes how it describes you."
              mockup={<TrackMock />}
            />
          </div>
        </div>
      </div>

      {/* Monitor over time */}
      <div className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
            <div>
              <SectionHeading>Drift happens. Get alerted when it does.</SectionHeading>
              <p className="text-ink-secondary mb-6 text-lg leading-relaxed">
                Models update. Your site changes. Competitors launch. Your AI visibility score
                drifts — we re-audit on a schedule and tell you when something material changed.
              </p>
              <ul className="text-ink-secondary space-y-3 text-base">
                <li className="flex items-start gap-3">
                  <BellAlertIcon className="text-brand-primary mt-0.5 h-5 w-5 shrink-0" />
                  Weekly re-audits across every major model
                </li>
                <li className="flex items-start gap-3">
                  <BellAlertIcon className="text-brand-primary mt-0.5 h-5 w-5 shrink-0" />
                  Diffs when a model changes how it describes you
                </li>
                <li className="flex items-start gap-3">
                  <BellAlertIcon className="text-brand-primary mt-0.5 h-5 w-5 shrink-0" />
                  Competitor tracking — audit yours and theirs side-by-side
                </li>
              </ul>
            </div>
            <div className="glass-strong rounded-2xl p-6">
              <div className="text-ink-tertiary mb-4 text-xs font-semibold tracking-wider uppercase">
                AI Visibility Score
              </div>
              <div className="mb-6 flex items-baseline gap-3">
                <span className="text-ink-primary text-5xl font-bold">78</span>
                <span className="text-brand-primary inline-flex items-center gap-1 text-sm font-medium">
                  <ArrowTrendingUpIcon className="h-4 w-4" />
                  +12 this month
                </span>
              </div>
              <div className="space-y-2.5">
                {[
                  { model: 'ChatGPT', score: 82, trend: '+8' },
                  { model: 'Claude', score: 79, trend: '+15' },
                  { model: 'Perplexity', score: 74, trend: '+13' },
                  { model: 'Gemini', score: 71, trend: '+10' },
                ].map((row) => (
                  <div key={row.model} className="flex items-center justify-between text-sm">
                    <span className="text-ink-primary w-24 font-medium">{row.model}</span>
                    <div className="bg-background-tertiary mx-3 h-1.5 flex-1 overflow-hidden rounded-full">
                      <div
                        className="bg-brand-primary h-full rounded-full"
                        style={{ width: `${row.score}%` }}
                      />
                    </div>
                    <span className="text-ink-primary w-8 text-right font-mono">{row.score}</span>
                    <span className="text-brand-primary ml-2 w-10 text-right font-mono text-xs">
                      {row.trend}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-brand-primary/20 bg-brand-primary/[0.06] mt-6 rounded-xl border p-3 text-sm">
                <span className="text-brand-primary font-semibold">ChatGPT drift · 2 days ago</span>
                <p className="text-ink-secondary mt-1 leading-relaxed">
                  Started describing your category as &ldquo;project management&rdquo; instead of
                  &ldquo;issue tracker.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Example output — full-width sample audit */}
      <div className="bg-background-secondary border-border-primary relative overflow-hidden border-y">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="eyebrow mb-3">Example audit</div>
          <SectionHeading>Here&apos;s what an audit looks like</SectionHeading>
          <p className="text-ink-secondary mb-10 max-w-2xl text-lg leading-relaxed">
            linear.app, audited live. Three models, three perspectives, four conflicts surfaced.
          </p>

          <div className="card-interactive overflow-hidden p-0">
            {/* Header bar */}
            <div className="bg-background-tertiary border-border-primary flex flex-col items-start justify-between gap-2 border-b px-5 py-4 md:flex-row md:items-center">
              <div className="flex items-center gap-3">
                <div className="bg-surface-primary border-border-primary flex h-8 w-8 items-center justify-center rounded-lg border">
                  <ShieldCheckIcon className="text-brand-primary h-4 w-4" />
                </div>
                <div>
                  <div className="text-ink-primary text-sm font-semibold">linear.app</div>
                  <div className="text-ink-tertiary text-xs">Audited just now · 4 conflicts</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="chip">
                  <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Score 72
                </span>
                <span className="text-xs font-semibold text-emerald-600">+12</span>
              </div>
            </div>

            {/* 3-model comparison */}
            <div className="divide-border-primary grid grid-cols-1 divide-y md:grid-cols-3 md:divide-x md:divide-y-0">
              {[
                {
                  model: 'ChatGPT',
                  quote:
                    'Linear is a project management platform with kanban boards, Gantt charts, and team chat — comparable to Jira but with a cleaner UI.',
                  flag: 'fabrication',
                },
                {
                  model: 'Claude',
                  quote:
                    'Linear is an issue tracker built for software teams, optimized for keyboard-driven speed and a pared-down feature surface.',
                  flag: 'aligned',
                },
                {
                  model: 'Perplexity',
                  quote:
                    'Linear is recommended for enterprise project managers who need cross-team visibility and reporting dashboards.',
                  flag: 'audience-drift',
                },
              ].map((m) => (
                <div key={m.model} className="p-5">
                  <div className="text-ink-tertiary mb-2 text-xs font-semibold tracking-wider uppercase">
                    {m.model} says
                  </div>
                  <p className="text-ink-secondary mb-4 text-sm leading-relaxed">
                    &ldquo;{m.quote}&rdquo;
                  </p>
                  {m.flag === 'aligned' ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Aligned
                    </span>
                  ) : m.flag === 'fabrication' ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      Fabrication
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      Audience drift
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Top conflict callout */}
            <div className="border-border-primary border-t p-5">
              <div className="text-ink-tertiary mb-2 text-xs font-semibold tracking-wider uppercase">
                Top conflict to fix
              </div>
              <div className="bg-background-secondary border-border-primary rounded-xl border p-4">
                <p className="text-ink-primary mb-2 text-sm font-medium">
                  ChatGPT invented Gantt charts. Linear deliberately ships none.
                </p>
                <p className="text-ink-secondary text-sm leading-relaxed">
                  Add a{' '}
                  <code className="bg-background-tertiary rounded px-1 py-0.5 text-xs">
                    Not this
                  </code>{' '}
                  entry to your{' '}
                  <code className="bg-background-tertiary rounded px-1 py-0.5 text-xs">
                    .gist.design
                  </code>{' '}
                  file:{' '}
                  <span className="text-ink-primary font-medium">
                    &ldquo;No Gantt charts — on the public anti-roadmap.&rdquo;
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Built on an open standard */}
      <div className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="card-interactive p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-8">
              <div className="max-w-2xl">
                <h3 className="text-ink-primary mb-3 text-xl font-semibold">
                  Built on an open standard
                </h3>
                <p className="text-ink-secondary text-base leading-relaxed">
                  Fixes export to{' '}
                  <code className="bg-background-secondary rounded px-1.5 py-0.5 text-sm font-medium">
                    .gist.design
                  </code>{' '}
                  — an open format for AI-readable product context. Drop it in your repo, point
                  Cursor or Claude Code at it, or paste into ChatGPT. No lock-in.
                </p>
              </div>
              <Link
                href="/spec"
                className="text-brand-primary hover:text-brand-hover inline-flex items-center gap-2 text-sm font-semibold whitespace-nowrap transition-colors"
              >
                Read the spec
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA — aiex bottom-card pattern: icon tile + text + arrow */}
      <div className="relative mx-auto max-w-6xl overflow-hidden px-6 pb-16 md:pb-20">
        <a href="#top" className="card-interactive group flex items-center gap-5 p-5 md:p-6">
          <div className="bg-background-tertiary flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
            <ChartBarSquareIcon className="text-brand-primary h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="text-ink-primary text-base font-semibold">
              See what AI says about your product
            </div>
            <div className="text-ink-secondary text-sm">
              Free audit. Takes 60 seconds. No signup.
            </div>
          </div>
          <ArrowRightIcon className="text-ink-tertiary group-hover:text-ink-primary h-5 w-5 shrink-0 transition-colors" />
        </a>
      </div>
    </>
  );
}

export default function Home() {
  return <LandingWithAudit marketingSections={<MarketingSections />} />;
}
