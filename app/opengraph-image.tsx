import { ImageResponse } from 'next/og'

export const alt = 'Wacht Docs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          background:
            'radial-gradient(1200px 600px at 80% 10%, rgba(124, 58, 237, 0.18), transparent 60%),' +
            'radial-gradient(900px 600px at 10% 100%, rgba(168, 85, 247, 0.12), transparent 60%),' +
            '#050507',
          color: '#f5f5f7',
          fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
            }}
          />
          <div style={{ fontSize: 36, fontWeight: 600, letterSpacing: -0.5 }}>Wacht Docs</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: -1.5,
              maxWidth: 980,
            }}
          >
            Build with Wacht.
          </div>
          <div
            style={{
              fontSize: 28,
              color: '#a1a1aa',
              maxWidth: 900,
              lineHeight: 1.3,
            }}
          >
            Guides, SDK references, and API docs for identity, APIs, webhooks, and AI agents.
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            fontSize: 22,
            color: '#71717a',
          }}
        >
          <div>wacht.dev/docs</div>
          <div>Ship product, not plumbing.</div>
        </div>
      </div>
    ),
    { ...size },
  )
}
