import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

/**
 * The share card every page uses: dark background, site mark, a kicker, the page title and one line under it.
 * Each `opengraph-image.tsx` calls this with its own text, so a shared link shows what the page is about.
 * Colours are literal because this renders to a PNG outside the page (no CSS tokens there).
 */
export function ogCard({ kicker, title, sub }: { kicker?: string; title: string; sub?: string }) {
  // long titles shrink so they never run off the card
  const fontSize = title.length > 70 ? 54 : title.length > 44 ? 64 : 76;
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
          <svg width="44" height="44" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="#dc2626" />
            <path d="M12 6.2l1.6 3.9 4.2.3-3.2 2.7 1 4.1L12 15l-3.6 2.2 1-4.1-3.2-2.7 4.2-.3z" fill="#ffffff" />
          </svg>
          Free North Korea
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {kicker && <div style={{ fontSize: 28, fontWeight: 700, color: '#f87171', textTransform: 'uppercase', letterSpacing: 2 }}>{kicker}</div>}
          <div style={{ fontSize, fontWeight: 800, lineHeight: 1.08, letterSpacing: -1.5 }}>{title}</div>
          {sub && <div style={{ fontSize: 30, color: '#a3b1c6', lineHeight: 1.3 }}>{sub.length > 130 ? sub.slice(0, 127).trimEnd() + '…' : sub}</div>}
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
