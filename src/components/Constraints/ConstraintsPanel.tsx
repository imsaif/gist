'use client';

import { ConstraintMap, ConstraintPhase } from '@/types';
import { PhaseIndicator } from '@/components/DesignMap/PhaseIndicator';

interface ConstraintsPanelProps {
  constraintMap: ConstraintMap;
  onViewConstraints: () => void;
  onCopyConstraints: () => void;
  onDownloadConstraints: () => void;
}

const CONSTRAINTS_PHASES: ConstraintPhase[] = [
  'context',
  'surface',
  'implications',
  'opportunities',
  'synthesize',
];

const PHASE_LABELS: Record<ConstraintPhase, string> = {
  context: 'Context',
  surface: 'Surface',
  implications: 'Implications',
  opportunities: 'Opportunities',
  synthesize: 'Synthesize',
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string; badge: string }> = {
  technical: { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-100' },
  timeline: { bg: 'bg-purple-50', text: 'text-purple-700', badge: 'bg-purple-100' },
  resource: { bg: 'bg-amber-50', text: 'text-amber-700', badge: 'bg-amber-100' },
  business: { bg: 'bg-green-50', text: 'text-green-700', badge: 'bg-green-100' },
  regulatory: { bg: 'bg-red-50', text: 'text-red-700', badge: 'bg-red-100' },
};

export function ConstraintsPanel({
  constraintMap,
  onViewConstraints,
  onCopyConstraints,
  onDownloadConstraints,
}: ConstraintsPanelProps) {
  const hasContent =
    constraintMap.projectContext ||
    constraintMap.constraints.length > 0 ||
    constraintMap.designImplications.length > 0 ||
    constraintMap.opportunities.length > 0;

  return (
    <div className="flex h-full flex-col">
      {/* Header with phase indicator */}
      <div className="border-border-light border-b p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-text-secondary text-sm font-semibold tracking-wide uppercase">
            Constraint Map
          </h2>
          {hasContent && (
            <div className="flex gap-1">
              <button
                onClick={onCopyConstraints}
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
                onClick={onDownloadConstraints}
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
          phases={CONSTRAINTS_PHASES}
          currentPhase={constraintMap.currentPhase}
          labels={PHASE_LABELS}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Project Context */}
        {constraintMap.projectContext && (
          <div className="mb-6">
            <h3 className="text-text-tertiary mb-2 text-xs font-medium uppercase">
              Project Context
            </h3>
            <div className="border-border-light rounded-xl border bg-white p-4 shadow-sm">
              <p className="text-text-primary font-medium">{constraintMap.projectContext}</p>
            </div>
          </div>
        )}

        {/* Constraints */}
        {constraintMap.constraints.length > 0 && (
          <div className="mb-6">
            <h3 className="text-text-tertiary mb-3 text-xs font-medium uppercase">
              Constraints ({constraintMap.constraints.length})
            </h3>
            <div className="space-y-2">
              {constraintMap.constraints.map((c) => {
                const colors = CATEGORY_COLORS[c.category] || CATEGORY_COLORS.technical;
                return (
                  <div
                    key={c.id}
                    className="border-border-light rounded-xl border bg-white p-3 shadow-sm"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors.badge} ${colors.text}`}
                      >
                        {c.category}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${c.severity === 'hard' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}
                      >
                        {c.severity}
                      </span>
                    </div>
                    <p className="text-text-primary text-sm font-medium">{c.constraint}</p>
                    {c.source && (
                      <p className="text-text-tertiary mt-1 text-xs">Source: {c.source}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Design Implications */}
        {constraintMap.designImplications.length > 0 && (
          <div className="mb-6">
            <h3 className="text-text-tertiary mb-2 text-xs font-medium uppercase">
              Design Implications
            </h3>
            <div className="space-y-3">
              {constraintMap.designImplications.map((di) => (
                <div
                  key={di.id}
                  className="border-border-light rounded-xl border bg-white p-3 shadow-sm"
                >
                  <p className="text-text-primary mb-2 text-sm font-medium">{di.implication}</p>
                  <div className="rounded-lg bg-blue-50/50 p-2">
                    <span className="text-xs font-medium text-blue-700">Design response: </span>
                    <span className="text-xs text-blue-700">{di.designResponse}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Opportunities */}
        {constraintMap.opportunities.length > 0 && (
          <div className="mb-6">
            <h3 className="text-text-tertiary mb-2 text-xs font-medium uppercase">Opportunities</h3>
            <div className="rounded-xl border border-green-100 bg-green-50/50 p-4 shadow-sm">
              <ul className="space-y-2">
                {constraintMap.opportunities.map((opp, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                    <span className="text-green-500">+</span>
                    {opp}
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
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
            </div>
            <p className="text-text-tertiary text-sm">
              Tell me what you&apos;re designing and the scope.
            </p>
          </div>
        )}
      </div>

      {/* Footer with view button */}
      {hasContent && (
        <div className="border-border-light border-t p-4">
          <button
            onClick={onViewConstraints}
            className="border-border-light text-text-secondary hover:bg-bg-secondary w-full rounded-lg border py-2 text-sm font-medium transition-colors"
          >
            View Full Map
          </button>
        </div>
      )}
    </div>
  );
}
