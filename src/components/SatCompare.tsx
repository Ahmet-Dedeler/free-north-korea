'use client';

import { useCallback, useState } from 'react';
import { Expand } from 'lucide-react';
import { Ext } from '@/components/Ext';
import SatViewer from '@/map/SatViewer';

/** One image as the server prepared it. All text is already in the reader's language. */
export interface SatViewImage {
  src: string;
  /** Smaller copies for phones, when the image is large. */
  srcSet?: string;
  day: string;
  alt: string;
  /** "Cloud in this square: 0%" */
  cloud: string;
  scene: string;
  /** Link for the scene name and to check the day at the source. Planet's mosaics have no public page per image. */
  sceneUrl?: string;
  copernicus?: string;
}

export interface SatSlot {
  label: string;
  /** Index into `views`, or null for a month without a clear image. */
  idx: number | null;
}

/** A titled set of date buttons. */
export interface SatSlotGroup {
  title: string;
  slots: SatSlot[];
}

export interface SatCompareText {
  before: string;
  after: string;
  latest: string;
  /** Title of the date buttons when `slots` is used on its own. */
  pickMonth?: string;
  compareAria: string;
  noClear: string;
  scene: string;
  openCopernicus?: string;
  /** Labels for the full-size viewer. Given when the images have more detail than the page can show. */
  full?: { open: string; close: string; zoomIn: string; zoomOut: string };
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
  groups,
  scale,
  t,
}: {
  views: SatViewImage[];
  afterIdx: number;
  defaultBefore: number | null;
  slots?: SatSlot[];
  /** Several titled sets of date buttons, used instead of `slots`. */
  groups?: SatSlotGroup[];
  scale: { pct: number; label: string };
  t: SatCompareText;
}) {
  const [before, setBefore] = useState<number | null>(defaultBefore);
  const [pos, setPos] = useState(50);
  const after = views[afterIdx];
  const b = before !== null && before !== afterIdx ? views[before] : null;
  const sets = groups ?? [{ title: t.pickMonth ?? '', slots: slots ?? [] }];
  const sizes = '(max-width: 800px) 100vw, 560px';
  // Index of the image open in the full-size viewer; arrow keys step through all of them.
  const [big, setBig] = useState<number | null>(null);
  const step = useCallback((by: number) => setBig((i) => (i === null ? i : Math.max(0, Math.min(views.length - 1, i + by)))), [views.length]);

  return (
    <div className="sw-body">
      <figure className="sw-figure">
        <div className="sw-stage">
          <img className="sw-img" src={after.src} srcSet={after.srcSet} sizes={after.srcSet && sizes} alt={after.alt} width={512} height={512} draggable={false} />
          {b && (
            <div className="sw-before" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
              <img className="sw-img" src={b.src} srcSet={b.srcSet} sizes={b.srcSet && sizes} alt={b.alt} width={512} height={512} draggable={false} />
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
          {t.full && (
            <button type="button" className="sw-expand" onClick={() => setBig(afterIdx)} aria-label={t.full.open} title={t.full.open}>
              <Expand size={15} aria-hidden="true" />
            </button>
          )}
        </div>
      </figure>
      {t.full && big !== null && (
        <SatViewer src={views[big].src} alt={views[big].alt} caption={views[big].day} labels={t.full} onStep={step} onClose={() => setBig(null)} />
      )}

      <div className="sw-side">
        <div className="sw-caps">
          {b && <Cap v={b} label={t.before} t={t} onOpen={() => before !== null && setBig(before)} />}
          <Cap v={after} label={b ? t.after : t.latest} t={t} onOpen={() => setBig(afterIdx)} />
        </div>
        {sets.map((set) => (
          <div className="sw-months" key={set.title}>
            <p className="sw-pick">{set.title}</p>
            <ol>
              {set.slots.map((s) => (
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
        ))}
      </div>
    </div>
  );
}

function Cap({ v, label, t, onOpen }: { v: SatViewImage; label: string; t: SatCompareText; onOpen: () => void }) {
  return (
    <span className="sw-cap">
      <strong>
        {label}: {v.day}
      </strong>
      <span>{v.cloud}</span>
      <span>
        {t.scene}{' '}
        {v.sceneUrl ? (
          <Ext href={v.sceneUrl} lang="en">
            {v.scene}
          </Ext>
        ) : (
          <span lang="en">{v.scene}</span>
        )}
      </span>
      {t.full && (
        <button type="button" className="sw-open" onClick={onOpen}>
          {t.full.open}
        </button>
      )}
      {v.copernicus && t.openCopernicus && (
        <Ext href={v.copernicus}>
          {t.openCopernicus} ↗
        </Ext>
      )}
    </span>
  );
}
