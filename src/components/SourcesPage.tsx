import Link from 'next/link';
import registry from '../../data/sources/registry.json';
import state from '../../data/sources/state.json';
import changes from '../../data/sources/changes.json';
import type { LucideIcon } from 'lucide-react';
import { CalendarDays, ChevronDown, Coins, Database, Languages, Layers, Lock, Rocket, Skull, Users, Wifi } from 'lucide-react';
import { SiteMark } from '@/components/Covers';
import { Ext } from '@/components/Ext';
import { StatTile } from '@/components/Visual';
import { SOURCE_DESCRIPTIONS, SOURCES_TEXT } from '@/content/sourcesI18n';
import type { Lang } from '@/site/seo';

const TRACK_ICON: Record<string, LucideIcon> = { camps: Lock, population: Users, military: Rocket, economy: Coins, korean_japanese: Languages };
const BARE = ['/map', '/missiles'];

type Src = (typeof registry)[number] & { research?: { last_updated?: string | null; maintenance?: string; value?: number }; description?: string; format?: string; language?: string; publisher?: string; usedBy?: string[] };
type St = { status: number; ok: boolean; detail: string; checkedAt: string; changedAt: string | null; upstreamDate: string | null };
type Change = { id: string; at: string; kind: string; detail: string };
const ST = state as Record<string, St>;

/** Language prefix for internal links. /map and /missiles stay where they are. */
function localPath(lang: Lang, path: string): string {
  if (lang === 'en' || BARE.some((b) => path === b || path.startsWith(`${b}/`))) return path;
  if (path === '/') return `/${lang}`;
  return `/${lang}${path.startsWith('/') ? path : `/${path}`}`;
}

const RESEARCH_REPO = 'https://github.com/Ahmet-Dedeler/free-north-korea/tree/main/docs/research';

/** The sources page, shared by /sources, /ko/sources, /ja/sources and /zh/sources. */
export default function SourcesPage({ lang }: { lang: Lang }) {
  const t = SOURCES_TEXT[lang];
  const list = registry as Src[];
  const tracks = Object.keys(t.tracks);
  const used = list.filter((s) => (s.usedBy ?? []).length);
  const up = list.filter((s) => ST[s.id]?.ok).length;
  const lastCheck = Object.values(ST)
    .map((s) => s.checkedAt)
    .sort()
    .at(-1)
    ?.slice(0, 10);
  const dated = Boolean(list[0]?.research);

  function watchLabel(s: St | undefined) {
    if (!s) return { cls: 'unknown', text: t.watch.notChecked };
    if (s.ok) return { cls: 'up', text: t.watch.up };
    if (s.status === 404 || s.status === 410) return { cls: 'dead', text: t.watch.gone };
    if ([401, 403, 406, 429].includes(s.status)) return { cls: 'blocked', text: t.watch.blocked };
    return { cls: 'dead', text: s.status ? t.watch.error(s.status) : t.watch.unreachable };
  }

  return (
    <div className="wide">
      <p className="eyebrow">{t.eyebrow}</p>
      <h1>{t.h1}</h1>
      <p className="lede">{t.lede(list.length)}</p>
      <div className="tiles">
        <StatTile icon={Database} value={list.length} label={t.tiles.tracked} />
        <StatTile icon={Layers} value={used.length} label={t.tiles.used} tone="ok" />
        <StatTile icon={Wifi} value={up} label={t.tiles.up} note={lastCheck} />
        <StatTile icon={Skull} value={list.filter((s) => ['stale', 'dead'].includes(s.research?.maintenance ?? '')).length} label={t.tiles.stale} note={t.tiles.rebuild} tone="danger" />
      </div>

      {(changes as Change[]).length > 0 && (
        <section>
          <h2>{t.changes}</h2>
          <ul className="change-feed">
            {(changes as Change[]).slice(0, 12).map((c, i) => {
              const src = list.find((s) => s.id === c.id);
              return (
                <li key={i}>
                  {src ? <SiteMark url={src.url} size={28} /> : <span />}
                  <span>
                    <b lang="en">{src?.name ?? c.id}</b> <span className={`chg chg-${c.kind}`}>{t.kinds[c.kind] ?? c.kind}</span>
                    <small lang="en">{c.detail}</small>
                  </span>
                  <time>{c.at.slice(0, 10)}</time>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {tracks.map((track, i) => {
        const inTrack = list.filter((s) => s.track === track);
        const Icon = TRACK_ICON[track] ?? Layers;
        const counts = (['active', 'sporadic', 'stale', 'dead', 'unknown'] as const).map((m) => [m, inTrack.filter((s) => (s.research?.maintenance ?? 'unknown') === m).length] as const);
        return (
          <details key={track} id={track} className="src-group" open={i === 0}>
            <summary>
              <span className="sg-icon">
                <Icon size={20} />
              </span>
              <span className="sg-title">
                <b>{t.tracks[track]}</b>
                <small>{t.count(inTrack.length)}</small>
              </span>
              <span className="sg-bar" aria-label={t.maintAria}>
                {counts.map(([m, n]) => (n ? <i key={m} className={`maint-bg-${m}`} style={{ flex: n }} title={`${t.maint[m]}: ${n}`} /> : null))}
              </span>
              <ChevronDown size={18} className="sg-chev" />
            </summary>
            <ul className="src-cards">
              {inTrack.map((s) => {
                const st = ST[s.id];
                const w = watchLabel(st);
                const overlay = lang === 'en' ? undefined : SOURCE_DESCRIPTIONS[s.id]?.[lang];
                const desc = overlay ?? s.description;
                const maint = s.research?.maintenance ?? 'unknown';
                return (
                  <li key={s.id}>
                    <SiteMark url={s.url} size={36} />
                    <div className="src-main">
                      <Ext href={s.url} className="src-name" lang="en">
                        {s.name}
                      </Ext>
                      <small lang="en">
                        {s.publisher}
                        {s.language && s.language !== 'en' ? ` · ${s.language.toUpperCase()}` : ''}
                      </small>
                      {desc ? <p lang={overlay ? undefined : 'en'}>{desc}</p> : null}
                      <span className="src-tags">
                        <span lang="en">{s.format}</span>
                        <span>
                          <CalendarDays size={11} /> {st?.upstreamDate ?? s.research?.last_updated ?? t.noDate}
                        </span>
                        <span className={`maint maint-${maint}`}>{t.maint[maint] ?? maint}</span>
                        <span className={`watch watch-${w.cls}`} title={st?.detail}>
                          {w.text}
                        </span>
                        {(s.usedBy ?? []).map((u) => {
                          const href = localPath(lang, u);
                          return (
                            <Link key={u} href={href} className="used">
                              {t.usedOn(href)}
                            </Link>
                          );
                        })}
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
        {t.noteBefore(dated)}
        <Ext href={RESEARCH_REPO}>{t.noteLink}</Ext>
        {t.noteAfter}
      </p>
    </div>
  );
}
