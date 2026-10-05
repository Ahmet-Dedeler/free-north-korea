import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SERIES } from '@/charts/data';
import { SeriesPage } from '@/components/DataPage';
import { DATA_TEXT } from '@/content/dataPage';
import { SERIES_TEXT, dataPath } from '@/content/series';
import { LANGS, pageMeta } from '@/site/seo';

export const dynamicParams = false;
export const generateStaticParams = () => SERIES.map((s) => ({ id: s.id }));

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const s = SERIES.find((x) => x.id === id);
  if (!s) return {};
  const text = SERIES_TEXT[id]?.ko;
  const title = text?.title ?? s.title;
  return pageMeta({
    title: `${title}: North Korea data`,
    description: DATA_TEXT.ko.seriesMetaDescription(title, text?.sub ?? ''),
    path: dataPath('ko', id),
    lang: 'ko',
    languages: Object.fromEntries(LANGS.map((l) => [l, dataPath(l, id)])),
  });
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!SERIES.some((s) => s.id === id)) notFound();
  return <SeriesPage lang="ko" id={id} />;
}
