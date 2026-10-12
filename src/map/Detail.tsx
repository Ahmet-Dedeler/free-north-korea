'use client';

import Link from 'next/link';
import type { Feature } from 'geojson';
import AsOf, { isStale } from '@/components/AsOf';
import { baseSlug, campSlug } from '@/content/mapSlugs';
import { LAYERS, MANIFEST, type LayerId } from './config';
import type { Data, Selection } from './types';
import type { Lang } from '@/site/seo';
import { localize } from '@/content/chrome';
import { NUM_LOCALE, decadeShort, provinceName, rightsLabel } from '@/content/countiesI18n';
import { MAP_TEXT, type MapText } from '@/content/mapI18n';
import { CAMPS_TEXT, campCopy } from '@/content/campsI18n';
import { PLACE_COPY } from '@/content/placesI18n';
import type { MapSatSite } from '@/content/satLabels';
import PlacePhoto from './Photo';
import { countryName } from '@/site/countries';

type P = Record<string, any>;
/** Number formatter for the reader's language. */
const num = (lang: Lang) => (v: unknown) => (typeof v === 'number' ? v.toLocaleString(NUM_LOCALE[lang]) : '—');
const pct = (a?: number | null, b?: number | null) => (a && b ? `${Math.round((a / b) * 100)}%` : '—');
const parse = <T,>(s: unknown, fallback: T): T => {
  try {
    return typeof s === 'string' ? JSON.parse(s) : ((s as T) ?? fallback);
  } catch {
    return fallback;
  }
};

function Sources({ list, tx }: { list: { name: string; url: string }[]; tx: MapText }) {
  if (!list.length) return null;
  return (
    <p className="d-sources">
      {list.length > 1 ? tx.sources : tx.source}:{' '}
      {list.map((s, i) => (
        <span key={s.url + i}>
          {i > 0 && ' · '}
          <a href={s.url} target="_blank" rel="noopener noreferrer">
            {s.name}
          </a>
        </span>
      ))}
    </p>
  );
}

/** Horizontal bar list, used for "abuses by right violated". */
function Bars({ rows, color, lang }: { rows: [string, number][]; color: string; lang: Lang }) {
  const max = Math.max(...rows.map((r) => r[1]), 1);
  return (
    <ul className="bars">
      {rows.map(([label, v]) => (
        <li key={label}>
          <span className="bars-label">{rightsLabel(label, lang)}</span>
          <span className="bars-track">
            <i style={{ width: `${(v / max) * 100}%`, background: color }} />
          </span>
          <b>{v}</b>
        </li>
      ))}
    </ul>
  );
}

