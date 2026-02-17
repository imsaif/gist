import { LLMProvider, LLMResponse } from '@/types/audit';
import { LLMResponseCard } from './LLMResponseCard';

interface AuditLoadingProps {
  responses: Partial<Record<LLMProvider, LLMResponse>>;
  isFetching: boolean;
}

const providers: LLMProvider[] = ['chatgpt', 'claude', 'perplexity'];

export function AuditLoading({ responses, isFetching }: AuditLoadingProps) {
  return (
    <div className="space-y-6">
      {isFetching && (
        <div className="flex items-center gap-3">
          <div className="border-border-medium border-t-text-secondary h-4 w-4 animate-spin rounded-full border-2" />
          <span className="text-text-secondary text-sm">Fetching site content...</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {providers.map((provider) => (
          <LLMResponseCard
            key={provider}
            response={responses[provider]}
            isLoading={!responses[provider] && !isFetching}
          />
        ))}
      </div>

      {Object.keys(responses).length === 3 && (
        <div className="flex items-center gap-3">
          <div className="border-border-medium border-t-text-secondary h-4 w-4 animate-spin rounded-full border-2" />
          <span className="text-text-secondary text-sm">Analyzing gaps across models...</span>
        </div>
      )}
    </div>
  );
}
