# North Korea Leadership Intelligence Dossier

Tactical, structured entity graph of the people and institutions that govern North Korea, designed for intelligence analysts, researchers, journalists, policymakers, and autonomous agents.

---

## 1. Overview & Architecture

This dossier provides a relational intelligence graph of the Democratic People's Republic of Korea (DPRK) ruling apparatus as of late 2024–2026. The primary dataset is compiled in [`leadership.json`](./leadership.json), structuring **87 high-priority individuals** and **24 core institutions** connected by verified institutional hierarchies, command chains, family lineages, and sanctions records.

### Graph Schema Summary
```
+-------------------------------------------------------------+
|                      PEOPLE (87 Entities)                   |
|  - id (kebab-case)           - status {value, as_of, url}   |
|  - name_en / name_ko         - roles [{title, org_id...}]   |
|  - wikidata / image_commons  - family [{relation, person_id}]|
|  - born / died               - health [{claim, confidence}] |
|  - physical {height, weight} - sanctions [{list, id, date}] |
|  - tags []                   - summary (2 tactical sentences)|
+-------------------------------------------------------------+
                               |
         Directional Roles     |     Family Tree
         (org_id reference)    |     (person_id reference)
                               v
+-------------------------------------------------------------+
|                   ORGANIZATIONS (24 Entities)               |
|  - id (kebab-case)           - parent_org_id (org_id)       |
|  - name_en / name_ko         - head_person_id (person_id)   |
|  - type                      - summary                      |
|  - sanctions []              - source_urls []               |
+-------------------------------------------------------------+
```

### Strict Referential Integrity
Every reference in `leadership.json` is strictly resolved internally:
- Every `person_id` in a person's `family` array points to a valid person `id` in the file.
- Every `org_id` in a person's `roles` array points to a valid organization `id` in the file.
- Every `head_person_id` and `parent_org_id` in an organization points to a valid person or organization `id` in the file (or is `null`).
- All enums (`tags`, `status`, `relation`, `confidence`, `sanctions.list`) are validated against an enforced schema.

---

## 2. Scope & Entity Breakdown

The dataset spans six major operational sectors:

| Sector | Count | Key Figures & Institutions |
| :--- | :--- | :--- |
| **Kim Dynasty (Living & Dead)** | 22 people | Kim Il Sung, Kim Jong Suk, Kim Song Ae, Kim Jong Il, Ko Yong Hui, Song Hye Rim, Kim Ok, Kim Jong Un, Ri Sol Ju, Kim Ju Ae, Kim Yo Jong, Kim Jong Chol, Kim Jong Nam, Kim Han Sol, Kim Sol Song, Kim Kyong Hui, Jang Song Thaek, Kim Pyong Il, Kim Yong Ju. |
| **Top Politburo & Cabinet (2024-2026)** | 20 people | Premier Pak Thae Song (appointed Dec 2024), First Vice Premier Kim Tok Hun, Jo Yong Won (OGD), Choe Ryong Hae (SPA), Defence Minister No Kwang Chol (re-appointed Oct 2024), former Defence Minister Kang Sun Nam, Chief of General Staff Ri Yong Gil, KPA GPB Director Jong Kyong Thaek, Kim Jae Ryong (OGD), O Su Yong (Economy), Pak Jong Gun (Planning). |
| **Security, Police & Cyber** | 8 people | Ri Chang Dae (Minister of State Security), Ri Tae Sop (Minister of Social Security), Ri Chang Ho (RGB Director), Rim Kwang Il, Kim Yong Chol, Park Jin Hyok (RGB Bureau 121 hacker), Kim Won Hong. |
| **Defense Science, Missiles & Economy** | 14 people | Jang Chang Ha (Missile General Bureau / NADS), Kim Jong Sik (MID rocket engineer), Hong Sung Mu (nuclear warhead lead), Jo Chun Ryong (MID secretary / arms to Russia), Han Kwang Sang (Office 39 / Finance), Jon Il Chun (former Office 39 head), Pak Nam Gi (executed 2010). |
| **Diplomats, Purged & Defectors** | 23 people | Foreign Minister Choe Son Hui, UN Ambassador Kim Song, Russia Ambassador Sin Hong Chol, China Ambassador Ri Ryong Nam, executed Defence Minister Hyon Yong Chol, purged Vice Marshal Ri Yong Ho, defected diplomats Thae Yong-ho, Ri Il-gyu (Cuba, Nov 2023), Ryu Hyun-woo (Kuwait), Jo Song-gil (Italy), Hwang Jang-yop, and cultural figures Hyon Song Wol and Ri Chun Hee. |
| **Key Institutions** | 24 orgs | WPK, Politburo, Politburo Presidium, Central Military Commission (CMC), Organization and Guidance Dept (OGD), Propaganda and Agitation Dept (PAD), Munitions Industry Dept (MID), Office 39, State Affairs Commission (SAC), Supreme People's Assembly (SPA), Cabinet, Ministry of National Defence (MND), KPA General Political Bureau, KPA General Staff Department, KPA Strategic Force, Missile General Bureau (MGB), Ministry of State Security (MSS), Ministry of Social Security (MoSS), Reconnaissance General Bureau (RGB), Bureau 121, Lazarus Group / APT38, KOMID, Ministry of Foreign Affairs (MFA), Academy of National Defence Science (NADS). |

