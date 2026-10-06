import Link from 'next/link';
import { Lock, MapPin, ShieldAlert, Users } from 'lucide-react';
import { Books, CampGrid, Compare, OrgNotes, Stats, Tldr } from '@/components/ArticleBlocks';
import { OrgLink } from '@/components/HoverLinks';
import { getAllCamps } from '@/content/camps';
import en from '../north-korea-prison-camps';
import type { Article } from '../types';

const article: Article = {
  slug: en.slug,
  lang: 'ja',
  title: '北朝鮮の政治犯収容所：どこにあり、何が起きているのか',
  h1: '北朝鮮の政治犯収容所',
  description:
    '北朝鮮の政治犯収容所（管理所）には推定8万〜12万人が収容されていた（国連、2014年）。わかっている収容所の地図、人が送られる理由、そして誰が記録しているのか。',
  teaser: '管理所システム：収容所がどこにあるのか、なぜ家族ごと送られるのか、衛星画像と生存者が示すもの。',
  updated: en.updated,
  minutes: 7,
  body: () => (
    <>
      <p className="lede">
        北朝鮮は管理所と呼ばれる政治犯収容所を運営している。2014年、国連の調査委員会は8万〜12万人が収容されていると推定し、中で起きていることは人道に対する罪（絶滅、殺人、奴隷化、拷問、強姦、強制中絶）にあたると結論づけた。北朝鮮は収容所など存在しないと言う。衛星画像を見ればそこにある。
      </p>

      <Stats
        items={[
          { icon: Users, value: '8万〜12万', label: '政治犯収容所の収容者', note: '国連推定、2014年', tone: 'danger' },
          { icon: MapPin, value: String(getAllCamps().length), label: 'このサイトが追跡している施設', note: '/camps を参照' },
        ]}
      />

      <h2>2種類の収容所</h2>
      <Compare
        items={[
          {
            icon: ShieldAlert,
            title: '管理所：政治犯収容所',
            tone: 'danger',
            children: (
              <p>
                国家が敵と呼ぶ人たち、そして多くの場合その家族全員のための場所。多くは誰も釈放されない「完全統制区域」だ。収容者は飢餓レベルの配給で、炭鉱、伐採、農業、工場の労働をさせられる。
              </p>
            ),
          },
          {
            icon: Lock,
            title: '教化所：「再教育」刑務所',
            tone: 'warn',
            children: (
              <p>
                韓国のテレビを見た、許可なく商売した、国を出ようとした、といった罪で有罪になった人のための場所。刑期に終わりはあるけど、生存者は政治犯収容所とかなり似た強制労働と死亡率を証言している。
              </p>
            ),
          },
        ]}
      />
      <p>その上に短期の拘禁・取り調べ施設がある。中国から送り返された人がふつう最初に行くのはここだ。</p>

      <h2>人はどうやって送られるのか？</h2>
      <p>
        指導者を侮辱した、宗教を信じた、韓国人と接触した、あるいはそういうことをした人の親戚だというだけで。連座制のもと、体制は「犯罪者」の親、子ども、きょうだいまで収容所に送ってきた。『北朝鮮 14号管理所からの脱出』の主人公、申東赫（シン・ドンヒョク）は収容所の中で生まれたと話している。
      </p>

      <h2>わかっている収容所</h2>
      <p>
        これらはすべておおよその位置とともに<Link href="/map">インテルマップ</Link>に載っている。状況は衛星分析と脱北者の証言にもとづくので、現実より数か月から数年遅れることがある（そこは覚えておいてほしい）。下のカードは英語だ。
      </p>
      <CampGrid lang="ja" slugs={['kwanliso-14', 'kwanliso-15', 'kwanliso-16', 'kwanliso-18', 'kwanliso-22', 'kwanliso-25', 'kyohwaso-1-kaechon', 'kyohwaso-12-chongori']} />
      <p>
        追跡中の{getAllCamps().length}施設すべては<Link href="/camps">収容所ページ</Link>（英語）にある。
      </p>
      <p>
        良くなっているのか？なんとも言えない。<OrgLink lang="ja" id="tjwg">移行期正義ワーキンググループ（TJWG）</OrgLink>などの研究者は、金正恩の時代に政治犯収容所の人数は減り、一般の刑務所は増えた兆しを見ている。でも国連の2025年の報告書は、2014年からの10年で弾圧は全体として良くなったのではなく悪化したとしている。
      </p>

      <h2>誰が記録しているのか</h2>
      <OrgNotes lang="ja"
        items={[
          { id: 'hrnk', note: <>個々の収容所の衛星画像分析を公開している（報告書『Hidden Gulag』が標準的な参考資料）。</> },
          { id: 'nkdb', note: '何万件もの証言から作った人権侵害データベースと拘禁施設データベースを運営している。' },
          { id: 'korea-future', note: '加害者の名前まで挙げて、刑罰制度を事件ごとに記録している。' },
          { id: 'tjwg', note: '将来の責任追及のために処刑地と埋葬地を地図にしている。' },
        ]}
      />

      <h2>読むなら</h2>
      <p>
        『平壌の水槽』（姜哲煥、9歳で耀徳に送られた）と『北朝鮮 14号管理所からの脱出』（ブレイン・ハーデン）が、いちばん知られた当事者の記録だ。申東赫はのちに話の一部を変えたけど、彼が語った核心は他の証言と一致している。ほかの本は
        <Link href="/library">ライブラリー</Link>（英語）に。
      </p>
      <Books titles={['The Aquariums of Pyongyang', 'Escape from Camp 14', 'Eyes of the Tailless Animals: Prison Memoirs of a North Korean Woman', 'Long Road Home: Testimony of a North Korean Camp Survivor']} />

      <Tldr
        lang="ja"
        items={[
          '国連は2014年に政治犯収容所の収容者を8万〜12万人と推定し、中で起きていることを人道に対する罪と呼んだ。',
          '一人の「罪」で家族ごと、ときには3代が送られる。',
          '収容所は衛星画像で見えるし、HRNK、NKDB、TJWGなどの団体が後のために記録を残している。',
        ]}
      />
    </>
  ),
  faq: [
    {
      q: '北朝鮮の収容所には何人いる？',
      a: '国連調査委員会は2014年、政治犯収容所（管理所）に8万〜12万人が収容されていると推定した。それよりずっと多くの人が一般の刑務所や拘禁施設を通っている。最近の正確な数はない。',
    },
    {
      q: '北朝鮮の収容所はまだ稼働している？',
      a: 'している。衛星画像では14号（价川）、16号（化城）、25号（清津）など複数の政治犯収容所がまだ稼働している。22号（会寧）など一部の古い収容所は閉鎖された。',
    },
    {
      q: 'なぜ家族まで収容所に送られるのか？',
      a: '連座制のため、政治犯とされた人の親戚も、ときには3代にわたって収容されることがある。そのため抵抗の代償がとてつもなく大きい。',
    },
  ],
  sources: en.sources,
};

export default article;
