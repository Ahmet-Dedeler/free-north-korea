import type { Article } from '@/content/articles/types';
import { getAllCamps } from '@/content/camps';
import { media } from '@/content/media';
import SatView from './SatView';

/** The picture for an article: its Wikipedia photo, or for the camps explainer a satellite view of Yodok. */
export default function ArticleArt({ a, height }: { a: Article; height: number }) {
  const photo = media(`article:${a.slug}`);
  if (photo) return <img src={photo.src} alt="" className="art-img" loading="lazy" />;
  if (a.slug === 'north-korea-prison-camps') {
    const yodok = getAllCamps().find((c) => c.slug === 'kwanliso-15')!;
    return <SatView lat={yodok.lat} lon={yodok.lon} zoom={13} label={yodok.name} compact height={height} />;
  }
  return <span className="art-fallback" />;
}

export function artCredit(a: Article) {
  const photo = media(`article:${a.slug}`);
  if (photo) return photo;
  if (a.slug === 'north-korea-prison-camps') return { credit: 'Satellite view of Camp 15, Yodok · Imagery © Esri, Maxar', sourceUrl: '/camps/kwanliso-15' };
  return undefined;
}
