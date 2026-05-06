import { Gap, GapCategory, GapSeverity, LLMProvider } from '@/types/audit';

interface GapItemProps {
  gap: Gap;
}

const severityConfig: Record<GapSeverity, { bg: string; text: string }> = {
  critical: { bg: 'bg-red-50 ring-1 ring-red-200', text: 'text-red-700' },
  high: { bg: 'bg-amber-50 ring-1 ring-amber-200', text: 'text-amber-800' },
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
  const severity = severityConfig[gap.severity] || severityConfig.high;
  const evidence = gap.evidence;

  return (
    <tr className="border-border-primary border-b last:border-b-0">
      {/* Issue + Evidence */}
      <td className="px-6 py-5 align-top">
        <p className="text-ink-primary text-sm leading-relaxed">{gap.description}</p>

        {/* Conflict evidence quotes */}
        {evidence && (evidence.chatgptSays || evidence.claudeSays || evidence.siteContent) && (
          <div className="mt-3 space-y-2">
            {evidence.chatgptSays && (
              <div className="flex items-start gap-2">
                <span className="bg-background-secondary text-ink-tertiary mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase">
                  ChatGPT
                </span>
                <p className="text-ink-tertiary text-xs leading-relaxed italic">
                  &ldquo;{evidence.chatgptSays}&rdquo;
                </p>
              </div>
            )}
            {evidence.claudeSays && (
              <div className="flex items-start gap-2">
                <span className="bg-background-secondary text-ink-tertiary mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase">
                  Claude
                </span>
                <p className="text-ink-tertiary text-xs leading-relaxed italic">
                  &ldquo;{evidence.claudeSays}&rdquo;
                </p>
              </div>
            )}
            {evidence.siteContent && (
              <div className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800 uppercase ring-1 ring-emerald-200">
                  Site
                </span>
                <p className="text-xs leading-relaxed text-emerald-800 italic">
                  &ldquo;{evidence.siteContent}&rdquo;
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-ink-tertiary text-xs">Affected:</span>
          {gap.modelsAffected.map((model) => (
            <span
              key={model}
              className="bg-background-secondary text-ink-secondary rounded-md px-2 py-0.5 text-xs font-medium"
            >
              {providerNames[model]}
            </span>
          ))}
        </div>
      </td>

      {/* Fix */}
      <td className="px-6 py-5 align-top">
        <p className="text-ink-secondary text-sm leading-relaxed">{gap.whatFileNeeds}</p>
      </td>

      {/* Severity */}
      <td className="px-6 py-5 align-top">
        <span
          className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold tracking-wide uppercase ${severity.bg} ${severity.text}`}
        >
          {gap.severity}
        </span>
        <p className="text-ink-tertiary mt-1.5 text-xs font-medium">
          {categoryLabels[gap.category]}
        </p>
      </td>
    </tr>
  );
}
