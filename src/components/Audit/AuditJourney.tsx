'use client';

import { useEffect, useState } from 'react';
import { siClaude } from 'simple-icons';
import { LLMProvider, LLMResponse } from '@/types/audit';
import GistIcon from '@/components/GistIcon';

interface AuditJourneyProps {
  url: string;
  phase: 'fetching' | 'querying' | 'analyzing';
  responses: Partial<Record<LLMProvider, LLMResponse>>;
  onCancel?: () => void;
}

const OPENAI_PATH =
  'M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5Z';

const CLAUDE_PATH = (() => {
  const m = siClaude.svg.match(/<path d="([^"]+)"/);
  return m ? m[1] : '';
})();

const STOP_POSITIONS = [12, 38, 64, 90] as const;

const THINKING_PHRASES = [
  'Thinking…',
  'Gathering responses…',
  'Reading the homepage…',
  'Comparing what each model said…',
  'Looking for fabrications…',
  'Checking category drift…',
  'Checking audience alignment…',
  'Spotting positioning gaps…',
  'Drafting your llms.gist…',
  'Almost there…',
];

function siteHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function faviconUrl(url: string): string {
  try {
    const host = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${host}&sz=128`;
  } catch {
    return '';
  }
}

type StopState = 'pending' | 'active' | 'done' | 'error';

function stopStates(
  phase: AuditJourneyProps['phase'],
  responses: AuditJourneyProps['responses']
): [StopState, StopState, StopState, StopState] {
  const siteState: StopState = phase === 'fetching' ? 'active' : 'done';
  const cgState: StopState = responses.chatgpt?.error
    ? 'error'
    : responses.chatgpt
      ? 'done'
      : phase === 'fetching'
        ? 'pending'
        : 'active';
  const clState: StopState = responses.claude?.error
    ? 'error'
    : responses.claude
      ? 'done'
      : phase === 'fetching'
        ? 'pending'
        : 'active';
  const gistState: StopState = phase === 'analyzing' ? 'active' : 'pending';
  return [siteState, cgState, clState, gistState];
}

function captionFor(
  phase: AuditJourneyProps['phase'],
  url: string,
  responses: AuditJourneyProps['responses']
): { title: string; sub: string } {
  if (phase === 'fetching') {
    return {
      title: `Fetching ${siteHost(url)}`,
      sub: 'Reading your homepage so the models see what visitors see.',
    };
  }
  if (phase === 'querying') {
    if (!responses.chatgpt) {
      return { title: 'Asking ChatGPT', sub: 'What does GPT-4o think your product is?' };
    }
    if (!responses.claude) {
      return { title: 'Asking Claude', sub: 'And what does Claude say?' };
    }
    return { title: 'Comparing answers', sub: 'Both replies are in.' };
  }
  return {
    title: 'GistBot is reasoning',
    sub: 'Working through both replies side-by-side with your site.',
  };
}

function trackProgress(
  phase: AuditJourneyProps['phase'],
  responses: AuditJourneyProps['responses']
): number {
  if (phase === 'fetching') return STOP_POSITIONS[0];
  if (phase === 'querying') {
    if (!responses.chatgpt) return STOP_POSITIONS[1];
    if (!responses.claude) return STOP_POSITIONS[2];
    return STOP_POSITIONS[2];
  }
  return STOP_POSITIONS[3];
}

function StopNode({
  state,
  label,
  children,
  position,
}: {
  state: StopState;
  label: string;
  children: React.ReactNode;
  position: number;
}) {
  const ring =
    state === 'done'
      ? 'ring-emerald-400 bg-white scale-100'
      : state === 'active'
        ? 'ring-brand-primary bg-white scale-110'
        : state === 'error'
          ? 'ring-red-400 bg-white'
          : 'ring-border-primary bg-background-secondary scale-95';
  const labelCls =
    state === 'done'
      ? 'text-ink-primary'
      : state === 'active'
        ? 'text-brand-primary'
        : state === 'error'
          ? 'text-red-500'
          : 'text-ink-tertiary';
  return (
    <div
      className="absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
      style={{ left: `${position}%` }}
    >
      <div
        className={`relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full shadow-sm ring-2 transition-all duration-500 ${ring}`}
      >
        <div
          className={`flex items-center justify-center transition-opacity ${
            state === 'pending' ? 'opacity-40 grayscale' : 'opacity-100'
          }`}
        >
          {children}
        </div>
        {state === 'done' && (
          <span className="animate-pop-in absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
              <path
                fillRule="evenodd"
                d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 011.42-1.42L8.5 12.08l6.79-6.79a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        )}
      </div>
      <span
        className={`text-[10px] font-semibold tracking-wider uppercase transition-colors ${labelCls}`}
      >
        {label}
      </span>
    </div>
  );
}

function ThinkingPhrases() {
  const [thinkingIndex, setThinkingIndex] = useState(0);
  const [analyzingSeconds, setAnalyzingSeconds] = useState(0);

  useEffect(() => {
    const phraseTimer = setInterval(() => {
      setThinkingIndex((i) => Math.min(i + 1, THINKING_PHRASES.length - 1));
    }, 2400);
    const secondsTimer = setInterval(() => setAnalyzingSeconds((s) => s + 1), 1000);
    return () => {
      clearInterval(phraseTimer);
      clearInterval(secondsTimer);
    };
  }, []);

  return (
    <div className="text-ink-secondary mt-4 text-center text-sm">
      <p key={thinkingIndex} className="animate-fade-in font-medium">
        {THINKING_PHRASES[thinkingIndex]}
      </p>
      {analyzingSeconds >= 12 && (
        <p className="text-ink-tertiary mt-1 text-xs">
          Hang tight — deeper audits can take a moment.
        </p>
      )}
    </div>
  );
}

export function AuditJourney({ url, phase, responses, onCancel }: AuditJourneyProps) {
  const [siteState, cgState, clState, gistState] = stopStates(phase, responses);
  const caption = captionFor(phase, url, responses);
  const favicon = faviconUrl(url);
  const fillPct = trackProgress(phase, responses);
  const isAnalyzing = phase === 'analyzing';

  return (
    <div className="card w-full max-w-xl overflow-hidden p-6">
      <div className="text-center">
        <p className="text-ink-tertiary mb-1 text-[10px] font-semibold tracking-[0.2em] uppercase">
          Auditing
        </p>
        <h3 className="text-ink-primary text-lg font-semibold tracking-tight">{caption.title}</h3>
        <p className="text-ink-tertiary mt-1 text-xs">{caption.sub}</p>
      </div>

      <div className="relative mx-auto mt-8 mb-2 h-24" style={{ width: '92%' }}>
        {/* Dotted track (full width) */}
        <div
          className="absolute top-1/2 right-0 left-0 h-[2px] -translate-y-1/2"
          style={{
            backgroundImage:
              'linear-gradient(to right, var(--color-border-primary, #d4d4d8) 50%, transparent 50%)',
            backgroundSize: '8px 2px',
            backgroundRepeat: 'repeat-x',
          }}
        />
        {/* Solid filled portion — covers the dots up to current progress */}
        <div
          className="bg-brand-primary absolute top-1/2 left-0 h-[2px] -translate-y-1/2 transition-[width] duration-1000 ease-in-out"
          style={{ width: `${fillPct}%` }}
        />

        {/* Stops */}
        <StopNode state={siteState} label="Site" position={STOP_POSITIONS[0]}>
          {favicon ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={favicon}
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 rounded"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <span className="text-ink-tertiary text-xs">site</span>
          )}
        </StopNode>

        <StopNode state={cgState} label="ChatGPT" position={STOP_POSITIONS[1]}>
          <svg viewBox="0 0 24 24" className="text-ink-primary h-7 w-7" fill="currentColor">
            <path d={OPENAI_PATH} />
          </svg>
        </StopNode>

        <StopNode state={clState} label="Claude" position={STOP_POSITIONS[2]}>
          <svg viewBox="0 0 24 24" className="text-ink-primary h-7 w-7" fill="currentColor">
            <path d={CLAUDE_PATH} />
          </svg>
        </StopNode>

        {/* GistBot stop — activates during analyzing */}
        <div
          className="absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
          style={{ left: `${STOP_POSITIONS[3]}%` }}
        >
          <div className="relative">
            {gistState === 'active' && (
              <div className="absolute -top-5 left-1/2 flex -translate-x-1/2 items-end gap-1">
                <span className="bg-brand-primary animate-think-dot h-1.5 w-1.5 rounded-full" />
                <span
                  className="bg-brand-primary animate-think-dot h-1.5 w-1.5 rounded-full"
                  style={{ animationDelay: '0.18s' }}
                />
                <span
                  className="bg-brand-primary animate-think-dot h-1.5 w-1.5 rounded-full"
                  style={{ animationDelay: '0.36s' }}
                />
              </div>
            )}
            <div
              className={`bg-ink-primary text-background-primary flex h-14 w-14 items-center justify-center rounded-full shadow-md ring-2 transition-all duration-500 ${
                gistState === 'active'
                  ? 'ring-brand-primary scale-110'
                  : 'ring-border-primary scale-95 opacity-50'
              }`}
            >
              <GistIcon className="h-7 w-7" />
            </div>
          </div>
          <span
            className={`text-[10px] font-semibold tracking-wider uppercase transition-colors ${
              gistState === 'active' ? 'text-brand-primary' : 'text-ink-tertiary'
            }`}
          >
            GistBot
          </span>
        </div>

        {/* Tiny traveling gistbot — sits beside the active stop, rendered last so it paints on top */}
        {!isAnalyzing && (
          <div
            className="pointer-events-none absolute top-1/2 z-30 transition-[left] duration-1000 ease-in-out"
            style={{
              left: `${fillPct}%`,
              transform: 'translate(calc(-50% + 38px), -50%)',
            }}
          >
            <div className="animate-bot-bob">
              <div className="bg-brand-primary ring-background-primary animate-bot-pulse flex h-7 w-7 items-center justify-center rounded-full text-white shadow-[0_2px_8px_rgba(0,0,0,0.18)] ring-[3px]">
                <GistIcon className="h-4 w-4" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Thinking phrases during analyzing — replaces the status pills */}
      {isAnalyzing ? (
        <ThinkingPhrases />
      ) : (
        <div className="text-ink-tertiary mt-4 flex items-center justify-center gap-3 text-xs">
          <StatusPill state={siteState} label="Fetched" pendingLabel="Fetch" />
          <span className="text-ink-tertiary/50">·</span>
          <StatusPill state={cgState} label="ChatGPT" pendingLabel="ChatGPT" />
          <span className="text-ink-tertiary/50">·</span>
          <StatusPill state={clState} label="Claude" pendingLabel="Claude" />
        </div>
      )}

      {onCancel && (
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={onCancel}
            className="text-ink-tertiary hover:text-ink-primary cursor-pointer text-xs font-medium underline-offset-2 transition-colors hover:underline"
          >
            Cancel audit
          </button>
        </div>
      )}
    </div>
  );
}

function StatusPill({
  state,
  label,
  pendingLabel,
}: {
  state: StopState;
  label: string;
  pendingLabel: string;
}) {
  if (state === 'done') {
    return <span className="text-emerald-600">✓ {label}</span>;
  }
  if (state === 'active') {
    return (
      <span className="text-brand-primary inline-flex items-center gap-1">
        <span className="bg-brand-primary inline-block h-1.5 w-1.5 animate-pulse rounded-full" />
        {label}…
      </span>
    );
  }
  if (state === 'error') {
    return <span className="text-red-500">⚠ {label}</span>;
  }
  return <span className="text-ink-tertiary/70">{pendingLabel}</span>;
}
