import Link from 'next/link';
import { TrendingDown, UserRound, Users } from 'lucide-react';
import { ArrivalsChart, BorderMap, EscapeRoute, Stats, Tldr } from '@/components/ArticleBlocks';
import { OrgLink, PlaceLink } from '@/components/HoverLinks';
import en from '../how-north-koreans-escape';
import type { Article } from '../types';

const article: Article = {
  slug: en.slug,
  lang: 'ja',
  title: '北朝鮮の人々はどうやって脱出するのか？ルート、費用、危険',
  h1: '北朝鮮の人々はどうやって脱出するのか',
  description:
    '2026年の北朝鮮からの脱出方法：中国へ渡る、東南アジアを経由する約4,800kmのルート、ブローカーの費用、強制送還、そして韓国への到着まで。',
  teaser: '川を渡り、中国で隠れ、東南アジアまで約4,800km。そして2025年にたった224人しかたどり着けなかった理由。',
  updated: en.updated,
  minutes: 6,
  body: () => (
    <>
      <p className="lede">
        2025年に韓国にたどり着いた北朝鮮の人は224人だった。コロナ前は年に1,000人を超えていて、2009年にはほぼ3,000人だった。じゃあ出たい人が減ったのか？たぶん違う。国境と中国の両方が、ずっと通り抜けにくくなった。
      </p>

      <Stats
        items={[
          { icon: TrendingDown, value: '224人', label: '2025年に韓国へ到着', note: '統一部', tone: 'danger' },
          { icon: UserRound, value: '198人', label: 'そのうち女性', note: '2025年' },
          { icon: Users, value: '34,538人', label: '累計の到着者', note: '2025年末時点' },
        ]}
      />

      <EscapeRoute lang="ja" />

      <h2 id="border">ステップ1：国境を越える</h2>
      <p>
        ほぼ全員が豆満江か鴨緑江を渡って中国へ出る。よく渡る場所は<PlaceLink slug="hyesan">恵山</PlaceLink>、<PlaceLink slug="musan">茂山</PlaceLink>、
        <PlaceLink slug="hoeryong">会寧</PlaceLink>のような国境の町の近くだ（<Link href="/map">インテルマップ</Link>にも載っている）。
      </p>
      <BorderMap lang="ja" />
      <p>
        2020年以降、北朝鮮は新しいフェンスを作り、監視所を増やし、国境警備隊に射殺命令を出した。だから今は警備兵に賄賂を渡すブローカーが事実上必須だ。値段は何倍にも跳ね上がった。
      </p>
      <p>海から、あるいは非武装地帯（DMZ）を直接越えて脱出するケースもあるけど、まれだ。まれだからこそニュースになる。</p>

      <h2 id="china">ステップ2：中国で隠れて暮らす</h2>
      <p>
        中国は北朝鮮の人を難民ではなく不法な経済移民として扱い、送り返す。女性（2025年の224人中198人）は強制結婚や性産業に人身売買されることが多く、書類なしで何年も中国で暮らす人も多い。顔認証、バスや列車での身分証チェック、携帯電話の追跡のせいで、今はただ移動するだけでも本当に難しい。
      </p>
      <p>
        捕まれば送り返される。2023年10月、中国は一度の作戦で推定500〜600人を送還した。北朝鮮に戻ると取り調べを受け、韓国人やキリスト教徒と接触した人は
        <Link href="/ja/learn/north-korea-prison-camps">収容所</Link>に送られることがある。
      </p>

      <h2 id="route">ステップ3：長い道のり</h2>
      <p>
        よくあるルートは中国を南へ約3,000マイル（約4,800km）下って東南アジアへ、多くはラオスを通ってタイに入る。タイでは自首でき、最終的に韓国へ送られる（以前はモンゴルも一つの道だった）。何週間もかかる。隠れ家、バス、夜のジャングル越え。
        <OrgLink id="liberty-in-north-korea">Liberty in North Korea</OrgLink>のような救出団体が費用を出すのがこの部分で、1人あたり約3,000ドルだ。
      </p>

      <h2 id="south-korea">ステップ4：韓国</h2>
      <p>
        まず韓国の情報機関の取り調べを受け、次に定着支援施設ハナ院で約3か月、市場経済での暮らし方を学ぶ。国籍をもらい、住まいや仕事について多少の支援を受ける。
      </p>
      <p>
        それでも本当に大変だ。新しい技術、かなり違う語彙（韓国語は英語由来の言葉だらけだ）、差別、残してきた家族。
        <OrgLink id="fsi">Freedom Speakers International</OrgLink>や<OrgLink id="pscore">PSCORE</OrgLink>のような団体が英語、学業、スピーチを手伝っている。
      </p>

      <h2 id="numbers">数字で見ると</h2>
      <p>棒にカーソルを合わせるとその年の数字が出る。コロナの国境封鎖でほぼすべてが止まり、その後ちゃんとは戻っていない：</p>
      <ArrivalsChart lang="ja" />

      <Tldr
        lang="ja"
        items={[
          'ほぼ全員が川を渡って中国に入り、隠れて、約4,800km移動して東南アジアを経て韓国へ向かう。',
          '2025年にたどり着いたのは224人だけ。2009年の約3,000人から減ったのは、国境と中国の監視がずっと厳しくなったから。',
          '救出1件に約3,000ドル。中国で捕まれば北朝鮮に送り返される。',
        ]}
      />
    </>
  ),
  faq: [
    {
      q: '毎年何人の北朝鮮の人が脱出している？',
      a: '統一部によると、2025年に224人が韓国に到着した。コロナ前の年約1,000人、2009年のピークの2,914人よりずっと少ない。',
    },
    {
      q: '中国はなぜ脱北者を送り返すのか？',
      a: '中国は北朝鮮との協定に基づき、北朝鮮の人を難民ではなく不法な経済移民に分類している。人権団体と国連は、送還された人が拷問や拘禁を受けるため、これはノン・ルフールマン原則に反すると言っている。',
    },
    {
      q: '脱北者はどんなルートで来る？',
      a: 'ほとんどは川を渡って中国に入り、そこで隠れたあと、中国を南へ約4,800km移動して東南アジア（多くはラオスとタイ）に入り、そこから韓国へ移送される。',
    },
  ],
  sources: en.sources,
};

export default article;
