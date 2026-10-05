import { latest } from '@/charts/data';
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from '@/site/og';

// Default share card. Pages with their own opengraph-image.tsx (articles, camps, people, places) override it.
export const alt = 'Free North Korea: understand North Korea, help its people';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OgImage() {
  // escapee count follows the weekly data refresh (Ministry of Unification, latest full year)
  const arrivals = latest('defector-arrivals', 'women')!;
  const men = latest('defector-arrivals', 'men')!;
  return ogCard({
    title: 'Understand North Korea. Help free its people.',
    sub: 'The map, the military, the data, and the groups you can help.',
    stats: [
      { value: '26M', label: 'people living under the Kim regime', color: '#dc2626' },
      { value: '80–120k', label: 'held in political prison camps', color: '#f59e0b' },
      { value: String(arrivals.v + men.v), label: `escaped to South Korea in ${arrivals.t}`, color: '#22c55e' },
    ],
  });
}
