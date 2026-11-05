import type { Metadata } from 'next';
import { personLanguages, roleTitle, summaryOf } from '@/content/peopleI18n';
import { currentRole, person } from '@/entities';
import type { Person } from '@/entities/types';
import { clip, pageMeta, type Lang } from '@/site/seo';

/** What a person with no listed role is called in the title. Every title was just the name before, in all four languages. */
const NO_ROLE: Record<Lang, { family: string; other: string }> = {
  en: { family: 'Kim family', other: 'North Korea profile' },
  ko: { family: '김씨 일가', other: '북한 인물' },
  ja: { family: '金一族', other: '北朝鮮の人物' },
  zh: { family: '金氏家族', other: '朝鲜人物' },
};

/**
 * The name as readers of that language write it, for the title: people search 리설주 or 金与正, not "Ri Sol Ju".
 * Korean comes from the data. Japanese and Chinese names open the translated summary ("金与正是..."), so they are read
 * from there and can't drift from the page. Anything that doesn't look like a clean name falls back to the English.
 */
function localName(p: Person, lang: Lang): string | null {
  if (lang === 'ko') return p.name_ko ?? null;
  if (lang === 'en') return null;
  const summary = summaryOf(p.id, lang, '');
  const m = lang === 'ja' ? summary.match(/^([^、。はの（(]{2,8})は/) : summary.match(/^([^，。（(是曾为]{2,6})(?:是|曾|为)/);
  const name = m?.[1].replace(/将[軍军]$/, '').replace(/^次帅/, '');
  return name && !/[\uac00-\ud7a3]/.test(name) ? name : null;
}

/** Title and description for /people/<id> in any language. */
export function personMetadata(id: string, lang: Lang): Metadata {
  const p = person(id);
  if (!p) return {};
  const role = currentRole(p);
  const path = personLanguages(p.id)[lang];
  const local = localName(p, lang);
  const name = local ? `${local} (${p.name_en})` : p.name_en;
  const what = role ? roleTitle(role.title, lang) : NO_ROLE[lang][p.tags.includes('family') ? 'family' : 'other'];
  return pageMeta({
    title: `${name}: ${what}`,
    description: clip(summaryOf(p.id, lang, p.summary)),
    path,
    lang,
    languages: personLanguages(p.id),
    image: `${path}/opengraph-image`,
  });
}
