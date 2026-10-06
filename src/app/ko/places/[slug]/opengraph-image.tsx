import { getAllPlaceSlugs, getPlaceBySlug } from '@/content/places-data';
import { PLACES_TEXT, placeFields } from '@/content/placesI18n';
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from '@/site/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const generateStaticParams = () => getAllPlaceSlugs().map((slug) => ({ slug }));

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPlaceBySlug(slug);
  const t = PLACES_TEXT.ko;
  if (!p) return ogCard({ kicker: t.ogKickerFallback, title: t.ogTitleFallback });
  const fields = placeFields('ko', p);
  return ogCard({ kicker: fields.categoryLabel, title: p.name, sub: fields.note });
}
