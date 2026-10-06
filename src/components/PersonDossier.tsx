import Link from 'next/link';
import { notFound } from 'next/navigation';
import Avatar from '@/components/Avatar';
import { Ext } from '@/components/Ext';
import PersonLink from '@/components/PersonLink';
import {
  PEOPLE_PATHS,
  PEOPLE_TEXT,
  causeText,
  claimText,
  familyNote,
  familyTreePath,
  personLanguages,
  placeName,
  rankText,
  roleTitle,
  statusLabel,
  summaryOf,
  tagLabel,
} from '@/content/peopleI18n';
import { SANCTIONS_PATHS } from '@/content/sanctions';
import { RELATION_ORDER, age, currentRole, entityOrg, familyOf, isDead, person } from '@/entities';
import { familyTreeIds } from '@/entities/familyTree';
import type { Claim, NumberClaim } from '@/entities/types';
import { LANG_TAG, absolute, jsonLd, type Lang } from '@/site/seo';

function En({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return lang === 'en' ? <>{children}</> : <span lang="en">{children}</span>;
}

function Conf({ c, lang }: { c?: Claim['confidence']; lang: Lang }) {
  return c ? <span className={`conf conf-${c}`}>{PEOPLE_TEXT[lang].conf[c]}</span> : null;
}

function Num({ v, unit, lang }: { v?: NumberClaim | null; unit: string; lang: Lang }) {
  const t = PEOPLE_TEXT[lang];
  if (!v) return <span className="muted">{t.unknown}</span>;
  return (
    <>
      ~{v.value} {unit} <Conf c={v.confidence} lang={lang} />
      {v.source_url && (
        <Ext className="src" href={v.source_url}>
          {v.source_name ? <En lang={lang}>{v.source_name}</En> : t.source}
          {v.date ? `, ${v.date.slice(0, 7)}` : ''}
        </Ext>
      )}
    </>
  );
}

const year = (d?: string | null) => (d ? d.slice(0, 4) : '?');

/** One person's profile, shared by /people/[id] and the /ko, /ja and /zh copies. */
export default function PersonDossier({ lang, id }: { lang: Lang; id: string }) {
  const p = person(id);
  if (!p) notFound();
  const t = PEOPLE_TEXT[lang];
  const role = currentRole(p);
  const a = age(p);
  const dead = isDead(p);
  const family = familyOf(p).sort((x, y) => RELATION_ORDER.indexOf(x.relation) - RELATION_ORDER.indexOf(y.relation));
  const roles = p.roles.slice().sort((x, y) => (y.start ?? '').localeCompare(x.start ?? ''));
  const summary = summaryOf(p.id, lang, p.summary);
  const paths = personLanguages(p.id);
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: p.name_en,
    alternateName: [p.name_ko, ...(p.aliases ?? [])].filter(Boolean),
    birthDate: p.born?.date ?? undefined,
    deathDate: p.died?.date ?? undefined,
    jobTitle: role ? roleTitle(role.title, lang) : undefined,
    description: summary,
    inLanguage: LANG_TAG[lang],
    url: absolute(paths[lang]),
    sameAs: p.wikidata ? [`https://www.wikidata.org/wiki/${p.wikidata}`] : undefined,
  };

  return (
    <article className="dossier">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />
      <p className="eyebrow">
        <Link href={PEOPLE_PATHS[lang]}>{t.eyebrow}</Link>
        {' · '}
        {p.tags.map((tag) => tagLabel(tag, lang)).join(' · ')}
      </p>

      <header className="dossier-head">
        <Avatar person={p} size={132} />
        <div>
          <h1>
            <span lang={lang === 'en' ? undefined : 'en'}>{p.name_en}</span> {p.name_ko && <span className="ko" lang="ko">{p.name_ko}</span>}
          </h1>
          {role && <p className="dossier-role">{roleTitle(role.title, lang)}</p>}
          <p className="dossier-badges">
            <span className={`badge ${dead ? 'badge-dead' : 'badge-alive'}`}>
              {p.status?.value ? statusLabel(p.status.value, lang) : dead ? t.statusDead : t.statusAlive}
            </span>
            {a !== null && <span className="badge">{dead ? t.diedAged(a) : t.yearsOld(a)}</span>}
            {p.sanctions.map((s) => (
              <span key={s.list + (s.id ?? '')} className="badge badge-sanction" title={s.id ?? undefined}>
                {t.sanctionedBadge(s.list)}
              </span>
            ))}
          </p>
          <p className="dossier-summary">
            {summary}{' '}
            {p.summary_source === 'wikipedia' && p.wikipedia && (
              <Ext className="src" href={p.wikipedia}>
                {t.wikipedia}
              </Ext>
            )}
          </p>
        </div>
      </header>

      <section className="facts">
        <div>
          <dt>{t.born}</dt>
          <dd>
            {p.born?.date ?? t.unknown}
            {p.born?.place ? <>, {placeName(p.born.place, lang)}</> : ''}
          </dd>
        </div>
        {p.died && (
          <div>
            <dt>{t.died}</dt>
            <dd>
              {p.died.date ?? t.unknown}
              {p.died.place ? <>, {placeName(p.died.place, lang)}</> : ''}
              {p.died.cause ? ` (${causeText(p.died.cause, lang)})` : ''}
            </dd>
          </div>
        )}
        <div>
          <dt>{t.height}</dt>
          <dd>
            <Num v={p.physical?.height_cm} unit={t.cm} lang={lang} />
          </dd>
        </div>
        <div>
          <dt>{t.weight}</dt>
          <dd>
            <Num v={p.physical?.weight_kg} unit={t.kg} lang={lang} />
          </dd>
        </div>
        {p.rank && (
          <div>
            <dt>{t.rank}</dt>
            <dd>{rankText(p.rank, lang)}</dd>
          </div>
        )}
        {p.status?.as_of && (
          <div>
            <dt>{t.statusAsOf}</dt>
            <dd>
              {p.status.as_of}
              {p.status.source_url && (
                <Ext className="src" href={p.status.source_url}>
                  {t.source}
                </Ext>
              )}
            </dd>
          </div>
        )}
        {p.aliases && p.aliases.length > 0 && (
          <div>
            <dt>{t.aka}</dt>
            <dd>
              <En lang={lang}>{p.aliases.join(', ')}</En>
            </dd>
          </div>
        )}
      </section>

      {family.length > 0 && (
        <section>
          <h2>
            {t.family}{' '}
            {familyTreeIds().has(p.id) && (
              <small>
                <Link href={familyTreePath(lang, p.id)}>{t.seeTree}</Link>
              </small>
            )}
          </h2>
          <ul className="family">
            {family.map((f) => (
              <li key={f.person.id}>
                <Avatar person={f.person} size={44} />
                <span>
                  <small>{t.relation[f.relation]}</small>
                  <PersonLink id={f.person.id} lang={lang} />
                  {f.note && <small className="muted">{familyNote(f.note, lang)}</small>}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {roles.length > 0 && (
        <section>
          <h2>{t.positions}</h2>
          <ol className="timeline-list">
            {roles.map((r, i) => {
              const org = r.org_id ? entityOrg(r.org_id) : null;
              return (
                <li key={i} className={r.end ? '' : 'current'}>
                  <span className="when">
                    {year(r.start)}–{r.end ? year(r.end) : t.now}
                  </span>
                  <span>
                    {roleTitle(r.title, lang)}
                    {org && (
                      <small className="muted">
                        {' · '}
                        <En lang={lang}>{org.name_en}</En>
                      </small>
                    )}
                    {r.source_url && (
                      <Ext className="src" href={r.source_url}>
                        {t.source}
                      </Ext>
                    )}
                  </span>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {p.health.length > 0 && (
        <section>
          <h2>{t.health}</h2>
          <ul className="claims">
            {p.health.map((h, i) => (
              <li key={i}>
                <Conf c={h.confidence} lang={lang} /> {claimText(h.claim, lang)}
                {h.source_url && (
                  <Ext className="src" href={h.source_url}>
                    {h.source_name ? <En lang={lang}>{h.source_name}</En> : t.source}
                    {h.date ? `, ${h.date.slice(0, 7)}` : ''}
                  </Ext>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {p.notable.length > 0 && (
        <section>
          <h2>{t.notable}</h2>
          <ul className="claims">
            {p.notable.map((n, i) => (
              <li key={i}>
                {n.date && <span className="when">{n.date.slice(0, 7)}</span>} {claimText(n.claim, lang)}
                {n.source_url && (
                  <Ext className="src" href={n.source_url}>
                    {t.source}
                  </Ext>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {p.sanctions.length > 0 && (
        <section>
          <h2>
            {t.sanctions}{' '}
            <small>
              <Link href={SANCTIONS_PATHS[lang]}>{t.allSanctioned}</Link>
            </small>
          </h2>
          <ul className="claims">
            {p.sanctions.map((s, i) => (
              <li key={i}>
                <b>{s.list}</b>
                {s.id ? ` · ${s.id}` : ''}
                {s.date ? ` · ${t.since(s.date)}` : ''}
                {s.source_url && (
                  <Ext className="src" href={s.source_url}>
                    {t.listing}
                  </Ext>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="muted machine">
        {t.machine} <a href={`/api/people/${p.id}`}>/api/people/{p.id}</a>
        {p.wikidata && (
          <>
            {' · '}
            <Ext href={`https://www.wikidata.org/wiki/${p.wikidata}`}>Wikidata {p.wikidata}</Ext>
          </>
        )}
        {p.image && (
          <>
            {' · '}
            {t.photo}{' '}
            <Ext href={p.image.sourceUrl}>
              <En lang={lang}>{p.image.credit}</En>
            </Ext>
            {p.image.license ? <En lang={lang}>{` (${p.image.license})`}</En> : null}
          </>
        )}
      </p>
    </article>
  );
}
