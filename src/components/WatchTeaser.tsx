import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import EventFeed from '@/components/EventFeed';
import KimLastSeen from '@/components/KimLastSeen';
import { WATCH_PATHS, WATCH_TEXT } from '@/content/watch';
import type { Lang } from '@/site/seo';

/** Home-page block for /watch: the three latest measured events, Kim's last reported appearance and a link to the hub. */
export default function WatchTeaser({ lang }: { lang: Lang }) {
  const t = WATCH_TEXT[lang].teaser;
  return (
    <section className="band wh-teaser">
      {/* title left, "see all" pill right, like every other section head on the home page */}
      <div className="band-head">
        <h2>{t.title}</h2>
        <Link href={WATCH_PATHS[lang]} className="btn small-btn">
          {t.more} <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
      <p className="muted">{t.intro}</p>
      <EventFeed lang={lang} limit={3} heading={false} />
      <KimLastSeen lang={lang} />
    </section>
  );
}
