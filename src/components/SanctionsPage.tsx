import Link from 'next/link';
import { Building2, CalendarOff, Landmark, Plane, Ship, User, Users } from 'lucide-react';
import AsOf, { formatAsOf } from '@/components/AsOf';
import Avatar from '@/components/Avatar';
import { Ext } from '@/components/Ext';
import { SourceCards, StatTile } from '@/components/Visual';
import { RESOLUTIONS, SANCTIONS, SANCTIONS_PATHS, SANCTIONS_TEXT, SANCTION_SOURCES, type OfacKind, type UnEntry } from '@/content/sanctions';
import { ENTITY_ORGS, PEOPLE, currentRole } from '@/entities';
import { REVIEWED } from '@/site/config';
import { absolute, jsonLd, type Lang } from '@/site/seo';

const LOCALE: Record<Lang, string> = { en: 'en-GB', ko: 'ko-KR', ja: 'ja-JP' };
const KIND_ICON: Record<OfacKind, typeof User> = { individual: User, entity: Building2, vessel: Ship, aircraft: Plane };
const KINDS: OfacKind[] = ['individual', 'entity', 'vessel', 'aircraft'];

// Which list entries belong to someone we have a profile for ("UN KPi.043" → jo-yong-won).
const profileOf = new Map<string, string>();
for (const p of PEOPLE) for (const s of p.sanctions) if (s.id) profileOf.set(`${s.list} ${s.id}`, p.id);

