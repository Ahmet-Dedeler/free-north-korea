import { KIM_WATCH_TEXT, daysSinceLastSeen } from '@/content/kimWatch';
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from '@/site/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OgImage() {
  const t = KIM_WATCH_TEXT.zh;
  const days = daysSinceLastSeen();
  return ogCard({
    kicker: t.eyebrow,
    title: t.h1,
    sub: t.sourceTitle,
    ...(days !== null && { stats: [{ value: String(days), label: `${t.lastSeenBlock.unit(days)} ${t.daysSince}`, color: '#f2444c' }] }),
  });
}
