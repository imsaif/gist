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
};

const providerModels: Record<LLMProvider, string> = {
  chatgpt: 'GPT-4o',
  claude: 'Sonnet 4.5',
};

export function LLMResponseCard({ response, isLoading, gapCount }: LLMResponseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (isLoading) {
    return (
      <div className="border-border-primary bg-background-primary animate-pulse rounded-xl border p-6">
        <div className="mb-4 flex items-center gap-2">
          <div className="bg-background-tertiary h-5 w-24 rounded" />
          <div className="bg-background-tertiary h-4 w-16 rounded" />
        </div>
        <div className="space-y-2.5">
          <div className="bg-background-secondary h-3.5 w-full rounded" />
          <div className="bg-background-secondary h-3.5 w-5/6 rounded" />
          <div className="bg-background-secondary h-3.5 w-4/6 rounded" />
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
        ? 'bg-red-50 text-red-700 ring-1 ring-red-200'
        : gapCount >= 1
          ? 'bg-amber-50 text-amber-800 ring-1 ring-amber-200'
          : 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200'
      : '';

  return (
    <div className="border-border-primary bg-background-primary flex flex-col rounded-xl border p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-ink-primary text-base font-bold">
            {providerNames[response.model]}
          </span>
          <span className="text-ink-tertiary text-xs font-medium">
            {providerModels[response.model]}
          </span>
        </div>
        <span className="text-ink-tertiary text-xs">
          {(response.durationMs / 1000).toFixed(1)}s
        </span>
      </div>

      {response.error ? (
        <p className="text-sm leading-relaxed text-red-400">Error: {response.error}</p>
      ) : (
        <>
          <p className="text-ink-secondary flex-1 text-sm leading-relaxed whitespace-pre-wrap">
            {displayContent}
          </p>
          {content.length > 300 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-brand-primary hover:text-brand-hover mt-3 text-sm font-semibold transition-colors"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </>
      )}

      {gapCount !== undefined && (
        <div className="border-border-primary mt-4 border-t pt-4">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${gapBadgeStyle}`}
          >
            {gapCount} conflict{gapCount !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
}
