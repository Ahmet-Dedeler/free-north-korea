import Link from 'next/link';
import registry from '../../../data/sources/registry.json';
import state from '../../../data/sources/state.json';
import changes from '../../../data/sources/changes.json';
import { pageMeta } from '@/site/seo';
import type { LucideIcon } from 'lucide-react';
import { CalendarDays, ChevronDown, Coins, Database, Languages, Layers, Lock, Rocket, Skull, Users, Wifi } from 'lucide-react';
import { SiteMark } from '@/components/Covers';
import { StatTile } from '@/components/Visual';

const TRACK_ICON: Record<string, LucideIcon> = { camps: Lock, population: Users, military: Rocket, economy: Coins, korean_japanese: Languages };

export const metadata = pageMeta({
  title: 'North Korea Data Sources: What Exists and What Is Maintained',
  description:
    'Every public dataset on North Korea we found: camps, detention, population, military, economy, sanctions, Korean and Japanese sources. Who maintains each one, when it last changed, and which are dead.',
  path: '/sources',
});

type Src = (typeof registry)[number] & { research?: { last_updated?: string | null; maintenance?: string; value?: number } };
type St = { status: number; ok: boolean; detail: string; checkedAt: string; changedAt: string | null; upstreamDate: string | null };
const ST = state as Record<string, St>;

const TRACKS: Record<string, string> = {
  camps: 'Camps, prisons & abuses',
  population: 'People, regions & living conditions',
  military: 'Military, nuclear & missiles',
  economy: 'Economy, trade & sanctions',
  korean_japanese: 'Korean & Japanese sources',
};
const MAINT: Record<string, string> = { active: 'Active', sporadic: 'Sporadic', stale: 'Stale', dead: 'Dead', unknown: 'Unknown' };

function watchLabel(s: St | undefined) {
  if (!s) return { cls: 'unknown', text: 'Not checked' };
  if (s.ok) return { cls: 'up', text: 'Up' };
  if (s.status === 404 || s.status === 410) return { cls: 'dead', text: 'Gone (404)' };
  if ([401, 403, 406, 429].includes(s.status)) return { cls: 'blocked', text: 'Blocks bots' };
  return { cls: 'dead', text: s.status ? `Error ${s.status}` : 'Unreachable' };
}

export default function Sources() {
  const list = registry as Src[];
  const tracks = Object.keys(TRACKS);
  const used = list.filter((s) => (s.usedBy ?? []).length);
  const up = list.filter((s) => ST[s.id]?.ok).length;
  const lastCheck = Object.values(ST)
    .map((s) => s.checkedAt)
    .sort()
    .at(-1)
    ?.slice(0, 10);
  return (
    <div className="wide">
      <p className="eyebrow">Sources</p>
      <h1>Every North Korea dataset we know of</h1>
      <p className="lede">
        {list.length} public sources, in English, Korean and Japanese. A lot of the best intel on North Korea is raw, abandoned, or only in Korean. This
        is the list of what exists, who maintains it, and whether it still works. We check every source weekly and log what changed.
      </p>
      <div className="tiles">
        <StatTile icon={Database} value={list.length} label="sources tracked" />
        <StatTile icon={Layers} value={used.length} label="feed this site" tone="ok" />
        <StatTile icon={Wifi} value={up} label="reachable on the last check" note={lastCheck} />
        <StatTile icon={Skull} value={list.filter((s) => ['stale', 'dead'].includes(s.research?.maintenance ?? '')).length} label="stale or abandoned" note="what we should rebuild" tone="danger" />
      </div>

      {(changes as { id: string; at: string; kind: string; detail: string }[]).length > 0 && (
        <section>
          <h2>Recent changes</h2>
          <ul className="change-feed">
            {(changes as { id: string; at: string; kind: string; detail: string }[]).slice(0, 12).map((c, i) => {
              const src = list.find((s) => s.id === c.id);
              return (
                <li key={i}>
                  {src ? <SiteMark url={src.url} size={28} /> : <span />}
                  <span>
                    <b>{src?.name ?? c.id}</b> <span className={`chg chg-${c.kind}`}>{c.kind}</span>
                    <small>{c.detail}</small>
                  </span>
                  <time>{c.at.slice(0, 10)}</time>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {tracks.map((t, i) => {
        const inTrack = list.filter((s) => s.track === t);
        const Icon = TRACK_ICON[t];
        const counts = (['active', 'sporadic', 'stale', 'dead', 'unknown'] as const).map((m) => [m, inTrack.filter((s) => (s.research?.maintenance ?? 'unknown') === m).length] as const);
        return (
          <details key={t} id={t} className="src-group" open={i === 0}>
            <summary>
              <span className="sg-icon">
                <Icon size={20} />
              </span>
              <span className="sg-title">
                <b>{TRACKS[t]}</b>
                <small>{inTrack.length} sources</small>
              </span>
              <span className="sg-bar" aria-label="Maintenance status">
                {counts.map(([m, n]) => (n ? <i key={m} className={`maint-bg-${m}`} style={{ flex: n }} title={`${MAINT[m]}: ${n}`} /> : null))}
              </span>
              <ChevronDown size={18} className="sg-chev" />
            </summary>
            <ul className="src-cards">
              {inTrack.map((s) => {
                const st = ST[s.id];
                const w = watchLabel(st);
                return (
                  <li key={s.id}>
                    <SiteMark url={s.url} size={36} />
                    <div className="src-main">
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="src-name">
                        {s.name}
                      </a>
                      <small>
                        {s.publisher}
                        {s.language && s.language !== 'en' ? ` · ${s.language.toUpperCase()}` : ''}
                      </small>
                      <p>{s.description}</p>
                      <span className="src-tags">
                        <span>{s.format}</span>
                        <span>
                          <CalendarDays size={11} /> {st?.upstreamDate ?? s.research?.last_updated ?? '—'}
                        </span>
                        <span className={`maint maint-${s.research?.maintenance ?? 'unknown'}`}>{MAINT[s.research?.maintenance ?? 'unknown']}</span>
                        <span className={`watch watch-${w.cls}`} title={st?.detail}>
                          {w.text}
                        </span>
                        {(s.usedBy ?? []).map((u: string) => (
                          <Link key={u} href={u} className="used">
                            used on {u}
                          </Link>
                        ))}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </details>
        );
      })}
      <p className="muted">
        “Maintained” is our research assessment from {list[0]?.research ? 'October 2026' : 'research'}; “Link” is the weekly automated check. Raw
        research notes, scrapers and probe scripts are in the{' '}
        <a href="https://github.com/Ahmet-Dedeler/free-north-korea/tree/main/docs/research">repository</a>.
      </p>
    </div>
  );
}
