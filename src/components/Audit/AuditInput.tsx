'use client';

import { useEffect, useRef, useState } from 'react';
import { XMarkIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export interface AuditInputValue {
  name: string;
  url: string;
  description: string;
}

interface AuditInputProps {
  onSubmit: (input: AuditInputValue) => void;
  isLoading: boolean;
  remaining?: number;
  onClose?: () => void;
}

const DESCRIPTION_LIMIT = 140;

type StepKey = 'name' | 'url' | 'description';

const STEPS: { key: StepKey; label: string; placeholder: string; helper: string }[] = [
  {
    key: 'name',
    label: "What's your product called?",
    placeholder: 'Linear',
    helper: 'The name customers know it by.',
  },
  {
    key: 'url',
    label: "What's the URL?",
    placeholder: 'https://yourproduct.com',
    helper: "We'll fetch your homepage and ask ChatGPT + Claude what they see.",
  },
  {
    key: 'description',
    label: 'Describe it in one line.',
    placeholder: 'Issue tracking built for fast-moving software teams',
    helper: 'How you would describe it to a friend.',
  },
];

export function AuditInput({ onSubmit, isLoading, remaining, onClose }: AuditInputProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [step]);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const valueFor = (k: StepKey) => (k === 'name' ? name : k === 'url' ? url : description);
  const setValueFor = (k: StepKey, v: string) => {
    if (k === 'name') setName(v);
    else if (k === 'url') setUrl(v);
    else setDescription(v);
  };

  const validateCurrent = (): { ok: true } | { ok: false; message: string } => {
    if (current.key === 'name') {
      if (!name.trim()) return { ok: false, message: 'Product name is required' };
    } else if (current.key === 'url') {
      let normalized = url.trim();
      if (!normalized) return { ok: false, message: 'URL is required' };
      if (!/^https?:\/\//i.test(normalized)) normalized = 'https://' + normalized;
      try {
        new URL(normalized);
      } catch {
        return { ok: false, message: 'Please enter a valid URL' };
      }
      if (normalized !== url) setUrl(normalized);
    } else {
      if (!description.trim()) return { ok: false, message: 'One-line description is required' };
    }
    return { ok: true };
  };

  const handleAdvance = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateCurrent();
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setError('');

    if (isLast) {
      let normalizedUrl = url.trim();
      if (!/^https?:\/\//i.test(normalizedUrl)) normalizedUrl = 'https://' + normalizedUrl;
      onSubmit({
        name: name.trim(),
        url: normalizedUrl,
        description: description.trim(),
      });
      return;
    }

    setStep(step + 1);
  };

  const goToStep = (i: number) => {
    if (i >= step || isLoading) return;
    setError('');
    setStep(i);
  };

  return (
    <form onSubmit={handleAdvance} className="card w-full max-w-xl overflow-hidden text-left">
      <div className="border-border-primary flex items-center justify-between gap-3 border-b px-5 py-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goToStep(step - 1)}
            disabled={isLoading || step === 0}
            aria-label="Back to previous step"
            className="text-ink-tertiary hover:bg-background-secondary hover:text-ink-primary -ml-1.5 inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
          </button>
          <div className="flex items-center gap-1">
            {STEPS.map((s, i) => (
              <span
                key={s.key}
                aria-hidden
                className={`h-1.5 rounded-full transition-all ${
                  i === step
                    ? 'bg-brand-primary w-6'
                    : i < step
                      ? 'bg-brand-primary/60 w-3'
                      : 'bg-border-primary w-3'
                }`}
              />
            ))}
          </div>
          <span className="text-ink-tertiary ml-1 text-xs font-medium tabular-nums">
            Step {step + 1} of {STEPS.length}
          </span>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Close audit form"
            className="text-ink-tertiary hover:bg-background-secondary hover:text-ink-primary -mr-1.5 inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <XMarkIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="px-5 py-5">
        {step > 0 && (
          <div className="mb-5 space-y-1.5">
            {STEPS.slice(0, step).map((s, i) => (
              <button
                type="button"
                key={s.key}
                onClick={() => goToStep(i)}
                disabled={isLoading}
                className="group bg-background-secondary/60 hover:bg-background-secondary border-border-primary/60 flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm transition-colors disabled:cursor-not-allowed"
              >
                <span className="text-ink-tertiary w-20 shrink-0 text-[10px] font-semibold tracking-wider uppercase">
                  {s.key}
                </span>
                <span className="text-ink-primary flex-1 truncate font-medium">
                  {valueFor(s.key)}
                </span>
                <span className="text-ink-tertiary group-hover:text-brand-primary text-xs font-medium transition-colors">
                  Edit
                </span>
              </button>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-ink-primary block text-lg font-semibold tracking-tight">
            {current.label}
          </label>
          <p className="text-ink-tertiary text-xs">{current.helper}</p>
          <div className="relative pt-2">
            <input
              ref={inputRef}
              type="text"
              value={valueFor(current.key)}
              maxLength={current.key === 'description' ? DESCRIPTION_LIMIT : undefined}
              onChange={(e) => {
                setValueFor(current.key, e.target.value);
                if (error) setError('');
              }}
              placeholder={current.placeholder}
              disabled={isLoading}
              className="border-border-primary focus:border-border-secondary disabled:bg-background-secondary disabled:text-ink-tertiary bg-surface-primary w-full rounded-2xl border px-4 py-3 text-base shadow-[0_2px_8px_rgba(51,65,85,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] transition-colors outline-none"
            />
            {current.key === 'description' && (
              <p className="text-ink-tertiary mt-1.5 text-right text-xs tabular-nums">
                {description.length}/{DESCRIPTION_LIMIT}
              </p>
            )}
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="text-ink-tertiary text-xs">
            {remaining !== undefined && remaining >= 0 ? (
              <span>
                {remaining} audit{remaining !== 1 ? 's' : ''} left today
              </span>
            ) : (
              <span>{isLast ? 'Ready to run' : 'Press Enter to continue'}</span>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-brand-primary hover:bg-brand-hover rounded-full px-6 py-3 text-sm font-medium text-white transition-colors disabled:opacity-60"
          >
            {isLoading ? 'Auditing...' : isLast ? 'Run audit' : 'Continue'}
          </button>
        </div>
      </div>
    </form>
  );
}
