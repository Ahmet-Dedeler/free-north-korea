/**
 * Visual blocks used inside /learn articles, so explainers read like a field guide rather than a blog post.
 * Every number here also appears in the article text or its sources.
 *
 * Blocks that carry their own words take `lang` (default English), so the Korean and Japanese articles reuse the
 * same visuals. Text inside a block lives in a `Record<Lang, …>` next to it.
 */
import type { CSSProperties, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Building2, Footprints, Home, Landmark, Megaphone, Radio, Route, Scale, Search, ShieldOff, Usb, Waves } from 'lucide-react';
import Avatar from './Avatar';
import CampCard from './CampCard';
import Locator from './Locator';
import { StatTile } from './Visual';
import { person } from '@/entities';
import { CoverCard } from './Covers';
import { getAllCamps } from '@/content/camps';
import { SHELVES } from '@/content/library';
import { orgLogo } from '@/content/media';
import { ORGS } from '@/content/orgs';
import { PLACES } from '@/content/places';
import type { Lang } from '@/site/seo';

const num = (n: number, lang: Lang) => n.toLocaleString(lang === 'en' ? 'en-US' : lang);

/* ---------- generic ---------- */

/** Big number with a short label, floated in the text flow. */
export function Fact({ value, label, tone }: { value: string; label: string; tone?: 'danger' | 'ok' | 'warn' }) {
  return (
    <span className={`fact ${tone ?? ''}`}>
      <b>{value}</b>
      <span>{label}</span>
    </span>
  );
}

/** A row of stat tiles. Put the date a number is from in `note`. */
export function Stats({ items }: { items: { value: ReactNode; label: string; note?: string; tone?: 'danger' | 'warn' | 'ok'; icon?: LucideIcon }[] }) {
  return (
    <div className="tiles art-tiles">
      {items.map((it) => (
        <StatTile key={it.label} {...it} />
      ))}
    </div>
  );
}

/** Dated events on a vertical line. */
export function Timeline({ items }: { items: { date: string; title: string; text?: ReactNode; tone?: 'danger' | 'warn' | 'ok' }[] }) {
  return (
    <ol className="events">
      {items.map((it) => (
        <li key={it.date + it.title} className={it.tone ?? ''}>
          <time>{it.date}</time>
          <b>{it.title}</b>
          {it.text && <span>{it.text}</span>}
        </li>
      ))}
    </ol>
  );
}

const TLDR: Record<Lang, string> = { en: 'tldr:', ko: '세 줄 요약', ja: '3行まとめ' };

/** The short version, at the end of an article (never the top). */
export function Tldr({ lang = 'en', items }: { lang?: Lang; items: ReactNode[] }) {
  return (
    <aside className="tldr">
      <b>{TLDR[lang]}</b>
      <ul>
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </aside>
  );
}

/** Row of icon steps (escape route, how-to). */
export function Steps({ steps }: { steps: { icon: LucideIcon; title: string; fact: string; href?: string }[] }) {
  return (
    <ol className="steps">
      {steps.map((s, i) => (
        <li key={s.title}>
          <span className="step-icon">
            <s.icon size={22} />
            <small>{i + 1}</small>
          </span>
          <b>{s.href ? <a href={s.href}>{s.title}</a> : s.title}</b>
          <span>{s.fact}</span>
        </li>
      ))}
    </ol>
  );
}

const WEBSITE: Record<Lang, string> = { en: 'Website', ko: '웹사이트', ja: 'ウェブサイト' };

