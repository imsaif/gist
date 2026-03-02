'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { AuditResult, LLMProvider, LLMResponse, GapAnalysis } from '@/types/audit';
import { parseSSEEvents } from '@/lib/audit/sseParser';
import { AuditInput } from './AuditInput';
import { AuditLoading } from './AuditLoading';
import { AuditResults } from './AuditResults';
import { AuditToConversation } from './AuditToConversation';
import { AuditEmailGate } from './AuditEmailGate';

type AuditPhase =
  | 'input'
  | 'email-gate'
  | 'fetching'
  | 'querying'
  | 'analyzing'
  | 'complete'
  | 'error';

interface AuditHeroProps {
  onPhaseChange?: (phase: string) => void;
}

export function AuditHero({ onPhaseChange }: AuditHeroProps) {
  const [phase, setPhase] = useState<AuditPhase>('input');
  const [url, setUrl] = useState('');
  const [responses, setResponses] = useState<Partial<Record<LLMProvider, LLMResponse>>>({});
  const [result, setResult] = useState<AuditResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [remaining, setRemaining] = useState<number | undefined>(undefined);

  const updatePhase = useCallback(
    (newPhase: AuditPhase) => {
      setPhase(newPhase);
      onPhaseChange?.(newPhase);
    },
    [onPhaseChange]
  );

  const handleUrlSubmit = useCallback(
    (auditUrl: string) => {
      setUrl(auditUrl);
      updatePhase('email-gate');
    },
    [updatePhase]
  );

  const runAudit = useCallback(
    async (auditUrl: string) => {
      updatePhase('fetching');
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
                  updatePhase('querying');
                  break;

                case 'llm_response': {
                  const llmResponse = data as LLMResponse;
                  collectedResponses[llmResponse.model] = llmResponse;
                  setResponses({ ...collectedResponses });
                  if (Object.keys(collectedResponses).length === 2) {
                    updatePhase('analyzing');
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
                  updatePhase('complete');
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
        updatePhase('error');
      }
    },
    [updatePhase]
  );

  const handleReset = () => {
    setUrl('');
    setResponses({});
    setResult(null);
    setErrorMessage('');
    updatePhase('input');
  };

  const handleEmailUnlocked = () => {
    runAudit(url);
  };

  return (
    <div className="w-full">
      {/* Input phase — inline URL input */}
      {phase === 'input' && (
        <div className="flex flex-col items-start">
          <AuditInput onSubmit={handleUrlSubmit} isLoading={false} remaining={remaining} />
          <Link
            href="/create"
            className="text-text-tertiary hover:text-text-secondary mt-3 text-sm transition-colors"
          >
            or skip to file creation
          </Link>
        </div>
      )}

      {/* Loading phases */}
      {(phase === 'fetching' || phase === 'querying' || phase === 'analyzing') && (
        <div className="w-full max-w-5xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-text-primary text-lg font-semibold">Auditing {url}</h3>
              <p className="text-text-tertiary text-sm">
                {phase === 'fetching' && 'Fetching your site...'}
                {phase === 'querying' && 'Asking 2 LLMs about your product...'}
                {phase === 'analyzing' && 'Analyzing gaps across models...'}
              </p>
            </div>
            <button
              onClick={handleReset}
              className="border-border-light text-text-secondary hover:bg-bg-secondary rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
            >
              New audit
            </button>
          </div>
          <AuditLoading responses={responses} isFetching={phase === 'fetching'} />
        </div>
      )}

      {/* Email gate — after URL, before audit runs */}
      {phase === 'email-gate' && (
        <div className="w-full max-w-5xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-text-primary text-lg font-semibold">Audit {url}</h3>
              <p className="text-text-tertiary text-sm">Enter your email to start the audit</p>
            </div>
            <button
              onClick={handleReset}
              className="border-border-light text-text-secondary hover:bg-bg-secondary rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
            >
              Change URL
            </button>
          </div>
          <AuditEmailGate onUnlocked={handleEmailUnlocked} />
        </div>
      )}

      {/* Complete phase — results + CTA */}
      {phase === 'complete' && result && (
        <div className="w-full max-w-5xl space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-text-primary text-lg font-semibold">Audit Results</h3>
              <p className="text-text-tertiary text-sm">{url}</p>
            </div>
            <button
              onClick={handleReset}
              className="border-border-light text-text-secondary hover:bg-bg-secondary rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
            >
              New audit
            </button>
          </div>
          <AuditResults result={result} />
          <AuditToConversation result={result} />
        </div>
      )}

      {/* Error phase */}
      {phase === 'error' && (
        <div className="w-full max-w-md">
          <div className="border-border-light bg-bg-primary rounded-xl border p-8 text-center">
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
    </div>
  );
}
