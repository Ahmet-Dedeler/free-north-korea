'use client';

import { useState } from 'react';
import { Ext } from '@/components/Ext';

/** One image as the server prepared it. All text is already in the reader's language. */
export interface SatViewImage {
  src: string;
  day: string;
  alt: string;
  /** "Cloud in this square: 0%" */
  cloud: string;
  scene: string;
  sceneUrl: string;
  copernicus: string;
}

export interface SatSlot {
  label: string;
  /** Index into `views`, or null for a month without a clear image. */
  idx: number | null;
}

export interface SatCompareText {
  before: string;
  after: string;
  latest: string;
  pickMonth: string;
  compareAria: string;
  noClear: string;
  scene: string;
  openCopernicus: string;
}

/**
 * Before/after slider for Camp Watch. The server renders it with the default pair (latest vs. a year earlier), so the
 * images, dates and alt text are in the HTML; the browser only adds the slider and the month buttons.
 */
export default function SatCompare({
  views,
  afterIdx,
  defaultBefore,
  slots,
  scale,
  t,
}: {
  views: SatViewImage[];
  afterIdx: number;
  defaultBefore: number | null;
  slots: SatSlot[];
  scale: { pct: number; label: string };
  t: SatCompareText;
}) {
  const [before, setBefore] = useState<number | null>(defaultBefore);
  const [pos, setPos] = useState(50);
  const after = views[afterIdx];
  const b = before !== null && before !== afterIdx ? views[before] : null;

  return (
    <div className="sw-body">
      <figure className="sw-figure">
        <div className="sw-stage">
          <img className="sw-img" src={after.src} alt={after.alt} width={512} height={512} draggable={false} />
          {b && (
            <div className="sw-before" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
              <img className="sw-img" src={b.src} alt={b.alt} width={512} height={512} draggable={false} />
            </div>
          )}
          <span className="sw-ring" aria-hidden="true" />
          {b && (
            <>
              <span className="sw-tag left">{b.day}</span>
              <input
                className="sw-range"
                type="range"
                min={0}
                max={100}
                step={1}
                value={pos}
                onChange={(e) => setPos(Number(e.target.value))}
                aria-label={t.compareAria}
              />
              <span className="sw-divider" style={{ left: `${pos}%` }} aria-hidden="true" />
            </>
          )}
          <span className="sw-tag right">{b ? after.day : `${t.latest} · ${after.day}`}</span>
          <span className="sw-scale" aria-hidden="true">
            <i style={{ width: `${scale.pct}%` }} />
            {scale.label}
          </span>
        </div>
      </figure>

      <div className="sw-side">
        <div className="sw-caps">
          {b && <Cap v={b} label={t.before} t={t} />}
          <Cap v={after} label={b ? t.after : t.latest} t={t} />
        </div>
        <div className="sw-months">
          <p className="sw-pick">{t.pickMonth}</p>
          <ol>
            {slots.map((s) => (
              <li key={s.label}>
                <button
                  type="button"
                  disabled={s.idx === null}
                  aria-pressed={s.idx !== null && (s.idx === before || (s.idx === afterIdx && b === null))}
                  title={s.idx === null ? t.noClear : views[s.idx].day}
                  onClick={() => s.idx !== null && setBefore(s.idx)}
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function Cap({ v, label, t }: { v: SatViewImage; label: string; t: SatCompareText }) {
  return (
    <span className="sw-cap">
      <strong>
        {label}: {v.day}
      </strong>
      <span>{v.cloud}</span>
      <span>
        {t.scene}{' '}
        <Ext href={v.sceneUrl} lang="en">
          {v.scene}
        </Ext>
      </span>
      <Ext href={v.copernicus}>
        {t.openCopernicus} ↗
      </Ext>
    </span>
  );
}
