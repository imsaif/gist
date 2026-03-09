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
    <tr className="border-border-light border-b last:border-b-0">
      {/* Issue + Affected */}
      <td className="px-6 py-5 align-top">
        <p className="text-text-primary text-sm leading-relaxed">{gap.description}</p>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-text-tertiary text-xs">Affected:</span>
          {gap.modelsAffected.map((model) => (
            <span
              key={model}
              className="bg-bg-secondary text-text-secondary rounded-md px-2 py-0.5 text-xs font-medium"
            >
              {providerNames[model]}
            </span>
          ))}
        </div>
      </td>

      {/* Fix */}
      <td className="px-6 py-5 align-top">
        <p className="text-text-secondary text-sm leading-relaxed">{gap.whatFileNeeds}</p>
      </td>

      {/* Severity */}
      <td className="px-6 py-5 align-top">
        <span
          className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold tracking-wide uppercase ${severity.bg} ${severity.text}`}
        >
          {gap.severity}
        </span>
        <p className="text-text-tertiary mt-1.5 text-xs font-medium">
          {categoryLabels[gap.category]}
        </p>
      </td>
    </tr>
  );
}
