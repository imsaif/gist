'use client';

import { useState } from 'react';
import { LLMResponse, LLMProvider } from '@/types/audit';

interface LLMResponseCardProps {
  response?: LLMResponse;
  isLoading: boolean;
  gapCount?: number;
}

const providerNames: Record<LLMProvider, string> = {
  chatgpt: 'ChatGPT',
  claude: 'Claude',
  perplexity: 'Perplexity',
};

const providerModels: Record<LLMProvider, string> = {
  chatgpt: 'GPT-4o',
  claude: 'Sonnet 4.5',
  perplexity: 'Sonar',
};

export function LLMResponseCard({ response, isLoading, gapCount }: LLMResponseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (isLoading) {
    return (
      <div className="border-border-light bg-bg-primary animate-pulse rounded-xl border p-5">
        <div className="mb-3 flex items-center gap-2">
          <div className="bg-bg-tertiary h-4 w-20 rounded" />
          <div className="bg-bg-tertiary h-3 w-16 rounded" />
        </div>
        <div className="space-y-2">
          <div className="bg-bg-secondary h-3 w-full rounded" />
          <div className="bg-bg-secondary h-3 w-5/6 rounded" />
          <div className="bg-bg-secondary h-3 w-4/6 rounded" />
        </div>
      </div>
    );
  }

  if (!response) return null;

  const content = response.content || response.error || 'No response';
  const truncated = content.length > 300 && !isExpanded;
  const displayContent = truncated ? content.slice(0, 300) + '...' : content;

  const gapBadgeStyle =
    gapCount !== undefined
      ? gapCount >= 3
        ? 'bg-red-500/15 text-red-400'
        : gapCount >= 1
          ? 'bg-amber-500/15 text-amber-400'
          : 'bg-green-500/15 text-green-400'
      : '';

  return (
    <div className="border-border-light bg-bg-primary rounded-xl border p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-text-primary text-sm font-semibold">
            {providerNames[response.model]}
          </span>
          <span className="text-text-tertiary text-xs">{providerModels[response.model]}</span>
        </div>
        <span className="text-text-tertiary text-xs">
          {(response.durationMs / 1000).toFixed(1)}s
        </span>
      </div>

      {response.error ? (
        <p className="text-sm text-red-500">Error: {response.error}</p>
      ) : (
        <>
          <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">
            {displayContent}
          </p>
          {content.length > 300 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-accent-primary hover:text-accent-hover mt-2 text-sm font-medium transition-colors"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </>
      )}

      {gapCount !== undefined && (
        <div className="border-border-light mt-3 border-t pt-3">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${gapBadgeStyle}`}
          >
            {gapCount} gap{gapCount !== 1 ? 's' : ''} identified
          </span>
        </div>
      )}
    </div>
  );
}
