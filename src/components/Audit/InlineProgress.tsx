import { LLMProvider, LLMResponse } from '@/types/audit';

interface InlineProgressProps {
  url: string;
  phase: 'fetching' | 'querying' | 'analyzing';
  responses: Partial<Record<LLMProvider, LLMResponse>>;
}

const providerLabels: Record<LLMProvider, string> = {
  chatgpt: 'ChatGPT',
  claude: 'Claude',
};

function statusFor(
  provider: LLMProvider,
  phase: InlineProgressProps['phase'],
  response: LLMResponse | undefined
): 'pending' | 'active' | 'done' | 'error' {
  if (response?.error) return 'error';
  if (response) return 'done';
  if (phase === 'fetching') return 'pending';
  return 'active';
}

function Dot({ status }: { status: 'pending' | 'active' | 'done' | 'error' }) {
  const cls =
    status === 'done'
      ? 'bg-emerald-500'
      : status === 'error'
        ? 'bg-red-400'
        : status === 'active'
          ? 'bg-brand-primary animate-pulse'
          : 'bg-ink-tertiary/30';
  return <span className={`h-1.5 w-1.5 rounded-full ${cls}`} />;
}

export function InlineProgress({ url, phase, responses }: InlineProgressProps) {
  const phaseLabel =
    phase === 'fetching'
      ? `Fetching ${url.replace(/^https?:\/\//, '').replace(/\/$/, '')}…`
      : phase === 'querying'
        ? 'Asking ChatGPT and Claude'
        : 'Analyzing conflicts';

  return (
    <div className="text-ink-secondary inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-sm">
      <span className="text-ink-tertiary">{phaseLabel}</span>
      {(['chatgpt', 'claude'] as LLMProvider[]).map((p) => {
        const status = statusFor(p, phase, responses[p]);
        return (
          <span key={p} className="inline-flex items-center gap-1.5">
            <Dot status={status} />
            <span
              className={
                status === 'done'
                  ? 'text-ink-primary font-medium'
                  : status === 'error'
                    ? 'text-red-500'
                    : 'text-ink-tertiary'
              }
            >
              {providerLabels[p]}
            </span>
          </span>
        );
      })}
    </div>
  );
}
