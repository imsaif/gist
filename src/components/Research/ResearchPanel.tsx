'use client';

import { UserResearch, ResearchPhase } from '@/types';
import { PhaseIndicator } from '@/components/DesignMap/PhaseIndicator';

interface ResearchPanelProps {
  research: UserResearch;
  onViewResearch: () => void;
  onCopyResearch: () => void;
  onDownloadResearch: () => void;
}

const RESEARCH_PHASES: ResearchPhase[] = [
  'context',
  'discover',
  'empathize',
  'methods',
  'synthesize',
];

const PHASE_LABELS: Record<ResearchPhase, string> = {
  context: 'Context',
  discover: 'Discover',
  empathize: 'Empathize',
  methods: 'Methods',
  synthesize: 'Synthesize',
};

const SEVERITY_COLORS: Record<string, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-green-100 text-green-700',
};

const EFFORT_COLORS: Record<string, string> = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-red-100 text-red-700',
};

export function ResearchPanel({
  research,
  onViewResearch,
  onCopyResearch,
  onDownloadResearch,
}: ResearchPanelProps) {
  const hasContent =
    research.productContext ||
    research.segments.length > 0 ||
    research.painPoints.length > 0 ||
    research.currentSolutions.length > 0 ||
    research.researchMethods.length > 0;

  return (
    <div className="flex h-full flex-col">
      {/* Header with phase indicator */}
      <div className="border-border-light border-b p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-text-secondary text-sm font-semibold tracking-wide uppercase">
            User Research Canvas
          </h2>
          {hasContent && (
            <div className="flex gap-1">
              <button
                onClick={onCopyResearch}
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
                onClick={onDownloadResearch}
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
          phases={RESEARCH_PHASES}
          currentPhase={research.currentPhase}
          labels={PHASE_LABELS}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Product Context */}
        {research.productContext && (
          <div className="mb-6">
            <h3 className="text-text-tertiary mb-2 text-xs font-medium uppercase">
              Product Context
            </h3>
            <div className="border-border-light rounded-xl border bg-white p-4 shadow-sm">
              <p className="text-text-primary font-medium">{research.productContext}</p>
            </div>
          </div>
        )}

        {/* User Segments */}
        {research.segments.length > 0 && (
          <div className="mb-6">
            <h3 className="text-text-tertiary mb-3 text-xs font-medium uppercase">
              User Segments ({research.segments.length})
            </h3>
            <div className="space-y-3">
              {research.segments.map((segment) => (
                <div
                  key={segment.id}
                  className="border-border-light rounded-xl border bg-white p-4 shadow-sm"
                >
                  <h4 className="text-text-primary mb-1 font-medium">{segment.name}</h4>
                  <p className="text-text-secondary mb-3 text-sm">{segment.description}</p>
                  {segment.goals.length > 0 && (
                    <div className="mb-2">
                      <span className="text-xs font-medium text-green-700">Goals:</span>
                      <ul className="mt-1 space-y-1">
                        {segment.goals.map((g, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                            <span className="text-green-500">→</span>
                            {g}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {segment.frustrations.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-red-700">Frustrations:</span>
                      <ul className="mt-1 space-y-1">
                        {segment.frustrations.map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                            <span className="text-red-500">→</span>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pain Points */}
        {research.painPoints.length > 0 && (
          <div className="mb-6">
            <h3 className="text-text-tertiary mb-2 text-xs font-medium uppercase">
              Pain Points ({research.painPoints.length})
            </h3>
            <div className="space-y-2">
              {research.painPoints.map((pp) => (
                <div
                  key={pp.id}
                  className="border-border-light flex items-start gap-3 rounded-xl border bg-white p-3 shadow-sm"
                >
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${SEVERITY_COLORS[pp.severity]}`}
                  >
                    {pp.severity}
                  </span>
                  <div className="flex-1">
                    <p className="text-text-primary text-sm font-medium">{pp.pain}</p>
                    {pp.frequency && <p className="text-text-tertiary text-xs">{pp.frequency}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current Solutions */}
        {research.currentSolutions.length > 0 && (
          <div className="mb-6">
            <h3 className="text-text-tertiary mb-2 text-xs font-medium uppercase">
              Current Solutions
            </h3>
            <div className="border-border-light rounded-xl border bg-white p-4 shadow-sm">
              <ul className="space-y-1">
                {research.currentSolutions.map((s, i) => (
                  <li key={i} className="text-text-secondary flex items-start gap-2 text-sm">
                    <span className="text-text-tertiary">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Unmet Needs */}
        {research.unmetNeeds.length > 0 && (
          <div className="mb-6">
            <h3 className="text-text-tertiary mb-2 text-xs font-medium uppercase">Unmet Needs</h3>
            <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-4 shadow-sm">
              <ul className="space-y-1">
                {research.unmetNeeds.map((n, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-purple-700">
                    <span className="text-purple-500">→</span>
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Research Methods */}
        {research.researchMethods.length > 0 && (
          <div className="mb-6">
            <h3 className="text-text-tertiary mb-2 text-xs font-medium uppercase">
              Research Methods
            </h3>
            <div className="space-y-2">
              {research.researchMethods.map((rm) => (
                <div
                  key={rm.id}
                  className="border-border-light rounded-xl border bg-white p-3 shadow-sm"
                >
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-text-primary text-sm font-medium">{rm.method}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${EFFORT_COLORS[rm.effort]}`}
                    >
                      {rm.effort} effort
                    </span>
                  </div>
                  <p className="text-text-secondary text-xs">{rm.goal}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Insights */}
        {research.keyInsights.length > 0 && (
          <div className="mb-6">
            <h3 className="text-text-tertiary mb-2 text-xs font-medium uppercase">Key Insights</h3>
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 shadow-sm">
              <ol className="list-inside list-decimal space-y-2">
                {research.keyInsights.map((insight, i) => (
                  <li key={i} className="text-sm text-blue-700">
                    {insight}
                  </li>
                ))}
              </ol>
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
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <p className="text-text-tertiary text-sm">Tell me about your product and users.</p>
          </div>
        )}
      </div>

      {/* Footer with view button */}
      {hasContent && (
        <div className="border-border-light border-t p-4">
          <button
            onClick={onViewResearch}
            className="border-border-light text-text-secondary hover:bg-bg-secondary w-full rounded-lg border py-2 text-sm font-medium transition-colors"
          >
            View Full Canvas
          </button>
        </div>
      )}
    </div>
  );
}
