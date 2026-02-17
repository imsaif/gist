import { ReadabilityScore as ReadabilityScoreType } from '@/types/audit';

interface ReadabilityScoreProps {
  score: ReadabilityScoreType;
}

const scoreConfig: Record<ReadabilityScoreType, { bg: string; text: string; border: string }> = {
  Poor: { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/30' },
  Partial: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' },
  Good: { bg: 'bg-green-500/15', text: 'text-green-400', border: 'border-green-500/30' },
};

export function ReadabilityScore({ score }: ReadabilityScoreProps) {
  const config = scoreConfig[score];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${config.bg} ${config.text} ${config.border}`}
    >
      {score}
    </span>
  );
}
