import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JA_ARTICLES } from '@/content/translations/ja';
import { articleLanguages } from '@/content/translations';
import { REVIEWED } from '@/site/config';
import { Ext } from '@/components/Ext';
import { absolute, jsonLd, pageMeta } from '@/site/seo';
import { SITE_NAME, SITE_URL } from '@/site/config';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return JA_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const a = JA_ARTICLES.find((x) => x.slug === slug);
  if (!a) return {};

  return pageMeta({
    title: a.title,
    description: a.description,
    path: `/ja/learn/${a.slug}`,
    type: 'article',
    lang: 'ja',
    languages: articleLanguages(a.slug),
    image: `/ja/learn/${a.slug}/opengraph-image`,
  });
}

export default async function JapaneseArticlePage({ params }: Params) {
  const { slug } = await params;
  const a = JA_ARTICLES.find((x) => x.slug === slug);
  if (!a) notFound();

  const others = JA_ARTICLES.filter((x) => x.slug !== a.slug);

  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.h1,
    description: a.description,
    inLanguage: 'ja',
    dateModified: REVIEWED,
    mainEntityOfPage: absolute(`/ja/learn/${a.slug}`),
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
  const ld = [
    article,
    ...(a.faq?.length
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            inLanguage: 'ja',
            mainEntity: a.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
          },
        ]
      : []),
  ];

  return (
    <article className="prose">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <p className="eyebrow" style={{ margin: 0 }}>
          <Link href="/ja">日本語ハブ</Link> · 深層解説 · 読了 {a.minutes}分
        </p>
        <div style={{ fontSize: '0.82rem' }}>
          <Link href={articleLanguages(a.slug).en ?? '/learn'} className="chip" hrefLang="en" lang="en">English</Link>
        </div>
      </div>

      <h1>{a.h1}</h1>

      {a.content.map((p, i) => (
        <p key={i}>{p}</p>
      ))}

      {a.keyPoints && a.keyPoints.length > 0 && (
        <div style={{ margin: '2rem 0' }}>
          {a.keyPoints.map((kp, i) => (
            <div key={i} style={{ marginBottom: '1.8rem', paddingLeft: '1.2rem', borderLeft: '3px solid var(--accent)' }}>
              <h3 style={{ marginTop: 0, marginBottom: '0.4rem', fontSize: '1.15rem' }}>{kp.heading}</h3>
              <p style={{ margin: 0, lineHeight: '1.65' }}>{kp.body}</p>
            </div>
          ))}
        </div>
      )}

      {a.faq && a.faq.length > 0 && (
        <>
          <h2>よくある質問</h2>
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

      <aside className="act-box" style={{ marginTop: '2.5rem' }}>
        <b>脱北者の救出と人道支援に協力できます</b>
        <p>中国国内に潜伏する脱北難民を安全な第三国へ導く活動や、外部情報を北朝鮮へ届ける市民の取り組みを支援できます。</p>
        <Link className="btn primary" href="/act">
          支援と行動の方法を見る →
        </Link>
      </aside>

      <h2 style={{ marginTop: '2.5rem' }}>主な出典・報告書</h2>
      <ul className="sources">
        {a.sources.map((s, i) => (
          <li key={i}>
            <Ext href={s.url}>{s.label}</Ext>
          </li>
        ))}
      </ul>

      <h2 style={{ marginTop: '2.5rem' }}>関連解説記事</h2>
      <ul className="article-list">
        {others.map((o) => (
          <li key={o.slug}>
            <Link href={`/ja/learn/${o.slug}`}>
              <b>{o.h1}</b>
              <span>{o.teaser}</span>
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
