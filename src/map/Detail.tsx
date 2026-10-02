'use client';

import Link from 'next/link';
import type { Feature } from 'geojson';
import { LAYERS, type LayerId } from './config';
import type { Data, Selection } from './types';

type P = Record<string, any>;
const n = (v: unknown) => (typeof v === 'number' ? v.toLocaleString('en-US') : '—');
const pct = (a?: number | null, b?: number | null) => (a && b ? `${Math.round((a / b) * 100)}%` : '—');
const parse = <T,>(s: unknown, fallback: T): T => {
  try {
    return typeof s === 'string' ? JSON.parse(s) : ((s as T) ?? fallback);
  } catch {
    return fallback;
  }
};

function Sources({ list }: { list: { name: string; url: string }[] }) {
  if (!list.length) return null;
  return (
    <p className="d-sources">
      Source{list.length > 1 ? 's' : ''}:{' '}
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
function Bars({ rows, color }: { rows: [string, number][]; color: string }) {
  const max = Math.max(...rows.map((r) => r[1]), 1);
  return (
    <ul className="bars">
      {rows.map(([label, v]) => (
        <li key={label}>
          <span className="bars-label">{label.replace(/^Rights? (to|of) (the )?/i, '').replace(/^./, (c) => c.toUpperCase())}</span>
          <span className="bars-track">
            <i style={{ width: `${(v / max) * 100}%`, background: color }} />
          </span>
          <b>{v}</b>
        </li>
      ))}
    </ul>
  );
}

function CountyDetail({ f, data, onSelect }: { f: Feature; data: Data; onSelect: (s: Selection) => void }) {
  const p = f.properties as P;
  const rights = parse<[string, number][]>(p.rights, []);
  const decades = parse<Record<string, number>>(p.decades, {});
  const inside = (layer: LayerId) => data[layer].features.filter((x) => x.properties?.county === p.pcode);
  const lists: { layer: LayerId; items: Feature[] }[] = (['camps', 'detention', 'missile-bases', 'sites', 'markets'] as LayerId[])
    .map((layer) => ({ layer, items: inside(layer) }))
    .filter((l) => l.items.length);
  const decadeRows = Object.entries(decades).filter(([k]) => !/verification/i.test(k));
  return (
    <>
      <p className="d-kicker">County · {p.province}</p>
      <h2>{p.name}</h2>
      <p style={{ margin: '0.2rem 0 0.8rem', fontSize: '0.9rem' }}>
        <Link href={`/counties/${String(p.pcode).toLowerCase()}`}>View full county dossier →</Link>
      </p>
      <div className="d-stats">
        <div>
          <b>{n(p.pop)}</b>
          <span>people (2008)</span>
        </div>
        <div>
          <b>{n(p.density)}</b>
          <span>per km²</span>
        </div>
        <div>
          <b>{pct(p.urban, p.pop)}</b>
          <span>urban</span>
        </div>
        <div>
          <b>{n(p.area)}</b>
          <span>km²</span>
        </div>
      </div>

      <h3>
        Documented abuses <small>{n(p.incidents)} recorded by NKDB</small>
      </h3>
      {rights.length ? <Bars rows={rights.slice(0, 6)} color="#dc2626" /> : <p className="muted">No abuses recorded here yet. That usually means nobody from here has testified, not that nothing happened.</p>}
      {decadeRows.length > 0 && (
        <p className="d-decades">
          {decadeRows.map(([k, v]) => (
            <span key={k}>
              {k.replace('The ', '')} <b>{v}</b>
            </span>
          ))}
        </p>
      )}

      {lists.map(({ layer, items }) => {
        const def = LAYERS.find((l) => l.id === layer)!;
        return (
          <div key={layer}>
            <h3>
              {def.label} <small>{items.length}</small>
            </h3>
            <ul className="d-list">
              {items.slice(0, 12).map((it) => (
                <li key={String(it.properties?.id)}>
                  <button onClick={() => onSelect({ kind: 'point', layer, id: String(it.properties?.id) })}>
                    <i style={{ background: def.color }} />
                    {it.properties?.name}
                    {it.properties?.type && <small>{it.properties.type}</small>}
                  </button>
                </li>
              ))}
              {items.length > 12 && <li className="muted">+{items.length - 12} more</li>}
            </ul>
          </div>
        );
      })}
      <Sources
        list={[
          { name: 'UN OCHA boundaries', url: 'https://data.humdata.org/dataset/cod-ab-prk' },
          { name: '2008 census', url: 'https://data.humdata.org/dataset/cod-ps-prk' },
          { name: 'NKDB Visual Atlas', url: 'https://www.visualatlas.org/en/density' },
        ]}
      />
    </>
  );
}

function PointDetail({ layer, f }: { layer: LayerId; f: Feature }) {
  const p = f.properties as P;
  const def = LAYERS.find((l) => l.id === layer)!;
  const [lon, lat] = (f.geometry as { coordinates: number[] }).coordinates;
  const sources = parse<{ name: string; url: string }[]>(p.sources, []);
  const extra: { name: string; url: string }[] = [];
  if (p.url) extra.push({ name: layer === 'missile-bases' ? 'CSIS report' : 'Source', url: p.url });
  const src = parse<{ label: string; url: string } | null>(p.source, null);
  if (src) extra.push({ name: src.label, url: src.url });

  return (
    <>
      <p className="d-kicker" style={{ color: def.color }}>
        {p.kind ?? p.type ?? def.label}
      </p>
      <h2>{p.name}</h2>
      {p.status && <p className="place-status">{p.status}</p>}

      {(p.prisoners || p.incidents || p.stalls || p.agency) && (
        <div className="d-stats">
          {p.prisoners ? (
            <div>
              <b>~{n(p.prisoners)}</b>
              <span>prisoners (HRNK est.)</span>
            </div>
          ) : null}
          {p.incidents ? (
            <div>
              <b>{n(p.incidents)}</b>
              <span>abuses recorded here</span>
            </div>
          ) : null}
          {p.stalls ? (
            <div>
              <b>{n(p.stalls)}</b>
              <span>stalls</span>
            </div>
          ) : null}
          {p.area_m2 ? (
            <div>
              <b>{n(p.area_m2)}</b>
              <span>m² market area</span>
            </div>
          ) : null}
          {p.revenue_usd ? (
            <div>
              <b>${n(Math.round(p.revenue_usd))}</b>
              <span>est. yearly stall fees</span>
            </div>
          ) : null}
        </div>
      )}
      {p.agency && (
        <p>
          <b>Run by:</b> {p.agency}
        </p>
      )}
      {p.province && (
        <p className="muted">
          {p.province}
          {layer === 'markets' && p.km_to_border ? ` · ${n(p.km_to_border)} km from the Chinese border` : ''}
        </p>
      )}
      {(p.note || p.summary) && <p>{p.note ?? p.summary}</p>}
      {p.published && <p className="muted">Report published {p.published}</p>}
      <p className="place-meta">
        {lat.toFixed(4)}°N, {lon.toFixed(4)}°E{p.approx ? ' (approximate)' : ''}
        {layer === 'detention' && p.confirmed === false ? ' · location unconfirmed' : ''}
      </p>
      {layer === 'camps' && (
        <p>
          <Link href={`/camps/${String(p.id)}`}>View full camp dossier →</Link>
        </p>
      )}
      {(layer === 'sites' || layer === 'missile-bases') && (
        <p>
          <Link href={`/places/${String(p.id)}`}>View full site details →</Link>
        </p>
      )}
      {p.more && (
        <p>
          <Link href={p.more}>Read more →</Link>
        </p>
      )}
      <Sources list={[...sources, ...extra]} />
    </>
  );
}

export default function Detail({ sel, data, onSelect, onClose }: { sel: Selection; data: Data; onSelect: (s: Selection) => void; onClose: () => void }) {
  const f =
    sel.kind === 'county'
      ? data.counties.features.find((x) => x.properties?.pcode === sel.id)
      : data[sel.layer].features.find((x) => String(x.properties?.id) === sel.id);
  if (!f) return null;
  return (
    <aside className="detail place-detail intel-detail">
      <button className="modal-close" onClick={onClose} aria-label="Close">
        ✕
      </button>
      {sel.kind === 'county' ? <CountyDetail f={f} data={data} onSelect={onSelect} /> : <PointDetail layer={sel.layer} f={f} />}
    </aside>
  );
}
