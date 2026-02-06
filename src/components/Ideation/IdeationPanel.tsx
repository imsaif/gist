'use client';

import { Ideation, IdeationPhase } from '@/types';
import { PhaseIndicator } from '@/components/DesignMap/PhaseIndicator';

interface IdeationPanelProps {
  ideation: Ideation;
  onViewIdeation: () => void;
  onCopyIdeation: () => void;
  onDownloadIdeation: () => void;
}

const IDEATION_PHASES: IdeationPhase[] = [
  'problem',
  'diverge',
  'evaluate',
  'converge',
  'synthesize',
];

const PHASE_LABELS: Record<IdeationPhase, string> = {
  problem: 'Problem',
  diverge: 'Diverge',
  evaluate: 'Evaluate',
  converge: 'Converge',
  synthesize: 'Synthesize',
};

const EFFORT_COLORS: Record<string, string> = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-red-100 text-red-700',
};

const WEIGHT_COLORS: Record<string, string> = {
  'must-have': 'bg-red-100 text-red-700',
  important: 'bg-amber-100 text-amber-700',
  'nice-to-have': 'bg-green-100 text-green-700',
};

export function IdeationPanel({
  ideation,
  onViewIdeation,
  onCopyIdeation,
  onDownloadIdeation,
}: IdeationPanelProps) {
  const hasContent =
    ideation.problemStatement ||
    ideation.approaches.length > 0 ||
    ideation.evaluationCriteria.length > 0 ||
    ideation.recommendation;

  return (
    <div className="flex h-full flex-col">
      {/* Header with phase indicator */}
      <div className="border-border-light border-b p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-text-secondary text-sm font-semibold tracking-wide uppercase">
            Solution Options Board
          </h2>
          {hasContent && (
            <div className="flex gap-1">
              <button
                onClick={onCopyIdeation}
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
                onClick={onDownloadIdeation}
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
          phases={IDEATION_PHASES}
          currentPhase={ideation.currentPhase}
          labels={PHASE_LABELS}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Problem Statement */}
        {ideation.problemStatement && (
          <div className="mb-6">
            <h3 className="text-text-tertiary mb-2 text-xs font-medium uppercase">
              Problem Statement
            </h3>
            <div className="border-border-light rounded-xl border bg-white p-4 shadow-sm">
              <p className="text-text-primary font-medium">{ideation.problemStatement}</p>
            </div>
          </div>
        )}

        {/* Approaches */}
        {ideation.approaches.length > 0 && (
          <div className="mb-6">
            <h3 className="text-text-tertiary mb-3 text-xs font-medium uppercase">
              Approaches ({ideation.approaches.length})
            </h3>
            <div className="space-y-3">
              {ideation.approaches.map((approach, index) => {
                const isRecommended = ideation.recommendation?.approachId === approach.id;
                return (
                  <div
                    key={approach.id}
                    className={`rounded-xl border p-4 shadow-sm ${isRecommended ? 'border-green-200 bg-green-50/50' : 'border-border-light bg-white'}`}
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-text-tertiary text-xs font-medium">#{index + 1}</span>
                        <h4 className="text-text-primary font-medium">{approach.title}</h4>
                        {isRecommended && (
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                            Recommended
                          </span>
                        )}
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${EFFORT_COLORS[approach.effort]}`}
                      >
                        {approach.effort} effort
                      </span>
                    </div>
                    <p className="text-text-secondary mb-3 text-sm">{approach.description}</p>
                    <p className="text-text-tertiary mb-3 text-xs">
                      Target: {approach.targetUsers}
                    </p>
                    {approach.strengths.length > 0 && (
                      <div className="mb-2">
                        <span className="text-xs font-medium text-green-700">Strengths:</span>
                        <ul className="mt-1 space-y-1">
                          {approach.strengths.map((s, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-green-700">
                              <span className="text-green-500">+</span>
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {approach.weaknesses.length > 0 && (
                      <div>
                        <span className="text-xs font-medium text-red-700">Weaknesses:</span>
                        <ul className="mt-1 space-y-1">
                          {approach.weaknesses.map((w, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-red-700">
                              <span className="text-red-500">-</span>
                              {w}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Evaluation Criteria */}
        {ideation.evaluationCriteria.length > 0 && (
          <div className="mb-6">
            <h3 className="text-text-tertiary mb-2 text-xs font-medium uppercase">
              Evaluation Criteria
            </h3>
            <div className="space-y-2">
              {ideation.evaluationCriteria.map((ec) => (
                <div
                  key={ec.id}
                  className="border-border-light flex items-center justify-between rounded-xl border bg-white p-3 shadow-sm"
                >
                  <span className="text-text-primary text-sm">{ec.criterion}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${WEIGHT_COLORS[ec.weight]}`}
                  >
                    {ec.weight}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendation */}
        {ideation.recommendation && (
          <div className="mb-6">
            <h3 className="text-text-tertiary mb-2 text-xs font-medium uppercase">
              Recommendation
            </h3>
            <div className="rounded-xl border border-green-100 bg-green-50/50 p-4 shadow-sm">
              <p className="text-sm text-green-700">{ideation.recommendation.reasoning}</p>
              {ideation.recommendation.nextSteps.length > 0 && (
                <div className="mt-3">
                  <span className="text-xs font-medium text-green-800">Next Steps:</span>
                  <ol className="mt-1 list-inside list-decimal space-y-1">
                    {ideation.recommendation.nextSteps.map((step, i) => (
                      <li key={i} className="text-xs text-green-700">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
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
                <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83" />
              </svg>
            </div>
            <p className="text-text-tertiary text-sm">Describe the problem you want to solve.</p>
          </div>
        )}
      </div>

      {/* Footer with view button */}
      {hasContent && (
        <div className="border-border-light border-t p-4">
          <button
            onClick={onViewIdeation}
            className="border-border-light text-text-secondary hover:bg-bg-secondary w-full rounded-lg border py-2 text-sm font-medium transition-colors"
          >
            View Full Board
          </button>
        </div>
      )}
    </div>
  );
}