function UnTable({ rows, people, t, lang }: { rows: UnEntry[]; people: boolean; t: (typeof SANCTIONS_TEXT)[Lang]; lang: Lang }) {
  return (
    <div className="table-wrap">
      <table className="sanc-table">
        <thead>
          <tr>
            <th>{t.col.name}</th>
            <th>{t.col.listed}</th>
            <th>{people ? `${t.col.role} / ${t.col.why}` : t.col.why}</th>
            <th>{t.col.ref}</th>
          </tr>
        </thead>
        <tbody lang="en">
          {rows.map((e) => {
            const pid = profileOf.get(`UN ${e.ref}`);
            return (
              <tr key={e.ref} id={e.ref}>
                <td>
                  {pid ? <Link href={`/people/${pid}`}>{e.name}</Link> : <b>{e.name}</b>}
                  {e.aliases.length > 0 && <small>{e.aliases.slice(0, 3).join(', ')}</small>}
                </td>
                <td className="nowrap">{formatAsOf(e.listed, LOCALE[lang])}</td>
                <td>{e.note ?? e.role ?? '—'}</td>
                <td className="nowrap muted">{e.ref}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** The sanctions page, shared by /sanctions, /ko/sanctions and /ja/sanctions. Only the text changes per language. */
export default function SanctionsPage({ lang }: { lang: Lang }) {
  const t = SANCTIONS_TEXT[lang];
  const { un, ofac, fetched } = SANCTIONS;
  const all = [...un.individuals, ...un.entities];
  const lastListed = all.reduce((m, e) => (e.listed > m ? e.listed : m), '');

  const endYear = +REVIEWED.slice(0, 4);
  const years = Array.from({ length: endYear - 2006 + 1 }, (_, i) => 2006 + i);
  const perYear = years.map((y) => ({
    y,
    people: un.individuals.filter((e) => e.listed.startsWith(String(y))).length,
    entities: un.entities.filter((e) => e.listed.startsWith(String(y))).length,
  }));
  const maxYear = Math.max(...perYear.map((b) => b.people + b.entities), 1);

  const profiledPeople = PEOPLE.filter((p) => p.sanctions.length);
  const profiledOrgs = ENTITY_ORGS.filter((o) => o.sanctions.length);

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: t.metaTitle,
    description: t.metaDescription,
    inLanguage: lang,
    url: absolute(SANCTIONS_PATHS[lang]),
    dateModified: fetched,
    isBasedOn: [SANCTION_SOURCES[0].url, SANCTION_SOURCES[2].url],
  };

  return (
    <div className="wide sanc">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />
      <p className="eyebrow">{t.eyebrow}</p>
      <h1>{t.h1}</h1>
      <p className="lede">{t.lede}</p>
      <div className="tiles">
        <StatTile icon={Users} value={un.individuals.length} label={t.tiles.unPeople} tone="danger" />
        <StatTile icon={Landmark} value={un.entities.length} label={t.tiles.unEntities} tone="danger" />
        <StatTile icon={Building2} value={ofac.length} label={t.tiles.us} />
        <StatTile icon={CalendarOff} value={formatAsOf(lastListed.slice(0, 7), LOCALE[lang])} label={t.tiles.lastUn} note={t.tiles.lastUnNote} tone="warn" />
      </div>
      <p>
        <AsOf date={fetched} label={t.fetched} lang={lang} />
      </p>
      {t.englishNote && <p className="muted small">{t.englishNote}</p>}

      <section className="index-section">
        <h2>{t.byYearTitle}</h2>
        <p className="muted">{t.byYearHint}</p>
        <div className="panel">
          <ol className="year-bars sanc-bars">
            {perYear.map((b) => (
              <li key={b.y} title={`${b.y}: ${b.people + b.entities}`}>
                <span className="yb-stack" style={{ height: `${((b.people + b.entities) / maxYear) * 86}%` }}>
                  {b.people > 0 && <i style={{ flex: b.people }} className="sb-people" />}
                  {b.entities > 0 && <i style={{ flex: b.entities }} className="sb-entities" />}
                </span>
                {b.people + b.entities > 0 && <em style={{ '--h': `${((b.people + b.entities) / maxYear) * 86}%` } as React.CSSProperties}>{b.people + b.entities}</em>}
                <small>{String(b.y).slice(2)}</small>
              </li>
            ))}
          </ol>
          <p className="key left">
            <span>
              <i className="sb-people" /> {t.kinds.individual}
            </span>
            <span>
              <i className="sb-entities" /> {t.kinds.entity}
            </span>
          </p>
        </div>
        <div className="callout">
          <h2>{t.stalledTitle}</h2>
          {t.stalled.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </section>

      <section className="index-section">
        <h2>{t.resolutionsTitle}</h2>
        <p className="muted">{t.resolutionsHint}</p>
        <ol className="res-line">
          {RESOLUTIONS.map((r) => (
            <li key={r.no}>
              <span className="res-year">{r.date.slice(0, 4)}</span>
              <div>
                <b>
                  <Ext href={`https://undocs.org/S/RES/${r.no}(${r.date.slice(0, 4)})`}>UNSCR {r.no}</Ext>
                </b>
                <small>
                  {formatAsOf(r.date, LOCALE[lang])} · {t.after} {r.trigger[lang]}
                </small>
                <p>{r.did[lang]}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="index-section">
        <h2>
          {t.profiledTitle} <small>{profiledPeople.length + profiledOrgs.length}</small>
        </h2>
        <p className="muted">{t.profiledHint}</p>
        <div className="pgrid" lang="en">
          {profiledPeople.map((p) => (
            <Link key={p.id} href={`/people/${p.id}`} className="pcard">
              <Avatar person={p} size={64} />
              <b>{p.name_en}</b>
              {currentRole(p) && <span className="pcard-role">{currentRole(p)!.title}</span>}
              <span className="pcard-flag sanction">{[...new Set(p.sanctions.map((s) => s.list))].join(' + ')}</span>
            </Link>
          ))}
        </div>
        <ul className="ichips" lang="en">
          {profiledOrgs.map((o) => (
            <li key={o.id}>
              <Landmark size={15} aria-hidden="true" />
              {o.name_en}
              <small className="muted">{[...new Set(o.sanctions.map((s) => s.list))].join(' + ')}</small>
            </li>
          ))}
        </ul>
      </section>

      <section className="index-section">
        <h2>
          {t.unPeopleTitle} <small>{un.individuals.length}</small>
        </h2>
        <p className="muted">{t.unHint}</p>
        <UnTable rows={un.individuals} people t={t} lang={lang} />
      </section>

      <section className="index-section">
        <h2>
          {t.unEntitiesTitle} <small>{un.entities.length}</small>
        </h2>
        <UnTable rows={un.entities} people={false} t={t} lang={lang} />
      </section>

      <section className="index-section">
        <h2>
          {t.usTitle} <small>{ofac.length}</small>
        </h2>
        <p className="muted">
          {t.usHint} {t.usLookup}
        </p>
        <div className="tiles">
          {KINDS.map((k) => (
            <StatTile key={k} icon={KIND_ICON[k]} value={ofac.filter((e) => e.kind === k).length} label={t.kinds[k]} />
          ))}
        </div>
        {KINDS.map((k) => {
          const rows = ofac.filter((e) => e.kind === k);
          const Icon = KIND_ICON[k];
          return (
            <details key={k} className="sanc-details">
              <summary>
                <Icon size={16} aria-hidden="true" /> {t.kinds[k]} <small>{rows.length}</small>
              </summary>
              <ul className="sanc-names" lang="en">
                {rows.map((e) => {
                  const pid = profileOf.get(`OFAC ${e.id}`);
                  return (
                    <li key={e.id}>
                      <Ext href={`https://sanctionssearch.ofac.treas.gov/Details.aspx?id=${e.id}`}>{e.name}</Ext>
                      {pid && (
                        <Link href={`/people/${pid}`} className="sanc-profile">
                          profile
                        </Link>
                      )}
                      {e.title && <small>{e.title}</small>}
                    </li>
                  );
                })}
              </ul>
            </details>
          );
        })}
      </section>

      <h2>{t.sources}</h2>
      <SourceCards sources={SANCTION_SOURCES} />
    </div>
  );
}