---

## 3. Sources Used & Maintenance Status

### 1. Wikidata & Wikimedia Commons
- **Endpoint**: `https://query.wikidata.org/sparql` & Entity Data API `https://www.wikidata.org/wiki/Special:EntityData/<QID>.json`
- **Utility**: QIDs, birth dates, official parentage/lineage, positions held (P39), freely licensed Commons images (P18).
- **Maintenance / Performance**: Wikidata is active, but its public SPARQL endpoint frequently experiences read timeouts on unbounded transitive queries (e.g. `wdt:P106/wdt:P279*`). Targeted queries using `VALUES ?person { wd:Q... }` execute in < 4 seconds. 
- **Image Licensing Caveat**: Wikidata P18 statements for North Korean figures frequently contain inaccurate or non-free images (e.g., misidentifying American television stills or foreign landscapes for North Korean leaders). Only verified public domain or Creative Commons (CC-BY) images from Wikimedia Commons are included in `image_commons`. Where no free image exists, the field is strictly set to `null`.

### 2. North Korea Leadership Watch (NKLW)
- **Primary Domain**: `nkleadershipwatch.wordpress.com` / `nkleadershipwatch.org`
- **Director**: Michael Madden (Nonresident Fellow, Stimson Center).
- **Maintenance Status**:
  - The legacy standalone domain `nkleadershipwatch.org` currently returns HTTP 403 Forbidden (Cloudflare protection) or points to inactive archives.
  - The WordPress blog `nkleadershipwatch.wordpress.com` is largely an archive; its last direct standalone post was published in July 2017.
  - **Current Active Channel**: Michael Madden formally integrated North Korea Leadership Watch into the **Stimson Center / 38 North** project (`38north.org`). Regular analytical reporting on personnel reshuffles, military rotations, and Politburo changes is actively published under 38 North through 2024–2026.

### 3. South Korea Ministry of Unification (MOU) North Korea Information Portal
- **Domain**: `nkinfo.unikorea.go.kr` ("북한정보포털")
- **Maintenance Status**: **Active & Continuously Maintained**.
  - While printed annual editions of 『북한 주요 인물정보』 (Major North Korean Figures Information) are no longer published in hard copy every year, the Ministry of Unification maintains a live database under the `북한인물` section.
  - Updates occur systematically following every WPK Central Committee Plenary Meeting, Supreme People's Assembly session, and official state funeral committee announcements published by KCNA.

