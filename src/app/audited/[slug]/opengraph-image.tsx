import { ImageResponse } from 'next/og';
import { loadResult } from '@/lib/gallery/loadResults';
import { resolveLogo } from '@/lib/gallery/logo';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage({ params }: { params: { slug: string } }) {
  const entry = loadResult(params.slug);
  if (!entry) {
    return new ImageResponse(<div style={{ fontSize: 96 }}>Not found</div>, size);
  }
  const logo = resolveLogo(entry.simpleIcon);
  const headline = entry.headline;
  const eyebrow =
    headline?.category === 'fabrication'
      ? 'ChatGPT invented this'
      : headline?.category === 'category_conflict'
        ? 'The models disagree'
        : 'AI readability audit';
  const quote = headline?.chatgptSays ?? headline?.description ?? '';

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 72,
        background: '#FAFAF7',
        color: '#0F172A',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            background: logo.hex,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 36,
            fontWeight: 800,
          }}
        >
          {entry.name.charAt(0)}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 40, fontWeight: 700 }}>{entry.name}</div>
          <div style={{ fontSize: 20, color: '#64748B' }}>
            {new URL(entry.url).hostname.replace(/^www\./, '')}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div
          style={{
            fontSize: 22,
            color: '#6366F1',
            textTransform: 'uppercase',
            letterSpacing: 2,
            fontWeight: 600,
          }}
        >
          {eyebrow}
        </div>
        <div style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.15 }}>
          {truncate(headline?.description ?? `Audit of ${entry.name}`, 140)}
        </div>
        {quote && (
          <div
            style={{
              fontSize: 24,
              color: '#475569',
              fontStyle: 'italic',
              borderLeft: '4px solid #6366F1',
              paddingLeft: 18,
              maxWidth: 1000,
            }}
          >
            &ldquo;{truncate(quote, 180)}&rdquo;
          </div>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 20,
          color: '#64748B',
        }}
      >
        <div style={{ display: 'flex', gap: 12 }}>
          <Chip label="Readability" value={entry.readabilityScore ?? '—'} />
          <Chip label="Issues" value={`${entry.totalGaps ?? 0}`} />
          <Chip label="Critical" value={`${entry.criticalGaps ?? 0}`} />
        </div>
        <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 28 }}>gist.design</div>
      </div>
    </div>,
    size
  );
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        border: '1px solid #E2E8F0',
        borderRadius: 12,
        padding: '8px 16px',
      }}
    >
      <span style={{ fontSize: 13, color: '#94A3B8', textTransform: 'uppercase' }}>{label}</span>
      <span style={{ fontSize: 22, fontWeight: 700, color: '#0F172A' }}>{value}</span>
    </div>
  );
}

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max - 1) + '…' : s;
}
