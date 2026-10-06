import Link from 'next/link';
import { Channels, OrgActions, Timeline, Tldr } from '@/components/ArticleBlocks';
import { OrgLink } from '@/components/HoverLinks';
import en from '../information-into-north-korea';
import type { Article } from '../types';

const article: Article = {
  slug: en.slug,
  lang: 'zh',
  title: '外部信息怎样进入朝鲜：U盘、广播、气球',
  h1: '外部信息是怎样进入朝鲜的',
  description:
    'U盘、SD卡、广播和气球：外国影视怎样到达朝鲜人手中，2025年资金削减后发生了什么变化，以及如何支持。',
  teaser: 'U盘、SD卡、短波广播和气球。2025年削减之后哪些渠道还管用，以及怎样支持。',
  updated: en.updated,
  minutes: 6,
  body: () => (
    <>
      <p className="lede">
        朝鲜2,600万人中的大多数，其实并不知道别处的人是怎么生活的。我猜这比任何导弹都更能让政权活下去。每一条把外部信息带进去的渠道都在一点点削弱这一点，而这也是外面的普通人能直接帮上忙的领域。
      </p>

      <Channels lang="zh" />

      <h2 id="usb">U盘和SD卡</h2>
      <p>
        这是现在的主要渠道。很多家庭都有一台“Notel”（一种便宜的中国产播放器），或者一部能读SD卡和microSD卡的手机。U盘经由中朝边境的商人藏在货物里带进去，然后被拷贝、手手相传。microSD卡又小又便宜，容易藏（也容易吞下去），所以各机构都改用它了。
      </p>
      <p>
        里面装的是什么？主要是韩剧和韩国电影、K-pop、新闻、韩文维基百科和脱北者的证词。不需要谁去说教。看看首尔一个普通的晚上是什么样子，这件事自己就说明了一切。
      </p>
      <p>
        <OrgLink id="flash-drives-for-freedom">Flash Drives for Freedom</OrgLink>
        （人权基金会）收集捐赠的U盘，称已有超过14万个被捐赠或承诺捐赠。它在2026年仍然活跃（很多人以为它已经停了）。
      </p>

      <h2 id="radio">广播</h2>
      <p>
        官方收音机被固定在国家频道上，但改装过的或走私进去的收音机夜里可以收到短波和中波广播。而这正是2025年被削减得最厉害的渠道：美国终止资助后，自由亚洲电台韩语节目于2025年7月17日停播，美国之音被大幅裁撤，韩国新政府也在2025年6月停止了自己的对朝广播和边境喇叭。所以像
        <OrgLink id="unification-media-group">国民统一广播（Unification Media Group）</OrgLink>
        这样的独立广播机构，如今在剩下的渠道里占了大得多的比重。
      </p>

      <h2 id="balloons">气球</h2>
      <p>
        几十年来，韩国的活动人士一直用气球把传单、U盘、美元和大米飘过边境。2024年朝鲜以数千个垃圾气球回敬。2025年韩国政府要求活动人士停下来，并开始执行放飞禁令，多数团体暂停了。气球是最显眼的方法，但大概不是最有效的。
      </p>

      <h2>朝鲜人要付出的代价</h2>
      <p>代价很大。政权不断专门针对这件事立新法：</p>
      <Timeline
        items={[
          {
            date: '2020年12月',
            title: '《反动思想文化排斥法》',
            text: '观看或保存韩国影视判5到10年劳动教养，“情节严重”的更重；大规模传播的可判死刑。',
            tone: 'danger',
          },
          { date: '2022年8月', title: '同一部法律被修订', text: '两年后进一步收紧。' },
          {
            date: '2023年1月',
            title: '《平壤文化语保护法》',
            text: '把像韩国人那样说话（俚语、说法）定为犯罪，最高可判死刑。',
            tone: 'danger',
          },
          { date: '2025年', title: '联合国报告证实处决', text: '有人因传播外国影视被处决。', tone: 'danger' },
        ]}
      />
      <p>人们还是照做。我想这说明了他们有多想看。</p>

      <h2>怎样帮忙</h2>
      <OrgActions lang="zh" ids={['flash-drives-for-freedom', 'unification-media-group', 'daily-nk']} />
      <ul>
        <li>
          把闲置的U盘或microSD卡寄给<a href="https://flashdrivesforfreedom.org/">Flash Drives for Freedom</a>。
        </li>
        <li>
          捐助制作和运送内容的机构（见<Link href="/organizations">机构名录</Link>中的信息类，英文）。
        </li>
        <li>要求你所在国家的政府恢复对韩语广播的资助。</li>
      </ul>

      <Tldr
        lang="zh"
        items={[
          'U盘和microSD卡是现在的主要渠道。广播在2025年被大幅削减，气球基本停了。',
          '看韩国影视可能被判5到10年劳动教养，大规模传播可能被判死刑，人们还是照做。',
          '最简单的帮忙方式：把旧U盘寄给Flash Drives for Freedom。',
        ]}
      />
    </>
  ),
  faq: [
    {
      q: 'Flash Drives for Freedom还在运作吗？',
      a: '是的。这个人权基金会的项目2026年仍在收集U盘，并称捐赠或承诺捐赠的U盘已超过14万个。',
    },
    {
      q: '朝鲜人被发现私藏外国影视会怎样？',
      a: '根据2020年的《反动思想文化排斥法》，观看或保存韩国影视可判5到10年劳动教养（情节严重的更重），大规模传播可判死刑。联合国2025年的一份报告记录了因传播未经许可的影视内容而被处决的案例。',
    },
    {
      q: '对朝广播停了吗？',
      a: '很多停了。美国削减资金后，自由亚洲电台韩语节目于2025年7月停播；韩国也在2025年6月停止了政府对朝广播和边境喇叭。一些独立广播机构仍在继续。',
    },
  ],
  sources: en.sources,
};

export default article;
