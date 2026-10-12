'use client';

import { useState } from 'react';
import { Layers } from 'lucide-react';
import { MAP_TEXT } from '@/content/mapI18n';
import type { Lang } from '@/site/seo';
import { OVERLAYS, RADAR_COLOR, RADAR_LEGEND, type Overlay } from './config';
import type { Basemap } from './types';

/** One Esri World Imagery tile over Pyongyang (zoom 8), hotlinked like every satellite tile on the site. */
const SAT_THUMB = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/8/97/217';

/** A drawn stand-in for the vector map: no raster tile of it exists to preview. */
function MapThumb() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="bm-mapthumb">
      <rect width="64" height="64" className="bm-land" />
      <path d="M0 46 C14 40 22 52 34 44 S54 30 64 34 V64 H0Z" className="bm-water" />
      <path d="M-2 18 L26 26 L40 12 L66 20 M18 -2 L26 26 L22 66 M40 12 L46 40 L66 50" className="bm-road" />
    </svg>
  );
}

/**
 * Bottom-left of the map, the way Google Maps does it: one thumbnail that shows the other basemap and switches to
 * it on click, and a Layers button that opens satellite overlays (night lights now; radar ship density and crop
 * health later). The sidebar stays about places; whole-country measurements go here.
 */
export default function BasemapSwitch({ base, onChange, overlays, onToggle, lang }: { base: Basemap; onChange: (b: Basemap) => void; overlays: Set<Overlay>; onToggle: (o: Overlay) => void; lang: Lang }) {
  const tx = MAP_TEXT[lang];
  const [open, setOpen] = useState(false);
  const other: Basemap = base === 'map' ? 'satellite' : 'map';
  return (
    <div className={`basemap ${open ? 'open' : ''}`}>
      <button type="button" className="bm-tile bm-main" onClick={() => onChange(other)} aria-label={tx.baseAria} title={tx.baseAria}>
        {other === 'satellite' ? <img src={SAT_THUMB} alt="" /> : <MapThumb />}
        <span>{other === 'satellite' ? tx.baseSat : tx.baseMap}</span>
      </button>
      <button type="button" className="bm-more" aria-expanded={open} aria-label={tx.layersAria} title={tx.layersAria} onClick={() => setOpen((v) => !v)}>
        <Layers size={16} aria-hidden="true" />
      </button>
      {!open && overlays.size > 0 && (
        // what's switched on, like Google's traffic legend: a key for each overlay and a way to turn it off
        <div className="bm-legends">
          {OVERLAYS.filter((o) => overlays.has(o.id)).map((o) => (
            <div key={o.id} className="bm-legend">
              {o.id === 'radar' ? (
                <span className="bm-key-dots" aria-hidden="true">
                  {RADAR_LEGEND.map((v, i) => (
                    <span key={v}>
                      <i style={{ width: 5 + i * 5, height: 5 + i * 5, background: RADAR_COLOR }} />
                      {v}
                    </span>
                  ))}
                </span>
              ) : (
                <span className="bm-key-glow" aria-hidden="true" />
              )}
              <span className="bm-legend-text">
                {tx.overlays[o.id].label}
                <small>{tx.overlays[o.id].sub}</small>
              </span>
              <button type="button" onClick={() => onToggle(o.id)} aria-label={`${tx.close}: ${tx.overlays[o.id].label}`}>
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
      {open && (
        <div className="bm-panel" role="group" aria-label={tx.overlaysTitle}>
          <p>{tx.overlaysTitle}</p>
          <div className="bm-row">
            {OVERLAYS.map((o) => (
              <button key={o.id} type="button" className={`bm-tile ${overlays.has(o.id) ? 'on' : ''}`} aria-pressed={overlays.has(o.id)} title={tx.overlays[o.id].hint} onClick={() => onToggle(o.id)}>
                <img src={o.thumb} alt="" />
                <span>
                  {tx.overlays[o.id].label}
                  <small>{tx.overlays[o.id].sub}</small>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
