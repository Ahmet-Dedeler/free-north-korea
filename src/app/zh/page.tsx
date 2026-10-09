import Link from 'next/link';
import ArticleCards from '@/components/ArticleCards';
import WatchTeaser from '@/components/WatchTeaser';
import { ZH_HUB, ZH_ARTICLES } from '@/content/translations/zh';
import { pageMeta } from '@/site/seo';
import { HUB_PATHS } from '@/content/translations';

export const metadata = {
  ...pageMeta({
    title: ZH_HUB.title,
    description: ZH_HUB.description,
    path: '/zh',
    lang: 'zh',
    languages: HUB_PATHS,
  }),
  // the hub title already names the site, so skip the "| Free North Korea" template
  title: { absolute: ZH_HUB.title },
};

export default function ChineseHubPage() {
  return (
    <div className="wide">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <p className="eyebrow" style={{ margin: 0 }}>{ZH_HUB.eyebrow}</p>
        <div style={{ fontSize: '0.85rem' }}>
          <Link href="/" className="chip">English</Link>
          {' '}
          <Link href="/ko" className="chip">한국어</Link>
          {' '}
          <Link href="/ja" className="chip">日本語</Link>
          {' '}
          <span className="chip on">中文</span>
        </div>
      </div>

      <h1>{ZH_HUB.heading}</h1>
      <p className="lede">{ZH_HUB.lede}</p>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', margin: '2rem 0' }}>
        <Link href="/map" className="chip on">
          打开交互式情报地图 →
        </Link>
        <Link href="/zh/camps" className="chip">
          政治犯收容所图鉴（24处） →
        </Link>
        <Link href="/zh/north-korea-vs-south-korea" className="chip">
          朝鲜与韩国对比 →
        </Link>
        <Link href="/zh/sanctions" className="chip">
          对朝制裁名单 →
        </Link>
        <Link href="/zh/data" className="chip">
          图表与数据 →
        </Link>
        <Link href="/missiles" className="chip">
          导弹试射数据库 →
        </Link>
      </div>

      <WatchTeaser lang="zh" />

      <section style={{ marginTop: '3.5rem' }}>
        <h2>深度解读</h2>
        <p className="muted">关于朝鲜体制的现实，以及通往自由的路径，经过核实的深度分析。</p>
        <div style={{ marginTop: '1.5rem' }}>
          <ArticleCards articles={ZH_ARTICLES} lead />
        </div>
      </section>

      <section style={{ marginTop: '4rem' }}>
        <h2>数据与档案</h2>
        <div className="cards three" style={{ marginTop: '1.5rem' }}>
          <div className="card">
            <h3>
              <Link href="/zh/camps">政治犯收容所（管理所・教化所）</Link>
            </h3>
            <p className="muted" style={{ fontSize: '0.88rem', marginTop: '0.4rem' }}>
              14号价川、15号耀德、16号化城等24处主要收容所的位置、估计关押人数和卫星监测记录。（英文）
            </p>
          </div>
          <div className="card">
            <h3>
              <Link href="/zh/counties">179个市郡人权地图</Link>
            </h3>
            <p className="muted" style={{ fontSize: '0.88rem', marginTop: '0.4rem' }}>
              结合朝鲜人权信息中心（NKDB）的受害证词数据和2008年人口普查统计的地区人权指标。（英文）
            </p>
          </div>
          <div className="card">
            <h3>
              <Link href="/zh/organizations">脱北者援助机构名录</Link>
            </h3>
            <p className="muted" style={{ fontSize: '0.88rem', marginTop: '0.4rem' }}>
              从事实地营救、紧急援助、法律援助和信息传入的、经过核实的各国非营利机构。（英文）
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
