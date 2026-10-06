import { PEOPLE_TEXT, roleTitle, summaryOf } from '@/content/peopleI18n';
import { currentRole, person } from '@/entities';
import type { Lang } from '@/site/seo';

/** Share-card text for one profile. The name stays in English, with the Korean name beside it when we have one. */
export function personOgText(lang: Lang, id: string) {
  const t = PEOPLE_TEXT[lang];
  const p = person(id);
  if (!p) return { kicker: t.ogKicker, title: t.ogFallback };
  const role = currentRole(p);
  return {
    kicker: t.ogKicker,
    title: p.name_ko ? `${p.name_en} ${p.name_ko}` : p.name_en,
    sub: role ? roleTitle(role.title, lang) : summaryOf(p.id, lang, p.summary),
  };
}
