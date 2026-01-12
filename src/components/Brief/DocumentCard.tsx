'use client';

import { Brief } from '@/types';

interface DocumentCardProps {
  title: string;
  lineCount: number;
  fileType?: string;
  isSelected?: boolean;
  onSelect?: (selected: boolean) => void;
  onView: () => void;
  onCopy: () => void;
  onDownload: () => void;
}

export function DocumentCard({
  title,
  lineCount,
  fileType = 'MD',
  isSelected = false,
  onSelect,
  onView,
  onCopy,
  onDownload,
}: DocumentCardProps) {
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(!isSelected);
  };

  const handleCopyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopy();
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload();
  };

  return (
    <div
      className={`group relative flex h-36 w-full flex-col rounded-xl border bg-white p-4 transition-all hover:shadow-md ${
        isSelected ? 'border-accent-primary ring-2 ring-accent-primary/20' : 'border-border-light hover:border-border-medium'
      }`}
    >
      {/* Checkbox */}
      <div className="absolute left-3 top-3">
        <button
          onClick={handleCheckboxClick}
          className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
            isSelected
              ? 'border-accent-primary bg-accent-primary text-white'
              : 'border-border-medium bg-white hover:border-accent-primary'
          }`}
        >
          {isSelected && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>
      </div>

      {/* Main clickable area */}
      <button
        onClick={onView}
        className="flex flex-1 flex-col justify-between pl-6 text-left"
      >
        {/* Title and line count */}
        <div className="min-w-0 pr-2">
          <p className="truncate text-sm font-medium leading-tight text-text-primary">
            {title}
          </p>
          <p className="mt-1 text-xs text-text-tertiary">{lineCount} lines</p>
        </div>

        {/* File Type Badge */}
        <div>
          <span className="inline-block rounded bg-bg-tertiary px-2 py-1 text-xs font-medium text-text-secondary">
            {fileType}
          </span>
        </div>
      </button>

      {/* Action buttons - visible on hover */}
      <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={handleCopyClick}
          className="flex h-7 w-7 items-center justify-center rounded-md bg-bg-secondary text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
          title="Copy to clipboard"
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
        </button>
        <button
          onClick={handleDownloadClick}
          className="flex h-7 w-7 items-center justify-center rounded-md bg-bg-secondary text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
          title="Download"
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
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Helper to create document info from brief
export function getBriefDocumentInfo(brief: Brief): {
  title: string;
  lineCount: number;
} {
  let lines = 0;
  if (brief.goal) lines += 3;
  if (brief.context.length > 0) lines += brief.context.length + 2;
  if (brief.decisions.length > 0) lines += brief.decisions.length * 3 + 2;
  if (brief.openQuestions.length > 0) lines += brief.openQuestions.length + 2;
  if (brief.readyToDesign) {
    lines += 5;
    lines += brief.readyToDesign.checklist.length + 2;
  }

  const title = brief.goal
    ? `${brief.goal.slice(0, 35)}${brief.goal.length > 35 ? '...' : ''}`
    : 'Design Brief';

  return {
    title,
    lineCount: Math.max(lines, 10),
  };
}

// Generate markdown from brief
export function generateBriefMarkdown(brief: Brief): string {
  let md = `# Design Brief${brief.goal ? `: ${brief.goal}` : ''}\n\n`;

  if (brief.goal) {
    md += `## Goal\n${brief.goal}\n\n`;
  }

  if (brief.context.length > 0) {
    md += `## Context\n`;
    brief.context.forEach((item) => {
      md += `- ${item}\n`;
    });
    md += '\n';
  }

  if (brief.decisions.length > 0) {
    md += `## Decisions\n\n`;
    brief.decisions.forEach((item) => {
      md += `### ${item.decision}\n${item.rationale}\n\n`;
    });
  }

  if (brief.openQuestions.length > 0) {
    md += `## Open Questions\n`;
    brief.openQuestions.forEach((item) => {
      md += `- [ ] ${item}\n`;
    });
    md += '\n';
  }

  if (brief.readyToDesign) {
    md += `## Ready to Design\n\n`;
    md += `### Prompt\n${brief.readyToDesign.prompt}\n\n`;
    if (brief.readyToDesign.checklist.length > 0) {
      md += `### Checklist\n`;
      brief.readyToDesign.checklist.forEach((item) => {
        md += `- [ ] ${item}\n`;
      });
    }
  }

  return md;
}
