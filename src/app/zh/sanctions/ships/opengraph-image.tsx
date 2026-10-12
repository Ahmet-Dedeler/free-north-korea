import { SHIPS_TEXT } from '@/content/ships';
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from '@/site/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OgImage() {
  const t = SHIPS_TEXT.zh;
  return ogCard({ kicker: t.eyebrow, title: t.h1, sub: t.metaDescription });
}
