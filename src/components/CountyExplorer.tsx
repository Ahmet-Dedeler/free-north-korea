'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Search } from 'lucide-react';
import { COUNTIES_TEXT, NUM_LOCALE, formatCount, provinceName, sitePath } from '@/content/countiesI18n';
import type { Lang } from '@/site/seo';

export interface CountyRow {
  pcode: string;
  slug: string;
  name: string;
  province: string;
  pop: number | null;
  density: number | null;
  incidents: number;
  detention: number;
  markets: number;
  d: string;
}

type Metric = 'density' | 'incidents' | 'detention' | 'markets';
const COLOR: Record<Metric, string> = {
  incidents: '#dc2626',
  detention: '#ea580c',
  density: '#2563eb',
  markets: '#059669',
};
const METRIC_ORDER: Metric[] = ['incidents', 'detention', 'density', 'markets'];
type SortKey = 'name' | 'province' | 'pop' | Metric;

/** Log scale so Pyongyang doesn't wash every other county out. Returns 0..1. */
function scale(v: number, max: number) {
  return v <= 0 ? 0 : Math.log1p(v) / Math.log1p(max);
}

/**
 * County choropleth + sortable table. Both are rendered on the server too (this is a client component, but its
 * first render ships as HTML), so search engines see every county name and number.
 */
