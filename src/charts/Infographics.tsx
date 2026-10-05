/**
 * Poster-style pictures for the comparison pages (Visual Capitalist is the reference): a "tale of the tape" of mirrored
 * bars, a stripe timeline where each year is one coloured cell, and people drawn to scale. All server-rendered HTML and
 * SVG, so they show without JavaScript; <Reveal> only adds the grow-in.
 */
import type { CSSProperties } from 'react';
import Reveal from '@/components/Reveal';
import { ENTITY_LABEL } from '@/content/series';
import type { Lang } from '@/site/seo';
import { getSeries, LOCALE } from './data';

/* ---------- tale of the tape ---------- */

export type TapeRow = {
  label: string;
  /** year and unit, shown under the label */
  meta: string;
  p: number;
  k: number;
  digits?: number;
  prefix?: string;
  suffix?: string;
  /** the gap in words: "26×", "+10.7" */
  chip?: string;
};

/** Mirrored bars: North Korea grows to the left, South Korea to the right, the metric sits in the middle. */
export function TaleOfTape({ rows, lang }: { rows: TapeRow[]; lang: Lang }) {
  const nf = (v: number, d = 1) => new Intl.NumberFormat(LOCALE[lang], { maximumFractionDigits: d }).format(v);
  return (
    <Reveal className="tape">
      <div className="tape-head">
        <span className="prk display">{ENTITY_LABEL.PRK[lang]}</span>
        <span className="kor display">{ENTITY_LABEL.KOR[lang]}</span>
      </div>
      {rows.map((r, i) => {
        const max = Math.max(r.p, r.k) || 1;
        const val = (v: number) => (
          <b className="display">
            {r.prefix}
            {nf(v, r.digits ?? 1)}
            {r.suffix && <small>{r.suffix}</small>}
          </b>
        );
        return (
          <div className="tape-row" key={r.label} style={{ '--i': i } as CSSProperties}>
            <div className="tape-side prk">
              {val(r.p)}
              <span className="tape-bar">
                <i style={{ width: `${Math.max(1.5, (r.p / max) * 100)}%` }} />
              </span>
            </div>
            <div className="tape-mid">
              <span>{r.label}</span>
              <small>{r.meta}</small>
              {r.chip && <em>{r.chip}</em>}
            </div>
            <div className="tape-side kor">
              <span className="tape-bar">
                <i style={{ width: `${Math.max(1.5, (r.k / max) * 100)}%` }} />
              </span>
              {val(r.k)}
            </div>
          </div>
        );
      })}
    </Reveal>
  );
}

/* ---------- stripe timeline ---------- */

/** Sequential ramp for a 0 to 1 index: dark → orange → gold. Lightness rises the whole way, so it reads in greyscale. */
const ramp = (v: number) =>
  v <= 0.5
    ? `color-mix(in oklab, var(--st-mid) ${Math.round(v * 200)}%, var(--stripe-lo))`
    : `color-mix(in oklab, var(--st-hi) ${Math.round((v - 0.5) * 200)}%, var(--st-mid))`;

/**
 * One row per country, one cell per year, coloured from dim (0) to bright gold (1). Works for any 0 to 1 index; each
 * cell carries its value in a native tooltip, and the full interactive chart is one click away.
 */
