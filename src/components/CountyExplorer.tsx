'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Search } from 'lucide-react';

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
const METRICS: { id: Metric; label: string; unit: string; color: string }[] = [
  { id: 'incidents', label: 'Documented abuses', unit: 'abuses', color: '#dc2626' },
  { id: 'detention', label: 'Detention sites', unit: 'sites', color: '#ea580c' },
  { id: 'density', label: 'Population density', unit: 'people/km²', color: '#2563eb' },
  { id: 'markets', label: 'Markets', unit: 'markets', color: '#059669' },
];
type SortKey = 'name' | 'province' | 'pop' | Metric;

/** Log scale so Pyongyang doesn't wash every other county out. Returns 0..1. */
function scale(v: number, max: number) {
  return v <= 0 ? 0 : Math.log1p(v) / Math.log1p(max);
}

/**
 * County choropleth + sortable table. Both are rendered on the server too (this is a client component, but its
 * first render ships as HTML), so search engines see every county name and number.
 */
export default function CountyExplorer({ rows, provinces, viewBox }: { rows: CountyRow[]; provinces: { pcode: string; d: string }[]; viewBox: string }) {
  const [metric, setMetric] = useState<Metric>('incidents');
  const [hover, setHover] = useState<CountyRow | null>(null);
  const [sort, setSort] = useState<{ key: SortKey; desc: boolean }>({ key: 'incidents', desc: true });
  const [q, setQ] = useState('');
  const m = METRICS.find((x) => x.id === metric)!;
  const max = useMemo(() => Math.max(...rows.map((r) => r[metric] ?? 0), 1), [rows, metric]);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = needle ? rows.filter((r) => `${r.name} ${r.province}`.toLowerCase().includes(needle)) : rows;
    const k = sort.key;
    return [...list].sort((a, b) => {
      const x = a[k] ?? -1;
      const y = b[k] ?? -1;
      const c = typeof x === 'string' ? x.localeCompare(y as string) : (x as number) - (y as number);
      return sort.desc ? -c : c;
    });
  }, [rows, q, sort]);

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
      {v == null ? '—' : v.toLocaleString('en-US')}
    </td>
  );

  return (
    <>
      <div className="choro">
        <div className="choro-map">
          <svg viewBox={viewBox} role="img" aria-label={`Map of North Korean counties by ${m.label.toLowerCase()}`} onMouseLeave={() => setHover(null)}>
            {rows.map((r) => {
              const t = scale(r[metric] ?? 0, max);
              return (
                <Link key={r.pcode} href={`/counties/${r.slug}`} onMouseEnter={() => setHover(r)} onFocus={() => setHover(r)}>
                  <path
                    d={r.d}
                    className={hover?.pcode === r.pcode ? 'on' : ''}
                    style={{ fill: t === 0 ? 'var(--hover)' : `color-mix(in srgb, ${m.color} ${Math.round(12 + t * 88)}%, var(--panel))` }}
                  >
                    <title>{`${r.name}: ${(r[metric] ?? 0).toLocaleString('en-US')} ${m.unit}`}</title>
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
                <strong>{hover.name}</strong>
                <span>{hover.province}</span>
                <b style={{ color: m.color }}>
                  {(hover[metric] ?? 0).toLocaleString('en-US')} <small>{m.unit}</small>
                </b>
                <span className="choro-mini">
                  {hover.pop ? `${hover.pop.toLocaleString('en-US')} people · ` : ''}
                  {hover.incidents} abuses · {hover.detention} detention · {hover.markets} markets
                </span>
              </>
            ) : (
              <span>Hover a county</span>
            )}
          </div>
        </div>
        <div className="choro-side">
          <p className="choro-label">Colour by</p>
          <div className="seg" role="radiogroup" aria-label="Map metric">
            {METRICS.map((x) => (
              <button key={x.id} type="button" role="radio" aria-checked={metric === x.id} className={metric === x.id ? 'on' : ''} onClick={() => setMetric(x.id)} style={{ '--c': x.color } as React.CSSProperties}>
                <i />
                {x.label}
              </button>
            ))}
          </div>
          <div className="choro-scale" style={{ '--c': m.color } as React.CSSProperties}>
            <span>0</span>
            <i />
            <span>{max.toLocaleString('en-US')}</span>
          </div>
          <p className="choro-label">Top 5</p>
          <ol className="top5">
            {[...rows]
              .sort((a, b) => (b[metric] ?? 0) - (a[metric] ?? 0))
              .slice(0, 5)
              .map((r) => (
                <li key={r.pcode} onMouseEnter={() => setHover(r)}>
                  <Link href={`/counties/${r.slug}`}>{r.name}</Link>
                  <b>{(r[metric] ?? 0).toLocaleString('en-US')}</b>
                </li>
              ))}
          </ol>
        </div>
      </div>

      <div className="table-tools">
        <label className="search">
          <Search size={15} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a county or city" aria-label="Find a county or city" />
        </label>
        <span className="muted small">{shown.length} of {rows.length}</span>
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              {th('name', 'County / city')}
              {th('province', 'Province')}
              {th('pop', 'Population', true)}
              {th('density', 'Per km²', true)}
              {th('incidents', 'Abuses', true)}
              {th('detention', 'Detention', true)}
              {th('markets', 'Markets', true)}
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.pcode} onMouseEnter={() => setHover(r)}>
                <td>
                  <Link href={`/counties/${r.slug}`}>{r.name}</Link>
                </td>
                <td className="muted">{r.province}</td>
                <td className="num">{r.pop?.toLocaleString('en-US') ?? '—'}</td>
                {bar('density', r.density, '#2563eb')}
                {bar('incidents', r.incidents, '#dc2626')}
                {bar('detention', r.detention, '#ea580c')}
                {bar('markets', r.markets, '#059669')}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
