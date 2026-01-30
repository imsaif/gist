'use client';

import { useEffect } from 'react';
import { DesignMap } from '@/types';
import { generateDesignMapMarkdown } from '@/lib/designMapParser';
import { getPatternById } from '@/lib/patterns/patterns';

interface DesignMapModalProps {
  map: DesignMap;
  isOpen: boolean;
  onClose: () => void;
  onCopy: () => void;
}

export function DesignMapModal({ map, isOpen, onClose, onCopy }: DesignMapModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    const markdown = generateDesignMapMarkdown(map);
    await navigator.clipboard.writeText(markdown);
    onCopy();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative mx-4 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="border-border-light flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-text-primary text-lg font-semibold">
            {map.overview ? `Design Map: ${map.overview}` : 'Design Map'}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="text-text-secondary hover:bg-bg-secondary inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
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
              className="text-text-tertiary hover:text-text-primary rounded-lg p-2 transition-colors"
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
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Overview */}
          {map.overview && (
            <section className="mb-8">
              <h3 className="text-text-tertiary mb-2 text-xs font-semibold tracking-wide uppercase">
                Overview
              </h3>
              <p className="text-text-primary">{map.overview}</p>
            </section>
          )}

          {/* User Flow */}
          {map.flow.length > 0 && (
            <section className="mb-8">
              <h3 className="text-text-tertiary mb-4 text-xs font-semibold tracking-wide uppercase">
                User Flow
              </h3>
              <div className="space-y-4">
                {map.flow.map((step, index) => (
                  <div key={step.id} className="border-border-light rounded-xl border p-4">
                    <div className="mb-2 flex items-start gap-3">
                      <span className="bg-accent-primary/10 text-accent-primary flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="text-text-primary font-semibold">{step.title}</h4>
                        <p className="text-text-secondary mt-1 text-sm">{step.description}</p>
                      </div>
                    </div>

                    {/* States */}
                    {step.states.length > 0 && (
                      <div className="mt-3 ml-9">
                        <h5 className="text-text-tertiary mb-1 text-xs font-medium">States</h5>
                        <ul className="space-y-1">
                          {step.states.map((state, i) => (
                            <li key={i} className="text-text-secondary text-sm">
                              <span className="font-medium capitalize">[{state.type}]</span>{' '}
                              {state.label}
                              {state.description && `: ${state.description}`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Decisions */}
                    {step.decisions.length > 0 && (
                      <div className="mt-3 ml-9">
                        <h5 className="text-text-tertiary mb-1 text-xs font-medium">Decisions</h5>
                        <ul className="space-y-1">
                          {step.decisions.map((decision, i) => (
                            <li key={i} className="text-text-secondary text-sm">
                              <span className="text-text-primary font-medium">
                                {decision.decision}
                              </span>
                              : {decision.rationale}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Patterns */}
                    {step.patterns.length > 0 && (
                      <div className="mt-3 ml-9">
                        <h5 className="text-text-tertiary mb-1 text-xs font-medium">Patterns</h5>
                        <ul className="space-y-1">
                          {step.patterns.map((p, i) => {
                            const pattern = getPatternById(p.patternId);
                            return (
                              <li key={i} className="text-text-secondary text-sm">
                                <a
                                  href={pattern?.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-accent-primary font-medium hover:underline"
                                >
                                  {pattern?.name ?? p.patternId}
                                </a>
                                : {p.reason}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}

                    {/* Open Questions */}
                    {step.openQuestions.length > 0 && (
                      <div className="mt-3 ml-9">
                        <h5 className="text-text-tertiary mb-1 text-xs font-medium">
                          Open Questions
                        </h5>
                        <ul className="space-y-1">
                          {step.openQuestions.map((q, i) => (
                            <li key={i} className="text-sm text-amber-600">
                              ? {q}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Constraints */}
          {map.constraints.length > 0 && (
            <section className="mb-8">
              <h3 className="text-text-tertiary mb-2 text-xs font-semibold tracking-wide uppercase">
                Constraints
              </h3>
              <ul className="space-y-1">
                {map.constraints.map((constraint, i) => (
                  <li key={i} className="text-text-secondary text-sm">
                    • {constraint}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Alternatives */}
          {map.alternatives.length > 0 && (
            <section className="mb-8">
              <h3 className="text-text-tertiary mb-2 text-xs font-semibold tracking-wide uppercase">
                Alternatives Considered
              </h3>
              <div className="space-y-3">
                {map.alternatives.map((alt, i) => (
                  <div
                    key={i}
                    className={`rounded-lg border p-4 ${
                      alt.rejected
                        ? 'border-border-light bg-bg-secondary'
                        : 'border-green-200 bg-green-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-text-primary font-semibold">{alt.approach}</span>
                      {alt.rejected ? (
                        <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                          Rejected
                        </span>
                      ) : (
                        <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-600">
                          Chosen
                        </span>
                      )}
                    </div>
                    <p className="text-text-secondary mt-1">{alt.description}</p>

                    {alt.pros.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs font-medium text-green-600">Pros:</span>
                        <ul className="mt-1 ml-4">
                          {alt.pros.map((pro, j) => (
                            <li key={j} className="text-text-secondary text-sm">
                              + {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {alt.cons.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs font-medium text-red-600">Cons:</span>
                        <ul className="mt-1 ml-4">
                          {alt.cons.map((con, j) => (
                            <li key={j} className="text-text-secondary text-sm">
                              - {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {alt.rejected && alt.rejectionReason && (
                      <p className="text-text-tertiary mt-2 text-sm italic">
                        Reason: {alt.rejectionReason}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
