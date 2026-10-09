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
      <h2>{t.title}</h2>
      <p className="muted">{t.intro}</p>
      <EventFeed lang={lang} limit={3} heading={false} />
      <KimLastSeen lang={lang} />
      <p className="wh-more">
        <Link href={WATCH_PATHS[lang]}>
          {t.more} <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </p>
    </section>
  );
}
