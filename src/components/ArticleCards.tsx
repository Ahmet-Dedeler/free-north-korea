import Link from 'next/link';
import type { Article } from '@/content/articles/types';
import type { Lang } from '@/site/seo';
import ArticleArt from './ArticleArt';

const PREFIX: Record<Lang, string> = { en: '', ko: '/ko', ja: '/ja', zh: '/zh' };
const MIN: Record<Lang, (n: number) => string> = { en: (n) => `${n} min read`, ko: (n) => `${n}분 분량`, ja: (n) => `${n}分で読める`, zh: (n) => `约${n}分钟读完` };

/** Article cards with their picture on top, linking to each article in its own language. `lead` makes the first card span two columns. */
export default function ArticleCards({ articles, lead }: { articles: Article[]; lead?: boolean }) {
  return (
    <ul className={`art-cards ${lead ? 'with-lead' : ''}`}>
      {articles.map((a) => {
        const lang = a.lang ?? 'en';
        return (
          <li key={a.slug}>
            <Link href={`${PREFIX[lang]}/learn/${a.slug}`} className="art-card">
              <span className="art-pic">
                <ArticleArt a={a} height={lead ? 260 : 170} />
              </span>
              <span className="art-body">
                <b>{a.h1}</b>
                <span>{a.teaser}</span>
                <small>{MIN[lang](a.minutes)}</small>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
