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
  contradiction: 'Contradiction',
  fabrication: 'Fabrication',
  category_conflict: 'Category Conflict',
  shared_inaccuracy: 'Shared Inaccuracy',
  audience_mismatch: 'Audience Mismatch',
  missing_differentiator: 'Missing Differentiator',
  pricing_confusion: 'Pricing Confusion',
};

const providerNames: Record<LLMProvider, string> = {
  chatgpt: 'ChatGPT',
  claude: 'Claude',
};

export function GapItem({ gap }: GapItemProps) {
  const severity = severityConfig[gap.severity] || severityConfig.medium;
  const evidence = gap.evidence;

  return (
    <tr className="border-border-light border-b last:border-b-0">
      {/* Issue + Evidence */}
      <td className="px-6 py-5 align-top">
        <p className="text-text-primary text-sm leading-relaxed">{gap.description}</p>

        {/* Conflict evidence quotes */}
        {evidence && (evidence.chatgptSays || evidence.claudeSays || evidence.siteContent) && (
          <div className="mt-3 space-y-2">
            {evidence.chatgptSays && (
              <div className="flex items-start gap-2">
                <span className="bg-bg-secondary text-text-tertiary mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase">
                  ChatGPT
                </span>
                <p className="text-text-tertiary text-xs leading-relaxed italic">
                  &ldquo;{evidence.chatgptSays}&rdquo;
                </p>
              </div>
            )}
            {evidence.claudeSays && (
              <div className="flex items-start gap-2">
                <span className="bg-bg-secondary text-text-tertiary mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase">
                  Claude
                </span>
                <p className="text-text-tertiary text-xs leading-relaxed italic">
                  &ldquo;{evidence.claudeSays}&rdquo;
                </p>
              </div>
            )}
            {evidence.siteContent && (
              <div className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0 rounded bg-green-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-green-400 uppercase">
                  Site
                </span>
                <p className="text-xs leading-relaxed text-green-400/80 italic">
                  &ldquo;{evidence.siteContent}&rdquo;
                </p>
              </div>
            )}
          </div>
        )}

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
