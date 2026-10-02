import ArticleCards from '@/components/ArticleCards';
import { ARTICLES } from '@/content/articles';
import { pageMeta } from '@/site/seo';

export const metadata = pageMeta({
  title: 'Learn About North Korea: Freedom, Escape, Prison Camps',
  description:
    'Straight answers about North Korea: how it could be freed, whether that is possible, how people escape, the prison camps, and how information gets in.',
  path: '/learn',
});

export default function Learn() {
  return (
    <div className="wide">
      <p className="eyebrow">Learn</p>
      <h1>Straight answers about North Korea</h1>
      <p className="lede">Short, sourced explainers on the questions people actually search for. Each one ends with something you can do.</p>
      <ArticleCards articles={ARTICLES} lead />
    </div>
  );
}
