# Leadership dossier brief

Project: map-first, tactical "Palantir for helping free North Korea" (this repo). We need a sourced, structured
dataset of the people who run North Korea, linked to each other like an intelligence entity graph. Audience: NGOs,
researchers, journalists, governments, AI agents. Tactical, not trivia.

## Scope (~60-90 people)
- The Kim family, living and dead: Kim Il Sung, Kim Jong Suk, Kim Song Ae, Kim Jong Il, Song Hye Rim, Ko Yong Hui,
  Kim Ok, Kim Jong Un, Ri Sol Ju, Kim Ju Ae, Kim Yo Jong, Kim Jong Chol, Kim Jong Nam (+ his children Kim Han Sol etc.),
  Kim Sol Song, Kim Kyong Hui, Jang Song Thaek, Kim Pyong Il, Kim Yong Ju, and others with verifiable records.
- Current top leadership (2025-2026): Politburo Presidium and members, Central Military Commission, premier, heads of
  the Ministry of State Security, Ministry of Social Security, KPA General Political Bureau / General Staff, Ministry
  of Defence, Reconnaissance General Bureau, Munitions Industry Department, Organization & Guidance Department,
  Propaganda & Agitation Department, foreign minister (Choe Son Hui), key ambassadors, missile program leaders.
- Notable purged/executed/defected elites (Jang Song Thaek, Hyon Yong Chol, Thae Yong-ho, Ri Il-gyu etc).
- Key institutions as entities too: WPK departments, MSS, RGB, Lazarus/APT38 links, Office 39, Bureau 121, KPA
  Strategic Force, Munitions Industry Department, Korea Mining Development Trading Corp (KOMID).

## Use structured sources first
Wikidata via SPARQL (https://query.wikidata.org/sparql): QIDs, birth/death dates, father P22, mother P25, spouse P26,
child P40, sibling P3373, positions held P39 with start/end, image P18, height P2048, mass P2067. Then: NK Leadership
Watch (nkleadershipwatch.org, check maintenance), South Korea Ministry of Unification "북한 주요인물정보" (nkinfo
unikorea), Yonhap North Korea Who's Who, KCNA/NK News leadership tracker mentions, OFAC SDN list, UN 1718 list, EU/UK
sanctions lists (designation dates + IDs), South Korean NIS briefings reported in press (health, weight, height),
Japanese and Korean press.

## Every claim needs a source
Health (e.g. Kim Jong Un weight/height estimates, gout, hypertension, cardiovascular risk, Kim Jong Il's 2008
stroke), physical stats, roles, relationships, status (alive / dead / purged / unknown, plus last public appearance)
each get {value, source_name, source_url, date, confidence: confirmed|reported|rumor}. Prefer NIS/official/major wire
reports; mark rumors as rumors. Never invent. If unknown, null.

## Output (docs/research/)
1. `leadership.json`: { "people": [...], "orgs": [...] }.
   person keys: id (kebab-case), name_en, name_ko (Hangul), aliases, wikidata (QID or null), image_commons (Wikimedia
   Commons file name or null, must be freely licensed), born {date, place}, died {date, place, cause} or null,
   status {value, as_of, source_url}, gender, roles [{title, org_id, start, end, source_url}],
   family [{relation: father|mother|spouse|child|sibling|half-sibling|uncle|aunt|niece|nephew|in-law, person_id, note}],
   health [{claim, source_name, source_url, date, confidence}], physical {height_cm, weight_kg each as claim objects or null},
   sanctions [{list: OFAC|UN|EU|UK|JP|KR, id, date, source_url}], summary (2 sentences, tactical: what power they hold
   and why they matter), notable [{claim, source_url, date}], tags (family|politburo|military|security|cyber|missile|
   diplomat|purged|defector|economy).
   org keys: id, name_en, name_ko, type, parent_org_id, head_person_id, summary, sanctions[], source_urls[].
   person_id/org_id references must point to ids in the same file (add minimal stub entries if needed).
2. `leadership.md`: method, sources used (with maintenance status: is NK Leadership Watch still updated? MOU?),
   gaps, confidence notes.
Probe scripts (e.g. the SPARQL queries) go in docs/research/probes/leadership/. Do not touch anything else.
