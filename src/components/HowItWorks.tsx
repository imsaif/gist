'use client';

import { useState, useEffect, useCallback } from 'react';

const CYCLE_MS = 5000;

const steps = [
  {
    label: 'Audit',
    number: '01',
    title: 'Discover the gaps',
    description:
      'See how ChatGPT, Claude, and Perplexity describe your product from your website alone. Find where they guess wrong, miss features, or confuse you with a competitor.',
  },
  {
    label: 'Fill gaps',
    number: '02',
    title: 'Generate your file',
    description:
      'Answer guided questions about your design decisions, positioning, and boundaries. The conversation tool turns your thinking into a structured gist.design file.',
  },
  {
    label: 'Verify',
    number: '03',
    title: 'Verify and deploy',
    description:
      'Re-run the audit with your gist.design file attached. See the before/after improvement, then drop the file in your repo root.',
  },
];

/* ------------------------------------------------------------------ */
/*  Mock illustrations for each step                                   */
/* ------------------------------------------------------------------ */

function AuditIllustration() {
  return (
    <div className="flex h-full w-full flex-col gap-3 p-5">
      {/* LLM result cards */}
      <div className="flex gap-2.5">
        {[
          { name: 'ChatGPT', score: '62%', color: 'text-yellow-400' },
          { name: 'Claude', score: '45%', color: 'text-red-400' },
          { name: 'Perplexity', score: '58%', color: 'text-yellow-400' },
        ].map((llm) => (
          <div
            key={llm.name}
            className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.05] px-3 py-2.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-sm"
          >
            <span className="text-text-secondary text-[10px]">{llm.name}</span>
            <p className={`text-lg font-bold ${llm.color}`}>{llm.score}</p>
          </div>
        ))}
      </div>

      {/* Gap list */}
      <div className="rounded-lg border border-white/[0.08] bg-white/[0.05] px-4 py-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-sm">
        <p className="text-text-secondary mb-2 text-[10px] font-semibold tracking-wider uppercase">
          Gaps found
        </p>
        {[
          { label: 'Positioning', severity: 'high' },
          { label: 'Design decisions', severity: 'high' },
          { label: 'Audience targeting', severity: 'med' },
        ].map((gap) => (
          <div key={gap.label} className="flex items-center justify-between py-1">
            <span className="text-text-primary text-xs">{gap.label}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                gap.severity === 'high'
                  ? 'bg-red-400/15 text-red-400'
                  : 'bg-yellow-400/15 text-yellow-400'
              }`}
            >
              {gap.severity}
            </span>
          </div>
        ))}
      </div>

      {/* Score chart placeholder */}
      <div className="flex flex-1 items-end gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.05] px-4 py-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-sm">
        {[40, 65, 30, 55, 20, 45, 35, 50, 25, 60].map((h, i) => (
          <div key={i} className="flex-1 rounded-sm bg-red-400/25" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

function FillGapsIllustration() {
  return (
    <div className="flex h-full w-full flex-col gap-3 p-5">
      {/* Chat messages */}
      <div className="flex flex-col gap-2">
        <div className="bg-msg-user-bg self-end rounded-2xl rounded-br-sm px-3.5 py-2">
          <span className="text-msg-user-text text-[11px]">
            We chose manual approval over auto-execute
          </span>
        </div>
        <div className="self-start rounded-2xl rounded-bl-sm border border-white/[0.08] bg-white/[0.05] px-3.5 py-2 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-sm">
          <span className="text-text-primary text-[11px]">Why did you make that choice?</span>
        </div>
        <div className="bg-msg-user-bg self-end rounded-2xl rounded-br-sm px-3.5 py-2">
          <span className="text-msg-user-text text-[11px]">
            Users need to trust the system first
          </span>
        </div>
      </div>

      {/* Generated file preview */}
      <div className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.05] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-sm">
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-3 py-2">
          <div className="bg-accent-primary/20 h-2 w-2 rounded-full" />
          <span className="text-accent-primary text-[10px] font-semibold">product.gist.design</span>
        </div>
        <div className="space-y-1.5 px-3 py-2.5">
          <div className="flex gap-2">
            <span className="text-text-tertiary w-4 text-right font-mono text-[9px]">1</span>
            <span className="text-accent-primary font-mono text-[9px]">## Design Decisions</span>
          </div>
          <div className="flex gap-2">
            <span className="text-text-tertiary w-4 text-right font-mono text-[9px]">2</span>
            <span className="text-text-secondary font-mono text-[9px]">
              - Chose manual approval over auto-execute
            </span>
          </div>
          <div className="flex gap-2">
            <span className="text-text-tertiary w-4 text-right font-mono text-[9px]">3</span>
            <span className="text-text-secondary font-mono text-[9px]">
              &nbsp;&nbsp;Because: trust-first onboarding
            </span>
          </div>
          <div className="flex gap-2">
            <span className="text-text-tertiary w-4 text-right font-mono text-[9px]">4</span>
            <span className="text-text-tertiary font-mono text-[9px]">│</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function VerifyIllustration() {
  return (
    <div className="flex h-full w-full flex-col gap-3 p-5">
      {/* Before / After header */}
      <div className="flex gap-2.5">
        <div className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.05] px-3 py-2.5 text-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-sm">
          <span className="text-text-tertiary text-[10px] font-semibold tracking-wider uppercase">
            Before
          </span>
          <p className="text-xl font-bold text-red-400">52%</p>
        </div>
        <div className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.05] px-3 py-2.5 text-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-sm">
          <span className="text-text-tertiary text-[10px] font-semibold tracking-wider uppercase">
            After
          </span>
          <p className="text-xl font-bold text-emerald-400">94%</p>
        </div>
      </div>

      {/* Improvement bars */}
      <div className="rounded-lg border border-white/[0.08] bg-white/[0.05] px-4 py-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-sm">
        <p className="text-text-secondary mb-2 text-[10px] font-semibold tracking-wider uppercase">
          Accuracy by category
        </p>
        {[
          { label: 'Positioning', before: 30, after: 95 },
          { label: 'Features', before: 65, after: 92 },
          { label: 'Boundaries', before: 10, after: 88 },
        ].map((row) => (
          <div key={row.label} className="mb-2 last:mb-0">
            <div className="flex items-center justify-between">
              <span className="text-text-primary text-[11px]">{row.label}</span>
              <span className="text-[10px] font-medium text-emerald-400">
                {row.before}% → {row.after}%
              </span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-emerald-400/70"
                style={{ width: `${row.after}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Deploy instruction */}
      <div className="flex items-center gap-3 rounded-lg border border-white/[0.08] bg-white/[0.05] px-4 py-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-sm">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-400/15">
          <svg
            className="h-4 w-4 text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <div>
          <span className="text-text-primary text-[11px] font-medium">Drop in repo root</span>
          <p className="text-text-tertiary font-mono text-[9px]">/gist.design</p>
        </div>
      </div>
    </div>
  );
}

