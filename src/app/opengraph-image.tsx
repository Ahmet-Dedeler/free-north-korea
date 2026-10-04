import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from '@/site/og';

// Default share card. Pages with their own opengraph-image.tsx (articles, camps, people, places) override it.
export const alt = 'Free North Korea: understand North Korea, help its people';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OgImage() {
  return ogCard({
    title: 'Understand North Korea. Help free its people.',
    sub: 'Map · Military · Missile tests · People · Sanctions · Organizations · How to help',
  });
}
