'use client';

import Link from 'next/link';
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';

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

const STEP_MS = 6000;
/** Distance kept clear around the active dot (its pulsing ring is about 24px across at its widest), and from the edge. */
const CLEAR = 26;
const EDGE = 8;

/** Where the card goes: the dot it belongs to and the card's top-left corner, both inside the map box. */
interface Spot {
  x: number;
  y: number;
  left: number;
  top: number;
}

/**
 * Where to put a w x h card in a W x H box so it stays inside the box and keeps the dot at (x, y) uncovered: of every
 * position on an 8px grid, the one whose centre is nearest the dot without overlapping the clear zone around it. If no
 * position keeps the dot clear (a tiny box), the one covering the least of it.
 */
function placeCard(x: number, y: number, w: number, h: number, W: number, H: number): { left: number; top: number } {
  const maxL = Math.max(EDGE, W - w - EDGE);
  const maxT = Math.max(EDGE, H - h - EDGE);
  let best = { left: EDGE, top: EDGE, cover: Infinity, dist: Infinity };
  for (let top = EDGE; top <= maxT + 0.5; top += 8) {
    for (let left = EDGE; left <= maxL + 0.5; left += 8) {
      const ox = Math.max(0, Math.min(left + w, x + CLEAR) - Math.max(left, x - CLEAR));
      const oy = Math.max(0, Math.min(top + h, y + CLEAR) - Math.max(top, y - CLEAR));
      const cover = ox * oy;
      const dist = Math.hypot(left + w / 2 - x, top + h / 2 - y);
      if (cover < best.cover || (cover === best.cover && dist < best.dist)) best = { left, top, cover, dist };
    }
  }
  return { left: best.left, top: best.top };
}

/**
 * The home hero map, alive: every few seconds it picks the next dot and shows its card (picture, kind, one line) as if
 * someone hovered it. Hovering or focusing a dot or the card holds the tour and shows that dot instead. The SVG and its
 * links stay server-rendered (children); this only adds the card and the highlight. The card always stays inside the
 * map box, so it never covers the key or the button under the map. With reduced motion the tour does not advance.
 *
 * `stops[i]` belongs to the i-th `a[data-tip]` in the SVG; `order` is the sequence the tour walks.
 */
export default function HomeMapTour({ stops, order, children }: { stops: TourStop[]; order: number[]; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLAnchorElement>(null);
  const [step, setStep] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [hold, setHold] = useState(false); // pointer or focus inside the map
  const [visible, setVisible] = useState(false); // on screen and tab visible
  const [still, setStill] = useState(false); // prefers-reduced-motion
  const [spot, setSpot] = useState<Spot | null>(null);

  const current = hovered ?? order[step % order.length];
  const stop = stops[current];
  const running = !hold && visible && !still;

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
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    const motion = () => setStill(mq.matches);
    motion();
    mq.addEventListener('change', motion);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', update);
      mq.removeEventListener('change', motion);
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

  // Measure the dot and the card (already rendered with the new stop's text), then place the card before paint.
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
    const c = card.current;
    // on phones the card docks under the map (position: relative in visual.css) and needs no placing
    if (!c || getComputedStyle(c).position !== 'absolute') return setSpot({ x, y, left: 0, top: 0 });
    setSpot({ x, y, ...placeCard(x, y, c.offsetWidth, c.offsetHeight, b.width, b.height) });
  }, [current]);

  // Place again whenever the map or the card changes size: the first measurement can come before the web font and the
  // picture have settled, and a card that then grows would creep over its dot.
  useLayoutEffect(() => {
    place();
    const ro = new ResizeObserver(() => place());
    if (box.current) ro.observe(box.current);
    if (card.current) ro.observe(card.current);
    return () => ro.disconnect();
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
      {spot && <span className="tour-ring" style={{ left: spot.x, top: spot.y, color: stop.color }} aria-hidden />}
      <Link
        ref={card}
        key={current}
        href={stop.href}
        className="tour-card"
        // hidden until the first measurement, so it never flashes in the wrong place
        style={{ left: spot?.left ?? 0, top: spot?.top ?? 0, visibility: spot ? undefined : 'hidden', ['--dot' as string]: stop.color }}
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
          {/* on phones the picture is too small for the credit, so it sits under the text instead */}
          <span className="tour-src">{stop.sat ? `© Copernicus Sentinel-2 · ${stop.sat.date}` : '© Esri, Maxar · date not given'}</span>
        </span>
        {hovered == null && !still && <span key={step} className={`tour-progress ${running ? '' : 'held'}`} style={{ animationDuration: `${STEP_MS}ms` }} aria-hidden />}
      </Link>
    </div>
  );
}
