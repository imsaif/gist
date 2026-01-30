'use client';

import { useState } from 'react';
import { DesignDecision } from '@/types';
import { getPatternById } from '@/lib/patterns/patterns';

interface DecisionCardProps {
  decision: DesignDecision;
  index: number;
}

export function DecisionCard({ decision, index }: DecisionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasDetails =
    decision.rejected.length > 0 ||
    decision.patterns.length > 0 ||
    decision.openQuestions.length > 0;

  return (
    <div className="border-border-light overflow-hidden rounded-xl border bg-white">
      <button
        onClick={() => hasDetails && setIsExpanded(!isExpanded)}
        className={`w-full p-4 text-left ${hasDetails ? 'cursor-pointer' : 'cursor-default'}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <span className="bg-accent-primary/10 text-accent-primary flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-xs font-semibold">
                {index + 1}
              </span>
              <h3 className="text-text-primary font-semibold">{decision.title}</h3>
            </div>
            <p className="text-text-secondary mt-1 text-sm">{decision.what}</p>
          </div>
          {hasDetails && (
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
              className={`text-text-tertiary flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          )}
        </div>

        {/* Why summary */}
        <div className="bg-bg-secondary mt-3 rounded-lg p-3">
          <p className="text-text-tertiary mb-1 text-xs font-medium uppercase">Why</p>
          <p className="text-text-primary text-sm">{decision.why}</p>
        </div>

        {/* Quick badges */}
        <div className="mt-3 flex flex-wrap gap-2">
          {decision.rejected.length > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              {decision.rejected.length} rejected
            </span>
          )}
          {decision.patterns.length > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              {decision.patterns.length} pattern{decision.patterns.length > 1 ? 's' : ''}
            </span>
          )}
          {decision.openQuestions.length > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              {decision.openQuestions.length} question{decision.openQuestions.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && hasDetails && (
        <div className="border-border-light bg-bg-secondary/30 space-y-4 border-t p-4">
          {/* Rejected alternatives */}
          {decision.rejected.length > 0 && (
            <div>
              <h4 className="text-text-tertiary mb-2 text-xs font-medium uppercase">
                Rejected Alternatives
              </h4>
              <div className="space-y-2">
                {decision.rejected.map((alt, i) => (
                  <div key={i} className="rounded-lg border border-red-100 bg-red-50/50 p-3">
                    <span className="text-text-primary text-sm font-medium line-through">
                      {alt.approach}
                    </span>
                    <p className="text-text-secondary mt-1 text-sm">{alt.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Patterns */}
          {decision.patterns.length > 0 && (
            <div>
              <h4 className="text-text-tertiary mb-2 text-xs font-medium uppercase">
                Patterns Applied
              </h4>
              <div className="space-y-2">
                {decision.patterns.map((p, i) => {
                  const pattern = getPatternById(p.patternId);
                  return (
                    <div key={i} className="rounded-lg border border-blue-100 bg-blue-50/50 p-3">
                      <a
                        href={pattern?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-primary text-sm font-medium hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {pattern?.name ?? p.patternId}
                      </a>
                      <p className="text-text-secondary mt-1 text-sm">{p.application}</p>
                      {p.caution && (
                        <p className="mt-2 flex items-center gap-1 text-xs text-amber-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                            <path d="M12 9v4" />
                            <path d="M12 17h.01" />
                          </svg>
                          {p.caution}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Open Questions */}
          {decision.openQuestions.length > 0 && (
            <div>
              <h4 className="text-text-tertiary mb-2 text-xs font-medium uppercase">
                Open Questions
              </h4>
              <ul className="space-y-1">
                {decision.openQuestions.map((q, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-amber-600">
                    <span>?</span>
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
