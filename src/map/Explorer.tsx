'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useTheme } from '../theme';
import { formatAsOf, isStale } from '@/components/AsOf';
import { LAYERS, MANIFEST, SHADES, SHADE_COLORS, type LayerId, type Overlay, type Shade } from './config';
import Detail from './Detail';
import type { Lang } from '@/site/seo';
import { localize } from '@/content/chrome';
import { NUM_LOCALE, provinceName } from '@/content/countiesI18n';
import { MAP_TEXT } from '@/content/mapI18n';
import type { MapSatSite } from '@/content/satLabels';
import { type Basemap, type Data, type Selection, loadData } from './types';
import BasemapSwitch from './BasemapSwitch';

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

const BASE_KEY = 'map-basemap';

/** `sat` is the Camp Watch index (dates of our Sentinel-2 images per site), built on the server by mapSatIndex(). */
export default function MapExplorer({ lang = 'en', sat = {} }: { lang?: Lang; sat?: Record<string, MapSatSite> }) {
  const tx = MAP_TEXT[lang];
  const { theme } = useTheme();
  const [data, setData] = useState<Data | null>(null);
  const [visible, setVisible] = useState<Set<LayerId>>(() => new Set(LAYERS.filter((l) => l.on).map((l) => l.id)));
  const [shade, setShade] = useState<Shade>('incidents');
  const [sel, setSel] = useState<Selection | null>(null);
  const [q, setQ] = useState('');
  const [base, setBase] = useState<Basemap>('map');
  const [overlays, setOverlays] = useState<Set<Overlay>>(() => new Set());
  const touched = useRef(false);

  useEffect(() => {
    loadData().then(setData);
    // the reader's last basemap is a per-browser convenience; private windows may refuse storage
    try {
      if (localStorage.getItem(BASE_KEY) === 'satellite') setBase('satellite');
    } catch {}
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
      if (String(f.properties?.name).toLowerCase().includes(needle)) out.push({ sel: { kind: 'county', id: f.properties!.pcode }, name: f.properties!.name, sub: tx.countySub(provinceName(f.properties!.province, lang)), color: '#94a3b8' });
    }
    for (const l of LAYERS) {
      if (l.id === 'escape-route') continue;
      for (const f of data[l.id].features) {
        if (String(f.properties?.name ?? '').toLowerCase().includes(needle))
          out.push({ sel: { kind: 'point', layer: l.id, id: String(f.properties!.id) }, name: f.properties!.name, sub: f.properties!.type ?? f.properties!.kind ?? tx.layers[l.id].label, color: l.color });
      }
    }
    return out.slice(0, 30);
  }, [data, q, tx, lang]);

  const switchBase = (b: Basemap) => {
    setBase(b);
    try {
      localStorage.setItem(BASE_KEY, b);
    } catch {}
  };

  const toggleOverlay = (o: Overlay) =>
    setOverlays((v) => {
      const n = new Set(v);
      if (n.has(o)) n.delete(o);
      else n.add(o);
      return n;
    });

  const shadeDef = SHADES.find((s) => s.id === shade)!;
  const t = MANIFEST.totals;

  return (
    <div className="app">
      <section className="sidebar">
        <header className="brand">
          <h1>{tx.h1}</h1>
          <p>{tx.lede(t.incidents.toLocaleString(NUM_LOCALE[lang]))}</p>
        </header>

        <div className="filters">
          <input type="search" placeholder={tx.search} value={q} onChange={(e) => setQ(e.target.value)} />
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
            <h3>{tx.shadeBy}</h3>
            <div className="chips">
              {SHADES.map((s) => (
                <button key={s.id} className={`chip ${shade === s.id ? 'on' : ''}`} title={tx.shades[s.id].hint} onClick={() => setShade(s.id)}>
                  {tx.shades[s.id].label}
                </button>
              ))}
            </div>
            <p className="layer-hint">{tx.shades[shade].hint}</p>
            {shadeDef.stops && (
              <div className="ramp">
                {shadeDef.stops.map((s, i) => (
                  <span key={s}>
                    <i style={{ background: SHADE_COLORS[i] }} />
                    {i === 1 && s > 1 ? '>0' : s >= 1000 ? `${s / 1000}k` : s}
                    {i === shadeDef.stops!.length - 1 ? '+' : ''}
                  </span>
                ))}
              </div>
            )}
          </div>

          {GROUPS.map((g) => (
            <div key={g} className="layer-group">
              <h3>{tx.groups[g]}</h3>
              {LAYERS.filter((l) => l.group === g).map((l) => {
                const m = MANIFEST.layers[l.id];
                return (
                  <label key={l.id} className={`layer-row ${visible.has(l.id) ? 'on' : ''}`} title={tx.layers[l.id].hint}>
                    <input type="checkbox" checked={visible.has(l.id)} onChange={() => toggle(l.id)} />
                    <i style={{ background: l.color }} />
                    <span className="layer-name">
                      {tx.layers[l.id].label}
                      {m && (
                        <small>
                          {m.sources.map((s) => s.name.split(',')[0]).join(' + ')}
                          {m.sources[0]?.updated ? ` · ${formatAsOf(m.sources[0].updated.slice(0, 7), lang === 'en' ? 'en-GB' : NUM_LOCALE[lang])}` : ''}
                          {m.sources[0]?.updated && isStale(m.sources[0].updated) && <em className="layer-stale"> · {tx.mayBeOutdated}</em>}
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
            {tx.note(t.homesWithheld, MANIFEST.built)} <Link href={localize(lang, '/sources')}>{tx.sourcesLink}</Link>
          </p>
        </div>
      </section>

      <main className="stage">
        {data ? <IntelMap data={data} visible={visible} shade={shade} base={base} overlays={overlays} selected={sel} theme={theme} lang={lang} onSelect={select} /> : <div className="map" />}
        <BasemapSwitch base={base} onChange={switchBase} overlays={overlays} onToggle={toggleOverlay} lang={lang} />
        {data && sel && <Detail sel={sel} data={data} sat={sat} lang={lang} onSelect={select} onClose={() => select(null)} />}
      </main>
    </div>
  );
}
