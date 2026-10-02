import Link from 'next/link';
import { JA_HUB, JA_ARTICLES } from '@/content/translations/ja';
import { pageMeta } from '@/site/seo';

export const metadata = pageMeta({
  title: JA_HUB.title,
  description: JA_HUB.description,
  path: '/ja',
});

export default function JapaneseHubPage() {
  return (
    <div className="wide">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <p className="eyebrow" style={{ margin: 0 }}>{JA_HUB.eyebrow}</p>
        <div style={{ fontSize: '0.85rem' }}>
          <Link href="/" className="chip">English</Link>
          {' '}
          <Link href="/ko" className="chip">한국어</Link>
          {' '}
          <span className="chip on">日本語</span>
        </div>
      </div>

      <h1>{JA_HUB.heading}</h1>
      <p className="lede">{JA_HUB.lede}</p>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', margin: '2rem 0' }}>
        <Link href="/map" className="chip on">
          インタラクティブ軍事・人権地図を開く →
        </Link>
        <Link href="/camps" className="chip">
          政治犯収容所一覧（24施設） →
        </Link>
        <Link href="/places" className="chip">
          核・ミサイル関連重要拠点 →
        </Link>
        <Link href="/missiles" className="chip">
          ミサイル発射実験データベース →
        </Link>
      </div>

      <section style={{ marginTop: '3.5rem' }}>
        <h2>主要テーマ・深層解説</h2>
        <p className="muted">体制の抑圧構造、日本人拉致問題、帰還事業、そして脱北者支援の実態を整理した客観的レポートです。</p>
        <div className="cards two" style={{ marginTop: '1.5rem' }}>
          {JA_ARTICLES.map((a) => (
            <article key={a.slug} className="card">
              <p className="kicker" style={{ color: 'var(--accent)' }}>
                解説レポート · 読了目安 {a.minutes}分
              </p>
              <h3>
                <Link href={`/ja/learn/${a.slug}`}>{a.h1}</Link>
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--ink-2)', marginTop: '0.5rem', lineHeight: '1.5' }}>
                {a.teaser}
              </p>
              <p style={{ marginTop: '1.2rem', fontSize: '0.88rem' }}>
                <Link href={`/ja/learn/${a.slug}`}>記事を読む →</Link>
              </p>
            </article>
          ))}
        </div>
      </section>

      <section style={{ marginTop: '4rem' }}>
        <h2>データベースとアーカイブ</h2>
        <div className="cards three" style={{ marginTop: '1.5rem' }}>
          <div className="card">
            <h4>
              <Link href="/camps">政治犯収容所（管理所・教化所）</Link>
            </h4>
            <p className="muted" style={{ fontSize: '0.88rem', marginTop: '0.4rem' }}>
              第14号价川、第15号耀徳、第16号化成など主要施設の衛星画像解析と証言に基づく実態。
            </p>
          </div>
          <div className="card">
            <h4>
              <Link href="/counties">北朝鮮179市郡人権アトラス</Link>
            </h4>
            <p className="muted" style={{ fontSize: '0.88rem', marginTop: '0.4rem' }}>
              NKDBに記録された人権侵害事案と2008年公式国勢調査の人口データを統合した地域別指標。
            </p>
          </div>
          <div className="card">
            <h4>
              <Link href="/library">文献・報告書ライブラリ</Link>
            </h4>
            <p className="muted" style={{ fontSize: '0.88rem', marginTop: '0.4rem' }}>
              国連調査委員会報告書、脱北生還者の手記、ドキュメンタリー映画、オープンデータツール集。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
