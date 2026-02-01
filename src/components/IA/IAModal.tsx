'use client';

import { InformationArchitecture } from '@/types';
import { generateIAMarkdown } from '@/lib/iaParser';
import { ContentTree } from './ContentTree';
import { NavigationPreview } from './NavigationPreview';

interface IAModalProps {
  ia: InformationArchitecture;
  isOpen: boolean;
  onClose: () => void;
  onCopy: () => void;
}

export function IAModal({ ia, isOpen, onClose, onCopy }: IAModalProps) {
  if (!isOpen) return null;

  const handleCopy = async () => {
    const markdown = generateIAMarkdown(ia);
    await navigator.clipboard.writeText(markdown);
    onCopy();
  };

  // Get root items (no parent)
  const rootItems = ia.contentInventory.filter((item) => !item.parent);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="border-border-light flex items-center justify-between border-b p-4">
          <h2 className="text-text-primary text-lg font-semibold">Information Architecture</h2>
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
          {/* Project Name */}
          {ia.projectName && (
            <div className="mb-8">
              <h3 className="text-text-secondary mb-2 text-sm font-semibold uppercase">Project</h3>
              <p className="text-text-primary text-2xl font-semibold">{ia.projectName}</p>
            </div>
          )}

          {/* Content Inventory */}
          {ia.contentInventory.length > 0 && (
            <div className="mb-8">
              <h3 className="text-text-secondary mb-4 text-sm font-semibold uppercase">
                Content Inventory ({ia.contentInventory.length} items)
              </h3>

              {/* Stats */}
              <div className="mb-6 flex gap-4">
                <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2">
                  <span className="text-lg font-semibold text-blue-700">
                    {ia.contentInventory.filter((i) => i.type === 'page').length}
                  </span>
                  <span className="text-sm text-blue-600">Pages</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2">
                  <span className="text-lg font-semibold text-green-700">
                    {ia.contentInventory.filter((i) => i.type === 'section').length}
                  </span>
                  <span className="text-sm text-green-600">Sections</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-purple-50 px-3 py-2">
                  <span className="text-lg font-semibold text-purple-700">
                    {ia.contentInventory.filter((i) => i.type === 'component').length}
                  </span>
                  <span className="text-sm text-purple-600">Components</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2">
                  <span className="text-lg font-semibold text-amber-700">
                    {ia.contentInventory.filter((i) => i.type === 'data').length}
                  </span>
                  <span className="text-sm text-amber-600">Data</span>
                </div>
              </div>

              {/* Tree */}
              <div className="border-border-light rounded-lg border p-4">
                <ContentTree items={rootItems} allItems={ia.contentInventory} />
              </div>
            </div>
          )}

          {/* Navigation */}
          {ia.navigation.length > 0 && (
            <div className="mb-8">
              <h3 className="text-text-secondary mb-4 text-sm font-semibold uppercase">
                Navigation Structure
              </h3>
              <div className="border-border-light bg-bg-secondary rounded-lg border p-4">
                <NavigationPreview items={ia.navigation} />
              </div>
            </div>
          )}

          {/* Open Questions */}
          {ia.openQuestions.length > 0 && (
            <div className="mb-8">
              <h3 className="text-text-secondary mb-3 text-sm font-semibold uppercase">
                Open Questions
              </h3>
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <ul className="space-y-2">
                  {ia.openQuestions.map((q, i) => (
                    <li key={i} className="flex items-start gap-2 text-amber-800">
                      <span className="text-amber-600">?</span>
                      {q}
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
