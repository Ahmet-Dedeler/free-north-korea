import Link from 'next/link';
import { Activity, Landmark, Megaphone } from 'lucide-react';
import AsOf from '@/components/AsOf';
import EventFeed from '@/components/EventFeed';
import KimLastSeen from '@/components/KimLastSeen';
import { LatestImagery } from '@/components/SatWatch';
import { StatTile } from '@/components/Visual';
import { LISTS, LIST_KEYS, NATIONAL_KEYS, SANCTIONS, SANCTIONS_PATHS, type ListKey } from '@/content/sanctions';
import { WATCH_TEXT } from '@/content/watch';
import type { Lang } from '@/site/seo';

/** A page that exists in every language: English at the root, the rest under /ko, /ja, /zh. */
const at = (lang: Lang, path: string) => (lang === 'en' ? path : `/${lang}${path}`);

/** Entries per sanctions list, with the day each was downloaded. */
function listCounts(): { key: ListKey; n: number; fetched: string }[] {
  const { un, ofac, national, fetched } = SANCTIONS;
  const byKey: Record<ListKey, { n: number; fetched: string }> = {
    UN: { n: un.individuals.length + un.entities.length, fetched },
    US: { n: ofac.length, fetched },
    ...(Object.fromEntries(NATIONAL_KEYS.map((k) => [k, { n: national[k.toLowerCase() as 'uk' | 'eu' | 'jp'].entries.length, fetched: national[k.toLowerCase() as 'uk' | 'eu' | 'jp'].fetched }])) as Record<'UK' | 'EU' | 'JP', { n: number; fetched: string }>),
  };
  return LIST_KEYS.map((key) => ({ key, ...byKey[key] }));
}

/**
 * /watch and its translations: the hub for what the site measures or counts itself on a schedule, sorted by how a
 * number is known (measured, counted, reported by the regime). Every block is a reused feature component, so this
 * page holds no data of its own and updates whenever those datasets do.
 */
export default function WatchPage({ lang }: { lang: Lang }) {
  const t = WATCH_TEXT[lang];
  const counts = listCounts();
  const kinds = [
    { id: 'measured', icon: Activity, text: t.kinds.measured },
    { id: 'counted', icon: Landmark, text: t.kinds.counted },
    { id: 'reported', icon: Megaphone, text: t.kinds.reported },
  ] as const;

  return (
    <div className="wide wh">
      <p className="eyebrow">{t.eyebrow}</p>
      <h1>{t.h1}</h1>
      <p className="lede">{t.lede}</p>

      <ol className="wh-kinds">
        {kinds.map(({ id, icon: Icon, text }) => (
          <li key={id} className={`wh-kind wh-kind-${id}`}>
            <a href={`#${id}`}>
              <Icon size={18} aria-hidden="true" />
              <b>{text[0]}</b>
            </a>
            <span>{text[1]}</span>
          </li>
        ))}
      </ol>

      <section id="measured" className="wh-section">
        <h2>{t.measuredTitle}</h2>
        <p className="muted">{t.measuredIntro}</p>
        <h3>{t.eventsTitle}</h3>
        <EventFeed lang={lang} limit={6} heading={false} />
        <p className="wh-more">
          <Link href={at(lang, '/military')}>{t.eventsMore.military} →</Link>
          <Link href={at(lang, '/missiles/list')}>{t.eventsMore.missiles} →</Link>
        </p>
        <h3>{t.imagesTitle}</h3>
        <p className="muted">{t.imagesIntro}</p>
        <LatestImagery lang={lang} limit={4} heading={false} />
      </section>

      <section id="counted" className="wh-section">
        <h2>{t.countedTitle}</h2>
        <p className="muted">{t.countedIntro}</p>
        <h3>{t.listsLabel}</h3>
        <div className="tiles">
          {counts.map((c) => (
            <StatTile key={c.key} value={c.n} label={LISTS[c.key].name[lang]} note={<AsOf date={c.fetched} lang={lang} />} />
          ))}
        </div>
        <p className="wh-more">
          <Link href={SANCTIONS_PATHS[lang]}>{t.sanctionsMore} →</Link>
          <Link href={at(lang, '/data')}>{t.dataMore} →</Link>
        </p>
      </section>

      <section id="reported" className="wh-section">
        <h2>{t.reportedTitle}</h2>
        <p className="muted">{t.reportedIntro}</p>
        <KimLastSeen lang={lang} />
      </section>

      <section className="wh-section">
        <h2>{t.scheduleTitle}</h2>
        <dl className="wh-schedule">
          {t.schedule.map(([when, what]) => (
            <div key={when}>
              <dt>{when}</dt>
              <dd>{what}</dd>
            </div>
          ))}
        </dl>
        <p className="muted small">{t.scheduleNote}</p>
      </section>
    </div>
  );
}
