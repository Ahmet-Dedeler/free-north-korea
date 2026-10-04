import Link from 'next/link';
import { notFound } from 'next/navigation';
import Avatar from '@/components/Avatar';
import PersonLink from '@/components/PersonLink';
import { Ext } from '@/components/Ext';
import { PEOPLE, RELATION_ORDER, age, currentRole, entityOrg, familyOf, isDead, person } from '@/entities';
import { familyTreeIds } from '@/entities/familyTree';
import type { Claim, NumberClaim } from '@/entities/types';
import { absolute, jsonLd, pageMeta } from '@/site/seo';

type Params = { params: Promise<{ id: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => PEOPLE.map((p) => ({ id: p.id }));

export async function generateMetadata({ params }: Params) {
  const p = person((await params).id);
  if (!p) return {};
  const role = currentRole(p);
  return pageMeta({
    title: `${p.name_en}${role ? `: ${role.title}` : ''}`,
    description: p.summary.slice(0, 160),
    path: `/people/${p.id}`,
    image: `/people/${p.id}/opengraph-image`,
  });
}

const CONF_LABEL = { confirmed: 'Confirmed', reported: 'Reported', rumor: 'Rumor' } as const;

function Conf({ c }: { c?: Claim['confidence'] }) {
  return c ? <span className={`conf conf-${c}`}>{CONF_LABEL[c]}</span> : null;
}

function Num({ v, unit }: { v?: NumberClaim | null; unit: string }) {
  if (!v) return <span className="muted">Unknown</span>;
  return (
    <>
      ~{v.value} {unit} <Conf c={v.confidence} />
      {v.source_url && (
        <Ext className="src" href={v.source_url}>
          {v.source_name ?? 'source'}
          {v.date ? `, ${v.date.slice(0, 7)}` : ''}
        </Ext>
      )}
    </>
  );
}

const year = (d?: string | null) => (d ? d.slice(0, 4) : '?');

export default async function PersonPage({ params }: Params) {
  const p = person((await params).id);
  if (!p) notFound();
  const role = currentRole(p);
  const a = age(p);
  const dead = isDead(p);
  const family = familyOf(p).sort((x, y) => RELATION_ORDER.indexOf(x.relation) - RELATION_ORDER.indexOf(y.relation));
  const roles = p.roles.slice().sort((x, y) => (y.start ?? '').localeCompare(x.start ?? ''));
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: p.name_en,
    alternateName: [p.name_ko, ...(p.aliases ?? [])].filter(Boolean),
    birthDate: p.born?.date ?? undefined,
    deathDate: p.died?.date ?? undefined,
    jobTitle: role?.title,
    description: p.summary,
    url: absolute(`/people/${p.id}`),
    sameAs: p.wikidata ? [`https://www.wikidata.org/wiki/${p.wikidata}`] : undefined,
  };

  return (
    <article className="dossier">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />
      <p className="eyebrow">
        <Link href="/people">People</Link> · {p.tags.join(' · ')}
      </p>

      <header className="dossier-head">
        <Avatar person={p} size={132} />
        <div>
          <h1>
            {p.name_en} {p.name_ko && <span className="ko">{p.name_ko}</span>}
          </h1>
          {role && <p className="dossier-role">{role.title}</p>}
          <p className="dossier-badges">
            <span className={`badge ${dead ? 'badge-dead' : 'badge-alive'}`}>{p.status?.value ?? (dead ? 'Dead' : 'Alive')}</span>
            {a !== null && <span className="badge">{dead ? `Died aged ${a}` : `${a} years old`}</span>}
            {p.sanctions.map((s) => (
              <span key={s.list + (s.id ?? '')} className="badge badge-sanction" title={s.id ?? undefined}>
                Sanctioned: {s.list}
              </span>
            ))}
          </p>
          <p className="dossier-summary">
            {p.summary}{' '}
            {p.summary_source === 'wikipedia' && p.wikipedia && (
              <Ext className="src" href={p.wikipedia}>
                Wikipedia
              </Ext>
            )}
          </p>
        </div>
      </header>

      <section className="facts">
        <div>
          <dt>Born</dt>
          <dd>
            {p.born?.date ?? 'Unknown'}
            {p.born?.place ? `, ${p.born.place}` : ''}
          </dd>
        </div>
        {p.died && (
          <div>
            <dt>Died</dt>
            <dd>
              {p.died.date ?? 'Unknown'}
              {p.died.place ? `, ${p.died.place}` : ''}
              {p.died.cause ? ` (${p.died.cause})` : ''}
            </dd>
          </div>
        )}
        <div>
          <dt>Height</dt>
          <dd>
            <Num v={p.physical?.height_cm} unit="cm" />
          </dd>
        </div>
        <div>
          <dt>Weight</dt>
          <dd>
            <Num v={p.physical?.weight_kg} unit="kg" />
          </dd>
        </div>
        {p.rank && (
          <div>
            <dt>Military rank</dt>
            <dd>{p.rank}</dd>
          </div>
        )}
        {p.status?.as_of && (
          <div>
            <dt>Status as of</dt>
            <dd>
              {p.status.as_of}
              {p.status.source_url && (
                <Ext className="src" href={p.status.source_url}>
                  source
                </Ext>
              )}
            </dd>
          </div>
        )}
        {p.aliases && p.aliases.length > 0 && (
          <div>
            <dt>Also known as</dt>
            <dd>{p.aliases.join(', ')}</dd>
          </div>
        )}
      </section>

      {family.length > 0 && (
        <section>
          <h2>
            Family{' '}
            {familyTreeIds().has(p.id) && (
              <small>
                <Link href={`/kim-family-tree#${p.id}`}>See in the family tree</Link>
              </small>
            )}
          </h2>
          <ul className="family">
            {family.map((f) => (
              <li key={f.person.id}>
                <Avatar person={f.person} size={44} />
                <span>
                  <small>{f.relation.replace('-', ' ')}</small>
                  <PersonLink id={f.person.id} />
                  {f.note && <small className="muted">{f.note}</small>}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {roles.length > 0 && (
        <section>
          <h2>Positions</h2>
          <ol className="timeline-list">
            {roles.map((r, i) => {
              const org = r.org_id ? entityOrg(r.org_id) : null;
              return (
                <li key={i} className={r.end ? '' : 'current'}>
                  <span className="when">
                    {year(r.start)}–{r.end ? year(r.end) : 'now'}
                  </span>
                  <span>
                    {r.title}
                    {org && <small className="muted"> · {org.name_en}</small>}
                    {r.source_url && (
                      <Ext className="src" href={r.source_url}>
                        source
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
          <h2>Health</h2>
          <ul className="claims">
            {p.health.map((h, i) => (
              <li key={i}>
                <Conf c={h.confidence} /> {h.claim}
                {h.source_url && (
                  <Ext className="src" href={h.source_url}>
                    {h.source_name ?? 'source'}
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
          <h2>Notable</h2>
          <ul className="claims">
            {p.notable.map((n, i) => (
              <li key={i}>
                {n.date && <span className="when">{n.date.slice(0, 7)}</span>} {n.claim}
                {n.source_url && (
                  <Ext className="src" href={n.source_url}>
                    source
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
            Sanctions{' '}
            <small>
              <Link href="/sanctions">everyone sanctioned →</Link>
            </small>
          </h2>
          <ul className="claims">
            {p.sanctions.map((s, i) => (
              <li key={i}>
                <b>{s.list}</b>
                {s.id ? ` · ${s.id}` : ''}
                {s.date ? ` · since ${s.date}` : ''}
                {s.source_url && (
                  <Ext className="src" href={s.source_url}>
                    listing
                  </Ext>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="muted machine">
        Machine-readable: <a href={`/api/people/${p.id}`}>/api/people/{p.id}</a>
        {p.wikidata && (
          <>
            {' · '}
            <Ext href={`https://www.wikidata.org/wiki/${p.wikidata}`}>Wikidata {p.wikidata}</Ext>
          </>
        )}
        {p.image && (
          <>
            {' · '}Photo: <Ext href={p.image.sourceUrl}>{p.image.credit}</Ext>
            {p.image.license ? ` (${p.image.license})` : ''}
          </>
        )}
      </p>
    </article>
  );
}
