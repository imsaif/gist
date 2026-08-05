'use client';

import { useState } from 'react';
import type { AuditResult } from '@/types/repo-audit';

type Phase = 'input' | 'loading' | 'questions' | 'done';

export function AuditFlow() {
  const [phase, setPhase] = useState<Phase>('input');
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<AuditResult | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [file, setFile] = useState('');
  const [error, setError] = useState('');

  async function runAudit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setPhase('loading');
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.');
        setPhase('input');
        return;
      }
      setResult(data);
      setPhase('questions');
    } catch {
      setError('We could not reach the server. Check your connection and try again.');
      setPhase('input');
    }
  }

  async function generate() {
    setError('');
    setPhase('loading');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url, answers }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.');
        setPhase('questions');
        return;
      }
      setFile(data.file);
      setPhase('done');
    } catch {
      setError('We could not reach the server. Your answers are still here, try again.');
      setPhase('questions');
    }
  }

  function download() {
    const blob = new Blob([file], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'llms.gist';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="mx-auto max-w-xl text-left">
      {phase === 'input' && (
        <form onSubmit={runAudit} className="flex gap-2">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="github.com/you/yourproject"
            aria-label="GitHub repository URL"
            className="border-border-primary text-ink-primary flex-1 rounded-full border px-5 py-3 text-sm"
          />
          <button
            type="submit"
            className="bg-surface-inverse rounded-full px-6 py-3 text-sm font-semibold text-white"
          >
            Audit
          </button>
        </form>
      )}

      {phase === 'loading' && (
        <p className="text-ink-tertiary py-8 text-center text-sm">Reading the repo...</p>
      )}

      {phase === 'questions' && result && (
        <div>
          <p className="text-ink-tertiary text-sm">How an AI reads this repo today</p>
          <p className="text-ink-primary mt-2 font-mono text-[15px]">{result.reading}</p>
          {result.questions.length === 0 ? (
            <p className="text-ink-secondary mt-6 text-sm">
              Your repo already covers what we would have asked: who it is for, who it is not for,
              and what it does not do. Nothing left to fill in, generate the file when you are
              ready.
            </p>
          ) : (
            <div className="mt-8 space-y-5">
              {result.questions.map((q) => (
                <label key={q.gapId} className="block">
                  <span className="text-ink-primary text-sm font-medium">{q.prompt}</span>
                  <textarea
                    value={answers[q.gapId] ?? ''}
                    onChange={(e) => setAnswers({ ...answers, [q.gapId]: e.target.value })}
                    placeholder={q.placeholder}
                    rows={2}
                    className="border-border-primary mt-2 w-full rounded-lg border p-3 text-sm"
                  />
                </label>
              ))}
            </div>
          )}
          <button
            onClick={generate}
            className="bg-surface-inverse mt-6 rounded-full px-6 py-3 text-sm font-semibold text-white"
          >
            Generate my llms.gist
          </button>
        </div>
      )}

      {phase === 'done' && (
        <div>
          <pre className="border-border-primary bg-background-tertiary max-h-80 overflow-auto rounded-xl border p-5 font-mono text-[13px]">
            {file}
          </pre>
          <button
            onClick={download}
            className="bg-surface-inverse mt-4 rounded-full px-6 py-3 text-sm font-semibold text-white"
          >
            Download llms.gist
          </button>
          <p className="text-ink-secondary mt-5 text-sm leading-relaxed">
            Put this at your project root. Then run{' '}
            <code className="font-mono">curl -fsSL llmsgist.org/i | bash</code> and{' '}
            <code className="font-mono">/llms-gist</code> to connect it to your agent and check that
            it actually worked.
          </p>
        </div>
      )}

      {error && <p className="text-correction mt-4 text-sm">{error}</p>}
    </div>
  );
}
