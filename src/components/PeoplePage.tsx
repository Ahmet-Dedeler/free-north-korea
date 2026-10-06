import Link from 'next/link';
import Avatar from '@/components/Avatar';
import { PEOPLE_PATHS, PEOPLE_TEXT, familyTreePath, roleTitle, statusLabel } from '@/content/peopleI18n';
import { SANCTIONS_PATHS } from '@/content/sanctions';
import { PEOPLE, age, currentRole, isDead, person } from '@/entities';
import type { Person } from '@/entities/types';
import type { Lang } from '@/site/seo';

function Card({ p, lang }: { p: Person; lang: Lang }) {
  const t = PEOPLE_TEXT[lang];
  const a = age(p);
  const dead = isDead(p);
  const role = currentRole(p);
  const flag = p.status?.value === 'executed' || p.status?.value === 'purged' ? p.status.value : null;
  return (
    <Link href={`${PEOPLE_PATHS[lang]}/${p.id}`} className={`pcard ${dead ? 'is-dead' : ''}`}>
      <Avatar person={p} size={64} />
      <b lang={lang === 'en' ? undefined : 'en'}>{p.name_en}</b>
      <span className="pcard-years">
        {p.born?.date?.slice(0, 4) ?? '?'}
        {dead ? `–${p.died?.date?.slice(0, 4) ?? '?'}` : a !== null ? ` · ${a}` : ''}
      </span>
      {role && <span className="pcard-role">{roleTitle(role.title, lang)}</span>}
      {flag && <span className="pcard-flag">{statusLabel(flag, lang)}</span>}
      {p.sanctions.length > 0 && <span className="pcard-flag sanction">{t.sanctioned}</span>}
    </Link>
  );
}

/** The people index, shared by /people, /ko/people, /ja/people and /zh/people. */
export default function PeoplePage({ lang }: { lang: Lang }) {
  const t = PEOPLE_TEXT[lang];
  return (
    <div className="wide">
      <p className="eyebrow">{t.eyebrow}</p>
      <h1>{t.h1}</h1>
      <p className="lede">
        {t.lede(PEOPLE.length)}{' '}
        <a href="/api/people">{t.jsonCta}</a>
        {t.afterJson} <Link href={SANCTIONS_PATHS[lang]}>{t.sanctionsLink}</Link>{t.afterSanctions}
      </p>

      <section className="tree">
        <Link href={familyTreePath(lang)} className="ftree-promo">
          <span className="ftree-promo-faces">
            {['kim-jong-un', 'kim-ju-ae', 'kim-yo-jong', 'ri-sol-ju'].map((id) => {
              const p = person(id);
              return p ? <Avatar key={id} person={p} size={44} /> : null;
            })}
          </span>
          <span>
            <b>{t.treeTitle}</b>
            <small className="muted">{t.treeHint}</small>
          </span>
        </Link>
      </section>

      {t.groups.map((g) => {
        const list = PEOPLE.filter((p) => p.tags.includes(g.tag) && !p.tags.includes('family'));
        if (!list.length) return null;
        return (
          <section key={g.tag} className="pgroup">
            <h2>
              {g.title} <small>{g.hint}</small>
            </h2>
            <div className="pgrid">
              {list.map((p) => (
                <Card key={p.id} p={p} lang={lang} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