function CountyDetail({ f, data, lang, onSelect }: { f: Feature; data: Data; lang: Lang; onSelect: (s: Selection) => void }) {
  const p = f.properties as P;
  const tx = MAP_TEXT[lang];
  const n = num(lang);
  const rights = parse<[string, number][]>(p.rights, []);
  const decades = parse<Record<string, number>>(p.decades, {});
  const inside = (layer: LayerId) => data[layer].features.filter((x) => x.properties?.county === p.pcode);
  const lists: { layer: LayerId; items: Feature[] }[] = (['camps', 'detention', 'missile-bases', 'sites', 'markets'] as LayerId[])
    .map((layer) => ({ layer, items: inside(layer) }))
    .filter((l) => l.items.length);
  const decadeRows = Object.entries(decades).filter(([k]) => !/verification/i.test(k));
  return (
    <>
      <p className="d-kicker">
        {tx.county} · {provinceName(p.province, lang)}
      </p>
      <h2>{p.name}</h2>
      <p style={{ margin: '0.2rem 0 0.8rem', fontSize: '0.9rem' }}>
        <Link href={localize(lang, `/counties/${String(p.pcode).toLowerCase()}`)}>{tx.countyDossier}</Link>
      </p>
      <div className="d-stats">
        <div>
          <b>{n(p.pop)}</b>
          <span>{tx.peopleYear}</span>
        </div>
        <div>
          <b>{n(p.density)}</b>
          <span>{tx.perKm2}</span>
        </div>
        <div>
          <b>{pct(p.urban, p.pop)}</b>
          <span>{tx.urban}</span>
        </div>
        <div>
          <b>{n(p.area)}</b>
          <span>km²</span>
        </div>
      </div>

      <p className="d-asof">
        <AsOf date="2008" label={tx.censusLabel} lang={lang} />
      </p>

      <h3>
        {tx.abuses} <small>{tx.recordedBy(n(p.incidents))}</small>
      </h3>
      {rights.length ? <Bars rows={rights.slice(0, 6)} color="#dc2626" lang={lang} /> : <p className="muted">{tx.noAbuses}</p>}
      {decadeRows.length > 0 && (
        <p className="d-decades">
          {decadeRows.map(([k, v]) => (
            <span key={k}>
              {lang === 'en' ? k.replace('The ', '') : decadeShort(k, lang)} <b>{v}</b>
            </span>
          ))}
        </p>
      )}

      {lists.map(({ layer, items }) => {
        const def = LAYERS.find((l) => l.id === layer)!;
        return (
          <div key={layer}>
            <h3>
              {tx.layers[layer].label} <small>{items.length}</small>
            </h3>
            <ul className="d-list" lang={lang === 'en' ? undefined : 'en'}>
              {items.slice(0, 12).map((it) => (
                <li key={String(it.properties?.id)}>
                  <button onClick={() => onSelect({ kind: 'point', layer, id: String(it.properties?.id) })}>
                    <i style={{ background: def.color }} />
                    {it.properties?.name}
                    {it.properties?.type && <small>{it.properties.type}</small>}
                  </button>
                </li>
              ))}
              {items.length > 12 && (
                <li className="muted" lang={lang}>
                  {tx.more(items.length - 12)}
                </li>
              )}
            </ul>
          </div>
        );
      })}
      <Sources
        list={[
          { name: tx.ochaSource, url: 'https://data.humdata.org/dataset/cod-ab-prk' },
          { name: tx.censusSource, url: 'https://data.humdata.org/dataset/cod-ps-prk' },
          { name: tx.nkdbSource, url: 'https://www.visualatlas.org/en/density' },
        ]}
        tx={tx}
      />
    </>
  );
}

const LOCALE: Record<Lang, string> = { en: 'en-GB', ko: 'ko-KR', ja: 'ja-JP', zh: 'zh-CN' };