export default function CountyExplorer({
  rows,
  provinces,
  viewBox,
  lang = 'en',
}: {
  rows: CountyRow[];
  provinces: { pcode: string; d: string }[];
  viewBox: string;
  lang?: Lang;
}) {
  const t = COUNTIES_TEXT[lang];
  const metrics = METRIC_ORDER.map((id) => ({ id, ...t.metrics[id], color: COLOR[id] }));
  const [metric, setMetric] = useState<Metric>('incidents');
  const [hover, setHover] = useState<CountyRow | null>(null);
  const [sort, setSort] = useState<{ key: SortKey; desc: boolean }>({ key: 'incidents', desc: true });
  const [q, setQ] = useState('');
  const m = metrics.find((x) => x.id === metric)!;
  const max = useMemo(() => Math.max(...rows.map((r) => r[metric] ?? 0), 1), [rows, metric]);
  const href = (slug: string) => sitePath(lang, `/counties/${slug}`);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = needle ? rows.filter((r) => `${r.name} ${r.province} ${provinceName(r.province, lang)}`.toLowerCase().includes(needle)) : rows;
    const k = sort.key;
    return [...list].sort((a, b) => {
      if (k === 'province' && lang !== 'en') {
        const c = provinceName(a.province, lang).localeCompare(provinceName(b.province, lang), NUM_LOCALE[lang]);
        return sort.desc ? -c : c;
      }
      const x = a[k] ?? -1;
      const y = b[k] ?? -1;
      const c = typeof x === 'string' ? x.localeCompare(y as string) : (x as number) - (y as number);
      return sort.desc ? -c : c;
    });
  }, [rows, q, sort, lang]);

  const th = (key: SortKey, label: string, num = false) => (
    <th className={num ? 'num' : ''} aria-sort={sort.key === key ? (sort.desc ? 'descending' : 'ascending') : 'none'}>
      <button type="button" onClick={() => setSort((s) => ({ key, desc: s.key === key ? !s.desc : num }))}>
        {label}
        {sort.key === key && (sort.desc ? <ArrowDown size={12} /> : <ArrowUp size={12} />)}
      </button>
    </th>
  );
  const maxOf = (k: Metric) => Math.max(...rows.map((r) => r[k] ?? 0), 1);
  const bar = (k: Metric, v: number | null, color: string) => (
    <td className="num">
      <span className="cell-bar">
        <i style={{ width: `${((v ?? 0) / maxOf(k)) * 100}%`, background: color }} />
      </span>
      {v == null ? '—' : formatCount(v, lang)}
    </td>
  );
  const name = (value: string) => (lang === 'en' ? value : <span lang="en">{value}</span>);

  return (
    <>
      <div className="choro">
        <div className="choro-map">
          <svg viewBox={viewBox} role="group" aria-label={t.mapAria(m.label)} onMouseLeave={() => setHover(null)}>
            {rows.map((r) => {
              const fill = scale(r[metric] ?? 0, max);
              return (
                <Link key={r.pcode} href={href(r.slug)} onMouseEnter={() => setHover(r)} onFocus={() => setHover(r)}>
                  <path
                    d={r.d}
                    className={hover?.pcode === r.pcode ? 'on' : ''}
                    style={{ fill: fill === 0 ? 'var(--hover)' : `color-mix(in srgb, ${m.color} ${Math.round(12 + fill * 88)}%, var(--panel))` }}
                  >
                    <title>{`${r.name}: ${formatCount(r[metric] ?? 0, lang)} ${m.unit}`}</title>
                  </path>
                </Link>
              );
            })}
            {provinces.map((p) => (
              <path key={p.pcode} d={p.d} className="prov-line" />
            ))}
          </svg>
          <div className={`choro-tip ${hover ? 'show' : ''}`}>
            {hover ? (
              <>
                <strong>{name(hover.name)}</strong>
                <span>{provinceName(hover.province, lang)}</span>
                <b style={{ color: m.color }}>
                  {formatCount(hover[metric] ?? 0, lang)} <small>{m.unit}</small>
                </b>
                <span className="choro-mini">
                  {[hover.pop != null ? t.tipPeople(formatCount(hover.pop, lang)) : null, t.tipAbuses(hover.incidents), t.tipDetention(hover.detention), t.tipMarkets(hover.markets)]
                    .filter((part) => part != null)
                    .join(' · ')}
                </span>
              </>
            ) : (
              <span>{t.hoverHint}</span>
            )}
          </div>
        </div>
        <div className="choro-side">
          <p className="choro-label">{t.colourBy}</p>
          <div className="seg" role="radiogroup" aria-label={t.mapMetric}>
            {metrics.map((x) => (
              <button key={x.id} type="button" role="radio" aria-checked={metric === x.id} className={metric === x.id ? 'on' : ''} onClick={() => setMetric(x.id)} style={{ '--c': x.color } as React.CSSProperties}>
                <i />
                {x.label}
              </button>
            ))}
          </div>
          <div className="choro-scale" style={{ '--c': m.color } as React.CSSProperties}>
            <span>0</span>
            <i />
            <span>{formatCount(max, lang)}</span>
          </div>
          <p className="choro-label">{t.top5}</p>
          <ol className="top5">
            {[...rows]
              .sort((a, b) => (b[metric] ?? 0) - (a[metric] ?? 0))
              .slice(0, 5)
              .map((r) => (
                <li key={r.pcode} onMouseEnter={() => setHover(r)}>
                  <Link href={href(r.slug)}>{name(r.name)}</Link>
                  <b>{formatCount(r[metric] ?? 0, lang)}</b>
                </li>
              ))}
          </ol>
        </div>
      </div>

      <div className="table-tools">
        <label className="search">
          <Search size={15} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.search} aria-label={t.search} />
        </label>
        <span className="muted small">{t.countOf(shown.length, rows.length)}</span>
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              {th('name', t.colCounty)}
              {th('province', t.colProvince)}
              {th('pop', t.colPop, true)}
              {th('density', t.colPerKm, true)}
              {th('incidents', t.colAbuses, true)}
              {th('detention', t.colDetention, true)}
              {th('markets', t.colMarkets, true)}
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.pcode} onMouseEnter={() => setHover(r)}>
                <td>
                  <Link href={href(r.slug)}>{name(r.name)}</Link>
                </td>
                <td className="muted">{provinceName(r.province, lang)}</td>
                <td className="num">{r.pop == null ? '—' : formatCount(r.pop, lang)}</td>
                {bar('density', r.density, COLOR.density)}
                {bar('incidents', r.incidents, COLOR.incidents)}
                {bar('detention', r.detention, COLOR.detention)}
                {bar('markets', r.markets, COLOR.markets)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
