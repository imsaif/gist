'use client';

import { useState } from 'react';
import { FlowStep } from '@/types';
import { FlowStateTag } from './FlowStateTag';
import { getPatternById } from '@/lib/patterns/patterns';

interface FlowStepCardProps {
  step: FlowStep;
  index: number;
}

export function FlowStepCard({ step, index }: FlowStepCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasDetails =
    step.states.length > 0 ||
    step.decisions.length > 0 ||
    step.patterns.length > 0 ||
    step.openQuestions.length > 0;

  return (
    <div className="relative">
      {/* Timeline connector */}
      <div className="bg-border-light absolute top-0 left-4 h-full w-px" />

      {/* Step number circle */}
      <div className="border-accent-primary text-accent-primary absolute top-0 left-0 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white text-sm font-semibold">
        {index + 1}
      </div>

      {/* Card content */}
      <div className="ml-12 pb-6">
        <button
          onClick={() => hasDetails && setIsExpanded(!isExpanded)}
          className={`w-full text-left ${hasDetails ? 'cursor-pointer' : 'cursor-default'}`}
        >
          <div className="border-border-light hover:border-border-medium rounded-xl border bg-white p-4 transition-all hover:shadow-sm">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className="text-text-primary font-medium">{step.title}</h3>
                <p className="text-text-secondary mt-1 text-sm">{step.description}</p>
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

            {/* State badges (always visible if present) */}
            {step.states.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {step.states.map((state, i) => (
                  <FlowStateTag key={i} type={state.type} label={state.label} />
                ))}
              </div>
            )}

            {/* Expanded content */}
            {isExpanded && hasDetails && (
              <div className="border-border-light mt-4 space-y-4 border-t pt-4">
                {/* States with descriptions */}
                {step.states.some((s) => s.description) && (
                  <div>
                    <h4 className="text-text-tertiary mb-2 text-xs font-medium uppercase">
                      States
                    </h4>
                    <div className="space-y-2">
                      {step.states
                        .filter((s) => s.description)
                        .map((state, i) => (
                          <div key={i} className="text-sm">
                            <span className="text-text-primary font-medium">{state.label}:</span>{' '}
                            <span className="text-text-secondary">{state.description}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Decisions */}
                {step.decisions.length > 0 && (
                  <div>
                    <h4 className="text-text-tertiary mb-2 text-xs font-medium uppercase">
                      Decisions
                    </h4>
                    <div className="space-y-2">
                      {step.decisions.map((decision, i) => (
                        <div key={i} className="text-sm">
                          <span className="text-text-primary font-medium">{decision.decision}</span>
                          {decision.rationale && (
                            <p className="text-text-secondary mt-0.5">{decision.rationale}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Patterns */}
                {step.patterns.length > 0 && (
                  <div>
                    <h4 className="text-text-tertiary mb-2 text-xs font-medium uppercase">
                      Patterns Applied
                    </h4>
                    <div className="space-y-2">
                      {step.patterns.map((p, i) => {
                        const pattern = getPatternById(p.patternId);
                        return (
                          <div key={i} className="text-sm">
                            <a
                              href={pattern?.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-accent-primary font-medium hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {pattern?.name ?? p.patternId}
                            </a>
                            <p className="text-text-secondary mt-0.5">{p.reason}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Open Questions */}
                {step.openQuestions.length > 0 && (
                  <div>
                    <h4 className="text-text-tertiary mb-2 text-xs font-medium uppercase">
                      Open Questions
                    </h4>
                    <ul className="space-y-1">
                      {step.openQuestions.map((q, i) => (
                        <li key={i} className="text-text-secondary flex items-start gap-2 text-sm">
                          <span className="text-amber-500">?</span>
                          {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </button>
      </div>
    </div>
  );
}
