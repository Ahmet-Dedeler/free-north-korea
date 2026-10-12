'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import SatView from '@/components/SatView';
import { localize } from '@/content/chrome';
import { MAP_TEXT } from '@/content/mapI18n';
import { dayLabel, imgSrc, monthLabel, satCredit, type MapSatSite } from '@/content/satLabels';
import type { Lang } from '@/site/seo';
import type { LayerId } from './config';

const SLOTS = 24;

function shiftMonth(month: string, by: number) {
  const [y, m] = month.split('-').map(Number);
  const i = y * 12 + (m - 1) + by;
  return `${Math.floor(i / 12)}-${String((i % 12) + 1).padStart(2, '0')}`;
}

/**
 * The picture at the top of a point panel, the way Google Maps opens a place with its photo.
 * - Sites in Camp Watch get our own dated Sentinel-2 image, with a strip of the last 24 months under it: drag or
 *   hover along it to step back in time (months with no clear image are hollow and snap to the nearest one).
 * - Every other point gets an Esri aerial view, labelled as undated because Esri doesn't say when it was taken.
 */
export default function PlacePhoto({ siteId, site, name, layer, lat, lon, approx, lang }: { siteId: string; site?: MapSatSite; name: string; layer: LayerId; lat: number; lon: number; approx?: boolean; lang: Lang }) {
  const tx = MAP_TEXT[lang];
  if (!site) {
    // closer for small compounds, wider for camps and bases that span kilometres
    const zoom = layer === 'markets' ? 17 : layer === 'detention' || layer === 'china-detention' ? 16 : layer === 'camps' ? 13 : layer === 'missile-bases' ? 14 : 15;
    return (
      <figure className="pp pp-esri" role="img" aria-label={tx.photoEsriAlt(name)}>
        <SatView lat={lat} lon={lon} zoom={approx ? Math.min(zoom, 14) : zoom} label={name} approx={approx} height={190} compact />
        {/* SatView prints Esri's credit itself */}
        <span className="pp-cap">{tx.photoEsri}</span>
      </figure>
    );
  }
  return <SentinelPhoto key={siteId} siteId={siteId} site={site} name={name} lang={lang} />;
}

function SentinelPhoto({ siteId, site, name, lang }: { siteId: string; site: MapSatSite; name: string; lang: Lang }) {
  const tx = MAP_TEXT[lang];
  const { frames, latest } = site;
  const latestIdx = Math.max(0, frames.findIndex((f) => f.date === latest));

  // One slot per month up to the latest image, so gaps (cloudy months) stay visible as hollow ticks.
  const slots = useMemo(() => {
    const last = latest.slice(0, 7);
    const byMonth = new Map(frames.flatMap((f, i) => (f.month ? [[f.month, i] as const] : [])));
    byMonth.set(last, latestIdx);
    return Array.from({ length: SLOTS }, (_, i) => {
      const m = shiftMonth(last, i - (SLOTS - 1));
      return { month: m, idx: byMonth.get(m) ?? null };
    });
  }, [frames, latest, latestIdx]);

  // `pinned` is the month the reader clicked or dragged to; hovering with a mouse previews another month until it leaves
  const [pinned, setPinned] = useState(SLOTS - 1);
  const [hover, setHover] = useState<number | null>(null);
  const slot = hover ?? pinned;
  // an empty month shows the nearest month that has an image, earlier first; the caption always names the real date
  const shown = useMemo(() => {
    for (let d = 0; d < SLOTS; d++) {
      for (const s of [slot - d, slot + d]) if (slots[s]?.idx != null) return slots[s].idx!;
    }
    return latestIdx;
  }, [slot, slots, latestIdx]);
  const frame = frames[shown];
  const day = dayLabel(lang, frame.date);

  // fetch every month's image the first time the reader touches the strip, so scrubbing doesn't flicker
  const warmed = useRef(false);
  const warm = () => {
    if (warmed.current) return;
    warmed.current = true;
    for (const f of frames) new Image().src = imgSrc(siteId, f.date);
  };
  const years = [frames[0].date.slice(0, 4), latest.slice(0, 4)];

  return (
    <figure className="pp">
      <div className="pp-img">
        <img src={imgSrc(siteId, frame.date)} alt={tx.photoAlt(name, day)} width={512} height={512} />
        <span className="pp-ring" aria-hidden="true" />
        <span className="pp-cap">
          {tx.photoSentinel} · {day}
          {shown === latestIdx && <b>{tx.photoLatest}</b>}
        </span>
        {/* the 24-month strip sits on the photo like a video scrubber */}
        <div className="pp-scrub" onPointerEnter={warm} onFocus={warm} title={tx.photoScrub}>
          <div className="pp-ticks" aria-hidden="true">
            {slots.map((s, i) => (
              <i key={s.month} className={`${s.idx == null ? 'none' : ''} ${s.idx === shown ? 'on' : ''} ${i === slot ? 'at' : ''}`} />
            ))}
          </div>
          <input
            type="range"
            min={0}
            max={SLOTS - 1}
            value={slot}
            aria-label={tx.photoScrub}
            aria-valuetext={slots[slot].idx == null ? `${monthLabel(lang, slots[slot].month)}: ${tx.photoNoClear}` : day}
            onChange={(e) => {
              setPinned(Number(e.target.value));
              setHover(null);
            }}
            onPointerMove={(e) => {
              // hovering previews a month with a mouse; touch drags the range itself
              if (e.pointerType !== 'mouse' || e.buttons) return;
              const r = e.currentTarget.getBoundingClientRect();
              setHover(Math.max(0, Math.min(SLOTS - 1, Math.round(((e.clientX - r.left) / r.width) * (SLOTS - 1)))));
            }}
            onPointerLeave={() => setHover(null)}
          />
          <div className="pp-ends" aria-hidden="true">
            <span>{monthLabel(lang, slots[0].month)}</span>
            {slots[slot].idx == null && <span>{`${monthLabel(lang, slots[slot].month)}: ${tx.photoNoClear}`}</span>}
            <span>{monthLabel(lang, slots[SLOTS - 1].month)}</span>
          </div>
        </div>
      </div>
      <figcaption className="pp-links">
        <span lang="en">{satCredit(years[0] === years[1] ? years[0] : `${years[0]}-${years[1]}`)}</span>
        <Link href={`${localize(lang, site.path)}#sw-${siteId}`}>{tx.photoCompare}</Link>
      </figcaption>
    </figure>
  );
}
