import Link from 'next/link';
import { Footprints, HandCoins } from 'lucide-react';
import { HelpMenu, OrgActions, Stats, Tldr } from '@/components/ArticleBlocks';
import { OrgLink } from '@/components/HoverLinks';
import en from '../how-to-help-north-koreans';
import type { Article } from '../types';

const article: Article = {
  slug: en.slug,
  lang: 'zh',
  title: '2026年如何帮助朝鲜人（真正有用的做法）',
  h1: '如何帮助朝鲜人',
  description:
    '2026年帮助朝鲜人的具体方法：花3,000美元资助一次营救、寄送U盘、在线辅导脱北者、支持记录机构、向政府施压。',
  teaser: '真正有效的具体做法，附上费用。营救、U盘、辅导脱北者、保存证据，以及向政府施压。',
  updated: en.updated,
  minutes: 6,
  body: () => (
    <>
      <p className="lede">
        你没法坐在电脑前把朝鲜问题解决掉。但你可以帮一个具体的人逃出来，把一个具体的U盘送进朝鲜，或者让一个小小的记录机构再撑一年。而且做这些事的机构大多很小，2025年又是它们多年来资金最差的一年，所以在这里出一点钱或时间，作用大概比在大多数公益领域都大。
      </p>

      <HelpMenu lang="zh" />

      <h2 id="rescue">资助一次营救（约3,000美元）</h2>
      <p>
        大多数逃出来的人先越境进入中国。他们在那里没有合法身份，一旦被抓就会被遣返，面临监禁甚至更糟的下场。从中国北方到东南亚的安全地带，要经过中间人和安全屋，走大约4,800公里。
      </p>
      <Stats
        items={[
          { icon: HandCoins, value: '约3,000美元', label: '资助一次营救', note: 'Liberty in North Korea' },
          { icon: Footprints, value: '1,400+', label: 'LiNK至今营救的人数', note: 'LiNK，2026年' },
        ]}
      />
      <p>
        <OrgLink id="liberty-in-north-korea">Liberty in North Korea</OrgLink>
        （LiNK）资助这样的营救。不过难度越来越大：LiNK的2025年报告说，中国的生物识别检查站和AI监控让每条路线都变得更慢、更贵。
      </p>
      <OrgActions lang="zh" ids={['liberty-in-north-korea', 'crossing-borders']} />

      <h2 id="information">把信息送进去</h2>
      <p>
        外部信息是朝鲜人发现政府在骗他们的途径。
        <OrgLink id="flash-drives-for-freedom">Flash Drives for Freedom</OrgLink>
        （由人权基金会运营）接收捐赠的U盘，清空后装上电影、韩文维基百科、新闻等，再由合作机构送进朝鲜。这个项目2026年仍在运行，捐赠或承诺捐赠的U盘已超过14万个。寄几个旧U盘大概只要十分钟。
      </p>
      <p>
        广播也很重要，而它受到的打击最大。美国削减资金后，自由亚洲电台的韩语节目在2025年7月停播，韩国也停止了自己的对朝广播。
        <OrgLink id="unification-media-group">国民统一广播（Unification Media Group）</OrgLink>这样的机构仍在广播，非常需要支持。
      </p>
      <OrgActions lang="zh" ids={['flash-drives-for-freedom', 'unification-media-group']} />

      <h2 id="escapees">帮助已经逃出来的人</h2>
      <p>
        截至2025年底，共有34,538名朝鲜人抵达韩国（当年抵达224人，大多数是女性）。重新开始很难：要学另一种版本的母语，要学英语，要找工作，要面对创伤，还有留在北边的家人。
      </p>
      <p>
        你可以通过<OrgLink id="fsi">Freedom Speakers International</OrgLink>（原TNKR）在线教英语，或者在首尔给
        <OrgLink id="pscore">PSCORE</OrgLink>当志愿者。如果你会说英语，每周能抽出一小时，这是你能做的最直接的事情之一（而且你会真正认识你在帮助的那个人）。
      </p>
      <OrgActions lang="zh" ids={['fsi', 'pscore']} />

      <h2 id="evidence">保存证据</h2>
      <p>
        总有一天大概会有审判、真相委员会，还有寻找亲人坟墓的家属。<OrgLink id="nkdb">NKDB</OrgLink>、<OrgLink id="tjwg">TJWG</OrgLink>
        和<OrgLink id="korea-future">Korea Future</OrgLink>
        这样的机构现在就在访谈脱北者，标出监狱和处决地点，好让需要的时候有记录可查。其中好几家在2025年失去了美国的资助。
      </p>
      <OrgActions lang="zh" ids={['nkdb', 'tjwg', 'korea-future']} />

      <h2 id="voice">发出你的声音</h2>
      <ul>
        <li>要求你的议员资助对朝广播，并恢复对人权组织的支持。</li>
        <li>推动各方向中国施压，停止遣返脱北者（仅2023年10月一次，中国就遣返了约500到600人）。</li>
        <li>
          分享脱北者的故事和书（我们的<Link href="/library">书库</Link>有书单，英文）。大多数人对朝鲜的印象来自表情包，所以推荐一本好书，作用比你想的大。
        </li>
      </ul>

      <h2>如果你有特定技能</h2>
      <ul>
        <li>
          <b>开发者和做数据的人：</b>本站是开源的。可以在
          <a href="https://github.com/Ahmet-Dedeler/free-north-korea">GitHub</a>上补充数据、纠正事实、开发工具。
        </li>
        <li>
          <b>会韩语的人：</b>翻译一直是记录机构和媒体项目的瓶颈。
        </li>
        <li>
          <b>写作者和内容创作者：</b>关于朝鲜的好内容少得出奇，中文的更少。搜一下“朝鲜怎样才能获得自由”，看看能搜到多少。
        </li>
      </ul>

      <h2>要小心的</h2>
      <p>经过政权发放、又没有任何监督的援助，以及不肯说清楚自己到底做什么、花多少钱的机构。问他们要数字。好的机构都会公开。</p>

      <Tldr
        lang="zh"
        items={[
          '最便宜：把旧U盘寄给Flash Drives for Freedom。最直接：约3,000美元就能通过LiNK资助一次完整的营救。',
          '如果你会说英语，每周花一小时辅导一位脱北者，是实实在在、面对面的帮助。',
          '这些机构规模都小，2025年又失去了大量资金，所以小钱也很重要。',
        ]}
      />
    </>
  ),
  faq: [
    {
      q: '营救一名朝鲜难民要花多少钱？',
      a: 'Liberty in North Korea说，把一个人从中国送到安全地带大约需要3,000美元。该组织已经帮助1,400多人逃离。',
    },
    {
      q: '我能把U盘寄到朝鲜吗？',
      a: '不能直接寄，但可以把旧U盘寄给人权基金会的项目Flash Drives for Freedom。他们会清空U盘，装上外部内容，再由合作机构送进朝鲜。',
    },
    {
      q: '韩国有多少朝鲜脱北者？',
      a: '约34,500人。韩国统一部统计，截至2025年底累计入境34,538人，其中2025年入境224人。',
    },
  ],
  sources: en.sources,
};

export default article;
