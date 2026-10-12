'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Activity, Rocket } from 'lucide-react';
import { localize } from '@/content/chrome';
import { MAP_TEXT } from '@/content/mapI18n';
import type { MapLatest } from '@/content/mapLatest';
import { dayLabel, imgSrc } from '@/content/satLabels';
import type { Lang } from '@/site/seo';
import type { Selection } from './types';

/** Events this recent get a pulsing dot. Worked out in the browser, because the page itself is built ahead of time. */
const FRESH_MS = 72 * 3_600_000;

/**
 * "Latest" in the map sidebar: what changed recently, one click from the map. Launch reports link to their record,
 * quakes fly the map to where USGS placed them, and the newest Camp Watch images open their site with its photo.
 */
export default function Latest({ latest, lang, onSelect, onFocus }: { latest: MapLatest; lang: Lang; onSelect: (s: Selection) => void; onFocus: (lngLat: [number, number]) => void }) {
  const tx = MAP_TEXT[lang];
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => setNow(Date.now()), []);
  const { sat, events } = latest;
  if (!sat && !events.length) return null;
  const fresh = (iso: string) => now !== null && now - Date.parse(iso) < FRESH_MS;

  return (
    <section className="latest" aria-labelledby="latest-h">
      <h3 id="latest-h">{tx.latestTitle}</h3>
      {events.length > 0 && (
        <ul className="lt-events">
          {events.map((e) => {
            const body = (
              <>
                <span className={`lt-icon ${e.kind}`} aria-hidden="true">
                  {e.kind === 'launch' ? <Rocket size={15} /> : <Activity size={15} />}
                  {fresh(e.iso) && <i className="lt-fresh" />}
                </span>
                <span className="lt-text">
                  <b>{e.title}</b>
                  <time dateTime={e.iso}>{e.when}</time>
                </span>
              </>
            );
            return (
              <li key={e.id}>
                {e.href ? (
                  <Link className="lt-row" href={e.href} title={e.sub}>
                    {body}
                  </Link>
                ) : (
                  <button type="button" className="lt-row" title={e.sub} aria-label={tx.latestQuakeAria(e.title)} onClick={() => e.lngLat && onFocus(e.lngLat)}>
                    {body}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {sat && (
        <div className="lt-sat">
          <p>{tx.latestSat(dayLabel(lang, sat.date))}</p>
          <div className="lt-thumbs">
            {sat.sites.map((s) => (
              <button key={s.siteId} type="button" title={s.name} onClick={() => onSelect({ kind: 'point', layer: s.layer, id: s.id })}>
                <img src={imgSrc(s.siteId, s.date)} alt="" width={512} height={512} loading="lazy" />
                <span lang={lang === 'en' ? undefined : 'en'}>{s.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      <Link className="lt-more" href={localize(lang, '/watch')}>
        {tx.latestMore}
      </Link>
    </section>
  );
}
