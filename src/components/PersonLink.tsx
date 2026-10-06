import Link from 'next/link';
import { age, currentRole, isDead, person } from '@/entities';
import { PEOPLE_TEXT, personLanguages, roleTitle } from '@/content/peopleI18n';
import type { Lang } from '@/site/seo';
import Avatar from './Avatar';

/**
 * A person's name that links to their profile and shows a small card on hover/focus.
 * Pure CSS (no JS), so it works in prerendered HTML and for keyboard users.
 * `lang` defaults to English so existing callers keep the English profile.
 */
export default function PersonLink({ id, lang = 'en', children }: { id: string; lang?: Lang; children?: React.ReactNode }) {
  const p = person(id);
  if (!p) return <>{children ?? id}</>;
  const role = currentRole(p);
  const a = age(p);
  const t = PEOPLE_TEXT[lang];
  const born = p.born?.date ? `${t.born} ${p.born.date.slice(0, 4)}` : lang === 'en' ? 'Birth year unknown' : `${t.born}: ${t.unknown}`;
  return (
    <span className="plink">
      <Link href={personLanguages(p.id)[lang]}>{children ?? p.name_en}</Link>
      <span className="plink-card" role="tooltip">
        <Avatar person={p} size={56} />
        <span className="plink-body">
          <b lang={lang === 'en' ? undefined : 'en'}>{p.name_en}</b>
          {p.name_ko && <span className="ko" lang="ko">{p.name_ko}</span>}
          {role && <span>{roleTitle(role.title, lang)}</span>}
          <span className="muted">
            {born}
            {a !== null ? ` · ${isDead(p) ? t.diedAged(a) : t.yearsOld(a)}` : ''}
          </span>
        </span>
      </span>
    </span>
  );
}
