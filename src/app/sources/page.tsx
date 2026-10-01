import Link from 'next/link';
import registry from '../../../data/sources/registry.json';
import state from '../../../data/sources/state.json';
import changes from '../../../data/sources/changes.json';
import { pageMeta } from '@/site/seo';

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
      <div className="stat-row compact">
        <div className="stat">
          <b>{list.length}</b>
          <span>sources tracked</span>
        </div>
        <div className="stat">
          <b>{used.length}</b>
          <span>feed this site</span>
        </div>
        <div className="stat">
          <b>{up}</b>
          <span>reachable on the last check</span>
          <small>{lastCheck}</small>
        </div>
        <div className="stat">
          <b>{list.filter((s) => ['stale', 'dead'].includes(s.research?.maintenance ?? '')).length}</b>
          <span>stale or abandoned</span>
          <small>what we should rebuild</small>
        </div>
      </div>

      {(changes as { id: string; at: string; kind: string; detail: string }[]).length > 0 && (
        <section>
          <h2>Recent changes</h2>
          <ul className="claims">
            {(changes as { id: string; at: string; kind: string; detail: string }[]).slice(0, 15).map((c, i) => (
              <li key={i}>
                <span className="when">{c.at.slice(0, 10)}</span> <b>{list.find((s) => s.id === c.id)?.name ?? c.id}</b> {c.kind}: {c.detail}
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav className="chips tabs" aria-label="Topics">
        {tracks.map((t) => (
          <a key={t} className="chip" href={`#${t}`}>
            {TRACKS[t]} <small>{list.filter((s) => s.track === t).length}</small>
          </a>
        ))}
      </nav>

      {tracks.map((t) => (
        <section key={t} id={t} className="shelf">
          <h2>{TRACKS[t]}</h2>
          <div className="table-wrap">
            <table className="src-table">
              <thead>
                <tr>
                  <th>Source</th>
                  <th>Format</th>
                  <th>Last updated</th>
                  <th>Maintained</th>
                  <th>Link</th>
                </tr>
              </thead>
              <tbody>
                {list
                  .filter((s) => s.track === t)
                  .map((s) => {
                    const st = ST[s.id];
                    const w = watchLabel(st);
                    return (
                      <tr key={s.id}>
                        <td>
                          <a href={s.url} target="_blank" rel="noopener noreferrer">
                            {s.name}
                          </a>
                          <small>
                            {s.publisher}
                            {s.language && s.language !== 'en' ? ` · ${s.language.toUpperCase()}` : ''}
                            {(s.usedBy ?? []).map((u: string) => (
                              <Link key={u} href={u} className="used">
                                used on {u}
                              </Link>
                            ))}
                          </small>
                          <span className="src-desc">{s.description}</span>
                        </td>
                        <td>{s.format}</td>
                        <td className="when">{st?.upstreamDate ?? s.research?.last_updated ?? '—'}</td>
                        <td>
                          <span className={`maint maint-${s.research?.maintenance ?? 'unknown'}`}>{MAINT[s.research?.maintenance ?? 'unknown']}</span>
                        </td>
                        <td>
                          <span className={`watch watch-${w.cls}`} title={st?.detail}>
                            {w.text}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </section>
      ))}
      <p className="muted">
        “Maintained” is our research assessment from {list[0]?.research ? 'October 2026' : 'research'}; “Link” is the weekly automated check. Raw
        research notes, scrapers and probe scripts are in the{' '}
        <a href="https://github.com/Ahmet-Dedeler/free-north-korea/tree/main/docs/research">repository</a>.
      </p>
    </div>
  );
}
