'use client';

import { GistDesignFile } from '@/types/file';

interface ExportPanelProps {
  file: GistDesignFile;
  onDownload: () => void;
  onCopyMarkdown: () => void;
  onCopyBrief: () => void;
}

export function ExportPanel({ file, onDownload, onCopyMarkdown, onCopyBrief }: ExportPanelProps) {
  const featureCount = file.features.length;
  const decisionCount = file.features.reduce((sum, f) => sum + f.designDecisions.length, 0);
  const patternCount = file.features.reduce((sum, f) => sum + f.patternsUsed.length, 0);

  return (
    <div className="mb-6">
      <h2 className="text-text-secondary mb-3 text-sm font-semibold tracking-wide uppercase">
        Export
      </h2>

      {/* Stats */}
      <div className="border-border-light mb-4 grid grid-cols-3 gap-3 rounded-xl border bg-white p-4 shadow-sm">
        <div className="text-center">
          <div className="text-text-primary text-lg font-semibold">{featureCount}</div>
          <div className="text-text-tertiary text-xs">Features</div>
        </div>
        <div className="text-center">
          <div className="text-text-primary text-lg font-semibold">{decisionCount}</div>
          <div className="text-text-tertiary text-xs">Decisions</div>
        </div>
        <div className="text-center">
          <div className="text-text-primary text-lg font-semibold">{patternCount}</div>
          <div className="text-text-tertiary text-xs">Patterns</div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-y-2">
        <button
          onClick={onDownload}
          disabled={featureCount === 0}
          className="bg-accent-primary hover:bg-accent-hover disabled:bg-bg-tertiary disabled:text-text-tertiary flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white transition-colors"
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
          Download .gist.design
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onCopyMarkdown}
            disabled={featureCount === 0}
            className="border-border-light text-text-secondary hover:bg-bg-secondary disabled:text-text-tertiary flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors"
          >
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
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Copy Markdown
          </button>
          <button
            onClick={onCopyBrief}
            disabled={featureCount === 0}
            className="border-border-light text-text-secondary hover:bg-bg-secondary disabled:text-text-tertiary flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors"
          >
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
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Copy Dev Brief
          </button>
        </div>
      </div>
    </div>
  );
}
