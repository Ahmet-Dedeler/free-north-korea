/**
 * Small building blocks for content pages, so facts show as tiles, chips and cards instead of paragraphs.
 * All server components; hover effects are CSS only.
 */
import type { LucideIcon } from 'lucide-react';
import {
  Baby,
  Factory,
  Footprints,
  Hammer,
  Mountain,
  Pickaxe,
  Shirt,
  ShieldAlert,
  Sprout,
  User,
  Users,
  Wheat,
} from 'lucide-react';
import { hostLabel } from '@/content/media';
import { SiteMark } from './Covers';

export function StatTile({ icon: Icon, value, label, note, tone }: { icon?: LucideIcon; value: React.ReactNode; label: string; note?: string; tone?: 'danger' | 'warn' | 'ok' }) {
  return (
    <div className={`tile ${tone ?? ''}`}>
      {Icon && <Icon className="tile-icon" size={18} aria-hidden="true" />}
      <b>{value}</b>
      <span>{label}</span>
      {note && <small>{note}</small>}
    </div>
  );
}

/** Pick an icon for a free-text label by keyword. Falls back to `fallback`. */
export function iconFor(label: string, fallback: LucideIcon): LucideIcon {
  const l = label.toLowerCase();
  const table: [RegExp, LucideIcon][] = [
    [/gold|coal|rock|mining|mine|limestone/, Pickaxe],
    [/farm|agricult/, Wheat],
    [/construct|cement/, Hammer],
    [/sew|cloth|uniform|shoe/, Shirt],
    [/manufactur|factory|production/, Factory],
    [/logging|timber|forest/, Mountain],
    [/women|men$|^men|civilian|offender|short term/, User],
    [/political/, ShieldAlert],
    [/border|repatriat/, Footprints],
    [/child/, Baby],
    [/model/, Sprout],
  ];
  return table.find(([re]) => re.test(l))?.[1] ?? fallback;
}

export function ChipRow({ items, fallback = Users, tone }: { items: string[]; fallback?: LucideIcon; tone?: string }) {
  return (
    <ul className={`ichips ${tone ?? ''}`}>
      {items.map((it) => {
        const Icon = iconFor(it, fallback);
        return (
          <li key={it}>
            <Icon size={15} aria-hidden="true" />
            {it}
          </li>
        );
      })}
    </ul>
  );
}

/** Three-step "how sure are we" bar: satellite imagery only → listed in NGO reports → survivor testimony. */
export function EvidenceMeter({ level }: { level?: 'imagery' | 'reports' | 'testimony' }) {
  const steps = [
    { id: 'imagery', label: 'Satellite imagery' },
    { id: 'reports', label: 'Listed by NKDB / KINU' },
    { id: 'testimony', label: 'Survivor testimony' },
  ] as const;
  const at = level ? steps.findIndex((s) => s.id === level) : 2;
  return (
    <ol className="evidence" aria-label="How well documented this site is">
      {steps.map((s, i) => (
        <li key={s.id} className={i <= at ? 'on' : ''}>
          <span />
          {s.label}
        </li>
      ))}
    </ol>
  );
}

/** Sources as cards with the publisher's mark, instead of a bare link list. */
export function SourceCards({ sources }: { sources: { name: string; url: string; note?: string }[] }) {
  return (
    <ul className="source-cards">
      {sources.map((s) => (
        <li key={s.url + s.name}>
          <a href={s.url} target="_blank" rel="noopener noreferrer">
            <SiteMark url={s.url} size={32} />
            <span>
              <strong>{s.name}</strong>
              <small>{s.note ?? hostLabel(s.url)} ↗</small>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Findings the UN Commission of Inquiry (2014) made about the political prison camps. */
export const COI_CRIMES = ['Extermination', 'Murder', 'Enslavement', 'Torture', 'Imprisonment', 'Rape', 'Forced abortion', 'Persecution', 'Enforced disappearance'];
/** What people in kyohwaso are typically sentenced for (same list the camp pages already cite). */
export const KYOHWASO_OFFENCES = ['Illegal trading', 'Smuggling across the border', 'Watching foreign media', 'Trying to escape to China'];

