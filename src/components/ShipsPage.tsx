import Link from 'next/link';
import { Anchor, Radar, RadioTower, Ship as ShipIcon, ShieldAlert, WifiOff } from 'lucide-react';
import AsOf, { formatAsOf } from '@/components/AsOf';
import { Ext } from '@/components/Ext';
import { SourceCards, StatTile } from '@/components/Visual';
import { LISTS, SANCTIONS_PATHS } from '@/content/sanctions';
import { GFW_URL, SHIPS, SHIPS_DATA_URL, SHIPS_PATHS, SHIPS_RAW_URL, SHIPS_TEXT, SHIP_SOURCES, type Ship } from '@/content/ships';
import { SITE_NAME, SITE_URL } from '@/site/config';
import { countryName } from '@/site/countries';
import { LANG_TAG, absolute, jsonLd, type Lang } from '@/site/seo';

const LOCALE: Record<Lang, string> = {
  en: 'en-GB',
  ko: 'ko-KR',
  ja: 'ja-JP',
  zh: 'zh-CN',
};

/** "2026-09-21" + "2026-09-24" → "21 Sept 2026 – 24 Sept 2026", or one date when the visit started and ended the same day. */
function span(a: string, b: string, locale: string) {
  return a === b ? formatAsOf(a, locale) : `${formatAsOf(a, locale)} – ${formatAsOf(b, locale)}`;
}

