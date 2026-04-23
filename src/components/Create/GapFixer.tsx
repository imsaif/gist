'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { GistDesignFile, ProductOverview } from '@/types/file';
import { Gap } from '@/types/audit';
import {
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ArrowDownTrayIcon,
  DocumentDuplicateIcon,
  ShieldExclamationIcon,
  MapPinIcon,
  SparklesIcon,
  NoSymbolIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';

interface GapFixerProps {
  gaps: Gap[];
  file: GistDesignFile;
  initialFile: GistDesignFile | null;
  onProductFieldChange: (field: keyof ProductOverview, value: string) => void;
  onPositioningFieldChange: (field: 'category' | 'forWho' | 'notForWho', value: string) => void;
  onContextFieldChange: (field: 'pricing' | 'stage', value: string) => void;
  onDownload: () => void;
  onCopyMarkdown: () => void;
  onBackToAudit?: () => void;
}

// Each conflict category maps to a question and the fields the answer populates
const gapQuestions: Record<
  string,
  {
    question: string;
    placeholder: string;
    fields: { key: string; sectionKey: string }[];
  }
> = {
  contradiction: {
    question:
      'LLMs are contradicting each other about your product. Which description is correct, and what should they both say?',
    placeholder:
      'e.g. "We ARE a SaaS with subscription pricing starting at $19/mo. We are NOT open source or free. The correct description is..."',
    fields: [
      { key: 'description', sectionKey: 'product' },
      { key: 'category', sectionKey: 'positioning' },
    ],
  },
  fabrication: {
    question:
      "An LLM is claiming your product has features that don't exist. What does your product actually do?",
    placeholder:
      'e.g. "We do NOT have a Slack integration. Our integrations are GitHub and Linear only. The core product does..."',
    fields: [
      { key: 'description', sectionKey: 'product' },
      { key: 'name', sectionKey: 'product' },
    ],
  },
  category_conflict: {
    question:
      "LLMs can't agree on what type of product you are. What category does your product belong to?",
    placeholder:
      'e.g. "We are a developer tool, specifically a CLI for database migrations. Not a design tool, not a project management tool."',
    fields: [
      { key: 'category', sectionKey: 'positioning' },
      { key: 'forWho', sectionKey: 'positioning' },
    ],
  },
  shared_inaccuracy: {
    question:
      "Both LLMs agree on something that's actually wrong about your product. What's the correct information?",
    placeholder:
      'e.g. "We don\'t support Python. We are JavaScript/TypeScript only. Both models got this wrong because..."',
    fields: [
      { key: 'description', sectionKey: 'product' },
      { key: 'audience', sectionKey: 'product' },
    ],
  },
  audience_mismatch: {
    question:
      'LLMs disagree on who your product is for. Who is your actual target audience, and who is it NOT for?',
    placeholder:
      'e.g. "We\'re built for solo founders and teams under 10. NOT for enterprises. Think indie hackers, not Fortune 500."',
    fields: [
      { key: 'forWho', sectionKey: 'positioning' },
      { key: 'notForWho', sectionKey: 'positioning' },
    ],
  },
  missing_differentiator: {
    question:
      'Both LLMs describe your product generically — their descriptions could apply to any competitor. What makes your product different?',
    placeholder:
      'e.g. "Unlike Trello, we auto-prioritize tasks using deadlines and dependencies. No manual dragging — the board organizes itself."',
    fields: [
      { key: 'description', sectionKey: 'product' },
      { key: 'category', sectionKey: 'positioning' },
    ],
  },
  pricing_confusion: {
    question: "LLMs are guessing or getting your pricing wrong. What's the actual pricing model?",
    placeholder:
      'e.g. "Free for up to 3 users. Pro plan is $12/user/month. No enterprise tier — we don\'t do annual contracts."',
    fields: [
      { key: 'pricing', sectionKey: 'context' },
      { key: 'description', sectionKey: 'product' },
    ],
  },
};

const severityConfig: Record<
  string,
  { icon: typeof ExclamationTriangleIcon; color: string; bg: string; badge: string }
> = {
  critical: {
    icon: ExclamationTriangleIcon,
    color: 'text-red-400',
    bg: 'border-red-500/30 bg-red-500/5',
    badge: 'bg-red-500/20 text-red-400',
  },
  high: {
    icon: ExclamationCircleIcon,
    color: 'text-amber-400',
    bg: 'border-amber-500/30 bg-amber-500/5',
    badge: 'bg-amber-500/20 text-amber-400',
  },
  medium: {
    icon: InformationCircleIcon,
    color: 'text-blue-400',
    bg: 'border-blue-500/30 bg-blue-500/5',
    badge: 'bg-blue-500/20 text-blue-400',
  },
};

const categoryMeta: Record<string, { label: string; icon: typeof ShieldExclamationIcon }> = {
  contradiction: { label: 'Contradiction', icon: ShieldExclamationIcon },
  fabrication: { label: 'Fabrication', icon: SparklesIcon },
  category_conflict: { label: 'Category conflict', icon: MapPinIcon },
  shared_inaccuracy: { label: 'Shared inaccuracy', icon: NoSymbolIcon },
  audience_mismatch: { label: 'Audience mismatch', icon: ExclamationCircleIcon },
  missing_differentiator: { label: 'No differentiator', icon: InformationCircleIcon },
  pricing_confusion: { label: 'Pricing confusion', icon: ExclamationTriangleIcon },
};

function getFieldValue(file: GistDesignFile, sectionKey: string, fieldKey: string): string | null {
  if (sectionKey === 'product')
    return (file.product as unknown as Record<string, string | null>)[fieldKey] ?? null;
  if (sectionKey === 'positioning')
    return (file.positioning as unknown as Record<string, string | null>)[fieldKey] ?? null;
  if (sectionKey === 'context')
    return (file.context as unknown as Record<string, string | null>)[fieldKey] ?? null;
  return null;
}

export function GapFixer({
  gaps,
  file,
  onProductFieldChange,
  onPositioningFieldChange,
  onContextFieldChange,
  onDownload,
  onCopyMarkdown,
  onBackToAudit,
}: GapFixerProps) {
  const severityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2 };
  const sortedGaps = [...gaps].sort(
    (a, b) => (severityOrder[a.severity] ?? 3) - (severityOrder[b.severity] ?? 3)
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [skippedIds, setSkippedIds] = useState<Set<string>>(new Set());
  const [showDone, setShowDone] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const addressedCount = Object.keys(answers).length;
  const totalCount = sortedGaps.length;

  const currentGap = sortedGaps[currentIndex];
  const isCurrentAnswered = currentGap ? !!answers[currentGap.id] : false;

  useEffect(() => {
    if (textareaRef.current && !isCurrentAnswered) {
      textareaRef.current.focus();
    }
  }, [currentIndex, isCurrentAnswered]);

  function handleSubmitAnswer(gapId: string, answer: string) {
    if (!answer.trim()) return;

    const gap = sortedGaps.find((g) => g.id === gapId);
    if (!gap) return;

    const questionConfig = gapQuestions[gap.category];
    if (!questionConfig) return;

    const newAnswers = { ...answers, [gapId]: answer.trim() };
    setAnswers(newAnswers);

    const primaryField = questionConfig.fields[0];
    if (primaryField) {
      if (primaryField.sectionKey === 'product') {
        onProductFieldChange(primaryField.key as keyof ProductOverview, answer.trim());
      } else if (primaryField.sectionKey === 'positioning') {
        onPositioningFieldChange(
          primaryField.key as 'category' | 'forWho' | 'notForWho',
          answer.trim()
        );
      } else if (primaryField.sectionKey === 'context') {
        onContextFieldChange(primaryField.key as 'pricing' | 'stage', answer.trim());
      }
    }

    // Check if all done after this answer
    if (Object.keys(newAnswers).length + skippedIds.size >= totalCount) {
      setShowDone(true);
      return;
    }

    goToNext();
  }

  function goToNext() {
    for (let i = currentIndex + 1; i < sortedGaps.length; i++) {
      if (!skippedIds.has(sortedGaps[i].id) && !answers[sortedGaps[i].id]) {
        setCurrentIndex(i);
        return;
      }
    }
    if (currentIndex < sortedGaps.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }

  function handleSkip() {
    const newSkipped = new Set(skippedIds).add(currentGap.id);
    setSkippedIds(newSkipped);

    // Check if all done after skip
    if (Object.keys(answers).length + newSkipped.size >= totalCount) {
      setShowDone(true);
      return;
    }
    goToNext();
  }

  // Done view — full width
  if (showDone) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-8">
        <CheckCircleIcon className="mb-4 h-10 w-10 text-green-400" />
        <h2 className="text-ink-primary mb-2 text-xl font-semibold">Your file is ready</h2>
        <p className="text-ink-secondary mb-8 max-w-lg text-sm leading-relaxed">
          Download your{' '}
          <code className="text-ink-primary bg-background-tertiary rounded px-1.5 py-0.5 font-mono text-xs">
            .gist.design
          </code>{' '}
          file and drop it in your project root. AI coding tools will read it automatically.
        </p>

        <div className="mb-4 flex gap-3">
          <button
            onClick={onDownload}
            className="bg-brand-primary hover:bg-brand-hover flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-white transition-colors"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            Download file
          </button>
          <button
            onClick={onCopyMarkdown}
            className="border-border-primary text-ink-secondary hover:bg-background-secondary flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-medium transition-colors"
          >
            <DocumentDuplicateIcon className="h-4 w-4" />
            Copy to clipboard
          </button>
        </div>
        <button
          onClick={() => setShowDone(false)}
          className="text-ink-tertiary hover:text-ink-primary mb-10 flex items-center gap-1 text-sm transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-3.5 w-3.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Edit answers
        </button>

        <div className="mb-8">
          <h3 className="text-ink-primary mb-4 text-sm font-semibold">What this fixes for LLMs</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="border-border-primary rounded-xl border p-4">
              <p className="text-ink-primary mb-1 text-sm font-medium">Resolves contradictions</p>
              <p className="text-ink-tertiary text-xs leading-relaxed">
                LLMs will give consistent, accurate descriptions instead of contradicting each other
                about what your product does
              </p>
            </div>
            <div className="border-border-primary rounded-xl border p-4">
              <p className="text-ink-primary mb-1 text-sm font-medium">Prevents fabrication</p>
              <p className="text-ink-tertiary text-xs leading-relaxed">
                Clear feature boundaries mean LLMs won&apos;t invent capabilities that don&apos;t
                exist
              </p>
            </div>
            <div className="border-border-primary rounded-xl border p-4">
              <p className="text-ink-primary mb-1 text-sm font-medium">Clarifies your category</p>
              <p className="text-ink-tertiary text-xs leading-relaxed">
                LLMs will agree on what type of product you are instead of placing you in different
                categories
              </p>
            </div>
            <div className="border-border-primary rounded-xl border p-4">
              <p className="text-ink-primary mb-1 text-sm font-medium">Corrects shared errors</p>
              <p className="text-ink-tertiary text-xs leading-relaxed">
                When both LLMs get the same thing wrong, the file sets the record straight
              </p>
            </div>
          </div>
        </div>

        <div className="border-border-primary rounded-xl border p-6">
          <h3 className="text-ink-primary mb-4 text-sm font-semibold">How to use your file</h3>
          <ol className="space-y-4 text-sm">
            <li className="flex gap-3">
              <span className="bg-background-tertiary text-ink-secondary flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                1
              </span>
              <div>
                <p className="text-ink-primary font-medium">Place in your project root</p>
                <p className="text-ink-tertiary mt-0.5">
                  Save as{' '}
                  <code className="bg-background-tertiary rounded px-1 py-0.5 font-mono text-xs">
                    your-product.gist.design
                  </code>{' '}
                  next to your{' '}
                  <code className="bg-background-tertiary rounded px-1 py-0.5 font-mono text-xs">
                    package.json
                  </code>{' '}
                  or{' '}
                  <code className="bg-background-tertiary rounded px-1 py-0.5 font-mono text-xs">
                    README.md
                  </code>
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="bg-background-tertiary text-ink-secondary flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                2
              </span>
              <div>
                <p className="text-ink-primary font-medium">AI tools read it automatically</p>
                <p className="text-ink-tertiary mt-0.5">
                  Claude Code, Cursor, Copilot, and ChatGPT will pick it up when working in your
                  repo — no configuration needed
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="bg-background-tertiary text-ink-secondary flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                3
              </span>
              <div>
                <p className="text-ink-primary font-medium">Run the audit again to verify</p>
                <p className="text-ink-tertiary mt-0.5">
                  After deploying,{' '}
                  <Link
                    href="/"
                    className="text-brand-primary hover:text-brand-hover transition-colors"
                  >
                    run another audit
                  </Link>{' '}
                  to see if LLMs now describe your product correctly
                </p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    );
  }

  // Two-column layout: Q&A left, checklist right
  return (
    <div className="mx-auto flex max-w-6xl gap-10 px-6 py-8">
      {/* Left — Q&A */}
      <div className="min-w-0 flex-1">
        {/* Back to audit */}
        {onBackToAudit && (
          <button
            onClick={onBackToAudit}
            className="text-ink-tertiary hover:text-ink-primary mb-6 flex items-center gap-1.5 text-sm transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-3.5 w-3.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            Back to audit results
          </button>
        )}
        {/* Progress bar */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-ink-secondary text-sm font-medium">
              {addressedCount} of {totalCount} gaps addressed
            </span>
          </div>
          <div className="flex gap-1">
            {sortedGaps.map((gap, i) => {
              const answered = !!answers[gap.id];
              const skipped = skippedIds.has(gap.id);
              const isCurrent = i === currentIndex;
              return (
                <button
                  key={gap.id}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 flex-1 rounded-full transition-all ${
                    answered
                      ? 'bg-green-500'
                      : skipped
                        ? 'bg-background-tertiary'
                        : isCurrent
                          ? 'bg-brand-primary'
                          : 'bg-background-tertiary'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {currentGap && (
          <GapStep
            key={currentGap.id}
            gap={currentGap}
            file={file}
            isAnswered={isCurrentAnswered}
            answer={answers[currentGap.id] || ''}
            onSubmit={(answer) => handleSubmitAnswer(currentGap.id, answer)}
            onSkip={handleSkip}
            onNext={goToNext}
            onPrev={currentIndex > 0 ? () => setCurrentIndex(currentIndex - 1) : undefined}
            stepNumber={currentIndex + 1}
            totalSteps={totalCount}
            textareaRef={textareaRef}
          />
        )}
      </div>

      {/* Right — Gap checklist */}
      <div className="hidden w-72 shrink-0 lg:block">
        <div className="sticky top-8">
          <p className="text-ink-tertiary mb-4 text-xs font-medium tracking-wide uppercase">
            Gaps to fix
          </p>
          <div className="space-y-1">
            {sortedGaps.map((gap, i) => {
              const answered = !!answers[gap.id];
              const skipped = skippedIds.has(gap.id);
              const isCurrent = i === currentIndex;
              const meta = categoryMeta[gap.category] || {
                label: gap.category,
                icon: InformationCircleIcon,
              };
              const CategoryIcon = meta.icon;
              const config = severityConfig[gap.severity] || severityConfig.medium;

              return (
                <button
                  key={gap.id}
                  onClick={() => setCurrentIndex(i)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all ${
                    isCurrent && !answered
                      ? 'bg-background-secondary'
                      : 'hover:bg-background-secondary/50'
                  }`}
                >
                  {/* Status icon */}
                  {answered ? (
                    <CheckCircleSolidIcon className="h-5 w-5 shrink-0 text-green-500" />
                  ) : skipped ? (
                    <div className="bg-background-tertiary flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
                      <span className="text-ink-tertiary text-[10px]">—</span>
                    </div>
                  ) : (
                    <CategoryIcon
                      className={`h-5 w-5 shrink-0 ${
                        isCurrent ? config.color : 'text-ink-tertiary'
                      }`}
                    />
                  )}

                  {/* Label + severity */}
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-sm ${
                        answered
                          ? 'text-ink-tertiary line-through'
                          : isCurrent
                            ? 'text-ink-primary font-medium'
                            : 'text-ink-secondary'
                      }`}
                    >
                      {meta.label}
                    </p>
                  </div>

                  {/* Severity dot */}
                  {!answered && !skipped && (
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${
                        gap.severity === 'critical'
                          ? 'bg-red-400'
                          : gap.severity === 'high'
                            ? 'bg-amber-400'
                            : 'bg-blue-400'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Summary */}
          <div className="border-border-primary mt-6 border-t pt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-ink-tertiary">{addressedCount} addressed</span>
              {skippedIds.size > 0 && (
                <span className="text-ink-tertiary">{skippedIds.size} skipped</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Individual gap step
function GapStep({
  gap,
  file,
  isAnswered,
  answer,
  onSubmit,
  onSkip,
  onNext,
  onPrev,
  stepNumber,
  totalSteps,
  textareaRef,
}: {
  gap: Gap;
  file: GistDesignFile;
  isAnswered: boolean;
  answer: string;
  onSubmit: (answer: string) => void;
  onSkip: () => void;
  onNext: () => void;
  onPrev?: () => void;
  stepNumber: number;
  totalSteps: number;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}) {
  const [inputValue, setInputValue] = useState(answer);
  const config = severityConfig[gap.severity] || severityConfig.medium;
  const Icon = isAnswered ? CheckCircleIcon : config.icon;
  const questionConfig = gapQuestions[gap.category];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onSubmit(inputValue);
    }
  };

  const currentValues = questionConfig?.fields
    .map((f) => {
      const val = getFieldValue(file, f.sectionKey, f.key);
      return val ? `${f.key}: "${val}"` : null;
    })
    .filter(Boolean);

  return (
    <div className="flex-1">
      <p className="text-ink-tertiary mb-6 text-xs font-medium tracking-wide uppercase">
        Gap {stepNumber} of {totalSteps}
      </p>

      {/* Gap description */}
      <div
        className={`mb-8 rounded-xl border p-5 transition-all ${
          isAnswered ? 'border-green-500/30 bg-green-500/5' : config.bg
        }`}
      >
        <div className="flex items-start gap-3">
          <Icon
            className={`mt-0.5 h-5 w-5 shrink-0 ${isAnswered ? 'text-green-400' : config.color}`}
          />
          <div>
            <span
              className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase ${
                isAnswered ? 'bg-green-500/20 text-green-400' : config.badge
              }`}
            >
              {isAnswered ? 'Addressed' : gap.severity}
            </span>
            <p className="text-ink-primary mt-2 text-sm leading-relaxed">{gap.description}</p>
            {currentValues && currentValues.length > 0 && !isAnswered && (
              <p className="text-ink-tertiary mt-2 text-xs">
                LLMs currently think: {currentValues.join(', ')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Question + answer */}
      {isAnswered ? (
        <div className="mb-8">
          <p className="text-ink-secondary mb-3 text-sm font-medium">Your answer:</p>
          <div className="border-border-primary bg-background-tertiary rounded-xl border p-4">
            <p className="text-ink-primary text-sm leading-relaxed">{answer}</p>
          </div>
        </div>
      ) : (
        questionConfig && (
          <div className="mb-8">
            <p className="text-ink-primary mb-4 text-base leading-relaxed font-medium">
              {questionConfig.question}
            </p>
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={questionConfig.placeholder}
              rows={4}
              className="border-border-primary focus:border-brand-primary bg-background-tertiary text-ink-primary placeholder:text-ink-tertiary/50 w-full resize-none rounded-xl border px-4 py-3 text-sm leading-relaxed transition-colors outline-none"
            />
            <p className="text-ink-tertiary mt-2 text-xs">
              Press{' '}
              <kbd className="bg-background-secondary rounded px-1.5 py-0.5 font-mono text-[11px]">
                Cmd+Enter
              </kbd>{' '}
              to submit
            </p>
          </div>
        )
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        {onPrev && (
          <button
            onClick={onPrev}
            className="text-ink-tertiary hover:text-ink-primary flex items-center gap-1 text-sm transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-3.5 w-3.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            Back
          </button>
        )}
        {isAnswered ? (
          <button
            onClick={onNext}
            className="bg-brand-primary hover:bg-brand-hover rounded-xl px-6 py-3 text-sm font-medium text-white transition-colors"
          >
            Next gap
          </button>
        ) : (
          <>
            <button
              onClick={() => onSubmit(inputValue)}
              disabled={!inputValue.trim()}
              className="bg-brand-primary hover:bg-brand-hover disabled:bg-background-tertiary disabled:text-ink-tertiary rounded-xl px-6 py-3 text-sm font-medium text-white transition-colors"
            >
              Submit
            </button>
            <button
              onClick={onSkip}
              className="text-ink-tertiary hover:text-ink-secondary text-sm transition-colors"
            >
              Skip
            </button>
          </>
        )}
      </div>
    </div>
  );
}
