import { Activity, Rocket } from 'lucide-react';
import { Ext } from '@/components/Ext';
import { TEST_SITE_RADIUS_KM, latestEvents, type FeedItem } from '@/content/events';
import { EVENT_TEXT, formatWhen } from '@/content/eventsI18n';
import type { Lang } from '@/site/seo';

/** The headline numbers of a launch release: count, weapon and the longest distance MOD gives. */
function launchLine(item: Extract<FeedItem, { kind: 'launch' }>, lang: Lang) {
  const t = EVENT_TEXT[lang];
  const e = item.event;
  const range = e.rangeKm.length ? t.km(Math.max(...e.rangeKm)) : null;
  return t.feed.launch(t.count(e.count, e.countNote), t.weapon[e.weapon], range && (e.rangeBound ? t.bound(range, e.rangeBound) : t.feed.about(range)));
}

/**
 * Compact list of the latest measured events across both wire sources (USGS seismic readings and Japan MOD launch
 * reports): date, what happened, who measured it and a link to their record. Server component; reuse it anywhere
 * (a hub page, /military). `limit` sets how many rows; `heading` false hides the title when the page has its own.
 */
export default function EventFeed({ lang, limit = 6, heading = true }: { lang: Lang; limit?: number; heading?: boolean }) {
  const t = EVENT_TEXT[lang];
  const items = latestEvents(limit);
  return (
    <section className="event-feed" aria-label={t.feed.title}>
      {heading && <h3>{t.feed.title}</h3>}
      <ol>
        {items.map((item) =>
          item.kind === 'seismic' ? (
            <li key={item.event.id}>
              <span className="ef-icon seismic" aria-hidden="true">
                <Activity size={16} />
              </span>
              <div>
                <time dateTime={item.time}>{formatWhen(item.time, lang)}</time>
                <b>{t.feed.quake(t.usgsTypes[item.event.type] ?? item.event.type, item.event.mag?.toFixed(1) ?? '?')}</b>
                <small>
                  {item.event.kmFromTestSite <= TEST_SITE_RADIUS_KM ? (
                    t.seismic.fromSite(t.km(item.event.kmFromTestSite))
                  ) : (
                    <span lang="en">{item.event.place}</span>
                  )}
                  {' · '}
                  {t.feed.by.usgs} ·{' '}
                  <Ext href={item.event.url}>{t.feed.source}</Ext>
                </small>
              </div>
            </li>
          ) : (
            <li key={item.event.id}>
              <span className="ef-icon launch" aria-hidden="true">
                <Rocket size={16} />
              </span>
              <div>
                <time dateTime={item.time}>{formatWhen(item.time, lang)}</time>
                <b>{launchLine(item, lang)}</b>
                <small>
                  {t.feed.by.mod} ·{' '}
                  <Ext href={item.event.url} hrefLang="ja">
                    {t.feed.source}
                  </Ext>
                </small>
              </div>
            </li>
          ),
        )}
      </ol>
      <p className="muted small">{t.feed.note}</p>
    </section>
  );
}
