import { notFound } from 'next/navigation';
import { JA_ARTICLES } from '@/content/translations/ja';
import { articleLanguages } from '@/content/translations';
import ArticleView from '@/components/ArticleView';
import { pageMeta } from '@/site/seo';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => JA_ARTICLES.map((a) => ({ slug: a.slug }));

const find = (slug: string) => JA_ARTICLES.find((x) => x.slug === slug);

export async function generateMetadata({ params }: Params) {
  const a = find((await params).slug);
  if (!a) return {};
  return pageMeta({
    title: a.title,
    description: a.description,
    path: `/ja/learn/${a.slug}`,
    type: 'article',
    lang: 'ja',
    languages: articleLanguages(a.slug),
    image: `/ja/learn/${a.slug}/opengraph-image`,
  });
}

export default async function Page({ params }: Params) {
  const a = find((await params).slug);
  if (!a) notFound();
  return <ArticleView a={a} others={JA_ARTICLES.filter((x) => x.slug !== a.slug).slice(0, 3)} />;
}
