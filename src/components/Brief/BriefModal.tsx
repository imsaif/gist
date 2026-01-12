'use client';

import { Brief } from '@/types';
import { useEffect, useRef } from 'react';

interface BriefModalProps {
  brief: Brief;
  isOpen: boolean;
  onClose: () => void;
  onCopy?: () => void;
}

export function BriefModal({ brief, isOpen, onClose, onCopy }: BriefModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const generateMarkdown = (): string => {
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
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generateMarkdown());
    onCopy?.();
  };

  const downloadMarkdown = () => {
    const blob = new Blob([generateMarkdown()], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `design-brief-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="border-border-light flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-text-primary text-lg font-semibold">Design Brief</h2>
            <p className="text-text-secondary text-sm">Ready to export to Figma</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyToClipboard}
              className="border-border-light text-text-secondary hover:bg-bg-secondary rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors"
            >
              Copy
            </button>
            <button
              onClick={downloadMarkdown}
              className="bg-accent-primary hover:bg-accent-hover rounded-lg px-3 py-1.5 text-sm font-medium text-white transition-colors"
            >
              Download
            </button>
            <button
              onClick={onClose}
              className="text-text-tertiary hover:bg-bg-secondary hover:text-text-primary ml-2 rounded-lg p-1.5 transition-colors"
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
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="prose prose-sm max-w-none">
            {/* Goal */}
            {brief.goal && (
              <section className="mb-6">
                <h3 className="text-text-secondary mb-2 text-sm font-semibold tracking-wide uppercase">
                  Goal
                </h3>
                <p className="text-text-primary text-base">{brief.goal}</p>
              </section>
            )}

            {/* Context */}
            {brief.context.length > 0 && (
              <section className="mb-6">
                <h3 className="text-text-secondary mb-2 text-sm font-semibold tracking-wide uppercase">
                  Context
                </h3>
                <ul className="list-disc space-y-1 pl-5">
                  {brief.context.map((item, index) => (
                    <li key={index} className="text-text-primary text-base">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Decisions */}
            {brief.decisions.length > 0 && (
              <section className="mb-6">
                <h3 className="text-text-secondary mb-3 text-sm font-semibold tracking-wide uppercase">
                  Decisions
                </h3>
                <div className="space-y-4">
                  {brief.decisions.map((item, index) => (
                    <div
                      key={index}
                      className="border-border-light bg-bg-secondary rounded-lg border p-4"
                    >
                      <p className="text-text-primary font-medium">{item.decision}</p>
                      <p className="text-text-secondary mt-1 text-sm">{item.rationale}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Open Questions */}
            {brief.openQuestions.length > 0 && (
              <section className="mb-6">
                <h3 className="text-text-secondary mb-2 text-sm font-semibold tracking-wide uppercase">
                  Open Questions
                </h3>
                <ul className="space-y-2">
                  {brief.openQuestions.map((item, index) => (
                    <li key={index} className="text-text-primary flex items-start gap-2 text-base">
                      <span className="border-border-medium mt-0.5 h-4 w-4 rounded border" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Ready to Design */}
            {brief.readyToDesign && (
              <section>
                <h3 className="text-accent-primary mb-3 text-sm font-semibold tracking-wide uppercase">
                  Ready to Design
                </h3>
                <div className="border-accent-primary/20 bg-accent-primary/5 rounded-lg border-2 p-4">
                  <p className="text-text-primary text-base whitespace-pre-wrap">
                    {brief.readyToDesign.prompt}
                  </p>
                </div>
                {brief.readyToDesign.checklist.length > 0 && (
                  <div className="mt-4">
                    <p className="text-text-secondary mb-2 text-sm font-medium">
                      Verification Checklist
                    </p>
                    <ul className="space-y-2">
                      {brief.readyToDesign.checklist.map((item, index) => (
                        <li
                          key={index}
                          className="text-text-primary flex items-center gap-2 text-base"
                        >
                          <input
                            type="checkbox"
                            className="border-border-medium accent-accent-primary h-4 w-4 rounded"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
