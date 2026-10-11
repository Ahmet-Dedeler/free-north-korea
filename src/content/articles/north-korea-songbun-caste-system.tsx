import Link from 'next/link';
import { Crown, FileText, ShieldAlert, Users } from 'lucide-react';
import { Compare, Stats, Timeline, Tldr } from '@/components/ArticleBlocks';
import type { Article } from './types';

const article: Article = {
  slug: 'north-korea-songbun-caste-system',
  title: "Songbun: North Korea's Caste System Explained",
  h1: 'Songbun: the caste system North Korea says does not exist',
  description:
    'North Korea sorts every citizen into 3 classes and 51 categories by family background. How songbun decides where people live, eat, study and work, and how money is changing it.',
  teaser: 'Three classes, 51 categories and a file on everyone from age 17: how family background decides a North Korean life.',
  updated: '2026-10-11',
  minutes: 6,
  body: () => (
    <>
      <p className="lede">
        In North Korea, what your grandfather did in the 1940s can still decide where you live, what you eat, whether you go to
        university and who you can marry. The system is called songbun (성분), and it sorts every citizen into 3 classes and 51
        categories by family background. North Korea says it doesn't exist. The UN says it is the root of the country's discrimination.
      </p>

      <Stats
        items={[
          { icon: Users, value: '3', label: 'classes: core, wavering, hostile' },
          { icon: FileText, value: '51', label: 'sub-categories', note: 'HRNK, Marked for Life (2012)' },
          { icon: ShieldAlert, value: '27%', label: 'estimated to be in the hostile class', note: 'HRNK estimate on the 2008 census; others say up to 40%', tone: 'danger' },
        ]}
      />

      <h2 id="classes">The three classes</h2>
      <Compare
        items={[
          {
            icon: Crown,
            title: 'Core (haeksim)',
            tone: 'ok',
            children: (
              <p>
                Families of anti-Japanese fighters, war heroes, party officials and the Kim family's inner circle. First in line for
                Pyongyang homes, university places, party membership, good jobs and food. About 28% of people.
              </p>
            ),
          },
          {
            icon: Users,
            title: 'Wavering (dongyo)',
            tone: 'warn',
            children: (
              <p>
                Ordinary families whose loyalty the state treats as uncertain: former small traders, artisans and farmers, and many Koreans
                who moved from Japan. Watched closely, but can rise a little through work and loyalty. About 45%.
              </p>
            ),
          },
          {
            icon: ShieldAlert,
            title: 'Hostile (choktae)',
            tone: 'danger',
            children: (
              <p>
                Descendants of landlords, business owners, collaborators with Japan, religious believers, and families of people who fled
                south, were imprisoned or executed. Called "class enemies". Sent to remote areas, mines and farms. About 27%.
              </p>
            ),
          },
        ]}
      />
      <p>
        The shares are estimates. Kim Il Sung himself put them at 25%, 55% and 20% in 1958. Researchers at the Committee for Human Rights in
        North Korea (HRNK) apply 28%, 45% and 27% to the 2008 census, and some put the hostile class as high as 40%. Nobody outside the
        security services has the real numbers.
      </p>

      <h2 id="history">How it was built</h2>
      <Timeline
        items={[
          { date: '1958–60', title: 'Intensive Guidance Project', text: 'Party teams check every household. About a third of the population is marked as hostile.' },
          { date: '1964', title: 'Three generations', text: 'The party orders a new investigation of every citizen that reaches back three generations of relatives.' },
          { date: '1966–67', title: 'Resident Registration Project', text: 'Every citizen is sorted into friend or foe.' },
          { date: '1967–70', title: '51 categories', text: 'The final scheme: 3 classes, 51 categories. Kim Il Sung presents it to the Fifth Party Congress in 1970.', tone: 'danger' },
          { date: '1990s', title: 'Famine and markets', text: 'The state can no longer feed people. Markets and money start to matter as much as background.' },
          { date: '2014', title: 'UN Commission of Inquiry', text: 'Finds that songbun is at the root of State-sponsored discrimination in North Korea.' },
        ]}
      />

      <h2 id="file">A file on everyone</h2>
      <p>
        From age 17 every North Korean has a file kept by the police, with their family background in it. HRNK found that it is checked
        and updated at least every two years, for everyone except the leader. Most people never see their own file. You can drop a class
        easily, through a crime, a relative who escapes or a bad marriage. Moving up takes a lifetime of loyalty and rarely happens.
      </p>

      <h2 id="what-it-decides">What it decides</h2>
      <p>The UN Commission of Inquiry put it plainly in 2014. Songbun used to be the most important factor in:</p>
      <ul>
        <li>where you are allowed to live, and what kind of home you get</li>
        <li>which job you are assigned</li>
        <li>whether you can actually go to school, and especially university</li>
        <li>how much food you get from the state</li>
        <li>even who you can marry</li>
      </ul>
      <p>
        Pyongyang is the clearest case. The capital is reserved for families the state considers most loyal, and if one person commits
        what counts as a serious political crime, the whole family can be sent away. During the famine of the 1990s, the UN found that
        the state handed out food by songbun and put Pyongyang first. In the worst cases songbun meets the{' '}
        <Link href="/learn/north-korea-prison-camps">prison camps</Link>: whole families, up to three generations, have been sent to camps
        for one relative's political crime. The UN says this still happens, though less often than before.
      </p>

      <h2 id="money">Is money replacing it?</h2>
      <p>
        Partly. After the state rationing system collapsed in the 1990s famine, markets kept people alive, and money started to buy what
        background used to decide. In 2012 a former North Korean told the Associated Press that a place at a good university cost "five
        to ten pheasants", slang for 10,000-yen notes, about $125 each. The UN found in 2014 that money now complicates the old system,
        and that people with neither money nor good songbun are left further behind as public services start to cost money.
      </p>
      <p>
        Researchers point out who collects the bribes, though: officials, who mostly come from good families. Songbun still decides who
        gets into the party, the security services and the elite, the parts of the system that hold power.
      </p>

      <h2 id="kim-mother">Even the Kims hide it</h2>
      <p>
        Kim Jong Un's mother, Ko Yong Hui, was born in Osaka, Japan in 1952 and moved to North Korea with her family in the early 1960s.
        Under songbun, Koreans from Japan rank low, and her father had worked in a factory for the Japanese army. The state never published
        her background, and after Kim Jong Il died even her name was treated as a state secret.
      </p>

      <h2 id="ending-it">What would end it</h2>
      <p>
        The UN Commission of Inquiry asked North Korea to end discrimination by political loyalty and family background, to dismantle
        the secret resident registration files, and to let every citizen see their own file. North Korea's diplomats answer by denying
        that songbun exists. Groups like HRNK compare the fight against it to the campaign against apartheid. You can read what helps on{' '}
        <Link href="/learn/how-to-help-north-koreans">how to help North Koreans</Link>.
      </p>

      <Tldr
        items={[
          'North Korea sorts everyone into 3 classes (core, wavering, hostile) and 51 categories by family background, recorded in a file from age 17.',
          'Songbun has decided where people live, what job and food they get, whether they study and who they marry. Pyongyang is for the loyal.',
          'Money and markets have weakened it since the 1990s famine, but the elite and the security services are still picked by songbun.',
        ]}
      />
    </>
  ),
  faq: [
    {
      q: 'What is songbun in North Korea?',
      a: "Songbun is North Korea's system of classifying every citizen by family background and perceived loyalty to the regime. People are sorted into three classes (core, wavering and hostile) and 51 sub-categories. It has decided where people live, which jobs and how much food they get, whether they can study and whom they can marry.",
    },
    {
      q: 'What are the three classes of songbun?',
      a: 'Core (about 28% of people): families of revolutionaries, war heroes and officials. Wavering (about 45%): ordinary families whose loyalty is seen as uncertain. Hostile (about 27%, some say up to 40%): descendants of landlords, business owners, religious believers and families of people who fled or were imprisoned. These shares are HRNK estimates; the regime publishes no figures.',
    },
    {
      q: 'Can you change your songbun?',
      a: 'Rarely upward. Moving up takes a lifetime of proven loyalty. Falling is easy: a crime, a relative who escapes the country or a marriage into a low-ranked family can lower a whole family. Money and bribes have made some things, like university places, easier to buy since the 1990s.',
    },
    {
      q: 'Does North Korea admit songbun exists?',
      a: 'No. North Korean diplomats at the UN have repeatedly denied it. The UN Commission of Inquiry found in 2014 that songbun is the root of State-sponsored discrimination in North Korea and asked the government to end it.',
    },
  ],
  sources: [
    { label: 'UN Commission of Inquiry on Human Rights in the DPRK, report A/HRC/25/63 (2014), paras 32-33, 39, 41, 47, 59, 89', url: 'https://documents.un.org/api/symbol/access?s=A/HRC/25/63&l=en&t=pdf' },
    { label: 'HRNK, Robert Collins: Marked for Life: Songbun, North Korea’s Social Classification System (2012)', url: 'https://www.hrnk.org/uploads/pdfs/HRNK_Songbun_Web.pdf' },
    { label: 'Associated Press via Arab News: North Korea’s caste system faces power of wealth (2012)', url: 'https://www.arabnews.com/node/436173' },
    { label: 'Wikipedia: Songbun (regime denials at the UN, 2014-2019)', url: 'https://en.wikipedia.org/wiki/Songbun' },
    { label: 'Wikipedia: Ko Yong Hui', url: 'https://en.wikipedia.org/wiki/Ko_Yong_Hui' },
  ],
};

export default article;
