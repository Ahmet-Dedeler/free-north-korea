'use client';
/**
 * Our World in Data style chart frame: title, entity toggles, chart / table tabs, hover crosshair, source line and
 * share buttons. Renders an SVG at the container's real width (server render uses a default width, so crawlers and
 * no-JS readers still get the chart and the table). Props come from chartProps() in ./data.ts.
 */
import { Download, Link2, Maximize2, Check } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
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
  const axis = (v: number) => new Intl.NumberFormat(locale, { notation: Math.abs(v) >= 10000 ? 'compact' : 'standard', maximumFractionDigits: 2 }).format(v);
  return { full, axis };
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
  const H = p.compact ? 230 : Math.round(Math.min(440, Math.max(280, width * 0.56)));
  const endLabels = !stacked && !narrow && lines.length > 0;
  const longest = Math.max(...lines.map((l) => l.label.length), 4);
  const right = endLabels ? Math.min(150, longest * 7 + 52) : 12;

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
  const top = 12;
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
        .map((l) => ({ l, y: sy(l.pts[l.pts.length - 1]?.[1] ?? 0) }))
        .filter((o) => o.l.pts.length)
        .sort((a, b) => a.y - b.y)
    : [];
  for (let i = 1; i < labels.length; i++) if (labels[i].y - labels[i - 1].y < 15) labels[i].y = labels[i - 1].y + 15;

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
    <figure className={`chart${p.compact ? ' compact' : ''}`} lang={p.lang}>
      <figcaption className="chart-head">
        <h3>{p.title}</h3>
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
              {p.bands.map((b) => {
                const a = Math.max(b.from, xMin);
                const z = Math.min(b.to, xMax);
                if (stacked || z <= a) return null;
                return (
                  <g key={b.label} className="chart-band">
                    <rect x={sx(a)} y={top} width={Math.max(2, sx(z) - sx(a))} height={plotH} />
                    <text x={sx(a) + 4} y={top + 12}>
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

              {stacked
                ? xs.map((x) => {
                    let acc = 0;
                    const w = Math.max(2, Math.min(36, band - 2));
                    return (
                      <g key={x} className={hx === x ? 'bar on' : 'bar'}>
                        {lines.map((l) => {
                          const v = l.pts.find((q) => q[0] === x)?.[1] ?? 0;
                          if (!v) return null;
                          const yTop = sy(acc + v);
                          const yBot = sy(acc);
                          acc += v;
                          return <rect key={l.key} x={sx(x) - w / 2} y={yTop} width={w} height={Math.max(0.5, yBot - yTop)} rx={w > 8 ? 2 : 0} style={{ fill: l.color }} />;
                        })}
                      </g>
                    );
                  })
                : [...lines].reverse().map((l) => {
                    const { solid, bridge } = segs(l.pts);
                    return (
                      <g key={l.key}>
                        {bridge && <path d={bridge} className="line bridge" style={{ stroke: l.color }} />}
                        <path d={solid} className={l.dashed ? 'line dashed' : 'line'} style={{ stroke: l.color }} />
                        {l.pts.length < 12 && l.pts.map((q) => <circle key={q[0]} cx={sx(q[0])} cy={sy(q[1])} r={3} className="dot" style={{ fill: l.color }} />)}
                      </g>
                    );
                  })}

              {labels.map(({ l, y }) => (
                <g key={l.key} className="chart-end">
                  <text x={left + plotW + 8} y={y + 4}>
                    <tspan className="end-name">{l.label}</tspan>
                  </text>
                </g>
              ))}

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
