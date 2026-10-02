import Link from 'next/link';
import { KO_HUB, KO_ARTICLES } from '@/content/translations/ko';
import { pageMeta } from '@/site/seo';

export const metadata = pageMeta({
  title: KO_HUB.title,
  description: KO_HUB.description,
  path: '/ko',
});

export default function KoreanHubPage() {
  return (
    <div className="wide">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <p className="eyebrow" style={{ margin: 0 }}>{KO_HUB.eyebrow}</p>
        <div style={{ fontSize: '0.85rem' }}>
          <Link href="/" className="chip">English</Link>
          {' '}
          <span className="chip on">한국어</span>
          {' '}
          <Link href="/ja" className="chip">日本語</Link>
        </div>
      </div>

      <h1>{KO_HUB.heading}</h1>
      <p className="lede">{KO_HUB.lede}</p>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', margin: '2rem 0' }}>
        <Link href="/map" className="chip on">
          대화형 인텔 지도 열기 (지도 보기) →
        </Link>
        <Link href="/camps" className="chip">
          정치범수용소 도감 (24개소) →
        </Link>
        <Link href="/counties" className="chip">
          179개 시·군 인권 지도 →
        </Link>
        <Link href="/missiles" className="chip">
          미사일 실험 데이터베이스 →
        </Link>
      </div>

      <section style={{ marginTop: '3.5rem' }}>
        <h2>핵심 심층 해설</h2>
        <p className="muted">북한 체제의 구조적 현실과 자유를 향한 경로를 정리한 검증된 심층 분석입니다.</p>
        <div className="cards two" style={{ marginTop: '1.5rem' }}>
          {KO_ARTICLES.map((a) => (
            <article key={a.slug} className="card">
              <p className="kicker" style={{ color: 'var(--accent)' }}>
                심층 분석 · {a.minutes}분 소요
              </p>
              <h3>
                <Link href={`/ko/learn/${a.slug}`}>{a.h1}</Link>
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--ink-2)', marginTop: '0.5rem', lineHeight: '1.5' }}>
                {a.teaser}
              </p>
              <p style={{ marginTop: '1.2rem', fontSize: '0.88rem' }}>
                <Link href={`/ko/learn/${a.slug}`}>전문 읽기 →</Link>
              </p>
            </article>
          ))}
        </div>
      </section>

      <section style={{ marginTop: '4rem' }}>
        <h2>데이터와 아카이브</h2>
        <div className="cards three" style={{ marginTop: '1.5rem' }}>
          <div className="card">
            <h4>
              <Link href="/camps">정치범수용소 (관리소·교화소)</Link>
            </h4>
            <p className="muted" style={{ fontSize: '0.88rem', marginTop: '0.4rem' }}>
              14호 개천, 15호 요덕, 16호 화성 등 24개 주요 수용소의 위치, 추정 수감 인원, 위성 감시 기록.
            </p>
          </div>
          <div className="card">
            <h4>
              <Link href="/counties">179개 시·군 인권 아틀라스</Link>
            </h4>
            <p className="muted" style={{ fontSize: '0.88rem', marginTop: '0.4rem' }}>
              북한인권정보센터(NKDB) 피해 증언 데이터와 2008년 인구총조사 통계를 결합한 지역별 인권 지표.
            </p>
          </div>
          <div className="card">
            <h4>
              <Link href="/organizations">탈북민 지원 단체 디렉토리</Link>
            </h4>
            <p className="muted" style={{ fontSize: '0.88rem', marginTop: '0.4rem' }}>
              현장 구출, 긴급 지원, 법률 지원, 정보 유입 활동을 펼치는 국내외 검증된 비영리 단체 명단.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
