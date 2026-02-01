'use client';

import { Critique, CritiquePhase } from '@/types';
import { PhaseIndicator } from '@/components/DesignMap/PhaseIndicator';
import { IssueCard } from './IssueCard';
import { getPatternById } from '@/lib/patterns/patterns';

interface CritiquePanelProps {
  critique: Critique;
  onViewCritique: () => void;
  onCopyCritique: () => void;
  onDownloadCritique: () => void;
}

const CRITIQUE_PHASES: CritiquePhase[] = ['upload', 'analyze', 'deep-dive', 'synthesize'];

const PHASE_LABELS: Record<CritiquePhase, string> = {
  upload: 'Upload',
  analyze: 'Analyze',
  'deep-dive': 'Deep-dive',
  synthesize: 'Synthesize',
};

export function CritiquePanel({
  critique,
  onViewCritique,
  onCopyCritique,
  onDownloadCritique,
}: CritiquePanelProps) {
  const hasContent =
    critique.imageDescription || critique.whatsWorking.length > 0 || critique.issues.length > 0;

  const criticalCount = critique.issues.filter((i) => i.severity === 'critical').length;
  const majorCount = critique.issues.filter((i) => i.severity === 'major').length;
  const minorCount = critique.issues.filter((i) => i.severity === 'minor').length;

  return (
    <div className="flex h-full flex-col">
      {/* Header with phase indicator */}
      <div className="border-border-light border-b p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-text-secondary text-sm font-semibold tracking-wide uppercase">
            Design Critique
          </h2>
          {hasContent && (
            <div className="flex gap-1">
              <button
                onClick={onCopyCritique}
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
                onClick={onDownloadCritique}
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
          phases={CRITIQUE_PHASES}
          currentPhase={critique.currentPhase}
          labels={PHASE_LABELS}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Issue Summary */}
        {critique.issues.length > 0 && (
          <div className="mb-6">
            <h3 className="text-text-tertiary mb-3 text-xs font-medium uppercase">Summary</h3>
            <div className="flex gap-3">
              {criticalCount > 0 && (
                <div className="rounded-lg bg-red-50 px-3 py-2 text-center">
                  <div className="text-lg font-semibold text-red-700">{criticalCount}</div>
                  <div className="text-xs text-red-600">Critical</div>
                </div>
              )}
              {majorCount > 0 && (
                <div className="rounded-lg bg-amber-50 px-3 py-2 text-center">
                  <div className="text-lg font-semibold text-amber-700">{majorCount}</div>
                  <div className="text-xs text-amber-600">Major</div>
                </div>
              )}
              {minorCount > 0 && (
                <div className="rounded-lg bg-blue-50 px-3 py-2 text-center">
                  <div className="text-lg font-semibold text-blue-700">{minorCount}</div>
                  <div className="text-xs text-blue-600">Minor</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* What's Working */}
        {critique.whatsWorking.length > 0 && (
          <div className="mb-6">
            <h3 className="text-text-tertiary mb-2 text-xs font-medium uppercase">
              What&apos;s Working
            </h3>
            <div className="rounded-xl border border-green-100 bg-green-50/50 p-4">
              <ul className="space-y-1">
                {critique.whatsWorking.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                    <span className="text-green-500">+</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Issues */}
        {critique.issues.length > 0 && (
          <div className="mb-6">
            <h3 className="text-text-tertiary mb-3 text-xs font-medium uppercase">Issues Found</h3>
            <div className="space-y-3">
              {critique.issues.map((issue, index) => (
                <IssueCard key={issue.id} issue={issue} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Patterns */}
        {critique.patterns.length > 0 && (
          <div className="mb-6">
            <h3 className="text-text-tertiary mb-2 text-xs font-medium uppercase">
              Relevant Patterns
            </h3>
            <div className="space-y-2">
              {critique.patterns.map((p) => {
                const pattern = getPatternById(p.patternId);
                if (!pattern) return null;
                return (
                  <a
                    key={p.patternId}
                    href={pattern.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-border-light hover:border-accent-primary block rounded-lg border bg-white p-3 transition-colors"
                  >
                    <div className="text-text-primary text-sm font-medium">{pattern.name}</div>
                    <div className="text-text-tertiary text-xs">{p.reason}</div>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Priority Fixes */}
        {critique.priorityFixes.length > 0 && (
          <div className="mb-6">
            <h3 className="text-text-tertiary mb-2 text-xs font-medium uppercase">
              Priority Fixes
            </h3>
            <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-4">
              <ol className="list-inside list-decimal space-y-1">
                {critique.priorityFixes.map((fix, i) => (
                  <li key={i} className="text-sm text-purple-700">
                    {fix}
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
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <p className="text-text-tertiary text-sm">
              Upload a design screenshot to start the critique.
            </p>
          </div>
        )}
      </div>

      {/* Footer with view button */}
      {hasContent && (
        <div className="border-border-light border-t p-4">
          <button
            onClick={onViewCritique}
            className="border-border-light text-text-secondary hover:bg-bg-secondary w-full rounded-lg border py-2 text-sm font-medium transition-colors"
          >
            View Full Critique
          </button>
        </div>
      )}
    </div>
  );
}
