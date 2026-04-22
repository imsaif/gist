import {
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  BellAlertIcon,
  ChartBarSquareIcon,
  CheckCircleIcon,
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
  return <h2 className="text-text-primary mb-4 text-3xl font-bold tracking-tight">{children}</h2>;
}

function MarketingSections() {
  return (
    <>
      {/* What AI gets wrong */}
      <div className="relative overflow-hidden">
        <div className="ambient-orb top-1/4 -left-32 h-96 w-96 bg-indigo-500/[0.06]" />
        <div className="ambient-orb -right-24 bottom-1/4 h-80 w-80 bg-purple-500/[0.05]" />
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <SectionHeading>What AI gets wrong about your product</SectionHeading>
          <p className="text-text-secondary mb-8 max-w-2xl text-lg leading-relaxed">
            Every LLM writes its own version of your product. Most of them are wrong in the same
            handful of ways.
          </p>
          <div className="glass-strong overflow-hidden rounded-2xl">
            <table className="w-full text-base">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.03]">
                  <th className="text-text-primary px-5 py-3.5 text-left font-semibold">
                    <span className="inline-flex items-center gap-1.5">
                      <ExclamationTriangleIcon className="text-text-secondary h-4 w-4" />
                      Failure mode
                    </span>
                  </th>
                  <th className="text-text-primary px-5 py-3.5 text-left font-semibold">
                    <span className="inline-flex items-center gap-1.5">
                      <ShieldCheckIcon className="text-accent-primary h-4 w-4" />
                      What the audit surfaces
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {[
                  {
                    failure: 'ChatGPT calls you a clone of your biggest competitor',
                    fix: 'Positioning drift — models collapse you into a category you deliberately left',
                  },
                  {
                    failure: 'Claude hallucinates features that do not exist in your product',
                    fix: 'Fabrications — model fills gaps with assumed-typical functionality',
                  },
                  {
                    failure: 'LLMs recommend you to audiences you explicitly do not serve',
                    fix: 'Audience mismatch — who gets suggested your product when asked for X',
                  },
                  {
                    failure: 'AI coding tools build the wrong pattern when reading your site',
                    fix: 'Context gaps — decisions, constraints, and boundaries nothing on the page tells them about',
                  },
                ].map((row) => (
                  <tr key={row.failure}>
                    <td className="text-text-primary px-5 py-3.5">{row.failure}</td>
                    <td className="text-text-secondary px-5 py-3.5">{row.fix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* How it works — Audit, Fix, Track */}
      <div className="relative overflow-hidden">
        <div className="ambient-orb top-1/3 -right-24 h-80 w-80 bg-indigo-500/[0.05]" />
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <SectionHeading>Audit. Fix. Track.</SectionHeading>
          <p className="text-text-secondary mb-10 max-w-2xl text-lg leading-relaxed">
            One-time audits find today&apos;s gaps. Monitoring catches tomorrow&apos;s drift.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              {
                icon: ChartBarSquareIcon,
                title: 'Audit',
                body: 'Run your URL through ChatGPT, Claude, and Perplexity. Get a scorecard of conflicts, fabrications, and positioning drift.',
              },
              {
                icon: CheckCircleIcon,
                title: 'Fix',
                body: 'Inline gap fixer produces a downloadable file that patches the context AI tools are missing. Paste into Cursor, Claude Code, or your repo.',
              },
              {
                icon: ArrowTrendingUpIcon,
                title: 'Track',
                body: 'Re-audit weekly. See your AI visibility score trend. Get alerted when a model materially changes how it describes you.',
              },
            ].map((step) => (
              <div key={step.title} className="glass rounded-2xl p-6">
                <step.icon className="text-accent-primary mb-4 h-7 w-7" />
                <h3 className="text-text-primary mb-2 text-xl font-semibold">{step.title}</h3>
                <p className="text-text-secondary text-base leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monitor over time */}
      <div className="relative overflow-hidden">
        <div className="ambient-orb top-1/2 left-1/4 h-72 w-72 bg-purple-500/[0.05]" />
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
            <div>
              <SectionHeading>Drift happens. Get alerted when it does.</SectionHeading>
              <p className="text-text-secondary mb-6 text-lg leading-relaxed">
                Models update. Your site changes. Competitors launch. Your AI visibility score is
                not static — it drifts. We re-audit on a schedule and tell you when something
                material changed.
              </p>
              <ul className="text-text-secondary space-y-3 text-base">
                <li className="flex items-start gap-3">
                  <BellAlertIcon className="text-accent-primary mt-0.5 h-5 w-5 shrink-0" />
                  Weekly re-audits across every major model
                </li>
                <li className="flex items-start gap-3">
                  <BellAlertIcon className="text-accent-primary mt-0.5 h-5 w-5 shrink-0" />
                  Diffs when a model changes how it describes you
                </li>
                <li className="flex items-start gap-3">
                  <BellAlertIcon className="text-accent-primary mt-0.5 h-5 w-5 shrink-0" />
                  Competitor tracking — audit yours and theirs side-by-side
                </li>
              </ul>
            </div>
            <div className="glass-strong rounded-2xl p-6">
              <div className="text-text-tertiary mb-4 text-xs font-semibold tracking-wider uppercase">
                AI Visibility Score
              </div>
              <div className="mb-6 flex items-baseline gap-3">
                <span className="text-text-primary text-5xl font-bold">78</span>
                <span className="text-accent-primary inline-flex items-center gap-1 text-sm font-medium">
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
                    <span className="text-text-primary w-24 font-medium">{row.model}</span>
                    <div className="mx-3 h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="bg-accent-primary h-full rounded-full"
                        style={{ width: `${row.score}%` }}
                      />
                    </div>
                    <span className="text-text-primary w-8 text-right font-mono">{row.score}</span>
                    <span className="text-accent-primary ml-2 w-10 text-right font-mono text-xs">
                      {row.trend}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-accent-primary/20 bg-accent-primary/[0.06] mt-6 rounded-xl border p-3 text-sm">
                <span className="text-accent-primary font-semibold">
                  ChatGPT drift · 2 days ago
                </span>
                <p className="text-text-secondary mt-1 leading-relaxed">
                  Started describing your category as &ldquo;project management&rdquo; instead of
                  &ldquo;issue tracker.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="relative overflow-hidden">
        <div className="ambient-orb top-1/3 -left-20 h-80 w-80 bg-indigo-500/[0.06]" />
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20" id="pricing">
          <SectionHeading>Pricing</SectionHeading>
          <p className="text-text-secondary mb-10 text-lg leading-relaxed">
            Free to try. Paid when you want history, monitoring, and alerts.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              {
                name: 'Free',
                price: '$0',
                cadence: '',
                body: 'One audit. One URL. Downloadable fix file.',
                features: ['1 audit / month', 'All major models', 'Download fix file'],
                cta: 'Run a free audit',
                featured: false,
              },
              {
                name: 'Pro',
                price: '$29',
                cadence: '/mo',
                body: 'For founders and PMMs tracking a single product.',
                features: [
                  'Unlimited audits',
                  'Weekly auto re-audits',
                  'Drift alerts',
                  'Score history',
                  '3 URLs',
                ],
                cta: 'Start Pro',
                featured: true,
              },
              {
                name: 'Team',
                price: '$99',
                cadence: '/mo',
                body: 'For teams tracking multiple products and competitors.',
                features: [
                  'Everything in Pro',
                  '25 URLs',
                  'Competitor tracking',
                  'Shareable reports',
                  'Slack alerts',
                ],
                cta: 'Start Team',
                featured: false,
              },
            ].map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl p-6 ${tier.featured ? 'glass-strong border-accent-primary/30 relative border-2' : 'glass'}`}
              >
                {tier.featured && (
                  <div className="bg-accent-primary absolute -top-3 left-6 rounded-full px-3 py-1 text-xs font-semibold text-white">
                    Most popular
                  </div>
                )}
                <h3 className="text-text-primary mb-1 text-lg font-semibold">{tier.name}</h3>
                <div className="mb-3 flex items-baseline gap-1">
                  <span className="text-text-primary text-3xl font-bold">{tier.price}</span>
                  <span className="text-text-secondary text-sm">{tier.cadence}</span>
                </div>
                <p className="text-text-secondary mb-5 text-sm leading-relaxed">{tier.body}</p>
                <ul className="text-text-secondary mb-6 space-y-2 text-sm">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircleIcon className="text-accent-primary mt-0.5 h-4 w-4 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#top"
                  className={`block w-full rounded-xl px-4 py-2.5 text-center text-sm font-semibold transition-colors ${
                    tier.featured
                      ? 'bg-accent-primary hover:bg-accent-hover text-white'
                      : 'text-text-primary border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06]'
                  }`}
                >
                  {tier.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Built on an open standard */}
      <div className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="glass rounded-2xl p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-8">
              <div className="max-w-2xl">
                <h3 className="text-text-primary mb-3 text-xl font-semibold">
                  Built on an open standard
                </h3>
                <p className="text-text-secondary text-base leading-relaxed">
                  Fixes export to{' '}
                  <code className="bg-bg-secondary rounded px-1.5 py-0.5 text-sm font-medium">
                    .gist.design
                  </code>{' '}
                  — an open file format for AI-readable product context. Drop it into your repo,
                  point Cursor or Claude Code at it, or paste it into ChatGPT. No lock-in.
                </p>
              </div>
              <Link
                href="/spec"
                className="text-accent-primary hover:text-accent-hover inline-flex items-center gap-2 text-sm font-semibold whitespace-nowrap transition-colors"
              >
                Read the spec
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="relative mx-auto max-w-6xl overflow-hidden px-6 pb-16 md:pb-20">
        <div className="ambient-orb top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 bg-indigo-500/[0.06]" />
        <div className="glass rounded-2xl border border-white/[0.08] p-8 text-center">
          <h2 className="text-text-primary mb-4 text-3xl font-bold tracking-tight">
            See what AI says about your product
          </h2>
          <p className="text-text-secondary mx-auto max-w-lg text-lg leading-relaxed">
            Free audit. Takes 60 seconds. No signup.
          </p>
          <div className="mt-8">
            <a
              href="#top"
              className="bg-accent-primary hover:bg-accent-hover inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-lg font-semibold text-white transition-colors"
            >
              Run your audit
              <ArrowRightIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Home() {
  return <LandingWithAudit marketingSections={<MarketingSections />} />;
}
