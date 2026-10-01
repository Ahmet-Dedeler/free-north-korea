import Link from 'next/link';
import type { Article } from './types';

const article: Article = {
  slug: 'north-korea-prison-camps',
  title: 'North Korea Prison Camps: Where They Are and What Happens',
  h1: "North Korea's prison camps",
  description:
    "North Korea's political prison camps (kwanliso) hold an estimated 80,000-120,000 people. The known camps on a map, how people end up there, and who documents them.",
  teaser: 'The kwanliso system: where the camps are, why whole families end up inside, and what satellite imagery and survivors show.',
  updated: '2026-10-01',
  minutes: 7,
  body: () => (
    <>
      <p className="lede">
        North Korea runs political prison camps called kwanliso. The UN Commission of Inquiry estimated in 2014 that 80,000 to 120,000
        people were held in them, and concluded that what happens there amounts to crimes against humanity: extermination, murder,
        enslavement, torture, rape and forced abortion. North Korea denies the camps exist. Satellite images show them clearly.
      </p>

      <h2>Two kinds of camp</h2>
      <p>
        <b>Kwanliso (political prison camps)</b> are for people the state calls enemies, and often their families. Many are "total control
        zones" where prisoners are never released. Prisoners mine coal, log, farm and work in factories on starvation rations.
      </p>
      <p>
        <b>Kyohwaso ("re-education" prisons)</b> hold people convicted of crimes, including things like watching South Korean TV, trading
        without permission or trying to leave the country. Sentences have an end date, but survivors describe forced labor and death rates
        that look a lot like the political camps.
      </p>
      <p>
        On top of that, there are short-term detention and interrogation centers, which is where people forcibly sent back from China
        usually go first.
      </p>

      <h2>How people end up there</h2>
      <p>
        Insulting the leader, practising religion, contact with South Koreans, or being related to someone who did any of that. Under the
        principle of guilt by association (yeonjwaje), the regime has sent the parents, children and siblings of an "offender" to the
        camps too. Shin Dong-hyuk, the subject of <i>Escape from Camp 14</i>, says he was born inside a camp.
      </p>

      <h2>The known camps</h2>
      <p>
        All of these are on the <Link href="/atlas">atlas</Link> with their approximate locations. Status is based on satellite imagery analysis
        and escapee testimony, so it lags reality by months or years.
      </p>
      <table>
        <thead>
          <tr>
            <th>Camp</th>
            <th>Type</th>
            <th>Province</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Camp 14, Kaechon</td>
            <td>Political (total control)</td>
            <td>South Pyongan</td>
            <td>Operating</td>
          </tr>
          <tr>
            <td>Camp 15, Yodok</td>
            <td>Political</td>
            <td>South Hamgyong</td>
            <td>Reported closed or downsized, disputed</td>
          </tr>
          <tr>
            <td>Camp 16, Hwasong</td>
            <td>Political (total control)</td>
            <td>North Hamgyong</td>
            <td>Operating, the largest known camp</td>
          </tr>
          <tr>
            <td>Camp 18, Pukchang</td>
            <td>Political</td>
            <td>South Pyongan</td>
            <td>Reported closed or merged</td>
          </tr>
          <tr>
            <td>Camp 22, Hoeryong</td>
            <td>Political</td>
            <td>North Hamgyong</td>
            <td>Closed around 2012, fate of prisoners unknown</td>
          </tr>
          <tr>
            <td>Camp 25, Chongjin</td>
            <td>Political</td>
            <td>North Hamgyong</td>
            <td>Operating, expanded in the 2010s</td>
          </tr>
          <tr>
            <td>Kyohwaso No. 1, Kaechon</td>
            <td>Prison</td>
            <td>South Pyongan</td>
            <td>Operating</td>
          </tr>
          <tr>
            <td>Kyohwaso No. 12, Chongori</td>
            <td>Prison</td>
            <td>North Hamgyong</td>
            <td>Operating, holds many repatriated escapees</td>
          </tr>
        </tbody>
      </table>
      <p>
        Some researchers, like the Transitional Justice Working Group, see signs that the political camp population has shrunk under Kim
        Jong Un while ordinary prisons have grown. The UN's 2025 report found that overall repression got worse over the decade since 2014,
        not better.
      </p>

      <h2>Who documents them</h2>
      <ul>
        <li>
          <Link href="/organizations#hrnk">HRNK</Link> publishes satellite imagery analysis of individual camps (its <i>Hidden Gulag</i> report is
          the standard reference).
        </li>
        <li>
          <Link href="/organizations#nkdb">NKDB</Link> keeps a database of violations and a prison database built from tens of thousands of
          testimonies.
        </li>
        <li>
          <Link href="/organizations#korea-future">Korea Future</Link> documents the penal system case by case, naming perpetrators.
        </li>
        <li>
          <Link href="/organizations#tjwg">TJWG</Link> maps execution and burial sites for future accountability.
        </li>
      </ul>

      <h2>What to read</h2>
      <p>
        <i>The Aquariums of Pyongyang</i> (Kang Chol-hwan, sent to Yodok at 9) and <i>Escape from Camp 14</i> (Blaine Harden) are the best
        known first-hand accounts. Note that Shin Dong-hyuk later changed parts of his story, though the core of what he described is
        consistent with other testimony. More in the <Link href="/library">library</Link>.
      </p>
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
