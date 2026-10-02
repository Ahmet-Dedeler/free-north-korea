import Link from 'next/link';
import type { Article } from '@/content/articles/types';
import ArticleArt from './ArticleArt';

/** Article cards with their picture on top. `lead` makes the first card span two columns. */
export default function ArticleCards({ articles, lead }: { articles: Article[]; lead?: boolean }) {
  return (
    <ul className={`art-cards ${lead ? 'with-lead' : ''}`}>
      {articles.map((a) => (
        <li key={a.slug}>
          <Link href={`/learn/${a.slug}`} className="art-card">
            <span className="art-pic">
              <ArticleArt a={a} height={lead ? 260 : 170} />
            </span>
            <span className="art-body">
              <b>{a.h1}</b>
              <span>{a.teaser}</span>
              <small>{a.minutes} min read</small>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
