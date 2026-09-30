import type { Test } from './data';
import { OUTCOME_COLOR, OUTCOME_LABEL, TYPES, TYPE_COLOR, formatDate, km } from './meta';

interface Props {
  test: Test;
  onClose: () => void;
  onPrev: (() => void) | null;
  onNext: (() => void) | null;
}

/**
 * Side view of the flight: range on the x axis, altitude on the y axis, both
 * drawn to the same scale (1 km = 1 km) so lofted shots look as tall as they are.
 * Tall lofted ICBMs get a compressed y axis, which is called out on the chart.
 */
function Profile({ test }: { test: Test }) {
  const d = test.distanceKm;
  const a = test.apogeeKm;
  if (!d || !a) return null;

  const W = 320;
  const H = 120;
  const pad = { l: 8, r: 8, t: 22, b: 20 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  // fit whichever dimension is larger, keep true proportions when we can
  const scale = Math.min(iw / d, ih / a);
  const trueScale = scale * a <= ih && scale * d <= iw;
  const w = d * scale;
  const h = a * scale;
  const squashed = h < 12 && a > 0; // a flat trajectory would be invisible; exaggerate
  const hh = squashed ? Math.min(ih, 24) : h;
  const x0 = pad.l + (iw - w) / 2;
  const y0 = pad.t + ih;
  const color = TYPE_COLOR[test.missile.type];
  const path = `M${x0},${y0} Q${x0 + w / 2},${y0 - hh * 2} ${x0 + w},${y0}`;

  return (
    <figure className="profile">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Trajectory: ${a} km high, ${d} km long`}>
        <line x1={pad.l} x2={W - pad.r} y1={y0} y2={y0} className="ground" />
        <path d={path} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
        <line x1={x0 + w / 2} x2={x0 + w / 2} y1={y0} y2={y0 - hh} className="guide" />
        <text x={x0 + w / 2} y={y0 - hh - 6} textAnchor="middle" className="lbl">
          {km(a)} up
        </text>
        <text x={x0 + w / 2} y={y0 + 14} textAnchor="middle" className="lbl">
          {km(d)} downrange
        </text>
        <circle cx={x0} cy={y0} r={3} className="site-dot" />
        <circle
          cx={x0 + w}
          cy={y0}
          r={3.5}
          className={test.outcome === 'failure' ? 'hollow' : undefined}
          fill={test.outcome === 'failure' ? undefined : color}
          stroke={color}
          strokeWidth={1.5}
        />
      </svg>
      <figcaption>
        Side view{trueScale && !squashed ? ', drawn to scale' : squashed ? ', height exaggerated' : ''}
        {a > d * 0.8 && ' · lofted shot: fired steeply up so it splashes down close by'}
      </figcaption>
    </figure>
  );
}

export default function Detail({ test, onClose, onPrev, onNext }: Props) {
  const type = TYPES.find((t) => t.id === test.missile.type)!;
  const salvo = test.seriesSize > 1 ? `Launch ${test.series ?? '?'} of ${test.seriesSize} that day` : null;
  // Some rows only say "2 of 3". That's already covered by the salvo line.
  const desc = /^\d+ of \d+$/.test(test.description.trim()) ? null : test.description;

  return (
    <aside className="detail" aria-label="Test details">
      <header>
        <div className="detail-nav">
          <button onClick={onPrev ?? undefined} disabled={!onPrev} title="Older test (←)">
            ←
          </button>
          <button onClick={onNext ?? undefined} disabled={!onNext} title="Newer test (→)">
            →
          </button>
          <span className="spacer" />
          <button onClick={onClose} title="Close (Esc)" aria-label="Close">
            ✕
          </button>
        </div>
        <p className="detail-date">
          {formatDate(test.date, { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
          {test.time && ` · ${test.time}`}
        </p>
        <h2>{test.missile.name}</h2>
        <div className="badges">
          <span className="badge" style={{ background: type.color }} title={type.hint}>
            {type.label}
          </span>
          <span className="badge outline" style={{ color: OUTCOME_COLOR[test.outcome], borderColor: OUTCOME_COLOR[test.outcome] }}>
            {OUTCOME_LABEL[test.outcome]}
          </span>
          {test.missile.maneuver && (
            <span className="badge outline muted">{test.missile.maneuver === 'glide' ? 'Glide / maneuvering' : 'Pull-up maneuver'}</span>
          )}
        </div>
        <p className="type-hint">{type.hint}</p>
      </header>

      <dl className="facts">
        <div>
          <dt>Launched from</dt>
          <dd>{test.facility.id === 'unknown' ? 'Unknown site' : test.facility.name}</dd>
        </div>
        <div>
          <dt>Came down in</dt>
          <dd>{test.landingRegion ?? 'Unknown'}</dd>
        </div>
        <div>
          <dt>Distance flown</dt>
          <dd>{km(test.distanceKm)}</dd>
        </div>
        <div>
          <dt>Max altitude</dt>
          <dd>{km(test.apogeeKm)}</dd>
        </div>
      </dl>

      <Profile test={test} />

      {!test.path && <p className="note">The distance flown isn't public, so this test has no flight path on the map.</p>}
      {salvo && <p className="note">{salvo}</p>}
      {desc && <p className="desc">{desc}</p>}
    </aside>
  );
}
