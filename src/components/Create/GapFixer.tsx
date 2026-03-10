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
  ArrowLeftIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';

interface GapFixerProps {
  gaps: Gap[];
  file: GistDesignFile;
  initialFile: GistDesignFile | null;
  onProductFieldChange: (field: keyof ProductOverview, value: string) => void;
  onPositioningFieldChange: (field: 'category' | 'forWho' | 'notForWho', value: string) => void;
  onContextFieldChange: (field: 'pricing' | 'stage', value: string) => void;
  onDownload: () => void;
  onCopyMarkdown: () => void;
}

// Each gap category maps to a question and the fields the answer populates
const gapQuestions: Record<
  string,
  {
    question: string;
    placeholder: string;
    fields: { key: string; sectionKey: string }[];
  }
> = {
  competitor_blending: {
    question:
      'LLMs are confusing your product with competitors. What category does your product actually belong to, and what is it NOT?',
    placeholder:
      'e.g. "We\'re a design handoff tool, not a project management tool. We\'re not Asana or Trello — closer to Zeplin but focused on developer specs."',
    fields: [
      { key: 'category', sectionKey: 'positioning' },
      { key: 'notForWho', sectionKey: 'positioning' },
    ],
  },
  positioning_drift: {
    question:
      'LLMs are placing your product in the wrong category. What does your product actually do, and who is it for?',
    placeholder:
      'e.g. "We\'re a browser-based IDE for data scientists, not a general code editor. Built for people who think in notebooks, not files."',
    fields: [
      { key: 'category', sectionKey: 'positioning' },
      { key: 'forWho', sectionKey: 'positioning' },
    ],
  },
  fabrication: {
    question:
      "LLMs are making up features that don't exist. In one or two sentences, what does your product actually do?",
    placeholder:
      'e.g. "We do automated accessibility testing for web apps. We don\'t do performance monitoring, analytics, or SEO — just accessibility."',
    fields: [
      { key: 'name', sectionKey: 'product' },
      { key: 'description', sectionKey: 'product' },
    ],
  },
  invisible_mechanics: {
    question:
      'LLMs can describe what your product IS but not HOW it works. Walk me through the core mechanic — what happens when someone uses it?',
    placeholder:
      'e.g. "You paste a URL, we crawl it, run 50+ WCAG checks, and give you a prioritized fix list with code snippets. Takes about 30 seconds."',
    fields: [
      { key: 'description', sectionKey: 'product' },
      { key: 'aiApproach', sectionKey: 'product' },
    ],
  },
  missing_decisions: {
    question:
      "LLMs describe your product generically — like marketing copy. What's the one design decision that makes you different from obvious alternatives?",
    placeholder:
      'e.g. "We chose real-time collaboration over version control because our users are non-technical and the merge conflict model breaks their mental model."',
    fields: [
      { key: 'aiApproach', sectionKey: 'product' },
      { key: 'description', sectionKey: 'product' },
    ],
  },
  missing_boundaries: {
    question:
      "LLMs don't know what your product is NOT for. Who should NOT use your product, and what should they use instead?",
    placeholder:
      'e.g. "Not for enterprise teams with 100+ users — we\'re built for small teams of 2-10. Large teams should look at Figma or Abstract."',
    fields: [
      { key: 'notForWho', sectionKey: 'positioning' },
      { key: 'audience', sectionKey: 'product' },
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
}: GapFixerProps) {
  const severityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2 };
  const sortedGaps = [...gaps].sort(
    (a, b) => (severityOrder[a.severity] ?? 3) - (severityOrder[b.severity] ?? 3)
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [skippedIds, setSkippedIds] = useState<Set<string>>(new Set());
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const addressedCount = Object.keys(answers).length;
  const totalCount = sortedGaps.length;
  const allDone = addressedCount + skippedIds.size >= totalCount;

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

    setAnswers((prev) => ({ ...prev, [gapId]: answer.trim() }));

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
    setSkippedIds((prev) => new Set(prev).add(currentGap.id));
    goToNext();
  }

  function handleBack() {
    window.history.back();
  }

  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col px-6 py-8">
      {/* Back + Progress */}
      <div className="mb-8">
        <div className="mb-4">
          <button
            onClick={handleBack}
            className="text-text-tertiary hover:text-text-primary flex items-center gap-1.5 text-sm transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to audit
          </button>
        </div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-text-secondary text-sm font-medium">
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
                      ? 'bg-bg-tertiary'
                      : isCurrent
                        ? 'bg-accent-primary'
                        : 'bg-bg-tertiary'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* All done — download + instructions */}
      {allDone ? (
        <div className="flex-1">
          <CheckCircleIcon className="mb-4 h-10 w-10 text-green-400" />
          <h2 className="text-text-primary mb-2 text-xl font-semibold">Your file is ready</h2>
          <p className="text-text-secondary mb-8 max-w-lg text-sm leading-relaxed">
            Download your{' '}
            <code className="text-text-primary bg-bg-tertiary rounded px-1.5 py-0.5 font-mono text-xs">
              .gist.design
            </code>{' '}
            file and drop it in your project root. AI coding tools will read it automatically.
          </p>

          {/* Download actions */}
          <div className="mb-10 flex gap-3">
            <button
              onClick={onDownload}
              className="bg-accent-primary hover:bg-accent-hover flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-white transition-colors"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              Download file
            </button>
            <button
              onClick={onCopyMarkdown}
              className="border-border-light text-text-secondary hover:bg-bg-secondary flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-medium transition-colors"
            >
              <DocumentDuplicateIcon className="h-4 w-4" />
              Copy to clipboard
            </button>
          </div>

          {/* What this fixes for LLMs */}
          <div className="mb-8">
            <h3 className="text-text-primary mb-4 text-sm font-semibold">
              What this fixes for LLMs
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="border-border-light rounded-xl border p-4">
                <p className="text-text-primary mb-1 text-sm font-medium">
                  Stops competitor blending
                </p>
                <p className="text-text-tertiary text-xs leading-relaxed">
                  LLMs will know exactly what category you belong to and stop confusing you with
                  similar products
                </p>
              </div>
              <div className="border-border-light rounded-xl border p-4">
                <p className="text-text-primary mb-1 text-sm font-medium">
                  Prevents feature fabrication
                </p>
                <p className="text-text-tertiary text-xs leading-relaxed">
                  Clear boundaries mean LLMs won&apos;t invent capabilities that don&apos;t exist
                  when recommending your product
                </p>
              </div>
              <div className="border-border-light rounded-xl border p-4">
                <p className="text-text-primary mb-1 text-sm font-medium">
                  Improves code generation
                </p>
                <p className="text-text-tertiary text-xs leading-relaxed">
                  AI coding tools will understand your intent and design decisions, building what
                  you actually want
                </p>
              </div>
              <div className="border-border-light rounded-xl border p-4">
                <p className="text-text-primary mb-1 text-sm font-medium">
                  Accurate recommendations
                </p>
                <p className="text-text-tertiary text-xs leading-relaxed">
                  When users ask LLMs for tool suggestions, your product gets recommended to the
                  right people for the right reasons
                </p>
              </div>
            </div>
          </div>

          {/* Setup instructions */}
          <div className="border-border-light rounded-xl border p-6">
            <h3 className="text-text-primary mb-4 text-sm font-semibold">How to use your file</h3>
            <ol className="space-y-4 text-sm">
              <li className="flex gap-3">
                <span className="bg-bg-tertiary text-text-secondary flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                  1
                </span>
                <div>
                  <p className="text-text-primary font-medium">Place in your project root</p>
                  <p className="text-text-tertiary mt-0.5">
                    Save as{' '}
                    <code className="bg-bg-tertiary rounded px-1 py-0.5 font-mono text-xs">
                      your-product.gist.design
                    </code>{' '}
                    next to your{' '}
                    <code className="bg-bg-tertiary rounded px-1 py-0.5 font-mono text-xs">
                      package.json
                    </code>{' '}
                    or{' '}
                    <code className="bg-bg-tertiary rounded px-1 py-0.5 font-mono text-xs">
                      README.md
                    </code>
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="bg-bg-tertiary text-text-secondary flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                  2
                </span>
                <div>
                  <p className="text-text-primary font-medium">AI tools read it automatically</p>
                  <p className="text-text-tertiary mt-0.5">
                    Claude Code, Cursor, Copilot, and ChatGPT will pick it up when working in your
                    repo — no configuration needed
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="bg-bg-tertiary text-text-secondary flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                  3
                </span>
                <div>
                  <p className="text-text-primary font-medium">Run the audit again to verify</p>
                  <p className="text-text-tertiary mt-0.5">
                    After deploying,{' '}
                    <Link
                      href="/"
                      className="text-accent-primary hover:text-accent-hover transition-colors"
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
      ) : currentGap ? (
        <GapStep
          key={currentGap.id}
          gap={currentGap}
          file={file}
          isAnswered={isCurrentAnswered}
          answer={answers[currentGap.id] || ''}
          onSubmit={(answer) => handleSubmitAnswer(currentGap.id, answer)}
          onSkip={handleSkip}
          onNext={goToNext}
          stepNumber={currentIndex + 1}
          totalSteps={totalCount}
          textareaRef={textareaRef}
        />
      ) : null}
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
      <p className="text-text-tertiary mb-6 text-xs font-medium tracking-wide uppercase">
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
            <p className="text-text-primary mt-2 text-sm leading-relaxed">{gap.description}</p>
            {currentValues && currentValues.length > 0 && !isAnswered && (
              <p className="text-text-tertiary mt-2 text-xs">
                LLMs currently think: {currentValues.join(', ')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Question + answer */}
      {isAnswered ? (
        <div className="mb-8">
          <p className="text-text-secondary mb-3 text-sm font-medium">Your answer:</p>
          <div className="border-border-light bg-bg-tertiary rounded-xl border p-4">
            <p className="text-text-primary text-sm leading-relaxed">{answer}</p>
          </div>
        </div>
      ) : (
        questionConfig && (
          <div className="mb-8">
            <p className="text-text-primary mb-4 text-base leading-relaxed font-medium">
              {questionConfig.question}
            </p>
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={questionConfig.placeholder}
              rows={4}
              className="border-border-light focus:border-accent-primary bg-bg-tertiary text-text-primary placeholder:text-text-tertiary/50 w-full resize-none rounded-xl border px-4 py-3 text-sm leading-relaxed transition-colors outline-none"
            />
            <p className="text-text-tertiary mt-2 text-xs">
              Press{' '}
              <kbd className="bg-bg-secondary rounded px-1.5 py-0.5 font-mono text-[11px]">
                Cmd+Enter
              </kbd>{' '}
              to submit
            </p>
          </div>
        )
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        {isAnswered ? (
          <button
            onClick={onNext}
            className="bg-accent-primary hover:bg-accent-hover rounded-xl px-6 py-3 text-sm font-medium text-white transition-colors"
          >
            Next gap
          </button>
        ) : (
          <>
            <button
              onClick={() => onSubmit(inputValue)}
              disabled={!inputValue.trim()}
              className="bg-accent-primary hover:bg-accent-hover disabled:bg-bg-tertiary disabled:text-text-tertiary rounded-xl px-6 py-3 text-sm font-medium text-white transition-colors"
            >
              Submit
            </button>
            <button
              onClick={onSkip}
              className="text-text-tertiary hover:text-text-secondary text-sm transition-colors"
            >
              Skip
            </button>
          </>
        )}
      </div>
    </div>
  );
}