/** A North Korean anchorage from Global Fishing Watch port visits (scripts/build-ships.ts). */
function PortDetail({ f, lang, photo }: { f: Feature; lang: Lang; photo: React.ReactNode }) {
  const p = f.properties as P;
  const tx = MAP_TEXT[lang];
  const n = num(lang);
  const flags = Object.entries(parse<Record<string, number>>(p.flags, {}));
  // foreign flags first, biggest first; North Korea's own ships last, labelled as such
  const rows = [...flags.filter(([k]) => k !== 'PRK').sort((a, b) => b[1] - a[1]), ...flags.filter(([k]) => k === 'PRK')];
  const max = Math.max(...rows.map((r) => r[1]), 1);
  const def = LAYERS.find((l) => l.id === 'ports')!;
  const [lon, lat] = (f.geometry as { coordinates: number[] }).coordinates;
  const updated = MANIFEST.layers.ports?.sources[0]?.updated;
  return (
    <>
      {photo}
      <p className="d-kicker" style={{ color: def.color }}>
        {tx.portKicker}
      </p>
      <h2>{tx.portName(String(p.port ?? ''), p.near === true, String(p.name))}</h2>
      <div className="d-stats">
        <div>
          <b>{n(p.visits)}</b>
          <span>{tx.portVisits}</span>
        </div>
        <div>
          <b>{n(p.vessels)}</b>
          <span>{tx.portShips}</span>
        </div>
      </div>
      {updated && (
        <p className="d-asof">
          <AsOf date={updated} lang={lang} />
        </p>
      )}
      <h3>{tx.portFlags}</h3>
      <ul className="bars">
        {rows.map(([k, v]) => (
          <li key={k}>
            <span className="bars-label">{k === 'PRK' ? tx.portNkShips : k === 'unknown' ? tx.portNoFlag : countryName(k, LOCALE[lang])}</span>
            <span className="bars-track">
              <i style={{ width: `${(v / max) * 100}%`, background: k === 'PRK' ? 'var(--ink-3)' : def.color }} />
            </span>
            <b>{v}</b>
          </li>
        ))}
      </ul>
      <p className="muted">{tx.portNote}</p>
      <p className="place-meta">
        {lat.toFixed(4)}°N, {lon.toFixed(4)}°E
      </p>
      <p>
        {/* not SHIPS_PATHS: content/ships.ts imports the whole ships file, too big for the map bundle */}
        <Link href={`${localize(lang, '/sanctions/ships')}#ports`}>{tx.portLink}</Link>
      </p>
      <Sources list={[{ name: 'Powered by Global Fishing Watch', url: 'https://globalfishingwatch.org/' }]} tx={tx} />
    </>
  );
}

/** Camp Watch id of a map point: camps and missile bases use their dossier slug, places their own id. */
const satId = (layer: LayerId, id: string) => (layer === 'camps' ? campSlug(id) : layer === 'missile-bases' ? baseSlug(id) : id);

