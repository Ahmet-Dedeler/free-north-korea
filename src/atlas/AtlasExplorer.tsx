'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { ESCAPE_ROUTE, PLACES, PLACE_CATEGORIES, PLACE_COLOR, type PlaceCategory } from '../content/places';
import { useTheme } from '../theme';

// MapLibre needs the browser, so the map never renders on the server. The list does, for SEO.
const AtlasMap = dynamic(() => import('./AtlasMap'), { ssr: false, loading: () => <div className="map" /> });

const ALL = PLACE_CATEGORIES.filter((c) => c.id !== 'route').map((c) => c.id);
const readHash = () => new URLSearchParams(location.hash.slice(1)).get('place');

export default function AtlasExplorer() {
  const { theme } = useTheme();
  const [cats, setCats] = useState<Set<PlaceCategory>>(new Set(ALL));
  const [showRoute, setShowRoute] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // Only write the URL after the user picks something, so the initial #place= link is never wiped.
  const touched = useRef(false);
  const select = useCallback((id: string | null) => {
    touched.current = true;
    setSelectedId(id);
  }, []);

  // deep links: #place=camp-14 (read after hydration so server and client markup match)
  useEffect(() => {
    setSelectedId(readHash());
    const on = () => setSelectedId(readHash());
    addEventListener('hashchange', on);
    return () => removeEventListener('hashchange', on);
  }, []);
  useEffect(() => {
    if (!touched.current) return;
    if (selectedId) history.replaceState(null, '', `#place=${selectedId}`);
    else if (location.hash) history.replaceState(null, '', location.pathname);
  }, [selectedId]);

  const visible = useMemo(() => PLACES.filter((p) => cats.has(p.category)), [cats]);
  const selected = PLACES.find((p) => p.id === selectedId) ?? null;

  const toggle = (c: PlaceCategory) => {
    // first click while everything is on = show only this one
    if (cats.size === ALL.length) return setCats(new Set([c]));
    const next = new Set(cats);
    if (next.has(c)) next.delete(c);
    else next.add(c);
    setCats(next.size ? next : new Set(ALL));
  };

  return (
    <div className="app">
      <section className="sidebar">
        <header className="brand">
          <h1>North Korea atlas</h1>
          <p>
            Prison camps, nuclear and missile sites, border crossings and the escape route out. {PLACES.length} places, each with a
            source.
          </p>
        </header>

        <div className="filters">
          <div className="chips">
            {PLACE_CATEGORIES.filter((c) => c.id !== 'route').map((c) => (
              <button key={c.id} className={`chip ${cats.has(c.id) ? 'on' : ''}`} title={c.hint} onClick={() => toggle(c.id)}>
                <i style={{ background: c.color }} />
                {c.label}
                <small>{cats.has(c.id) ? PLACES.filter((p) => p.category === c.id).length : ''}</small>
              </button>
            ))}
          </div>
          <button className={`route-toggle ${showRoute ? 'on' : ''}`} onClick={() => {
              // the detail card would cover the route, so close it when showing the route
              if (!showRoute) select(null);
              setShowRoute(!showRoute);
            }}>
            <i style={{ background: PLACE_COLOR.route }} />
            {showRoute ? 'Hide' : 'Show'} the escape route to Southeast Asia
          </button>
        </div>

        <ol className="list">
          {PLACE_CATEGORIES.filter((c) => c.id !== 'route' && cats.has(c.id)).map((c) => (
            <li key={c.id}>
              <h3>{c.label}</h3>
              <ul>
                {visible
                  .filter((p) => p.category === c.id)
                  .map((p) => (
                    <li key={p.id}>
                      <button className={`row ${p.id === selectedId ? 'selected' : ''}`} onClick={() => select(p.id === selectedId ? null : p.id)}>
                        <i className="dot" style={{ background: c.color }} />
                        <span className="row-main">
                          <span className="row-name">{p.name}</span>
                          {p.status && <span className="row-sub">{p.status}</span>}
                        </span>
                      </button>
                    </li>
                  ))}
              </ul>
            </li>
          ))}
          {showRoute && (
            <li>
              <h3>Escape route</h3>
              <ul className="route-steps">
                {ESCAPE_ROUTE.map((w, i) => (
                  <li key={w.name}>
                    <b>
                      {i + 1}. {w.name}
                    </b>
                    <span>{w.note}</span>
                  </li>
                ))}
              </ul>
            </li>
          )}
        </ol>
      </section>

      <main className="stage">
        <AtlasMap places={visible} showRoute={showRoute} selected={selected} theme={theme} onSelect={select} />

        {selected && (
          <aside className="detail place-detail">
            <button className="modal-close" onClick={() => select(null)} aria-label="Close">
              ✕
            </button>
            <p className="detail-date" style={{ color: PLACE_COLOR[selected.category] }}>
              {PLACE_CATEGORIES.find((c) => c.id === selected.category)!.label}
            </p>
            <h2>{selected.name}</h2>
            {selected.status && <p className="place-status">{selected.status}</p>}
            <p>{selected.note}</p>
            <p className="place-meta">
              {selected.lat.toFixed(3)}°N, {selected.lon.toFixed(3)}°E{selected.approx ? ' (approximate)' : ''}
            </p>
            <p className="place-links">
              {selected.more && <a href={selected.more}>Read more →</a>}
              {selected.source && (
                <a href={selected.source.url} target="_blank" rel="noopener noreferrer">
                  Source: {selected.source.label}
                </a>
              )}
            </p>
          </aside>
        )}
      </main>
    </div>
  );
}