/** Org cards with logos and the direct way to help, for "how to help" sections. */
export function OrgActions({ ids, lang = 'en' }: { ids: string[]; lang?: Lang }) {
  return (
    <ul className="org-actions-row">
      {ids.map((id) => {
        const o = ORGS.find((x) => x.id === id);
        if (!o) return null;
        const logo = orgLogo(o.id);
        const help = o.help[0];
        return (
          <li key={id}>
            <a href={help?.url ?? o.url} target="_blank" rel="noopener noreferrer">
              <span className="hl-logo">{logo ? <img src={logo.src} alt="" /> : <b>{o.name[0]}</b>}</span>
              <span lang="en">
                <strong>{o.name.replace(/\s*\(.*\)/, '')}</strong>
                <small lang={help ? 'en' : lang}>{help?.label ?? WEBSITE[lang]} ↗</small>
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

/* ---------- how can North Korea be freed ---------- */

type Push = 'yes' | 'some' | 'no';
const PATHS: { icon: LucideIcon; anchor: string; push: Push }[] = [
  { icon: Usb, anchor: 'information', push: 'yes' },
  { icon: Landmark, anchor: 'split', push: 'no' },
  { icon: Building2, anchor: 'reform', push: 'some' },
  { icon: ShieldOff, anchor: 'collapse', push: 'some' },
  { icon: Scale, anchor: 'pressure', push: 'yes' },
];
const PATH_TEXT: Record<Lang, [string, string][]> = {
  en: [
    ['Information gets in', 'Outsiders can push directly'],
    ['A split at the top', 'Happens inside the elite'],
    ['Reform from inside', 'Depends on a future leader'],
    ['Collapse', 'Outsiders can prepare evidence'],
    ['Outside pressure', 'Through governments and China'],
  ],
  ko: [
    ['외부 정보 유입', '바깥에서 직접 도울 수 있음'],
    ['권력층 내부 분열', '엘리트 내부에서 일어남'],
    ['내부 개혁', '미래 지도자에게 달림'],
    ['체제 붕괴', '바깥에서는 증거를 준비할 수 있음'],
    ['외부 압력', '각국 정부와 중국을 통해서'],
  ],
  ja: [
    ['外の情報が入る', '外から直接後押しできる'],
    ['上層部の分裂', 'エリート内部で起きる'],
    ['内側からの改革', '将来の指導者しだい'],
    ['体制の崩壊', '外では証拠を準備できる'],
    ['外からの圧力', '各国政府と中国を通じて'],
  ],
};

export function FivePaths({ lang = 'en' }: { lang?: Lang }) {
  return (
    <ol className="paths">
      {PATHS.map((p, i) => (
        <li key={p.anchor}>
          <a href={`#${p.anchor}`}>
            <span className="path-n">{i + 1}</span>
            <p.icon size={22} className="path-icon" />
            <b>{PATH_TEXT[lang][i][0]}</b>
            <span className={`push ${p.push}`}>
              <i />
              {PATH_TEXT[lang][i][1]}
            </span>
          </a>
        </li>
      ))}
    </ol>
  );
}

/* ---------- how North Koreans escape ---------- */

const ESCAPE_TEXT: Record<Lang, [string, string][]> = {
  en: [
    ['Cross the river', 'Tumen or Yalu into China, usually with a broker who pays off guards.'],
    ['Hide in China', 'No legal status. Caught means sent back: ~500-600 in one operation in Oct 2023.'],
    ['~3,000 miles south', 'Safe houses, buses and jungle crossings into Laos and Thailand. ~$3,000 per rescue.'],
    ['South Korea', 'Questioning, then about three months at Hanawon before starting over.'],
  ],
  ko: [
    ['강을 건넌다', '두만강이나 압록강을 건너 중국으로. 보통 경비대에 돈을 쥐여주는 브로커를 통한다.'],
    ['중국에서 숨어 지낸다', '법적 신분이 없다. 잡히면 강제송환 (2023년 10월 한 번에 약 500~600명).'],
    ['남쪽으로 약 4,800km', '은신처, 버스, 정글을 거쳐 라오스와 태국으로. 구출 1건에 약 3,000달러.'],
    ['한국', '합동신문을 받고 하나원에서 약 3개월을 보낸 뒤 새로 시작한다.'],
  ],
  ja: [
    ['川を渡る', '豆満江か鴨緑江を渡って中国へ。たいていは警備兵に賄賂を渡すブローカーを使う。'],
    ['中国で隠れて暮らす', '法的な身分がない。捕まれば送還（2023年10月には一度に推定500〜600人）。'],
    ['南へ約4,800km', '隠れ家、バス、ジャングルを抜けてラオスとタイへ。救出1件あたり約3,000ドル。'],
    ['韓国', '取り調べのあと、ハナ院で約3か月過ごしてから新しい生活を始める。'],
  ],
};
const ESCAPE_ICONS: { icon: LucideIcon; anchor: string }[] = [
  { icon: Waves, anchor: 'border' },
  { icon: Search, anchor: 'china' },
  { icon: Route, anchor: 'route' },
  { icon: Home, anchor: 'south-korea' },
];

export function EscapeRoute({ lang = 'en' }: { lang?: Lang }) {
  return <Steps steps={ESCAPE_ICONS.map((s, i) => ({ icon: s.icon, title: ESCAPE_TEXT[lang][i][0], fact: ESCAPE_TEXT[lang][i][1], href: `#${s.anchor}` }))} />;
}

const BORDER_TEXT: Record<Lang, { names: Record<string, string>; caption: string }> = {
  en: { names: { hyesan: 'Hyesan', musan: 'Musan', hoeryong: 'Hoeryong' }, caption: 'Common crossing areas on the Yalu and Tumen rivers. Click a dot for the place.' },
  ko: { names: { hyesan: '혜산', musan: '무산', hoeryong: '회령' }, caption: '압록강과 두만강의 주요 도강 지역. 점을 누르면 해당 장소로 이동한다.' },
  ja: { names: { hyesan: '恵山', musan: '茂山', hoeryong: '会寧' }, caption: '鴨緑江と豆満江の主な渡河地点。点をクリックするとその場所へ。' },
};

/** The border towns people usually cross near, on the server-rendered map of North Korea. */
export function BorderMap({ lang = 'en' }: { lang?: Lang }) {
  const t = BORDER_TEXT[lang];
  const towns = ['hyesan', 'musan', 'hoeryong'].map((id) => PLACES.find((p) => p.id === id)!).filter(Boolean);
  return (
    <figure className="border-map">
      <Locator pins={towns.map((p) => ({ lat: p.lat, lon: p.lon, title: t.names[p.id], href: `/places/${p.id}`, color: 'var(--danger)', r: 7 }))} />
      <ul className="border-towns">
        {towns.map((p) => (
          <li key={p.id}>
            <a href={`/places/${p.id}`}>
              <i /> {t.names[p.id]}
            </a>
          </li>
        ))}
      </ul>
      <figcaption>{t.caption}</figcaption>
    </figure>
  );
}

/**
 * Arrivals in South Korea per year. 2002–2023 from the Ministry of Unification table (via Wikipedia), split by sex;
 * 2024 and 2025 from news reports of the ministry's annual figures (2025: 198 of 224 were women).
 */
const ARRIVALS: [number, number | null, number | null, number][] = [
  // year, women, men, total
  [2002, 632, 510, 1142],
  [2003, 811, 474, 1285],
  [2004, 1272, 626, 1898],
  [2005, 960, 424, 1384],
  [2006, 1513, 515, 2028],
  [2007, 1981, 573, 2554],
  [2008, 2195, 608, 2803],
  [2009, 2252, 662, 2914],
  [2010, 1811, 591, 2402],
  [2011, 1911, 795, 2706],
  [2012, 1098, 404, 1502],
  [2013, 1145, 369, 1514],
  [2014, 1092, 305, 1397],
  [2015, 1024, 251, 1275],
  [2016, 1119, 299, 1418],
  [2017, 939, 188, 1127],
  [2018, 969, 168, 1137],
  [2019, 845, 202, 1047],
  [2020, 157, 72, 229],
  [2021, 23, 40, 63],
  [2022, 32, 35, 67],
  [2023, 164, 32, 196],
  [2024, null, null, 236],
  [2025, 198, 26, 224],
];

const ARRIVALS_TEXT: Record<Lang, { people: (n: string) => string; women: string; men: string; covid: string; caption: string }> = {
  en: {
    people: (n) => `${n} people`,
    women: 'Women',
    men: 'Men',
    covid: 'Border sealed for COVID, 2020',
    caption: 'North Koreans arriving in South Korea per year. 34,538 in total by the end of 2025.',
  },
  ko: {
    people: (n) => `${n}명`,
    women: '여성',
    men: '남성',
    covid: '2020년 코로나로 국경 봉쇄',
    caption: '연도별 탈북민 한국 입국 인원. 2025년 말까지 누적 34,538명.',
  },
  ja: {
    people: (n) => `${n}人`,
    women: '女性',
    men: '男性',
    covid: '2020年 コロナで国境封鎖',
    caption: '韓国に到着した脱北者の年別人数。2025年末までの累計は34,538人。',
  },
};

export function ArrivalsChart({ lang = 'en' }: { lang?: Lang }) {
  const max = 3000;
  const t = ARRIVALS_TEXT[lang];
  return (
    <figure className="arrivals">
      <div className="arrivals-plot">
        {[1000, 2000, 3000].map((g) => (
          <span key={g} className="grid-line" style={{ bottom: `${(g / max) * 100}%` }}>
            {num(g, lang)}
          </span>
        ))}
        <ol>
          {ARRIVALS.map(([y, w, m, total]) => (
            <li key={y} className={y >= 2020 ? 'after' : ''}>
              <span className="arr-tip">
                <b>{y}</b> {t.people(num(total, lang))}
                {w != null && (
                  <>
                    <br />
                    {t.women} {num(w, lang)} · {t.men} {num(m!, lang)}
                  </>
                )}
              </span>
              <span className="arr-bar" style={{ height: `${(total / max) * 100}%` }}>
                {w != null ? (
                  <>
                    <i className="w" style={{ flex: w }} />
                    <i className="m" style={{ flex: m! }} />
                  </>
                ) : (
                  <i className="t" style={{ flex: 1 }} />
                )}
              </span>
              <small>{y % 5 === 0 || y === 2025 ? `’${String(y).slice(2)}` : ''}</small>
            </li>
          ))}
        </ol>
        <span className="arr-note" style={{ left: `${(18 / ARRIVALS.length) * 100}%` }}>
          {t.covid}
        </span>
      </div>
      <figcaption className="key left">
        <span>
          <i style={{ background: '#db2777' }} /> {t.women}
        </span>
        <span>
          <i style={{ background: '#0ea5e9' }} /> {t.men}
        </span>
        <span className="muted">{t.caption}</span>
      </figcaption>
    </figure>
  );
}

/* ---------- information into North Korea ---------- */

const CHANNELS: { icon: LucideIcon; tone: 'ok' | 'warn' | 'danger'; anchor: string }[] = [
  { icon: Usb, tone: 'ok', anchor: 'usb' },
  { icon: Radio, tone: 'danger', anchor: 'radio' },
  { icon: Megaphone, tone: 'warn', anchor: 'balloons' },
];
const CHANNEL_TEXT: Record<Lang, [string, string, string][]> = {
  en: [
    ['USB drives & microSD', 'Main channel', 'Copied hand to hand and played on cheap "notel" players. 140,000+ drives donated or pledged to Flash Drives for Freedom.'],
    ['Radio', 'Hit hardest in 2025', 'RFA Korean shut down July 2025, VOA gutted, South Korea ended its broadcasts in June 2025.'],
    ['Balloons', 'Mostly paused', 'South Korea began enforcing a launch ban in 2025. The most visible method, probably not the most effective.'],
  ],
  ko: [
    ['USB와 마이크로SD', '주요 통로', '손에서 손으로 복사되고 값싼 "노텔"로 재생된다. Flash Drives for Freedom에 기부·약정된 USB만 14만 개 이상.'],
    ['라디오', '2025년 가장 큰 타격', 'RFA 한국어 방송은 2025년 7월 중단, VOA는 대폭 축소, 한국 정부도 2025년 6월 대북 방송을 중단했다.'],
    ['풍선', '대부분 중단', '2025년 한국 정부가 살포 금지를 집행하기 시작했다. 가장 눈에 띄는 방법이지만 아마 가장 효과적인 방법은 아니다.'],
  ],
  ja: [
    ['USBとmicroSD', '主なルート', '手から手へコピーされ、安い「ノーテル」で再生される。Flash Drives for Freedomへの寄付・寄付予定は14万本以上。'],
    ['ラジオ', '2025年に最も打撃', 'RFA朝鮮語放送は2025年7月に停止、VOAは大幅縮小、韓国政府も2025年6月に対北放送をやめた。'],
    ['風船', 'ほぼ停止', '韓国政府が2025年に打ち上げ禁止の取り締まりを始めた。いちばん目立つ方法だが、たぶん一番効果的な方法ではない。'],
  ],
};

export function Channels({ lang = 'en' }: { lang?: Lang }) {
  return (
    <ul className="channels">
      {CHANNELS.map((c, i) => {
        const [title, status, text] = CHANNEL_TEXT[lang][i];
        return (
          <li key={c.anchor} className={c.tone}>
            <a href={`#${c.anchor}`}>
              <span className="ch-icon">
                <c.icon size={24} />
              </span>
              <span className={`ch-status ${c.tone}`}>{status}</span>
              <b>{title}</b>
              <span>{text}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

/* ---------- how to help ---------- */

const HELP: { icon: LucideIcon; anchor: string }[] = [
  { icon: Footprints, anchor: 'rescue' },
  { icon: Usb, anchor: 'information' },
  { icon: Home, anchor: 'escapees' },
  { icon: Search, anchor: 'evidence' },
  { icon: Megaphone, anchor: 'voice' },
];
const HELP_TEXT: Record<Lang, [string, string][]> = {
  en: [
    ['Fund a rescue', '~$3,000 per person'],
    ['Send information in', 'Mail an old USB drive'],
    ['Help escapees', 'An hour a week of tutoring'],
    ['Keep the evidence', 'Fund documentation groups'],
    ['Use your voice', 'Call your representatives'],
  ],
  ko: [
    ['구출 비용 후원', '1명당 약 3,000달러'],
    ['정보 보내기', '안 쓰는 USB 한 개 우편으로'],
    ['탈북민 돕기', '일주일에 한 시간 튜터링'],
    ['증거 남기기', '기록 단체 후원'],
    ['목소리 내기', '지역 의원에게 연락'],
  ],
  ja: [
    ['救出を支援する', '1人あたり約3,000ドル'],
    ['情報を送る', '使わないUSBを郵送'],
    ['脱北者を助ける', '週1時間のチューター'],
    ['証拠を残す', '記録団体を支援'],
    ['声を上げる', '議員に連絡する'],
  ],
};

/** The ways to help as a menu. `base` points the links at another page (e.g. from a different article). */
export function HelpMenu({ lang = 'en', base = '' }: { lang?: Lang; base?: string }) {
  return (
    <ul className="help-menu">
      {HELP.map((it, i) => (
        <li key={it.anchor}>
          <a href={`${base}#${it.anchor}`}>
            <it.icon size={22} />
            <b>{HELP_TEXT[lang][i][0]}</b>
            <span>{HELP_TEXT[lang][i][1]}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/* ---------- prison camps ---------- */

export function CampGrid({ slugs }: { slugs: string[] }) {
  const all = getAllCamps();
  return (
    <ul className="place-cards wide-block" lang="en">
      {slugs.map((s) => {
        const c = all.find((x) => x.slug === s);
        return c ? <CampCard key={s} camp={c} /> : null;
      })}
    </ul>
  );
}

/** Side-by-side comparison of two things, poster style: a coloured band with the icon, a condensed headline, then text. */
export function Compare({ items }: { items: { icon: LucideIcon; title: string; tone?: string; children: ReactNode }[] }) {
  return (
    <div className={`compare${items.length === 2 ? ' versus' : ''}`}>
      {items.map((it) => (
        <section key={it.title} className={`compare-card ${it.tone ?? ''}`}>
          <it.icon className="ic-mark" aria-hidden />
          <span className="cc-icon">
            <it.icon size={20} strokeWidth={2.25} />
          </span>
          <h3>{it.title}</h3>
          {it.children}
        </section>
      ))}
    </div>
  );
}

/** Orgs with their logo and a sentence about what they do, as a list of cards. */
export function OrgNotes({ items }: { items: { id: string; note: ReactNode }[] }) {
  return (
    <ul className="org-notes">
      {items.map(({ id, note }) => {
        const o = ORGS.find((x) => x.id === id);
        if (!o) return null;
        const logo = orgLogo(o.id);
        return (
          <li key={id}>
            <span className="hl-logo">{logo ? <img src={logo.src} alt="" /> : <b>{o.name[0]}</b>}</span>
            <span>
              <a href={`/organizations#${o.id}`}>
                <strong lang="en">{o.name.replace(/\s*\(.*\)/, '')}</strong>
              </a>{' '}
              {note}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/** A few library covers inline. */
export function Books({ titles }: { titles: string[] }) {
  const items = SHELVES.flatMap((s) => s.items);
  return (
    <ul className="cover-grid inline-books" lang="en">
      {titles.map((t) => {
        const it = items.find((i) => i.title === t);
        return it ? <CoverCard key={t} item={it} kind="book" /> : null;
      })}
    </ul>
  );
}

/**
 * Grid of icon cards, poster style: a numbered kicker, a condensed headline, an optional big number pulled out of the
 * text, and the icon blown up as a watermark. Rows are balanced (5 cards = 3 + 2, 4 = 2 + 2) so no card is left alone
 * on the last row. `tone` colours the whole set: danger for what holds the regime up, ok for what wears it down.
 */
export function IconCards({
  items,
  tone = 'accent',
}: {
  items: { icon: LucideIcon; title: string; stat?: { value: string; unit: string }; children: ReactNode }[];
  tone?: 'accent' | 'danger' | 'ok' | 'warn';
}) {
  const n = items.length;
  const perRow = n <= 3 ? n : n === 4 ? 2 : 3;
  const lastRow = n % perRow || perRow;
  return (
    <ul className={`icon-cards tone-${tone}`}>
      {items.map((it, i) => {
        const span = i >= n - lastRow ? 6 / lastRow : 6 / perRow;
        return (
          <li key={it.title} style={{ '--span': span } as CSSProperties}>
            <it.icon className="ic-mark" aria-hidden />
            <span className="ic-head">
              <span className="ic-icon">
                <it.icon size={18} strokeWidth={2.25} />
              </span>
              <span className="ic-num">{String(i + 1).padStart(2, '0')}</span>
            </span>
            <b className="ic-title">{it.title}</b>
            {it.stat && (
              <span className="ic-stat">
                <span className="ic-stat-v">{it.stat.value}</span> <span className="ic-stat-u">{it.stat.unit}</span>
              </span>
            )}
            <p>{it.children}</p>
          </li>
        );
      })}
    </ul>
  );
}

const KIM_NAMES: Record<'ko' | 'ja', Record<string, string>> = {
  ko: { 'kim-il-sung': '김일성', 'kim-jong-il': '김정일', 'kim-jong-un': '김정은' },
  ja: { 'kim-il-sung': '金日成', 'kim-jong-il': '金正日', 'kim-jong-un': '金正恩' },
};
const NOW: Record<Lang, string> = { en: 'now', ko: '현재', ja: '現在' };

/** The three Kims as a timeline with portraits. */
export function Dynasty({ lang = 'en' }: { lang?: Lang }) {
  const rows = [
    { id: 'kim-il-sung', from: 1948, to: 1994 },
    { id: 'kim-jong-il', from: 1994, to: 2011 },
    { id: 'kim-jong-un', from: 2011, to: null },
  ];
  const end = 2026;
  return (
    <ol className="dynasty">
      {rows.map((r) => {
        const p = person(r.id);
        if (!p) return null;
        return (
          <li key={r.id} style={{ flex: (r.to ?? end) - r.from }}>
            <a href={`/people/${p.id}`}>
              <Avatar person={p} size={52} />
              <b>{lang === 'en' ? p.name_en : KIM_NAMES[lang][r.id]}</b>
              <span>
                {r.from}–{r.to ?? NOW[lang]}
              </span>
            </a>
            <i className="dyn-bar" />
          </li>
        );
      })}
    </ol>
  );
}
