'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { type Dataset, type MissileType, type Outcome, type Test, loadDataset } from './data';
import { type ColorBy, OUTCOMES, OUTCOME_COLOR, TYPES, TYPE_COLOR, TYPE_LABEL, formatDate } from './meta';
import dynamic from 'next/dynamic';
import Timeline from './Timeline';
import Detail from './Detail';

// MapLibre touches window at import time, so the map only ever loads in the browser.
const MapView = dynamic(() => import('./MapView'), { ssr: false, loading: () => <div className="map" /> });
import { useTheme } from '../theme';

type Filters = {
  range: [number, number];
  outcomes: Set<Outcome>;
  types: Set<MissileType>;
  query: string;
};

/** Scroll the list to a row. Desktop only: on phones the list is the page itself and scrolling it would hide the map. */
function revealRow(id: string, block: ScrollLogicalPosition = 'nearest') {
  if (!matchMedia('(min-width: 801px)').matches) return;
  document.getElementById(`row-${id}`)?.scrollIntoView({ block, behavior: block === 'center' ? 'auto' : 'smooth' });
}

const readHash = () => new URLSearchParams(location.hash.slice(1)).get('test');

function toggle<T>(set: Set<T>, v: T, all: T[]): Set<T> {
  // First click on a chip while everything is on = "show only this one".
  if (set.size === all.length) return new Set([v]);
  const next = new Set(set);
  if (next.has(v)) next.delete(v);
  else next.add(v);
  return next.size === 0 ? new Set(all) : next;
}

function matches(t: Test, q: string) {
  if (!q) return true;
  const hay = `${t.date} ${t.missile.name} ${t.missile.type} ${t.facility.name} ${t.landingRegion ?? ''}`.toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .every((w) => hay.includes(w));
}

export default function MissileExplorer() {
  const [data, setData] = useState<Dataset | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDataset().then(setData, (e) => setError(String(e)));
  }, []);

  if (error) return <div className="loading">Couldn't load data: {error}</div>;
  if (!data) return <div className="loading">Loading 40 years of launches…</div>;
  return <Explorer data={data} />;
}

