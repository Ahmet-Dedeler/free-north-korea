import { CalendarDays } from 'lucide-react';
import { REVIEWED } from '@/site/config';
import type { Lang } from '@/site/seo';

const TEXT: Record<Lang, { from: string; stale: string; locale: string }> = {
  en: { from: 'Data from', stale: 'may be outdated', locale: 'en-GB' },
  ko: { from: '자료 기준일', stale: '최신 정보가 아닐 수 있음', locale: 'ko-KR' },
  ja: { from: 'データ時点', stale: '古い可能性があります', locale: 'ja-JP' },
  zh: { from: '数据截至', stale: '可能已过时', locale: 'zh-CN' },
};

/** "2018" → 2018, "2018-08" → Aug 2018, "2018-08-14" → 14 Aug 2018. Anything else is shown as written. */
export function formatAsOf(date: string, locale = 'en-GB') {
  const m = date.match(/^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/);
  if (!m) return date;
  if (!m[2]) return m[1];
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, m[3] ? +m[3] : 1));
  return d.toLocaleDateString(locale, { timeZone: 'UTC', year: 'numeric', month: 'short', ...(m[3] && { day: 'numeric' }) });
}

/** True when `date` is more than `years` older than the site's last fact review (so the answer never depends on build day). */
export function isStale(date: string, years = 2) {
  const y = (s: string) => +s.slice(0, 4) + (s.length >= 7 ? (+s.slice(5, 7) - 1) / 12 : 0);
  return /^\d{4}/.test(date) && y(REVIEWED) - y(date) > years;
}

/**
 * The date a number or dataset is from, shown right next to it. Data older than `staleAfter` years also gets a
 * "may be outdated" warning. Use it wherever the site shows data that was true at one point in time (a census, a
 * survey, a fetched list), so nobody reads a 2008 figure as today's.
 * Works in server and client components.
 */
export default function AsOf({ date, label, lang = 'en', staleAfter = 2 }: { date: string; label?: string; lang?: Lang; staleAfter?: number }) {
  const t = TEXT[lang];
  const stale = isStale(date, staleAfter);
  return (
    <span className={`asof ${stale ? 'stale' : ''}`}>
      <CalendarDays size={12} aria-hidden="true" />
      {label ?? t.from} {formatAsOf(date, t.locale)}
      {stale && <em>{t.stale}</em>}
    </span>
  );
}
