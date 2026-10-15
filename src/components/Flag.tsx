import { CN, JP, KR, US } from 'country-flag-icons/react/3x2';
import type { Lang } from '@/site/seo';

/**
 * The flag shown next to each language name in the switchers (header menu, footer, article "read in", hub pages).
 * It marks the language, not a country claim: English uses the US flag, Chinese is Simplified (mainland) Chinese.
 * SVGs from country-flag-icons (MIT), so they look the same on every OS (Windows has no emoji flags).
 */
const FLAGS = { en: US, ko: KR, ja: JP, zh: CN } satisfies Record<Lang, unknown>;

export default function Flag({ lang }: { lang: Lang }) {
  const F = FLAGS[lang];
  return <F className="flag" aria-hidden />;
}
