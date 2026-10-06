import Link from 'next/link';
import { Lock, MapPin, ShieldAlert, Users } from 'lucide-react';
import { Books, CampGrid, Compare, OrgNotes, Stats, Tldr } from '@/components/ArticleBlocks';
import { OrgLink } from '@/components/HoverLinks';
import { getAllCamps } from '@/content/camps';
import en from '../north-korea-prison-camps';
import type { Article } from '../types';

const article: Article = {
  slug: en.slug,
  lang: 'zh',
  title: '朝鲜政治犯收容所：在哪里，里面发生什么',
  h1: '朝鲜的政治犯收容所',
  description:
    '朝鲜的政治犯收容所（管理所）估计关押着8万到12万人（联合国，2014年）。已知收容所的地图，人们怎样被关进去，以及谁在记录它们。',
  teaser: '管理所体系：收容所在哪里，为什么整家人都会被关进去，以及卫星图像和幸存者揭示了什么。',
  updated: en.updated,
  minutes: 7,
  body: () => (
    <>
      <p className="lede">
        朝鲜设有被称为“管理所”（kwanliso）的政治犯收容所。2014年，联合国调查委员会估计里面关押着8万到12万人，并认定里面发生的事构成危害人类罪（灭绝、谋杀、奴役、酷刑、强奸、强迫堕胎）。朝鲜说这些收容所不存在。你在卫星图像上就能看到它们。
      </p>

      <Stats
        items={[
          { icon: Users, value: '8万~12万', label: '关押在政治犯收容所的人', note: '联合国估计，2014年', tone: 'danger' },
          { icon: MapPin, value: String(getAllCamps().length), label: '本站追踪的设施', note: '见 /camps' },
        ]}
      />

      <h2>两种收容所</h2>
      <Compare
        items={[
          {
            icon: ShieldAlert,
            title: '管理所：政治犯收容所',
            tone: 'danger',
            children: (
              <p>
                关押被国家视为敌人的人，常常连同他们的全家。许多是“完全控制区”，进去的人永远不会被释放。囚犯在饥饿口粮下挖煤、伐木、种地、在工厂干活。
              </p>
            ),
          },
          {
            icon: Lock,
            title: '教化所：“再教育”监狱',
            tone: 'warn',
            children: (
              <p>
                关押被判有罪的人，比如看韩国电视、未经许可做买卖或试图出逃的人。刑期有结束的日子，但幸存者描述的强迫劳动和死亡率，听起来和政治犯收容所差不多。
              </p>
            ),
          },
        ]}
      />
      <p>除此之外还有短期拘留所和审讯中心。从中国被遣返的人通常最先被送到那里。</p>

      <h2>人们是怎样被关进去的？</h2>
      <p>
        侮辱领袖、信教、和韩国人接触，或者仅仅因为是做了这些事的人的亲属。在连坐制下，政权会把“犯人”的父母、子女和兄弟姐妹也送进收容所。《逃出14号劳改营》的主人公申东赫说，他就是在收容所里出生的。
      </p>

      <h2>已知的收容所</h2>
      <p>
        这些收容所都标在<Link href="/map">情报地图</Link>上，位置是大致的。它们的状态来自卫星分析和脱北者证词，所以会比实际情况晚几个月甚至几年（请记住这一点）。
      </p>
      <CampGrid lang="zh" slugs={['kwanliso-14', 'kwanliso-15', 'kwanliso-16', 'kwanliso-18', 'kwanliso-22', 'kwanliso-25', 'kyohwaso-1-kaechon', 'kyohwaso-12-chongori']} />
      <p>
        本站追踪的全部{getAllCamps().length}处设施见<Link href="/camps">收容所页面</Link>（英文）。
      </p>
      <p>
        情况在好转吗？很难说。一些研究者，比如<OrgLink lang="zh" id="tjwg">转型正义工作组（TJWG）</OrgLink>
        ，看到迹象表明金正恩时代政治犯收容所的人数减少了，而普通监狱的人数增加了。但联合国2025年的报告发现，2014年之后的十年里，整体镇压是变本加厉，而不是有所好转。
      </p>

      <h2>谁在记录它们</h2>
      <OrgNotes lang="zh"
        items={[
          { id: 'hrnk', note: <>发布针对单个收容所的卫星图像分析（它的报告《隐藏的古拉格》（<i>Hidden Gulag</i>）是标准参考资料）。</> },
          { id: 'nkdb', note: '维护一个人权侵害数据库，以及一个根据数万份证词建立的监狱数据库。' },
          { id: 'korea-future', note: '逐案记录朝鲜的刑罚体系，并点出加害者的名字。' },
          { id: 'tjwg', note: '标出处决和埋葬地点，为将来追究责任做准备。' },
        ]}
      />

      <h2>推荐阅读</h2>
      <p>
        《平壤的水族馆》（<i>The Aquariums of Pyongyang</i>，作者姜哲焕，9岁被关进耀德）和《逃出14号劳改营》（<i>Escape from Camp 14</i>
        ，作者布莱恩·哈登）是最有名的亲历记述。申东赫后来修改了自己故事的部分细节，不过他所描述的核心内容与其他证词相符。更多书目见
        <Link href="/library">书库</Link>（英文）。
      </p>
      <Books titles={['The Aquariums of Pyongyang', 'Escape from Camp 14', 'Eyes of the Tailless Animals: Prison Memoirs of a North Korean Woman', 'Long Road Home: Testimony of a North Korean Camp Survivor']} />

      <Tldr
        lang="zh"
        items={[
          '联合国2014年估计政治犯收容所关押着8万到12万人，并称里面发生的事是危害人类罪。',
          '一个人“犯罪”，整家人都会被送进去，有时是三代人。',
          '在卫星图像上就能看到这些收容所，HRNK、NKDB和TJWG等机构正在为将来保存记录。',
        ]}
      />
    </>
  ),
  faq: [
    {
      q: '朝鲜的收容所里关着多少人？',
      a: '联合国调查委员会2014年估计，政治犯收容所（管理所）关押着8万到12万人。还有更多人进出普通监狱和拘留所。目前没有最新的准确数字。',
    },
    {
      q: '朝鲜的政治犯收容所还在运作吗？',
      a: '是的。卫星图像显示，好几座政治犯收容所仍在运作，包括14号（价川）、16号（化城）和25号（清津）。一些较老的收容所，比如22号（会宁），已经关闭。',
    },
    {
      q: '为什么整个家庭会被送进朝鲜的收容所？',
      a: '在连坐制下，被控政治犯罪的人的亲属也可能被关押，有时牵连三代人。这让反抗的代价变得极高。',
    },
  ],
  sources: en.sources,
};

export default article;
