import Link from 'next/link';
import { Users } from 'lucide-react';
import type { Camp } from '@/content/camps';
import { campFields, hrefFor, laborLabel } from '@/content/campsI18n';
import type { Lang } from '@/site/seo';
import SatView from './SatView';
import { iconFor } from './Visual';

const LOCALE: Record<Lang, string> = { en: 'en-US', ko: 'ko-KR', ja: 'ja-JP', zh: 'zh-Hans' };

/** Index card for a camp: satellite thumbnail, name, status and the most telling facts as tags. */
export default function CampCard({ camp: c, lang = 'en' }: { camp: Camp; lang?: Lang }) {
  const kwanliso = c.kind.includes('kwanliso');
  const closed = /closed/i.test(c.status);
  const f = campFields(lang, c);
  const statusText = closed ? f.status : f.statusCard;
  return (
    <li>
      <Link href={hrefFor(lang, `/camps/${c.slug}`)} className="place-card">
        <SatView lat={c.lat} lon={c.lon} zoom={kwanliso ? 12 : 15} label={c.name} compact height={150} />
        <span className="pc-body">
          <strong lang={lang === 'en' ? undefined : 'en'}>{c.name}</strong>
          <small>
            {c.koreanName ? (
              <>
                <span lang="ko">{c.koreanName}</span>
                {' · '}
              </>
            ) : null}
            {f.province}
          </small>
          <span className="pc-tags">
            <span className={closed ? '' : 'danger'}>{statusText}</span>
            {c.prisoners && (
              <span>
                <Users size={12} /> ~{c.prisoners.toLocaleString(lang === 'en' ? undefined : LOCALE[lang])}
              </span>
            )}
            {c.facts.labor?.slice(0, 2).map((l) => {
              const Icon = iconFor(l, Users);
              return (
                <span key={l}>
                  <Icon size={12} /> {laborLabel(lang, l)}
                </span>
              );
            })}
          </span>
          {c.facts.summary && c.facts.summary.length < 220 && f.summary && <p>{f.summary}</p>}
        </span>
      </Link>
    </li>
  );
}
