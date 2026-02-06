'use client';

import { ConstraintMap } from '@/types';
import { generateConstraintsMarkdown } from '@/lib/constraintsParser';

interface ConstraintsModalProps {
  constraintMap: ConstraintMap;
  isOpen: boolean;
  onClose: () => void;
  onCopy: () => void;
}

const CATEGORY_COLORS: Record<string, { badge: string; text: string }> = {
  technical: { badge: 'bg-blue-100', text: 'text-blue-700' },
  timeline: { badge: 'bg-purple-100', text: 'text-purple-700' },
  resource: { badge: 'bg-amber-100', text: 'text-amber-700' },
  business: { badge: 'bg-green-100', text: 'text-green-700' },
  regulatory: { badge: 'bg-red-100', text: 'text-red-700' },
};

export function ConstraintsModal({
  constraintMap,
  isOpen,
  onClose,
  onCopy,
}: ConstraintsModalProps) {
  if (!isOpen) return null;

  const handleCopy = async () => {
    const markdown = generateConstraintsMarkdown(constraintMap);
    await navigator.clipboard.writeText(markdown);
    onCopy();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="border-border-light flex items-center justify-between border-b p-4">
          <h2 className="text-text-primary text-lg font-semibold">Constraint Map</h2>
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
          {constraintMap.projectContext && (
            <div className="mb-8">
              <h3 className="text-text-secondary mb-2 text-sm font-semibold uppercase">
                Project Context
              </h3>
              <p className="text-text-primary text-lg font-medium">
                {constraintMap.projectContext}
              </p>
            </div>
          )}

          {constraintMap.constraints.length > 0 && (
            <div className="mb-8">
              <h3 className="text-text-secondary mb-4 text-sm font-semibold uppercase">
                Constraints
              </h3>
              <div className="space-y-3">
                {constraintMap.constraints.map((c) => {
                  const colors = CATEGORY_COLORS[c.category] || CATEGORY_COLORS.technical;
                  return (
                    <div key={c.id} className="border-border-light rounded-lg border p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors.badge} ${colors.text}`}
                        >
                          {c.category}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${c.severity === 'hard' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}
                        >
                          {c.severity}
                        </span>
                      </div>
                      <p className="text-text-primary font-medium">{c.constraint}</p>
                      {c.source && (
                        <p className="text-text-tertiary mt-1 text-sm">Source: {c.source}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {constraintMap.designImplications.length > 0 && (
            <div className="mb-8">
              <h3 className="text-text-secondary mb-4 text-sm font-semibold uppercase">
                Design Implications
              </h3>
              <div className="space-y-4">
                {constraintMap.designImplications.map((di) => (
                  <div key={di.id} className="border-border-light rounded-lg border p-4">
                    <p className="text-text-primary mb-2 font-medium">{di.implication}</p>
                    <div className="rounded-lg bg-blue-50 p-3">
                      <span className="text-sm font-medium text-blue-700">Design response: </span>
                      <span className="text-sm text-blue-700">{di.designResponse}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {constraintMap.opportunities.length > 0 && (
            <div className="mb-8">
              <h3 className="text-text-secondary mb-3 text-sm font-semibold uppercase">
                Opportunities
              </h3>
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <ul className="space-y-2">
                  {constraintMap.opportunities.map((opp, i) => (
                    <li key={i} className="flex items-start gap-2 text-green-800">
                      <span className="text-green-600">+</span>
                      {opp}
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
