'use client';

import { StakeholderPrep, StakeholderPhase } from '@/types';
import { PhaseIndicator } from '@/components/DesignMap/PhaseIndicator';
import { ObjectionCard } from './ObjectionCard';

interface StakeholderPanelProps {
  stakeholder: StakeholderPrep;
  onViewStakeholder: () => void;
  onCopyStakeholder: () => void;
  onDownloadStakeholder: () => void;
}

const STAKEHOLDER_PHASES: StakeholderPhase[] = ['context', 'objections', 'evidence', 'synthesize'];

const PHASE_LABELS: Record<StakeholderPhase, string> = {
  context: 'Context',
  objections: 'Objections',
  evidence: 'Evidence',
  synthesize: 'Synthesize',
};

export function StakeholderPanel({
  stakeholder,
  onViewStakeholder,
  onCopyStakeholder,
  onDownloadStakeholder,
}: StakeholderPanelProps) {
  const hasContent =
    stakeholder.designDecision ||
    stakeholder.context.length > 0 ||
    stakeholder.objections.length > 0 ||
    stakeholder.talkingPoints.length > 0;

  return (
    <div className="flex h-full flex-col">
      {/* Header with phase indicator */}
      <div className="border-border-light border-b p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-text-secondary text-sm font-semibold tracking-wide uppercase">
            Stakeholder Prep
          </h2>
          {hasContent && (
            <div className="flex gap-1">
              <button
                onClick={onCopyStakeholder}
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
                onClick={onDownloadStakeholder}
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
          phases={STAKEHOLDER_PHASES}
          currentPhase={stakeholder.currentPhase}
          labels={PHASE_LABELS}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Decision & Context */}
        {(stakeholder.designDecision || stakeholder.context.length > 0) && (
          <div className="mb-6">
            {stakeholder.designDecision && (
              <div className="mb-4">
                <h3 className="text-text-tertiary mb-2 text-xs font-medium uppercase">Decision</h3>
                <div className="border-border-light rounded-xl border bg-white p-4 shadow-sm">
                  <p className="text-text-primary font-medium">{stakeholder.designDecision}</p>
                </div>
              </div>
            )}

            {stakeholder.context.length > 0 && (
              <div>
                <h3 className="text-text-tertiary mb-2 text-xs font-medium uppercase">Context</h3>
                <div className="border-border-light rounded-xl border bg-white p-4 shadow-sm">
                  <ul className="space-y-1">
                    {stakeholder.context.map((item, i) => (
                      <li key={i} className="text-text-secondary flex items-start gap-2 text-sm">
                        <span className="text-text-tertiary">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Objections */}
        {stakeholder.objections.length > 0 && (
          <div className="mb-6">
            <h3 className="text-text-tertiary mb-3 text-xs font-medium uppercase">
              Anticipated Objections ({stakeholder.objections.length})
            </h3>
            <div className="space-y-3">
              {stakeholder.objections.map((objection, index) => (
                <ObjectionCard key={objection.id} objection={objection} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Talking Points */}
        {stakeholder.talkingPoints.length > 0 && (
          <div className="mb-6">
            <h3 className="text-text-tertiary mb-2 text-xs font-medium uppercase">
              Key Talking Points
            </h3>
            <div className="rounded-xl border border-green-100 bg-green-50/50 p-4 shadow-sm">
              <ol className="list-inside list-decimal space-y-2">
                {stakeholder.talkingPoints.map((point, i) => (
                  <li key={i} className="text-sm text-green-700">
                    {point}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {/* Risk Mitigations */}
        {stakeholder.riskMitigations.length > 0 && (
          <div className="mb-6">
            <h3 className="text-text-tertiary mb-2 text-xs font-medium uppercase">
              Risk Mitigations
            </h3>
            <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 shadow-sm">
              <ul className="space-y-1">
                {stakeholder.riskMitigations.map((mitigation, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-amber-700">
                    <span className="text-amber-500">→</span>
                    {mitigation}
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
                <path d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
              </svg>
            </div>
            <p className="text-text-tertiary text-sm">Tell me what decision you need to defend.</p>
          </div>
        )}
      </div>

      {/* Footer with view button */}
      {hasContent && (
        <div className="border-border-light border-t p-4">
          <button
            onClick={onViewStakeholder}
            className="border-border-light text-text-secondary hover:bg-bg-secondary w-full rounded-lg border py-2 text-sm font-medium transition-colors"
          >
            View Full Prep
          </button>
        </div>
      )}
    </div>
  );
}
