'use client';

import { Critique } from '@/types';
import { generateCritiqueMarkdown } from '@/lib/critiqueParser';
import { getPatternById } from '@/lib/patterns/patterns';

interface CritiqueModalProps {
  critique: Critique;
  isOpen: boolean;
  onClose: () => void;
  onCopy: () => void;
}

export function CritiqueModal({ critique, isOpen, onClose, onCopy }: CritiqueModalProps) {
  if (!isOpen) return null;

  const handleCopy = async () => {
    const markdown = generateCritiqueMarkdown(critique);
    await navigator.clipboard.writeText(markdown);
    onCopy();
  };

  const criticalIssues = critique.issues.filter((i) => i.severity === 'critical');
  const majorIssues = critique.issues.filter((i) => i.severity === 'major');
  const minorIssues = critique.issues.filter((i) => i.severity === 'minor');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="border-border-light flex items-center justify-between border-b p-4">
          <h2 className="text-text-primary text-lg font-semibold">Design Critique</h2>
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
          {/* Design Overview */}
          {critique.imageDescription && (
            <div className="mb-8">
              <h3 className="text-text-secondary mb-2 text-sm font-semibold uppercase">
                Design Overview
              </h3>
              <p className="text-text-primary">{critique.imageDescription}</p>
            </div>
          )}

          {/* What's Working */}
          {critique.whatsWorking.length > 0 && (
            <div className="mb-8">
              <h3 className="text-text-secondary mb-3 text-sm font-semibold uppercase">
                What&apos;s Working
              </h3>
              <ul className="space-y-2">
                {critique.whatsWorking.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-green-700">
                    <span className="mt-1 text-green-500">
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
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Issues */}
          {critique.issues.length > 0 && (
            <div className="mb-8">
              <h3 className="text-text-secondary mb-4 text-sm font-semibold uppercase">
                Issues Found
              </h3>

              {criticalIssues.length > 0 && (
                <div className="mb-6">
                  <h4 className="mb-3 font-medium text-red-700">Critical Issues</h4>
                  <div className="space-y-4">
                    {criticalIssues.map((issue) => (
                      <div
                        key={issue.id}
                        className="rounded-lg border border-red-200 bg-red-50 p-4"
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                            {issue.category}
                          </span>
                        </div>
                        <h5 className="mb-1 font-medium text-red-900">{issue.title}</h5>
                        <p className="mb-3 text-sm text-red-800">{issue.description}</p>
                        <div className="rounded bg-white/50 p-3">
                          <p className="text-sm font-medium text-green-700">
                            Suggestion: {issue.suggestion}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {majorIssues.length > 0 && (
                <div className="mb-6">
                  <h4 className="mb-3 font-medium text-amber-700">Major Issues</h4>
                  <div className="space-y-4">
                    {majorIssues.map((issue) => (
                      <div
                        key={issue.id}
                        className="rounded-lg border border-amber-200 bg-amber-50 p-4"
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                            {issue.category}
                          </span>
                        </div>
                        <h5 className="mb-1 font-medium text-amber-900">{issue.title}</h5>
                        <p className="mb-3 text-sm text-amber-800">{issue.description}</p>
                        <div className="rounded bg-white/50 p-3">
                          <p className="text-sm font-medium text-green-700">
                            Suggestion: {issue.suggestion}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {minorIssues.length > 0 && (
                <div className="mb-6">
                  <h4 className="mb-3 font-medium text-blue-700">Minor Issues</h4>
                  <div className="space-y-4">
                    {minorIssues.map((issue) => (
                      <div
                        key={issue.id}
                        className="rounded-lg border border-blue-200 bg-blue-50 p-4"
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                            {issue.category}
                          </span>
                        </div>
                        <h5 className="mb-1 font-medium text-blue-900">{issue.title}</h5>
                        <p className="mb-3 text-sm text-blue-800">{issue.description}</p>
                        <div className="rounded bg-white/50 p-3">
                          <p className="text-sm font-medium text-green-700">
                            Suggestion: {issue.suggestion}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Patterns */}
          {critique.patterns.length > 0 && (
            <div className="mb-8">
              <h3 className="text-text-secondary mb-3 text-sm font-semibold uppercase">
                Relevant Patterns
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {critique.patterns.map((p) => {
                  const pattern = getPatternById(p.patternId);
                  if (!pattern) return null;
                  return (
                    <a
                      key={p.patternId}
                      href={pattern.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-border-light hover:border-accent-primary rounded-lg border bg-white p-4 transition-colors"
                    >
                      <div className="text-accent-primary mb-1 font-medium">{pattern.name}</div>
                      <div className="text-text-tertiary text-sm">{p.reason}</div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Priority Fixes */}
          {critique.priorityFixes.length > 0 && (
            <div className="mb-8">
              <h3 className="text-text-secondary mb-3 text-sm font-semibold uppercase">
                Priority Fixes
              </h3>
              <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                <ol className="list-inside list-decimal space-y-2">
                  {critique.priorityFixes.map((fix, i) => (
                    <li key={i} className="text-purple-800">
                      {fix}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
