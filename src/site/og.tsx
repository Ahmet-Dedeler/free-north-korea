import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

// Full-bleed photo strip behind every card: a street in Wonsan (a wide shot, so no one is identifiable),
// Panmunjom on the border, and the peninsula at night (lit South, dark North). Built by scripts/og-background.py;
// inlined because the card renders at build time with no server to fetch from.
const BG = `data:image/jpeg;base64,${readFileSync(join(process.cwd(), 'public/img/pages/og-background.jpg')).toString('base64')}`;

export type OgStat = { value: string; label: string; color?: string };

// Rough rendered width in Latin-character units; CJK glyphs are about twice as wide as Latin ones.
const isWide = (c: string) => /[\u1100-\uffef]/.test(c);
const width = (s: string) => [...s].reduce((n, c) => n + (isWide(c) ? 1.9 : 1), 0);
function clip(s: string, max: number) {
  let out = '';
  for (const c of s) {
    if (width(out + c) > max) break;
    out += c;
  }
  return out.trimEnd();
}

/**
 * The share card every page uses: the photo strip as background, then site mark, kicker, title, one line under it
 * and optional big numbers. Each `opengraph-image.tsx` calls this with its own text, so a shared link shows what
 * the page is about. Colours are literal because this renders to a PNG outside the page (no CSS tokens there).
 *
 * Sized for phones: link previews (iMessage, WhatsApp, X, the GitHub README on mobile) show this card ~350px wide,
 * about a third of its size, so every line of text is set big and the text spans the full card width.
 */
export function ogCard({ kicker, title, sub, stats }: { kicker?: string; title: string; sub?: string; stats?: OgStat[] }) {
  // long titles shrink so they never run past three lines
  const len = width(title);
  const fontSize = len > 80 ? 60 : len > 56 ? 68 : len > 40 ? 76 : 86;
  // the line under the title gets one row next to stats and two rows otherwise
  const subMax = stats?.length ? 70 : 110;
  const subText = sub && (width(sub) > subMax ? clip(sub, subMax - 2) + '…' : sub);
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', background: '#0b1120', color: '#f8fafc', fontFamily: 'sans-serif' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={BG} width={1200} height={630} style={{ position: 'absolute', left: 0, top: 0, width: 1200, height: 630 }} alt="" />
        {/* dark wash under the text, clearing toward the top right so the night lights show through */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 1200,
            height: 630,
            display: 'flex',
            background: 'linear-gradient(90deg, rgba(11,17,32,0.7) 0%, rgba(11,17,32,0.72) 45%, rgba(11,17,32,0.45) 75%, rgba(11,17,32,0.15) 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 1200,
            height: 630,
            display: 'flex',
            background: 'linear-gradient(180deg, rgba(11,17,32,0) 45%, rgba(11,17,32,0.75) 100%)',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%', padding: '44px 52px 46px', textShadow: '0 2px 18px rgba(5,8,16,0.9)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 36, fontWeight: 700 }}>
            <svg width="48" height="48" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#dc2626" />
              <path d="M12 6.2l1.6 3.9 4.2.3-3.2 2.7 1 4.1L12 15l-3.6 2.2 1-4.1-3.2-2.7 4.2-.3z" fill="#ffffff" />
            </svg>
            Free North Korea
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {kicker && <div style={{ fontSize: 30, fontWeight: 700, color: '#f87171', textTransform: 'uppercase', letterSpacing: 2 }}>{kicker}</div>}
            <div style={{ fontSize, fontWeight: 800, lineHeight: 1.04, letterSpacing: -2 }}>{title}</div>
            {subText && <div style={{ fontSize: 32, color: '#cbd5e1', lineHeight: 1.3 }}>{subText}</div>}
            {stats && stats.length > 0 && (
              <div style={{ display: 'flex', gap: 28, marginTop: 18 }}>
                {stats.map((s) => (
                  <div key={s.label} style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 2, borderLeft: `6px solid ${s.color ?? '#dc2626'}`, paddingLeft: 18 }}>
                    <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05 }}>{s.value}</div>
                    <div style={{ fontSize: 27, color: '#e2e8f0', lineHeight: 1.2 }}>{s.label}</div>
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
