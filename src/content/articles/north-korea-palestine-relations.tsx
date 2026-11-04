import Link from 'next/link';
import { Banknote, Crosshair, Landmark, ShieldAlert, ShieldCheck, ShieldQuestion, Vote } from 'lucide-react';
import { BarList, Compare, Stats, Timeline, Tldr } from '@/components/ArticleBlocks';
import type { Article } from './types';

const article: Article = {
  slug: 'north-korea-palestine-relations',
  title: 'North Korea and Palestine: Relations, Arms and Views',
  h1: 'North Korea and Palestine: what the relationship is',
  description:
    'North Korea recognized Palestine in 1988 and has no ties with Israel. What Pyongyang says, what the Hamas weapons evidence shows, how it votes at the UN, and the trade data.',
  teaser:
    'Recognition since 1988, UN votes, almost no trade, and North Korean grenade launchers found in Gaza: what is documented, what is denied and what is unproven.',
  updated: '2026-11-04',
  minutes: 9,
  body: () => (
    <>
      <p className="lede">
        North Korea recognized the State of Palestine on 24 November 1988 and has never had diplomatic relations with Israel. Since the Gaza
        war began in October 2023 it has issued a steady run of statements blaming Israel and the United States, and it co-sponsored the
        two UN General Assembly resolutions that called for a truce and then a ceasefire. Trade between North Korea and Palestine is close
        to zero. The part with a real cost is weapons: Israel and South Korea say North Korean-made grenade launchers turned up in Gaza,
        and Pyongyang denies it. This article separates what is documented, what is denied and what nobody has shown.
      </p>

      <Stats
        items={[
          { icon: Landmark, value: '1988', label: 'North Korea recognizes the State of Palestine', note: 'UN list of recognitions, 24 Nov 1988' },
          { icon: Vote, value: '2 of 2', label: 'UN General Assembly Gaza resolutions of 2023 that North Korea co-sponsored', note: 'UN records, Oct 27 and Dec 12, 2023' },
          { icon: Banknote, value: '$1.1M', label: 'most trade Palestine has recorded with North Korea in a year (2011)', note: 'UN Comtrade, imports; none recorded 2021 to 2023' },
          { icon: Crosshair, value: 'F-7', label: 'North Korean grenade launcher found in Gaza; Pyongyang denies supplying it', note: 'South Korean intelligence, Jan 2024', tone: 'danger' },
        ]}
      />

      <h2 id="says">What North Korea says</h2>
      <p>
        The line has been the same since the first week. On October 10, 2023, three days after the Hamas attack, the ruling party paper
        Rodong Sinmun ran a short piece citing foreign media. It said the clash was the result of Israel&apos;s &quot;constant criminal
        acts against the Palestinian people&quot; and that the way out is an independent Palestinian state. It was the first time North
        Korean state media addressed the fighting. Since then the main statements have been:
      </p>
      <ul>
        <li>
          <b>May 12, 2024.</b> The Foreign Ministry welcomed the UN General Assembly vote giving Palestine more rights and said the US
          pursues a &quot;one Jewish state policy&quot;. It also accused Israel of &quot;committing genocide against Palestinians&quot;.
        </li>
        <li>
          <b>February 12, 2025.</b> A KCNA commentary on President Trump&apos;s proposal to take over Gaza called it a sign of
          Washington&apos;s &quot;hegemonic, invasive&quot; ambitions and said it was &quot;not an issue limited to the Gaza Strip only&quot;.
        </li>
        <li>
          <b>August 12, 2025.</b> After Israel&apos;s security cabinet approved a plan to occupy all of Gaza, the Foreign Ministry called
          it &quot;a clear act of violating international law&quot; and demanded Israel &quot;completely withdraw&quot;.
        </li>
        <li>
          <b>June 2025.</b> After Israel struck Iran, the ministry called Israel &quot;a cancer-like entity for peace in the Middle
          East&quot;.
        </li>
        <li>
          <b>March 1, 2026.</b> After the US and Israel struck Iran on February 28, the ministry called it a &quot;war of
          aggression&quot;.
        </li>
      </ul>
      <Compare
        items={[
          {
            icon: ShieldAlert,
            title: 'Washington is the target',
            tone: 'danger',
            children: (
              <p>
                Israel is described as &quot;supported and patronised&quot; by the US. Yonhap summed up the February 2025 commentary as
                saying national sovereignty cannot be subject to negotiations with Washington, and NK News argued the Gaza plan deepens
                Pyongyang&apos;s distrust of diplomacy with the US.
              </p>
            ),
          },
          {
            icon: Landmark,
            title: 'Palestinians, not Hamas',
            tone: 'warn',
            children: (
              <p>
                None of the statements quoted above names Hamas. They speak of &quot;Palestinians&quot;, &quot;Palestine&quot; and an
                independent sovereign state.
              </p>
            ),
          },
          {
            icon: Vote,
            title: 'The UN is the stage',
            tone: 'ok',
            children: (
              <p>
                The May 2024 statement was a reaction to a UN vote, not to events on the ground. Pyongyang&apos;s public Palestine policy is
                words and votes. The arms question further down is a separate matter.
              </p>
            ),
          },
        ]}
      />

      <h2 id="history">How the relationship started</h2>
      <Timeline
        items={[
          {
            date: '1960s',
            title: 'Pyongyang picks a side',
            text: 'Kim Il Sung backs Palestinian groups with money and training, as part of a wider campaign against Western-backed governments (CSIS, Washington Institute).',
          },
          {
            date: '1970',
            title: 'PFLP leader in Pyongyang',
            text: 'George Habash, commander of the Popular Front for the Liberation of Palestine, travels to Pyongyang for guidance from intelligence officials, the Washington Institute reports.',
          },
          {
            date: '1972',
            title: 'Lod Airport attack',
            text: 'Citing court documents, the Washington Institute says North Korea trained and financed the Japanese Red Army operatives who attacked Israel’s Lod Airport with the PFLP. 26 people were killed.',
            tone: 'danger',
          },
          {
            date: 'Nov 24, 1988',
            title: 'Recognition',
            text: 'Nine days after the PLO declares independence, North Korea recognizes the State of Palestine. It is 36th on the UN’s list.',
            tone: 'ok',
          },
          {
            date: 'Jun 25–26, 1989',
            title: 'Arafat in Pyongyang',
            text: 'A Polish ambassador’s cable, relaying what the Palestinian embassy told him, says the visit aimed to deepen cooperation, “particularly in the political and military sphere”: North Korean special forces training “several hundred Palestinian airborne troops” and supplies of North Korean arms, “handguns mostly”.',
          },
          {
            date: 'Nov 1992',
            title: 'Israel knocks on the door',
            text: 'A senior Israeli Foreign Ministry official visits Pyongyang to talk about investment in a gold mine. Israel says any aid must include ending missile sales to the Middle East, and North Korea wants to be paid for that. Washington objects, a nuclear crisis starts in 1993, and the talks fade.',
          },
        ]}
      />
      <p>
        After the Soviet Union fell, the arms-and-training phase faded and the relationship turned mostly diplomatic. The State of
        Palestine still has an embassy in Pyongyang. In late August 2025 the Chinese embassy there confirmed that Omar al-Faqih,
        previously charge d&apos;affaires in Italy, is now Palestine&apos;s ambassador to North Korea. NK News noted it was not clear
        when he arrived or whether he had presented credentials, and we found no report of that since.
      </p>

      <h2 id="trade">Trade: almost nothing</h2>
      <p>
        Palestine&apos;s own customs figures, as reported to the UN, show small and irregular imports from North Korea. Machinery was the
        biggest category in 2011 and 2013. In 2013 Palestine also recorded $325,000 of exports to North Korea. After 2015 the only
        recorded trade is $6,700 of imports in 2020.
      </p>
      <BarList
        label="Imports from North Korea recorded by Palestine, US dollars"
        items={[
          { label: '2010', value: 161006, text: '$161k' },
          { label: '2011', value: 1112496, text: '$1.11M' },
          { label: '2012', value: 848176, text: '$848k' },
          { label: '2013', value: 1054923, text: '$1.05M' },
          { label: '2014', value: 132383, text: '$132k' },
          { label: '2015', value: 27776, text: '$28k' },
          { label: '2016–19', value: 0, text: 'none', muted: true },
          { label: '2020', value: 6707, text: '$6.7k' },
          { label: '2021–23', value: 0, text: 'none', muted: true },
        ]}
        caption={
          <>
            UN Comtrade, State of Palestine as reporter, partner North Korea, retrieved November 4, 2026. Palestine reported its overall
            trade in each of the gap years, so a gap means no recorded trade with North Korea. North Korea does not report to Comtrade,
            and goods can move through third countries. For scale, South Korea&apos;s foreign ministry puts its own trade with Palestine
            in 2024 at $18.5 million of exports and $1.39 million of imports.
          </>
        }
      />

      <h2 id="votes">How the two Koreas vote at the UN</h2>
      <p>
        North Korea did more than vote yes. The UN&apos;s record of the draft resolutions lists it among the co-sponsors of both the October
        27 and the December 12, 2023 resolutions, alongside Arab states and others. South Korea, which has not recognized Palestine,
        abstained on the first and voted yes on the next two.
      </p>
      <div className="table-wrap">
        <table className="sanc-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Resolution</th>
              <th>Result (yes–no–abstain)</th>
              <th>North Korea</th>
              <th>South Korea</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Oct 27, 2023</td>
              <td>Humanitarian truce (ES-10/21)</td>
              <td>120–14–45 as recorded; 121–14–44 after Iraq corrected its vote</td>
              <td>Yes, co-sponsor</td>
              <td>Abstained</td>
            </tr>
            <tr>
              <td>Dec 12, 2023</td>
              <td>Immediate humanitarian ceasefire (ES-10/22)</td>
              <td>153–10–23</td>
              <td>Yes, co-sponsor</td>
              <td>Yes</td>
            </tr>
            <tr>
              <td>May 10, 2024</td>
              <td>More rights for Palestine at the UN (ES-10/23)</td>
              <td>143–9–25</td>
              <td>Yes</td>
              <td>Yes</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        The first two resolutions are titled &quot;Protection of civilians and upholding legal and humanitarian obligations&quot;. In 2014 a
        UN commission of inquiry found that North Korea&apos;s own government has committed crimes against humanity, including in its{' '}
        <Link href="/learn/north-korea-prison-camps">prison camps</Link>. Both are on the record.
      </p>

      <h2 id="arms">The weapons question</h2>
      <p>
        This is the part that matters beyond rhetoric, and the evidence differs a lot from claim to claim. Here it is in three groups.
      </p>
      <Compare
        items={[
          {
            icon: ShieldCheck,
            title: 'Documented',
            tone: 'ok',
            children: (
              <p>
                Weapons seized by Israel after October 7 and shown to journalists carried the red-striped warhead of North Korea&apos;s F-7
                rocket-propelled grenade, and an Associated Press analysis matched them, and a Hamas video, to the F-7. South Korea&apos;s
                Joint Chiefs named the F-7 on October 17, 2023. On January 8, 2024 its intelligence service (NIS) published a photo of a
                disassembled F-7 with Korean characters on the fuse. Weapons experts told AP the F-7 has also been documented in Syria,
                Iraq and Lebanon.
              </p>
            ),
          },
          {
            icon: ShieldAlert,
            title: 'Denied by Pyongyang',
            tone: 'warn',
            children: (
              <p>
                On October 13, 2023 KCNA commentator Ri Kwang Song called the claim &quot;a groundless and false rumor&quot; made up by the
                United States.
              </p>
            ),
          },
          {
            icon: ShieldQuestion,
            title: 'Claimed, not shown',
            tone: 'danger',
            children: (
              <p>
                That North Korea sold to Hamas directly. Yonhap noted it is unclear whether the grenades came directly or through other
                countries. A weapons expert told AP Iran is believed to be the main route, and the US State Department said &quot;likely&quot;
                through intermediaries. CSIS describes a 2014 &quot;secret deal&quot; for rockets, and speculates about help with
                Gaza&apos;s tunnels. We found no primary evidence for either.
              </p>
            ),
          },
        ]}
      />
      <p>
        On November 1, 2023 the NIS told South Korean lawmakers, according to a lawmaker who attended, that Kim Jong Un had ordered
        &quot;a wide range of support&quot; for Palestine and that North Korea could trade arms with militant groups. There is older
        history too. In December 2009 Thai authorities grounded an Il-76 cargo plane carrying about 35 tons of North Korean weapons,
        including rockets and grenades. Thailand said it was headed to Iran, and AP reports the US later said the shipment was meant
        for Hamas.
      </p>
      <p>
        <b>The law.</b> UN Security Council resolution 1874 (2009) banned North Korean arms exports other than small arms, and
        resolution 2270 (2016) extended the ban to small arms and light weapons. The UN panel of experts that investigated violations ran
        from 2009 to April 30, 2024. <b>The money.</b> CSIS analysts say money appears to be the main motive, because arms sales fund
        the weapons programs. <b>The courts.</b> In July 2024 more than 125 Americans, victims and relatives, sued Iran, Syria and North
        Korea in federal court in New York for at least $4 billion over October 7. The complaint points to the F-7 evidence. We did not
        find a verified final judgment.
      </p>

      <h2 id="hamas">The Palestinian side is not one voice</h2>
      <p>
        The embassy in Pyongyang belongs to the State of Palestine, which the PLO and the Palestinian Authority represent. Hamas is a
        separate group. In November 2023 its head of external relations, Ali Baraka, speaking from Beirut, called Kim Jong Un
        &quot;perhaps the only one in the world capable of striking the United States&quot; and said &quot;the day may come&quot; when
        North Korea intervenes. An expert quoted by NK News called that wishful thinking, and nothing of the kind has happened.
      </p>

      <h2 id="israel">Israel, South Korea and the rest of the picture</h2>
      <p>
        Israel and North Korea have no diplomatic relations. The Washington Institute describes the relationship as defined for decades
        by &quot;covert hostility and proxy conflict&quot;. Its example is al-Kibar, a Syrian reactor that looked like a copy of North
        Korea&apos;s Yongbyon reactor and that Israeli jets destroyed in 2007. Israel has relations with South Korea only. South Korea in
        turn has not recognized the State of Palestine: its foreign ministry acknowledges the Palestinian National Authority as the sole
        representative of Palestine, and on September 18, 2025 Foreign Minister Cho Hyun told his Palestinian counterpart that Seoul
        supports a two-state solution.
      </p>
      <p>
        One small fact for this site&apos;s readers: in 2011 Israel granted refugee status to a North Korean couple who had fled through
        China and Egypt, with an official saying they would be in serious danger if sent back.
      </p>

      <h2 id="iran">Iran, the 2026 war and what may come next</h2>
      <p>
        North Korea&apos;s statements on Iran follow the Gaza pattern. A March 2, 2026 NK News report says its statement on the US and
        Israeli strikes called them a &quot;war of aggression&quot; without mentioning Iran&apos;s retaliation or the death of its
        supreme leader. Weapons experts believe Iran is the main route for North Korean arms to Palestinian groups, so the question
        analysts ask is whether Pyongyang will help Iran rebuild its missile force. East Asia Forum wrote in August 2026 that the two countries have
        cooperated on missiles since the 1990s, that cooperation slowed in the 2020s, and that South Korean intelligence assesses North
        Korea is not facilitating Iran&apos;s rebuilding. NK News reported in October 2026 that Yemen&apos;s Houthis have used North
        Korean missiles captured from the Yemeni government in the past.
      </p>

      <h2 id="people">What it means for North Koreans</h2>
      <p>
        Statements and UN votes cost Pyongyang little and win it friends in the Global South. Arms sales are different: they bring in
        hard currency for a state that, as the Security Council put it in resolution 2270 (2016), prioritizes its nuclear and missile
        programs over the needs of its people, and whose <Link href="/learn/north-korea-prison-camps">political prison camps</Link>{' '}
        stay open. The tool the law already provides is enforcement of the arms embargo, and CSIS suggests the US and South Korea push
        partners to intercept North Korean arms shipments through the Proliferation Security Initiative. Other ways to help are in{' '}
        <Link href="/learn/how-to-help-north-koreans">how to help North Koreans</Link>.
      </p>
      <p>
        <b>What to watch next:</b> whether KCNA reports Ambassador al-Faqih presenting credentials, any new South Korean or Israeli
        evidence on weapons, how North Korea votes on the next Gaza or Palestinian statehood resolution, and how the Iran conflict ends.
      </p>

      <Tldr
        items={[
          'North Korea recognized Palestine on 24 November 1988, co-sponsored both 2023 UN General Assembly Gaza resolutions, and has no ties with Israel. Its statements blame the US and Israel and speak of Palestinians, never naming Hamas.',
          'Trade is close to nothing: Palestine recorded at most $1.1 million of imports from North Korea in a year (2011).',
          'North Korean F-7 grenade launchers were found in Gaza, South Korea confirmed it in January 2024, and Pyongyang denies it. A direct sale to Hamas is not shown; Iran is the likely route.',
        ]}
      />
    </>
  ),
  faq: [
    {
      q: 'Does North Korea support Palestine?',
      a: 'Yes, in words and at the UN. North Korea recognized the State of Palestine on 24 November 1988, co-sponsored the October and December 2023 UN General Assembly resolutions on Gaza, and its Foreign Ministry has condemned Israel in statements in 2024 and 2025. Its practical support is limited: trade is close to zero.',
    },
    {
      q: 'Does North Korea have relations with Israel?',
      a: 'No. North Korea and Israel have never had diplomatic relations. The Washington Institute describes decades of covert hostility, including a Syrian reactor at al-Kibar that looked like a copy of North Korea’s Yongbyon reactor, which Israel destroyed in 2007. Talks on investment in 1992 and 1993 went nowhere.',
    },
    {
      q: 'Did North Korea give weapons to Hamas?',
      a: 'Israel seized North Korean-made F-7 rocket-propelled grenades after October 7, 2023, and South Korea’s intelligence service confirmed in January 2024 that Hamas used them. Pyongyang calls the claim a groundless rumor. A direct sale to Hamas has not been shown; experts say North Korean arms usually reach Palestinian groups through Iran.',
    },
    {
      q: 'Does South Korea recognize Palestine?',
      a: 'No. South Korea’s foreign ministry says it acknowledges the Palestinian National Authority as the sole representative of Palestine but does not recognize the State of Palestine. It voted yes on the December 2023 ceasefire resolution after abstaining on the October one.',
    },
    {
      q: 'How much do North Korea and Palestine trade?',
      a: 'Very little. Palestine’s customs data, as reported to the UN, show imports from North Korea of at most $1.11 million a year (2011), and none recorded in 2016 to 2019 or 2021 to 2023. South Korea’s trade with Palestine in 2024 was about $19.9 million.',
    },
  ],
  sources: [
    { label: 'UN General Assembly A/78/846: states that have recognized Palestine, with dates (Apr 2024)', url: 'https://digitallibrary.un.org/record/4043996' },
    { label: 'UN Digital Library: draft resolution A/ES-10/L.25 with its co-sponsors (Oct 2023)', url: 'https://digitallibrary.un.org/record/4025113' },
    { label: 'UN Digital Library: draft resolution A/ES-10/L.27 with its co-sponsors (Dec 2023)', url: 'https://digitallibrary.un.org/record/4029637' },
    { label: 'UN Digital Library: recorded vote on A/RES/ES-10/21 (Oct 27, 2023)', url: 'https://digitallibrary.un.org/record/4025240' },
    { label: 'UN Digital Library: recorded vote on A/RES/ES-10/22 (Dec 12, 2023)', url: 'https://digitallibrary.un.org/record/4029732' },
    { label: 'UN Digital Library: recorded vote on A/RES/ES-10/23 (May 10, 2024)', url: 'https://digitallibrary.un.org/record/4046991' },
    { label: 'Al Jazeera: how each country voted on the Dec 2023 ceasefire resolution', url: 'https://www.aljazeera.com/news/2023/12/13/unga-decisively-backs-gaza-ceasefire-resolution-how-your-country-voted' },
    { label: 'KCNA via GlobalSecurity: DPRK Foreign Ministry press statement on Palestine’s UN rights (May 12, 2024)', url: 'https://www.globalsecurity.org/wmd/library/news/dprk/2024/dprk-240512-kcna01.htm' },
    { label: 'Anadolu: North Korea blasts Israeli plan to occupy Gaza (Aug 12, 2025)', url: 'https://www.aa.com.tr/en/middle-east/north-korea-blasts-israeli-plan-to-occupy-gaza/3657813' },
    { label: 'Korea Times/Yonhap: N. Korea denounces Trump’s proposal to take over Gaza (Feb 12, 2025)', url: 'https://www.koreatimes.co.kr/foreignaffairs/northkorea/20250212/north-korea-denounces-trumps-proposal-to-take-over-gaza' },
    { label: 'Asharq Al-Awsat/Reuters: North Korea blames Israel for causing bloodshed in Gaza (Oct 10, 2023)', url: 'https://english.aawsat.com/arab-world/4595836-north-korea-blames-israel-causing-bloodshed-gaza' },
    { label: 'TRT World: North Korea calls Israel “a cancer-like entity for peace” (June 2025)', url: 'https://www.trtworld.com/article/a6816d115444' },
    { label: 'NK News: North Korea condemns US attacks on Iran (Mar 2, 2026)', url: 'https://www.nknews.org/?p=968369' },
    { label: 'NK News: How Trump’s Gaza plan deepens DPRK distrust (Feb 12, 2025)', url: 'https://www.nknews.org/?p=952570' },
    { label: 'Wilson Center Digital Archive: Polish ambassador’s cable on Arafat’s visit to North Korea (June 27, 1989)', url: 'https://digitalarchive.wilsoncenter.org/document/208561' },
    { label: 'Washington Institute: The North Korean-Israeli Shadow War (Sep 2019)', url: 'https://www.washingtoninstitute.org/policy-analysis/north-korean-israeli-shadow-war' },
    { label: 'CSIS: The DPRK-Hamas Relationship (Mar 2024)', url: 'https://www.csis.org/analysis/dprk-hamas-relationship' },
    { label: 'AP via Arab News: Evidence shows Hamas likely used some North Korean weapons (Oct 19, 2023)', url: 'https://www.arabnews.pk/node/2394216/middle-east' },
    { label: 'Korea Times/Yonhap: NK dismisses speculation over Hamas’ use of its weapons (Oct 13, 2023)', url: 'https://www.koreatimes.co.kr/foreignaffairs/northkorea/20231013/nk-dismisses-speculation-over-hamas-use-of-its-weapons-against-israel' },
    { label: 'Algemeiner: South Korea’s spy agency confirms Hamas used North Korean weapons (Jan 8, 2024)', url: 'https://www.algemeiner.com/2024/01/08/hamas-using-north-korean-weapons-against-israel-south-korea-confirms/' },
    { label: 'Korea JoongAng Daily: US says Hamas received North’s weapons through intermediaries (Nov 8, 2023)', url: 'https://www.koreajoongangdaily.com/korea/us-says-hamas-received-norths-weapons-through-intermediaries/12409304' },
    { label: 'Korea Herald: Kim Jong-un orders support for Palestine, NIS says (Nov 1, 2023)', url: 'https://www.koreaherald.com/view.php?ud=20231101000775' },
    { label: 'NK News: ‘Day may come’ when North Korea will attack US to help Palestine, Hamas official (Nov 8, 2023)', url: 'https://www.nknews.org/2023/11/day-may-come-when-north-korea-will-attack-us-to-help-palestine-hamas-official/' },
    { label: 'NK News: Palestine appoints new ambassador to North Korea (Sep 2, 2025)', url: 'https://www.nknews.org/2025/09/palestine-appoints-new-ambassador-to-north-korea-reviving-longstanding-ties/' },
    { label: 'South Korea Ministry of Foreign Affairs: Palestine country page (2026)', url: 'https://www.mofa.go.kr/eng/nation/m_4902/view.do?seq=191' },
    { label: 'South Korea Ministry of Foreign Affairs: Korea-Palestine foreign ministers’ call (Sep 18, 2025)', url: 'https://www.globalsecurity.org/military/library/news/2025/09/mil-250918-rok-mfa01.htm' },
    { label: 'UN Comtrade: trade reported by the State of Palestine with the DPRK, 2010 to 2023', url: 'https://comtradeplus.un.org/' },
    { label: 'Arms Control Association: UN Security Council resolutions on North Korea', url: 'https://www.armscontrol.org/factsheets/UN-Security-Council-Resolutions-on-North-Korea' },
    { label: 'UN Security Council 1718 Committee: panel of experts, 2009 to April 30, 2024', url: 'https://www.un.org/securitycouncil/sanctions/1718' },
    { label: 'AP via PBS: Iran, Syria and North Korea accused of supporting Hamas’ Oct. 7 attack in U.S. lawsuit (Jul 2024)', url: 'https://www.pbs.org/newshour/world/iran-syria-and-north-korea-accused-of-providing-support-for-hamas-oct-7-attack-in-u-s-lawsuit' },
    { label: 'East Asia Forum: The spectre of renewed Iran–North Korea missile cooperation (Aug 8, 2026)', url: 'https://eastasiaforum.org/2026/08/08/the-spectre-of-renewed-iran-north-korea-missile-cooperation/' },
    { label: 'NK News: How North Korean missiles found their way into Houthi hands (Oct 15, 2026)', url: 'https://www.nknews.org/2026/10/how-north-korean-missiles-found-their-way-into-houthi-hands/' },
    { label: 'Ynet: North Korean couple gets refugee status in Israel (Feb 2011)', url: 'https://www.ynetnews.com/article/4024363' },
    { label: 'Wikipedia: Report of the UN Commission of Inquiry on Human Rights in the DPRK (2014)', url: 'https://en.wikipedia.org/wiki/Report_of_the_Commission_of_Inquiry_on_Human_Rights_in_the_Democratic_People%27s_Republic_of_Korea' },
  ],
};

export default article;