### 4. United Nations Security Council 1718 Sanctions List
- **Endpoint**: `https://scsanctions.un.org/resources/xml/en/consolidated.xml`
- **Maintenance Status**: **Real-Time Official Feed**.
  - The UN Consolidated Sanctions List includes 80 DPRK individuals and 75 DPRK entities designated under Chapter VII resolutions (Resolutions 1718, 1874, 2087, 2094, 2270, 2321, 2356, 2371, 2375, 2397).
  - Our probe script (`probe_un_sanctions.py`) extracts permanent UN `DATAID`s, listing dates, and alias records directly from this XML feed.

### 5. US Department of the Treasury OFAC Specially Designated Nationals (SDN) List
- **Endpoint**: `https://www.treasury.gov/ofac/downloads/sdn.xml`
- **Maintenance Status**: **Real-Time Official Feed**.
  - As of October 2026, the OFAC SDN list tracks over 19,450 entries globally, including **366 DPRK individuals** and **435 DPRK entities** under executive orders E.O. 13722, E.O. 13687, E.O. 13810, and related counter-cyber programs (`CYBER2`, `CYBER4`).
  - Our probe script (`probe_ofac_sanctions.py`) parses OFAC `uid`s, program flags, and official aliases.

### 6. South Korean National Intelligence Service (NIS) Briefings
- **Channels**: Parliamentary briefings to the National Assembly Intelligence Committee reported by Yonhap News Agency, Reuters, Chosun Ilbo, and BBC.
- **Utility**: Critical for physical and health metrics (Kim Jong Un weight and health indices), verification of purges, defection circumstances, and succession assessments for Kim Ju Ae.

---

## 4. Key 2024–2026 Leadership Dynamics

1. **Cabinet Leadership Handover (Dec 2024)**:
   - **Pak Thae Song** was appointed Premier of the Cabinet on December 29, 2024 at the 11th Plenary Meeting of the 8th Central Committee, taking over civilian economic management.
   - Former Premier **Kim Tok Hun** was transitioned to First Vice Premier, retaining his seat on the supreme Politburo Presidium despite public reprimands in 2023 over agricultural flooding.

2. **Ministry of National Defence Re-Shuffle (Oct 2024)**:
   - **No Kwang Chol** was re-appointed Minister of National Defence at the 11th Session of the 14th Supreme People's Assembly on October 8, 2024, replacing General **Kang Sun Nam**. No Kwang Chol previously served as defence minister during the 2018–2019 Singapore and Hanoi summits.

3. **Succession Grooming of Kim Ju Ae**:
   - Introduced in November 2022 at a Hwasong-17 launch, Kim Ju Ae has accompanied Kim Jong Un to strategic military sites, military parades, and economic groundbreakings.
   - In March 2024, state media began applying the exclusive ideological title *hyangdo* ("guide/beacon") to her, which South Korean intelligence (NIS) assesses as formal elevation to heir presumptive.

4. **Strategic Weapons Bureaucracy (Missile General Bureau)**:
   - Formally revealed in early 2023, the **Missile General Bureau** under General **Jang Chang Ha** acts as the central administrative and operational bridge between defense science researchers (Academy of National Defence Science) and the operational ballistic missile regiments of the **KPA Strategic Force**.

5. **Diplomatic Defections & Regime Stress**:
   - **Ri Il-gyu**, Counselor for Political Affairs at the DPRK Embassy in Cuba, defected in November 2023 and went public in July 2024, providing insider testimony regarding elite disillusionment, corruption in the foreign ministry, and diplomatic paralysis following Seoul-Havana normalization.

---

## 5. Confidence Taxonomy & Gaps

