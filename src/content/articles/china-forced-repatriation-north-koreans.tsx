import Link from 'next/link';
import { Ban, Scale, ShieldAlert, UserRound, Users } from 'lucide-react';
import { BorderMap, Compare, Stats, Timeline, Tldr } from '@/components/ArticleBlocks';
import { OrgLink } from '@/components/HoverLinks';
import type { Article } from './types';

const article: Article = {
  slug: 'china-forced-repatriation-north-koreans',
  title: 'Why China Sends North Koreans Back: Forced Repatriation Explained',
  h1: 'Why China sends North Koreans back',
  description:
    'China has forcibly returned at least 1,076 North Koreans since 2020, including 500 to 600 in one night in October 2023. Why it does it, what happens to people sent back, and what would stop it.',
  teaser: 'At least 1,076 people sent back since 2020: why China returns North Koreans, and what waits for them at home.',
  updated: '2026-10-11',
  minutes: 7,
  body: () => (
    <>
      <p className="lede">
        Almost every North Korean who escapes goes through China. If Chinese police catch them, China sends them back. Human Rights Watch
        counts at least 1,076 forced returns since 2020. Back home they face interrogation, prison camps, and for pregnant women, forced
        abortion. China signed the Refugee Convention in 1982 and says none of this breaks it.
      </p>

      <Stats
        items={[
          { icon: Ban, value: '1,076+', label: 'North Koreans forcibly returned by China since 2020', note: 'Human Rights Watch, Oct 2025', tone: 'danger' },
          { icon: Users, value: '500–600', label: 'sent back in one night, October 9, 2023', note: 'HRW says more than 500; rights groups about 600' },
          { icon: UserRound, value: '2,000+', label: 'held in Chinese detention, about 70% women', note: 'UN Special Rapporteur, Oct 2023' },
        ]}
      />

      <h2 id="why">China&apos;s reasoning, and the law</h2>
      <Compare
        items={[
          {
            icon: ShieldAlert,
            title: 'What China says',
            tone: 'warn',
            children: (
              <p>
                North Koreans who cross are &quot;illegal economic migrants&quot;, not refugees. After the October 2023 returns, China&apos;s
                Foreign Ministry said there are no &quot;so-called defectors&quot; in China.
              </p>
            ),
          },
          {
            icon: Users,
            title: 'The deal with Pyongyang',
            tone: 'danger',
            children: (
              <p>
                A 1986 border protocol, signed in Dandong by China&apos;s Ministry of Public Security and North Korea&apos;s secret police,
                says each side hands the other a list of people who cross. A 1998 protocol added to it.
              </p>
            ),
          },
          {
            icon: Scale,
            title: 'What the law says',
            tone: 'ok',
            children: (
              <p>
                China joined the 1951 Refugee Convention and its 1967 Protocol in 1982, which bar sending refugees back to persecution. It is
                also a party to the Convention Against Torture, which bars sending anyone to a country where they risk torture. UN experts say
                that is exactly what returnees face.
              </p>
            ),
          },
        ]}
      />
      <p>
        In 2014 the UN Commission of Inquiry wrote to the Chinese government that it might be &quot;aiding and abetting crimes against
        humanity&quot;, and asked it to stop passing information about escapees to North Korea. At its 2024 review at the UN Human Rights
        Council, China rejected the calls to stop forced returns.
      </p>

      <h2 id="returns">The returns since the border closed</h2>
      <Timeline
        items={[
          { date: '2020', title: 'Border sealed', text: 'North Korea closes the border for COVID, builds almost 500 km of new fences and orders guards to shoot on sight.' },
          { date: 'Mar 2023', title: 'Over a thousand held', text: 'The UN Special Rapporteur says over a thousand escapees are detained in China indefinitely while the border is shut.' },
          { date: 'Aug–Sep 2023', title: 'Returns start again', text: '80 people on August 29, 40 more on September 18.' },
          {
            date: 'Oct 9, 2023',
            title: 'The biggest night',
            text: 'Right after the Hangzhou Asian Games, China sends back more than 500 people, about 600 by some counts. Seoul raises it with Beijing.',
            tone: 'danger',
          },
          { date: '2024', title: 'Workers and families', text: '108 overseas workers in January, 60 people from Jilin and Liaoning in April.' },
          { date: '2024–25', title: 'Trafficked women', text: '212 trafficked women held in Kunming and other Chinese cities (2024), and 20 of 22 women held in Inner Mongolia, are sent back.' },
          { date: 'Oct 2025', title: 'At least 1,076', text: 'Human Rights Watch counts at least 406 returns since 2024 and 1,076 since 2020.', tone: 'danger' },
        ]}
      />

      <h2 id="what-happens">What happens to people sent back</h2>
      <p>
        Returnees are handed to North Korea&apos;s secret police at the border and held in a holding center (jipkyulso) or a police
        interrogation cell (kuryujang). Human Rights Watch interviewed 46 North Koreans about this pretrial detention and found beatings,
        hunger, rape and coerced confessions, worst in secret police centers. The questions focus on whether they met South Koreans or
        Christians, or planned to reach the South.
      </p>
      <ul>
        <li>Crossed to find food or work: a short-term labor camp.</li>
        <li>Tried to reach South Korea: an ordinary prison camp (kyohwaso).</li>
        <li>
          Met Christians or South Korean officials: a political <Link href="/learn/north-korea-prison-camps">prison camp</Link> (kwanliso).
        </li>
      </ul>
      <p>
        A 2010 decree made defection &quot;treachery against the nation&quot;, punishable by death. The UN Commission of Inquiry found that
        pregnant women sent back are regularly forced to have abortions and that babies born to them are often killed, driven by racist
        attitudes toward mixed-race children. Human Rights Watch reported the same in 2025.
      </p>

      <h2 id="women">Why most of them are women</h2>
      <p>
        Seoul&apos;s Database Center for North Korean Human Rights estimated in 2023 that about 10,000 North Koreans were still hiding in
        China, down from around 100,000, and that 90% of them are women. Many are sold. A 2019 Korea Future Initiative report estimated
        that 60% of North Korean women refugees in China are trafficked into the sex trade, worth about $105 million a year to criminal
        networks, and that a woman can be sold as a wife for 1,000 yuan ($144). Their children by Chinese men cannot be registered, so they grow
        up stateless. A woman who goes to the police for help risks being sent back.
      </p>

      <h2 id="harder">Why so few get out now</h2>
      <BorderMap />
      <p>
        On the Chinese side, cameras, facial recognition and paid informants make it hard to move or hide. On the North Korean side, the new
        fences and shoot-on-sight orders stay in place. In 2009, 2,914 North Koreans reached South Korea. In 2021 it was 63, and in 2025 it
        was 224. The full route is in <Link href="/learn/how-north-koreans-escape">how North Koreans escape</Link>.
      </p>

      <h2 id="stop-it">What would stop it</h2>
      <p>
        Every North Korean is a citizen of South Korea under its law, so there is somewhere to send them that is not North Korea. The UN
        General Assembly urges all states to respect non-refoulement, the UN Human Rights Council asked in 2025 for an end to the detention
        of returnees, and a 2018 US law calls on China to halt forced returns. None of this has changed China&apos;s policy so far, which is
        why people still have to be smuggled out. Groups like <OrgLink id="liberty-in-north-korea">Liberty in North Korea</OrgLink> pay
        for that journey: over 1,400 people have reached safety through its networks. More ways to help are in{' '}
        <Link href="/learn/how-to-help-north-koreans">how to help North Koreans</Link>.
      </p>

      <Tldr
        items={[
          'China calls North Korean escapees illegal economic migrants and returns them under a 1986 deal with North Korea, despite signing the Refugee Convention.',
          'At least 1,076 people were sent back from 2020 to October 2025, including 500 to 600 on one night in October 2023.',
          'Returnees face interrogation, prison camps and, for pregnant women, forced abortion. Most of those still hiding in China are women, many of them trafficked.',
        ]}
      />
    </>
  ),
  faq: [
    {
      q: 'Why does China send North Korean defectors back?',
      a: 'China says North Koreans who cross the border are illegal economic migrants, not refugees, and returns them under a 1986 border protocol with North Korea. The UN and rights groups say this breaks the rule of non-refoulement in the Refugee Convention, which China joined in 1982, and in the Convention Against Torture.',
    },
    {
      q: 'How many North Koreans has China sent back?',
      a: 'Human Rights Watch counted at least 1,076 forced returns from 2020 to October 2025, including more than 500 people (about 600 by some counts) on the night of October 9, 2023, and at least 406 since the start of 2024.',
    },
    {
      q: 'What happens to North Koreans who are sent back?',
      a: 'They are interrogated by the secret police and held in border detention centers. People who crossed for food may get a short labor camp sentence; those who tried to reach South Korea go to prison camps; those who met Christians or South Koreans can be sent to political prison camps. The UN found that pregnant returnees are often forced to have abortions.',
    },
    {
      q: 'Is it legal for China to return North Koreans?',
      a: 'The UN says no. China is a party to the 1951 Refugee Convention and its 1967 Protocol, which forbid sending refugees back to persecution, and to the Convention Against Torture, which forbids sending anyone to a country where they risk torture. China rejects this, calling the returnees economic migrants.',
    },
  ],
  sources: [
    { label: 'Human Rights Watch: China: No Letup in Forced Returns to North Korea (Oct 2025)', url: 'https://www.hrw.org/news/2025/10/15/china-no-letup-in-forced-returns-to-north-korea' },
    { label: 'Human Rights Watch: China Forcibly Returns 60 Refugees to North Korea (May 2024)', url: 'https://www.hrw.org/news/2024/05/08/china-forcibly-returns-60-refugees-north-korea' },
    { label: 'Human Rights Watch: North Korea: Sealing China Border Worsens Crisis (Mar 2024)', url: 'https://www.hrw.org/news/2024/03/07/north-korea-sealing-china-border-worsens-crisis' },
    { label: 'Human Rights Watch: "Worth Less Than an Animal", pretrial detention in North Korea (2020)', url: 'https://www.hrw.org/report/2020/10/19/worth-less-animal/abuses-and-due-process-violations-pretrial-detention-north' },
    { label: 'US Congressional-Executive Commission on China: North Koreans in China (2025)', url: 'https://cecc.gov/publications/commission-analysis/north-koreans-china-marginalized-exploited-and-repatriated' },
    { label: 'China-DPRK border protocol of 1986 (English text)', url: 'https://www.nkfreedom.org/UploadedDocuments/NK-China-bilateral_treaty.pdf' },
    { label: 'UN Geneva: China urged not to repatriate DPR Korea escapees (Oct 2023)', url: 'https://www.ungeneva.org/en/news-media/news/2023/10/86412/china-urged-not-repatriate-dpr-korea-escapees' },
    { label: 'KEIA: UN Special Rapporteur leads effort opposing China’s forcible repatriation (Nov 2023)', url: 'https://keia.org/analysis/un-special-rapporteur-leads-effort-opposing-chinas-forcible-repatriation-of-north-korean-refugees/' },
    { label: 'RFA: China repatriates more than 500 North Koreans after the Asian Games (Oct 2023)', url: 'https://www.rfa.org/english/news/korea/china-repatriates-north-korean-defectors-10122023004404.html' },
    { label: 'Hong Kong Free Press: Large number of North Koreans likely deported by China, says Seoul (Oct 2023)', url: 'https://hongkongfp.com/2023/10/13/large-number-of-north-koreans-likely-deported-by-china-says-seoul/' },
    { label: 'VOA via GlobalSecurity: China says no "so-called defectors" (Oct 2023)', url: 'https://www.globalsecurity.org/wmd/library/news/dprk/2023/dprk-231012-voa01.htm' },
    { label: 'NPR: North Korean defectors face deportation from China (Apr 2023)', url: 'https://www.npr.org/2023/04/25/1169464713/north-korea-defectors-deportation-china' },
    { label: 'Wikipedia: Report of the UN Commission of Inquiry on Human Rights in the DPRK (2014)', url: 'https://en.wikipedia.org/wiki/Report_of_the_Commission_of_Inquiry_on_Human_Rights_in_the_Democratic_People%27s_Republic_of_Korea' },
    { label: 'Korea JoongAng Daily: Korea Future Initiative report on sex trafficking of North Korean women (May 2019)', url: 'https://www.koreajoongangdaily.com/korea/ngo-details-sex-trafficking-of-norths-women/11174912' },
    { label: 'KEIA: North Korean refugees in South Korea, arrivals by year (Feb 2026)', url: 'https://keia.org/the-peninsula/north-korean-refugees-are-increasingly-finding-success-in-south-korea/' },
    { label: 'Korea Future: amendments in the 2025 UN Human Rights Council resolution', url: 'https://www.koreafuture.org/news/korea-future-secures-new-amendments-in-2025-unhrc-resolution-on-dprk-human-rights' },
    { label: 'Korea JoongAng Daily: UN urges member states to end forced repatriation (Nov 2023)', url: 'https://www.koreajoongangdaily.com/korea/un-urges-member-states-to-end-forced-repatriation-in-north/10553314' },
    { label: 'US Public Law 115-198 (2018), North Korean Human Rights Reauthorization', url: 'https://www.govinfo.gov/content/pkg/PLAW-115publ198/html/PLAW-115publ198.htm' },
    { label: 'Wikipedia: North Korean defectors (South Korean citizenship)', url: 'https://en.wikipedia.org/wiki/North_Korean_defectors' },
    { label: 'Liberty in North Korea: 2025 annual report', url: 'https://libertyinnorthkorea.org/blog/helping-north-korean-people-win-their-freedom-liberty-in-north-koreas-2025-annual-report' },
  ],
};

export default article;
