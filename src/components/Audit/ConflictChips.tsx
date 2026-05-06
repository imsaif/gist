import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { Gap, GapCategory, GapSeverity } from '@/types/audit';

interface ConflictChipsProps {
  gaps: Gap[];
  onFix: () => void;
  onView?: () => void;
}

const categoryMeta: Record<GapCategory, { singular: string; plural: string; explanation: string }> =
  {
    contradiction: {
      singular: 'Contradiction',
      plural: 'Contradictions',
      explanation: 'ChatGPT and Claude disagree about a fact on your site.',
    },
    fabrication: {
      singular: 'Fabrication',
      plural: 'Fabrications',
      explanation: 'An AI invented a feature, integration, or claim you don’t actually ship.',
    },
    category_conflict: {
      singular: 'Category drift',
      plural: 'Category drifts',
      explanation: 'AI puts you in the wrong product category, blurring you with the wrong rivals.',
    },
    shared_inaccuracy: {
      singular: 'Shared inaccuracy',
      plural: 'Shared inaccuracies',
      explanation:
        'Both ChatGPT and Claude are wrong in the same way — your site reads ambiguously.',
    },
    audience_mismatch: {
      singular: 'Audience drift',
      plural: 'Audience drifts',
      explanation: 'AI describes the wrong buyer, so it pitches you to the wrong people.',
    },
    missing_differentiator: {
      singular: 'Missing differentiator',
      plural: 'Missing differentiators',
      explanation:
        'AI can’t explain what makes you different — you sound like a generic competitor.',
    },
    pricing_confusion: {
      singular: 'Pricing issue',
      plural: 'Pricing issues',
      explanation: 'AI guesses or invents your pricing instead of stating what you charge.',
    },
  };

const severityRank: Record<GapSeverity, number> = { critical: 0, high: 1 };

function rowClasses(worst: GapSeverity): string {
  switch (worst) {
    case 'critical':
      return 'border-l-4 border-red-500 bg-red-50/40 hover:bg-red-50';
    default:
      return 'border-l-4 border-amber-500 bg-amber-50/40 hover:bg-amber-50';
  }
}

function badgeClasses(worst: GapSeverity): string {
  switch (worst) {
    case 'critical':
      return 'bg-red-100 text-red-800 ring-1 ring-red-200';
    default:
      return 'bg-amber-100 text-amber-900 ring-1 ring-amber-200';
  }
}

export function ConflictChips({ gaps, onFix, onView }: ConflictChipsProps) {
  if (gaps.length === 0) {
    return (
      <div className="text-ink-secondary text-center text-sm">
        <span className="mr-1.5 inline-flex items-center justify-center rounded-full bg-emerald-50 p-0.5 ring-1 ring-emerald-200">
          <svg
            className="h-3 w-3 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </span>
        No conflicts — ChatGPT and Claude agree on your product.
      </div>
    );
  }

  // Group gaps by category, track worst severity per group
  const groups = new Map<GapCategory, { count: number; worst: GapSeverity }>();
  for (const g of gaps) {
    const prev = groups.get(g.category);
    if (!prev) {
      groups.set(g.category, { count: 1, worst: g.severity });
    } else {
      prev.count += 1;
      if (severityRank[g.severity] < severityRank[prev.worst]) {
        prev.worst = g.severity;
      }
    }
  }

  // Sort groups by worst severity then count desc
  const ordered = [...groups.entries()].sort(([, a], [, b]) => {
    const sev = severityRank[a.worst] - severityRank[b.worst];
    return sev !== 0 ? sev : b.count - a.count;
  });

  const RowTag = onView ? 'button' : 'div';

  return (
    <div className="flex flex-col gap-5">
      <div className="border-border-primary divide-border-primary bg-background-primary divide-y overflow-hidden rounded-2xl border">
        {ordered.map(([category, { count, worst }]) => {
          const meta = categoryMeta[category];
          const label = count === 1 ? meta.singular : meta.plural;
          return (
            <RowTag
              key={category}
              onClick={onView}
              className={`flex w-full items-center gap-4 px-5 py-4 text-left transition-colors ${rowClasses(
                worst
              )}`}
            >
              <span
                className={`inline-flex h-7 min-w-[2rem] items-center justify-center rounded-full px-2 text-xs font-bold tabular-nums ${badgeClasses(
                  worst
                )}`}
              >
                {count}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-ink-primary text-sm font-semibold">{label}</div>
                <p className="text-ink-secondary mt-0.5 text-xs leading-relaxed">
                  {meta.explanation}
                </p>
              </div>
              {onView && (
                <ChevronRightIcon
                  className="text-ink-tertiary h-4 w-4 flex-shrink-0"
                  aria-hidden="true"
                />
              )}
            </RowTag>
          );
        })}
      </div>
      <div className="flex justify-center">
        <button
          onClick={onFix}
          className="bg-brand-primary hover:bg-brand-hover inline-flex cursor-pointer items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-colors"
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
      </div>
    </div>
  );
}
