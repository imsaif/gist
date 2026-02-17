import { Gap, GapCategory, GapSeverity, LLMProvider } from '@/types/audit';

interface GapItemProps {
  gap: Gap;
}

const severityConfig: Record<GapSeverity, { bg: string; text: string }> = {
  critical: { bg: 'bg-red-500/15', text: 'text-red-400' },
  high: { bg: 'bg-amber-500/15', text: 'text-amber-400' },
  medium: { bg: 'bg-slate-500/15', text: 'text-slate-400' },
};

const categoryLabels: Record<GapCategory, string> = {
  competitor_blending: 'Competitor Blending',
  invisible_mechanics: 'Invisible Mechanics',
  missing_decisions: 'Missing Decisions',
  fabrication: 'Fabrication',
  missing_boundaries: 'Missing Boundaries',
  positioning_drift: 'Positioning Drift',
};

const providerNames: Record<LLMProvider, string> = {
  chatgpt: 'ChatGPT',
  claude: 'Claude',
  perplexity: 'Perplexity',
};

export function GapItem({ gap }: GapItemProps) {
  const severity = severityConfig[gap.severity];

  return (
    <div className="border-border-light bg-bg-primary rounded-lg border p-4">
      <div className="mb-2 flex items-center gap-2">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${severity.bg} ${severity.text}`}
        >
          {gap.severity}
        </span>
        <span className="text-text-tertiary text-xs">{categoryLabels[gap.category]}</span>
      </div>

      <p className="text-text-primary mb-2 text-sm leading-relaxed">{gap.description}</p>

      <div className="mb-2 flex items-center gap-1">
        <span className="text-text-tertiary text-xs">Affected:</span>
        {gap.modelsAffected.map((model) => (
          <span
            key={model}
            className="bg-bg-secondary text-text-secondary rounded px-1.5 py-0.5 text-xs"
          >
            {providerNames[model]}
          </span>
        ))}
      </div>

      <div className="bg-bg-secondary rounded-lg p-3">
        <p className="text-text-tertiary mb-1 text-xs font-medium">
          What your gist.design file needs:
        </p>
        <p className="text-text-secondary text-sm">{gap.whatFileNeeds}</p>
      </div>
    </div>
  );
}
