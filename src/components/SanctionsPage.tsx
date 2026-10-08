import Link from 'next/link';
import { Building2, CalendarOff, CircleQuestionMark, Flag, Landmark, Users } from 'lucide-react';
import AsOf, { formatAsOf } from '@/components/AsOf';
import Avatar from '@/components/Avatar';
import { Ext } from '@/components/Ext';
import { SourceCards, StatTile } from '@/components/Visual';
import {
  LISTS,
  LIST_KEYS,
  MATCH_METHODS,
  NATIONAL,
  NATIONAL_KEYS,
  RESOLUTIONS,
  SANCTIONS,
  SANCTIONS_PATHS,
  SANCTIONS_TEXT,
  SANCTION_SOURCES,
  type ListKey,
  type Target,
  type UnEntry,
} from '@/content/sanctions';
import { ENTITY_ORGS, PEOPLE, currentRole } from '@/entities';
import { REVIEWED } from '@/site/config';
import { LANG_TAG, absolute, jsonLd, type Lang } from '@/site/seo';

const LOCALE: Record<Lang, string> = { en: 'en-GB', ko: 'ko-KR', ja: 'ja-JP', zh: 'zh-CN' };

// Which list entries belong to someone we have a profile for ("UN KPi.043" → jo-yong-won).
const profileOf = new Map<string, string>();
for (const p of PEOPLE) for (const s of p.sanctions) if (s.id) profileOf.set(`${s.list} ${s.id}`, p.id);

type Text = (typeof SANCTIONS_TEXT)[Lang];
const OTHER_LISTS = LIST_KEYS.filter((k) => k !== 'UN');
const unTargetOf = new Map(SANCTIONS.targets.flatMap((x) => (x.un ? [[x.un, x] as const] : [])));
const ofacLink = (id: string) => `https://sanctionssearch.ofac.treas.gov/Details.aspx?id=${id}`;

/** One small tag per list that names a target; a dashed "?" tag for a same-name entry nobody could confirm. */
function ListTags({ target, lang, t, skipUn }: { target: Target; lang: Lang; t: Text; skipUn?: boolean }) {
  const keys = skipUn ? OTHER_LISTS : LIST_KEYS;
  return (
    <span className="ltags">
      {keys.map((k) => {
        const ids = target.on[k];
        const label = LISTS[k].short[lang];
        if (ids) {
          const how = target.how[k];
          const title = `${LISTS[k].short.en} ${ids.join(', ')}${how ? ` · ${t.methodShort[how]}` : ''}`;
          return k === 'US' ? (
            <Ext key={k} href={ofacLink(ids[0])} className="ltag" title={title}>
              {label}
            </Ext>
          ) : (
            <span key={k} className="ltag" title={title}>
              {label}
            </span>
          );
        }
        return target.maybe?.includes(k) ? (
          <span key={k} className="ltag maybe" title={t.maybeMark}>
            {label}?
          </span>
        ) : null;
      })}
    </span>
  );
}

