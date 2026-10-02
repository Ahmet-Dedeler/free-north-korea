import Link from 'next/link';
import { notFound } from 'next/navigation';
import { KO_ARTICLES } from '@/content/translations/ko';
import { Ext } from '@/components/Ext';
import { absolute, jsonLd, pageMeta } from '@/site/seo';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return KO_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const a = KO_ARTICLES.find((x) => x.slug === slug);
  if (!a) return {};

  return pageMeta({
    title: `${a.title} | 자유 북한`,
    description: a.description,
    path: `/ko/learn/${a.slug}`,
    type: 'article',
  });
}

export default async function KoreanArticlePage({ params }: Params) {
  const { slug } = await params;
  const a = KO_ARTICLES.find((x) => x.slug === slug);
  if (!a) notFound();

  const others = KO_ARTICLES.filter((x) => x.slug !== a.slug);

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.h1,
    description: a.description,
    inLanguage: 'ko',
    mainEntityOfPage: absolute(`/ko/learn/${a.slug}`),
    publisher: {
      '@type': 'Organization',
      name: 'Free North Korea',
      url: 'https://liberatenorthkorea.com',
    },
  };

  return (
    <article className="prose">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <p className="eyebrow" style={{ margin: 0 }}>
          <Link href="/ko">한국어 허브</Link> · 심층 해설 · {a.minutes}분 소요
        </p>
        <div style={{ fontSize: '0.82rem' }}>
          <Link href="/learn" className="chip">English</Link>
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

      <aside className="act-box" style={{ marginTop: '2.5rem' }}>
        <b>탈북민 구출과 인권 회복에 동참할 수 있습니다</b>
        <p>10분의 관심과 참여로 중국 내 억류된 탈북 난민을 안전한 자유의 땅으로 인도하는 일에 함께할 수 있습니다.</p>
        <Link className="btn primary" href="/act">
          행동할 수 있는 방법 보기 →
        </Link>
      </aside>

      <h2 style={{ marginTop: '2.5rem' }}>주요 근거 자료 및 보고서</h2>
      <ul className="sources">
        {a.sources.map((s, i) => (
          <li key={i}>
            <Ext href={s.url}>{s.label}</Ext>
          </li>
        ))}
      </ul>

      <h2 style={{ marginTop: '2.5rem' }}>관련 해설 더 읽기</h2>
      <ul className="article-list">
        {others.map((o) => (
          <li key={o.slug}>
            <Link href={`/ko/learn/${o.slug}`}>
              <b>{o.h1}</b>
              <span>{o.teaser}</span>
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
