'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useTheme } from '../theme';
import { formatAsOf, isStale } from '@/components/AsOf';
import { LAYERS, MANIFEST, SHADES, SHADE_COLORS, type LayerId, type Shade } from './config';
import Detail from './Detail';
import { type Data, type Selection, loadData } from './types';

const IntelMap = dynamic(() => import('./IntelMap'), { ssr: false, loading: () => <div className="map" /> });

const GROUPS = [...new Set(LAYERS.map((l) => l.group))];

/** URL hash: #county=KP0101 or #camps=camp-3 (layer=id). Read after hydration. */
function readHash(): Selection | null {
  const h = new URLSearchParams(location.hash.slice(1));
  const c = h.get('county');
  if (c) return { kind: 'county', id: c };
  for (const l of LAYERS) {
    const v = h.get(l.id);
    if (v) return { kind: 'point', layer: l.id, id: v };
  }
  return null;
}

export default function MapExplorer() {
  const { theme } = useTheme();
  const [data, setData] = useState<Data | null>(null);
  const [visible, setVisible] = useState<Set<LayerId>>(() => new Set(LAYERS.filter((l) => l.on).map((l) => l.id)));
  const [shade, setShade] = useState<Shade>('incidents');
  const [sel, setSel] = useState<Selection | null>(null);
  const [q, setQ] = useState('');
  const touched = useRef(false);

  useEffect(() => {
    loadData().then(setData);
    setSel(readHash());
    const on = () => setSel(readHash());
    addEventListener('hashchange', on);
    return () => removeEventListener('hashchange', on);
  }, []);

  const select = useCallback((s: Selection | null) => {
    touched.current = true;
    setSel(s);
    // make sure the layer of a selected point is visible
    if (s?.kind === 'point') setVisible((v) => (v.has(s.layer) ? v : new Set([...v, s.layer])));
  }, []);
  useEffect(() => {
    if (!touched.current) return;
    history.replaceState(null, '', sel ? `#${sel.kind === 'county' ? 'county' : sel.layer}=${sel.id}` : location.pathname);
  }, [sel]);

  const toggle = (id: LayerId) =>
    setVisible((v) => {
      const n = new Set(v);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  // search across counties and every point layer
  const results = useMemo(() => {
    if (!data || q.trim().length < 2) return [];
    const needle = q.toLowerCase();
    const out: { sel: Selection; name: string; sub: string; color: string }[] = [];
    for (const f of data.counties.features) {
      if (String(f.properties?.name).toLowerCase().includes(needle)) out.push({ sel: { kind: 'county', id: f.properties!.pcode }, name: f.properties!.name, sub: `County · ${f.properties!.province}`, color: '#94a3b8' });
    }
    for (const l of LAYERS) {
      if (l.id === 'escape-route') continue;
      for (const f of data[l.id].features) {
        if (String(f.properties?.name ?? '').toLowerCase().includes(needle))
          out.push({ sel: { kind: 'point', layer: l.id, id: String(f.properties!.id) }, name: f.properties!.name, sub: f.properties!.type ?? f.properties!.kind ?? l.label, color: l.color });
      }
    }
    return out.slice(0, 30);
  }, [data, q]);

  const shadeDef = SHADES.find((s) => s.id === shade)!;
  const t = MANIFEST.totals;

  return (
    <div className="app">
      <section className="sidebar">
        <header className="brand">
          <h1>North Korea intel map</h1>
          <p>
            Camps, prisons, secret police offices, missile bases, markets and {t.incidents.toLocaleString('en-US')} documented abuses, on one map.
            Click any county or point.
          </p>
        </header>

        <div className="filters">
          <input type="search" placeholder="Search a county, camp, base, market…" value={q} onChange={(e) => setQ(e.target.value)} />
          {results.length > 0 && (
            <ul className="search-results">
              {results.map((r, i) => (
                <li key={i}>
                  <button
                    onClick={() => {
                      select(r.sel);
                      setQ('');
                    }}
                  >
                    <i style={{ background: r.color }} />
                    <span>
                      {r.name}
                      <small>{r.sub}</small>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="layer-panel">
          <div className="layer-group">
            <h3>Shade counties by</h3>
            <div className="chips">
              {SHADES.map((s) => (
                <button key={s.id} className={`chip ${shade === s.id ? 'on' : ''}`} title={s.hint} onClick={() => setShade(s.id)}>
                  {s.label}
                </button>
              ))}
            </div>
            <p className="layer-hint">{shadeDef.hint}</p>
            {shadeDef.stops && (
              <div className="ramp">
                {shadeDef.stops.map((s, i) => (
                  <span key={s}>
                    <i style={{ background: SHADE_COLORS[i] }} />
                    {s >= 1000 ? `${s / 1000}k` : s}
                    {i === shadeDef.stops!.length - 1 ? '+' : ''}
                  </span>
                ))}
              </div>
            )}
          </div>

          {GROUPS.map((g) => (
            <div key={g} className="layer-group">
              <h3>{g}</h3>
              {LAYERS.filter((l) => l.group === g).map((l) => {
                const m = MANIFEST.layers[l.id];
                return (
                  <label key={l.id} className={`layer-row ${visible.has(l.id) ? 'on' : ''}`} title={l.hint}>
                    <input type="checkbox" checked={visible.has(l.id)} onChange={() => toggle(l.id)} />
                    <i style={{ background: l.color }} />
                    <span className="layer-name">
                      {l.label}
                      {m && (
                        <small>
                          {m.sources.map((s) => s.name.split(',')[0]).join(' + ')}
                          {m.sources[0]?.updated ? ` · ${formatAsOf(m.sources[0].updated.slice(0, 7))}` : ''}
                          {m.sources[0]?.updated && isStale(m.sources[0].updated) && <em className="layer-stale"> · may be outdated</em>}
                        </small>
                      )}
                    </span>
                    {m && <b>{m.count}</b>}
                  </label>
                );
              })}
            </div>
          ))}

          <p className="layer-note">
            To protect people still inside, we never pin victims’ homes ({t.homesWithheld} withheld) or execution and burial sites. Those only count
            toward their county. Data rebuilt {MANIFEST.built}. <Link href="/sources">All sources and when they last changed →</Link>
          </p>
        </div>
      </section>

      <main className="stage">
        {data ? <IntelMap data={data} visible={visible} shade={shade} selected={sel} theme={theme} onSelect={select} /> : <div className="map" />}
        {data && sel && <Detail sel={sel} data={data} onSelect={select} onClose={() => select(null)} />}
      </main>
    </div>
  );
}
