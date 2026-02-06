'use client';

import { Ideation } from '@/types';
import { generateIdeationMarkdown } from '@/lib/ideationParser';

interface IdeationModalProps {
  ideation: Ideation;
  isOpen: boolean;
  onClose: () => void;
  onCopy: () => void;
}

export function IdeationModal({ ideation, isOpen, onClose, onCopy }: IdeationModalProps) {
  if (!isOpen) return null;

  const handleCopy = async () => {
    const markdown = generateIdeationMarkdown(ideation);
    await navigator.clipboard.writeText(markdown);
    onCopy();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="border-border-light flex items-center justify-between border-b p-4">
          <h2 className="text-text-primary text-lg font-semibold">Solution Options Board</h2>
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
          {ideation.problemStatement && (
            <div className="mb-8">
              <h3 className="text-text-secondary mb-2 text-sm font-semibold uppercase">
                Problem Statement
              </h3>
              <p className="text-text-primary text-lg font-medium">{ideation.problemStatement}</p>
            </div>
          )}

          {ideation.approaches.length > 0 && (
            <div className="mb-8">
              <h3 className="text-text-secondary mb-4 text-sm font-semibold uppercase">
                Approaches
              </h3>
              <div className="space-y-6">
                {ideation.approaches.map((approach, index) => {
                  const isRecommended = ideation.recommendation?.approachId === approach.id;
                  return (
                    <div
                      key={approach.id}
                      className={`rounded-lg border p-4 ${isRecommended ? 'border-green-200 bg-green-50' : 'border-border-light'}`}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-text-tertiary font-medium">#{index + 1}</span>
                        <h4 className="text-text-primary text-lg font-medium">{approach.title}</h4>
                        {isRecommended && (
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                            Recommended
                          </span>
                        )}
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${approach.effort === 'low' ? 'bg-green-100 text-green-700' : approach.effort === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}
                        >
                          {approach.effort} effort
                        </span>
                      </div>
                      <p className="text-text-secondary mb-2">{approach.description}</p>
                      <p className="text-text-tertiary mb-4 text-sm">
                        Target: {approach.targetUsers}
                      </p>

                      <div className="grid grid-cols-2 gap-4">
                        {approach.strengths.length > 0 && (
                          <div>
                            <h5 className="mb-2 text-sm font-medium text-green-700">Strengths</h5>
                            <ul className="space-y-1">
                              {approach.strengths.map((s, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2 text-sm text-green-700"
                                >
                                  <span className="text-green-500">+</span>
                                  {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {approach.weaknesses.length > 0 && (
                          <div>
                            <h5 className="mb-2 text-sm font-medium text-red-700">Weaknesses</h5>
                            <ul className="space-y-1">
                              {approach.weaknesses.map((w, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                                  <span className="text-red-500">-</span>
                                  {w}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {ideation.evaluationCriteria.length > 0 && (
            <div className="mb-8">
              <h3 className="text-text-secondary mb-3 text-sm font-semibold uppercase">
                Evaluation Criteria
              </h3>
              <div className="space-y-2">
                {ideation.evaluationCriteria.map((ec) => (
                  <div
                    key={ec.id}
                    className="flex items-center justify-between border-b border-slate-100 py-2"
                  >
                    <span className="text-text-primary">{ec.criterion}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${ec.weight === 'must-have' ? 'bg-red-100 text-red-700' : ec.weight === 'important' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}
                    >
                      {ec.weight}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {ideation.recommendation && (
            <div className="mb-8">
              <h3 className="text-text-secondary mb-3 text-sm font-semibold uppercase">
                Recommendation
              </h3>
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <p className="text-green-800">{ideation.recommendation.reasoning}</p>
                {ideation.recommendation.nextSteps.length > 0 && (
                  <div className="mt-4">
                    <h5 className="mb-2 text-sm font-medium text-green-800">Next Steps:</h5>
                    <ol className="list-inside list-decimal space-y-2">
                      {ideation.recommendation.nextSteps.map((step, i) => (
                        <li key={i} className="text-green-800">
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
