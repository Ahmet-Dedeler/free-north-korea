import Link from 'next/link';
import { TrendingDown, UserRound, Users } from 'lucide-react';
import { ArrivalsChart, BorderMap, EscapeRoute, Stats, Tldr } from '@/components/ArticleBlocks';
import { OrgLink, PlaceLink } from '@/components/HoverLinks';
import en from '../how-north-koreans-escape';
import type { Article } from '../types';

const article: Article = {
  slug: en.slug,
  lang: 'zh',
  title: '朝鲜人是怎样逃出来的？路线、费用和风险',
  h1: '朝鲜人是怎样逃出来的',
  description:
    '2026年人们怎样逃离朝鲜：越境进入中国，穿过东南亚约4,800公里的路线，中间人的费用，强制遣返，以及抵达韩国之后。',
  teaser: '过河，藏身中国，南下东南亚约4,800公里的路，以及为什么2025年只有224人成功。',
  updated: en.updated,
  minutes: 6,
  body: () => (
    <>
      <p className="lede">
        2025年，有224名朝鲜人抵达韩国。疫情之前每年超过1,000人，2009年接近3,000人。那是人们不想走了吗？大概不是。是边境和中国都变得难过得多了。
      </p>

      <Stats
        items={[
          { icon: TrendingDown, value: '224', label: '2025年抵达韩国的人数', note: '韩国统一部', tone: 'danger' },
          { icon: UserRound, value: '198', label: '其中女性', note: '2025年' },
          { icon: Users, value: '34,538', label: '累计抵达人数', note: '截至2025年底' },
        ]}
      />

      <EscapeRoute lang="zh" />

      <h2 id="border">第一步：越过边境</h2>
      <p>
        几乎所有人都经中国离开，渡过图们江或鸭绿江。常见的越境地段在<PlaceLink slug="hyesan">惠山</PlaceLink>、
        <PlaceLink slug="musan">茂山</PlaceLink>和<PlaceLink slug="hoeryong">会宁</PlaceLink>这些边境城镇附近（也标在
        <Link href="/map">情报地图</Link>上）。
      </p>
      <BorderMap lang="zh" />
      <p>
        2020年以来，朝鲜修了新的围栏，增设了哨所，还给边防兵下达了格杀令，所以现在基本上必须找一个能买通边防兵的中间人。价格已经翻了好多倍。
      </p>
      <p>从海上或者直接穿越非军事区逃走的情况也有，但很少。这些案例之所以上新闻，正是因为太罕见了。</p>

      <h2 id="china">第二步：藏身中国</h2>
      <p>
        中国把朝鲜人当作非法经济移民而不是难民，并把他们遣返回去。女性（2025年224人中有198人）常常被拐卖，被迫嫁人或被卖入色情行业，很多人在中国没有身份证件地生活好多年。人脸识别、汽车和火车上的身份检查、手机追踪，让现在光是走动都非常困难。
      </p>
      <p>
        被抓到就会被遣返。2023年10月，中国在一次行动中遣返了约500到600人。回国后他们要接受审讯，凡是和韩国人或基督徒有过接触的，都可能被送进
        <Link href="/zh/learn/north-korea-prison-camps">政治犯收容所</Link>。
      </p>

      <h2 id="route">第三步：漫长的出路</h2>
      <p>
        常走的路线是从中国一路向南约4,800公里进入东南亚，通常先到老挝，再到泰国。在泰国，脱北者可以向当局自首，最终被送往韩国（以前蒙古也是一条路）。这一程要走好几个星期：安全屋、长途汽车、夜里穿越丛林。像
        <OrgLink lang="zh" id="liberty-in-north-korea">Liberty in North Korea</OrgLink>这样的营救机构资助的就是这一段，每人约3,000美元。
      </p>

      <h2 id="south-korea">第四步：韩国</h2>
      <p>
        先由韩国情报部门审查，然后在安置机构统一院（Hanawon）住大约三个月，学习怎样在市场经济里生活。他们会获得公民身份，以及住房和就业方面的一些帮助。
      </p>
      <p>
        但日子仍然很难。陌生的技术，大量不同的词汇（韩国话里满是英语外来词），歧视，还有留在北边的家人。
        <OrgLink lang="zh" id="fsi">Freedom Speakers International</OrgLink>和<OrgLink lang="zh" id="pscore">PSCORE</OrgLink>
        这样的机构帮助他们学英语、上学和练习公开演讲。
      </p>

      <h2 id="numbers">数字</h2>
      <p>把鼠标移到柱子上可以看到年份。新冠期间封锁边境几乎让一切停了下来，之后再也没有真正恢复：</p>
      <ArrivalsChart lang="zh" />

      <Tldr
        lang="zh"
        items={[
          '几乎所有人都是过河进入中国，躲藏下来，再走约4,800公里到东南亚，然后去韩国。',
          '2025年只有224人成功，2009年约有3,000人，因为边境和中国的监控都变得严密得多。',
          '约3,000美元可以资助一次营救。在中国被抓就意味着被遣返。',
        ]}
      />
    </>
  ),
  faq: [
    {
      q: '每年有多少朝鲜人逃出来？',
      a: '据韩国统一部统计，2025年有224名朝鲜人抵达韩国。这远低于疫情前每年约1,000人的水平，也远低于2009年2,914人的峰值。',
    },
    {
      q: '中国为什么遣返朝鲜难民？',
      a: '根据与朝鲜的协议，中国把朝鲜人归为非法经济移民而不是难民。人权组织和联合国认为这违反了不驱回原则，因为被遣返的人会遭受酷刑和监禁。',
    },
    {
      q: '朝鲜脱北者走的是什么路线？',
      a: '大多数人先过河进入中国并躲藏下来，然后向南穿过中国约4,800公里进入东南亚（通常是老挝和泰国），在那里被转送到韩国。',
    },
  ],
  sources: en.sources,
};

export default article;
