'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Anchor, CircleOff, Fence, Grid3x3, Lock, LockKeyhole, Radiation, Rocket, Route, Search, Store, TriangleAlert, Users, type LucideIcon } from 'lucide-react';
import { useTheme } from '../theme';
import { formatAsOf, isStale } from '@/components/AsOf';
import { LAYERS, LIGHTS_STOPS, MANIFEST, OVERLAYS, SHADES, SHADE_COLORS, type LayerId, type Overlay, type Shade } from './config';
import Detail from './Detail';
import type { Lang } from '@/site/seo';
import { localize } from '@/content/chrome';
import { NUM_LOCALE, provinceName } from '@/content/countiesI18n';
import { MAP_TEXT } from '@/content/mapI18n';
import type { MapSatSite } from '@/content/satLabels';
import { type Basemap, type Data, type Focus, type Selection, loadData } from './types';
import BasemapSwitch from './BasemapSwitch';
import TimePill from './TimePill';
import Latest from './Latest';
import type { MapLatest } from '@/content/mapLatest';

const IntelMap = dynamic(() => import('./IntelMap'), { ssr: false, loading: () => <div className="map" /> });

/** One icon per layer and per county shading, so the sidebar reads at a glance, like Google Maps' category chips. */
const LAYER_ICON: Record<LayerId, LucideIcon> = {
  camps: Fence,
  detention: LockKeyhole,
  'china-detention': Lock,
  'missile-bases': Rocket,
  sites: Radiation,
  markets: Store,
  ports: Anchor,
  'escape-route': Route,
};
const SHADE_ICON: Record<Shade, LucideIcon> = { incidents: TriangleAlert, density: Grid3x3, population: Users, detention: LockKeyhole, markets: Store, none: CircleOff };

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

/** The night-lights colour scale as a bar, from the same stops the map paints with (sqrt spacing, like the map). */
function LightsKey() {
  const top = LIGHTS_STOPS.at(-1)![0];
  const stops = LIGHTS_STOPS.map(([t, c]) => `${c} ${Math.round(Math.sqrt(t / top) * 100)}%`).join(', ');
  return (
    <span className="tp-key" aria-hidden="true">
      <i style={{ background: `linear-gradient(90deg, ${stops})` }} />
      <span>
        <span>0%</span>
        <span>{Math.round(top * 100)}%+</span>
      </span>
    </span>
  );
}

