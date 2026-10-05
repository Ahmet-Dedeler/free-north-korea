'use client';
/**
 * Our World in Data style chart frame: title, entity toggles, chart / table tabs, hover crosshair, source line and
 * share buttons. Renders an SVG at the container's real width (server render uses a default width, so crawlers and
 * no-JS readers still get the chart and the table). Props come from chartProps() in ./data.ts.
 */
import { Download, Link2, Maximize2, Check } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { siX } from 'simple-icons';
import { SITE_URL } from '@/site/config';
import type { ChartProps } from './data';
import './charts.css';

const DEFAULT_W = 720;

/* ---------- scales and ticks ---------- */

function niceStep(span: number, count: number) {
  const raw = span / Math.max(count, 1);
  const mag = 10 ** Math.floor(Math.log10(raw));
  const n = raw / mag;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * mag;
}

function linearTicks(min: number, max: number, count: number) {
  const step = niceStep(max - min || 1, count);
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const out: number[] = [];
  for (let v = lo; v <= hi + step / 2; v += step) out.push(+v.toPrecision(12));
  return out;
}

function logTicks(min: number, max: number) {
  const out: number[] = [];
  for (let e = Math.floor(Math.log10(min)); e <= Math.ceil(Math.log10(max)); e++)
    for (const m of [1, 2, 5]) {
      const v = m * 10 ** e;
      if (v >= min / 1.01 && v <= max * 1.01) out.push(v);
    }
  return out;
}

function yearTicks(min: number, max: number, width: number) {
  const span = max - min || 1;
  const count = Math.max(2, Math.floor(width / 70));
  const steps = [1, 2, 5, 10, 20, 25, 50, 100];
  const step = steps.find((s) => span / s <= count) ?? 100;
  const out: number[] = [];
  for (let y = Math.ceil(min / step) * step; y <= max; y += step) out.push(y);
  return out;
}

/* ---------- formatting ---------- */

function makeFormat(locale: string) {
  const full = (v: number) =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: Math.abs(v) < 10 ? 2 : Math.abs(v) < 100 ? 1 : 0 }).format(v);
  const axis = (v: number) => new Intl.NumberFormat(locale, { notation: Math.abs(v) >= 10000 ? 'compact' : 'standard', maximumFractionDigits: Math.abs(v) >= 10000 ? 1 : 2 }).format(v);
  return { full, axis };
}

/** Rough rendered width of a label at 12.5px: CJK glyphs are about twice as wide as Latin ones. */
function textW(s: string) {
  let w = 0;
  for (const ch of s) w += /[\u1100-\u11ff\u3000-\u9fff\uac00-\ud7af\uff00-\uffef]/.test(ch) ? 12.5 : 7;
  return w;
}

function timeLabel(t: string, dated: boolean, locale: string) {
  if (!dated) return t;
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(t + 'T00:00:00Z'));
}

/* ---------- component ---------- */

