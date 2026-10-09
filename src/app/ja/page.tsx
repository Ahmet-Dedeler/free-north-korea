import Link from 'next/link';
import ArticleCards from '@/components/ArticleCards';
import WatchTeaser from '@/components/WatchTeaser';
import { JA_HUB, JA_ARTICLES } from '@/content/translations/ja';
import { pageMeta } from '@/site/seo';
import { HUB_PATHS } from '@/content/translations';

export const metadata = {
  ...pageMeta({
  title: JA_HUB.title,
  description: JA_HUB.description,
  path: '/ja',
  lang: 'ja',
  languages: HUB_PATHS,
  }),
  // the hub title already names the site, so skip the "| Free North Korea" template
  title: { absolute: JA_HUB.title },
};

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
          {' '}
          <Link href="/zh" className="chip">中文</Link>
        </div>
      </div>

      <h1>{JA_HUB.heading}</h1>
      <p className="lede">{JA_HUB.lede}</p>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', margin: '2rem 0' }}>
        <Link href="/map" className="chip on">
          インタラクティブ軍事・人権地図を開く →
        </Link>
        <Link href="/ja/camps" className="chip">
          政治犯収容所一覧（24施設） →
        </Link>
        <Link href="/ja/places" className="chip">
          核・ミサイル関連重要拠点 →
        </Link>
        <Link href="/ja/sanctions" className="chip">
          対北朝鮮制裁リスト →
        </Link>
        <Link href="/missiles" className="chip">
          ミサイル発射実験データベース →
        </Link>
      </div>

      <WatchTeaser lang="ja" />

      <section style={{ marginTop: '3.5rem' }}>
        <h2>主要テーマ・深層解説</h2>
        <p className="muted">体制の抑圧構造、日本人拉致問題、帰還事業、そして脱北者支援の実態を整理した客観的レポートです。</p>
        <div style={{ marginTop: '1.5rem' }}>
          <ArticleCards articles={JA_ARTICLES} lead />
        </div>
      </section>

      <section style={{ marginTop: '4rem' }}>
        <h2>データベースとアーカイブ</h2>
        <div className="cards three" style={{ marginTop: '1.5rem' }}>
          <div className="card">
            <h3>
              <Link href="/ja/camps">政治犯収容所（管理所・教化所）</Link>
            </h3>
            <p className="muted" style={{ fontSize: '0.88rem', marginTop: '0.4rem' }}>
              第14号价川、第15号耀徳、第16号化成など主要施設の衛星画像解析と証言に基づく実態。
            </p>
          </div>
          <div className="card">
            <h3>
              <Link href="/ja/counties">北朝鮮179市郡人権アトラス</Link>
            </h3>
            <p className="muted" style={{ fontSize: '0.88rem', marginTop: '0.4rem' }}>
              NKDBに記録された人権侵害事案と2008年公式国勢調査の人口データを統合した地域別指標。
            </p>
          </div>
          <div className="card">
            <h3>
              <Link href="/ja/library">文献・報告書ライブラリ</Link>
            </h3>
            <p className="muted" style={{ fontSize: '0.88rem', marginTop: '0.4rem' }}>
              国連調査委員会報告書、脱北生還者の手記、ドキュメンタリー映画、オープンデータツール集。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
