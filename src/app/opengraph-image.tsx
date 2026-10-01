import { ImageResponse } from 'next/og';

// Default share card for every page (pages without their own image inherit it).
export const alt = 'Free North Korea: understand North Korea, help its people';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: '#0b1120',
          color: '#f1f5f9',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 34, fontWeight: 700 }}>
          <div style={{ width: 44, height: 44, borderRadius: 22, background: '#dc2626' }} />
          Free North Korea
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>Understand North Korea. Help free its people.</div>
          <div style={{ fontSize: 30, color: '#a3b1c6' }}>Atlas · Military · Missile tests · Organizations · Library · How to help</div>
        </div>
      </div>
    ),
    size,
  );
}
