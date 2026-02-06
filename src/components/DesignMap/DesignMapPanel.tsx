'use client';

import { DesignMap, ConversationPhase } from '@/types';
import { PhaseIndicator } from './PhaseIndicator';
import { FlowTimeline } from './FlowTimeline';
import { getPatternById } from '@/lib/patterns/patterns';

interface DesignMapPanelProps {
  map: DesignMap;
  onViewMap: () => void;
  onCopyMap: () => void;
  onDownloadMap: () => void;
}

const MAP_PHASES: ConversationPhase[] = [
  'understand',
  'map',
  'explore',
  'alternatives',
  'synthesize',
];

const PHASE_LABELS: Record<ConversationPhase, string> = {
  understand: 'Understand',
  map: 'Map',
  explore: 'Explore',
  alternatives: 'Alternatives',
  synthesize: 'Synthesize',
};

export function DesignMapPanel({ map, onViewMap, onCopyMap, onDownloadMap }: DesignMapPanelProps) {
  const hasContent = map.overview || map.flow.length > 0;

  return (
    <div className="flex h-full flex-col">
      {/* Header with phase indicator */}
      <div className="border-border-light border-b p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-text-secondary text-sm font-semibold tracking-wide uppercase">
            Design Map
          </h2>
          {hasContent && (
            <div className="flex gap-1">
              <button
                onClick={onCopyMap}
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
                onClick={onDownloadMap}
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
        <PhaseIndicator phases={MAP_PHASES} currentPhase={map.currentPhase} labels={PHASE_LABELS} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Overview */}
        {map.overview && (
          <div className="mb-6">
            <h3 className="text-text-tertiary mb-2 text-xs font-medium uppercase">Overview</h3>
            <p className="text-text-primary text-sm">{map.overview}</p>
          </div>
        )}

        {/* Flow timeline */}
        <div className="mb-6">
          <h3 className="text-text-tertiary mb-3 text-xs font-medium uppercase">User Flow</h3>
          <FlowTimeline steps={map.flow} />
        </div>

        {/* Constraints */}
        {map.constraints.length > 0 && (
          <div className="mb-6">
            <h3 className="text-text-tertiary mb-2 text-xs font-medium uppercase">Constraints</h3>
            <ul className="space-y-1">
              {map.constraints.map((constraint, i) => (
                <li key={i} className="text-text-secondary text-sm">
                  • {constraint}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Alternatives */}
        {map.alternatives.length > 0 && (
          <div className="mb-6">
            <h3 className="text-text-tertiary mb-2 text-xs font-medium uppercase">
              Alternatives Considered
            </h3>
            <div className="space-y-3">
              {map.alternatives.map((alt, i) => (
                <div
                  key={i}
                  className={`rounded-lg border p-3 shadow-sm ${
                    alt.rejected
                      ? 'border-border-light bg-bg-secondary'
                      : 'border-green-200 bg-green-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-text-primary text-sm font-medium">{alt.approach}</span>
                    {alt.rejected && (
                      <span className="text-text-tertiary bg-bg-tertiary rounded px-1.5 py-0.5 text-xs">
                        Rejected
                      </span>
                    )}
                  </div>
                  <p className="text-text-secondary mt-1 text-sm">{alt.description}</p>
                  {alt.rejected && alt.rejectionReason && (
                    <p className="text-text-tertiary mt-2 text-xs italic">
                      Reason: {alt.rejectionReason}
                    </p>
                  )}
                </div>
              ))}
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
                <path d="M3 3h18v18H3z" />
                <path d="M3 9h18" />
                <path d="M3 15h18" />
                <path d="M9 3v18" />
                <path d="M15 3v18" />
              </svg>
            </div>
            <p className="text-text-tertiary text-sm">
              Your design map will build as you describe the flow.
            </p>
          </div>
        )}
      </div>

      {/* Footer with view button */}
      {hasContent && (
        <div className="border-border-light border-t p-4">
          <button
            onClick={onViewMap}
            className="border-border-light text-text-secondary hover:bg-bg-secondary w-full rounded-lg border py-2 text-sm font-medium transition-colors"
          >
            View Full Map
          </button>
        </div>
      )}
    </div>
  );
}
