import Link from 'next/link';
import { RadioTower, Satellite } from 'lucide-react';
import { Compare, DroneEvidenceGallery, DroneFrontSites, DroneRouteMap, DroneTrio, Stats, Timeline, Tldr } from '@/components/ArticleBlocks';
import type { Article } from './types';

const article: Article = {
  slug: 'north-korea-drone-activists',
  title: 'The Students Who Flew Drones Into North Korea, and Got Prosecuted',
  h1: 'Three students flew drones into North Korea. South Korea prosecuted them.',
  description:
    'Four civilian drone flights over Kaesong and the Pyongsan uranium mill, a whistleblower, military intelligence money, and a court that rejected the "benefiting the enemy" charge. What happened, and what it says about who is allowed to act.',
  teaser: 'Four drone flights into North Korea, prison camps and Starlink dreams, intelligence money, and a treason-style charge a court threw out.',
  updated: '2026-10-18',
  minutes: 9,
  body: () => (
    <>
      <p className="lede">
        Between September 2025 and January 2026, three South Korean aerospace graduates flew cheap fixed-wing drones over the border
        into North Korea four times. They filmed Kaesong and a uranium mill, lost two aircraft, and talked about filming the prison
        camps and dropping internet routers into the country. In September 2026 a Seoul court convicted them, but only of flying
        without reporting their drone. It threw out the much bigger charge, that they had benefited the enemy. I think this story
        matters well beyond three guys and some foam planes, because it asks a question nobody in Seoul or Washington seems to want
        to answer: if governments will not open North Korea up, what happens to the civilians who try?
      </p>

      <h2 id="flights">Four flights, two crashes</h2>
      <p>
        On January 10, 2026, North Korea's military published photos of a sky-blue drone in a field in Kaesong and said it had forced
        the aircraft down on January 4. It published the flight log too: launched from Ganghwa Island, south of the border, a grid
        pass over the Pyongsan uranium concentrate plant, then south past Kaesong and Panmun before the crash. A second drone had come
        down the same way in September 2025, launched from Paju. South Korea's defense minister said no military unit had flown on
        those dates, and experts who looked at the wreckage agreed: the airframe matches a Chinese hobby model (a Skywalker Titan
        2160, roughly 1 million won, up to 4 hours and 260 km on paper) built from commercial parts anyone can buy.
      </p>
      <p>
        The court later fixed the numbers: four flights between September 27, 2025 and January 4, 2026, two aircraft lost. The stated
        target, repeated in the flight plans, was the Pyongsan mill and the river below it. Kim Chung-shin, the group's North Korea
        specialist, had spent three years watching North Korean mines and smuggling on satellite images for a Unification Ministry
        affiliate, so he knew exactly what he was pointing a camera at.
      </p>

      <DroneRouteMap />

      <h2 id="who">Who they are</h2>
      <p>
        A note on names first: South Korean court reporting anonymizes defendants (you will see "Mr Oh" in the verdict stories), but
        these three put their own names on a company registry, university records and on-camera interviews long before any arrest, so
        we use them. Their startup was Estel Engineering, founded on September 22, 2023 in Sejong University's startup center.
      </p>

      <DroneTrio />

      <p>
        Read those three profiles together and the shape is kind of obvious. One guy could build the plane, one could fly it and work
        the politics, and one had spent years thinking about North Korea specifically. That combination is rare. It is also, as we
        will get to, part of why this ended in court.
      </p>

      <h2 id="wanted">What they actually wanted</h2>
      <p>
        Kim Chung-shin had been saying the quiet part in public for years. In a June 2025 News1 profile he explained that he got into
        drones after North Korea's drones crossed Seoul in late 2022 ("I thought, we could do this better"), and that his real
        interest was information: current satellite dishes are too big to smuggle, he said, but antennas keep shrinking, and once
        satellite internet reaches ordinary phones without a dish, "a day can come when individuals in North Korea can also use the
        outside internet. I don't think it's a distant future at all." In a January 2025 podcast interview he went further: balloons
        drift, but a drone can put a router down in a chosen spot and come back. He added, in the same breath, that doing it could be
        severely punished and he had no intention of doing it. (He was right about the punishment part.)
      </p>
      <p>
        Before any of that, in 2023 and 2024 he was presenting the same thesis at North Korea human rights and unification forums:
        the regime's censorship laws (the 2020 to 2023 laws that punish watching South Korean media with labor camps or death) prove
        that outside information is the thing it fears most, so the goal should be two-way communication, North Koreans talking back,
        not just leaflets falling out of the sky. Our explainer on <Link href="/learn/information-into-north-korea">how information
        gets into North Korea</Link> covers why that argument is mostly right: USB drives changed the country more than any broadcast.
      </p>

      <DroneEvidenceGallery />

      <h2 id="closed-doors">What he said behind closed doors</h2>
      <p>
        The public interviews were careful. The private talk was not, and this is where a fourth person enters the story: a PhD-level
        drone specialist the group invited to their Sejong office in November 2025, after one of their aircraft crashed during a test
        flight in Yeoju. They wanted help building something that could fly longer. According to MBC's February 2, 2026
        investigation, Kim showed the visitor aerial photos of the Pyongsan plant and GPS logs on his monitor, and said the goal
        plainly: "Our goal is to induce the end of the dictatorship by funneling outside information into North Korea via USBs or
        wireless communication." And: "What I want to film the most is the political prison camps."
      </p>
      <p>
        Two months later the drone came down in Kaesong, and Oh Jong-taek went on Channel A saying he had flown alone, out of
        curiosity about uranium wastewater. The specialist did not buy it. He spoke to MBC and filed a public-interest whistleblower
        report with the joint military-police task force, together with 21 months of a KakaoTalk group chat (May 2024 onward) in
        which Kim had been bragging to a wider circle of defense-minded friends: the plane flies about 140 km, "we tested the method
        to send it all the way to Pyongyang, and succeeded too," "even if we violate North and South Korean air defenses for nearly
        two hours, nobody knows," and, if Pyongyang held a night parade, they would go stir up Kim Il Sung Square and come back.
      </p>
      <p>
        Was the specialist himself in that group chat? MBC never said, and whistleblower law keeps him anonymous (the report was
        filed through a lawyer). But the chat screenshots MBC aired show Kim's messages from a viewer's side of the conversation, and
        the logs and the office testimony arrived together, so he was at minimum filing alongside someone who had sat in that room for
        21 months. Either way, his statement killed the wastewater story. What he described was not a hobby flight. It was a
        years-long project to photograph sensitive sites, film camps, and eventually push information in.
      </p>

      <h2 id="intel">The intelligence money</h2>
      <p>
        Then it got messier. Investigators found that officers from South Korea's Defense Intelligence Command had been in contact
        with the group since around July 2024, received their North Korea footage, recruited Oh as a civilian collaborator, and paid
        roughly 13 million won (about $9,500) in activity funds through two online news outlets the men registered in April 2025, NK
        Monitor and Global Insight. Both sites are now dark. The command said the money was for running the camouflage media outlets.
      </p>

      <DroneFrontSites />

      <p>
        So the same state that prosecuted them had also, through one of its intelligence arms, quietly fed them money and taken
        their photos. Hold that thought, because it is the part of this story I keep coming back to.
      </p>

      <h2 id="court">What the court actually decided</h2>
      <Timeline
        items={[
          { date: 'Sep 2023', title: 'Estel Engineering founded', text: 'Sejong University startup center, the same month South Korea stood up its Drone Operations Command.' },
          { date: 'May 2024', title: 'The group chat opens', text: 'Kim shares drone progress and Pyongyang talk with a wider circle. The log later reaches investigators.' },
          { date: 'Jul 2024', title: 'Intelligence contact', text: 'Defense Intelligence Command officers receive footage, recruit Oh, and fund the group through two news sites (alleged in the investigation, reported by MBC and others).', tone: 'warn' },
          { date: 'Sep 2025 to Jan 2026', title: 'Four flights', text: 'Ganghwa and Paju launches over Kaesong and Pyongsan. Two drones crash inside North Korea.' },
          { date: 'Jan 10, 2026', title: 'North Korea publishes the wreck', text: 'Flight logs, photos, threats. Seoul denies any military flight.', tone: 'danger' },
          { date: 'Jan 16, 2026', title: 'The wastewater story', text: 'Oh tells Channel A he flew alone to check uranium pollution. The whistleblower report lands the same month.', tone: 'warn' },
          { date: 'Feb 2, 2026', title: 'MBC airs the chat logs', text: 'The prison camp quote and the Pyongyang boasts become public.' },
          { date: 'Sep 16, 2026', title: 'Verdict', text: 'Aviation Safety Act: guilty, suspended sentences. General Benefiting of the Enemy: not guilty.', tone: 'ok' },
        ]}
      />
      <p>
        Prosecutors charged all three with General Benefiting of the Enemy (Article 99 of the Criminal Act), arguing that the
        flights exposed South Korea's air-defense gaps and handed Pyongyang a pretext, and asked for 5 years for Oh and 3 years each
        for Jang and Kim. On September 16, 2026, the Seoul Central District Court refused that framing. It found the aviation charge
        proven (the drone, with camera gear, was over the 2 kg reporting line and not a university research exemption) and gave Oh 8
        months and the other two 6 months each, all suspended for 2 years. On the enemy-benefiting charge it said not proven: it was
        never established that the drone even carried an SD card, North Korea's published photos show none, so the court would not
        assume that useful military information (routes, altitudes, flight profiles) had leaked, and giving the North a propaganda
        pretext does not by itself prove harm to South Korea's military interests. One of the three judges would have convicted on
        that charge too. Oh, who had been held, walked out that day.
      </p>
      <Stats
        items={[
          { value: '4', label: 'cross-border flights, Sep 27, 2025 to Jan 4, 2026', note: 'Seoul Central District Court, Sep 16, 2026' },
          { value: '2 of 4', label: 'drones crashed inside North Korea', note: 'Sep 2025 and Jan 4, 2026' },
          { value: '5 yrs', label: 'sentence prosecutors asked for Oh Jong-taek', note: 'He got 8 months, suspended' },
        ]}
      />

      <h2 id="starlink">Would Starlink even work in North Korea?</h2>
      <p>
        Kim's endgame was never the flights themselves. It was connectivity: routers and satellite internet dropped deep inside the
        country. So, honestly, would a Starlink terminal work if one landed outside a prison camp tomorrow? No. And the reasons are
        worth listing, because none of them are laws of physics.
      </p>
      <Compare
        items={[
          {
            icon: Satellite,
            title: 'The geofence',
            tone: 'danger',
            children: (
              <p>
                Starlink serves approved hexagonal cells, roughly 15 to 22 km across. A terminal checks its own GPS position and only
                gets a beam if its cell is switched on. Every cell over North Korea is off (US sanctions, no spectrum license), so a
                smuggled Starlink Mini inside the country stays a brick, apart from a thin bleed along the DMZ and the coast where
                South Korean and maritime cells overlap. SpaceX has flipped coverage on over a whole country in days when politics
                allowed it (Ukraine, February 2022), and refused where sanctions stood in the way (Crimea). Switching on North Korea
                is a decision in Washington, not a technical limit.
              </p>
            ),
          },
          {
            icon: RadioTower,
            title: 'The ground',
            tone: 'warn',
            children: (
              <p>
                Even switched on, a dish needs open sky, 20 to 40 watts all day (solar panels, batteries, in a country where power is
                rationed), and it transmits. North Korea's radio surveillance units already hunt Chinese mobile phones near the
                border with direction finders; a Ku-band uplink is much louder than a phone. And Kim's bigger bet, satellite direct
                to ordinary phones, runs into the phones themselves: North Korean smartphones are locked to the state intranet at
                the system level. The connection has to arrive on hardware people can actually use, which still means smuggled
                foreign phones.
              </p>
            ),
          },
        ]}
      />
      <p>
        None of that makes the idea stupid. It makes it early. The direction is right: every serious account of change inside North
        Korea runs through information getting in and, eventually, North Koreans being able to answer back. A USB stick cannot answer
        back. A connected phone can. What is missing is not imagination, it is permission: a US sanctions license and a SpaceX switch,
        prepared before a crisis instead of improvised during one, plus terminals and phones designed to be small, quiet and cheap on
        power. That is buildable. Somebody should be building it.
      </p>

      <h2 id="opinion">Understandable, and still unfortunate</h2>
      <p>
        I get why Seoul prosecuted. You cannot have civilians flying unannounced through one of the most sensitive air-defense zones
        on earth, on a route over a uranium plant, while an intelligence unit secretly pays them through fake news sites. If a drone
        had come down on a parade, or the North had answered with artillery the way it has before, the same people now calling the
        prosecution cowardly would ask why nobody stopped them. The aviation conviction, a suspended sentence for flying an
        unreported drone across the MDL, seems fair enough to me.
      </p>
      <p>
        But look at the whole picture and it is hard to feel good about it. In 2025 the US cut Radio Free Asia's Korean service and
        South Korea's government ended its own broadcasts and leaned on balloon activists to stop. The loud, official channels into
        North Korea mostly went quiet. And in that same period, probably the most technically serious civilian attempt anyone has
        made to document the camps and break the information blockade was being run by three graduates out of a university startup
        room, partly with intelligence money nobody would own up to. The state funded them in secret, then charged them with helping
        the enemy, then lost that charge in court. That is not a strategy. That is a government that does not know what it thinks.
      </p>
      <p>
        What would better look like? Deliberate, with lines drawn in the open. A government that says: documenting prison camps and
        getting information to North Koreans is a national goal, here is the legal path for civilian groups to do it, here is what
        stays off limits (no flights timed to parades, nothing that risks a firefight), and we will quietly look the other way on the
        small stuff that endangers nobody. Or, if Seoul judges the risks too high, say that too, plainly, and fund the safe channels
        properly instead of cutting them. The worst option is the current one: rhetorical commitment, shrinking budgets, rogue
        handlers, and prosecutions after the fact.
      </p>
      <p>
        And some of this should not wait for governments at all. Civilians doing this work can move faster, try weirder technology,
        and operate in the open as citizens exercising free speech rather than as state assets, which also makes them safer to defend
        when a court case comes. Kim Chung-shin was wrong about a lot of the execution (the bragging, the intelligence money, the
        flights nobody coordinated). I don't think he was wrong about the main thing. Twenty-six million people live inside an
        information blackout that the regime defends with labor camps and death sentences. Somebody outside has to keep pushing on
        that wall, carefully, and the people who try deserve a state that knows whether it is behind them or not.
      </p>

      <Tldr
        items={[
          'Four civilian drone flights over Kaesong and the Pyongsan uranium mill (Sep 2025 to Jan 2026) were the work of three Sejong University graduates at Estel Engineering, one of whom openly wanted to film the prison camps and push outside information in.',
          'A PhD specialist they asked for help, plus 21 months of group chat logs, blew up their "curiosity" cover story; intelligence officers had quietly funded them with about 13 million won through two news sites.',
          'In September 2026 the court gave suspended sentences for flying an unreported drone, and acquitted them of benefiting the enemy. Starlink would not work in North Korea today (geofence, power, surveillance, locked phones), but switching it on is a policy choice, and preparing that choice is overdue.',
        ]}
      />
    </>
  ),
  faq: [
    {
      q: 'Who flew the drones into North Korea in 2025 and 2026?',
      a: 'Three Sejong University aerospace graduates behind the startup Estel Engineering: Jang Han-yong (CEO, airframes), Oh Jong-taek (operator, who claimed responsibility on Channel A) and Kim Chung-shin (North Korea affairs, targets and routes). South Korean court reporting anonymizes them as Mr Jang, Mr Oh and Mr Kim; their names are on the company registry and in interviews they gave under their own names.',
    },
    {
      q: 'What were they convicted of?',
      a: 'On September 16, 2026 the Seoul Central District Court convicted all three under the Aviation Safety Act for flying an unreported drone over the military demarcation line (Oh Jong-taek 8 months, Jang Han-yong and Kim Chung-shin 6 months each, all suspended for 2 years). It acquitted them of General Benefiting of the Enemy, finding it unproven that the drone carried an SD card or that useful military information reached North Korea.',
    },
    {
      q: 'Did they want to free North Korea?',
      a: 'Kim Chung-shin said so repeatedly, in public interviews and, according to a whistleblower who reported the conversation to investigators and MBC, in private: the goal was to push outside information in by USB and wireless links to bring about the end of the dictatorship, and the thing he most wanted to film was the political prison camps. The group also bragged in a KakaoTalk chat about reaching Pyongyang and Kim Il Sung Square, and took about 13 million won from Defense Intelligence Command officers through two news websites.',
    },
    {
      q: 'Would a Starlink terminal work inside North Korea?',
      a: 'Not today. Starlink only serves switched-on coverage cells, and all cells over North Korea are off under US sanctions and licensing rules, so a terminal there cannot connect except in a thin overlap near the DMZ and coast. Even if SpaceX enabled coverage (a US policy decision, as with Ukraine in 2022), a terminal needs open sky and 20 to 40 watts, transmits in Ku-band where North Korean radio surveillance can hunt it, and North Korean phones are locked to the state intranet, so direct-to-cell satellite internet would still need smuggled foreign phones.',
    },
    {
      q: 'How did investigators find out?',
      a: 'North Korea published the downed drone and its flight log on January 10, 2026, and police traced the parts and the university office. A PhD-level drone specialist the group had invited in for help in November 2025 then filed a public-interest whistleblower report describing Kim showing him Pyongsan photos and stating the prison camp goal, together with 21 months of the group KakaoTalk chat, which MBC aired on February 2, 2026.',
    },
  ],
  sources: [
    { label: 'OhmyNews (Feb 3, 2026): the KakaoTalk logs, the PhD specialist, and the intelligence money, summarizing MBC', url: 'https://www.ohmynews.com/NWS_Web/View/at_pg.aspx?CNTN_CD=A0003204054' },
    { label: 'Yonhap (Jan 10, 2026): North Korea publishes the downed drone and flight log; Seoul denies a military flight', url: 'https://www.yna.co.kr/view/AKR20260110027151504' },
    { label: 'News1 (Sep 16, 2026): verdict, suspended sentences, benefiting-the-enemy acquittal and the court reasoning', url: 'https://www.news1.kr/society/court-prosecution/6292388' },
    { label: 'SBS News (Sep 16, 2026): acquittal reasoning, no proven SD card, prosecutors had sought 5 and 3 years', url: 'https://news.sbs.co.kr/news/endPage.do?news_id=N1008756829' },
    { label: 'News1 profile of Kim Chung-shin (June 7, 2025, Daum mirror): drones, collecting, and satellite internet quotes', url: 'https://v.daum.net/v/Kc2GW0qy3t' },
    { label: 'MBC News (Feb 2, 2026, Naver): the group chat and the prison camp quote', url: 'https://n.news.naver.com/article/214/0001478197?sid=100' },
    { label: 'Wikipedia: Starlink in the Russo-Ukrainian War (coverage switched on and geofenced by policy, incl. Crimea)', url: 'https://en.wikipedia.org/wiki/Starlink_in_the_Russo-Ukrainian_War' },
  ],
};

export default article;
