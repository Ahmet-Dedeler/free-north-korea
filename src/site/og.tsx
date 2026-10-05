import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

// The Korean peninsula at night (NASA Black Marble 2016, public domain): lit-up South, dark North. It sits on the
// right of every card so a shared link is recognisable before anyone reads it. Cropped from
// public/img/pages/korea-at-night.jpg; inlined because the card renders at build time with no server to fetch from.
const NIGHT = `data:image/jpeg;base64,${readFileSync(join(process.cwd(), 'public/img/pages/korea-at-night-og.jpg')).toString('base64')}`;

export type OgStat = { value: string; label: string; color?: string };

/**
 * The share card every page uses: the night photo on the right, then site mark, kicker, title, one line under it
 * and optional big numbers. Each `opengraph-image.tsx` calls this with its own text, so a shared link shows what
 * the page is about. Colours are literal because this renders to a PNG outside the page (no CSS tokens there).
 */
export function ogCard({ kicker, title, sub, stats }: { kicker?: string; title: string; sub?: string; stats?: OgStat[] }) {
  // long titles shrink so they never run off the card (the text column is ~760px wide)
  const fontSize = title.length > 70 ? 46 : title.length > 44 ? 54 : 64;
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', background: '#0b1120', color: '#f1f5f9', fontFamily: 'sans-serif' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={NIGHT} width={460} height={630} style={{ position: 'absolute', right: 0, top: 0, width: 460, height: 630, objectFit: 'cover' }} alt="" />
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: 460,
            height: 630,
            display: 'flex',
            background: 'linear-gradient(90deg, #0b1120 0%, rgba(11,17,32,0.55) 35%, rgba(11,17,32,0) 70%)',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 820, height: '100%', padding: '64px 0 64px 72px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 30, fontWeight: 700 }}>
            <svg width="40" height="40" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#dc2626" />
              <path d="M12 6.2l1.6 3.9 4.2.3-3.2 2.7 1 4.1L12 15l-3.6 2.2 1-4.1-3.2-2.7 4.2-.3z" fill="#ffffff" />
            </svg>
            Free North Korea
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {kicker && <div style={{ fontSize: 24, fontWeight: 700, color: '#f87171', textTransform: 'uppercase', letterSpacing: 2 }}>{kicker}</div>}
            <div style={{ fontSize, fontWeight: 800, lineHeight: 1.08, letterSpacing: -1.5 }}>{title}</div>
            {sub && <div style={{ fontSize: 26, color: '#a3b1c6', lineHeight: 1.35 }}>{sub.length > 120 ? sub.slice(0, 117).trimEnd() + '…' : sub}</div>}
            {stats && stats.length > 0 && (
              <div style={{ display: 'flex', gap: 36, marginTop: 14 }}>
                {stats.map((s) => (
                  <div key={s.label} style={{ display: 'flex', flexDirection: 'column', gap: 4, borderLeft: `4px solid ${s.color ?? '#dc2626'}`, paddingLeft: 14 }}>
                    <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1 }}>{s.value}</div>
                    <div style={{ fontSize: 19, color: '#a3b1c6', maxWidth: 200, lineHeight: 1.25 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
