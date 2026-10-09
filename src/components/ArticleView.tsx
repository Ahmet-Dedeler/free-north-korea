/**
 * One /learn article in any language. The English, Korean, Japanese and Chinese routes are thin wrappers around this,
 * so all four get the same hero, visuals, FAQ, sources and structured data.
 */
import Link from 'next/link';
import type { Article } from '@/content/articles/types';
import { articleLanguages } from '@/content/translations';
import ArticleArt, { artCredit } from './ArticleArt';
import ArticleCards from './ArticleCards';
import { SourceCards } from './Visual';
import { SITE_NAME, SITE_URL } from '@/site/config';
import { LANG_TAG, absolute, jsonLd, type Lang } from '@/site/seo';

const UI: Record<
  Lang,
  { learn: string; learnHref: string; minRead: (n: number) => string; updated: string; faq: string; actTitle: string; actText: string; actBtn: string; sources: string; more: string; locale: string }
> = {
  en: {
    learn: 'Learn',
    learnHref: '/learn',
    minRead: (n) => `${n} min read`,
    updated: 'Updated',
    faq: 'Quick answers',
    actTitle: 'Want to do something about it?',
    actText: 'Fund a rescue, send information in, or support the people documenting abuses. Takes about ten minutes to start.',
    actBtn: 'See what you can do',
    sources: 'Sources',
    more: 'Keep reading',
    locale: 'en-GB',
  },
  ko: {
    learn: '해설',
    learnHref: '/ko',
    minRead: (n) => `${n}분 분량`,
    updated: '업데이트',
    faq: '짧은 답',
    actTitle: '뭔가 해보고 싶다면',
    actText: '구출 비용을 보태거나, 정보를 들여보내거나, 인권 침해를 기록하는 사람들을 도울 수 있다. 시작하는 데 10분이면 된다.',
    actBtn: '할 수 있는 일 보기',
    sources: '출처',
    more: '더 읽기',
    locale: 'ko-KR',
  },
  ja: {
    learn: '解説',
    learnHref: '/ja',
    minRead: (n) => `${n}分で読める`,
    updated: '更新',
    faq: '短い答え',
    actTitle: '何かしたいなら',
    actText: '救出を支援する、情報を届ける、人権侵害を記録する人たちを支える。始めるのに10分くらいしかかからない。',
    actBtn: 'できることを見る',
    sources: '出典',
    more: '続けて読む',
    locale: 'ja-JP',
  },
  zh: {
    learn: '解读',
    learnHref: '/zh',
    minRead: (n) => `约${n}分钟读完`,
    updated: '更新于',
    faq: '简短回答',
    actTitle: '想做点什么？',
    actText: '资助一次营救，把信息送进去，或者支持那些记录人权侵害的人。开始只需要十分钟左右。',
    actBtn: '看看你能做什么',
    sources: '来源',
    more: '继续阅读',
    locale: 'zh-CN',
  },
};

const LANG_LABEL: Record<Lang, string> = { en: 'English', ko: '한국어', ja: '日本語', zh: '中文' };

export default function ArticleView({ a, others }: { a: Article; others: Article[] }) {
  const lang = a.lang ?? 'en';
  const t = UI[lang];
  const path = articleLanguages(a.slug)[lang] ?? `/learn/${a.slug}`;
  const url = absolute(path);
  const langs = articleLanguages(a.slug);
  const credit = artCredit(a);
  const updated = new Date(a.updated + 'T00:00:00Z').toLocaleDateString(t.locale, { timeZone: 'UTC', day: 'numeric', month: 'short', year: 'numeric' });

  const ld = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: a.h1,
      description: a.description,
      inLanguage: LANG_TAG[lang],
      dateModified: a.updated,
      mainEntityOfPage: url,
      author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: t.learn, item: absolute(t.learnHref) },
        { '@type': 'ListItem', position: 2, name: a.h1, item: url },
      ],
    },
    ...(a.faq?.length
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            inLanguage: LANG_TAG[lang],
            mainEntity: a.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
          },
        ]
      : []),
  ];

  const otherLangs = (Object.keys(langs) as Lang[]).filter((l) => l !== lang);

  return (
    <article className="article">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />
      <header className="art-hero">
        <ArticleArt a={a} height={420} />
        <div className="art-hero-text">
          <p className="eyebrow">
            <Link href={t.learnHref}>{t.learn}</Link> · {t.minRead(a.minutes)} · {t.updated} {updated}
          </p>
          <h1>{a.h1}</h1>
          {otherLangs.length > 0 && (
            <p className="art-langs">
              {otherLangs.map((l) => (
                <Link key={l} href={langs[l]!} hrefLang={l} lang={l}>
                  {LANG_LABEL[l]}
                </Link>
              ))}
            </p>
          )}
        </div>
        {credit && (
          <a className="art-credit" lang="en" href={credit.sourceUrl} target={credit.sourceUrl.startsWith('/') ? undefined : '_blank'} rel="noopener noreferrer">
            {credit.credit}
          </a>
        )}
      </header>
      <div className="prose">
        {a.body()}

        {a.faq && (
          <>
            <h2>{t.faq}</h2>
            <dl className="faq">
              {a.faq.map((f) => (
                <div key={f.q}>
                  <dt>{f.q}</dt>
                  <dd>{f.a}</dd>
                </div>
              ))}
            </dl>
          </>
        )}

        <div className="act-box" role="note">
          <b>{t.actTitle}</b>
          <p>{t.actText}</p>
          <Link className="btn primary" href="/act">
            {t.actBtn}
          </Link>
        </div>

        <h2>{t.sources}</h2>
        <SourceCards sources={a.sources.map((s) => ({ name: s.label, url: s.url }))} />
      </div>

      {others.length > 0 && (
        <>
          <h2 className="keep-h">{t.more}</h2>
          <ArticleCards articles={others} />
        </>
      )}
    </article>
  );
}