function PointDetail({ layer, f, lang, sat }: { layer: LayerId; f: Feature; lang: Lang; sat: Record<string, MapSatSite> }) {
  const p = f.properties as P;
  const tx = MAP_TEXT[lang];
  const n = num(lang);
  // Camps, nuclear/missile sites and missile bases have translated status and notes (the same copy as their
  // dossiers); everything else (names, NKDB facility types, market data) is published in English only.
  const copy =
    lang === 'en'
      ? null
      : layer === 'camps'
        ? campCopy(lang, campSlug(String(p.id)))
        : layer === 'sites' || layer === 'missile-bases'
          ? (PLACE_COPY[lang][String(p.id)] ?? null)
          : null;
  const kind =
    lang !== 'en' && layer === 'camps' && p.kind ? (/kwanliso/i.test(p.kind) ? CAMPS_TEXT[lang].kindKwanliso : CAMPS_TEXT[lang].kindKyohwaso) : null;
  const en = lang === 'en' ? undefined : 'en';
  const status = p.status ? (copy?.status ?? p.status) : undefined;
  const note = copy?.note ?? p.note ?? p.summary;
  const def = LAYERS.find((l) => l.id === layer)!;
  const [lon, lat] = (f.geometry as { coordinates: number[] }).coordinates;
  const sources = parse<{ name: string; url: string }[]>(p.sources, []);
  const extra: { name: string; url: string }[] = [];
  if (p.url) extra.push({ name: layer === 'missile-bases' ? tx.csisReport : tx.source, url: p.url });
  const src = parse<{ label: string; url: string } | null>(p.source, null);
  if (src) extra.push({ name: src.label, url: src.url });
  // when the whole layer comes from an old survey (markets: 2018), say so on every point
  const layerDate = MANIFEST.layers[layer]?.sources[0]?.updated;

  const sid = satId(layer, String(p.id));
  const photo = layer === 'escape-route' ? null : <PlacePhoto key={`${layer}/${p.id}`} siteId={sid} site={sat[sid]} name={p.name} layer={layer} lat={lat} lon={lon} approx={!!p.approx} lang={lang} />;
  if (layer === 'ports') return <PortDetail f={f} lang={lang} photo={photo} />;

  return (
    <>
      {photo}
      <p className="d-kicker" style={{ color: def.color }}>
        {kind ?? (p.kind ?? p.type ? <span lang={en}>{p.kind ?? p.type}</span> : tx.layers[layer].label)}
      </p>
      <h2 lang={en}>{p.name}</h2>
      {status && (
        <p className="place-status" lang={copy?.status ? undefined : en}>
          {status}
        </p>
      )}

      {(p.prisoners || p.incidents || p.stalls || p.agency) && (
        <div className="d-stats">
          {p.prisoners ? (
            <div>
              <b>~{n(p.prisoners)}</b>
              <span>{tx.prisoners}</span>
            </div>
          ) : null}
          {p.incidents ? (
            <div>
              <b>{n(p.incidents)}</b>
              <span>{tx.abusesHere}</span>
            </div>
          ) : null}
          {p.stalls ? (
            <div>
              <b>{n(p.stalls)}</b>
              <span>{tx.stalls}</span>
            </div>
          ) : null}
          {p.area_m2 ? (
            <div>
              <b>{n(p.area_m2)}</b>
              <span>{tx.marketArea}</span>
            </div>
          ) : null}
          {p.revenue_usd ? (
            <div>
              <b>${n(Math.round(p.revenue_usd))}</b>
              <span>{tx.stallFees}</span>
            </div>
          ) : null}
        </div>
      )}
      {p.agency && (
        <p>
          <b>{tx.runBy}</b> <span lang={en}>{p.agency}</span>
        </p>
      )}
      {p.province && (
        <p className="muted">
          {provinceName(p.province, lang)}
          {layer === 'markets' && p.km_to_border ? ` · ${tx.kmFromBorder(n(p.km_to_border))}` : ''}
        </p>
      )}
      {note && <p lang={copy?.note ? undefined : en}>{note}</p>}
      {layerDate && isStale(layerDate) && (
        <p className="d-asof">
          <AsOf date={layerDate.slice(0, 7)} lang={lang} />
        </p>
      )}
      {p.published && <p className="muted">{tx.published(p.published)}</p>}
      <p className="place-meta">
        {lat.toFixed(4)}°N, {lon.toFixed(4)}°E{p.approx ? tx.approx : ''}
        {layer === 'detention' && p.confirmed === false ? tx.unconfirmed : ''}
      </p>
      {layer === 'camps' && (
        <p>
          <Link href={localize(lang, `/camps/${campSlug(String(p.id))}`)}>{tx.campDossier}</Link>
        </p>
      )}
      {(layer === 'sites' || layer === 'missile-bases') && (
        <p>
          <Link href={localize(lang, `/places/${baseSlug(String(p.id))}`)}>{tx.siteDossier}</Link>
        </p>
      )}
      {p.more && (
        <p>
          <Link href={localize(lang, p.more)}>{tx.readMore}</Link>
        </p>
      )}
      <Sources list={[...sources, ...extra]} tx={tx} />
    </>
  );
}

export default function Detail({ sel, data, sat, lang, onSelect, onClose }: { sel: Selection; data: Data; sat: Record<string, MapSatSite>; lang: Lang; onSelect: (s: Selection) => void; onClose: () => void }) {
  const f =
    sel.kind === 'county'
      ? data.counties.features.find((x) => x.properties?.pcode === sel.id)
      : data[sel.layer].features.find((x) => String(x.properties?.id) === sel.id);
  if (!f) return null;
  return (
    <aside className={`detail place-detail intel-detail ${sel.kind === 'point' && sel.layer !== 'escape-route' ? 'has-photo' : ''}`}>
      <button className="modal-close" onClick={onClose} aria-label={MAP_TEXT[lang].close}>
        ✕
      </button>
      {sel.kind === 'county' ? <CountyDetail f={f} data={data} lang={lang} onSelect={onSelect} /> : <PointDetail layer={sel.layer} f={f} lang={lang} sat={sat} />}
    </aside>
  );
}
