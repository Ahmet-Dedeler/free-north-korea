/**
 * Visual blocks used inside /learn articles, so explainers read like a field guide rather than a blog post.
 * Every number here also appears in the article text or its sources.
 *
 * Blocks that carry their own words take `lang` (default English), so the Korean, Japanese and Chinese articles reuse the
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
import { orgHelpLabel, orgHref } from '@/content/orgsI18n';
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

const TLDR: Record<Lang, string> = { en: 'tldr:', ko: '세 줄 요약', ja: '3行まとめ', zh: '要点' };

/** The short version, at the end of an article (never the top). */
export function Tldr({ lang = 'en', items }: { lang?: Lang; items: ReactNode[] }) {
  return (
    <div className="tldr" role="note">
      <b>{TLDR[lang]}</b>
      <ul>
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </div>
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

const WEBSITE: Record<Lang, string> = { en: 'Website', ko: '웹사이트', ja: 'ウェブサイト', zh: '网站' };

/** Org cards with logos and the direct way to help, for "how to help" sections. */
export function OrgActions({ ids, lang = 'en' }: { ids: string[]; lang?: Lang }) {
  return (
    <ul className="org-actions-row">
      {ids.map((id) => {
        const o = ORGS.find((x) => x.id === id);
        if (!o) return null;
        const logo = orgLogo(o.id);
        const help = o.help[0];
        const helpLabel = help ? orgHelpLabel(o, 0, lang) : undefined;
        return (
          <li key={id}>
            <a href={help?.url ?? o.url} target="_blank" rel="noopener noreferrer">
              <span className="hl-logo">{logo ? <img src={logo.src} alt="" /> : <b>{o.name[0]}</b>}</span>
              <span>
                <strong lang="en">{o.name.replace(/\s*\(.*\)/, '')}</strong>
                <small>{helpLabel ?? WEBSITE[lang]} ↗</small>
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
  zh: [
    ['外部信息流入', '外界可以直接推动'],
    ['高层分裂', '发生在精英内部'],
    ['内部改革', '取决于未来的领导人'],
    ['政权崩溃', '外界可以提前准备证据'],
    ['外部压力', '通过各国政府和中国'],
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
  zh: [
    ['过河', '渡过图们江或鸭绿江进入中国，通常要靠向边防兵行贿的中间人。'],
    ['藏身中国', '没有合法身份。被抓就会被遣返：2023年10月一次就送回约500到600人。'],
    ['南下约4,800公里', '经过安全屋、长途汽车和丛林，进入老挝和泰国。每救一人约3,000美元。'],
    ['韩国', '先接受审查，再在统一院（Hanawon）住约三个月，然后开始新生活。'],
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
  zh: { names: { hyesan: '惠山', musan: '茂山', hoeryong: '会宁' }, caption: '鸭绿江和图们江上常见的越境地段。点击圆点查看该地。' },
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
  zh: {
    people: (n) => `${n}人`,
    women: '女性',
    men: '男性',
    covid: '2020年因新冠封锁边境',
    caption: '每年抵达韩国的朝鲜人数。截至2025年底累计34,538人。',
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
  zh: [
    ['U盘和microSD卡', '主要渠道', '在人与人之间手手相传地拷贝，用便宜的“Notel”播放器播放。捐给或承诺捐给 Flash Drives for Freedom 的U盘超过14万个。'],
    ['广播', '2025年受打击最重', '自由亚洲电台韩语节目2025年7月停播，美国之音被大幅削减，韩国政府也在2025年6月停止了对朝广播。'],
    ['气球', '基本停止', '韩国政府2025年开始执行放飞禁令。这是最显眼的方法，但很可能不是最有效的。'],
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
  zh: [
    ['资助营救', '每人约3,000美元'],
    ['把信息送进去', '寄出一个旧U盘'],
    ['帮助脱北者', '每周一小时辅导'],
    ['保存证据', '资助记录机构'],
    ['发出声音', '联系你的议员'],
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

export function CampGrid({ slugs, lang = 'en' }: { slugs: string[]; lang?: Lang }) {
  const all = getAllCamps();
  return (
    <ul className="place-cards wide-block">
      {slugs.map((s) => {
        const c = all.find((x) => x.slug === s);
        return c ? <CampCard key={s} camp={c} lang={lang} /> : null;
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
export function OrgNotes({ items, lang = 'en' }: { items: { id: string; note: ReactNode }[]; lang?: Lang }) {
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
              <a href={orgHref(lang, o.id)}>
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

const KIM_NAMES: Record<Exclude<Lang, 'en'>, Record<string, string>> = {
  ko: { 'kim-il-sung': '김일성', 'kim-jong-il': '김정일', 'kim-jong-un': '김정은' },
  ja: { 'kim-il-sung': '金日成', 'kim-jong-il': '金正日', 'kim-jong-un': '金正恩' },
  zh: { 'kim-il-sung': '金日成', 'kim-jong-il': '金正日', 'kim-jong-un': '金正恩' },
};
const NOW: Record<Lang, string> = { en: 'now', ko: '현재', ja: '現在', zh: '至今' };

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

/* ---------- 2025-2026 Sejong University drone case ---------- */

const DRONE_TRIO_TEXT: Record<
  Lang,
  {
    company: string;
    meta: string;
    people: { name: string; role: string; sentence: string; facts: string[] }[];
  }
> = {
  en: {
    company: 'Estel Engineering Co., Ltd. (주식회사 에스텔엔지니어링)',
    meta: 'Founded Sept 22, 2023 · Sejong University Student Union Startup Center · Reg. 110111-8696191',
    people: [
      {
        name: 'Jang Han-yong (장한용)',
        role: 'CEO (대표이사) · Airframe & Autopilot',
        sentence: '6 months, suspended 2 years (aviation law only)',
        facts: [
          'Sejong Univ. Aerospace Engineering (Class of 2015); Silver medalist at the 2016 Creative Aircraft Competition in the UAV club.',
          'Worked as a contract administrative staffer in the Yongsan Presidential Office under President Yoon Suk Yeol.',
          'Modified the 2-meter Chinese fixed-wing foam airframes and GPS flight controllers to fly low below border radar.',
        ],
      },
      {
        name: 'Oh Jong-taek (오종택, b. 1995)',
        role: 'Internal & Sales Director (사내이사) · Operator',
        sentence: '8 months, suspended 2 years (aviation law only)',
        facts: [
          'Sejong Univ. Mechanical & Aerospace Engineering (Class of 2015); former president of conservative student group Korea University Students Forum (한국대학생포럼).',
          'Youth Advisor to Yoon Suk Yeol’s 2022 Transition Committee and contract staffer in the Yongsan Presidential Office (Public Relations).',
          'Launched the four cross-border flights, registered the Defense Intelligence Command-funded outlets NK Monitor and Global Insight, and claimed responsibility on Channel A on Jan 16, 2026.',
        ],
      },
      {
        name: 'Kim Chung-shin (김충신, b. 1993)',
        role: 'Director of North Korea Affairs (대북전문이사)',
        sentence: '6 months, suspended 2 years (aviation law only)',
        facts: [
          'Sejong Univ. Mechanical & Aerospace Engineering; frontline artilleryman in Goseong during the Aug 2015 DMZ artillery exchange; studied North Korean law in graduate school.',
          'Worked 3 years (from 2021) at the Ministry of Unification’s Inter-Korean Exchange and Cooperation Support Association tracking North Korean magnesite mining in Tanchon by satellite.',
          'Plotted the Pyongsan and Kaesong coordinates and told a visiting drone PhD that his goal was to film political prison camps (kwanliso) and push USBs and wireless internet in to end the dictatorship.',
        ],
      },
    ],
  },
  ko: {
    company: '주식회사 에스텔엔지니어링 (Estel Engineering)',
    meta: '2023년 9월 22일 설립 · 세종대 학생회관 창업지원센터 · 법인등록번호 110111-8696191',
    people: [
      {
        name: '장한용 (Jang Han-yong)',
        role: '대표이사 · 기체 제작 및 비행제어',
        sentence: '징역 6개월, 집행유예 2년 (항공안전법만 유죄)',
        facts: [
          '세종대 항공우주공학과 15학번. 자작모형항공기 동아리 UAV 소속으로 2016년 창작비행체 경연대회 은상 수상.',
          '윤석열 정부 용산 대통령실 계약직 행정요원 근무.',
          '중국산 2m급 고정익 스티로폼 기체에 저고도 GPS 자동비행 제어기와 촬영 장비를 개조·장착해 방공 레이더 회피 비행 설계.',
        ],
      },
      {
        name: '오종택 (Oh Jong-taek, 1995년생)',
        role: '사내이사 / 영업이사 · 비행 운용 및 대외 활동',
        sentence: '징역 8개월, 집행유예 2년 (항공안전법만 유죄)',
        facts: [
          '세종대 기계항공우주공학부 15학번. 보수 청년단체 한국대학생포럼(한대포) 회장 역임, 2018년 이승만애국상 수상.',
          '제20대 대통령직인수위원회 청년자문위원 및 용산 대통령실 홍보수석실 계약직 행정요원(뉴스 모니터링) 근무.',
          '강화도·파주에서 4차례 대북 무인기 발사 주도, 정보사 공작금으로 인터넷 매체 NK모니터·글로벌인사이트 등록, 2026년 1월 16일 채널A 인터뷰 자처.',
        ],
      },
      {
        name: '김충신 (Kim Chung-shin, 1993년생)',
        role: '대북전문이사 · 표적 선정 및 경로 설계',
        sentence: '징역 6개월, 집행유예 2년 (항공안전법만 유죄)',
        facts: [
          '세종대 기계항공우주공학부 졸업. 2015년 8월 서부전선 포격 도발 당시 고성 최전방 포병 복무, 대학원에서 북한법 전공.',
          '2021년부터 3년간 통일부 산하 남북교류협력지원협회에서 위성사진으로 북한 단천 마그네사이트 광산 및 밀수 동향 감시.',
          '평산 우라늄 공장과 개성 비행 좌표 설계. 외부 무인기 박사에게 "USB·무선통신으로 외부 정보를 유입해 독재정권 종말을 유도하고 정치범 수용소를 가장 촬영하고 싶다"고 밝힘.',
        ],
      },
    ],
  },
  ja: {
    company: '株式会社エステル・エンジニアリング (Estel Engineering)',
    meta: '2023年9月22日設立 · 世宗大学学生会館創業支援センター · 法人登録番号 110111-8696191',
    people: [
      {
        name: 'チャン・ハニョン (장한용 / Jang Han-yong)',
        role: '代表理事 (CEO) · 機体設計・自動飛行制御',
        sentence: '懲役6か月、執行猶予2年（航空安全法のみ有罪）',
        facts: [
          '世宗大学航空宇宙工学科15学番（2015年入学）。自作模型航空機サークル「UAV」で2016年創作飛行体コンテスト銀賞を受賞。',
          '尹錫悦（ユン・ソンニョル）政権の龍山大統領室で契約職の行政要員として勤務。',
          '中国製の翼幅約2mの固定翼フォーム機体を改造し、防空レーダーの下をGPSウェイポイントで自動飛行する制御系を組み立てた。',
        ],
      },
      {
        name: 'オ・ジョンテ (오종택 / Oh Jong-taek, 1995年生)',
        role: '社内理事 / 営業理事 · 発射運用・対外窓口',
        sentence: '懲役8か月、執行猶予2年（航空安全法のみ有罪）',
        facts: [
          '世宗大学機械航空宇宙工学部15学番。保守系学生団体「韓国大学生フォーラム」元会長、2018年に李承晩愛国賞を受賞。',
          '2022年の第20代大統領職引継委員会の青年諮問委員、龍山大統領室広報首席室の契約職行政要員を歴任。',
          '江華島と坡州から計4回の越境飛行を主導し、国軍情報司令部の工作資金で「NKモニター」「グローバルインサイト」を登録。2026年1月16日にチャンネルAのインタビューに出演。',
        ],
      },
      {
        name: 'キム・チュンシン (김충신 / Kim Chung-shin, 1993年生)',
        role: '対北専門理事 · 標的選定・座標設計',
        sentence: '懲役6か月、執行猶予2年（航空安全法のみ有罪）',
        facts: [
          '世宗大学機械航空宇宙工学部卒。2015年8月のDMZ砲撃事件当時に高城の最前線砲兵として服務し、大学院で北朝鮮法を専攻。',
          '2021年から3年間、統一部傘下の南北交流協力支援協会に勤務し、衛星写真で北朝鮮・端川のマグネサイト鉱山や密輸を監視。',
          '平山ウラン工場と開城の飛行ルートを設計。外部のドローン博士に「USBや無線通信で外部情報を流入させて独裁政権の終末を誘導し、政治犯収容所を一番撮影したい」と語った。',
        ],
      },
    ],
  },
  zh: {
    company: 'Estel Engineering 股份公司 (주식회사 에스텔엔지니어링)',
    meta: '2023年9月22日成立 · 世宗大学学生会馆创业支援中心 · 法人登记号 110111-8696191',
    people: [
      {
        name: '张汉龙 (장한용 / Jang Han-yong)',
        role: '代表理事 (CEO) · 机体改装与飞控',
        sentence: '有期徒刑6个月，缓刑2年（仅航空安全法有罪）',
        facts: [
          '世宗大学航空宇宙工程系2015级。固定翼航模社团“UAV”成员，曾获2016年创作飞行器大赛银奖。',
          '曾在尹锡悦政府的龙山总统室担任合同制行政人员。',
          '负责采购并改装翼展约2米的中国产固定翼泡沫机体，加装低空GPS航点自动驾驶仪以避开防空雷达。',
        ],
      },
      {
        name: '吴钟泽 (오종택 / Oh Jong-taek, 1995年生)',
        role: '社内理事 / 营业理事 · 发射操作与对外活动',
        sentence: '有期徒刑8个月，缓刑2年（仅航空安全法有罪）',
        facts: [
          '世宗大学机械航空宇宙工程学部2015级。保守派学生团体“韩国大学生论坛”前会长，2018年获李承晚爱国奖。',
          '曾任2022年第20届总统职务交接委员会青年咨询委员，并在龙山总统室宣传首席室担任合同制行政人员。',
          '主导从江华岛和坡州进行的4次越境飞行，用国军情报司令部提供的经费注册“NK Monitor”和“Global Insight”两家网媒，并于2026年1月16日接受Channel A采访公开认领。',
        ],
      },
      {
        name: '金忠信 (김충신 / Kim Chung-shin, 1993年生)',
        role: '对朝专门理事 · 目标选定与航线设计',
        sentence: '有期徒刑6个月，缓刑2年（仅航空安全法有罪）',
        facts: [
          '世宗大学机械航空宇宙工程学部毕业。2015年8月西部战线炮击事件期间在高城最前线担任炮兵，研究生阶段主修朝鲜法。',
          '2021年起在统一部下属南北交流协力支援协会工作3年，利用卫星图像监测朝鲜端川菱镁矿开采与走私。',
          '设计了平山铀精炼厂和开城的飞行坐标。向受邀到访的无人机博士坦言，其目标是“通过U盘和无线通信把外部信息送入朝鲜以诱导独裁政权终结”，且“最想拍摄政治犯收容所”。',
        ],
      },
    ],
  },
};

export function DroneTrio({ lang = 'en' }: { lang?: Lang }) {
  const t = DRONE_TRIO_TEXT[lang];
  return (
    <div className="drone-trio">
      <div className="drone-trio-head">
        <b>{t.company}</b>
        <small>{t.meta}</small>
      </div>
      <ul className="drone-trio-grid">
        {t.people.map((p, i) => (
          <li key={p.name}>
            <span className="dt-top">
              <span className="dt-num">0{i + 1}</span>
              <span className="dt-verdict">{p.sentence}</span>
            </span>
            <strong className="dt-name">{p.name}</strong>
            <span className="dt-role">{p.role}</span>
            <ul>
              {p.facts.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

const DRONE_ROUTE_TEXT: Record<
  Lang,
  {
    pins: Record<string, string>;
    mapCap: string;
    logCap: string;
    logCredit: string;
  }
> = {
  en: {
    pins: {
      ganghwa: 'Ganghwa Island (launch site)',
      'kaesong-ic': 'Kaesong',
      pyongsan: 'Pyongsan uranium mill',
      'kim-il-sung-square': 'Kim Il Sung Square (stated goal)',
      'camp-18': 'Camp 18, Pukchang (closest camp)',
    },
    mapCap: 'Where the drones flew (Kaesong and Pyongsan) versus the deeper targets Kim Chung-shin talked about reaching (Pyongyang and the prison camps). Click a dot for its dossier.',
    logCap: 'GPS waypoint log recovered from the Jan 4, 2026 drone: a grid pass over the Pyongsan uranium mill (top right), south along the Ryesong River past Kumchon, and across Kaesong and Panmun (bottom right) before crashing in Jangpung County.',
    logCredit: 'KPA General Staff / KCNA via Yonhap (Jan 10, 2026)',
  },
  ko: {
    pins: {
      ganghwa: '강화도 하도리 (발사 지점)',
      'kaesong-ic': '개성',
      pyongsan: '평산 우라늄 정련공장',
      'kim-il-sung-square': '김일성광장 (대화방 언급 목표)',
      'camp-18': '18호 관리소 북창 (최단거리 수용소)',
    },
    mapCap: '실제 무인기가 비행한 개성·평산과 김충신이 목표로 언급한 평양 및 정치범 수용소 위치. 점을 누르면 상세 페이지로 이동한다.',
    logCap: '2026년 1월 4일 추락 기체에서 복원된 GPS 비행경로: 평산 우라늄 정련공장 상공 격자 촬영(오른쪽 위) 후 예성강을 따라 금천을 거쳐 개성·판문(오른쪽 아래) 상공을 비행하다 장풍군에 추락했다.',
    logCredit: '북한군 총참모부 발표 / 연합뉴스 (2026.1.10)',
  },
  ja: {
    pins: {
      ganghwa: '江華島・下道里（発射地点）',
      'kaesong-ic': '開城（ケソン）',
      pyongsan: '平山ウラン精錬工場',
      'kim-il-sung-square': '金日成広場（チャットで言及した目標）',
      'camp-18': '18号管理所・北倉（最寄りの収容所）',
    },
    mapCap: '実際にドローンが飛行した開城・平山と、キム・チュンシンが目標として語った平壌および政治犯収容所の位置。点をクリックすると詳細ページへ。',
    logCap: '2026年1月4日の墜落機から復元されたGPS飛行ログ：平山ウラン精錬工場の上空を格子状に撮影（右上）したあと、礼成江に沿って金川を経由し、開城・板門（右下）を通過して長豊郡に墜落した。',
    logCredit: '朝鮮人民軍総参謀部発表 / 聯合ニュース (2026.1.10)',
  },
  zh: {
    pins: {
      ganghwa: '江华岛下道里（发射点）',
      'kaesong-ic': '开城',
      pyongsan: '平山铀精炼厂',
      'kim-il-sung-square': '金日成广场（群聊中提及的目标）',
      'camp-18': '第18号管理所·北仓（最近的收容所）',
    },
    mapCap: '无人机实际飞越的开城与平山，以及金忠信提到的更深远目标（平壤与政治犯收容所）。点击圆点查看档案。',
    logCap: '从2026年1月4日坠毁机体中提取的GPS航点记录：在平山铀精炼厂上空进行网格航拍（右上）后，沿礼成江南下经金川飞越开城与板门（右下），最终坠毁于长丰郡。',
    logCredit: '朝鲜人民军总参谋部公布 / 韩联社 (2026.1.10)',
  },
};

export function DroneRouteMap({ lang = 'en' }: { lang?: Lang }) {
  const t = DRONE_ROUTE_TEXT[lang];
  const pins = [
    { lat: 37.76, lon: 126.38, title: t.pins.ganghwa, color: 'var(--ok)', r: 6 },
    { lat: 37.931, lon: 126.628, title: t.pins['kaesong-ic'], href: '/places/kaesong-ic', color: 'var(--danger)', r: 7 },
    { lat: 38.317, lon: 126.432, title: t.pins.pyongsan, href: '/places/pyongsan', color: 'var(--danger)', r: 8 },
    { lat: 39.0194, lon: 125.7525, title: t.pins['kim-il-sung-square'], href: '/places/kim-il-sung-square', color: 'var(--warn)', r: 6 },
    { lat: 39.55, lon: 126.05, title: t.pins['camp-18'], href: '/camps/kwanliso-18', color: 'var(--warn)', r: 6 },
  ];
  return (
    <div className="drone-route-split">
      <figure className="border-map">
        <Locator pins={pins} />
        <ul className="border-towns">
          <li>
            <a href="/places/pyongsan">
              <i /> {t.pins.pyongsan}
            </a>
          </li>
          <li>
            <a href="/places/kaesong-ic">
              <i /> {t.pins['kaesong-ic']}
            </a>
          </li>
          <li>
            <a href="/places/kim-il-sung-square">
              <i style={{ background: 'var(--warn)' }} /> {t.pins['kim-il-sung-square']}
            </a>
          </li>
          <li>
            <a href="/camps/kwanliso-18">
              <i style={{ background: 'var(--warn)' }} /> {t.pins['camp-18']}
            </a>
          </li>
        </ul>
        <figcaption>{t.mapCap}</figcaption>
      </figure>
      <figure className="drone-log-fig">
        <img src="/img/articles/drone-flight-log-map.jpg" alt={t.logCap} loading="lazy" />
        <figcaption>
          {t.logCap} <span className="muted">({t.logCredit})</span>
        </figcaption>
      </figure>
    </div>
  );
}

const DRONE_EVIDENCE_TEXT: Record<Lang, { items: { src: string; title: string; caption: string; credit: string }[] }> = {
  en: {
    items: [
      {
        src: '/img/articles/drone-kim-chungshin.jpg',
        title: 'Kim Chung-shin in April 2023',
        caption: 'Holding a North Korean lapel badge from his personal collection during a News1 interview on why young South Koreans should care about North Koreans under dictatorship.',
        credit: 'News1 (Apr 15, 2023)',
      },
      {
        src: '/img/articles/drone-mbc-chat.jpg',
        title: 'The leaked KakaoTalk group chat (May 2024)',
        caption: 'Kim Chung-shin writes: "We tested the method to send it all the way to Pyongyang, and succeeded too." Later messages bragged about flying through both Koreas’ air defenses for two hours.',
        credit: 'MBC Newsdesk (Jan 26, 2026)',
      },
      {
        src: '/img/articles/drone-oh-channela.png',
        title: 'Oh Jong-taek goes public (Jan 16, 2026)',
        caption: 'Appearing on Channel A hours after police raided his residence, claiming he flew the drones out of personal curiosity to check radiation and heavy-metal runoff from the Pyongsan uranium mill.',
        credit: 'Channel A News (Jan 16, 2026)',
      },
      {
        src: '/img/articles/drone-sejong-raid.jpg',
        title: 'Raid on Sejong University (Jan 21, 2026)',
        caption: 'Joint Military-Police Task Force investigators carry a seized fixed-wing drone airframe (wrapped in white, left rear) and evidence boxes out of Chungmu-gwan at Sejong University.',
        credit: 'Yonhap / Segye Ilbo (Jan 21, 2026)',
      },
    ],
  },
  ko: {
    items: [
      {
        src: '/img/articles/drone-kim-chungshin.jpg',
        title: '2023년 4월 인터뷰 당시 김충신',
        caption: '뉴스1 인터뷰에서 자신이 수집한 북한 배지를 들고 있는 김충신. 당시 그는 북한 주민도 자유를 누려야 할 동포라며 청년 세대의 관심을 호소했다.',
        credit: '뉴스1 (2023.4.15)',
      },
      {
        src: '/img/articles/drone-mbc-chat.jpg',
        title: '제보된 카카오톡 단체 대화방 (2024년 5월)',
        caption: '"평양까지 보내는 방법도 다 테스트해봤고 / 성공도 했어요." 이후 대화에서는 남북 방공망을 2시간 가까이 유린해도 아무도 모른다고 과시했다.',
        credit: 'MBC 뉴스데스크 (2026.1.26)',
      },
      {
        src: '/img/articles/drone-oh-channela.png',
        title: '오종택의 채널A 인터뷰 (2026년 1월 16일)',
        caption: '군경 합동조사TF의 압수수색 직후 방송에 출연해 평산 우라늄 정련공장의 방사능·중금속 폐수 오염을 확인하려 무인기를 날렸다고 주장했다.',
        credit: '채널A 뉴스 (2026.1.16)',
      },
      {
        src: '/img/articles/drone-sejong-raid.jpg',
        title: '세종대학교 연구실 압수수색 (2026년 1월 21일)',
        caption: '군경 합동조사TF 수사관들이 세종대 충무관에서 흰 비닐로 감싼 고정익 무인기 기체(왼쪽 뒤)와 압수품을 옮기고 있다.',
        credit: '연합뉴스 / 세계일보 (2026.1.21)',
      },
    ],
  },
  ja: {
    items: [
      {
        src: '/img/articles/drone-kim-chungshin.jpg',
        title: '2023年4月のインタビュー当時のキム・チュンシン',
        caption: 'News1のインタビューで、収集した北朝鮮のバッジを手に持つキム・チュンシン。独裁下の北朝鮮の人々への若い世代の関心を訴えていた。',
        credit: 'News1 (2023.4.15)',
      },
      {
        src: '/img/articles/drone-mbc-chat.jpg',
        title: '内部告発されたカカオトークのグループチャット（2024年5月）',
        caption: '「平壌まで送る方法もすべてテストしたし、成功もしました」。後のメッセージでは南北の防空網を2時間近く突破しても誰も気づかないと誇示した。',
        credit: 'MBCニュースデスク (2026.1.26)',
      },
      {
        src: '/img/articles/drone-oh-channela.png',
        title: 'オ・ジョンテのチャンネルAインタビュー（2026年1月16日）',
        caption: '軍警合同調査TFの家宅捜索直後に出演し、平山ウラン工場の放射能・重金属廃水汚染を確かめるために飛ばしたと主張した。',
        credit: 'チャンネルAニュース (2026.1.16)',
      },
      {
        src: '/img/articles/drone-sejong-raid.jpg',
        title: '世宗大学研究室の家宅捜索（2026年1月21日）',
        caption: '軍警合同調査TFの捜査官らが世宗大学忠武館から白いビニールに包まれた固定翼ドローン機体（左奥）と押収箱を運び出している。',
        credit: '聯合ニュース / 世界日報 (2026.1.21)',
      },
    ],
  },
  zh: {
    items: [
      {
        src: '/img/articles/drone-kim-chungshin.jpg',
        title: '2023年4月接受采访时的金忠信',
        caption: '在News1采访中手持自己收集的朝鲜徽章。当时他呼吁韩国年轻人关注独裁统治下朝鲜普通人的处境。',
        credit: 'News1 (2023.4.15)',
      },
      {
        src: '/img/articles/drone-mbc-chat.jpg',
        title: '被举报的KakaoTalk群聊记录（2024年5月）',
        caption: '金忠信写道：“送到平壤的方法也都测试过了，而且成功了。”随后的消息中他还炫耀称穿越南北防空网近两小时也无人察觉。',
        credit: 'MBC新闻台 (2026.1.26)',
      },
      {
        src: '/img/articles/drone-oh-channela.png',
        title: '吴钟泽接受Channel A采访（2026年1月16日）',
        caption: '在军警联合调查组搜查其住所后不久出镜，声称放飞无人机只是出于个人好奇，想核实平山铀精炼厂的核废水与重金属污染。',
        credit: 'Channel A 新闻 (2026.1.16)',
      },
      {
        src: '/img/articles/drone-sejong-raid.jpg',
        title: '搜查世宗大学实验室（2026年1月21日）',
        caption: '军警联合调查组调查人员从世宗大学忠武馆搬出用白布包裹的固定翼无人机机体（左后方）及证物箱。',
        credit: '韩联社 / 世界日报 (2026.1.21)',
      },
    ],
  },
};

export function DroneEvidenceGallery({ lang = 'en' }: { lang?: Lang }) {
  const t = DRONE_EVIDENCE_TEXT[lang];
  return (
    <div className="drone-gallery">
      {t.items.map((it) => (
        <figure key={it.src} className="drone-fig">
          <img src={it.src} alt={it.title} loading="lazy" />
          <figcaption>
            <b>{it.title}</b>
            <span>{it.caption}</span>
            <small>{it.credit}</small>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

const DRONE_FRONT_TEXT: Record<Lang, { caption: string; credit: string }> = {
  en: {
    caption:
      'Website footers of NK Monitor (nkmonitor.co.kr) and Global Insight (globalinsight.co.kr), both registered on April 11, 2025 with Oh Jong-taek listed as publisher (발행인). Investigators allege that officers from the ROK Defense Intelligence Command (국군정보사령부) funneled about 13 million KRW (~$9,500) in operating funds to the group through these outlets.',
    credit: 'Screenshot via Newstapa (Jan 2026)',
  },
  ko: {
    caption:
      '2025년 4월 11일 같은 날 등록된 인터넷 매체 엔케이모니터(NK모니터)와 글로벌인사이트의 홈페이지 하단. 두 곳 모두 발행인은 오종택으로 등록됐으며, 수사당국은 국군정보사령부 요원들이 약 1,300만 원의 활동비를 이 매체들을 통해 지원했다고 보고 있다.',
    credit: '뉴스타파 화면 갈무리 (2026년 1월)',
  },
  ja: {
    caption:
      '2025年4月11日に同日登録されたネットメディア「NKモニター」と「グローバルインサイト」のフッター。いずれも発行人はオ・ジョンテとなっており、捜査当局は韓国軍情報司令部の要員が約1,300万ウォンの活動費をこのメディアを通じて渡したとみている。',
    credit: 'ニュースタパのスクリーンショット (2026年1月)',
  },
  zh: {
    caption:
      '2025年4月11日同一天注册的网络媒体“NK Monitor”与“Global Insight”网站底部信息。两家网站的发行人均为吴钟泽。调查机关认为，韩国国军情报司令部人员通过这两家媒体向他们提供了约1,300万韩元（约9,500美元）的活动经费。',
    credit: '截图自 Newstapa (2026年1月)',
  },
};

export function DroneFrontSites({ lang = 'en' }: { lang?: Lang }) {
  const t = DRONE_FRONT_TEXT[lang];
  return (
    <figure className="drone-wide-fig">
      <img src="/img/articles/drone-nkmonitor-footers.jpg" alt={t.caption} loading="lazy" />
      <figcaption>
        {t.caption} <span className="muted">({t.credit})</span>
      </figcaption>
    </figure>
  );
}

