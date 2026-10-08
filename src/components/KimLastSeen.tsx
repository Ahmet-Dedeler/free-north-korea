import Link from 'next/link';
import { Eye } from 'lucide-react';
import { formatAsOf } from '@/components/AsOf';
import { KIM_WATCH, KIM_WATCH_PATHS, KIM_WATCH_TEXT, LOCALE, daysSinceLastSeen } from '@/content/kimWatch';
import LiveDays from '@/components/LiveDays';
import type { Lang } from '@/site/seo';
import '@/charts/charts.css';

/**
 * "12 days since Kim Jong Un's last public appearance reported by KCNA", with the date and a link to /kim-watch.
 * A small server-rendered block any page can drop in (the Kim Jong Un profile, the family tree, a future hub page).
 * The count is recounted in the browser (LiveDays); the date KCNA was last checked is in the tooltip.
 */
export default function KimLastSeen({ lang = 'en' }: { lang?: Lang }) {
  const last = KIM_WATCH.lastAppearance;
  const days = daysSinceLastSeen();
  if (!last || days === null) return null;
  const t = KIM_WATCH_TEXT[lang];
  return (
    <aside className="kw-lastseen" title={t.counted(formatAsOf(KIM_WATCH.fetched, LOCALE[lang]))}>
      <Link href={KIM_WATCH_PATHS[lang]}>
        <Eye size={18} aria-hidden="true" className="kw-ls-icon" />
        <span className="kw-ls-count">
          <b className="display">
            <LiveDays from={last.date} initial={days} />
          </b>{' '}
          <LiveDays from={last.date} initial={days} show="unit" one={t.lastSeenBlock.unit(1)} many={t.lastSeenBlock.unit(2)} />
        </span>
        <span className="kw-ls-text">
          {t.lastSeenBlock.label}
          <small>
            {t.lastSeen}: {formatAsOf(last.date, LOCALE[lang])} · {t.lastSeenBlock.more} →
          </small>
        </span>
      </Link>
    </aside>
  );
}
