import Link from 'next/link';
import { Lock, MapPin, ShieldAlert, Users } from 'lucide-react';
import { Books, CampGrid, Compare, OrgNotes, Stats, Tldr } from '@/components/ArticleBlocks';
import { OrgLink } from '@/components/HoverLinks';
import { getAllCamps } from '@/content/camps';
import type { Article } from './types';

const article: Article = {
  slug: 'north-korea-prison-camps',
  title: 'North Korea Prison Camps: Where They Are and What Happens',
  h1: "North Korea's prison camps",
  description:
    "North Korea's political prison camps (kwanliso) held an estimated 80,000-120,000 people (UN, 2014). The known camps on a map, how people end up there, and who documents them.",
  teaser: 'The kwanliso system: where the camps are, why whole families end up inside, and what satellite imagery and survivors show.',
  updated: '2026-10-05',
  minutes: 7,
  body: () => (
    <>
      <p className="lede">
        North Korea runs political prison camps called kwanliso. In 2014 a UN Commission of Inquiry estimated 80,000 to 120,000 people were
        held in them, and concluded that what happens inside amounts to crimes against humanity (extermination, murder, enslavement,
        torture, rape, forced abortion). North Korea says the camps don't exist. You can see them on satellite images.
      </p>

      <Stats
        items={[
          { icon: Users, value: '80-120k', label: 'people in political prison camps', note: 'UN estimate, 2014', tone: 'danger' },
          { icon: MapPin, value: String(getAllCamps().length), label: 'facilities tracked on this site', note: 'see /camps' },
        ]}
      />

      <h2>Two kinds of camp</h2>
      <Compare
        items={[
          {
            icon: ShieldAlert,
            title: 'Kwanliso: political prison camps',
            tone: 'danger',
            children: (
              <p>
                For people the state calls enemies, and often their whole families. Many are "total control zones" where nobody is ever
                released. Prisoners mine coal, cut trees, farm and work in factories on starvation rations.
              </p>
            ),
          },
          {
            icon: Lock,
            title: 'Kyohwaso: "re-education" prisons',
            tone: 'warn',
            children: (
              <p>
                For people convicted of crimes, like watching South Korean TV, trading without permission or trying to leave. Sentences
                have an end date, but survivors describe forced labor and death rates that sound a lot like the political camps.
              </p>
            ),
          },
        ]}
      />
      <p>
        On top of those there are short-term detention and interrogation centers. That's usually where people sent back from China go
        first.
      </p>

      <h2>How do people end up there?</h2>
      <p>
        Insulting the leader, practising religion, contact with South Koreans, or just being related to someone who did any of that. Under
        guilt by association (yeonjwaje), the regime has sent the parents, kids and siblings of an "offender" to the camps too. Shin
        Dong-hyuk, the subject of <i>Escape from Camp 14</i>, says he was born inside one.
      </p>

      <h2>The known camps</h2>
      <p>
        All of these are on the <Link href="/map">intel map</Link> with their approximate locations. Status comes from satellite analysis
        and escapee testimony, so it lags reality by months or years (keep that in mind).
      </p>
      <CampGrid slugs={['kwanliso-14', 'kwanliso-15', 'kwanliso-16', 'kwanliso-18', 'kwanliso-22', 'kwanliso-25', 'kyohwaso-1-kaechon', 'kyohwaso-12-chongori']} />
      <p>
        All {getAllCamps().length} tracked facilities are on the <Link href="/camps">prison camps page</Link>.
      </p>
      <p>
        Is it getting better? Hard to say. Some researchers, like the <OrgLink id="tjwg">Transitional Justice Working Group</OrgLink>, see
        signs that the political camp population shrank under Kim Jong Un while ordinary prisons grew. But the UN's 2025 report found that
        repression overall got worse in the decade after 2014, not better.
      </p>

      <h2>Who documents them</h2>
      <OrgNotes
        items={[
          { id: 'hrnk', note: <>publishes satellite imagery analysis of individual camps (its <i>Hidden Gulag</i> report is the standard reference).</> },
          { id: 'nkdb', note: 'keeps a database of violations and a prison database built from tens of thousands of testimonies.' },
          { id: 'korea-future', note: 'documents the penal system case by case, naming perpetrators.' },
          { id: 'tjwg', note: 'maps execution and burial sites for future accountability.' },
        ]}
      />

      <h2>What to read</h2>
      <p>
        <i>The Aquariums of Pyongyang</i> (Kang Chol-hwan, sent to Yodok at 9) and <i>Escape from Camp 14</i> (Blaine Harden) are the
        best known first-hand accounts. Shin Dong-hyuk later changed parts of his story, though the core of what he described matches
        other testimony. More in the <Link href="/library">library</Link>.
      </p>
      <Books titles={['The Aquariums of Pyongyang', 'Escape from Camp 14', 'Eyes of the Tailless Animals: Prison Memoirs of a North Korean Woman', 'Long Road Home: Testimony of a North Korean Camp Survivor']} />

      <Tldr
        items={[
          'The UN estimated 80,000-120,000 people in political prison camps in 2014 and called what happens there crimes against humanity.',
          'Whole families get sent, sometimes three generations, for one person’s “crime”.',
          'The camps are visible on satellite images, and groups like HRNK, NKDB and TJWG keep the record for later.',
        ]}
      />
    </>
  ),
  faq: [
    {
      q: 'How many people are in North Korean prison camps?',
      a: 'The UN Commission of Inquiry estimated in 2014 that 80,000 to 120,000 people were held in political prison camps (kwanliso). Many more pass through ordinary prisons and detention centers. There is no recent precise count.',
    },
    {
      q: 'Are North Korean prison camps still operating?',
      a: 'Yes. Satellite imagery shows several political prison camps still active, including Camp 14 (Kaechon), Camp 16 (Hwasong) and Camp 25 (Chongjin). Some older camps, like Camp 22 (Hoeryong), were closed.',
    },
    {
      q: 'Why are families sent to North Korean prison camps?',
      a: 'Under guilt by association, relatives of a person accused of a political crime can also be imprisoned, sometimes across three generations. This makes resistance extremely costly.',
    },
  ],
  sources: [
    { label: 'UN Commission of Inquiry on human rights in the DPRK (2014)', url: 'https://www.ohchr.org/en/hr-bodies/hrc/co-idprk/commission-inquiry-on-h-rin-dprk' },
    { label: 'HRNK: The Hidden Gulag and camp imagery reports', url: 'https://www.hrnk.org/publications/hrnk-publications.php' },
    { label: 'Human Rights Watch: "lost decade" (2025)', url: 'https://www.hrw.org/news/2025/09/16/north-korea-lost-decade-of-rights-abuses' },
    { label: 'UPI: TJWG on changes in camps under Kim Jong Un (2026)', url: 'https://www.upi.com/Top_News/World-News/2026/07/09/north-korean-human-rights-group/9241783643366/' },
  ],
};

export default article;
