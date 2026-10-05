import { notFound } from 'next/navigation';
import { ARTICLES, articleBySlug } from '@/content/articles';
import { articleLanguages } from '@/content/translations';
import ArticleView from '@/components/ArticleView';
import { pageMeta } from '@/site/seo';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => ARTICLES.map((a) => ({ slug: a.slug }));

export async function generateMetadata({ params }: Params) {
  const a = articleBySlug((await params).slug);
  if (!a) return {};
  return pageMeta({
    title: a.title,
    description: a.description,
    path: `/learn/${a.slug}`,
    type: 'article',
    languages: articleLanguages(a.slug),
    image: `/learn/${a.slug}/opengraph-image`,
  });
}

export default async function ArticlePage({ params }: Params) {
  const a = articleBySlug((await params).slug);
  if (!a) notFound();
  return <ArticleView a={a} others={ARTICLES.filter((x) => x.slug !== a.slug).slice(0, 3)} />;
}
