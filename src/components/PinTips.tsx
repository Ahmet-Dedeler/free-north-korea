'use client';

import { useRef, useState, type ReactNode } from 'react';

/**
 * Hover cards for the linked dots of a Locator inside it: each `a[data-tip]` ("name|kind") shows a small card above
 * the dot while hovered or focused. The SVG stays server-rendered; this only adds the card.
 */
export default function PinTips({ children }: { children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<{ name: string; kind: string; x: number; y: number } | null>(null);
  const show = (t: EventTarget) => {
    const a = (t as Element).closest?.('a[data-tip]') as HTMLElement | null;
    if (!a || !box.current) return setTip(null);
    const r = a.getBoundingClientRect();
    const b = box.current.getBoundingClientRect();
    const [name, kind] = (a.dataset.tip ?? '').split('|');
    setTip({ name, kind, x: r.left + r.width / 2 - b.left, y: r.top - b.top });
  };
  return (
    <div
      ref={box}
      className="pin-tips"
      onPointerOver={(e) => show(e.target)}
      onPointerLeave={() => setTip(null)}
      onFocus={(e) => show(e.target)}
      onBlur={() => setTip(null)}
    >
      {children}
      {tip && (
        <span className="pin-tip" style={{ left: tip.x, top: tip.y }} role="presentation">
          <b>{tip.name}</b>
          {tip.kind && <small>{tip.kind}</small>}
        </span>
      )}
    </div>
  );
}
