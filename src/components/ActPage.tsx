import type { ReactNode } from 'react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  Ban,
  BookOpen,
  CalendarDays,
  Clock,
  Code,
  GraduationCap,
  HandCoins,
  Languages,
  Mail,
  MessageCircleWarning,
  PenLine,
  Plane,
  Satellite,
  Scale,
  Share2,
  Star,
  Timer,
  Wrench,
} from 'lucide-react';
import { Ext } from '@/components/Ext';
import { ACT_GROUPS, ACT_TEXT, type ActStepIcon } from '@/content/act';
import { orgLogo } from '@/content/media';
import { REPO_URL } from '@/site/config';
import type { Lang } from '@/site/seo';

const ROOT: Record<Lang, string> = { en: '', ko: '/ko', ja: '/ja', zh: '/zh' };

/** English names kept as published. Longer phrases first so they win the match. */
const EN_KEPT = [
  'Liberty in North Korea',
  'Flash Drives for Freedom',
  'Freedom Speakers International',
  'Unification Media Group',
  'how to free North Korea',
  'Beyond Utopia',
  'Korea Future',
  'Daily NK',
  'NK News',
  'microSD',
  'GitHub',
  'NKDB',
  'TJWG',
  'TNKR',
  'LiNK',
  'USB',
].sort((a, b) => b.length - a.length);

const EN_PATTERN = EN_KEPT.map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');

const GROUP_ICONS: LucideIcon[] = [Timer, Clock, CalendarDays];
const STEP_ICONS: Record<ActStepIcon, LucideIcon> = {
  share: Share2,
  star: Star,
  mail: Mail,
  book: BookOpen,
  coins: HandCoins,
};
const SKILL_ICONS: LucideIcon[] = [Code, Satellite, Languages, PenLine, GraduationCap, Scale];
const DONT_ICONS: LucideIcon[] = [Plane, HandCoins, MessageCircleWarning];

/** Home is '' | '/ko' | '/ja' | '/zh'. The map and the missile explorer stay on the English URL. */
function localizeHref(lang: Lang, href: string) {
  if (/^https?:\/\//.test(href)) return href;
  const path = href.split(/[?#]/)[0];
  if (path === '/map' || path === '/missiles') return href;
  if (href === '/') return ROOT[lang] || '/';
  return `${ROOT[lang]}${href}`;
}

function EnText({ lang, text }: { lang: Lang; text: string }) {
  if (lang === 'en' || !text) return text;
  const nodes: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(new RegExp(EN_PATTERN, 'g'))) {
    const i = match.index ?? 0;
    if (i > last) nodes.push(text.slice(last, i));
    nodes.push(
      <span key={i} lang="en">
        {match[0]}
      </span>,
    );
    last = i + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

/** /act, shared by the English, Korean, Japanese and Chinese routes. */
export default function ActPage({ lang }: { lang: Lang }) {
  const t = ACT_TEXT[lang];

  return (
    <div className="wide">
      <p className="eyebrow">{t.eyebrow}</p>
      <h1>{t.h1}</h1>
      <p className="lede">
        <EnText lang={lang} text={t.lede} />
      </p>

      {t.groups.map((g, i) => {
        const GroupIcon = GROUP_ICONS[i];
        return (
          <section key={g.time} className="act-group">
            <h2 className="act-h">
              <span className="act-time">
                <GroupIcon size={18} /> {g.time}
              </span>
              <small>{g.intro}</small>
            </h2>
            <div className="quick-acts">
              {g.steps.map((s, j) => {
                const step = ACT_GROUPS[i].steps[j];
                const logo = step.org ? orgLogo(step.org) : undefined;
                const Icon = (step.icon && STEP_ICONS[step.icon]) ?? ArrowRight;
                const inner = (
                  <>
                    <span className={`hl-logo ${logo ? '' : 'icon'}`}>{logo ? <img src={logo.src} alt="" /> : <Icon size={22} />}</span>
                    <b>
                      <EnText lang={lang} text={s.title} />
                    </b>
                    <span>
                      <EnText lang={lang} text={s.text} />
                    </span>
                    <em>
                      <EnText lang={lang} text={s.cta} /> <ArrowRight size={14} />
                    </em>
                  </>
                );
                return step.ext ? (
                  <Ext key={s.title} className="quick-act" href={step.href}>
                    {inner}
                  </Ext>
                ) : (
                  <Link key={s.title} className="quick-act" href={localizeHref(lang, step.href)}>
                    {inner}
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}

      <section className="act-group">
        <h2 className="act-h">
          <span className="act-time">
            <Wrench size={18} /> {t.skillsTitle}
          </span>
          <small>{t.skillsIntro}</small>
        </h2>
        <ul className="icon-cards">
          {t.skills.map((s, i) => {
            const Icon = SKILL_ICONS[i];
            return (
              <li key={s.who}>
                <span className="ic-icon">
                  <Icon size={20} />
                </span>
                <b>
                  <EnText lang={lang} text={s.who} />
                </b>
                <p>
                  <EnText lang={lang} text={s.what} />
                </p>
              </li>
            );
          })}
        </ul>
        <p>
          <Ext className="btn primary" href={REPO_URL}>
            <EnText lang={lang} text={t.contribute} />
          </Ext>
        </p>
      </section>

      <section className="act-group">
        <h2 className="act-h">
          <span className="act-time danger">
            <Ban size={18} /> {t.dontTitle}
          </span>
        </h2>
        <ul className="dont">
          {t.dont.map((d, i) => {
            const Icon = DONT_ICONS[i];
            return (
              <li key={d.title}>
                <Icon size={20} />
                <span>
                  <b>
                    <EnText lang={lang} text={d.title} />
                  </b>{' '}
                  <EnText lang={lang} text={d.text} />
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
