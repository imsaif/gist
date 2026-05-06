'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AuditResult, LLMProvider, LLMResponse, GapAnalysis } from '@/types/audit';
import { parseSSEEvents } from '@/lib/audit/sseParser';
import { AuditInput, type AuditInputValue } from './AuditInput';
import { ConflictChips } from './ConflictChips';
import { CleanAuditCallout } from './CleanAuditCallout';
import { AuditJourney } from './AuditJourney';
import { AuditEmailGate } from './AuditEmailGate';

type AuditPhase =
  | 'input'
  | 'fetching'
  | 'querying'
  | 'analyzing'
  | 'complete'
  | 'email-gate'
  | 'error';

interface AuditHeroProps {
  onPhaseChange?: (phase: string) => void;
  onClose?: () => void;
}

export function AuditHero({ onPhaseChange, onClose }: AuditHeroProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<AuditPhase>('input');
  const [url, setUrl] = useState('');
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [responses, setResponses] = useState<Partial<Record<LLMProvider, LLMResponse>>>({});
  const [result, setResult] = useState<AuditResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  const updatePhase = useCallback(
    (newPhase: AuditPhase) => {
      setPhase(newPhase);
      onPhaseChange?.(newPhase);
    },
    [onPhaseChange]
  );

  const runAudit = useCallback(
    async (input: AuditInputValue) => {
      const auditUrl = input.url;
      updatePhase('fetching');
      setResponses({});
      setResult(null);
      setErrorMessage('');

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch('/api/audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: auditUrl,
            name: input.name,
            description: input.description,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        if (!response.body) throw new Error('No response stream');

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
        if (err instanceof DOMException && err.name === 'AbortError') {
          // User-initiated cancel — handled by handleCancel which already reset phase.
          return;
        }
        setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred');
        updatePhase('error');
      } finally {
        abortRef.current = null;
      }
    },
    [updatePhase]
  );

  const handleCancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setResponses({});
    setResult(null);
    setErrorMessage('');
    updatePhase('input');
  }, [updatePhase]);

  const handleFormSubmit = useCallback(
    (input: AuditInputValue) => {
      setUrl(input.url);
      setProductName(input.name);
      setProductDescription(input.description);
      runAudit(input);
    },
    [runAudit]
  );

  const handleReset = () => {
    setUrl('');
    setProductName('');
    setProductDescription('');
    setResponses({});
    setResult(null);
    setErrorMessage('');
    updatePhase('input');
  };

  const persistResult = useCallback(() => {
    if (!result) return;
    try {
      sessionStorage.setItem('audit_result', JSON.stringify(result));
      if (productName) sessionStorage.setItem('audit_product_name', productName);
      if (productDescription)
        sessionStorage.setItem('audit_product_description', productDescription);
    } catch {
      // sessionStorage may be unavailable; navigation still proceeds
    }
  }, [result, productName, productDescription]);

  const goToFixPage = useCallback(() => {
    persistResult();
    router.push('/fix');
  }, [persistResult, router]);

  const handleFixGaps = () => {
    if (!result) return;
    persistResult();
    const target = url ? `/request-private?url=${encodeURIComponent(url)}` : '/request-private';
    router.push(target);
  };

  const handleEmailUnlocked = () => {
    goToFixPage();
  };

  const isRunning = phase === 'fetching' || phase === 'querying' || phase === 'analyzing';

  return (
    <div className="flex w-full flex-col items-center">
      {/* URL input — visible only in input phase */}
      {phase === 'input' && (
        <AuditInput onSubmit={handleFormSubmit} isLoading={false} onClose={onClose} />
      )}

      {phase === 'input' && (
        <div className="text-ink-tertiary mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm">
          <span>Free</span>
          <span>·</span>
          <span>No signup</span>
          <span>·</span>
          <span>60 seconds</span>
        </div>
      )}

      {isRunning && (
        <AuditJourney url={url} phase={phase} responses={responses} onCancel={handleCancel} />
      )}

      {phase === 'complete' && result && (
        <div className="w-full max-w-2xl">
          {(result.analysis?.gaps ?? []).length === 0 ? (
            <CleanAuditCallout
              url={url}
              productName={productName}
              productDescription={productDescription}
            />
          ) : (
            <ConflictChips
              gaps={result.analysis?.gaps ?? []}
              onFix={handleFixGaps}
              onView={() => {
                persistResult();
                router.push('/audit');
              }}
            />
          )}
          <div className="text-ink-tertiary mt-5 flex justify-center text-xs">
            <button
              onClick={handleReset}
              className="hover:text-ink-primary cursor-pointer font-medium transition-colors"
            >
              Audit a different URL
            </button>
          </div>
        </div>
      )}

      {phase === 'email-gate' && (
        <div className="mt-6 w-full max-w-md">
          <AuditEmailGate onUnlocked={handleEmailUnlocked} />
          <div className="mt-3 text-center">
            <button
              onClick={() => updatePhase('complete')}
              className="text-ink-tertiary hover:text-ink-primary text-xs font-medium transition-colors"
            >
              Back to results
            </button>
          </div>
        </div>
      )}

      {phase === 'error' && (
        <div className="mt-6 w-full max-w-md text-center">
          <p className="text-ink-primary mb-2 text-base font-semibold">Audit failed</p>
          <p className="text-ink-secondary mb-5 text-sm">{errorMessage}</p>
          <button
            onClick={handleReset}
            className="bg-brand-primary hover:bg-brand-hover rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-colors"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
