'use client';

import { useMemo, useRef, useState } from 'react';
import type { Test } from './data';
import { type ColorBy, OUTCOMES, TYPES } from './meta';

interface Props {
  tests: Test[]; // filtered by everything EXCEPT year, so the bars give context
  minYear: number;
  maxYear: number;
  range: [number, number];
  colorBy: ColorBy;
  onChange: (range: [number, number]) => void;
}

/**
 * Stacked yearly histogram that doubles as a range picker.
 * Click a bar to pick one year, drag across bars to pick a span.
 */
export default function Timeline({ tests, minYear, maxYear, range, colorBy, onChange }: Props) {
  const years = useMemo(() => Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i), [minYear, maxYear]);
  const groups = colorBy === 'type' ? TYPES : OUTCOMES;

  const bins = useMemo(() => {
    const m = new Map<number, Record<string, number>>();
    years.forEach((y) => m.set(y, {}));
    for (const t of tests) {
      const key = colorBy === 'type' ? t.missile.type : t.outcome;
      const b = m.get(t.year)!;
      b[key] = (b[key] ?? 0) + 1;
    }
    return m;
  }, [tests, years, colorBy]);

  const max = Math.max(1, ...[...bins.values()].map((b) => Object.values(b).reduce((a, c) => a + c, 0)));

  const ref = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);

  const yearAt = (clientX: number) => {
    const r = ref.current!.getBoundingClientRect();
    const i = Math.floor(((clientX - r.left) / r.width) * years.length);
    return years[Math.max(0, Math.min(years.length - 1, i))];
  };

  const isAll = range[0] === minYear && range[1] === maxYear;
  const hoverTotal = hover !== null ? Object.values(bins.get(hover)!).reduce((a, c) => a + c, 0) : 0;
  const label = isAll ? `All years · ${minYear}–${maxYear}` : range[0] === range[1] ? `${range[0]}` : `${range[0]}–${range[1]}`;

  return (
    <div className="timeline">
      <div className="timeline-head">
        <span className="timeline-label">{label}</span>
        {hover !== null && (
          <span className="timeline-hover">
            {hover}: {hoverTotal} test{hoverTotal === 1 ? '' : 's'}
          </span>
        )}
        <span className="spacer" />
        {!isAll && (
          <button className="link" onClick={() => onChange([minYear, maxYear])}>
            Show all years
          </button>
        )}
        <span className="timeline-tip">Click a year or drag to select a range</span>
      </div>
      <div
        ref={ref}
        className="bars"
        onPointerDown={(e) => {
          (e.target as Element).setPointerCapture?.(e.pointerId);
          const y = yearAt(e.clientX);
          setDrag(y);
          onChange([y, y]);
        }}
        onPointerMove={(e) => {
          const y = yearAt(e.clientX);
          setHover(y);
          if (drag !== null) onChange([Math.min(drag, y), Math.max(drag, y)]);
        }}
        onPointerUp={() => setDrag(null)}
        onPointerLeave={() => setHover(null)}
      >
        {years.map((y) => {
          const b = bins.get(y)!;
          const inRange = y >= range[0] && y <= range[1];
          return (
            <div key={y} className={`bar ${inRange ? 'on' : 'off'} ${hover === y ? 'hover' : ''}`}>
              <div className="stack">
                {groups.map((g) =>
                  b[g.id] ? <div key={g.id} style={{ height: `${(b[g.id] / max) * 100}%`, background: g.color }} /> : null,
                )}
              </div>
              <span className="year">{y % 5 === 0 || y === maxYear || y === minYear ? `'${String(y).slice(2)}` : ''}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
