import { RequestPrivateButton } from '@/components/Gallery/RequestPrivateButton';

interface Props {
  slug: string;
  companyName: string;
  criticalGaps: number;
  totalGaps: number;
  readabilityScore: string | undefined;
  rawFileHref: string;
}

export function AuditStatsRail({
  slug,
  companyName,
  criticalGaps,
  totalGaps,
  readabilityScore,
  rawFileHref,
}: Props) {
  return (
    <div className="border-border-primary bg-background-secondary flex flex-col gap-5 rounded-2xl border p-6">
      <div className="flex flex-col gap-2">
        <a
          href={rawFileHref}
          download={`${slug}.llms.gist`}
          className="bg-brand-primary hover:bg-brand-hover inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-white"
        >
          ⬇ Download llms.gist
        </a>
        <a
          href={rawFileHref}
          target="_blank"
          rel="noreferrer"
          className="text-ink-secondary hover:text-ink-primary text-center text-xs"
        >
          View raw →
        </a>
      </div>

      <dl className="border-border-primary divide-border-primary border-border-primary grid grid-cols-3 divide-x border-y py-4 text-center">
        <Stat
          label="Critical"
          value={`${criticalGaps}`}
          tone={criticalGaps > 0 ? 'red' : 'muted'}
        />
        <Stat label="Issues" value={`${totalGaps}`} />
        <Stat label="Readability" value={readabilityScore ?? '—'} />
      </dl>

      <p className="text-ink-tertiary text-xs leading-relaxed">
        Not affiliated with {companyName}. A public audit + patch generated from how ChatGPT and
        Claude describe the product today.
      </p>

      <RequestPrivateButton refSlug={slug} variant="subtle" size="sm" />
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: 'red' | 'muted' }) {
  const valueClass =
    tone === 'red'
      ? 'text-red-700 font-bold'
      : tone === 'muted'
        ? 'text-ink-tertiary font-bold'
        : 'text-ink-primary font-bold';
  return (
    <div className="px-2">
      <p className={`text-lg ${valueClass}`}>{value}</p>
      <p className="text-ink-tertiary mt-0.5 text-[10px] tracking-wide uppercase">{label}</p>
    </div>
  );
}
