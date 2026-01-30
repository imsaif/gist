'use client';

import { DesignRationale, RationalePhase } from '@/types';
import { PhaseIndicator } from '@/components/DesignMap/PhaseIndicator';
import { DecisionCard } from './DecisionCard';
import { ProblemSection } from './ProblemSection';

interface RationalePanelProps {
  rationale: DesignRationale;
  onViewRationale: () => void;
  onCopyRationale: () => void;
  onDownloadRationale: () => void;
}

const RATIONALE_PHASES: RationalePhase[] = ['problem', 'context', 'decisions', 'review'];

const PHASE_LABELS: Record<RationalePhase, string> = {
  problem: 'Problem',
  context: 'Context',
  decisions: 'Decisions',
  review: 'Review',
};

export function RationalePanel({
  rationale,
  onViewRationale,
  onCopyRationale,
  onDownloadRationale,
}: RationalePanelProps) {
  const hasContent =
    rationale.problem ||
    rationale.context.length > 0 ||
    rationale.decisions.length > 0 ||
    rationale.assumptions.length > 0;

  return (
    <div className="flex h-full flex-col">
      {/* Header with phase indicator */}
      <div className="border-border-light border-b p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-text-secondary text-sm font-semibold tracking-wide uppercase">
            Design Rationale
          </h2>
          {hasContent && (
            <div className="flex gap-1">
              <button
                onClick={onCopyRationale}
                className="text-text-tertiary hover:text-text-secondary hover:bg-bg-tertiary rounded p-1.5 transition-colors"
                title="Copy to clipboard"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </button>
              <button
                onClick={onDownloadRationale}
                className="text-text-tertiary hover:text-text-secondary hover:bg-bg-tertiary rounded p-1.5 transition-colors"
                title="Download"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </button>
            </div>
          )}
        </div>
        <PhaseIndicator
          phases={RATIONALE_PHASES}
          currentPhase={rationale.currentPhase}
          labels={PHASE_LABELS}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Problem & Context Section */}
        <div className="mb-6">
          <ProblemSection
            problem={rationale.problem}
            context={rationale.context}
            assumptions={rationale.assumptions}
          />
        </div>

        {/* Decisions */}
        {rationale.decisions.length > 0 && (
          <div className="mb-6">
            <h3 className="text-text-tertiary mb-3 text-xs font-medium uppercase">Key Decisions</h3>
            <div className="space-y-3">
              {rationale.decisions.map((decision, index) => (
                <DecisionCard key={decision.id} decision={decision} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Overall Open Questions */}
        {rationale.openQuestions.length > 0 && (
          <div className="mb-6">
            <h3 className="text-text-tertiary mb-2 text-xs font-medium uppercase">
              Open Questions
            </h3>
            <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4">
              <ul className="space-y-1">
                {rationale.openQuestions.map((q, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-amber-700">
                    <span className="text-amber-500">?</span>
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!hasContent && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-text-tertiary mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <p className="text-text-tertiary text-sm">
              Your design rationale will build as you document decisions.
            </p>
          </div>
        )}
      </div>

      {/* Footer with view button */}
      {hasContent && (
        <div className="border-border-light border-t p-4">
          <button
            onClick={onViewRationale}
            className="border-border-light text-text-secondary hover:bg-bg-secondary w-full rounded-lg border py-2 text-sm font-medium transition-colors"
          >
            View Full Rationale
          </button>
        </div>
      )}
    </div>
  );
}