const illustrations = [AuditIllustration, FillGapsIllustration, VerifyIllustration];

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % steps.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, CYCLE_MS);
    return () => clearInterval(id);
  }, [paused, next]);

  const Illustration = illustrations[active];

  return (
    <div className="relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="ambient-orb top-1/3 -left-24 h-80 w-80 bg-indigo-500/[0.06]" />
      <div className="ambient-orb -right-20 bottom-1/4 h-72 w-72 bg-purple-500/[0.05]" />
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <h2 className="text-text-primary mb-3 text-center text-3xl font-bold tracking-tight">
          How it works
        </h2>
        <p className="text-text-secondary mx-auto mb-10 max-w-lg text-center text-lg leading-relaxed">
          Three steps. One file that fixes how AI understands your product.
        </p>

        {/* Outer card */}
        <div
          className="glass-strong overflow-hidden rounded-2xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Step tabs */}
          <div className="flex gap-2 bg-white/[0.03] p-3">
            {steps.map((step, i) => (
              <button
                key={step.label}
                onClick={() => setActive(i)}
                className={`flex-1 rounded-xl py-3 text-base font-semibold transition-all duration-300 ${
                  i === active
                    ? 'text-text-primary bg-white/[0.08] shadow-sm'
                    : 'text-text-tertiary hover:text-text-secondary'
                }`}
              >
                {step.label}
              </button>
            ))}
          </div>

          {/* Progress bar */}
          <div className="bg-white/[0.03] px-3 pb-3">
            <div className="h-0.5 overflow-hidden rounded-full bg-white/[0.03]">
              <div
                className="bg-accent-primary h-full rounded-full"
                style={{
                  width: `${((active + 1) / steps.length) * 100}%`,
                  transition: 'width 0.5s ease',
                }}
              />
            </div>
          </div>

          {/* Content area */}
          <div className="flex min-h-[400px] flex-col md:flex-row">
            {/* Illustration — left */}
            <div className="glass-subtle relative flex-1 overflow-hidden md:max-w-[55%]">
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  background:
                    'radial-gradient(circle at 30% 40%, rgba(129,140,248,0.12) 0%, transparent 70%)',
                }}
              />
              <div className="relative z-10 h-full">
                <div key={active} className="h-full animate-[fadeSlideIn_0.4s_ease-out]">
                  <Illustration />
                </div>
              </div>
            </div>

            {/* Text — right */}
            <div className="flex flex-1 flex-col justify-center px-8 py-10 md:px-12">
              <div key={active} className="animate-[fadeSlideIn_0.4s_ease-out]">
                <span className="text-text-tertiary mb-3 block font-mono text-base">
                  {steps[active].number}
                </span>
                <h3 className="text-text-primary mb-4 text-3xl font-bold">{steps[active].title}</h3>
                <p className="text-text-secondary text-lg leading-relaxed">
                  {steps[active].description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
