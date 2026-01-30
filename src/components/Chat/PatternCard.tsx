'use client';

import { Pattern } from '@/types/patterns';
import { getCategoryMeta } from '@/lib/patterns/patterns';

type AddToMode = 'brief' | 'map' | 'rationale';

interface PatternCardProps {
  pattern: Pattern;
  reason?: string;
  onAddToBrief?: () => void;
  isAddedToBrief?: boolean;
  // Generic add action for any mode
  onAdd?: () => void;
  isAdded?: boolean;
  addLabel?: string; // e.g., "Add to brief", "Add to step", "Add to decision"
}

export function PatternCard({
  pattern,
  reason,
  onAddToBrief,
  isAddedToBrief = false,
  onAdd,
  isAdded,
  addLabel = 'Add to brief',
}: PatternCardProps) {
  // Use generic props if provided, otherwise fall back to brief-specific props
  const handleAdd = onAdd ?? onAddToBrief;
  const hasBeenAdded = isAdded ?? isAddedToBrief;
  const categoryMeta = getCategoryMeta(pattern.category);
  const categoryColor = categoryMeta?.color ?? '#6b7280';

  // Get top 3 product examples
  const topExamples = pattern.examples.slice(0, 3);

  return (
    <div
      className="my-3 overflow-hidden rounded-xl border-2 bg-white"
      style={{ borderColor: `${categoryColor}40` }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-wide uppercase"
        style={{ backgroundColor: `${categoryColor}15`, color: categoryColor }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        Pattern Identified
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Pattern name and one-liner */}
        <h3 className="text-text-primary mb-1 text-lg font-semibold">{pattern.name}</h3>
        <p className="text-text-secondary mb-3 text-sm">{pattern.oneLiner}</p>

        {/* Reason (if provided by AI) */}
        {reason && <p className="text-text-tertiary mb-3 text-xs italic">&ldquo;{reason}&rdquo;</p>}

        {/* Examples */}
        {topExamples.length > 0 && (
          <div className="mb-4">
            <p className="text-text-tertiary mb-1 text-xs font-medium uppercase">Used by</p>
            <p className="text-text-secondary text-sm">
              {topExamples.map((ex) => ex.product).join(', ')}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <a
            href={pattern.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-accent-primary hover:bg-bg-secondary inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
          >
            See examples
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 7h10v10" />
              <path d="M7 17 17 7" />
            </svg>
          </a>

          {handleAdd && (
            <button
              onClick={handleAdd}
              disabled={hasBeenAdded}
              className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                hasBeenAdded
                  ? 'cursor-default bg-green-50 text-green-600'
                  : 'bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/20'
              }`}
            >
              {hasBeenAdded ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Added
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 5v14" />
                    <path d="M5 12h14" />
                  </svg>
                  {addLabel}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Compact version for display in brief artifact
export function PatternCardCompact({ pattern }: { pattern: Pattern }) {
  const categoryMeta = getCategoryMeta(pattern.category);
  const categoryColor = categoryMeta?.color ?? '#6b7280';

  return (
    <a
      href={pattern.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-lg border p-3 transition-all hover:shadow-md"
      style={{ borderColor: `${categoryColor}40` }}
    >
      <div className="mb-1 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: categoryColor }} />
        <span className="text-text-primary group-hover:text-accent-primary text-sm font-medium">
          {pattern.name}
        </span>
      </div>
      <p className="text-text-tertiary text-xs">{pattern.oneLiner}</p>
    </a>
  );
}
