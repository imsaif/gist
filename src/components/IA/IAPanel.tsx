'use client';

import { InformationArchitecture, IAPhase } from '@/types';
import { PhaseIndicator } from '@/components/DesignMap/PhaseIndicator';
import { ContentTree } from './ContentTree';
import { NavigationPreview } from './NavigationPreview';

interface IAPanelProps {
  ia: InformationArchitecture;
  onViewIA: () => void;
  onCopyIA: () => void;
  onDownloadIA: () => void;
}

const IA_PHASES: IAPhase[] = ['understand', 'inventory', 'structure', 'navigation', 'synthesize'];

const PHASE_LABELS: Record<IAPhase, string> = {
  understand: 'Understand',
  inventory: 'Inventory',
  structure: 'Structure',
  navigation: 'Navigation',
  synthesize: 'Synthesize',
};

export function IAPanel({ ia, onViewIA, onCopyIA, onDownloadIA }: IAPanelProps) {
  const hasContent = ia.projectName || ia.contentInventory.length > 0 || ia.navigation.length > 0;

  // Get root items (no parent)
  const rootItems = ia.contentInventory.filter((item) => !item.parent);

  return (
    <div className="flex h-full flex-col">
      {/* Header with phase indicator */}
      <div className="border-border-light border-b p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-text-secondary text-sm font-semibold tracking-wide uppercase">
            Information Architecture
          </h2>
          {hasContent && (
            <div className="flex gap-1">
              <button
                onClick={onCopyIA}
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
                onClick={onDownloadIA}
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
        <PhaseIndicator phases={IA_PHASES} currentPhase={ia.currentPhase} labels={PHASE_LABELS} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Project Name */}
        {ia.projectName && (
          <div className="mb-6">
            <h3 className="text-text-tertiary mb-2 text-xs font-medium uppercase">Project</h3>
            <div className="border-border-light rounded-xl border bg-white p-4">
              <p className="text-text-primary font-medium">{ia.projectName}</p>
            </div>
          </div>
        )}

        {/* Content Inventory Stats */}
        {ia.contentInventory.length > 0 && (
          <div className="mb-6">
            <h3 className="text-text-tertiary mb-3 text-xs font-medium uppercase">
              Content Inventory
            </h3>
            <div className="mb-4 flex gap-3">
              <div className="rounded-lg bg-blue-50 px-3 py-2 text-center">
                <div className="text-lg font-semibold text-blue-700">
                  {ia.contentInventory.filter((i) => i.type === 'page').length}
                </div>
                <div className="text-xs text-blue-600">Pages</div>
              </div>
              <div className="rounded-lg bg-green-50 px-3 py-2 text-center">
                <div className="text-lg font-semibold text-green-700">
                  {ia.contentInventory.filter((i) => i.type === 'section').length}
                </div>
                <div className="text-xs text-green-600">Sections</div>
              </div>
              <div className="rounded-lg bg-purple-50 px-3 py-2 text-center">
                <div className="text-lg font-semibold text-purple-700">
                  {ia.contentInventory.filter((i) => i.type === 'component').length}
                </div>
                <div className="text-xs text-purple-600">Components</div>
              </div>
              <div className="rounded-lg bg-amber-50 px-3 py-2 text-center">
                <div className="text-lg font-semibold text-amber-700">
                  {ia.contentInventory.filter((i) => i.type === 'data').length}
                </div>
                <div className="text-xs text-amber-600">Data</div>
              </div>
            </div>
            <ContentTree items={rootItems} allItems={ia.contentInventory} />
          </div>
        )}

        {/* Navigation */}
        {ia.navigation.length > 0 && (
          <div className="mb-6">
            <h3 className="text-text-tertiary mb-3 text-xs font-medium uppercase">
              Navigation Structure
            </h3>
            <div className="border-border-light rounded-xl border bg-white p-4">
              <NavigationPreview items={ia.navigation} />
            </div>
          </div>
        )}

        {/* Open Questions */}
        {ia.openQuestions.length > 0 && (
          <div className="mb-6">
            <h3 className="text-text-tertiary mb-2 text-xs font-medium uppercase">
              Open Questions
            </h3>
            <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4">
              <ul className="space-y-1">
                {ia.openQuestions.map((q, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-amber-700">
                    <span className="text-amber-500">?</span>
                    {q}
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
                <path d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
              </svg>
            </div>
            <p className="text-text-tertiary text-sm">
              Tell me about the product you&apos;re structuring.
            </p>
          </div>
        )}
      </div>

      {/* Footer with view button */}
      {hasContent && (
        <div className="border-border-light border-t p-4">
          <button
            onClick={onViewIA}
            className="border-border-light text-text-secondary hover:bg-bg-secondary w-full rounded-lg border py-2 text-sm font-medium transition-colors"
          >
            View Full IA
          </button>
        </div>
      )}
    </div>
  );
}
