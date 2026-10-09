import Link from 'next/link';
import ArticleCards from '@/components/ArticleCards';
import { ARTICLES } from '@/content/articles';
import { JA_ARTICLES } from '@/content/translations/ja';
import { KO_ARTICLES } from '@/content/translations/ko';
import { ZH_ARTICLES } from '@/content/translations/zh';
import { ABOUT_PATHS, LEARN_TEXT } from '@/content/about';
import type { Article } from '@/content/articles/types';
import type { Lang } from '@/site/seo';

const BY_LANG: Record<Lang, Article[]> = { en: ARTICLES, ko: KO_ARTICLES, ja: JA_ARTICLES, zh: ZH_ARTICLES };

/** /learn and its translations: every explainer in that language, newest structure first (the order in each index.ts). */
export default function LearnIndex({ lang }: { lang: Lang }) {
  const t = LEARN_TEXT[lang];
  return (
    <div className="wide">
      <p className="eyebrow">{t.eyebrow}</p>
      <h1>{t.h1}</h1>
      <p className="lede">{t.lede}</p>
      <p className="muted">
        <Link href={ABOUT_PATHS[lang]}>{t.byline}</Link>
      </p>
      <ArticleCards articles={BY_LANG[lang]} lead />
    </div>
  );
}
