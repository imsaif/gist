'use client';

import { CritiqueIssue } from '@/types';
import { getPatternById } from '@/lib/patterns/patterns';

interface IssueCardProps {
  issue: CritiqueIssue;
  index: number;
}

const SEVERITY_STYLES = {
  critical: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-700',
    icon: 'text-red-500',
  },
  major: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-700',
    icon: 'text-amber-500',
  },
  minor: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-700',
    icon: 'text-blue-500',
  },
};

export function IssueCard({ issue, index }: IssueCardProps) {
  const styles = SEVERITY_STYLES[issue.severity];
  const pattern = issue.patternId ? getPatternById(issue.patternId) : null;

  return (
    <div className={`rounded-xl border shadow-sm ${styles.border} ${styles.bg} p-4`}>
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-text-tertiary text-xs font-medium">#{index + 1}</span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles.badge}`}>
            {issue.severity}
          </span>
          <span className="text-text-tertiary text-xs">{issue.category}</span>
        </div>
      </div>

      <h4 className="text-text-primary mb-2 font-medium">{issue.title}</h4>

      <p className="text-text-secondary mb-3 text-sm">{issue.description}</p>

      <div className="rounded-lg border border-green-100 bg-green-50/50 p-3">
        <div className="mb-1 flex items-center gap-1 text-xs font-medium text-green-700">
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
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          Suggestion
        </div>
        <p className="text-sm text-green-800">{issue.suggestion}</p>
      </div>

      {pattern && (
        <div className="mt-3">
          <a
            href={pattern.url}
            target="_blank"
            rel="noopener noreferrer"
            className="border-border-light hover:border-accent-primary inline-flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-xs transition-colors"
          >
            <span className="text-accent-primary font-medium">{pattern.name}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-text-tertiary"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}