/** The sanctioned-ships page, shared by /sanctions/ships and its Korean, Japanese and Chinese routes. */
export default function ShipsPage({ lang }: { lang: Lang }) {
  const t = SHIPS_TEXT[lang];
  const locale = LOCALE[lang];
  const { ships, radar, fetched, radarThrough, window: win } = SHIPS;
  const shipKey = (s: Ship) => `${s.imo}-${s.name}`;

  const broadcasting = ships.filter((s) => s.lastSeen && s.lastSeen >= win.from);
  // Port calls abroad, one row per listed ship and the identity it broadcast (a ship sitting at the same anchorage
  // for weeks makes dozens of visits; the row keeps the count and the span).
  type Group = {
    s: Ship;
    as: string;
    flag: string | null;
    first: string;
    last: string;
    n: number;
    ports: Map<string, { port: string; country: string; n: number }>;
  };
  const groups = new Map<string, Group>();
  for (const s of ships)
    for (const v of s.visits) {
      if (!v.country || v.country === 'PRK') continue;
      const k = `${s.imo}|${v.as}|${v.flag}`;
      const g = groups.get(k) ?? {
        s,
        as: v.as,
        flag: v.flag,
        first: v.start,
        last: v.end,
        n: 0,
        ports: new Map(),
      };
      g.n++;
      if (v.start < g.first) g.first = v.start;
      if (v.end > g.last) g.last = v.end;
      const pk = `${v.port}|${v.country}`;
      const p = g.ports.get(pk) ?? { port: v.port, country: v.country, n: 0 };
      p.n++;
      g.ports.set(pk, p);
      groups.set(k, g);
    }
  const abroad = [...groups.values()].sort((a, b) => b.last.localeCompare(a.last));
  const abroadShips = new Set(abroad.map((g) => shipKey(g.s)));
  /** Does the broadcast name look like the listed one? Spaces and digits-vs-words aside ("ANSAN1" = "An San 1"). */
  const sameName = (a: string, b: string) => a.replace(/[^a-z0-9]/gi, '').toLowerCase() === b.replace(/[^a-z0-9]/gi, '').toLowerCase();
  const seenByRadar = ships.filter((s) => s.radarMonths.length);

  // The current month is still filling up; the headline share uses the last whole month.
  const thisMonth = fetched.slice(0, 7);
  const whole = radar.filter((m) => m.month < thisMonth);
  const last = whole.at(-1);
  const darkShare = last && last.detections ? Math.round(((last.detections - last.matched) / last.detections) * 1000) / 10 : null;
  const maxDet = Math.max(...radar.map((m) => m.detections), 1);
  const monthLabel = (m: string) =>
    new Date(`${m}-01T00:00:00Z`).toLocaleDateString(locale, {
      timeZone: 'UTC',
      month: 'short',
    });

  const { ports, radarYears } = SHIPS;
  const portName = (key: string) => {
    if (key.startsWith('~')) return t.near(key.slice(1));
    if (key.startsWith('@')) {
      const [lat, lon] = key.slice(1).split(',');
      return `${lat}°N ${lon}°E`;
    }
    return key || t.unknownPort;
  };
  const maxYear = Math.max(...radarYears.map((y) => y.detections / Math.max(y.passes, 1)), 1);
  const vtype = (v: string) => t.vtype[v.toLowerCase()] ?? t.vtype.other;

  const flags = new Map<string, number>();
  for (const m of radar) for (const [f, n] of Object.entries(m.flags)) flags.set(f, (flags.get(f) ?? 0) + n);
  const flagRows = [...flags.entries()].filter(([f]) => f !== 'unknown').sort((a, b) => b[1] - a[1]);
  const maxFlag = flagRows[0]?.[1] ?? 1;

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: t.metaTitle,
    description: t.datasetDescription,
    inLanguage: LANG_TAG[lang],
    url: absolute(SHIPS_PATHS[lang]),
    dateModified: fetched,
    temporalCoverage: `${win.from}/${win.to}`,
    creator: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    // GFW data is CC BY-NC 4.0, and anything built from it carries the same terms
    license: 'https://creativecommons.org/licenses/by-nc/4.0/',
    isBasedOn: {
      '@type': 'CreativeWork',
      name: 'Global Fishing Watch APIs',
      url: 'https://globalfishingwatch.org/our-apis/',
    },
    distribution: {
      '@type': 'DataDownload',
      encodingFormat: 'application/json',
      contentUrl: SHIPS_RAW_URL,
    },
  };

  const listTags = (s: Ship) => (
    <span className="ltags">
      {s.lists.map((k) => (
        <span key={k} className="ltag" title={LISTS[k].name.en}>
          {LISTS[k].short[lang]}
        </span>
      ))}
    </span>
  );
  const flagName = (f: string | null) => (f ? countryName(f, locale) : '?');

  return (
    <div className="wide sanc ships">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />
      <p className="eyebrow">
        <Link href={SANCTIONS_PATHS[lang]}>{t.eyebrow}</Link>
      </p>
      <h1>{t.h1}</h1>
      <p className="lede">{t.lede(ships.length)}</p>
      <p className="muted small">
        <AsOf date={fetched} label={t.asOf} lang={lang} /> · <Ext href={GFW_URL}>{t.attribution}</Ext>
      </p>

      <div className="tiles">
        <StatTile icon={ShipIcon} value={ships.length} label={t.tiles.listed} note={t.tileNote.listed} />
        <StatTile icon={RadioTower} value={broadcasting.length} label={t.tiles.broadcasting} note={t.tileNote.broadcasting} tone="warn" />
        <StatTile icon={Anchor} value={abroadShips.size} label={t.tiles.abroad} note={t.tileNote.abroad} tone="danger" />
        <StatTile icon={Radar} value={seenByRadar.length} label={t.tiles.radar} note={t.tileNote.radar} />
        {darkShare !== null && last && <StatTile icon={WifiOff} value={`${darkShare}%`} label={t.tiles.dark} note={t.tileNote.dark(formatAsOf(last.month, locale))} />}
      </div>

      <div className="kw-source" role="note">
        <ShieldAlert size={18} aria-hidden="true" />
        <div>
          <b>{t.readTitle}</b>
          {t.read.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>

      <section className="index-section">
        <h2>
          {t.abroadTitle} <small>{abroadShips.size}</small>
        </h2>
        <p className="muted">{t.abroadHint}</p>
        {abroad.length ? (
          <div className="table-wrap">
            <table className="sanc-table">
              <thead>
                <tr>
                  <th>{t.col.ship}</th>
                  <th>{t.col.as}</th>
                  <th>{t.col.port}</th>
                  <th>{t.col.dates}</th>
                  <th>{t.col.lists}</th>
                </tr>
              </thead>
              <tbody>
                {abroad.map((g) => (
                  <tr key={`${g.s.imo}-${g.as}-${g.flag}`}>
                    <td lang="en">
                      <b>{g.s.name}</b>
                      <small>IMO {g.s.imo}</small>
                    </td>
                    <td>
                      <span lang="en">{g.as || '?'}</span>
                      {g.as && !sameName(g.as, g.s.name) && <span className="ltag maybe">{t.otherName}</span>}
                      <small>{flagName(g.flag)}</small>
                    </td>
                    <td>
                      {[...g.ports.values()]
                        .sort((a, b) => b.n - a.n)
                        .map((p) => (
                          <span key={`${p.port}${p.country}`} className="ship-port">
                            <span lang="en">{p.port || t.unknownPort}</span>, {countryName(p.country, locale)}
                            {p.n > 1 && <em> ×{p.n}</em>}
                          </span>
                        ))}
                    </td>
                    <td className="nowrap">
                      {span(g.first, g.last, locale)}
                      <small>{t.visitsN(g.n)}</small>
                    </td>
                    <td>{listTags(g.s)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>{t.abroadNone}</p>
        )}
      </section>

      <section className="index-section" id="ports">
        <h2>{t.portsTitle}</h2>
        <p className="muted">{t.portsHint}</p>
        <div className="tiles">
          <StatTile icon={Anchor} value={ports.visits} label={t.portsTiles.visits} />
          <StatTile icon={ShipIcon} value={ports.vessels} label={t.portsTiles.vessels} />
          <StatTile icon={Anchor} value={ports.foreignVisits} label={t.portsTiles.foreign} tone="warn" />
        </div>
        <h3>{t.busiestTitle}</h3>
        <ul className="ship-flags">
          {ports.list.slice(0, 8).map((p) => (
            <li key={p.portId}>
              <span lang="en">{p.port ? (p.near ? t.near(p.port) : p.port) : `${p.lat.toFixed(1)}°N ${p.lon.toFixed(1)}°E`}</span>
              <i
                style={{
                  width: `${(p.visits / (ports.list[0]?.visits || 1)) * 100}%`,
                }}
              />
              <b>{p.visits}</b>
            </li>
          ))}
        </ul>
        <h3>
          {t.foreignTitle} <small>{ports.foreign.length}</small>
        </h3>
        <p className="muted">{t.foreignHint}</p>
        <div className="table-wrap">
          <table className="sanc-table">
            <thead>
              <tr>
                <th>{t.col2.vessel}</th>
                <th>{t.col2.flag}</th>
                <th>{t.col2.ports}</th>
                <th>{t.col.dates}</th>
              </tr>
            </thead>
            <tbody>
              {ports.foreign.map((f) => (
                <tr key={`${f.mmsi}-${f.name}-${f.flag}`}>
                  <td>
                    <b lang="en">{f.name || '?'}</b>
                    <small>
                      {vtype(f.vtype)} · MMSI {f.mmsi}
                    </small>
                  </td>
                  <td>{flagName(f.flag)}</td>
                  <td>
                    {Object.entries(f.ports)
                      .sort((a, b) => b[1] - a[1])
                      .map(([k, n]) => (
                        <span key={k} className="ship-port">
                          <span lang="en">{portName(k)}</span>
                          {n > 1 && <em> ×{n}</em>}
                        </span>
                      ))}
                  </td>
                  <td className="nowrap">
                    {span(f.first, f.last, locale)}
                    <small>{t.visitsN(f.visits)}</small>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="index-section">
        <h2>{t.radarTitle}</h2>
        <p className="muted">{t.radarHint}</p>
        <div className="panel">
          <ol className="year-bars sanc-bars kw-bars">
            {radar.map((m) => {
              const h = (m.detections / maxDet) * 86;
              const partial = m.month >= thisMonth;
              return (
                <li
                  key={m.month}
                  title={`${formatAsOf(m.month, locale)}: ${t.detectionsIn(m.detections, m.passes)}${partial ? ` (${t.partial})` : ''}`}
                  className={partial ? 'partial' : ''}
                >
                  <span className="yb-stack" style={{ height: `${h}%` }}>
                    {m.matched > 0 && <i style={{ flex: m.matched }} className="sh-lit" />}
                    <i style={{ flex: m.detections - m.matched }} className="sh-dark" />
                  </span>
                  <em style={{ '--h': `${h}%` } as React.CSSProperties}>{m.detections >= 1000 ? `${Math.round(m.detections / 100) / 10}k` : m.detections}</em>
                  <small>{monthLabel(m.month)}</small>
                </li>
              );
            })}
          </ol>
          <p className="key left">
            <span>
              <i className="sh-dark" /> {t.key.dark}
            </span>
            <span>
              <i className="sh-lit" /> {t.key.matched}
            </span>
          </p>
          <p className="muted small">
            {t.passes}: {radar.map((m) => `${monthLabel(m.month)} ${m.passes}`).join(' · ')} · <AsOf date={radarThrough} label={t.asOf} lang={lang} />
          </p>
        </div>
        <div className="callout">
          <h2>{t.caveatTitle}</h2>
          {t.caveat.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </section>
      <section className="index-section">
        <h2>{t.historyTitle}</h2>
        <p className="muted">{t.historyHint}</p>
        <div className="panel">
          <ol className="year-bars sanc-bars">
            {radarYears.map((y) => {
              const perDay = y.detections / Math.max(y.passes, 1);
              const h = (perDay / maxYear) * 86;
              const dark = y.detections ? Math.round(((y.detections - y.matched) / y.detections) * 1000) / 10 : 0;
              return (
                <li key={y.year} title={`${y.year}: ${Math.round(perDay)} ${t.perDay} · ${dark}% ${t.key.dark}`} className={y.months < 12 ? 'partial' : ''}>
                  <span className="yb-stack" style={{ height: `${h}%` }}>
                    <i style={{ flex: 1 }} className="sh-dark" />
                  </span>
                  <em style={{ '--h': `${h}%` } as React.CSSProperties}>{Math.round(perDay)}</em>
                  <small>{y.year}</small>
                </li>
              );
            })}
          </ol>
          <p className="muted small">
            {t.perDay}. {radarYears.map((y) => `${y.year}: ${y.detections ? Math.round(((y.detections - y.matched) / y.detections) * 1000) / 10 : 0}% ${t.key.dark}`).join(' · ')}
          </p>
        </div>
      </section>

      <div className="kw-grid">
        <section className="index-section">
          <h2>{t.flagsTitle}</h2>
          <p className="muted">{t.flagsHint}</p>
          <ul className="ship-flags">
            {flagRows.slice(0, 12).map(([f, n]) => (
              <li key={f}>
                <span>{countryName(f, locale)}</span>
                <i style={{ width: `${(n / maxFlag) * 100}%` }} />
                <b>{n}</b>
              </li>
            ))}
          </ul>
        </section>
        <section className="index-section">
          <h2>
            {t.seenTitle} <small>{seenByRadar.length}</small>
          </h2>
          <p className="muted">{t.seenHint}</p>
          <ul className="ichips" lang="en">
            {seenByRadar.map((s) => (
              <li key={shipKey(s)}>
                <Radar size={15} aria-hidden="true" />
                {s.name}
                <small className="muted">{s.radarMonths.map((m) => formatAsOf(m, 'en-GB')).join(', ')}</small>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="index-section">
        <h2>
          {t.allTitle} <small>{ships.length}</small>
        </h2>
        <p className="muted">{t.allHint}</p>
        <div className="table-wrap">
          <table className="sanc-table">
            <thead>
              <tr>
                <th>{t.col.ship}</th>
                <th>{t.col.lastSeen}</th>
                <th>{t.col2.history}</th>
                <th>{t.col.radar}</th>
                <th>{t.col.lists}</th>
              </tr>
            </thead>
            <tbody>
              {ships.map((s) => {
                const latest = s.ais[0];
                return (
                  <tr key={shipKey(s)}>
                    <td lang="en">
                      <b>{s.name}</b>
                      <small>IMO {s.imo}</small>
                    </td>
                    <td>
                      {latest ? (
                        <>
                          <span className="nowrap">{formatAsOf(latest.last, locale)}</span>
                          <small>
                            <span lang="en">{latest.name}</span> · {flagName(latest.flag)}
                          </small>
                        </>
                      ) : (
                        <span className="muted">{t.noAis}</span>
                      )}
                    </td>
                    <td className="nowrap">
                      {s.history.visits ? `${s.history.visits}${s.history.foreign ? ` (${s.history.foreign} ${t.abroadShort})` : ''}` : '—'}
                      {s.history.since && <small>{t.sinceShort(s.history.since.slice(0, 4))}</small>}
                    </td>
                    <td className="nowrap">{s.radarMonths.length ? s.radarMonths.map((m) => monthLabel(m)).join(', ') : '—'}</td>
                    <td>{listTags(s)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <p>
        <Link href={SANCTIONS_PATHS[lang]}>← {t.back}</Link> · <Ext href={SHIPS_DATA_URL}>{t.dataLink}</Ext> · <Ext href={GFW_URL}>{t.attribution}</Ext>
      </p>

      <h2>{t.sources}</h2>
      <SourceCards sources={SHIP_SOURCES} />
    </div>
  );
}