function Explorer({ data }: { data: Dataset }) {
  const allOutcomes = OUTCOMES.map((o) => o.id);
  const presentTypes = TYPES.filter((t) => data.tests.some((x) => x.missile.type === t.id));
  const allTypes = presentTypes.map((t) => t.id);

  const [filters, setFilters] = useState<Filters>({
    range: [data.minYear, data.maxYear],
    outcomes: new Set(allOutcomes),
    types: new Set(allTypes),
    query: '',
  });
  const [colorBy, setColorBy] = useState<ColorBy>('type');
  const [selectedId, setSelectedId] = useState<string | null>(readHash);
  const [showAbout, setShowAbout] = useState(false);
  const { theme } = useTheme();

  // Everything but the year filter. The timeline uses this so bars outside the range stay visible.
  const nonYear = useMemo(
    () =>
      data.tests.filter(
        (t) => filters.outcomes.has(t.outcome) && filters.types.has(t.missile.type) && matches(t, filters.query),
      ),
    [data, filters.outcomes, filters.types, filters.query],
  );
  const visible = useMemo(
    () => nonYear.filter((t) => t.year >= filters.range[0] && t.year <= filters.range[1]),
    [nonYear, filters.range],
  );

  const selected = useMemo(() => data.tests.find((t) => t.id === selectedId) ?? null, [data, selectedId]);

  // keep URL shareable (and follow it when someone pastes/edits a link)
  useEffect(() => {
    const onHash = () => setSelectedId(readHash());
    addEventListener('hashchange', onHash);
    return () => removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => {
    const h = selectedId ? `#test=${selectedId}` : ' ';
    history.replaceState(null, '', h === ' ' ? location.pathname + location.search : h);
  }, [selectedId]);

  // deep link: bring the selected row into view once on load
  useEffect(() => {
    // wait a beat: the map's first layout pass would otherwise undo the scroll
    const t = setTimeout(() => selectedId && revealRow(selectedId, 'center'), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const idx = selected ? visible.findIndex((t) => t.id === selected.id) : -1;
  // list is newest-first, so "prev" (older) is idx+1
  const older = idx >= 0 && idx < visible.length - 1 ? visible[idx + 1] : null;
  const newer = idx > 0 ? visible[idx - 1] : null;

  const select = useCallback((id: string | null) => {
    setSelectedId(id);
    if (id) revealRow(id);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return;
      if (e.key === 'Escape') setSelectedId(null);
      if (e.key === 'ArrowLeft' && older) select(older.id);
      if (e.key === 'ArrowRight' && newer) select(newer.id);
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [older, newer, select]);

  const stats = useMemo(() => {
    const s = { total: visible.length, success: 0, failure: 0, unknown: 0, icbm: 0, launchDays: new Set<string>() };
    for (const t of visible) {
      s[t.outcome]++;
      if (t.missile.type === 'ICBM') s.icbm++;
      s.launchDays.add(t.date);
    }
    return s;
  }, [visible]);

  const known = stats.success + stats.failure;
  const successRate = known ? Math.round((stats.success / known) * 100) : null;

  // group list by year
  const grouped = useMemo(() => {
    const g: { year: number; tests: Test[] }[] = [];
    for (const t of visible) {
      if (g[g.length - 1]?.year !== t.year) g.push({ year: t.year, tests: [] });
      g[g.length - 1].tests.push(t);
    }
    return g;
  }, [visible]);

  const filtersActive =
    filters.outcomes.size !== allOutcomes.length || filters.types.size !== allTypes.length || filters.query !== '';

  return (
    <div className="app">
      <section className="sidebar">
        <header className="brand">
          <h1>North Korea missile tests</h1>
          <p>
            Every known ballistic missile and space launch test, {data.minYear}–{data.maxYear}.{' '}
            <button className="link" onClick={() => setShowAbout(true)}>
              About the data
            </button>{' '}
            · <Link href="/missiles/list">Full list</Link>
          </p>
          <p className="brand-asof">Latest test in the data: {formatDate(data.tests[0].date)}. Newer launches may not be listed yet.</p>
        </header>

        <div className="stats">
          <div>
            <b>{stats.total}</b>
            <span>tests</span>
          </div>
          <div>
            <b>{stats.launchDays.size}</b>
            <span>launch days</span>
          </div>
          <div>
            <b>{successRate === null ? '—' : `${successRate}%`}</b>
            <span title="Share of tests with a known outcome that succeeded">success rate</span>
          </div>
          <div>
            <b style={{ color: TYPE_COLOR.ICBM }}>{stats.icbm}</b>
            <span>ICBMs</span>
          </div>
        </div>

        <div className="filters">
          <input
            type="search"
            placeholder="Search: missile, site, date…"
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
          />

          <div className="filter-group">
            <div className="filter-title">
              <span>Missile type</span>
              <span className="colorby">
                Colour map by
                <button className={colorBy === 'type' ? 'on' : ''} onClick={() => setColorBy('type')}>
                  type
                </button>
                <button className={colorBy === 'outcome' ? 'on' : ''} onClick={() => setColorBy('outcome')}>
                  outcome
                </button>
              </span>
            </div>
            <div className="chips">
              {presentTypes.map((t) => {
                const n = nonYear.filter((x) => x.missile.type === t.id && x.year >= filters.range[0] && x.year <= filters.range[1]).length;
                const on = filters.types.has(t.id);
                return (
                  <button
                    key={t.id}
                    className={`chip ${on ? 'on' : ''}`}
                    title={t.hint}
                    onClick={() => setFilters({ ...filters, types: toggle(filters.types, t.id, allTypes) })}
                  >
                    <i style={{ background: t.color }} />
                    {t.label}
                    <small>{on ? n : ''}</small>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="filter-group">
            <div className="filter-title">
              <span>Outcome</span>
              {filtersActive && (
                <button
                  className="link"
                  onClick={() => setFilters({ ...filters, outcomes: new Set(allOutcomes), types: new Set(allTypes), query: '' })}
                >
                  Reset filters
                </button>
              )}
            </div>
            <div className="chips">
              {OUTCOMES.map((o) => (
                <button
                  key={o.id}
                  className={`chip ${filters.outcomes.has(o.id) ? 'on' : ''}`}
                  onClick={() => setFilters({ ...filters, outcomes: toggle(filters.outcomes, o.id, allOutcomes) })}
                >
                  <i className="icon" style={{ color: o.color }}>
                    {o.icon}
                  </i>
                  {o.label}
                  <small>{filters.outcomes.has(o.id) ? stats[o.id] : ''}</small>
                </button>
              ))}
            </div>
          </div>
        </div>

        <ol className="list">
          {grouped.length === 0 && <li className="empty">No tests match these filters.</li>}
          {grouped.map((g) => (
            <li key={g.year}>
              <h3>
                {g.year} <small>{g.tests.length} tests</small>
              </h3>
              <ul>
                {g.tests.map((t) => (
                  <li key={t.id} id={`row-${t.id}`}>
                    <button className={`row ${t.id === selectedId ? 'selected' : ''}`} onClick={() => select(t.id === selectedId ? null : t.id)}>
                      <i className="dot" style={{ background: TYPE_COLOR[t.missile.type] }} />
                      <span className="row-main">
                        <span className="row-name">{t.missile.name}</span>
                        <span className="row-sub">
                          {formatDate(t.date, { day: 'numeric', month: 'short' })} · {TYPE_LABEL[t.missile.type]}
                          {t.distanceKm ? ` · ${t.distanceKm.toLocaleString()} km` : ''}
                        </span>
                      </span>
                      <span className="row-outcome" style={{ color: OUTCOME_COLOR[t.outcome] }} title={t.outcome}>
                        {OUTCOMES.find((o) => o.id === t.outcome)!.icon}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <main className="stage">
        <MapView theme={theme} tests={visible} facilities={data.facilities} selected={selected} colorBy={colorBy} onSelect={select} />

        <div className="legend">
          {colorBy === 'type' ? (
            presentTypes
              .filter((t) => filters.types.has(t.id))
              .map((t) => (
                <span key={t.id} title={t.hint}>
                  <i style={{ background: t.color }} />
                  {t.label}
                </span>
              ))
          ) : (
            OUTCOMES.map((o) => (
              <span key={o.id}>
                <i style={{ background: o.color }} />
                {o.label}
              </span>
            ))
          )}
          <span className="legend-sep" />
          <span>
            <i className="site" /> Launch site
          </span>
          <span>
            <svg className="legend-arrow" viewBox="0 0 24 24" aria-hidden>
              <path d="M12 3 20 20 12 15.5 4 20Z" transform="rotate(90 12 12)" />
            </svg>
            Direction / came down
          </span>
          <span>
            <i className="dash" /> Failed
          </span>
        </div>

        {selected && (
          <Detail
            test={selected}
            onClose={() => setSelectedId(null)}
            onPrev={older ? () => select(older.id) : null}
            onNext={newer ? () => select(newer.id) : null}
          />
        )}

        <Timeline
          tests={nonYear}
          minYear={data.minYear}
          maxYear={data.maxYear}
          range={filters.range}
          colorBy={colorBy}
          onChange={(range) => setFilters((f) => ({ ...f, range }))}
        />
      </main>

      {showAbout && (
        <div className="modal-bg" onClick={() => setShowAbout(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAbout(false)} aria-label="Close">
              ✕
            </button>
            <h2>About the data</h2>
            <p>
              Test records come from the{' '}
              <a href="https://www.nti.org/analysis/articles/cns-north-korea-missile-test-database/" target="_blank" rel="noreferrer">
                CNS North Korea Missile Test Database
              </a>{' '}
              (James Martin Center for Nonproliferation Studies, for the Nuclear Threat Initiative). It covers every missile North Korea
              has tested that can carry at least 500 kg at least 300 km, starting with the first test in April 1984.
            </p>
            <p>
              The database doesn't give exact impact points. Flight paths here are estimated from the launch site, the reported bearing
              and the reported distance, so they show the rough direction and reach, not a precise track. Tests with no public distance
              have no path.
            </p>
            <p>
              A redesign of{' '}
              <a href="https://github.com/nagix/nk-missile-tests" target="_blank" rel="noreferrer">
                nagix/nk-missile-tests
              </a>{' '}
              by Akihiko Kusanagi, using its compiled dataset. Map ©{' '}
              <a href="https://openfreemap.org" target="_blank" rel="noreferrer">
                OpenFreeMap
              </a>{' '}
              / OpenStreetMap contributors.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