/** `sat` is the Camp Watch index (dates of our Sentinel-2 images per site), built on the server by mapSatIndex(). */
/** `latest` is the sidebar's "Latest" section (content/mapLatest.ts), also built on the server. */
export default function MapExplorer({ lang = 'en', sat = {}, latest }: { lang?: Lang; sat?: Record<string, MapSatSite>; latest?: MapLatest }) {
  const tx = MAP_TEXT[lang];
  const { theme } = useTheme();
  const [data, setData] = useState<Data | null>(null);
  const [visible, setVisible] = useState<Set<LayerId>>(() => new Set(LAYERS.filter((l) => l.on).map((l) => l.id)));
  const [shade, setShade] = useState<Shade>('incidents');
  const [sel, setSel] = useState<Selection | null>(null);
  const [q, setQ] = useState('');
  const [base, setBase] = useState<Basemap>('map');
  const [overlays, setOverlays] = useState<Set<Overlay>>(() => new Set());
  // year for time-axis overlays; null until the data says which years exist (then the latest, or #…&y=2019)
  const [year, setYear] = useState<number | null>(null);
  const touched = useRef(false);

  useEffect(() => {
    loadData().then((d) => {
      setData(d);
      const y = Number(new URLSearchParams(location.hash.slice(1)).get('y'));
      const years = d.lights.years;
      setYear(years.includes(y) ? y : years.at(-1)!);
      // a shared link with a year opens the night lights at that year
      if (years.includes(y)) setOverlays((v) => new Set([...v, 'lights']));
    });
    // the reader's last basemap is a per-browser convenience; private windows may refuse storage
    try {
      if (localStorage.getItem(BASE_KEY) === 'satellite') setBase('satellite');
    } catch {}
    // a link can ask for the satellite basemap: /map#county=KP0613&b=sat (the county pages' "Satellite view")
    if (new URLSearchParams(location.hash.slice(1)).get('b') === 'sat') setBase('satellite');
    setSel(readHash());
    const on = () => setSel(readHash());
    addEventListener('hashchange', on);
    return () => removeEventListener('hashchange', on);
  }, []);

  // a spot to show without selecting anything (a quake from the Latest list); cleared by any selection
  const [focus, setFocus] = useState<Focus | null>(null);
  const select = useCallback((s: Selection | null) => {
    setFocus(null);
    touched.current = true;
    setSel(s);
    // make sure the layer of a selected point is visible
    if (s?.kind === 'point') setVisible((v) => (v.has(s.layer) ? v : new Set([...v, s.layer])));
  }, []);
  // The hash holds the selection and, while night lights are on, the year: #county=KP0101&y=2019
  const latestYear = data?.lights.years.at(-1);
  useEffect(() => {
    if (!touched.current) return;
    const h = new URLSearchParams();
    if (sel) h.set(sel.kind === 'county' ? 'county' : sel.layer, sel.id);
    if (overlays.has('lights') && year && year !== latestYear) h.set('y', String(year));
    const s = h.toString();
    history.replaceState(null, '', s ? `#${s}` : location.pathname);
  }, [sel, overlays, year, latestYear]);

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

  const toggleOverlay = (o: Overlay) => {
    touched.current = true;
    setOverlays((v) => {
      const n = new Set(v);
      if (n.has(o)) n.delete(o);
      else n.add(o);
      return n;
    });
  };
  const pickYear = useCallback((y: number) => {
    touched.current = true;
    setYear(y);
  }, []);
  const timeOn = !!data && year !== null && OVERLAYS.some((o) => o.time && overlays.has(o.id));

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
          <label className="search-box">
            <Search size={16} aria-hidden="true" />
            <input type="search" placeholder={tx.search} aria-label={tx.search} value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
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
          {/* what's on the map: one chip per layer, like Google Maps' category chips; details in the tooltip */}
          <div className="layer-group">
            <h3>{tx.onMap}</h3>
            <div className="lchips">
              {LAYERS.map((l) => {
                const m = MANIFEST.layers[l.id];
                const Icon = LAYER_ICON[l.id];
                const updated = m?.sources[0]?.updated;
                const stale = !!updated && isStale(updated);
                const tip = [
                  m ? `${tx.layers[l.id].label} (${m.count})` : tx.layers[l.id].label,
                  tx.layers[l.id].hint,
                  m && m.sources.map((x) => x.name.split(',')[0]).join(' + ') + (updated ? ` · ${formatAsOf(updated.slice(0, 7), lang === 'en' ? 'en-GB' : NUM_LOCALE[lang])}` : ''),
                  stale && tx.mayBeOutdated,
                ]
                  .filter(Boolean)
                  .join('\n');
                return (
                  <button
                    key={l.id}
                    type="button"
                    className={`lchip ${visible.has(l.id) ? 'on' : ''}`}
                    style={{ '--c': l.color } as React.CSSProperties}
                    aria-pressed={visible.has(l.id)}
                    title={tip}
                    onClick={() => toggle(l.id)}
                  >
                    <span className="lchip-icon" aria-hidden="true">
                      <Icon size={14} />
                    </span>
                    <span className="lchip-name">{tx.layers[l.id].short}</span>
                    {m && (
                      // an outdated layer shows the year its data is from instead of the count (the count is in the tooltip)
                      <small className={stale ? 'stale' : ''}>{stale && updated ? updated.slice(0, 4) : m.count}</small>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {latest && !q && (
            <Latest
              latest={latest}
              lang={lang}
              onSelect={select}
              onFocus={(p) => {
                select(null);
                setFocus({ center: p });
              }}
            />
          )}

          <div className="layer-group">
            <h3>{tx.shadeBy}</h3>
            <div className="chips">
              {SHADES.map((s) => {
                const Icon = SHADE_ICON[s.id];
                return (
                  <button key={s.id} type="button" className={`chip ${shade === s.id ? 'on' : ''}`} aria-pressed={shade === s.id} title={tx.shades[s.id].hint} onClick={() => setShade(s.id)}>
                    <Icon size={13} aria-hidden="true" />
                    {tx.shades[s.id].label}
                  </button>
                );
              })}
            </div>
            {shadeDef.stops && (
              <div className="ramp" title={tx.shades[shade].hint}>
                {shadeDef.stops.map((s, i) => (
                  <span key={s}>
                    <i style={{ background: SHADE_COLORS[i] }} />
                    {i === 1 && s > 1 ? '>0' : s >= 1000 ? `${s / 1000}k` : s}
                    {i === shadeDef.stops!.length - 1 ? '+' : ''}
                  </span>
                ))}
              </div>
            )}
            <p className="layer-hint">{tx.shades[shade].hint}</p>
          </div>

          <p className="layer-note">
            {tx.note(t.homesWithheld, MANIFEST.built)} <Link href={localize(lang, '/sources')}>{tx.sourcesLink}</Link>
          </p>
        </div>
      </section>

      <main className="stage">
        {data && year !== null ? (
          <IntelMap data={data} visible={visible} shade={shade} base={base} overlays={overlays} year={year} selected={sel} focus={focus} theme={theme} lang={lang} onSelect={select} />
        ) : (
          <div className="map" />
        )}
        <BasemapSwitch base={base} onChange={switchBase} overlays={overlays} onToggle={toggleOverlay} year={year} lang={lang} />
        {timeOn && data && (
          <TimePill
            steps={data.lights.years}
            value={year!}
            onChange={pickYear}
            label={tx.timeLabel}
            playLabel={tx.timePlay}
            pauseLabel={tx.timePause}
            head={{
              keyNode: <LightsKey />,
              title: tx.overlays.lights.label,
              sub: `${tx.lightsScale} · ${tx.overlays.lights.sub}`,
              onClose: () => toggleOverlay('lights'),
              closeLabel: `${tx.close}: ${tx.overlays.lights.label}`,
            }}
          />
        )}
        {data && sel && (
          <Detail
            sel={sel}
            data={data}
            sat={sat}
            lang={lang}
            year={year ?? latestYear ?? 0}
            lights={overlays.has('lights')}
            onSelect={select}
            onClose={() => select(null)}
            onCloseUp={(center, zoom) => {
              switchBase('satellite');
              setFocus({ center, zoom, ping: false });
            }}
          />
        )}
      </main>
    </div>
  );
}