export default function ChartView(p: ChartProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(DEFAULT_W);
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<'chart' | 'table'>('chart');
  const [hover, setHover] = useState<number | null>(null); // index into xs
  const [copied, setCopied] = useState(false);
  const [logOn, setLogOn] = useState(p.log);
  const fmt = useMemo(() => makeFormat(p.locale), [p.locale]);
  const stacked = p.kind !== 'line';
  const canLog = !stacked && p.lines.every((l) => l.pts.every((q) => q[1] > 0));
  const log = logOn && canLog;
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  // Lines draw themselves in when the chart scrolls into view. Only charts that start below the fold are armed, so
  // nothing visible ever blinks, and without JavaScript (or with reduced motion) the chart is simply there.
  const [anim, setAnim] = useState<'' | 'pre' | 'go'>('');
  useEffect(() => {
    const el = wrap.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < innerHeight * 0.9) return;
    setAnim('pre');
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setAnim('go');
        io.disconnect();
      },
      { rootMargin: '0px 0px -20% 0px' }, // fires once the top fifth of the screen is passed, whatever the chart's height
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const lines = p.lines.filter((l) => !hidden.has(l.key));
  const xs = useMemo(() => [...new Set(lines.flatMap((l) => l.pts.map((q) => q[0])))].sort((a, b) => a - b), [lines]);
  const tOf = useMemo(() => {
    const m = new Map<number, string>();
    for (const l of p.lines) for (const q of l.pts) m.set(q[0], q[2]);
    return m;
  }, [p.lines]);

  /* geometry */
  const narrow = width < 520;
  const H = p.compact ? 250 : Math.round(Math.min(480, Math.max(300, width * 0.56)));
  const endLabels = !stacked && !narrow && lines.length > 0;
  const endVal = (v: number) =>
    (Math.abs(v) >= 10000 ? fmt.axis(v) : new Intl.NumberFormat(p.locale, { maximumFractionDigits: Math.abs(v) < 1 ? 2 : Math.abs(v) < 100 ? 1 : 0 }).format(v)) + (p.unit === '%' ? '%' : '');
  const lastOf = (l: (typeof lines)[number]) => l.pts[l.pts.length - 1];
  const gapLines = p.gap && endLabels ? [lines.find((l) => l.key === p.gap!.hi), lines.find((l) => l.key === p.gap!.lo)] : [];
  const showGap = gapLines.length === 2 && gapLines.every((l) => l && l.pts.length);
  const gutter = showGap ? 16 : 0;
  const longest = Math.max(...lines.map((l) => textW(l.label) + (l.pts.length ? textW(endVal(lastOf(l)[1])) * 0.95 : 0)), 30);
  const right = endLabels ? Math.min(240, longest + 50 + gutter) : 12;

  let yMin = 0;
  let yMax = 1;
  if (stacked) {
    const totals = xs.map((x) => lines.reduce((s, l) => s + (l.pts.find((q) => q[0] === x)?.[1] ?? 0), 0));
    yMax = Math.max(1, ...totals);
  } else if (lines.length) {
    const vals = lines.flatMap((l) => l.pts.map((q) => q[1]));
    yMin = Math.min(...vals);
    yMax = Math.max(...vals);
    if (!log && yMin > 0 && yMin < yMax * 0.45) yMin = 0; // start at zero unless the data sits far above it
    if (yMin < 0) yMin = Math.min(yMin, 0);
  }
  if (log) yMin = Math.max(yMin, Math.min(...lines.flatMap((l) => l.pts.map((q) => q[1]).filter((v) => v > 0)), yMax));
  const yt = log ? logTicks(yMin, yMax) : linearTicks(yMin, yMax, H < 260 ? 4 : 5);
  const y0 = log ? yMin : yt[0];
  const y1 = log ? yMax : yt[yt.length - 1];
  const left = Math.max(...yt.map((v) => fmt.axis(v).length + (p.unit === '%' ? 1 : 0))) * 7 + 10;
  const top = p.bands.length && !stacked ? 22 : 12;
  const bottom = 26;
  const plotW = Math.max(40, width - left - right);
  const plotH = H - top - bottom;

  const xMin = xs[0] ?? 0;
  const xMax = xs[xs.length - 1] ?? 1;
  const band = stacked ? plotW / Math.max(xs.length, 1) : 0;
  const sx = (x: number) => (stacked ? left + (xs.indexOf(x) + 0.5) * band : left + ((x - xMin) / (xMax - xMin || 1)) * plotW);
  const sy = (v: number) =>
    log
      ? top + plotH - ((Math.log10(Math.max(v, y0)) - Math.log10(y0)) / (Math.log10(y1) - Math.log10(y0) || 1)) * plotH
      : top + plotH - ((v - y0) / (y1 - y0 || 1)) * plotH;
  const xt = stacked ? yearTicks(xMin, xMax, plotW).filter((x) => xs.includes(x)) : yearTicks(xMin, xMax, plotW);

  /* end labels, pushed apart so they never overlap */
  const labels = endLabels
    ? lines
        .filter((l) => l.pts.length)
        .map((l) => ({ l, py: sy(lastOf(l)[1]), px: sx(lastOf(l)[0]), y: sy(lastOf(l)[1]) }))
        .sort((a, b) => a.y - b.y)
    : [];
  for (let i = 1; i < labels.length; i++) if (labels[i].y - labels[i - 1].y < 22) labels[i].y = labels[i - 1].y + 22;
  // if the push ran off the bottom, slide the whole stack back up
  const over = labels.length ? labels[labels.length - 1].y - (top + plotH + 4) : 0;
  if (over > 0) for (const o of labels) o.y -= over;
  for (let i = labels.length - 2; i >= 0; i--) if (labels[i + 1].y - labels[i].y < 22) labels[i].y = labels[i + 1].y - 22;
  const labelX = left + plotW + 12 + gutter;

  /* written callouts: a ring on the point, a leader line, and the text where there is room */
  const callouts = narrow
    ? []
    : p.notes.flatMap((n) => {
        const l = lines.find((q) => q.key === n.key);
        if (!l || !l.pts.length) return [];
        let q = l.pts[0];
        for (const c of l.pts) if (Math.abs(c[0] - n.x) < Math.abs(q[0] - n.x)) q = c;
        if (Math.abs(q[0] - n.x) > 1.5) return [];
        const px = sx(q[0]);
        const py = sy(q[1]);
        const up = n.side ? n.side === 'up' : py > top + plotH * 0.45;
        // Wrap to about 190px. Text with spaces (English, Korean) breaks between words; Japanese breaks between
        // characters but keeps runs like "$2,624" or "1996年" whole.
        const spaced = n.text.includes(' ');
        const tokens = spaced ? n.text.split(' ') : (n.text.match(/[\x21-\x7e]+|./gu) ?? []);
        const out: string[] = [];
        for (const word of tokens) {
          const last = out[out.length - 1];
          const next = last === undefined ? word : last + (spaced ? ' ' : '') + word;
          if (last !== undefined && textW(next) <= 190) out[out.length - 1] = next;
          else out.push(word);
        }
        const lh = 15;
        const block = out.length * lh;
        const ly = up ? Math.max(top + 4, py - 34 - block) : Math.min(top + plotH - block - 4, py + 30);
        const anchor: 'start' | 'end' = px > left + plotW * 0.62 ? 'end' : 'start';
        return [{ n, l, px, py, lines: out, ly, up, anchor, lh }];
      });

  /* gap callout: a bracket in the gutter between two lines' latest values, with the ratio or difference */
  let gap: { x: number; y1: number; y2: number; my: number; text: string; px: number } | null = null;
  if (showGap) {
    const [hi, lo] = gapLines as (typeof lines)[number][];
    const a = lastOf(hi);
    const b = lastOf(lo);
    const y1 = Math.min(sy(a[1]), sy(b[1]));
    const y2 = Math.max(sy(a[1]), sy(b[1]));
    const r = a[1] / b[1];
    const text = p.gap!.mode === 'ratio' ? `${fmt.full(r >= 10 ? Math.round(r) : Math.round(r * 10) / 10)}×` : `+${fmt.full(Math.round((a[1] - b[1]) * 10) / 10)}`;
    if (y2 - y1 >= 22) {
      const others = labels.filter((o) => o.l !== hi && o.l !== lo).map((o) => o.py);
      // put the pill near the middle, but clear of the other lines' end points
      const mid = (y1 + y2) / 2;
      let my = mid;
      let best = -Infinity;
      for (let y = y1 + 13; y <= y2 - 13; y += 2) {
        const score = Math.min(30, ...others.map((o) => Math.abs(o - y))) - Math.abs(y - mid) * 0.05;
        if (score > best) {
          best = score;
          my = y;
        }
      }
      gap = { x: left + plotW + 9, y1, y2, my, text, px: left + plotW - 6 };
    }
  }

  /* hover */
  function pick(clientX: number, rect: DOMRect) {
    const px = ((clientX - rect.left) / rect.width) * width;
    if (!xs.length) return;
    let best = 0;
    for (let i = 1; i < xs.length; i++) if (Math.abs(sx(xs[i]) - px) < Math.abs(sx(xs[best]) - px)) best = i;
    setHover(best);
  }
  const hx = hover !== null ? xs[hover] : null;
  const rows =
    hx === null
      ? []
      : lines
          .map((l) => {
            // nearest point on this line, only if it is close to the hovered time
            let q = l.pts[0];
            for (const c of l.pts) if (Math.abs(c[0] - hx) < Math.abs(q[0] - hx)) q = c;
            const close = q && (stacked || p.dated ? Math.abs(q[0] - hx) < 0.06 : q[0] === hx);
            return close ? { l, v: q[1] } : null;
          })
          .filter((r): r is { l: (typeof lines)[number]; v: number } => !!r)
          .sort((a, b) => (stacked ? 0 : b.v - a.v));
  const total = rows.reduce((s, r) => s + r.v, 0);
  const gHi = p.gap && rows.find((r) => r.l.key === p.gap!.hi);
  const gLo = p.gap && rows.find((r) => r.l.key === p.gap!.lo);
  const tipGap =
    gHi && gLo && gLo.v > 0
      ? p.gap!.mode === 'ratio'
        ? `${fmt.full(gHi.v / gLo.v >= 10 ? Math.round(gHi.v / gLo.v) : Math.round((gHi.v / gLo.v) * 10) / 10)}×`
        : `${gHi.v - gLo.v >= 0 ? '+' : ''}${fmt.full(Math.round((gHi.v - gLo.v) * 10) / 10)}`
      : '';

  // Annual series: short holes (up to 15 years, e.g. decade-only world estimates) are bridged with a faint dotted
  // line; longer ones (no estimates for North Korea 1944-1989) are left empty instead of faking a trend.
  const segs = (pts: [number, number, string][]) => {
    let solid = '';
    let bridge = '';
    pts.forEach((q, i) => {
      const xy = `${sx(q[0]).toFixed(1)},${sy(q[1]).toFixed(1)}`;
      const gap = i ? q[0] - pts[i - 1][0] : 0;
      if (!i || (!p.dated && gap > 15)) solid += `M${xy}`;
      else if (!p.dated && gap > 1.5) {
        bridge += `M${sx(pts[i - 1][0]).toFixed(1)},${sy(pts[i - 1][1]).toFixed(1)}L${xy}`;
        solid += `M${xy}`;
      } else solid += `L${xy}`;
    });
    return { solid, bridge };
  };

  // Shading. With a gap set, the space between the two compared lines is tinted (that space is the story); a chart
  // with one solid line gets a soft fill under it. Runs stop at holes in the data, so nothing is drawn across them.
  const base = top + plotH;
  const runs = (xsIn: number[]) => {
    const out: number[][] = [];
    let run: number[] = [];
    xsIn.forEach((x, i) => {
      if (i && !p.dated && x - xsIn[i - 1] > 1.5) {
        out.push(run);
        run = [];
      }
      run.push(x);
    });
    out.push(run);
    return out.filter((r) => r.length > 1);
  };
  const P = (x: number, v: number) => `${sx(x).toFixed(1)},${sy(v).toFixed(1)}`;
  let shade: { d: string; color: string; key: string } | null = null;
  const gHiL = p.gap && lines.find((l) => l.key === p.gap!.hi);
  const gLoL = p.gap && lines.find((l) => l.key === p.gap!.lo);
  if (!stacked && gHiL && gLoL) {
    const a = new Map(gHiL.pts.map((q) => [q[0], q[1]]));
    const b = new Map(gLoL.pts.map((q) => [q[0], q[1]]));
    const both = [...a.keys()].filter((x) => b.has(x)).sort((m, n) => m - n);
    const d = runs(both)
      .map((r) => 'M' + r.map((x) => P(x, a.get(x)!)).join('L') + 'L' + [...r].reverse().map((x) => P(x, b.get(x)!)).join('L') + 'Z')
      .join('');
    if (d) shade = { d, color: gHiL.color, key: 'gap' };
  } else if (!stacked && lines.length === 1 && !lines[0].dashed) {
    const l = lines[0];
    const v = new Map(l.pts.map((q) => [q[0], q[1]]));
    const d = runs(l.pts.map((q) => q[0]))
      .map((r) => `M${sx(r[0]).toFixed(1)},${base}L` + r.map((x) => P(x, v.get(x)!)).join('L') + `L${sx(r[r.length - 1]).toFixed(1)},${base}Z`)
      .join('');
    if (d) shade = { d, color: l.color, key: l.key };
  }

  /* actions */
  const shareUrl = SITE_URL + p.permalink;
  function downloadCsv() {
    const out = ['entity,time,value', ...p.lines.flatMap((l) => l.pts.map((q) => `${l.label},${q[2]},${q[1]}`))].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([out], { type: 'text/csv' }));
    a.download = `${p.id}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked: the link is still in the address bar of the full chart */
    }
  }

  const tableRows = useMemo(() => {
    const ts = [...new Set(p.lines.flatMap((l) => l.pts.map((q) => q[0])))].sort((a, b) => b - a);
    return ts.map((x) => ({ x, t: tOf.get(x) ?? String(x), vals: p.lines.map((l) => l.pts.find((q) => q[0] === x)?.[1]) }));
  }, [p.lines, tOf]);

  const unit = p.unit === '%' ? '%' : ` ${p.unit}`;

  return (
    <figure className={`chart${p.compact ? ' compact' : ''}${anim ? ` anim ${anim}` : ''}`} lang={p.lang}>
      <figcaption className="chart-head">
        <h3 className="display">{p.title}</h3>
        {p.sub && <p>{p.sub}</p>}
      </figcaption>

      <div className="chart-bar">
        {p.lines.length > 1 && (
          <div className="chart-legend" role="group" aria-label={p.title}>
            {p.lines.map((l) => (
              <button
                key={l.key}
                type="button"
                className={hidden.has(l.key) ? 'off' : ''}
                aria-pressed={!hidden.has(l.key)}
                onClick={() =>
                  setHidden((h) => {
                    const n = new Set(h);
                    if (n.has(l.key)) n.delete(l.key);
                    else if (n.size < p.lines.length - 1) n.add(l.key);
                    return n;
                  })
                }
              >
                <i className={stacked ? 'sw-box' : l.dashed ? 'sw-line dashed' : 'sw-line'} style={{ '--c': l.color } as React.CSSProperties} />
                {l.label}
              </button>
            ))}
          </div>
        )}
        {canLog && !p.compact && tab === 'chart' && (
          <div className="chart-tabs scale" role="group">
            <button type="button" aria-pressed={!log} onClick={() => setLogOn(false)}>
              {p.ui.linear}
            </button>
            <button type="button" aria-pressed={log} onClick={() => setLogOn(true)}>
              {p.ui.log}
            </button>
          </div>
        )}
        {!p.compact && (
          <div className="chart-tabs" role="tablist">
            <button type="button" role="tab" aria-selected={tab === 'chart'} onClick={() => setTab('chart')}>
              {p.ui.chart}
            </button>
            <button type="button" role="tab" aria-selected={tab === 'table'} onClick={() => setTab('table')}>
              {p.ui.table}
            </button>
          </div>
        )}
      </div>

      <div className="chart-body" ref={wrap}>
        {tab === 'chart' ? (
          <>
            <svg
              width={width}
              height={H}
              viewBox={`0 0 ${width} ${H}`}
              role="img"
              aria-label={`${p.title}. ${p.sub}`}
              tabIndex={0}
              onPointerMove={(e) => pick(e.clientX, e.currentTarget.getBoundingClientRect())}
              onPointerLeave={() => setHover(null)}
              onBlur={() => setHover(null)}
              onKeyDown={(e) => {
                if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
                e.preventDefault();
                setHover((h) => Math.min(xs.length - 1, Math.max(0, (h ?? xs.length) + (e.key === 'ArrowRight' ? 1 : -1))));
              }}
            >
              <defs>
                <pattern id={`${uid}-hatch`} width={6} height={6} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <line x1={0} y1={0} x2={0} y2={6} className="hatch" />
                </pattern>
                {stacked &&
                  lines.map((l, i) =>
                    i % 2 ? (
                      // every second stacked series is hatched (Everest style), so the stack never relies on colour alone
                      <pattern key={l.key} id={`${uid}-h-${l.key}`} width={7} height={7} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                        <rect width={7} height={7} style={{ fill: l.color }} />
                        <line x1={0} y1={0} x2={0} y2={7} className="bar-hatch" />
                      </pattern>
                    ) : null,
                  )}
                {shade && (
                  <linearGradient id={`${uid}-shade`} x1={0} y1={0} x2={0} y2={1}>
                    <stop offset="0%" style={{ stopColor: shade.color }} stopOpacity={shade.key === 'gap' ? 0.26 : 0.22} />
                    <stop offset="100%" style={{ stopColor: shade.color }} stopOpacity={shade.key === 'gap' ? 0.1 : 0} />
                  </linearGradient>
                )}
              </defs>
              {p.bands.map((b) => {
                const a = Math.max(b.from, xMin);
                const z = Math.min(b.to, xMax);
                if (stacked || z <= a) return null;
                const w = Math.max(3, sx(z) - sx(a));
                return (
                  <g key={b.label} className="chart-band">
                    <rect x={sx(a)} y={top} width={w} height={plotH} style={{ fill: `url(#${uid}-hatch)` }} />
                    <rect x={sx(a)} y={top} width={w} height={plotH} className="band-tint" />
                    <line x1={sx(a)} x2={sx(a)} y1={top} y2={top + plotH} />
                    <text x={sx(a) + w / 2} y={top - 2} textAnchor={sx(a) + w / 2 > left + plotW - 60 ? 'end' : sx(a) + w / 2 < left + 60 ? 'start' : 'middle'}>
                      {b.label}
                    </text>
                  </g>
                );
              })}
              <g className="chart-grid">
                {yt.map((v) => (
                  <g key={v}>
                    <line x1={left} x2={left + plotW} y1={sy(v)} y2={sy(v)} className={v === 0 ? 'zero' : ''} />
                    <text x={left - 6} y={sy(v) + 4} textAnchor="end">
                      {fmt.axis(v)}
                      {p.unit === '%' ? '%' : ''}
                    </text>
                  </g>
                ))}
                {xt.map((x) => (
                  <text key={x} x={sx(x)} y={H - 8} textAnchor="middle">
                    {Math.round(x)}
                  </text>
                ))}
              </g>

              {shade && <path d={shade.d} className="area" style={{ fill: `url(#${uid}-shade)` }} />}
              {stacked
                ? xs.map((x) => {
                    let acc = 0;
                    const w = Math.max(2, Math.min(52, band * 0.78));
                    return (
                      <g key={x} className={hx === x ? 'bar on' : 'bar'}>
                        {lines.map((l, i) => {
                          const v = l.pts.find((q) => q[0] === x)?.[1] ?? 0;
                          if (!v) return null;
                          const yTop = sy(acc + v);
                          const yBot = sy(acc);
                          acc += v;
                          return (
                            <rect
                              key={l.key}
                              x={sx(x) - w / 2}
                              y={yTop}
                              width={w}
                              height={Math.max(0.5, yBot - yTop)}
                              rx={w > 10 ? 3 : 0}
                              style={{ fill: i % 2 ? `url(#${uid}-h-${l.key})` : l.color }}
                            />
                          );
                        })}
                        {!p.compact && w >= 24 && acc > 0 && (
                          <text x={sx(x)} y={sy(acc) - 6} textAnchor="middle" className="bar-total">
                            {fmt.axis(acc)}
                          </text>
                        )}
                      </g>
                    );
                  })
                : [...lines].reverse().map((l) => {
                    const { solid, bridge } = segs(l.pts);
                    const last = l.pts[l.pts.length - 1];
                    return (
                      <g key={l.key} className="series">
                        {bridge && <path d={bridge} className="line bridge" style={{ stroke: l.color }} />}
                        <path d={solid} pathLength={l.dashed ? undefined : 1} className={l.dashed ? 'line dashed' : 'line solid'} style={{ stroke: l.color }} />
                        {l.pts.length < 12 && l.pts.map((q) => <circle key={q[0]} cx={sx(q[0])} cy={sy(q[1])} r={3} className="dot" style={{ fill: l.color }} />)}
                        {last && l.pts.length >= 12 && <circle cx={sx(last[0])} cy={sy(last[1])} r={3.5} className="dot end" style={{ fill: l.color }} />}
                      </g>
                    );
                  })}

              {gap && (
                <g className="chart-gap">
                  <path d={`M${gap.x - 4},${gap.y1 + 1}H${gap.x}V${gap.y2 - 1}H${gap.x - 4}`} />
                  <line x1={gap.x} x2={gap.px} y1={gap.my} y2={gap.my} />
                  <rect x={gap.px - textW(gap.text) * 1.1 - 12} y={gap.my - 11} width={textW(gap.text) * 1.1 + 12} height={22} rx={11} />
                  <text x={gap.px - (textW(gap.text) * 1.1 + 12) / 2} y={gap.my + 4.5} textAnchor="middle">
                    {gap.text}
                  </text>
                </g>
              )}

              {callouts.map((c) => {
                const tx = c.anchor === 'start' ? c.px - 2 : c.px + 2;
                const edge = c.up ? c.ly + c.lines.length * c.lh - 2 : c.ly - 6;
                return (
                  <g key={`${c.n.key}-${c.n.x}`} className="chart-note">
                    <line x1={c.px} x2={c.px} y1={c.up ? c.py - 7 : c.py + 7} y2={edge} />
                    <circle cx={c.px} cy={c.py} r={6} style={{ stroke: c.l.color }} />
                    <text x={tx} y={c.ly + 11} textAnchor={c.anchor}>
                      {c.lines.map((t, i) => (
                        <tspan key={i} x={tx} dy={i ? c.lh : 0}>
                          {t}
                        </tspan>
                      ))}
                    </text>
                  </g>
                );
              })}

              {labels.map(({ l, y, py, px }) => {
                const w = textW(l.label) * 0.97 + 16;
                return (
                  <g key={l.key} className="chart-end">
                    {Math.abs(y - py) > 3 && <path d={`M${px + 5},${py}L${labelX - 8},${y}L${labelX - 4},${y}`} className="leader" />}
                    <rect x={labelX} y={y - 10} width={w} height={20} rx={10} style={{ fill: l.color }} />
                    <text x={labelX + w / 2} y={y + 4.2} textAnchor="middle" className="end-name">
                      {l.label}
                    </text>
                    <text x={labelX + w + 6} y={y + 4.2} className="end-val">
                      {endVal(lastOf(l)[1])}
                    </text>
                  </g>
                );
              })}

              {hx !== null && (
                <g className="chart-hover" pointerEvents="none">
                  {!stacked && <line x1={sx(hx)} x2={sx(hx)} y1={top} y2={top + plotH} />}
                  {!stacked && rows.map((r) => <circle key={r.l.key} cx={sx(hx)} cy={sy(r.v)} r={4.5} style={{ fill: r.l.color }} />)}
                </g>
              )}
            </svg>
            {hx !== null && rows.length > 0 && (
              <div className="chart-tip" style={{ left: Math.min(Math.max(sx(hx), 90), width - 90), top: 6 }}>
                <b>{timeLabel(tOf.get(hx) ?? String(hx), p.dated, p.locale)}</b>
                <ul>
                  {rows.map((r) => (
                    <li key={r.l.key}>
                      <i className={stacked ? 'sw-box' : r.l.dashed ? 'sw-line dashed' : 'sw-line'} style={{ '--c': r.l.color } as React.CSSProperties} />
                      <strong>
                        {fmt.full(r.v)}
                        {unit === '%' ? '%' : ''}
                      </strong>
                      <span>{r.l.label}</span>
                    </li>
                  ))}
                  {tipGap && (
                    <li className="tip-gap">
                      <strong>{tipGap}</strong>
                      <span>
                        {rows.find((r) => r.l.key === p.gap!.hi)!.l.label} {p.gap!.mode === 'ratio' ? '/' : '−'} {rows.find((r) => r.l.key === p.gap!.lo)!.l.label}
                      </span>
                    </li>
                  )}
                  {stacked && rows.length > 1 && (
                    <li className="tip-total">
                      <strong>{fmt.full(total)}</strong>
                      <span>{p.ui.total}</span>
                    </li>
                  )}
                </ul>
                {unit !== '%' && <small>{p.unit}</small>}
              </div>
            )}
          </>
        ) : (
          <div className="chart-table">
            <table>
              <thead>
                <tr>
                  <th>{p.dated ? p.ui.date : p.ui.year}</th>
                  {p.lines.map((l) => (
                    <th key={l.key}>{l.label}</th>
                  ))}
                  {stacked && p.lines.length > 1 && <th>{p.ui.total}</th>}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((r) => (
                  <tr key={r.x}>
                    <td>{timeLabel(r.t, p.dated, p.locale)}</td>
                    {r.vals.map((v, i) => (
                      <td key={i}>{v === undefined ? '' : fmt.full(v)}</td>
                    ))}
                    {stacked && p.lines.length > 1 && <td>{fmt.full(r.vals.reduce<number>((s, v) => s + (v ?? 0), 0))}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="muted small">{p.unit}</p>
          </div>
        )}
      </div>

      <footer className="chart-foot">
        <p className="chart-source">
          <b>{p.ui.source}:</b>{' '}
          <a href={p.source.url} target="_blank" rel="noopener noreferrer">
            {p.source.name}
          </a>
          {p.source.license && <span> ({p.source.license})</span>}
          <span className="sep"> · </span>
          {p.ui.fetched} {p.fetched}
          {p.updated && (
            <>
              , {p.ui.updated} {p.updated}
            </>
          )}
        </p>
        {!p.compact && p.note && (
          <p className="chart-note">
            <b>{p.ui.note}:</b> {p.note}
          </p>
        )}
        {!p.compact && p.pointSources && p.pointSources.length > 0 && (
          <p className="chart-note">
            <b>{p.ui.pointSources}:</b>{' '}
            {p.pointSources.map((s, i) => (
              <span key={s.t}>
                {i > 0 && ', '}
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.t}
                </a>
              </span>
            ))}
          </p>
        )}
        <div className="chart-actions">
          <button type="button" className="chip-btn" onClick={downloadCsv}>
            <Download size={14} aria-hidden="true" /> {p.ui.csv}
          </button>
          <button type="button" className="chip-btn" onClick={copyLink}>
            {copied ? <Check size={14} aria-hidden="true" /> : <Link2 size={14} aria-hidden="true" />} {copied ? p.ui.copied : p.ui.copy}
          </button>
          <a
            className="chip-btn x"
            href={`https://x.com/intent/post?text=${encodeURIComponent(p.title)}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${p.ui.share} on X`}
          >
            <svg viewBox="0 0 24 24" width={13} height={13} fill="currentColor" aria-hidden="true">
              <path d={siX.path} />
            </svg>
            {p.ui.share}
          </a>
          {p.compact && (
            <Link className="chip-btn open" href={p.permalink}>
              <Maximize2 size={14} aria-hidden="true" /> {p.ui.open}
            </Link>
          )}
        </div>
      </footer>
    </figure>
  );
}
