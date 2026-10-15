import Link from 'next/link';
import Flag from './Flag';
import type { Lang } from '@/site/seo';

const HUBS: { lang: Lang; href: string; name: string; tag: string }[] = [
  { lang: 'en', href: '/', name: 'English', tag: 'en' },
  { lang: 'ko', href: '/ko', name: '한국어', tag: 'ko' },
  { lang: 'ja', href: '/ja', name: '日本語', tag: 'ja' },
  { lang: 'zh', href: '/zh', name: '中文', tag: 'zh-Hans' },
];

/** The four home pages as flag chips, the current one marked (top of the /ko, /ja and /zh hubs). */
export default function HubLangs({ current }: { current: Lang }) {
  return (
    <div className="hub-langs">
      {HUBS.map((h) =>
        h.lang === current ? (
          <span key={h.lang} className="chip on" aria-current="page">
            <Flag lang={h.lang} />
            {h.name}
          </span>
        ) : (
          <Link key={h.lang} href={h.href} className="chip" hrefLang={h.tag} lang={h.tag}>
            <Flag lang={h.lang} />
            {h.name}
          </Link>
        ),
      )}
    </div>
  );
}
