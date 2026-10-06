import Link from 'next/link';
import { Footprints, HandCoins } from 'lucide-react';
import { HelpMenu, OrgActions, Stats, Tldr } from '@/components/ArticleBlocks';
import { OrgLink } from '@/components/HoverLinks';
import en from '../how-to-help-north-koreans';
import type { Article } from '../types';

const article: Article = {
  slug: en.slug,
  lang: 'ja',
  title: '2026年に北朝鮮の人々を助ける方法（本当に効果があること）',
  h1: '北朝鮮の人々を助ける方法',
  description:
    '2026年に北朝鮮の人々を助ける具体的な方法：3,000ドルの救出支援、USBを送る、オンラインで脱北者のチューター、記録団体の支援、政府への働きかけ。',
  teaser: '費用つきの、効果のある具体的な方法。救出、USB、脱北者のチューター、記録、政府への働きかけ。',
  updated: en.updated,
  minutes: 6,
  body: () => (
    <>
      <p className="lede">
        ノートパソコンの前から北朝鮮を変えることはできない。でも、特定の一人を外に出すこと、特定のUSB一本を国の中に届けること、小さな記録団体をもう1年続けさせることはできる。この仕事をしている団体はほとんどがとても小さく、2025年はここ何年かで最悪の資金難だった。だから少しのお金や時間が、他の分野よりここでずっと遠くまで届くんだと思う。
      </p>

      <HelpMenu lang="ja" />

      <h2 id="rescue">救出を支援する（約3,000ドル）</h2>
      <p>
        脱出する人のほとんどはまず中国に渡る。そこでは法的な身分がなく、捕まれば送り返されて収容所かそれ以上にひどい目にあう。中国北部から東南アジアの安全な場所までは、ブローカーと隠れ家をつなぐ約3,000マイル（約4,800km）の旅だ。
      </p>
      <Stats
        items={[
          { icon: HandCoins, value: '約3,000ドル', label: '救出1件の費用', note: 'Liberty in North Korea' },
          { icon: Footprints, value: '1,400人以上', label: 'LiNKがこれまでに救出した人', note: 'LiNK、2026年' },
        ]}
      />
      <p>
        <OrgLink lang="ja" id="liberty-in-north-korea">Liberty in North Korea（LiNK）</OrgLink>がこの旅の費用を出している。ただ、どんどん難しくなっている。LiNKの2025年の報告によると、中国の生体認証検問所とAI監視のせいで、どのルートも遅く高くなった。
      </p>
      <OrgActions lang="ja" ids={['liberty-in-north-korea', 'crossing-borders']} />

      <h2 id="information">情報を送る</h2>
      <p>
        外の情報は、北朝鮮の人々が政府に嘘をつかれていると知る手段だ。<OrgLink lang="ja" id="flash-drives-for-freedom">Flash Drives for Freedom</OrgLink>
        （人権財団HRFが運営）は寄付されたUSBを初期化して、映画、韓国語版ウィキペディア、ニュースなどを入れ、協力団体が国内に届ける。2026年も活動中で、寄付・寄付予定のUSBは14万本を超える。使わないUSBを何本か送るのに10分くらいしかかからない。
      </p>
      <p>
        ラジオも大事だけど、いちばん打撃を受けた。自由アジア放送の朝鮮語サービスは米国の予算が切られて2025年7月に閉鎖され、韓国も独自の放送をやめた。
        <OrgLink lang="ja" id="unification-media-group">国民統一放送（UMG）</OrgLink>のような団体は今も放送していて、支援を本当に必要としている。
      </p>
      <OrgActions lang="ja" ids={['flash-drives-for-freedom', 'unification-media-group']} />

      <h2 id="escapees">すでにたどり着いた脱北者を助ける</h2>
      <p>
        2025年末までに34,538人の北朝鮮の人が韓国に着いた（その年に来たのは224人で、ほとんどが女性）。一からやり直すのは大変だ。同じ言語なのに違う言葉、英語、仕事探し、トラウマ、残してきた家族。
      </p>
      <p>
        <OrgLink lang="ja" id="fsi">Freedom Speakers International</OrgLink>（旧TNKR）でオンラインで英語を教えたり、ソウルで<OrgLink lang="ja" id="pscore">PSCORE</OrgLink>
        のボランティアをしたりできる。英語ができて週に1時間使えるなら、できることの中でいちばん直接的なものの一つだ（そして助けている相手と実際に知り合える）。
      </p>
      <OrgActions lang="ja" ids={['fsi', 'pscore']} />

      <h2 id="evidence">証拠を残す</h2>
      <p>
        いつかはたぶん裁判や真実委員会があり、墓を探す家族が出てくる。<OrgLink lang="ja" id="nkdb">NKDB（北韓人権情報センター）</OrgLink>、
        <OrgLink lang="ja" id="tjwg">TJWG（移行期正義ワーキンググループ）</OrgLink>、<OrgLink lang="ja" id="korea-future">Korea Future</OrgLink>
        のような団体は、今のうちに脱北者に聞き取りをし、刑務所や処刑場所を地図にしている。必要になったときにその記録があるように。このうちいくつかは2025年に米国の助成金を失った。
      </p>
      <OrgActions lang="ja" ids={['nkdb', 'tjwg', 'korea-future']} />

      <h2 id="voice">声を上げる</h2>
      <ul>
        <li>議員に、北朝鮮向け放送の予算と人権団体への支援の回復を求める。</li>
        <li>中国が脱北者を送り返すのをやめるよう、圧力を求める（2023年10月だけで推定500〜600人を送り返した）。</li>
        <li>
          脱北者の話や本をシェアする（<Link href="/library">ライブラリー</Link>に一覧がある、英語）。ほとんどの人の北朝鮮のイメージはミームなので、いい本を一冊すすめるだけで思っている以上の意味がある。
        </li>
      </ul>

      <h2>特別なスキルがあるなら</h2>
      <ul>
        <li>
          <b>開発者やデータ系の人：</b>このサイトはオープンソースだ。<a href="https://github.com/Ahmet-Dedeler/free-north-korea">GitHub</a>
          でデータを足したり、事実を直したり、ツールを作ったりできる。
        </li>
        <li>
          <b>韓国語ができる人：</b>翻訳は記録団体やメディアプロジェクトのずっと続くボトルネックだ。
        </li>
        <li>
          <b>書き手やクリエイター：</b>北朝鮮についての良い英語コンテンツは不思議なくらい少ない。「how to free North Korea」で検索すると、どれだけ少ないかわかる。
        </li>
      </ul>

      <h2>気をつけたいこと</h2>
      <p>監視なしに体制を通して入る支援と、実際に何をしているのか、いくらかかるのかを言わない団体。数字を聞こう。良い団体は公開している。</p>

      <Tldr
        lang="ja"
        items={[
          'いちばん安い：Flash Drives for FreedomにUSBを送る。いちばん直接的：約3,000ドルでLiNKを通じた救出1件。',
          '英語ができるなら、週1時間の脱北者チューターは本当に個人的な助けになる。',
          'これらの団体は小さく、2025年に資金を大きく失ったので、少額でも意味がある。',
        ]}
      />
    </>
  ),
  faq: [
    {
      q: '脱北者1人の救出にはいくらかかる？',
      a: 'Liberty in North Koreaによると、中国から安全な場所までの救出に約3,000ドルかかる。この団体はこれまでに1,400人以上の脱出を助けている。',
    },
    {
      q: '北朝鮮にUSBを送れる？',
      a: '直接は無理だけど、人権財団（HRF）のプロジェクトFlash Drives for Freedomに使ったUSBを郵送できる。USBを初期化して外のコンテンツを入れ、協力団体が北朝鮮に届ける。',
    },
    {
      q: '韓国に住む脱北者は何人？',
      a: '約3万4,500人だ。韓国の統一部は2025年末までに累計34,538人が入国したと集計していて、そのうち224人が2025年に来た。',
    },
  ],
  sources: en.sources,
};

export default article;
