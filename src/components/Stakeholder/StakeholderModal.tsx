'use client';

import { StakeholderPrep } from '@/types';
import { generateStakeholderMarkdown } from '@/lib/stakeholderParser';

interface StakeholderModalProps {
  stakeholder: StakeholderPrep;
  isOpen: boolean;
  onClose: () => void;
  onCopy: () => void;
}

export function StakeholderModal({ stakeholder, isOpen, onClose, onCopy }: StakeholderModalProps) {
  if (!isOpen) return null;

  const handleCopy = async () => {
    const markdown = generateStakeholderMarkdown(stakeholder);
    await navigator.clipboard.writeText(markdown);
    onCopy();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="border-border-light flex items-center justify-between border-b p-4">
          <h2 className="text-text-primary text-lg font-semibold">Stakeholder Preparation</h2>
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
          {/* Decision */}
          {stakeholder.designDecision && (
            <div className="mb-8">
              <h3 className="text-text-secondary mb-2 text-sm font-semibold uppercase">Decision</h3>
              <p className="text-text-primary text-lg font-medium">{stakeholder.designDecision}</p>
            </div>
          )}

          {/* Context */}
          {stakeholder.context.length > 0 && (
            <div className="mb-8">
              <h3 className="text-text-secondary mb-3 text-sm font-semibold uppercase">Context</h3>
              <ul className="space-y-2">
                {stakeholder.context.map((item, i) => (
                  <li key={i} className="text-text-primary flex items-start gap-2">
                    <span className="text-text-tertiary">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Objections */}
          {stakeholder.objections.length > 0 && (
            <div className="mb-8">
              <h3 className="text-text-secondary mb-4 text-sm font-semibold uppercase">
                Anticipated Objections
              </h3>
              <div className="space-y-6">
                {stakeholder.objections.map((objection, index) => (
                  <div key={objection.id} className="border-border-light rounded-lg border p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-text-tertiary font-medium">#{index + 1}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                        {objection.stakeholder}
                      </span>
                    </div>
                    <p className="text-text-primary mb-4 text-lg font-medium">
                      &ldquo;{objection.objection}&rdquo;
                    </p>

                    {objection.counterArguments.length > 0 && (
                      <div className="mb-4">
                        <h4 className="mb-2 text-sm font-medium text-green-700">
                          Counter-arguments:
                        </h4>
                        <ul className="space-y-2">
                          {objection.counterArguments.map((arg, i) => (
                            <li key={i} className="flex items-start gap-2 text-green-700">
                              <span className="mt-1 text-green-500">→</span>
                              {arg}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {objection.evidenceNeeded.length > 0 && (
                      <div>
                        <h4 className="mb-2 text-sm font-medium text-amber-700">
                          Evidence needed:
                        </h4>
                        <ul className="space-y-2">
                          {objection.evidenceNeeded.map((evidence, i) => (
                            <li key={i} className="flex items-start gap-2 text-amber-700">
                              <input type="checkbox" className="mt-1 rounded border-amber-300" />
                              {evidence}
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

          {/* Talking Points */}
          {stakeholder.talkingPoints.length > 0 && (
            <div className="mb-8">
              <h3 className="text-text-secondary mb-3 text-sm font-semibold uppercase">
                Key Talking Points
              </h3>
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <ol className="list-inside list-decimal space-y-3">
                  {stakeholder.talkingPoints.map((point, i) => (
                    <li key={i} className="text-green-800">
                      {point}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          {/* Risk Mitigations */}
          {stakeholder.riskMitigations.length > 0 && (
            <div className="mb-8">
              <h3 className="text-text-secondary mb-3 text-sm font-semibold uppercase">
                Risk Mitigations
              </h3>
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <ul className="space-y-2">
                  {stakeholder.riskMitigations.map((mitigation, i) => (
                    <li key={i} className="flex items-start gap-2 text-amber-800">
                      <span className="text-amber-600">→</span>
                      {mitigation}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
