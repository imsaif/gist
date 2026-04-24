import { ImageResponse } from 'next/og';
import { loadAllResults } from '@/lib/gallery/loadResults';
import { resolveLogo } from '@/lib/gallery/logo';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  const entries = loadAllResults().slice(0, 12);

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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div
          style={{
            fontSize: 22,
            color: '#6366F1',
            textTransform: 'uppercase',
            letterSpacing: 2,
            fontWeight: 600,
          }}
        >
          Audited
        </div>
        <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.1, maxWidth: 1040 }}>
          What ChatGPT and Claude actually say about 25 founder tools.
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {entries.map((e) => {
          const logo = resolveLogo(e.simpleIcon);
          return (
            <div
              key={e.slug}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: '#fff',
                border: '1px solid #E2E8F0',
                borderRadius: 16,
                padding: '10px 16px',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: logo.hex,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: 16,
                }}
              >
                {e.name.charAt(0)}
              </div>
              <span style={{ fontSize: 22, fontWeight: 600 }}>{e.name}</span>
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 24,
          color: '#64748B',
        }}
      >
        <span>One audit per page. Shareable.</span>
        <span style={{ fontWeight: 700, color: '#0F172A', fontSize: 32 }}>gist.design</span>
      </div>
    </div>,
    size
  );
}
