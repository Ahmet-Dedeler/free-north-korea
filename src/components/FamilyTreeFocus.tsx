'use client';

import { useEffect, useRef, useState } from 'react';

/** The three leaders, in order. Used by the "ruling line" toggle. */
const RULING_LINE = ['kim-il-sung', 'kim-jong-il', 'kim-jong-un'];

/**
 * Interactivity for <FamilyTree>: highlight a person's direct relatives on hover/focus, a "ruling line" toggle,
 * and deep links (/kim-family-tree#kim-jong-un scrolls to and highlights that person).
 * The tree itself is server-rendered; this only toggles classes on it.
 */
export default function FamilyTreeFocus({ children }: { children: React.ReactNode }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [focus, setFocus] = useState<string | null>(null);
  const [line, setLine] = useState(false);

  useEffect(() => {
    const root = scroller.current;
    if (!root) return;
    const on = new Set<string>();
    if (line) RULING_LINE.forEach((id) => on.add(id));
    else if (focus) {
      on.add(focus);
      root.querySelector<HTMLElement>(`[data-node="${focus}"]`)?.dataset.related?.split(' ').forEach((id) => on.add(id));
    }
    root.classList.toggle('has-focus', on.size > 0);
    root.querySelectorAll<HTMLElement>('[data-node]').forEach((el) => {
      el.classList.toggle('on', on.has(el.dataset.node!));
      el.classList.toggle('is-focus', el.dataset.node === focus);
    });
    root.querySelectorAll<SVGPathElement>('.ftree-edge').forEach((el) => {
      const ids = el.dataset.ids!.split(' ');
      // ruling line: only parent-child edges between two leaders; focus: any edge touching the person
      const hit = line ? el.classList.contains('child') && RULING_LINE.filter((id) => ids.includes(id)).length >= 2 : focus ? ids.includes(focus) : false;
      el.classList.toggle('on', hit);
      // child lines share a bus, so draw highlighted ones last to keep them on top (this subtree never re-renders)
      if (hit) el.parentNode?.appendChild(el);
    });
  }, [focus, line]);

  // deep link, otherwise start scrolled to the current leader (the tree is wider than most screens)
  useEffect(() => {
    const root = scroller.current;
    if (!root) return;
    const want = decodeURIComponent(location.hash.slice(1));
    const target = root.querySelector<HTMLElement>(`[data-node="${want}"]`) ?? root.querySelector<HTMLElement>('[data-node="kim-jong-un"]');
    if (target) root.scrollLeft = target.offsetLeft - root.clientWidth / 2 + target.offsetWidth / 2;
    if (want && target?.dataset.node === want) setFocus(want);
  }, []);

  const pick = (e: React.SyntheticEvent) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-node]');
    if (el) {
      setLine(false);
      setFocus(el.dataset.node!);
    }
  };

  return (
    <div className="ftree">
      <div className="ftree-tools">
        <button type="button" className={`ftree-toggle ${line ? 'active' : ''}`} aria-pressed={line} onClick={() => setLine((v) => !v)}>
          Show the ruling line
        </button>
        <span className="muted">Hover a person to see their parents, partners, children and siblings. Click for the full profile.</span>
      </div>
      <div className="ftree-scroll" ref={scroller} onMouseOver={pick} onFocus={pick} onMouseLeave={() => setFocus(null)}>
        {children}
      </div>
      <ul className="ftree-legend">
        <li>
          <i className="lg-ruler" /> Supreme Leader
        </li>
        <li>
          <i className="lg-dead" /> Dead
        </li>
        <li>
          <i className="lg-marriage" /> Partners
        </li>
        <li>
          <i className="lg-child" /> Children
        </li>
        <li>
          <i className="lg-ghost" /> Other parent not in our data
        </li>
      </ul>
    </div>
  );
}