### Confidence Levels
Every non-obvious fact, health claim, and physical measurement is tagged with an explicit confidence classification:
- **`confirmed`**: Corroborated by official government announcements (e.g. KCNA state obituaries, court indictments by the US DOJ, UN Security Council resolutions, official autopsy reports such as the Malaysian chemical report on Kim Jong Nam, or treating medical doctors such as Dr. François-Xavier Roux for Kim Jong Il's 2008 stroke).
- **`reported`**: Sourced from intelligence agency briefings to legislative committees (e.g. South Korean NIS briefings), reputable diplomatic reporting, or direct interviews with high-ranking defectors.
- **`rumor`**: Speculative reports or uncorroborated claims circulating in tabloid media or anonymous defector networks. Marked explicitly as rumors; unverified execution rumors (e.g., historical rumors that Hyon Song Wol or Ri Yong Gil had been executed) are noted alongside their debunking.

### Critical Intelligence Gaps
1. **Biological Ages of Kim Dynasty Figures**: State propaganda intentionally altered the birth years of Kim Jong Il (claimed 1942 to create a 30-year symmetry with Kim Il Sung's 1912, whereas Soviet records confirm February 16, 1941) and Kim Jong Un (claimed 1982 for a 70-year/40-year symmetry, whereas US Treasury and school records establish January 8, 1984).
2. **Kim Ju Ae's Formal Documentation**: North Korean state media has never once spoken or written her name in domestic broadcasts, referring to her exclusively by titles ("Beloved Child", "Respected Daughter", "Guide"). Her personal name was made public by Dennis Rodman following his 2013 visit to Pyongyang and corroborated by the NIS.
3. **Internal Structure of Cyber Units**: RGB Bureau 121 and Lab 110 operatives operate under multiple false identities and cover firms across Shenyang, Dalian, and Vladivostok. Beyond individuals named in DOJ indictments (such as Park Jin Hyok), most commander identities remain classified state secrets.
4. **Purge vs. Re-Education Fluidity**: Absence from public media does not inherently signify execution. Officials are routinely dispatched to rural cooperative farms or construction complexes for "revolutionary re-education" (혁명화) before being restored to grace (exemplified by Choe Ryong Hae, Ri Pyong Chol, and Pak Jong Chon).

---

## 6. Probe Scripts Inventory

All data extraction, entity probing, and validation tools live in [`docs/research/probes/leadership/`](./probes/leadership/):

- [`probe_wikidata_people.py`](./probes/leadership/probe_wikidata_people.py): Fetches entity JSON dumps from the Wikidata Special:EntityData API for target leaders.
- [`probe_wikidata_sparql.py`](./probes/leadership/probe_wikidata_sparql.py): SPARQL queries for Kim family genealogy, Politburo memberships, and institutional metadata.
- [`probe_un_sanctions.py`](./probes/leadership/probe_un_sanctions.py): Downloads and parses the live UN Security Council 1718 Consolidated Sanctions XML feed.
- [`probe_ofac_sanctions.py`](./probes/leadership/probe_ofac_sanctions.py): Parses the US Department of the Treasury OFAC SDN XML database.
- [`data_orgs.py`](./probes/leadership/data_orgs.py): Modular definitions for the 24 core DPRK state, party, and clandestine organizations.
- [`data_people_kim_family.py`](./probes/leadership/data_people_kim_family.py): Data definitions for 22 Kim family entities.
- [`data_people_politburo_military.py`](./probes/leadership/data_people_politburo_military.py): Data definitions for 20 Politburo and military leaders.
- [`data_people_security_cyber.py`](./probes/leadership/data_people_security_cyber.py): Data definitions for 8 security, police, and cyber commanders.
- [`data_people_science_economy.py`](./probes/leadership/data_people_science_economy.py): Data definitions for 14 defense science, missile, and economy leaders.
- [`data_people_diplomats_purged.py`](./probes/leadership/data_people_diplomats_purged.py): Data definitions for 23 diplomats, defectors, purged elites, and cultural figures.
- [`build_and_validate.py`](./probes/leadership/build_and_validate.py): Master compilation and referential integrity test harness that generates `docs/research/leadership.json`.
