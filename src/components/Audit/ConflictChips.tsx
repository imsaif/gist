import { Gap, GapCategory, GapSeverity } from '@/types/audit';

interface ConflictChipsProps {
  gaps: Gap[];
  onFix: () => void;
}

const categoryLabels: Record<GapCategory, { singular: string; plural: string }> = {
  contradiction: { singular: 'Contradiction', plural: 'Contradictions' },
  fabrication: { singular: 'Fabrication', plural: 'Fabrications' },
  category_conflict: { singular: 'Category drift', plural: 'Category drifts' },
  shared_inaccuracy: { singular: 'Shared inaccuracy', plural: 'Shared inaccuracies' },
  audience_mismatch: { singular: 'Audience drift', plural: 'Audience drifts' },
  missing_differentiator: { singular: 'Missing differentiator', plural: 'Missing differentiators' },
  pricing_confusion: { singular: 'Pricing issue', plural: 'Pricing issues' },
};

const severityRank: Record<GapSeverity, number> = { critical: 0, high: 1, medium: 2 };

function severityClasses(worst: GapSeverity): string {
  switch (worst) {
    case 'critical':
      return 'bg-red-50 text-red-700 ring-1 ring-red-200';
    case 'high':
      return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200';
    default:
      return 'bg-slate-100 text-slate-700 ring-1 ring-slate-200';
  }
}

export function ConflictChips({ gaps, onFix }: ConflictChipsProps) {
  if (gaps.length === 0) {
    return (
      <div className="text-ink-secondary text-sm">
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

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {ordered.map(([category, { count, worst }]) => {
          const label =
            count === 1 ? categoryLabels[category].singular : categoryLabels[category].plural;
          return (
            <span
              key={category}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${severityClasses(worst)}`}
            >
              <span className="font-bold tabular-nums">{count}</span>
              <span>{label}</span>
            </span>
          );
        })}
      </div>
      <button
        onClick={onFix}
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
    </div>
  );
}
