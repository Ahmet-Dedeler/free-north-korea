import Link from 'next/link';
import { Plane, Ship, UserX } from 'lucide-react';
import { Books, Stats, Timeline, Tldr } from '@/components/ArticleBlocks';
import type { Article } from '../types';

/** Japanese only: written for a Japanese audience, so it has no English or Korean version (see AGENTS.md). */
const article: Article = {
  slug: 'abductees-and-repatriation',
  lang: 'ja',
  title: '日本人拉致問題と帰国事業：まだ終わっていない話',
  h1: '日本人拉致問題と帰国事業',
  description:
    '1977〜1983年の日本人拉致と、1959〜1984年に93,340人が日本から北朝鮮へ渡った帰国事業。何が起きて、何がまだ解決していないのか。',
  teaser: '政府が認定した拉致被害者17人のうち帰国できたのは5人。そして「地上の楽園」を信じて北朝鮮へ渡った9万人以上の人たち。',
  updated: '2026-10-05',
  minutes: 6,
  body: () => (
    <>
      <p className="lede">
        北朝鮮の人権侵害は、北朝鮮の中だけの話じゃない。日本にとっては特に二つの話がある。1970〜80年代に北朝鮮の工作員が日本人を連れ去った拉致問題と、1959年から9万人以上が日本から北朝鮮へ渡った帰国事業だ。どちらもまだ終わっていない。
      </p>

      <Stats
        items={[
          { icon: UserX, value: '17人', label: '日本政府が認定した拉致被害者', note: '男性8人、女性9人', tone: 'danger' },
          { icon: Plane, value: '5人', label: '2002年に帰国できた被害者', note: '2002年10月15日' },
          { icon: Ship, value: '93,340人', label: '帰国事業で北朝鮮へ渡った人', note: '1959〜1984年' },
        ]}
      />

      <h2>拉致問題</h2>
      <p>
        1977年から1983年にかけて、北朝鮮の工作員が日本から日本人を連れ去った。政府が公式に認定しているのは17人だけど、実際には数百人いるかもしれないと推定されている。いちばん知られているのは横田めぐみさんで、1977年、13歳の中学生のときに連れ去られた。
      </p>
      <Timeline
        items={[
          { date: '1977〜1983年', title: '日本人の拉致', text: '政府認定は17人（男性8人、女性9人）。それ以外にも多くの可能性が指摘されている。', tone: 'danger' },
          { date: '1977年', title: '横田めぐみさん、13歳で拉致', text: '北朝鮮は拉致を認めたが、本人は死亡したと主張している。家族は今も生きていると信じている。', tone: 'danger' },
          { date: '2002年9月17日', title: '日朝首脳会談', text: '小泉純一郎首相が訪朝し、金正日が拉致を認めた。' },
          { date: '2002年10月15日', title: '被害者5人が帰国', text: 'DNA鑑定などで本人確認されたうえで日本へ。', tone: 'ok' },
          { date: '2004年5月まで', title: '家族も帰国', text: '5人の被害者とその家族、合わせて10人が北朝鮮から戻った。', tone: 'ok' },
        ]}
      />
      <p>
        北朝鮮は今も、拉致被害者は13人だけで、5人を返したことで問題は解決したと言っている。日本政府はそれを認めていない。残りの被害者の家族は年を取り続けていて、正直、時間がない。
      </p>

      <h2>帰国事業</h2>
      <p>
        1959年、在日朝鮮人の帰国事業が始まった。朝鮮総連が中心になって進め、北朝鮮は「地上の楽園」として宣伝された（住まいも仕事も医療も保障される、という話だった）。1984年に完全に止まるまでに、93,340人が日本から北朝鮮へ渡った。
      </p>
      <p>
        その中には朝鮮人の配偶者についていった日本人も含まれていて、推定6,637人、そのうち1,828人は日本国籍を持ったままだった。いわゆる「日本人妻」たちだ。
      </p>
      <p>
        行ってみると、楽園ではなかった。日本から来た人たちは「成分」（家族ごとの忠誠度ランク）で低く見られ、差別と貧しさの中で暮らした人が多い。政治犯収容所に送られた人もいる（収容所については<Link href="/ja/learn/north-korea-prison-camps">北朝鮮の政治犯収容所</Link>に書いた）。
      </p>
      <p>
        生きて戻ってきた人もいる。イシカワ・マサジ（Masaji Ishikawa）さんは1960年、13歳のときに家族と北朝鮮に渡り、1996年に鴨緑江を渡って脱出した。36年かかった。その体験は『A River in Darkness』という本になっている。
      </p>
      <Books titles={['A River in Darkness']} />

      <h2>今できること</h2>
      <p>
        拉致問題は政府間の交渉になりがちで、個人にできることは少なく見える。でも関心が薄れると、交渉の優先順位も下がるんだと思う。家族会の発信をシェアする、議員に聞く、本を読む。それくらいでも意味はある。北朝鮮の人々全体を助ける方法は
        <Link href="/ja/learn/how-to-help-north-koreans">北朝鮮の人々を助ける方法</Link>にまとめた。
      </p>

      <Tldr
        lang="ja"
        items={[
          '政府認定の拉致被害者は17人。2002年に帰国できたのは5人で、残りはまだ帰ってきていない。',
          '1959〜1984年の帰国事業で93,340人が「地上の楽園」へ渡り、多くは差別と貧困の中で暮らした。',
          'どちらもまだ終わっていない。関心を持ち続けること自体に意味がある。',
        ]}
      />
    </>
  ),
  faq: [
    {
      q: '日本政府が認定している拉致被害者は何人？',
      a: '17人（男性8人、女性9人）。1977年から1983年にかけて拉致された。実際にはもっと多いと推定されている。',
    },
    {
      q: '拉致被害者のうち何人が帰国した？',
      a: '2002年9月17日の日朝首脳会談で金正日が拉致を認めたあと、5人が2002年10月15日に帰国した。2004年5月までに家族も含め10人が北朝鮮から戻った。',
    },
    {
      q: '帰国事業で北朝鮮へ渡ったのは何人？',
      a: '1959年から1984年までに93,340人。そのうち推定6,637人は朝鮮人の配偶者についていった日本人で、1,828人は日本国籍を持ったままだった。',
    },
  ],
  sources: [
    { label: '日本国政府 拉致問題対策本部', url: 'https://www.rachi.go.jp/' },
    { label: 'Wikipedia: North Korean abductions of Japanese citizens', url: 'https://en.wikipedia.org/wiki/North_Korean_abductions_of_Japanese_citizens' },
    { label: 'Wikipedia: Megumi Yokota', url: 'https://en.wikipedia.org/wiki/Megumi_Yokota' },
    { label: 'Wikipedia: Koreans in Japan (repatriation, 93,340 people)', url: 'https://en.wikipedia.org/wiki/Koreans_in_Japan' },
    { label: 'Wikipedia: Japanese people in North Korea (spouses)', url: 'https://en.wikipedia.org/wiki/Japanese_people_in_North_Korea' },
    { label: 'Wikipedia: Masaji Ishikawa', url: 'https://en.wikipedia.org/wiki/Masaji_Ishikawa' },
  ],
};

export default article;
