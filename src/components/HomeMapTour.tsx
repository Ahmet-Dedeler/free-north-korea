'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowUpRight, Pause, Play } from 'lucide-react';

/** One point the home map tours through: what the card says and which picture sits on top of it. */
export interface TourStop {
  name: string;
  /** Category or camp kind, shown next to the coloured dot. */
  kind: string;
  /** One short line about the place (first sentence of its note). */
  line?: string;
  color: string;
  href: string;
  /** Our own dated Sentinel-2 chip, when the place is on Camp Watch. */
  sat?: { src: string; date: string; credit: string };
  /** Otherwise an Esri aerial: tiles laid out so the point sits in the middle of the picture. */
  esri?: { src: string; x: number; y: number }[];
}

/** Card width; the picture is 280 x 140 (the Esri tiles are laid out for that box in app/page.tsx, sizes in visual.css). */
const TOUR_IMG_W = 280;
const STEP_MS = 4000;

/**
 * The home hero map, alive: every few seconds it picks the next dot and shows its card (picture, kind, one line) as if
 * someone hovered it. Hovering a dot or the card pauses the tour and shows that dot instead; the button pauses it for
 * good. The SVG and its links stay server-rendered (children); this only adds the card and the highlight.
 *
 * `stops[i]` belongs to the i-th `a[data-tip]` in the SVG; `order` is the sequence the tour walks.
 */
export default function HomeMapTour({ stops, order, children }: { stops: TourStop[]; order: number[]; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [hold, setHold] = useState(false); // pointer or focus inside the map
  const [paused, setPaused] = useState(false); // the pause button
  const [visible, setVisible] = useState(false); // on screen and tab visible
  const [pos, setPos] = useState<{ x: number; y: number; below: boolean; left: number } | null>(null);

  const current = hovered ?? order[step % order.length];
  const stop = stops[current];
  const running = !paused && !hold && visible;

  // Only run while the map is on screen and the tab is visible.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let onScreen = false;
    const update = () => setVisible(onScreen && document.visibilityState === 'visible');
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      update();
    });
    io.observe(el);
    document.addEventListener('visibilitychange', update);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', update);
    };
  }, []);

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setStep((s) => s + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [running, step]);

  // Warm the next picture so the card never opens on an empty frame.
  useEffect(() => {
    const next = stops[order[(step + 1) % order.length]];
    for (const src of next.sat ? [next.sat.src] : (next.esri ?? []).map((t) => t.src)) new Image().src = src;
  }, [step, stops, order]);

  // Place the card over the active dot, flipped below it near the top, kept inside the box.
  const place = useCallback(() => {
    const el = box.current;
    if (!el) return;
    const pins = el.querySelectorAll<HTMLElement>('a[data-tip]');
    pins.forEach((p, i) => p.classList.toggle('on', i === current));
    const a = pins[current];
    if (!a) return;
    const r = a.getBoundingClientRect();
    const b = el.getBoundingClientRect();
    const x = r.left + r.width / 2 - b.left;
    const y = r.top + r.height / 2 - b.top;
    const w = Math.min(TOUR_IMG_W, b.width - 24);
    const left = Math.max(12, Math.min(b.width - w - 12, x - w / 2));
    // northern dots get the card below them, southern ones above, so it stays over the map
    setPos({ x, y, below: y < b.height * 0.5, left });
  }, [current]);

  useEffect(() => {
    place();
    addEventListener('resize', place);
    return () => removeEventListener('resize', place);
  }, [place]);

  const over = (t: EventTarget) => {
    const a = (t as Element).closest?.('a[data-tip]');
    if (!a || !box.current) return;
    const i = [...box.current.querySelectorAll('a[data-tip]')].indexOf(a);
    if (i >= 0) setHovered(i);
  };
  // When the reader lets go of a dot they hovered, the tour carries on from that dot.
  const release = () => {
    if (hovered != null) {
      const k = order.indexOf(hovered);
      if (k >= 0) setStep(k);
    }
    setHovered(null);
    setHold(false);
  };

  return (
    <div
      ref={box}
      className="tour"
      onPointerOver={(e) => {
        setHold(true);
        over(e.target);
      }}
      onPointerLeave={release}
      onFocus={(e) => {
        setHold(true);
        over(e.target);
      }}
      onBlur={(e) => !box.current?.contains(e.relatedTarget as Node) && release()}
    >
      {children}
      {pos && (
        <>
          <span className="tour-ring" style={{ left: pos.x, top: pos.y, color: stop.color }} aria-hidden />
          <Link
            key={current}
            href={stop.href}
            className={`tour-card ${pos.below ? 'below' : ''}`}
            style={{ left: pos.left, top: pos.y, ['--dot' as string]: stop.color }}
            aria-label={`${stop.name}, ${stop.kind}: open on the map`}
          >
            <span className="tour-img">
              {stop.sat ? (
                <img src={stop.sat.src} alt="" />
              ) : (
                <span className="tour-tiles">
                  {stop.esri?.map((t) => <img key={t.src} src={t.src} alt="" style={{ left: t.x, top: t.y }} />)}
                </span>
              )}
              <span className="tour-credit" title={stop.sat?.credit}>
                {stop.sat ? `© Copernicus Sentinel-2 · ${stop.sat.date}` : '© Esri, Maxar · date not given'}
              </span>
            </span>
            <span className="tour-body">
              <span className="tour-kind">
                <i /> {stop.kind}
              </span>
              <b>{stop.name}</b>
              {stop.line && <span className="tour-line">{stop.line}</span>}
              <span className="tour-open">
                Open on the map <ArrowUpRight size={13} aria-hidden />
              </span>
            </span>
            {hovered == null && <span key={step} className={`tour-progress ${running ? '' : 'held'}`} aria-hidden />}
          </Link>
        </>
      )}
      <button
        type="button"
        className="tour-pause"
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? 'Play the map tour' : 'Pause the map tour'}
        aria-pressed={paused}
      >
        {paused ? <Play size={13} aria-hidden /> : <Pause size={13} aria-hidden />}
      </button>
    </div>
  );
}