export function Stripes({
  id,
  entities,
  from,
  lang,
  marks,
  low,
  high,
}: {
  id: string;
  entities: string[];
  from: number;
  lang: Lang;
  marks: { x: number; label: string }[];
  low: string;
  high: string;
}) {
  const s = getSeries(id);
  const rows = entities.map((e) => ({ e, pts: new Map(s.entities[e].map(([t, v]) => [Number(t), v])) }));
  const to = Math.max(...rows.flatMap((r) => [...r.pts.keys()]));
  const years = Array.from({ length: to - from + 1 }, (_, i) => from + i);
  const pc = (y: number) => `${((y - from) / years.length) * 100}%`;
  const nf = new Intl.NumberFormat(LOCALE[lang], { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  return (
    <Reveal className="stripes">
      <div className="stripes-marks" aria-hidden="true">
        {marks.map((m) => (
          <span key={m.x} style={{ left: pc(m.x) }}>
            <b>{m.x}</b> {m.label}
          </span>
        ))}
      </div>
      {rows.map(({ e, pts }) => (
        <div className="stripes-row" key={e}>
          <span className={`stripes-name ${e.toLowerCase()}`}>{ENTITY_LABEL[e]?.[lang] ?? e}</span>
          <div className="stripes-cells">
            {years.map((y, i) => {
              const v = pts.get(y);
              return (
                <i
                  key={y}
                  title={v === undefined ? String(y) : `${ENTITY_LABEL[e]?.[lang] ?? e} ${y}: ${nf.format(v)}`}
                  className={v === undefined ? 'none' : ''}
                  style={{ background: ramp(v ?? 0), '--d': `${i * 8}ms` } as CSSProperties}
                />
              );
            })}
            {marks.map((m) => (
              <span key={m.x} className="stripes-line" style={{ left: pc(m.x) }} />
            ))}
          </div>
        </div>
      ))}
      <div className="stripes-axis" aria-hidden="true">
        <span />
        <div>
          {years
            .filter((y) => y % 10 === 0)
            .map((y) => (
              <span key={y} style={{ left: pc(y) }}>
                {y}
              </span>
            ))}
        </div>
      </div>
      <div className="stripes-legend">
        <span>0 · {low}</span>
        <i aria-hidden="true" />
        <span>1 · {high}</span>
      </div>
    </Reveal>
  );
}

/* ---------- people to scale ---------- */

/** Pictogram figures in a 40 × 100 box. */
function Figure({ kind, x, h, cls }: { kind: 'man' | 'woman'; x: number; h: number; cls: string }) {
  const k = h / 100;
  return (
    <g transform={`translate(${x - 20 * k},${GROUND - h}) scale(${k})`} className={`fig ${cls}`}>
      <circle cx={20} cy={8} r={7.6} />
      {kind === 'man' ? (
        <>
          <rect x={9} y={18.5} width={22} height={36} rx={5} />
          <rect x={2} y={19.5} width={6} height={33} rx={3} />
          <rect x={32} y={19.5} width={6} height={33} rx={3} />
          <rect x={9.5} y={51} width={9.8} height={49} rx={4} />
          <rect x={20.7} y={51} width={9.8} height={49} rx={4} />
        </>
      ) : (
        <>
          <path d="M13 18.5h14q4.2 0 5 4.6L37 66H3l5-42.9q.8-4.6 5-4.6z" />
          <rect x={1.5} y={20} width={5.5} height={30} rx={2.75} />
          <rect x={33} y={20} width={5.5} height={30} rx={2.75} />
          <rect x={11} y={62} width={7.5} height={38} rx={3.2} />
          <rect x={21.5} y={62} width={7.5} height={38} rx={3.2} />
        </>
      )}
    </g>
  );
}

const GROUND = 380;
const PX_PER_CM = 1.65;

/** Men and women of North and South Korea drawn at true scale against a centimetre ruler. */
export function PeopleToScale({ lang, men, women, labels }: { lang: Lang; men: [number, number]; women: [number, number]; labels: { men: string; women: string; born: string } }) {
  const nf = (v: number) => new Intl.NumberFormat(LOCALE[lang], { maximumFractionDigits: 1 }).format(v);
  const W = 640;
  const ticks = [50, 100, 150];
  const groups = [
    { label: labels.men, kind: 'man' as const, v: men, x: [110, 225] },
    { label: labels.women, kind: 'woman' as const, v: women, x: [415, 530] },
  ];
  return (
    <Reveal className="people">
      <svg viewBox={`0 0 ${W} ${GROUND + 34}`} role="img" aria-label={`${labels.men} ${labels.born}: ${nf(men[0])} / ${nf(men[1])} cm. ${labels.women}: ${nf(women[0])} / ${nf(women[1])} cm.`}>
        {ticks.map((t) => (
          <g key={t} className="ruler">
            <line x1={36} x2={W} y1={GROUND - t * PX_PER_CM} y2={GROUND - t * PX_PER_CM} />
            <text x={0} y={GROUND - t * PX_PER_CM + 5}>
              {t}
            </text>
          </g>
        ))}
        <line x1={36} x2={W} y1={GROUND} y2={GROUND} className="ground" />
        {groups.map((g) => {
          const hp = g.v[0] * PX_PER_CM;
          const hk = g.v[1] * PX_PER_CM;
          const mid = (g.x[0] + g.x[1]) / 2;
          return (
            <g key={g.label}>
              {/* dashed line at the shorter person's head, carried across to show the gap */}
              <line x1={g.x[0] - 34} x2={g.x[1] + 34} y1={GROUND - hp} y2={GROUND - hp} className="head-line prk" />
              <line x1={g.x[0] - 34} x2={g.x[1] + 34} y1={GROUND - hk} y2={GROUND - hk} className="head-line kor" />
              <Figure kind={g.kind} x={g.x[0]} h={hp} cls="prk" />
              <Figure kind={g.kind} x={g.x[1]} h={hk} cls="kor" />
              <text x={g.x[0]} y={GROUND - hp - 14} textAnchor="middle" className="fig-val prk">
                {nf(g.v[0])}
              </text>
              <text x={g.x[1]} y={GROUND - hk - 14} textAnchor="middle" className="fig-val kor">
                {nf(g.v[1])}
              </text>
              <g className="fig-gap">
                <rect x={mid - 32} y={GROUND - hk - 76} width={64} height={24} rx={12} />
                <text x={mid} y={GROUND - hk - 59.5} textAnchor="middle">
                  +{nf(g.v[1] - g.v[0])} cm
                </text>
              </g>
              <text x={mid} y={GROUND + 26} textAnchor="middle" className="fig-group">
                {g.label} · {labels.born}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="people-key">
        <span className="prk">{ENTITY_LABEL.PRK[lang]}</span>
        <span className="kor">{ENTITY_LABEL.KOR[lang]}</span>
      </div>
    </Reveal>
  );
}
