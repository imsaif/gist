'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { AuditResult, LLMProvider, LLMResponse, GapAnalysis } from '@/types/audit';
import { parseSSEEvents } from '@/lib/audit/sseParser';
import { AuditInput, AuditLoading, AuditResults, AuditToConversation } from '@/components/Audit';

type AuditPhase = 'input' | 'fetching' | 'querying' | 'analyzing' | 'complete' | 'error';

export default function AuditPage() {
  const [phase, setPhase] = useState<AuditPhase>('input');
  const [url, setUrl] = useState('');
  const [responses, setResponses] = useState<Partial<Record<LLMProvider, LLMResponse>>>({});
  const [result, setResult] = useState<AuditResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [remaining, setRemaining] = useState<number | undefined>(undefined);

  const runAudit = useCallback(async (auditUrl: string) => {
    setUrl(auditUrl);
    setPhase('fetching');
    setResponses({});
    setResult(null);
    setErrorMessage('');

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: auditUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response stream');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fetchedContent: { url: string; contentLength: number } | null = null;
      const collectedResponses: Partial<Record<LLMProvider, LLMResponse>> = {};
      let analysis: GapAnalysis | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const { events, remaining: rem } = parseSSEEvents(buffer);
        buffer = rem;

        for (const event of events) {
          try {
            const data = JSON.parse(event.data);

            switch (event.event) {
              case 'fetched':
                fetchedContent = data;
                setPhase('querying');
                break;

              case 'llm_response': {
                const llmResponse = data as LLMResponse;
                collectedResponses[llmResponse.model] = llmResponse;
                setResponses({ ...collectedResponses });
                if (Object.keys(collectedResponses).length === 3) {
                  setPhase('analyzing');
                }
                break;
              }

              case 'analysis':
                analysis = data as GapAnalysis;
                setResult({
                  url: auditUrl,
                  fetchedAt: new Date().toISOString(),
                  siteContent: {
                    url: fetchedContent?.url || auditUrl,
                    title: '',
                    metaDescription: '',
                    content: '',
                    contentLength: fetchedContent?.contentLength || 0,
                  },
                  responses: collectedResponses,
                  analysis,
                });
                setPhase('complete');
                break;

              case 'error':
                throw new Error(data.message);

              case 'done':
                break;
            }
          } catch (parseErr) {
            if (parseErr instanceof Error && parseErr.message !== 'done') {
              throw parseErr;
            }
          }
        }
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred');
      setPhase('error');
    }
  }, []);

  const handleReset = () => {
    setPhase('input');
    setUrl('');
    setResponses({});
    setResult(null);
    setErrorMessage('');
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-border-light flex h-14 items-center justify-between border-b px-6">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-text-primary hover:text-accent-primary text-xl font-semibold transition-colors"
          >
            Gist
          </Link>
          <span className="text-text-tertiary">/</span>
          <span className="bg-bg-secondary flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="text-accent-primary h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <span className="text-text-secondary">Audit</span>
          </span>
        </div>
        {phase !== 'input' && (
          <button
            onClick={handleReset}
            className="border-border-light text-text-secondary hover:bg-bg-secondary rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
          >
            New audit
          </button>
        )}
      </header>

      {/* Main content */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
        {/* Input phase */}
        {phase === 'input' && (
          <div className="flex flex-col items-center pt-16">
            <h2 className="text-text-primary mb-2 text-2xl font-bold tracking-tight">
              AI Readability Audit
            </h2>
            <p className="text-text-secondary mb-8 max-w-lg text-center">
              See how ChatGPT, Claude, and Perplexity describe your product right now. Find the gaps
              before your users do.
            </p>
            <AuditInput onSubmit={runAudit} isLoading={false} remaining={remaining} />
          </div>
        )}

        {/* Loading phases */}
        {(phase === 'fetching' || phase === 'querying' || phase === 'analyzing') && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-text-primary text-lg font-semibold">Auditing {url}</h2>
                <p className="text-text-tertiary text-sm">
                  {phase === 'fetching' && 'Fetching your site...'}
                  {phase === 'querying' && 'Asking 3 LLMs about your product...'}
                  {phase === 'analyzing' && 'Analyzing gaps across models...'}
                </p>
              </div>
            </div>
            <AuditLoading responses={responses} isFetching={phase === 'fetching'} />
          </div>
        )}

        {/* Complete phase */}
        {phase === 'complete' && result && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-text-primary text-lg font-semibold">Audit Results</h2>
                <p className="text-text-tertiary text-sm">{url}</p>
              </div>
            </div>
            <AuditResults result={result} />
            <AuditToConversation result={result} />
          </div>
        )}

        {/* Error phase */}
        {phase === 'error' && (
          <div className="flex flex-col items-center pt-16">
            <div className="border-border-light bg-bg-primary max-w-md rounded-xl border p-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/15">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6 text-red-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </div>
              <h3 className="text-text-primary mb-2 text-lg font-semibold">Audit failed</h3>
              <p className="text-text-secondary mb-6 text-sm">{errorMessage}</p>
              <button
                onClick={handleReset}
                className="bg-accent-primary hover:bg-accent-hover rounded-xl px-6 py-3 font-medium text-white transition-colors"
              >
                Try again
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
