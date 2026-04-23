import { ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

/**
 * Mocked, static preview of an audit result.
 * Renders below the URL input on the landing hero so visitors can see
 * what the deliverable looks like before running their own audit.
 */
export function HeroResultPreview() {
  return (
    <div className="mx-auto mt-12 w-full max-w-4xl">
      <div className="text-ink-tertiary mb-3 text-center text-xs font-medium tracking-wide">
        Example output · linear.app
      </div>

      <div className="glass-strong rounded-3xl p-5 text-left md:p-6">
        {/* Top row: visibility score + model attribution */}
        <div className="border-border-primary mb-5 flex flex-col items-start justify-between gap-4 border-b pb-5 md:flex-row md:items-center">
          <div>
            <div className="text-ink-tertiary text-xs font-medium tracking-wide uppercase">
              AI Visibility Score
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-ink-primary text-4xl font-bold tracking-tight">72</span>
              <span className="text-ink-tertiary text-sm">/ 100</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { name: 'ChatGPT', score: 78 },
              { name: 'Claude', score: 81 },
              { name: 'Perplexity', score: 58 },
            ].map((m) => (
              <div
                key={m.name}
                className="bg-background-secondary border-border-primary flex items-center gap-2 rounded-full border px-3 py-1.5"
              >
                <span className="text-ink-secondary text-xs font-medium">{m.name}</span>
                <span className="text-ink-primary text-xs font-bold">{m.score}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Conflicts list */}
        <div className="space-y-3">
          {[
            {
              severity: 'critical' as const,
              type: 'Fabrication',
              issue:
                'ChatGPT claims Linear has a built-in Gantt chart view. Linear deliberately ships no Gantt — it is on the public anti-roadmap.',
              source: 'ChatGPT',
            },
            {
              severity: 'warning' as const,
              type: 'Audience drift',
              issue:
                'Perplexity recommends Linear to "enterprise project managers" — Linear positions exclusively for product engineering teams.',
              source: 'Perplexity',
            },
            {
              severity: 'good' as const,
              type: 'Positioning',
              issue:
                'All three models correctly identify Linear as a tool for fast-moving software teams, not a generic project tracker.',
              source: 'All models',
            },
          ].map((row, i) => (
            <div
              key={i}
              className="border-border-primary flex items-start gap-3 rounded-2xl border p-4"
            >
              <div
                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  row.severity === 'critical'
                    ? 'bg-red-500/10 text-red-600'
                    : row.severity === 'warning'
                      ? 'bg-amber-500/10 text-amber-600'
                      : 'bg-emerald-500/10 text-emerald-600'
                }`}
              >
                {row.severity === 'good' ? (
                  <CheckCircleIcon className="h-4 w-4" />
                ) : (
                  <ExclamationTriangleIcon className="h-4 w-4" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-ink-primary text-sm font-semibold">{row.type}</span>
                  <span className="chip">{row.source}</span>
                </div>
                <p className="text-ink-secondary text-sm leading-relaxed">{row.issue}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
