'use client';

import { useEffect } from 'react';
import { DesignRationale } from '@/types';
import { generateRationaleMarkdown } from '@/lib/rationaleParser';
import { getPatternById } from '@/lib/patterns/patterns';

interface RationaleModalProps {
  rationale: DesignRationale;
  isOpen: boolean;
  onClose: () => void;
  onCopy: () => void;
}

export function RationaleModal({ rationale, isOpen, onClose, onCopy }: RationaleModalProps) {
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
    const markdown = generateRationaleMarkdown(rationale);
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
          <h2 className="text-text-primary text-lg font-semibold">Design Rationale</h2>
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

        {/* Content - Stakeholder-Ready Format */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Problem Statement */}
          {rationale.problem && (
            <section className="mb-8">
              <h3 className="text-text-tertiary mb-2 text-xs font-semibold tracking-wide uppercase">
                Problem Statement
              </h3>
              <p className="text-text-primary text-lg">{rationale.problem}</p>
            </section>
          )}

          {/* Context */}
          {rationale.context.length > 0 && (
            <section className="mb-8">
              <h3 className="text-text-tertiary mb-2 text-xs font-semibold tracking-wide uppercase">
                Context
              </h3>
              <ul className="space-y-1">
                {rationale.context.map((item, i) => (
                  <li key={i} className="text-text-secondary">
                    • {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Assumptions */}
          {rationale.assumptions.length > 0 && (
            <section className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <h3 className="mb-2 text-xs font-semibold tracking-wide text-amber-800 uppercase">
                Key Assumptions
              </h3>
              <ul className="space-y-1">
                {rationale.assumptions.map((item, i) => (
                  <li key={i} className="text-amber-800">
                    • {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Key Decisions */}
          {rationale.decisions.length > 0 && (
            <section className="mb-8">
              <h3 className="text-text-tertiary mb-4 text-xs font-semibold tracking-wide uppercase">
                Key Decisions
              </h3>
              <div className="space-y-6">
                {rationale.decisions.map((decision, index) => (
                  <div key={decision.id} className="border-border-light rounded-xl border p-5">
                    {/* Decision header */}
                    <div className="mb-4 flex items-start gap-3">
                      <span className="bg-accent-primary flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="text-text-primary text-lg font-semibold">
                          {decision.title}
                        </h4>
                      </div>
                    </div>

                    {/* What */}
                    <div className="mb-4">
                      <h5 className="text-text-tertiary mb-1 text-xs font-medium uppercase">
                        Decision
                      </h5>
                      <p className="text-text-primary">{decision.what}</p>
                    </div>

                    {/* Why */}
                    <div className="bg-bg-secondary mb-4 rounded-lg p-4">
                      <h5 className="text-text-tertiary mb-1 text-xs font-medium uppercase">
                        Rationale
                      </h5>
                      <p className="text-text-primary">{decision.why}</p>
                    </div>

                    {/* Rejected Alternatives */}
                    {decision.rejected.length > 0 && (
                      <div className="mb-4">
                        <h5 className="text-text-tertiary mb-2 text-xs font-medium uppercase">
                          Alternatives Considered & Rejected
                        </h5>
                        <div className="space-y-2">
                          {decision.rejected.map((alt, i) => (
                            <div
                              key={i}
                              className="rounded-lg border border-red-100 bg-red-50/50 p-3"
                            >
                              <span className="font-medium text-red-700 line-through">
                                {alt.approach}
                              </span>
                              <p className="text-text-secondary mt-1 text-sm">{alt.reason}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Patterns Applied */}
                    {decision.patterns.length > 0 && (
                      <div className="mb-4">
                        <h5 className="text-text-tertiary mb-2 text-xs font-medium uppercase">
                          Patterns Applied
                        </h5>
                        <div className="space-y-2">
                          {decision.patterns.map((p, i) => {
                            const pattern = getPatternById(p.patternId);
                            return (
                              <div
                                key={i}
                                className="rounded-lg border border-blue-100 bg-blue-50/50 p-3"
                              >
                                <a
                                  href={pattern?.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-accent-primary font-medium hover:underline"
                                >
                                  {pattern?.name ?? p.patternId}
                                </a>
                                <p className="text-text-secondary mt-1 text-sm">{p.application}</p>
                                {p.caution && (
                                  <p className="mt-2 flex items-center gap-1 text-sm text-amber-600">
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
                                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                                      <path d="M12 9v4" />
                                      <path d="M12 17h.01" />
                                    </svg>
                                    Caution: {p.caution}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Open Questions for this decision */}
                    {decision.openQuestions.length > 0 && (
                      <div>
                        <h5 className="text-text-tertiary mb-2 text-xs font-medium uppercase">
                          Open Questions
                        </h5>
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
                ))}
              </div>
            </section>
          )}

          {/* Overall Open Questions */}
          {rationale.openQuestions.length > 0 && (
            <section className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <h3 className="mb-2 text-xs font-semibold tracking-wide text-amber-800 uppercase">
                Remaining Open Questions
              </h3>
              <ul className="space-y-1">
                {rationale.openQuestions.map((q, i) => (
                  <li key={i} className="flex items-start gap-2 text-amber-800">
                    <span>?</span>
                    {q}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
