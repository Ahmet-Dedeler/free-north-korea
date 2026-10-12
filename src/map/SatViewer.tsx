'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Minus, Plus, X } from 'lucide-react';

const MAX = 8;

/**
 * Full-screen viewer for a satellite image, like a photo viewer in Google Maps: scroll or pinch to zoom around the
 * pointer, drag to pan, double-click to zoom in, arrow keys step through months (`onStep`), Esc closes. The zoom is
 * kept while stepping, so the same spot can be compared across months. Past 4× the real pixels show (no smoothing),
 * so nobody mistakes the blur of a 10 m image for detail.
 */
export default function SatViewer({ src, alt, caption, footer, labels, onStep, onClose }: { src: string; alt: string; caption: ReactNode; footer?: ReactNode; labels: { close: string; zoomIn: string; zoomOut: string }; onStep?: (by: number) => void; onClose: () => void }) {
  const stage = useRef<HTMLDivElement>(null);
  const [view, setView] = useState({ s: 1, x: 0, y: 0 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ d: number; s: number } | null>(null);

  /** Zoom to scale `to` keeping the point (px, py), relative to the stage centre, where it is. */
  const zoomAt = useCallback((to: number, px = 0, py = 0) => {
    setView((v) => {
      const s = Math.min(MAX, Math.max(1, to));
      if (s === 1) return { s: 1, x: 0, y: 0 };
      const k = s / v.s;
      return { s, x: px - (px - v.x) * k, y: py - (py - v.y) * k };
    });
  }, []);
  const rel = (e: { clientX: number; clientY: number }) => {
    const r = stage.current!.getBoundingClientRect();
    return [e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2] as const;
  };

  // wheel zoom needs a non-passive listener to stop the page from scrolling
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const [px, py] = rel(e);
      setView((v) => {
        const s = Math.min(MAX, Math.max(1, v.s * Math.exp(-e.deltaY * 0.0022)));
        if (s === 1) return { s: 1, x: 0, y: 0 };
        const k = s / v.s;
        return { s, x: px - (px - v.x) * k, y: py - (py - v.y) * k };
      });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === '+' || e.key === '=') zoomAt(view.s * 1.5);
      else if (e.key === '-') zoomAt(view.s / 1.5);
      else if (e.key === 'ArrowLeft') onStep?.(-1);
      else if (e.key === 'ArrowRight') onStep?.(1);
    };
    addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose, onStep, zoomAt, view.s]);

  return createPortal(
    <div className="sv" role="dialog" aria-modal="true" aria-label={alt}>
      <div
        ref={stage}
        className={`sv-stage ${view.s > 1 ? 'zoomed' : ''}`}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
          if (pointers.current.size === 2) {
            const [a, b] = [...pointers.current.values()];
            pinch.current = { d: Math.hypot(a.x - b.x, a.y - b.y), s: view.s };
          }
        }}
        onPointerMove={(e) => {
          const prev = pointers.current.get(e.pointerId);
          if (!prev) return;
          pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
          if (pointers.current.size === 2 && pinch.current) {
            const [a, b] = [...pointers.current.values()];
            const [px, py] = rel({ clientX: (a.x + b.x) / 2, clientY: (a.y + b.y) / 2 });
            zoomAt((pinch.current.s * Math.hypot(a.x - b.x, a.y - b.y)) / pinch.current.d, px, py);
          } else if (pointers.current.size === 1) {
            setView((v) => (v.s === 1 ? v : { ...v, x: v.x + e.clientX - prev.x, y: v.y + e.clientY - prev.y }));
          }
        }}
        onPointerUp={(e) => {
          pointers.current.delete(e.pointerId);
          if (pointers.current.size < 2) pinch.current = null;
        }}
        onPointerCancel={(e) => pointers.current.delete(e.pointerId)}
        onDoubleClick={(e) => {
          const [px, py] = rel(e);
          zoomAt(view.s >= 3 ? 1 : view.s * 2.5, px, py);
        }}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          className={view.s >= 4 ? 'raw' : ''}
          style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.s})` }}
        />
      </div>
      <div className="sv-top">
        <span className="sv-cap">{caption}</span>
        <button type="button" className="sv-btn" onClick={onClose} aria-label={labels.close} title={labels.close}>
          <X size={18} />
        </button>
      </div>
      <div className="sv-zoom">
        <button type="button" className="sv-btn" onClick={() => zoomAt(view.s * 1.6)} aria-label={labels.zoomIn} title={labels.zoomIn} disabled={view.s >= MAX}>
          <Plus size={18} />
        </button>
        <button type="button" className="sv-btn" onClick={() => zoomAt(view.s / 1.6)} aria-label={labels.zoomOut} title={labels.zoomOut} disabled={view.s <= 1}>
          <Minus size={18} />
        </button>
      </div>
      {footer && <div className="sv-foot">{footer}</div>}
    </div>,
    document.body,
  );
}
