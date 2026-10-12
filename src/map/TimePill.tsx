"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";

/**
 * The one time control on the map, bottom centre, shown while an overlay with a time axis is on (night lights now,
 * radar months later). A play button that steps once a second and stops at the end, the year in big figures, and a
 * strip of ticks dragged like the photo scrubber in Photo.tsx: a transparent range input lies over the ticks, so
 * touch, mouse and keyboard all work.
 */
/**
 * `head` is the overlay's own legend (key, name, source, a button to turn it off), so the time control and the key of
 * what it moves through are one card instead of two floating boxes.
 */
export default function TimePill({
  steps,
  value,
  onChange,
  label,
  playLabel,
  pauseLabel,
  head,
}: {
  steps: number[];
  value: number;
  onChange: (v: number) => void;
  label: string;
  playLabel: string;
  pauseLabel: string;
  head?: {
    keyNode: ReactNode;
    title: string;
    sub: string;
    onClose: () => void;
    closeLabel: string;
  };
}) {
  const [playing, setPlaying] = useState(false);
  const at = Math.max(0, steps.indexOf(value));

  useEffect(() => {
    if (!playing) return;
    if (at >= steps.length - 1) return void setPlaying(false);
    const t = setTimeout(() => onChange(steps[at + 1]), 1000);
    return () => clearTimeout(t);
  }, [playing, at, steps, onChange]);

  return (
    <div
      className="tp"
      role="group"
      aria-label={head ? `${head.title}: ${label}` : label}
    >
      {head && (
        <div className="tp-head">
          {head.keyNode}
          <span className="tp-title">
            {head.title} <small>{head.sub}</small>
          </span>
          <button
            type="button"
            className="tp-close"
            onClick={head.onClose}
            aria-label={head.closeLabel}
            title={head.closeLabel}
          >
            ✕
          </button>
        </div>
      )}
      <div className="tp-row">
        <button
          type="button"
          className="tp-play"
          aria-label={playing ? pauseLabel : playLabel}
          title={playing ? pauseLabel : playLabel}
          onClick={() => {
            // play from the start when sitting on the last step
            if (!playing && at >= steps.length - 1) onChange(steps[0]);
            setPlaying((p) => !p);
          }}
        >
          {playing ? (
            <Pause size={16} aria-hidden="true" />
          ) : (
            <Play size={16} aria-hidden="true" />
          )}
        </button>
        <b className="tp-label">{value}</b>
        <div className="tp-scrub">
          <div className="tp-ticks" aria-hidden="true">
            {steps.map((s, i) => (
              <i key={s} className={i === at ? "on" : ""} />
            ))}
          </div>
          <div className="tp-ends" aria-hidden="true">
            <span>{steps[0]}</span>
            <span>{steps.at(-1)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={steps.length - 1}
            value={at}
            aria-label={label}
            aria-valuetext={String(value)}
            onChange={(e) => {
              setPlaying(false);
              onChange(steps[Number(e.target.value)]);
            }}
          />
        </div>
      </div>
    </div>
  );
}
