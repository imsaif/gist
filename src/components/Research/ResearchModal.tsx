'use client';

import { UserResearch } from '@/types';
import { generateResearchMarkdown } from '@/lib/researchParser';

interface ResearchModalProps {
  research: UserResearch;
  isOpen: boolean;
  onClose: () => void;
  onCopy: () => void;
}

export function ResearchModal({ research, isOpen, onClose, onCopy }: ResearchModalProps) {
  if (!isOpen) return null;

  const handleCopy = async () => {
    const markdown = generateResearchMarkdown(research);
    await navigator.clipboard.writeText(markdown);
    onCopy();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="border-border-light flex items-center justify-between border-b p-4">
          <h2 className="text-text-primary text-lg font-semibold">User Research Canvas</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="border-border-light text-text-secondary hover:bg-bg-secondary flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors"
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
              Copy
            </button>
            <button
              onClick={onClose}
              className="text-text-tertiary hover:text-text-secondary hover:bg-bg-secondary rounded-lg p-2 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {research.productContext && (
            <div className="mb-8">
              <h3 className="text-text-secondary mb-2 text-sm font-semibold uppercase">
                Product Context
              </h3>
              <p className="text-text-primary text-lg font-medium">{research.productContext}</p>
            </div>
          )}

          {research.segments.length > 0 && (
            <div className="mb-8">
              <h3 className="text-text-secondary mb-4 text-sm font-semibold uppercase">
                User Segments
              </h3>
              <div className="space-y-6">
                {research.segments.map((segment) => (
                  <div key={segment.id} className="border-border-light rounded-lg border p-4">
                    <h4 className="text-text-primary mb-1 text-lg font-medium">{segment.name}</h4>
                    <p className="text-text-secondary mb-3">{segment.description}</p>
                    {segment.goals.length > 0 && (
                      <div className="mb-3">
                        <h5 className="mb-2 text-sm font-medium text-green-700">Goals:</h5>
                        <ul className="space-y-1">
                          {segment.goals.map((g, i) => (
                            <li key={i} className="flex items-start gap-2 text-green-700">
                              <span className="mt-1 text-green-500">→</span>
                              {g}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {segment.frustrations.length > 0 && (
                      <div>
                        <h5 className="mb-2 text-sm font-medium text-red-700">Frustrations:</h5>
                        <ul className="space-y-1">
                          {segment.frustrations.map((f, i) => (
                            <li key={i} className="flex items-start gap-2 text-red-700">
                              <span className="mt-1 text-red-500">→</span>
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

          {research.painPoints.length > 0 && (
            <div className="mb-8">
              <h3 className="text-text-secondary mb-3 text-sm font-semibold uppercase">
                Pain Points
              </h3>
              <div className="space-y-2">
                {research.painPoints.map((pp) => (
                  <div key={pp.id} className="flex items-start gap-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${pp.severity === 'high' ? 'bg-red-100 text-red-700' : pp.severity === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}
                    >
                      {pp.severity}
                    </span>
                    <div>
                      <p className="text-text-primary">{pp.pain}</p>
                      {pp.frequency && <p className="text-text-tertiary text-sm">{pp.frequency}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {research.currentSolutions.length > 0 && (
            <div className="mb-8">
              <h3 className="text-text-secondary mb-3 text-sm font-semibold uppercase">
                Current Solutions
              </h3>
              <ul className="space-y-2">
                {research.currentSolutions.map((s, i) => (
                  <li key={i} className="text-text-primary flex items-start gap-2">
                    <span className="text-text-tertiary">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {research.unmetNeeds.length > 0 && (
            <div className="mb-8">
              <h3 className="text-text-secondary mb-3 text-sm font-semibold uppercase">
                Unmet Needs
              </h3>
              <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                <ul className="space-y-2">
                  {research.unmetNeeds.map((n, i) => (
                    <li key={i} className="flex items-start gap-2 text-purple-800">
                      <span className="text-purple-600">→</span>
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {research.researchMethods.length > 0 && (
            <div className="mb-8">
              <h3 className="text-text-secondary mb-3 text-sm font-semibold uppercase">
                Research Methods
              </h3>
              <div className="space-y-3">
                {research.researchMethods.map((rm) => (
                  <div key={rm.id} className="border-border-light rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-text-primary font-medium">{rm.method}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${rm.effort === 'low' ? 'bg-green-100 text-green-700' : rm.effort === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}
                      >
                        {rm.effort} effort
                      </span>
                    </div>
                    <p className="text-text-secondary text-sm">{rm.goal}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {research.keyInsights.length > 0 && (
            <div className="mb-8">
              <h3 className="text-text-secondary mb-3 text-sm font-semibold uppercase">
                Key Insights
              </h3>
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <ol className="list-inside list-decimal space-y-3">
                  {research.keyInsights.map((insight, i) => (
                    <li key={i} className="text-blue-800">
                      {insight}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