function UnTable({ rows, people, t, lang }: { rows: UnEntry[]; people: boolean; t: Text; lang: Lang }) {
  return (
    <div className="table-wrap">
      <table className="sanc-table">
        <thead>
          <tr>
            <th>{t.col.name}</th>
            <th>{t.col.listed}</th>
            <th>{people ? `${t.col.role} / ${t.col.why}` : t.col.why}</th>
            <th>{t.col.ref}</th>
            <th>{t.alsoOn}</th>
          </tr>
        </thead>
        <tbody lang="en">
          {rows.map((e) => {
            const pid = profileOf.get(`UN ${e.ref}`);
            const target = unTargetOf.get(e.ref);
            return (
              <tr key={e.ref} id={e.ref}>
                <td>
                  {pid ? <Link href={`/people/${pid}`}>{e.name}</Link> : <b>{e.name}</b>}
                  {e.aliases.length > 0 && <small>{e.aliases.slice(0, 3).join(', ')}</small>}
                </td>
                <td className="nowrap">{formatAsOf(e.listed, LOCALE[lang])}</td>
                <td>{e.note ?? e.role ?? '—'}</td>
                <td className="nowrap muted">{e.ref}</td>
                <td>{target && <ListTags target={target} lang={lang} t={t} skipUn />}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** The sanctions page, shared by /sanctions, /ko/sanctions, /ja/sanctions and /zh/sanctions. Only the text changes per language. */
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

  // ----- the five lists side by side -----
  const count = <T extends { kind: string }>(rows: T[], ...kinds: string[]) => rows.filter((e) => kinds.includes(e.kind)).length;
  const listRows: { key: ListKey; people: number; entities: number; ships: number | null; dated: string | null; fetched: string }[] = [
    { key: 'UN', people: un.individuals.length, entities: un.entities.length, ships: null, dated: un.generated, fetched },
    { key: 'US', people: count(ofac, 'individual'), entities: count(ofac, 'entity'), ships: count(ofac, 'vessel', 'aircraft'), dated: null, fetched },
    ...NATIONAL_KEYS.map((key) => {
      const l = NATIONAL[key];
      return { key, people: count(l.entries, 'individual'), entities: count(l.entries, 'entity'), ships: count(l.entries, 'vessel'), dated: l.published, fetched: l.fetched };
    }),
  ];

  // ----- who is on which list -----
  const { targets } = SANCTIONS;
  const unTargets = targets.filter((x) => x.un);
  const cover = OTHER_LISTS.map((k) => ({
    k,
    yes: unTargets.filter((x) => x.on[k]).length,
    maybe: unTargets.filter((x) => !x.on[k] && x.maybe?.includes(k)).length,
  }));
  const onAll = targets.filter((x) => LIST_KEYS.every((k) => x.on[k])).length;
  const beyond = targets
    .filter((x) => !x.un)
    .sort((a, b) => Object.keys(b.on).length - Object.keys(a.on).length || a.name.localeCompare(b.name));
  const isSolo = (x: Target) => Object.keys(x.on).length === 1 && !x.maybe;
  const multi = beyond.filter((x) => Object.keys(x.on).length > 1).length;
  const solo = beyond.filter(isSolo);
  const unsure = beyond.filter((x) => Object.keys(x.on).length === 1 && x.maybe).length;
  const methodCount = MATCH_METHODS.map((m) => ({ m, n: targets.reduce((s, x) => s + Object.values(x.how).filter((h) => h === m).length, 0) })).filter((x) => x.n);
  const filters: { id: string; label: string; n: number }[] = [
    { id: 'all', label: t.filters.all, n: beyond.length },
    ...OTHER_LISTS.map((k) => ({ id: k, label: LISTS[k].short[lang], n: beyond.filter((x) => x.on[k]).length })),
    { id: 'multi', label: t.filters.multi, n: multi },
    { id: 'solo', label: t.filters.solo, n: solo.length },
  ];

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: t.metaTitle,
    description: t.metaDescription,
    inLanguage: LANG_TAG[lang],
    url: absolute(SANCTIONS_PATHS[lang]),
    dateModified: fetched,
    isBasedOn: LIST_KEYS.map((k) => LISTS[k].page),
    creator: LIST_KEYS.map((k) => ({ '@type': 'Organization', name: LISTS[k].creator, url: LISTS[k].page })),
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
        <h2>{t.listsTitle}</h2>
        <p className="muted">{t.listsHint}</p>
        <div className="table-wrap">
          <table className="sanc-table sanc-lists">
            <thead>
              <tr>
                <th>{t.listsCol.list}</th>
                <th>{t.listsCol.people}</th>
                <th>{t.listsCol.entities}</th>
                <th>{t.listsCol.ships}</th>
                <th>{t.listsCol.total}</th>
                <th>{t.listsCol.dated}</th>
                <th>{t.listsCol.fetched}</th>
              </tr>
            </thead>
            <tbody>
              {listRows.map((r) => (
                <tr key={r.key}>
                  <td>
                    <b>{LISTS[r.key].name[lang]}</b>
                    <small>
                      <Ext href={LISTS[r.key].page}>{LISTS[r.key].publisher[lang]}</Ext>
                    </small>
                  </td>
                  <td className="num">{r.people}</td>
                  <td className="num">{r.entities}</td>
                  <td className="num">{r.ships ?? '—'}</td>
                  <td className="num">
                    <b>{r.people + r.entities + (r.ships ?? 0)}</b>
                  </td>
                  <td className="nowrap">{r.dated ? formatAsOf(r.dated, LOCALE[lang]) : '—'}</td>
                  <td className="nowrap">
                    {formatAsOf(r.fetched, LOCALE[lang])}
                    {r.fetched < fetched && <small className="warn-text">{t.kept}</small>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="sanc-notes">
          {(['US', 'UK', 'EU', 'JP'] as const).map((k) => (
            <li key={k}>
              <b>{LISTS[k].short[lang]}</b> {t.listNotes[k]}
            </li>
          ))}
        </ul>
      </section>

      <section className="index-section">
        <h2>{t.overlapTitle}</h2>
        <p className="muted">{t.overlapHint}</p>
        <div className="panel">
          <h3 className="sanc-cover-title">{t.coverTitle(unTargets.length)}</h3>
          <ul className="sanc-cover">
            {cover.map((c) => (
              <li key={c.k}>
                <span className="sanc-cover-name">{LISTS[c.k].name[lang]}</span>
                <span className="sanc-cover-bar" role="img" aria-label={`${c.yes} / ${unTargets.length}`}>
                  <i className="sanc-cover-yes" style={{ width: `${(c.yes / unTargets.length) * 100}%` }} />
                  <i className="sanc-cover-maybe" style={{ width: `${(c.maybe / unTargets.length) * 100}%` }} />
                </span>
                <span className="sanc-cover-num">
                  <b>{c.yes}</b> {t.confirmed}
                  {c.maybe > 0 && (
                    <small>
                      +{c.maybe} {t.sameName}
                    </small>
                  )}
                </span>
              </li>
            ))}
          </ul>
          <p className="key left">
            <span>
              <i className="sanc-cover-yes" /> {t.confirmed}
            </span>
            <span>
              <i className="sanc-cover-maybe" /> {t.sameName}
            </span>
          </p>
        </div>
        <div className="callout">
          <p>
            <b>{t.allFive(onAll)}</b>
          </p>
        </div>

        <h3>{t.beyondTitle}</h3>
        <div className="tiles">
          <StatTile icon={Users} value={beyond.length} label={t.beyondTiles.total} />
          <StatTile icon={Landmark} value={multi} label={t.beyondTiles.multi} />
          <StatTile icon={Flag} value={solo.length} label={t.beyondTiles.solo} tone="warn" />
          <StatTile icon={CircleQuestionMark} value={unsure} label={t.beyondTiles.maybe} />
        </div>
        <h3>{t.soloTitle}</h3>
        <p className="muted">{t.soloHint}</p>
        <ul className="ichips">
          {OTHER_LISTS.map((k) => (
            <li key={k}>
              <Flag size={15} aria-hidden="true" />
              {LISTS[k].name[lang]} <b>{solo.filter((x) => x.on[k]).length}</b>
            </li>
          ))}
        </ul>

        <h3>{t.methodsTitle}</h3>
        <p className="muted">{t.methodsHint}</p>
        <ul className="sanc-methods">
          {methodCount.map(({ m, n }) => (
            <li key={m}>
              <b>{n}</b> {t.methods[m]}
            </li>
          ))}
        </ul>
        <p className="muted small">{t.caveat}</p>
      </section>

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

      <section className="index-section xf" id="beyond-un">
        <h2>
          {t.tableTitle} <small>{beyond.length}</small>
        </h2>
        <p className="muted">{t.tableHint}</p>
        {/* Filters are plain radio buttons; CSS (:has) hides the rows, so the whole table stays in the HTML. */}
        <div className="xf-chips" role="radiogroup" aria-label={t.tcol.lists}>
          {filters.map((f, i) => (
            <span key={f.id}>
              <input type="radio" name="xf" id={`xf-${f.id}`} defaultChecked={i === 0} />
              <label htmlFor={`xf-${f.id}`}>
                {f.label} <small>{f.n}</small>
              </label>
            </span>
          ))}
        </div>
        <div className="table-wrap">
          <table className="sanc-table xf-table">
            <thead>
              <tr>
                <th>{t.tcol.name}</th>
                <th>{t.tcol.lists}</th>
                <th>{t.tcol.how}</th>
              </tr>
            </thead>
            <tbody lang="en">
              {beyond.map((x) => {
                const how = [...new Set(Object.values(x.how))];
                const cls = [...Object.keys(x.on).map((k) => `on-${k}`), Object.keys(x.on).length > 1 ? 'multi' : '', isSolo(x) ? 'solo' : ''].filter(Boolean).join(' ');
                return (
                  <tr key={Object.entries(x.on).map(([k, ids]) => `${k}${ids.join()}`).join()} className={cls}>
                    <td>
                      {x.name}
                      {(() => {
                        const pid = (x.on.US ?? []).map((id) => profileOf.get(`OFAC ${id}`)).find(Boolean);
                        return (
                          pid && (
                            <Link href={`/people/${pid}`} className="sanc-profile">
                              profile
                            </Link>
                          )
                        );
                      })()}
                    </td>
                    <td>
                      <ListTags target={x} lang={lang} t={t} />
                    </td>
                    <td className="muted small" lang={lang}>
                      {how.length ? how.map((h) => t.methodShort[h]).join(', ') : x.maybe ? t.sameName : ''}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <h2>{t.sources}</h2>
      <SourceCards sources={SANCTION_SOURCES} />
    </div>
  );
}
