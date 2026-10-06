/**
 * Text for the people index and each profile, in English, Korean, Japanese and Simplified Chinese.
 * English summaries and role titles are the strings in data/entities/people.json, copied here so a
 * translation cannot drift from the data. Header names stay name_en and name_ko.
 */
import type { Confidence, Relation } from '@/entities/types';
import type { Lang } from '@/site/seo';

export const PEOPLE_PATHS = { en: '/people', ko: '/ko/people', ja: '/ja/people', zh: '/zh/people' } as const;

export function personLanguages(id: string): Record<Lang, string> {
  return { en: `/people/${id}`, ko: `/ko/people/${id}`, ja: `/ja/people/${id}`, zh: `/zh/people/${id}` };
}

/** Kim family tree route in the same language. The page itself is translated separately. */
export function familyTreePath(lang: Lang, id?: string): string {
  const base = lang === 'en' ? '/kim-family-tree' : `/${lang}/kim-family-tree`;
  return id ? `${base}#${id}` : base;
}

export type Quad = Record<Lang, string>;

const q = (en: string, ko: string, ja: string, zh: string): Quad => ({ en, ko, ja, zh });

type Group = { tag: string; title: string; hint: string };

export interface PeopleText {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  lede: (n: number) => string;
  jsonCta: string;
  afterJson: string;
  sanctionsLink: string;
  afterSanctions: string;
  treeTitle: string;
  treeHint: string;
  groups: Group[];
  sanctioned: string;
  ogKicker: string;
  ogFallback: string;
  born: string;
  died: string;
  unknown: string;
  height: string;
  weight: string;
  cm: string;
  kg: string;
  rank: string;
  statusAsOf: string;
  aka: string;
  family: string;
  seeTree: string;
  positions: string;
  now: string;
  health: string;
  notable: string;
  sanctions: string;
  allSanctioned: string;
  since: (date: string) => string;
  listing: string;
  source: string;
  wikipedia: string;
  machine: string;
  photo: string;
  diedAged: (age: number) => string;
  yearsOld: (age: number) => string;
  sanctionedBadge: (list: string) => string;
  statusAlive: string;
  statusDead: string;
  status: Record<string, string>;
  tags: Record<string, string>;
  conf: Record<Confidence, string>;
  relation: Record<Relation, string>;
}

const GROUPS_EN: Group[] = [
  { tag: 'politburo', title: 'Party and state leadership', hint: 'Politburo, cabinet and the Supreme People’s Assembly' },
  { tag: 'military', title: 'Military', hint: 'Korean People’s Army command' },
  { tag: 'security', title: 'Security services', hint: 'Secret police, police and intelligence' },
  { tag: 'missile', title: 'Weapons programs', hint: 'Missiles, nuclear and munitions industry' },
  { tag: 'cyber', title: 'Cyber', hint: 'Hacking units and crypto theft' },
  { tag: 'economy', title: 'Money', hint: 'Office 39, finance and trade' },
  { tag: 'diplomat', title: 'Diplomats', hint: 'Foreign ministry and ambassadors' },
  { tag: 'purged', title: 'Purged or executed', hint: 'What happens to people who fall' },
  { tag: 'defector', title: 'Elite defectors', hint: 'Officials who escaped' },
];

export const PEOPLE_TEXT: Record<Lang, PeopleText> = {
  en: {
    metaTitle: 'Who Runs North Korea: Kim Family Tree and Leadership',
    metaDescription:
      'The Kim family tree and the people who run North Korea in 2026: ages, roles, family links, health reports and sanctions, each with sources. Also available as JSON.',
    eyebrow: 'People',
    h1: 'Who runs North Korea',
    lede: (n) =>
      `${n} people: the Kim family and the officials around them. Hover a name for a quick card, click for the full profile with family, positions, health reports and sanctions. Every fact links to its source.`,
    jsonCta: 'Get it all as JSON',
    afterJson: '. For everyone on the UN and US lists, see',
    sanctionsLink: 'sanctions',
    afterSanctions: '.',
    treeTitle: 'The Kim family now',
    treeHint: 'Family tree: who is who around Kim Jong Un, their ages, roles and the named successor',
    groups: GROUPS_EN,
    sanctioned: 'sanctioned',
    ogKicker: 'Who runs North Korea',
    ogFallback: 'People',
    born: 'Born',
    died: 'Died',
    unknown: 'Unknown',
    height: 'Height',
    weight: 'Weight',
    cm: 'cm',
    kg: 'kg',
    rank: 'Military rank',
    statusAsOf: 'Status as of',
    aka: 'Also known as',
    family: 'Family',
    seeTree: 'See in the family tree',
    positions: 'Positions',
    now: 'now',
    health: 'Health',
    notable: 'Notable',
    sanctions: 'Sanctions',
    allSanctioned: 'everyone sanctioned →',
    since: (date) => `since ${date}`,
    listing: 'listing',
    source: 'source',
    wikipedia: 'Wikipedia',
    machine: 'Machine-readable:',
    photo: 'Photo:',
    diedAged: (age) => `Died aged ${age}`,
    yearsOld: (age) => `${age} years old`,
    sanctionedBadge: (list) => `Sanctioned: ${list}`,
    statusAlive: 'Alive',
    statusDead: 'Dead',
    status: { alive: 'alive', dead: 'dead', executed: 'executed', purged: 'purged', unknown: 'unknown', defected: 'defected' },
    tags: {
      family: 'family',
      politburo: 'politburo',
      military: 'military',
      missile: 'missile',
      security: 'security',
      economy: 'economy',
      diplomat: 'diplomat',
      cyber: 'cyber',
      purged: 'purged',
      defector: 'defector',
    },
    conf: { confirmed: 'Confirmed', reported: 'Reported', rumor: 'Rumor' },
    relation: {
      father: 'father',
      mother: 'mother',
      spouse: 'spouse',
      child: 'child',
      sibling: 'sibling',
      'half-sibling': 'half sibling',
      uncle: 'uncle',
      aunt: 'aunt',
      niece: 'niece',
      nephew: 'nephew',
      'in-law': 'in law',
    },
  },
  ko: {
    metaTitle: '북한을 움직이는 사람들: 김씨 가계와 지도부',
    metaDescription:
      '2026년 북한을 움직이는 김씨 일가와 당국자들입니다. 나이, 직책, 가족 관계, 건강 보도, 제재를 출처와 함께 정리했습니다. JSON으로도 받을 수 있습니다.',
    eyebrow: '인물',
    h1: '북한을 움직이는 사람들',
    lede: (n) =>
      `${n}명입니다. 김씨 일가와 그 주변의 당국자들입니다. 이름 위에 마우스를 올리면 짧은 카드가 나오고, 클릭하면 가족, 직책, 건강 보도, 제재가 담긴 전체 프로필이 나옵니다. 모든 사실에는 출처가 연결되어 있습니다.`,
    jsonCta: '전체를 JSON으로 받기',
    afterJson: '. 유엔과 미국 명단에 오른 모든 사람은',
    sanctionsLink: '제재',
    afterSanctions: ' 페이지를 보십시오.',
    treeTitle: '지금의 김씨 일가',
    treeHint: '가계도입니다. 김정은 주변의 누가 누구인지, 나이, 역할, 후계자로 이름이 나온 사람입니다.',
    groups: [
      { tag: 'politburo', title: '당과 국가 지도부', hint: '정치국, 내각, 최고인민회의' },
      { tag: 'military', title: '군', hint: '조선인민군 지휘부' },
      { tag: 'security', title: '보안 기관', hint: '비밀경찰, 경찰, 정보기관' },
      { tag: 'missile', title: '무기 개발', hint: '미사일, 핵, 군수공업' },
      { tag: 'cyber', title: '사이버', hint: '해킹 부대와 암호화폐 탈취' },
      { tag: 'economy', title: '자금', hint: '39호실, 금융, 무역' },
      { tag: 'diplomat', title: '외교관', hint: '외무성과 대사' },
      { tag: 'purged', title: '숙청 또는 처형', hint: '실각한 사람들의 말로' },
      { tag: 'defector', title: '엘리트 탈북자', hint: '탈출한 당국자' },
    ],
    sanctioned: '제재',
    ogKicker: '북한을 움직이는 사람들',
    ogFallback: '인물',
    born: '출생',
    died: '사망',
    unknown: '알 수 없음',
    height: '키',
    weight: '몸무게',
    cm: 'cm',
    kg: 'kg',
    rank: '군사 계급',
    statusAsOf: '상태 기준 시점',
    aka: '다른 이름',
    family: '가족',
    seeTree: '가계도에서 보기',
    positions: '직책',
    now: '현재',
    health: '건강',
    notable: '주요 사실',
    sanctions: '제재',
    allSanctioned: '제재 대상 전체 →',
    since: (date) => `${date}부터`,
    listing: '명단',
    source: '출처',
    wikipedia: '위키백과',
    machine: '기계가 읽는 형식:',
    photo: '사진:',
    diedAged: (age) => `${age}세에 사망`,
    yearsOld: (age) => `${age}세`,
    sanctionedBadge: (list) => `제재: ${list}`,
    statusAlive: '생존',
    statusDead: '사망',
    status: { alive: '생존', dead: '사망', executed: '처형', purged: '숙청', unknown: '불명', defected: '탈북' },
    tags: {
      family: '가족',
      politburo: '정치국',
      military: '군',
      missile: '무기',
      security: '보안',
      economy: '경제',
      diplomat: '외교',
      cyber: '사이버',
      purged: '숙청',
      defector: '탈북',
    },
    conf: { confirmed: '확인됨', reported: '보도됨', rumor: '소문' },
    relation: {
      father: '아버지',
      mother: '어머니',
      spouse: '배우자',
      child: '자녀',
      sibling: '형제자매',
      'half-sibling': '이복형제',
      uncle: '삼촌',
      aunt: '고모·이모',
      niece: '조카딸',
      nephew: '조카',
      'in-law': '인척',
    },
  },
  ja: {
    metaTitle: '北朝鮮を動かす人々：金一族と指導部',
    metaDescription:
      '2026年に北朝鮮を動かす金一族と当局者です。年齢、役職、家族関係、健康に関する報道、制裁を、出典つきでまとめています。JSONでも取得できます。',
    eyebrow: '人物',
    h1: '北朝鮮を動かす人々',
    lede: (n) =>
      `${n}人です。金一族と、その周囲の当局者です。名前にカーソルを置くと短いカードが出て、クリックすると家族、役職、健康に関する報道、制裁まで入ったプロフィールが開きます。どの事実にも出典がついています。`,
    jsonCta: 'すべてをJSONで取得',
    afterJson: '。国連と米国のリストに載っている人は',
    sanctionsLink: '制裁',
    afterSanctions: 'のページを見てください。',
    treeTitle: 'いまの金一族',
    treeHint: '家系図です。金正恩の周囲で誰が誰か、年齢、役割、後継者として名前が挙がった人です。',
    groups: [
      { tag: 'politburo', title: '党と国家の指導部', hint: '政治局、内閣、最高人民会議' },
      { tag: 'military', title: '軍', hint: '朝鮮人民軍の指揮部' },
      { tag: 'security', title: '保安機関', hint: '秘密警察、警察、情報機関' },
      { tag: 'missile', title: '兵器開発', hint: 'ミサイル、核、軍需産業' },
      { tag: 'cyber', title: 'サイバー', hint: 'ハッキング部隊と暗号資産の窃取' },
      { tag: 'economy', title: '資金', hint: '39号室、財政、貿易' },
      { tag: 'diplomat', title: '外交官', hint: '外務省と大使' },
      { tag: 'purged', title: '粛清または処刑', hint: '失脚した人の末路' },
      { tag: 'defector', title: 'エリート脱北者', hint: '脱出できた当局者' },
    ],
    sanctioned: '制裁',
    ogKicker: '北朝鮮を動かす人々',
    ogFallback: '人物',
    born: '出生',
    died: '死去',
    unknown: '不明',
    height: '身長',
    weight: '体重',
    cm: 'cm',
    kg: 'kg',
    rank: '軍の階級',
    statusAsOf: '地位の時点',
    aka: '別名',
    family: '家族',
    seeTree: '家系図で見る',
    positions: '役職',
    now: '現在',
    health: '健康',
    notable: '特記',
    sanctions: '制裁',
    allSanctioned: '制裁されている人すべて →',
    since: (date) => `${date}から`,
    listing: '掲載',
    source: '出典',
    wikipedia: 'ウィキペディア',
    machine: '機械可読:',
    photo: '写真:',
    diedAged: (age) => `${age}歳で死去`,
    yearsOld: (age) => `${age}歳`,
    sanctionedBadge: (list) => `制裁: ${list}`,
    statusAlive: '存命',
    statusDead: '死亡',
    status: { alive: '存命', dead: '死亡', executed: '処刑', purged: '粛清', unknown: '不明', defected: '脱北' },
    tags: {
      family: '家族',
      politburo: '政治局',
      military: '軍',
      missile: '兵器',
      security: '保安',
      economy: '経済',
      diplomat: '外交',
      cyber: 'サイバー',
      purged: '粛清',
      defector: '脱北',
    },
    conf: { confirmed: '確認済み', reported: '報道', rumor: '噂' },
    relation: {
      father: '父',
      mother: '母',
      spouse: '配偶者',
      child: '子',
      sibling: 'きょうだい',
      'half-sibling': '異父母のきょうだい',
      uncle: 'おじ',
      aunt: 'おば',
      niece: 'めい',
      nephew: 'おい',
      'in-law': '姻族',
    },
  },
  zh: {
    metaTitle: '谁在掌管朝鲜：金氏家族与领导层',
    metaDescription: '2026年掌管朝鲜的金氏家族和官员。年龄、职务、亲属关系、健康报道和制裁，每项都有来源。也可以按 JSON 获取。',
    eyebrow: '人物',
    h1: '谁在掌管朝鲜',
    lede: (n) =>
      `共${n}人，包括金氏家族和他们身边的官员。把光标放在名字上会弹出简卡，点开则是含家人、职务、健康报道和制裁的完整档案。每条事实都链到出处。`,
    jsonCta: '以 JSON 获取全部',
    afterJson: '。联合国和美国名单上的所有人见',
    sanctionsLink: '制裁',
    afterSanctions: '页。',
    treeTitle: '今天的金氏家族',
    treeHint: '这是家族树：金正恩身边的人分别是谁、年龄、职务，以及被点名为接班人的人。',
    groups: [
      { tag: 'politburo', title: '党和国务领导层', hint: '政治局、内阁和最高人民会议' },
      { tag: 'military', title: '军队', hint: '朝鲜人民军指挥层' },
      { tag: 'security', title: '安全机关', hint: '秘密警察、警察和情报机构' },
      { tag: 'missile', title: '武器项目', hint: '导弹、核与军工' },
      { tag: 'cyber', title: '网络', hint: '黑客部队与加密货币盗窃' },
      { tag: 'economy', title: '资金', hint: '39号室、财政与贸易' },
      { tag: 'diplomat', title: '外交官', hint: '外务省与大使' },
      { tag: 'purged', title: '被清洗或处决', hint: '失势者的下场' },
      { tag: 'defector', title: '高层脱北者', hint: '逃脱的官员' },
    ],
    sanctioned: '受制裁',
    ogKicker: '谁在掌管朝鲜',
    ogFallback: '人物',
    born: '出生',
    died: '去世',
    unknown: '不详',
    height: '身高',
    weight: '体重',
    cm: 'cm',
    kg: 'kg',
    rank: '军衔',
    statusAsOf: '状态截至',
    aka: '又名',
    family: '家人',
    seeTree: '在家族树中查看',
    positions: '职务',
    now: '至今',
    health: '健康',
    notable: '要事',
    sanctions: '制裁',
    allSanctioned: '全部被制裁者 →',
    since: (date) => `自${date}`,
    listing: '名单',
    source: '来源',
    wikipedia: '维基百科',
    machine: '机器可读:',
    photo: '照片:',
    diedAged: (age) => `享年${age}岁`,
    yearsOld: (age) => `${age}岁`,
    sanctionedBadge: (list) => `受制裁：${list}`,
    statusAlive: '在世',
    statusDead: '已故',
    status: { alive: '在世', dead: '已故', executed: '被处决', purged: '被清洗', unknown: '不详', defected: '脱北' },
    tags: {
      family: '家族',
      politburo: '政治局',
      military: '军队',
      missile: '武器',
      security: '安全',
      economy: '经济',
      diplomat: '外交',
      cyber: '网络',
      purged: '清洗',
      defector: '脱北',
    },
    conf: { confirmed: '已证实', reported: '据报道', rumor: '传闻' },
    relation: {
      father: '父亲',
      mother: '母亲',
      spouse: '配偶',
      child: '子女',
      sibling: '兄弟姐妹',
      'half-sibling': '半同胞',
      uncle: '叔伯',
      aunt: '姑姨',
      niece: '侄女',
      nephew: '侄子',
      'in-law': '姻亲',
    },
  },
};

export const ROLE_TITLES: Record<string, Quad> = {
  "Acting Ambassador to Italy": q("Acting Ambassador to Italy", "주이탈리아 임시 대사", "駐イタリア臨時代理大使", "驻意大利临时代办"),
  "Alternate Member of the WPK Political Bureau": q("Alternate Member of the WPK Political Bureau", "조선노동당 정치국 후보위원", "朝鮮労働党政治局候補委員", "朝鲜劳动党政治局候补委员"),
  "Alternate member of the Politburo of the Workers' Party of Korea": q("Alternate member of the Politburo of the Workers' Party of Korea", "조선노동당 정치국 후보위원", "朝鮮労働党政治局候補委員", "朝鲜劳动党政治局候补委员"),
  "Ambassador to Poland": q("Ambassador to Poland", "주폴란드 대사", "駐ポーランド大使", "驻波兰大使"),
  "Ambassador to the Czech Republic": q("Ambassador to the Czech Republic", "주체코 대사", "駐チェコ大使", "驻捷克大使"),
  "Chairman of the Supreme People's Assembly": q("Chairman of the Supreme People's Assembly", "최고인민회의 의장", "最高人民会議議長", "最高人民会议议长"),
  "Chairperson of the Committee for the Peaceful Reunification of the Fatherland": q("Chairperson of the Committee for the Peaceful Reunification of the Fatherland", "조국평화통일위원회 위원장", "祖国平和統一委員会委員長", "祖国和平统一委员会委员长"),
  "Chairwoman of the Democratic Women's Union of Korea": q("Chairwoman of the Democratic Women's Union of Korea", "조선민주여성동맹 위원장", "朝鮮民主女性同盟委員長", "朝鲜民主女性同盟委员长"),
  "Chief Anchor, Korean Central Television (KCTV)": q("Chief Anchor, Korean Central Television (KCTV)", "조선중앙텔레비전(KCTV) 책임 아나운서", "朝鮮中央テレビ（KCTV）主任アナウンサー", "朝鲜中央电视台（KCTV）首席播音员"),
  "Chief of General Staff of the Korean People's Army": q("Chief of General Staff of the Korean People's Army", "조선인민군 총참모장", "朝鮮人民軍総参謀長", "朝鲜人民军总参谋长"),
  "Chief of the General Staff Department": q("Chief of the General Staff Department", "총참모부장", "総参謀部長", "总参谋长"),
  "Chief of the General Staff Department of the KPA": q("Chief of the General Staff Department of the KPA", "조선인민군 총참모부장", "朝鮮人民軍総参謀部長", "朝鲜人民军总参谋长"),
  "Deputy Ambassador to the United Kingdom": q("Deputy Ambassador to the United Kingdom", "주영국 차석대사", "駐英国次席大使", "驻英国副大使"),
  "Deputy Director of the Propaganda and Agitation Department of the Workers' Party of Korea": q("Deputy Director of the Propaganda and Agitation Department of the Workers' Party of Korea", "조선노동당 선전선동부 부부장", "朝鮮労働党宣伝扇動部副部長", "朝鲜劳动党宣传鼓动部副部长"),
  "Director of Administration Department": q("Director of Administration Department", "행정부장", "行政部長", "行政部门长"),
  "Director of Finance and Accounting Department": q("Director of Finance and Accounting Department", "재정경리부장", "財政経理部長", "财政会计部长"),
  "Director of Light Industry Department": q("Director of Light Industry Department", "경공업부장", "軽工業部長", "轻工业部长"),
  "Director of Planning and Financial Department": q("Director of Planning and Financial Department", "계획재정부장", "計画財政部長", "计划财政部长"),
  "Director of the General Affairs Department of the Workers' Party of Korea": q("Director of the General Affairs Department of the Workers' Party of Korea", "조선노동당 총무부장", "朝鮮労働党総務部長", "朝鲜劳动党总务部长"),
  "Director of the Propaganda and Agitation Department": q("Director of the Propaganda and Agitation Department", "선전선동부장", "宣伝扇動部長", "宣传鼓动部长"),
  "Director of the Propaganda and Agitation Department of the Workers’ Party of Korea": q("Director of the Propaganda and Agitation Department of the Workers’ Party of Korea", "조선노동당 선전선동부장", "朝鮮労働党宣伝扇動部長", "朝鲜劳动党宣传鼓动部长"),
  "Director of the Reconnaissance General Bureau": q("Director of the Reconnaissance General Bureau", "정찰총국장", "偵察総局長", "侦察总局局长"),
  "Eternal leaders of North Korea": q("Eternal leaders of North Korea", "북한의 영원한 수령", "北朝鮮の永遠の領袖", "朝鲜永远的领袖"),
  "First Lady of North Korea": q("First Lady of North Korea", "북한의 영부인", "北朝鮮のファーストレディ", "朝鲜第一夫人"),
  "First Vice Chairman of the State Affairs Commission": q("First Vice Chairman of the State Affairs Commission", "국무위원회 제1부위원장", "国務委員会第1副委員長", "国务委员会第一副委员长"),
  "First Vice Director of the Munitions Industry Department": q("First Vice Director of the Munitions Industry Department", "군수공업부 제1부부장", "軍需工業部第1副部長", "军需工业部第一副部长"),
  "First Vice Minister of Foreign Affairs": q("First Vice Minister of Foreign Affairs", "외무성 제1부상", "外務省第1副相", "外务省第一副相"),
  "General Secretary of the Workers' Party of Korea": q("General Secretary of the Workers' Party of Korea", "조선노동당 총비서", "朝鮮労働党総書記", "朝鲜劳动党总书记"),
  "Hacker, Lab 110 / Lazarus Group": q("Hacker, Lab 110 / Lazarus Group", "해커, 110호 연구소 / 라자루스 그룹", "ハッカー、ラボ110／ラザルス・グループ", "黑客，110实验室／拉撒路组织"),
  "Head of Secretariat, Committee for the Peaceful Reunification of the Fatherland": q("Head of Secretariat, Committee for the Peaceful Reunification of the Fatherland", "조국평화통일위원회 서기국장", "祖国平和統一委員会書記局長", "祖国和平统一委员会书记局局长"),
  "Head of the Missile General Bureau": q("Head of the Missile General Bureau", "미사일총국장", "ミサイル総局長", "导弹总局局长"),
  "KPA General": q("KPA General", "조선인민군 대장", "朝鮮人民軍大将", "朝鲜人民军大将"),
  "Leader of the Moranbong Band / Samjiyon Orchestra": q("Leader of the Moranbong Band / Samjiyon Orchestra", "모란봉악단 / 삼지연관현악단 단장", "牡丹峰楽団／三池淵管弦楽団団長", "牡丹峰乐团／三池渊管弦乐团团长"),
  "Member of the National Assembly of South Korea": q("Member of the National Assembly of South Korea", "한국 국회의원", "韓国国会議員", "韩国国会议员"),
  "Member of the National Defence Commission": q("Member of the National Defence Commission", "국방위원회 위원", "国防委員会委員", "国防委员会委员"),
  "Member of the Politburo Presidium": q("Member of the Politburo Presidium", "정치국 상무위원회 위원", "政治局常務委員会委員", "政治局常务委员会委员"),
  "Member of the State Affairs Commission": q("Member of the State Affairs Commission", "국무위원회 위원", "国務委員会委員", "国务委员会委员"),
  "Member of the Supreme People's Assembly": q("Member of the Supreme People's Assembly", "최고인민회의 대의원", "最高人民会議代議員", "最高人民会议代议员"),
  "Member of the WPK Central Committee": q("Member of the WPK Central Committee", "조선노동당 중앙위원회 위원", "朝鮮労働党中央委員会委員", "朝鲜劳动党中央委员会委员"),
  "Minister of Foreign Affairs of the Democratic People's Republic of Korea": q("Minister of Foreign Affairs of the Democratic People's Republic of Korea", "조선민주주의인민공화국 외무상", "朝鮮民主主義人民共和国外相", "朝鲜民主主义人民共和国外务相"),
  "Minister of Foreign Trade of North Korea": q("Minister of Foreign Trade of North Korea", "북한 무역상", "北朝鮮貿易相", "朝鲜贸易相"),
  "Minister of National Defence": q("Minister of National Defence", "국방상", "国防相", "国防相"),
  "Minister of People's Armed Forces": q("Minister of People's Armed Forces", "인민무력상", "人民武力相", "人民武力相"),
  "Minister of Social Security": q("Minister of Social Security", "사회안전상", "社会安全相", "社会安全相"),
  "Minister of State Security": q("Minister of State Security", "국가보위상", "国家保衛相", "国家保卫相"),
  "Personal Secretary to National Defence Commission Chairman": q("Personal Secretary to National Defence Commission Chairman", "국방위원회 위원장 개인 비서", "国防委員会委員長個人秘書", "国防委员会委员长私人秘书"),
  "Premier of North Korea": q("Premier of North Korea", "북한 내각 총리", "北朝鮮内閣総理", "朝鲜内阁总理"),
  "President of North Korea": q("President of North Korea", "북한 주석", "北朝鮮主席", "朝鲜主席"),
  "President of the Academy of National Defence Science": q("President of the Academy of National Defence Science", "국방과학원 원장", "国防科学院院長", "国防科学院院长"),
  "President of the Presidium of the Supreme People's Assembly": q("President of the Presidium of the Supreme People's Assembly", "최고인민회의 상임위원회 위원장", "最高人民会議常任委員会委員長", "最高人民会议常任委员会委员长"),
  "President of the State Affairs Commission": q("President of the State Affairs Commission", "국무위원회 위원장", "国務委員会委員長", "国务委员会委员长"),
  "Secretary of the Central Committee for Munitions Industry": q("Secretary of the Central Committee for Munitions Industry", "당중앙위원회 군수공업 담당 비서", "党中央委員会軍需工業担当書記", "党中央委员会军需工业书记"),
  "Spouse of the Supreme Leader of the Democratic People's Republic of Korea": q("Spouse of the Supreme Leader of the Democratic People's Republic of Korea", "조선민주주의인민공화국 최고지도자의 배우자", "朝鮮民主主義人民共和国最高指導者の配偶者", "朝鲜民主主义人民共和国最高领导人的配偶"),
  "Supreme Commander of the Korean People’s Army": q("Supreme Commander of the Korean People’s Army", "조선인민군 최고사령관", "朝鮮人民軍最高司令官", "朝鲜人民军最高司令官"),
  "Supreme Leader of North Korea": q("Supreme Leader of North Korea", "북한 최고지도자", "北朝鮮の最高指導者", "朝鲜最高领导人"),
  "Vice Chairman of the Central Military Commission": q("Vice Chairman of the Central Military Commission", "당중앙군사위원회 부위원장", "党中央軍事委員会副委員長", "党中央军事委员会副委员长"),
  "Vice Chairman of the National Defence Commission": q("Vice Chairman of the National Defence Commission", "국방위원회 부위원장", "国防委員会副委員長", "国防委员会副委员长"),
  "Vice Chairman of the Workers' Party of Korea": q("Vice Chairman of the Workers' Party of Korea", "조선노동당 부위원장", "朝鮮労働党副委員長", "朝鲜劳动党副委员长"),
  "Vice Premier of North Korea": q("Vice Premier of North Korea", "북한 내각 부총리", "北朝鮮内閣副総理", "朝鲜内阁副总理"),
  "Vice Premier of the Cabinet": q("Vice Premier of the Cabinet", "내각 부총리", "内閣副総理", "内阁副总理"),
  "Vice President of North Korea": q("Vice President of North Korea", "북한 부주석", "北朝鮮副主席", "朝鲜副主席"),
  "ambassador of North Korea to Kuwait": q("ambassador of North Korea to Kuwait", "주쿠웨이트 북한 대사", "駐クウェート北朝鮮大使", "朝鲜驻科威特大使"),
  "ambassador of North Korea to Russia": q("ambassador of North Korea to Russia", "주러시아 북한 대사", "駐ロシア北朝鮮大使", "朝鲜驻俄罗斯大使"),
  "ambassador of North Korea to the Czech Republic": q("ambassador of North Korea to the Czech Republic", "주체코 북한 대사", "駐チェコ北朝鮮大使", "朝鲜驻捷克大使"),
  "defence minister": q("defence minister", "국방상", "国防相", "国防相"),
  "education minister": q("education minister", "교육상", "教育相", "教育相"),
  "foreign minister": q("foreign minister", "외무상", "外相", "外务相"),
  "head teacher": q("head teacher", "교장", "校長", "校长"),
  "member of State Affairs Commission": q("member of State Affairs Commission", "국무위원회 위원", "国務委員会委員", "国务委员会委员"),
  "member of funeral committee of Hwang Sun-hui": q("member of funeral committee of Hwang Sun-hui", "황순희 장의위원회 위원", "黄順姫葬儀委員会委員", "黄顺姬治丧委员会委员"),
  "member of the Politburo of the Workers' Party of Korea": q("member of the Politburo of the Workers' Party of Korea", "조선노동당 정치국 위원", "朝鮮労働党政治局委員", "朝鲜劳动党政治局委员"),
  "member of the Presidium of the Politburo of the Workers' Party of Korea": q("member of the Presidium of the Politburo of the Workers' Party of Korea", "조선노동당 정치국 상무위원회 위원", "朝鮮労働党政治局常務委員会委員", "朝鲜劳动党政治局常务委员会委员"),
  "member of the Presidium of the Supreme People's Assembly": q("member of the Presidium of the Supreme People's Assembly", "최고인민회의 상임위원회 위원", "最高人民会議常任委員会委員", "最高人民会议常任委员会委员"),
  "member of the Supreme People's Assembly": q("member of the Supreme People's Assembly", "최고인민회의 대의원", "最高人民会議代議員", "最高人民会议代议员"),
};

export const PEOPLE_SUMMARIES: Record<string, Quad> = {
  "choe-chun-sik": q("Choe Chun Sik was the leader of the North Korean Second Academy of Natural Sciences. He received the title of Hero of the Republic in 2012 for his work on Kwangmyŏngsŏng-3.", "최춘식은 북한 제2자연과학원의 책임자였습니다. 2012년 광명성 3호 관련 작업으로 공화국영웅 칭호를 받았습니다.", "崔春植は北朝鮮の第2自然科学院の責任者でした。2012年、光明星3号の作業に対して共和国英雄の称号を受けました。", "崔春植曾是朝鲜第二自然科学院的负责人。2012年，他因光明星3号的工作获得共和国英雄称号。"),
  "choe-ryong-hae": q("Choe Ryong-hae is a North Korean politician and military officer who served as the Chairman of the Standing Committee of the Supreme People's Assembly and First Vice President of the State Affairs Commission, holding both positions from April 2019 to March 2026.", "최룡해는 북한의 정치인이자 군 장교입니다. 2019년 4월부터 2026년 3월까지 최고인민회의 상임위원회 위원장과 국무위원회 제1부위원장을 함께 맡았습니다.", "崔竜海は北朝鮮の政治家で軍人です。2019年4月から2026年3月まで、最高人民会議常任委員会委員長と国務委員会第1副委員長を兼任していました。", "崔龙海是朝鲜政治人物和军官。2019年4月至2026年3月，他同时担任最高人民会议常任委员会委员长和国务委员会第一副委员长。"),
  "choe-son-hui": q("Choe Son-hui is a North Korean politician and diplomat who has been the country's Minister of Foreign Affairs since 11 June 2022. Previously the First Vice Minister of Foreign Affairs, she is the first woman to hold the position and is one of few North Korean women holding a high-level office.", "최선희는 북한의 정치인이자 외교관으로, 2022년 6월 11일부터 외무상입니다. 그 전에는 외무성 제1부상이었고, 이 자리를 맡은 첫 여성이며, 고위직에 있는 북한 여성은 많지 않습니다.", "崔善姫は北朝鮮の政治家で外交官です。2022年6月11日から外相を務めています。それ以前は外務省第1副相で、この職に就いた最初の女性であり、北朝鮮で高位の職にある数少ない女性の一人です。", "崔善姬是朝鲜政治人物和外交官，自2022年6月11日起担任外务相。在此之前她是外务省第一副相，是担任这一职务的第一位女性，也是朝鲜少数担任高层职务的女性之一。"),
  "choe-thae-bok": q("Choe Thae-bok was a North Korean politician. He was a member of the Politburo and the Secretariat of the Workers' Party of Korea, and was chairman of the Supreme People's Assembly for nearly 21 years, from 1998 to 2019.", "최태복은 북한의 정치인이었습니다. 조선노동당 정치국 위원과 비서국 성원이었고, 1998년부터 2019년까지 거의 21년 동안 최고인민회의 의장이었습니다.", "崔泰福は北朝鮮の政治家でした。朝鮮労働党の政治局員と書記局員であり、1998年から2019年までほぼ21年間、最高人民会議の議長でした。", "崔泰福是朝鲜政治人物。他曾任朝鲜劳动党政治局委员和书记局成员，并自1998年至2019年担任最高人民会议议长近21年。"),
  "han-kwang-sang": q("Han Kwang-sang is a North Korean politician. He is a member of the Central Committee of the Workers' Party of Korea.", "한광상은 북한의 정치인입니다. 조선노동당 중앙위원회 위원입니다.", "韓光相は北朝鮮の政治家です。朝鮮労働党中央委員会の委員です。", "韩光相是朝鲜政治人物。他是朝鲜劳动党中央委员会委员。"),
  "hong-sung-mu": q("Hong Sung-mu is a North Korean nuclear weapons scientist and a Workers' Party of Korea official working with North Korea's weapons of mass destruction and space programs. He is the deputy director of the party's Machine Building Industry Department and plays a key part in the country's nuclear weapons program.", "홍승무는 북한의 핵무기 과학자로, 대량살상무기와 우주 프로그램을 담당하는 조선노동당 간부입니다. 당 기계공업부 부부장이고, 핵무기 프로그램에서 핵심적인 역할을 합니다.", "洪承武は北朝鮮の核兵器の科学者で、大量破壊兵器と宇宙計画を担当する朝鮮労働党の幹部です。党機械工業部の副部長であり、核兵器計画で中心的な役割を果たしています。", "洪承武是朝鲜核武器科学家，也是负责大规模杀伤性武器和航天项目的朝鲜劳动党官员。他是党中央机械工业部副部长，在核武器计划中起关键作用。"),
  "hwang-jang-yop": q("Hwang Jang-yop was a North Korean politician who defected to South Korea. He served as the Chairman of the Supreme People's Assembly from 1972 to 1983 and was largely responsible for crafting Juche, the state ideology of North Korea.", "황장엽은 한국으로 탈북한 북한 정치인이었습니다. 1972년부터 1983년까지 최고인민회의 의장을 지냈고, 북한의 국가 이념인 주체사상을 만드는 데 큰 역할을 했습니다.", "黄長燁は韓国へ脱北した北朝鮮の政治家でした。1972年から1983年まで最高人民会議の議長を務め、北朝鮮の国家イデオロギーである主体思想（チュチェ）の形成に大きく関わりました。", "黄长烨是脱北到韩国的朝鲜政治人物。他于1972年至1983年担任最高人民会议议长，并在制定朝鲜国家意识形态主体思想方面起了主要作用。"),
  "hyon-song-wol": q("Hyon Song-wol is a North Korean singer, band leader, and politician. She is the leader of the Moranbong Band and of the Samjiyon Orchestra.", "현송월은 북한의 가수이자 악단 단장이고 정치인입니다. 모란봉악단과 삼지연관현악단의 단장입니다.", "玄松月は北朝鮮の歌手、楽団のリーダー、そして政治家です。牡丹峰楽団と三池淵管弦楽団のリーダーです。", "玄松月是朝鲜歌手、乐团负责人和政治人物。她是牡丹峰乐团和三池渊管弦乐团的负责人。"),
  "hyon-yong-chol": q("Hyon Yong-chol was a North Korean general and Workers' Party of Korea politician. He served as Minister of Defence from 2014 to 2015.", "현영철은 북한의 대장급 군인이자 조선노동당 정치인이었습니다. 2014년부터 2015년까지 국방상을 지냈습니다.", "玄永哲は北朝鮮の将軍で、朝鮮労働党の政治家でした。2014年から2015年まで国防相を務めました。", "玄永哲是朝鲜将领和朝鲜劳动党政治人物。他于2014年至2015年担任国防相。"),
  "jang-chang-ha": q("Jang Chang-ha is a North Korean general and a politician.", "장창하는 북한의 대장급 군인이자 정치인입니다.", "張昌河は北朝鮮の将軍で、政治家です。", "张昌河是朝鲜将领和政治人物。"),
  "jang-song-thaek": q("Jang Song-thaek was a North Korean politician. He was married to Kim Kyong-hui — the only daughter of North Korean president Kim Il Sung and his first wife Kim Jong Suk, and the only sister of North Korean general secretary Kim Jong Il.", "장성택은 북한의 정치인이었습니다. 김경희와 결혼했습니다. 김경희는 북한 주석 김일성과 첫 부인 김정숙 사이의 외동딸이고, 북한 총비서 김정일의 외동 여동생입니다.", "張成沢は北朝鮮の政治家でした。金敬姫と結婚していました。金敬姫は北朝鮮主席金日成とその最初の妻金正淑の間の一人娘で、北朝鮮の総書記金正日のただ一人の妹です。", "张成泽是朝鲜政治人物。他娶了金敬姬。金敬姬是朝鲜主席金日成与第一任妻子金正淑的独生女，也是朝鲜总书记金正日唯一的妹妹。"),
  "jo-chun-ryong": q("Jo Chun-ryong is a North Korean politician. Since 2019 he is a candidate member of the Politburo of the Central Committee of the Workers' Party of Korea.", "조춘룡은 북한의 정치인입니다. 2019년부터 조선노동당 중앙위원회 정치국 후보위원입니다.", "趙春竜は北朝鮮の政治家です。2019年から朝鮮労働党中央委員会政治局の候補委員です。", "赵春龙是朝鲜政治人物。自2019年起，他是朝鲜劳动党中央委员会政治局候补委员。"),
  "jo-song-gil": q("Jo Song-gil is a former diplomat from North Korea who defected while serving as North Korea's acting ambassador to Italy.", "조성길은 북한 출신의 전직 외교관으로, 주이탈리아 임시 대사로 있던 중 탈북했습니다.", "趙成吉は北朝鮮出身の元外交官です。駐イタリア臨時代理大使として勤務中に脱北しました。", "赵成吉是朝鲜出身的前外交官，在担任驻意大利临时代办期间脱北。"),
  "jo-yong-won": q("Jo Yong-won is a North Korean politician who is deputy chief of the Workers' Party of Korea's Secretariat of General Secretary Kim Jong Un. From March until June 2026, he was also the Chairman of the Supreme People's Assembly, North Korea's unicameral parliament, and the Chairman of its Standing Committee.", "조용원은 북한의 정치인으로, 조선노동당 총비서 김정은의 비서실 부실장입니다. 2026년 3월부터 6월까지는 북한의 단원제 의회인 최고인민회의 의장과 그 상임위원회 위원장도 맡았습니다.", "趙甬元は北朝鮮の政治家で、朝鮮労働党総書記金正恩の書記室副室長です。2026年3月から6月までは、北朝鮮の一院制議会である最高人民会議の議長と、その常任委員会の委員長でもありました。", "赵甬元是朝鲜政治人物，担任朝鲜劳动党总书记金正恩秘书室的副室长。2026年3月至6月，他还担任朝鲜一院制议会最高人民会议的议长及其常任委员会委员长。"),
  "jon-hyon-chol": q("Jon Hyon-chol is a North Korean politician. He served as a Vice Premier of the Cabinet a candidate member of the Politburo of the Central Committee of the Workers' Party of Korea as well as head of the Economic Policy Office of the Central Committee.", "전현철은 북한의 정치인입니다. 내각 부총리, 조선노동당 중앙위원회 정치국 후보위원, 그리고 당중앙위원회 경제정책실장을 지냈습니다.", "全賢哲は北朝鮮の政治家です。内閣副総理、朝鮮労働党中央委員会政治局の候補委員、そして党中央委員会経済政策室長を務めました。", "全贤哲是朝鲜政治人物。他担任过内阁副总理、朝鲜劳动党中央委员会政治局候补委员，以及党中央委员会经济政策室主任。"),
  "jon-il-chun": q("Longtime Director of Office 39 and childhood classmate of Kim Jong Il, who managed the regime's illicit overseas banking network, gold exports, and hard currency procurement for decades. His son-in-law, Ryu Hyun-woo (acting ambassador to Kuwait), defected to South Korea in 2019.", "전일춘은 김정일의 소꿉친구로, 오랫동안 39호실 실장을 맡았습니다. 수십 년 동안 정권의 해외 불법 은행망, 금 수출, 외화 조달을 관리했습니다. 사위인 류현우(주쿠웨이트 임시 대사)는 2019년 한국으로 탈북했습니다.", "全日春は金正日の幼なじみで、長年39号室の室長を務めました。数十年にわたり、体制の海外での違法な銀行網、金の輸出、外貨の調達を仕切っていました。娘婿のリュ・ヒョヌ（駐クウェート臨時代理大使）は2019年に韓国へ脱北しました。", "全日春是金正日的童年同学，长期担任39号室主任。几十年来，他管理政权的海外非法银行网络、黄金出口和硬通货筹集。他的女婿류현우（驻科威特临时代办）于2019年脱北到韩国。"),
  "jon-il-ho": q("Lieutenant General and senior missile scientist at the Academy of National Defence Science, specializing in guidance systems, computer simulation, and telemetry for intercontinental ballistic missiles. One of the core triumvirate of scientists honored with Kim Jong Un at major missile test celebrations.", "전일호는 국방과학원의 미사일 과학자이자 중장으로, 대륙간탄도미사일의 유도 장치, 컴퓨터 시뮬레이션, 원격 측정을 전공했습니다. 주요 미사일 시험 축하 행사에서 김정은과 함께 기려진 핵심 과학자 세 사람 중 한 명입니다.", "チョン・イルホは国防科学院のミサイル科学者で中将です。大陸間弾道ミサイルの誘導装置、コンピュータシミュレーション、テレメトリを専門としています。主要なミサイル実験の祝賀の場で金正恩とともにたたえられた、中核となる科学者三人のうちの一人です。", "전일호是国防科学院的导弹科学家、中将，专长是洲际弹道导弹的制导系统、计算机仿真和遥测。在重大导弹试验的庆祝活动上，他是与金正恩一同受表彰的三位核心科学家之一。"),
  "jon-sung-guk": q("Vice Premier of the Cabinet appointed in June 2022, overseeing electric power generation, coal mining, and rail logistics across the national economy. He monitors the supply of coal and electricity to strategic defense plants.", "전승국은 2022년 6월에 임명된 내각 부총리로, 전국 경제의 전력 생산, 석탄 채굴, 철도 물류를 담당합니다. 전략 방위 공장에 들어가는 석탄과 전력 공급을 점검합니다.", "チョン・スングクは2022年6月に任命された内閣副総理です。全国の発電、石炭採掘、鉄道物流を担当しています。戦略的な防衛工場への石炭と電力の供給を監視しています。", "전승국于2022年6月被任命为内阁副总理，负责全国经济中的发电、煤炭开采和铁路物流。他监督向战略国防工厂供应煤炭和电力。"),
  "jong-kyong-thaek": q("Jong Kyong-thaek is a North Korean politician. He served as the Minister of State Security from 2018 to 2022, a member of the Central Military Commission of the Workers' Party of Korea, an alternate member of the Politburo of the WPK, and a member of the State Affairs Commission of North Korea.", "정경택은 북한의 정치인입니다. 2018년부터 2022년까지 국가보위상을 지냈고, 조선노동당 중앙군사위원회 위원, 당 정치국 후보위원, 국무위원회 위원이었습니다.", "鄭京沢は北朝鮮の政治家です。2018年から2022年まで国家保衛相を務め、朝鮮労働党中央軍事委員会の委員、党政治局の候補委員、国務委員会の委員でした。", "郑京泽是朝鲜政治人物。他于2018年至2022年担任国家保卫相，并曾任朝鲜劳动党中央军事委员会委员、党政治局候补委员和国务委员会委员。"),
  "ju-chang-il": q("Ju Chang-il is a North Korean politician. He serves as an alternate member of the Politburo of the Central Committee of the Workers' Party of Korea and as the Director of the Propaganda and Agitation Department of the WPK Secretariat.", "주창일은 북한의 정치인입니다. 조선노동당 중앙위원회 정치국 후보위원이고, 당 비서국 선전선동부장입니다.", "朱昌日は北朝鮮の政治家です。朝鮮労働党中央委員会政治局の候補委員であり、党書記局の宣伝扇動部長です。", "朱昌日是朝鲜政治人物。他是朝鲜劳动党中央委员会政治局候补委员，也是党书记局宣传鼓动部部长。"),
  "kang-myong-do": q("Son-in-law of former North Korean Premier Kang Song San, who defected to South Korea via China in May 1994. In a historic Seoul press conference, he provided the international community with early confirmation that North Korea had successfully developed nuclear weapons.", "강명도는 전 내각 총리 강성산의 사위입니다. 1994년 5월 중국을 거쳐 한국으로 탈북했습니다. 서울에서 연 역사적인 기자회견에서, 북한이 핵무기 개발에 성공했다는 사실을 국제사회에 일찍 확인시켜 주었습니다.", "康明道は元内閣総理姜成山の娘婿です。1994年5月、中国経由で韓国へ脱北しました。ソウルでの歴史的な記者会見で、北朝鮮が核兵器の開発に成功したことを、国際社会に早い段階で裏付けました。", "康明道是朝鲜前内阁总理姜成山的女婿。1994年5月，他经中国脱北到韩国。在首尔一场具有历史意义的记者会上，他向国际社会较早证实朝鲜已经成功研制出核武器。"),
  "kang-pan-sok": q("Kang Pan Sok was the mother of North Korean leader Kim Il Sung, the paternal grandmother of Kim Jong Il, and a great grandmother of North Korean leader Kim Jong Un.", "강반석은 북한 지도자 김일성의 어머니이고, 김정일의 친할머니이며, 김정은의 증조할머니입니다.", "康盤石は北朝鮮の指導者金日成の母であり、金正日の父方の祖母であり、金正恩の曽祖母です。", "康盤石是朝鲜领导人金日成的母亲、金正日的父系祖母，也是金正恩的曾祖母。"),
  "kang-sun-nam": q("Kang Sun-nam is a North Korean politician and general who was the minister of Defence from 2022 to 2024.", "강순남은 북한의 정치인이자 대장급 군인으로, 2022년부터 2024년까지 국방상이었습니다.", "強純男は北朝鮮の政治家で将軍です。2022年から2024年まで国防相でした。", "强纯男是朝鲜政治人物和将领，2022年至2024年担任国防相。"),
  "kim-han-sol": q("Kim Han-sol is the eldest son of Kim Jong-nam and a grandson of the former North Korean ruler Kim Jong Il. His father was the unofficial heir apparent until he fell out of favor with the regime after a failed attempt to secretly visit Tokyo Disneyland in May 2001.", "김한솔은 김정남의 장남이고, 전 북한 통치자 김정일의 손자입니다. 아버지 김정남은 대략 1994년부터 2001년까지 후계자로 여겨지다가, 2001년 5월 도쿄 디즈니랜드를 몰래 방문하려다 실패한 뒤 정권의 눈 밖에 났습니다.", "金漢率は金正男の長男で、北朝鮮の前の統治者金正日の孫です。父の金正男はおおよそ1994年から2001年まで後継者とみられていましたが、2001年5月に東京ディズニーランドをひそかに訪れようとして失敗したあと、体制の信任を失いました。", "金汉率是金正男的长子，也是朝鲜前统治者金正日的孙子。他的父亲金正男大约从1994年到2001年被视为继承人，2001年5月试图秘密前往东京迪士尼乐园失败后，失去了政权的信任。"),
  "kim-hyong-jik": q("Kim Hyong-jik was a Korean independence activist during Japanese rule. He was the father of the North Korean founder Kim Il Sung, the paternal grandfather of Kim Jong Il, and a great-grandfather of the current leader of North Korea, Kim Jong Un.", "김형직은 일제 강점기의 독립운동가였습니다. 북한을 세운 김일성의 아버지이고, 김정일의 친할아버지이며, 현 지도자 김정은의 증조할아버지입니다.", "金亨稷は日本統治期の独立運動家でした。北朝鮮を建国した金日成の父であり、金正日の父方の祖父であり、現指導者金正恩の曽祖父です。", "金亨稷是日本统治时期的独立运动人士。他是朝鲜建国者金日成的父亲、金正日的父系祖父，也是现任领导人金正恩的曾祖父。"),
  "kim-hyong-jun": q("Kim Hyong-jun is a North Korean politician and diplomat. Vice Chairman of the Workers' Party of Korea, member of the Politburo, member of the State Affairs Commission of North Korea, and former Ambassador to the Russian Federation.", "김형준은 북한의 정치인이자 외교관입니다. 조선노동당 부위원장, 정치국 위원, 국무위원회 위원이고, 주러시아 연방 대사를 지냈습니다.", "金衡俊は北朝鮮の政治家で外交官です。朝鮮労働党副委員長、政治局員、国務委員会委員であり、元駐ロシア連邦大使です。", "金衡俊是朝鲜政治人物和外交官。他是朝鲜劳动党副委员长、政治局委员、国务委员会委员，也曾担任驻俄罗斯联邦大使。"),
  "kim-hyong-sik": q("Kim Hyong-sik is a North Korean politician. He is a member of the Central Committee of the Workers' Party of Korea and a member of the 12th convocation of the Supreme People's Assembly, North Korea's unicameral parliament.", "김형식은 북한의 정치인입니다. 조선노동당 중앙위원회 위원이고, 북한의 단원제 의회인 최고인민회의 제12기 대의원입니다.", "金亨植は北朝鮮の政治家です。朝鮮労働党中央委員会の委員であり、北朝鮮の一院制議会である最高人民会議第12期の代議員です。", "金亨植是朝鲜政治人物。他是朝鲜劳动党中央委员会委员，也是朝鲜一院制议会最高人民会议第十二届代议员。"),
  "kim-il-sung": q("Kim Il Sung was a North Korean communist revolutionary, military officer, politician, and dictator who founded the Democratic People's Republic of Korea, also known as North Korea, in 1948, and led it until his death in 1994. He was succeeded by his son Kim Jong Il and posthumously declared Eternal President.", "김일성은 북한의 공산주의 혁명가이자 군 장교, 정치인, 독재자였습니다. 1948년 조선민주주의인민공화국, 곧 북한을 세웠고 1994년 죽을 때까지 통치했습니다. 아들 김정일이 뒤를 이었고, 죽은 뒤 영원한 주석으로 추대되었습니다.", "金日成は北朝鮮の共産主義革命家、軍人、政治家、独裁者でした。1948年に朝鮮民主主義人民共和国、すなわち北朝鮮を建国し、1994年に死ぬまで率いました。息子の金正日が後を継ぎ、死後に永遠の主席とされました。", "金日成是朝鲜的共产主义革命者、军官、政治人物和独裁者。他于1948年建立朝鲜民主主义人民共和国，也就是朝鲜，并统治到1994年去世。儿子金正日继位，他死后被追授为永远的主席。"),
  "kim-jae-ryong": q("Kim Jae-ryong is a North Korean politician who served as Premier of North Korea from April 2019 to August 2020. A senior official within the Workers' Party of Korea, he has served as the director of the Organization and Guidance Department since 2020 and as a deputy to the Supreme People's Assembly.", "김재룡은 북한의 정치인으로, 2019년 4월부터 2020년 8월까지 내각 총리를 지냈습니다. 조선노동당의 고위 간부로, 2020년부터 조직지도부장을 맡고 있고 최고인민회의 대의원입니다.", "金才龍は北朝鮮の政治家で、2019年4月から2020年8月まで内閣総理を務めました。朝鮮労働党の上級幹部であり、2020年から組織指導部長を務め、最高人民会議の代議員です。", "金才龙是朝鲜政治人物，2019年4月至2020年8月担任内阁总理。他是朝鲜劳动党高级官员，自2020年起担任组织指导部部长，也是最高人民会议代议员。"),
  "kim-jong-chol": q("Kim Jong Chul, sometimes spelled Kim Jong Chol, is the son of the former North Korean Supreme Leader Kim Jong Il. His younger brother is current Supreme Leader Kim Jong Un.", "김정철은 영어로는 Kim Jong Chul, 때로는 Kim Jong Chol이라고도 적습니다. 전 북한 최고지도자 김정일의 아들이고, 동생이 현 최고지도자 김정은입니다.", "金正哲は、英語では Kim Jong Chul、ときに Kim Jong Chol とも表記されます。北朝鮮の前最高指導者金正日の息子で、弟が現最高指導者の金正恩です。", "金正哲在英语中写作 Kim Jong Chul，有时也写作 Kim Jong Chol。他是朝鲜前最高领导人金正日的儿子，弟弟是现任最高领导人金正恩。"),
  "kim-jong-il": q("Kim Jong Il was a North Korean politician and dictator who was the second supreme leader of North Korea from the death of his father Kim Il Sung in 1994 until his own death in 2011. Posthumously, Kim Jong Il was declared an eternal leader of the Workers' Party of Korea.", "김정일은 북한의 정치인이자 독재자였습니다. 아버지 김일성이 1994년 죽은 뒤부터 자신이 2011년 죽을 때까지 북한의 두 번째 최고지도자였습니다. 죽은 뒤 조선노동당의 영원한 수령으로 추대되었습니다.", "金正日は北朝鮮の政治家で独裁者でした。父金日成が1994年に死んでから、自身が2011年に死ぬまで、北朝鮮の第2代最高指導者でした。死後、朝鮮労働党の永遠の領袖とされました。", "金正日是朝鲜政治人物和独裁者。他从父亲金日成1994年去世起，直到自己2011年去世，是朝鲜第二位最高领导人。死后，他被宣布为朝鲜劳动党永远的领袖。"),
  "kim-jong-nam": q("Kim Jong-nam was the eldest son of North Korean leader Kim Jong Il. From roughly 1994 to 2001, he was considered the heir apparent to his father.", "김정남은 북한 지도자 김정일의 장남이었습니다. 대략 1994년부터 2001년까지 아버지의 후계자로 여겨졌습니다.", "金正男は北朝鮮の指導者金正日の長男でした。おおよそ1994年から2001年まで、父の後継者とみられていました。", "金正男是朝鲜领导人金正日的长子。大约从1994年到2001年，他被视为父亲的继承人。"),
  "kim-jong-sik": q("Kim Jong-sik is a North Korean politician and general who is serving is deputy director of the Munitions Industry Department of the WPK Central Committee.", "김정식은 북한의 정치인이자 대장급 군인으로, 조선노동당 중앙위원회 군수공업부 부부장으로 있습니다.", "金正植は北朝鮮の政治家で将軍であり、朝鮮労働党中央委員会軍需工業部の副部長を務めています。", "金正植是朝鲜政治人物和将领，现任朝鲜劳动党中央委员会军需工业部副部长。"),
  "kim-jong-suk": q("Kim Jong-suk was a North Korean revolutionary, anti-Japanese guerrilla, Communist activist, the first wife of North Korean leader Kim Il Sung, the mother of former leader Kim Jong Il and grandmother of current leader Kim Jong Un.", "김정숙은 북한의 혁명가이자 항일 유격대원, 공산주의 활동가였습니다. 북한 지도자 김일성의 첫 부인이고, 전 지도자 김정일의 어머니이며, 현 지도자 김정은의 할머니입니다.", "金正淑は北朝鮮の革命家、抗日ゲリラ、共産主義活動家でした。指導者金日成の最初の妻であり、前指導者金正日の母であり、現指導者金正恩の祖母です。", "金正淑是朝鲜革命者、抗日游击队员和共产主义活动家。她是领导人金日成的第一任妻子、前领导人金正日的母亲、现任领导人金正恩的祖母。"),
  "kim-jong-un": q("Kim Jong Un is a North Korean politician and dictator who has been serving as the supreme leader of North Korea since 2011, following the death of his father, Kim Jong Il. He is the third ruler from the Kim family to lead the country, which was founded by his grandfather Kim Il Sung.", "김정은은 북한의 정치인이자 독재자입니다. 아버지 김정일이 죽은 뒤 2011년부터 북한의 최고지도자로 있습니다. 할아버지 김일성이 세운 이 나라를 이끄는 김씨 일가의 세 번째 통치자입니다.", "金正恩は北朝鮮の政治家で独裁者です。父金正日の死後、2011年から北朝鮮の最高指導者を務めています。祖父金日成が建国したこの国を率いる、金一族の3代目の統治者です。", "金正恩是朝鲜政治人物和独裁者。父亲金正日去世后，他自2011年起担任朝鲜最高领导人。他是金氏家族中统治这个国家的第三位，国家由祖父金日成建立。"),
  "kim-ju-ae": q("Kim Ju Ae is the daughter of North Korean leader Kim Jong Un and his wife Ri Sol Ju. The North Korean government has publicly disclosed little information about her, and details about her life, including her birth date and name, remain unconfirmed.", "김주애는 북한 지도자 김정은과 부인 리설주의 딸입니다. 북한 당국이 공개한 정보는 거의 없고, 생일과 이름을 포함한 삶의 세부 사항은 확인되지 않은 채로 남아 있습니다.", "金主愛は北朝鮮の指導者金正恩とその妻李雪主の娘です。北朝鮮当局が公にしている情報はほとんどなく、生年月日や名前を含む暮らしの細部は未確認のままです。", "金主爱是朝鲜领导人金正恩和妻子李雪主的女儿。朝鲜政府公开的信息很少，包括出生日期和姓名在内的生活细节仍未得到证实。"),
  "kim-ki-nam": q("Kim Ki-nam was a North Korean official. He served as Vice Chairman of the Workers' Party of Korea, and Director of the Propaganda and Agitation Department from 1989 until 2017, responsible for coordinating the country's press, media, fine arts, and publishing to support government policy.", "김기남은 북한의 당국자였습니다. 조선노동당 부위원장을 지냈고, 1989년부터 2017년까지 선전선동부장으로 언론, 매체, 미술, 출판을 정부 정책에 맞추어 조율했습니다.", "金己男は北朝鮮の当局者でした。朝鮮労働党副委員長を務め、1989年から2017年まで宣伝扇動部長として、報道、メディア、美術、出版を政府の方針に沿うよう調整する責任を負っていました。", "金己男是朝鲜官员。他曾任朝鲜劳动党副委员长，并于1989年至2017年担任宣传鼓动部部长，负责协调新闻、媒体、美术和出版，以配合政府政策。"),
  "kim-kye-gwan": q("Kim Kye-gwan is a North Korean diplomat. His official position was First Vice Minister of the Ministry of Foreign Affairs, to which he was promoted immediately before the Korean Workers' Party Conference of 28 September 2010.", "김계관은 북한의 외교관입니다. 공식 직책은 외무성 제1부상이었고, 2010년 9월 28일 조선노동당 대표자회 직전에 그 자리로 올랐습니다.", "金桂冠は北朝鮮の外交官です。公式の職は外務省第1副相で、2010年9月28日の朝鮮労働党代表者会の直前に昇任しました。", "金桂冠是朝鲜外交官。他的正式职务是外务省第一副相，在2010年9月28日朝鲜劳动党代表会议召开前夕升任该职。"),
  "kim-kyong-hui": q("Kim Kyong-hui is the aunt of current North Korean leader, Kim Jong Un. She is the daughter of the founding North Korean leader Kim Il Sung and the sister of the late leader Kim Jong Il.", "김경희는 현 북한 지도자 김정은의 고모입니다. 북한을 세운 김일성의 딸이고, 죽은 지도자 김정일의 여동생입니다.", "金敬姫は現在の北朝鮮の指導者金正恩のおばです。建国の指導者金日成の娘であり、死去した指導者金正日の妹です。", "金敬姬是朝鲜现任领导人金正恩的姑母。她是朝鲜建国领导人金日成的女儿，也是已故领导人金正日的妹妹。"),
  "kim-man-il": q("Kim Man-il was the second son of the North Korean founding leader Kim Il Sung and his first wife Kim Jong Suk. He was the younger brother of Kim Jong Il, the second leader of North Korea.", "김만일은 북한을 세운 김일성과 첫 부인 김정숙의 둘째 아들이었습니다. 북한의 두 번째 지도자 김정일의 남동생이었습니다.", "金万一は、北朝鮮を建国した金日成とその最初の妻金正淑の次男でした。北朝鮮の第2代指導者金正日の弟でした。", "金万一是朝鲜建国者金日成与第一任妻子金正淑的次子。他是朝鲜第二位领导人金正日的弟弟。"),
  "kim-ok": q("Kim Ok is a former North Korean government employee who served as Kim Jong Il's personal secretary from the 1980s until his death in 2011. After the death of Ko Yong Hui in August 2004, she regularly met with foreign officials as the de facto first lady of North Korea, and was rumored to be the supreme leader's fourth wife.", "김옥은 북한 정부에서 일했던 사람으로, 1980년대부터 김정일이 2011년 죽을 때까지 그의 개인 비서였습니다. 고용희가 2004년 8월에 죽은 뒤, 사실상의 영부인으로서 외국 당국자들을 정기적으로 만났고, 최고지도자의 네 번째 부인이라는 소문이 있었습니다.", "金玉は北朝鮮政府の元職員で、1980年代から金正日が2011年に死ぬまで、その個人秘書を務めました。高容姫が2004年8月に死んだあと、事実上のファーストレディとして外国の当局者と定期的に会い、最高指導者の4番目の妻だという噂がありました。", "金玉曾是朝鲜政府工作人员，从1980年代起直到金正日2011年去世，担任他的私人秘书。高英姬于2004年8月去世后，她以事实上的第一夫人身份定期会见外国官员，并传闻是最高领导人的第四任妻子。"),
  "kim-pyong-il": q("Kim Pyong Il is a retired North Korean diplomat. He is the only surviving son of former leader and president of North Korea Kim Il Sung, the younger paternal half-brother of the late leader of North Korea, Kim Jong Il and the uncle of current North Korean leader Kim Jong Un.", "김평일은 은퇴한 북한 외교관입니다. 전 지도자이자 주석인 김일성의 생존한 아들 가운데 유일한 사람이고, 죽은 지도자 김정일의 아버지가 같은 이복동생이며, 현 지도자 김정은의 삼촌입니다.", "金平一は引退した北朝鮮の外交官です。前指導者で主席だった金日成の、存命するただ一人の息子であり、死去した指導者金正日の父方の異母弟であり、現指導者金正恩のおじです。", "金平一是已退休的朝鲜外交官。他是前领导人、朝鲜主席金日成唯一仍在世的儿子，是已故领导人金正日的同父异母弟弟，也是现任领导人金正恩的叔叔。"),
  "kim-sol-song": q("Kim Sol-song is the daughter of North Korea's former leader Kim Jong Il and Kim Young-sook and a half-sister to Kim Jong Un, the current leader of North Korea. She has been active within the propaganda department, been in charge of literary affairs, and previously led the security and schedule of her father as his secretary.", "김설송은 전 북한 지도자 김정일과 김영숙의 딸이고, 현 지도자 김정은의 이복 누나입니다. 선전 부문에서 활동했고 문학 업무를 맡았으며, 전에는 아버지의 비서로 경호와 일정을 챙겼습니다.", "金雪松は北朝鮮の前指導者金正日と金英淑の娘で、現指導者金正恩の異母姉です。宣伝部門で活動し、文学関係の業務を担い、以前は父の秘書として警備と日程を取り仕切っていました。", "金雪松是朝鲜前领导人金正日和金英淑的女儿，是现任领导人金正恩的同父异母姐姐。她在宣传部门工作过，负责过文学事务，此前还作为父亲的秘书掌管他的安保和日程。"),
  "kim-son-gyong": q("Vice Minister of Foreign Affairs for International Organizations, responsible for DPRK engagements with the United Nations, WHO, and international treaty forums. He routinely issues official ministerial communiqués blasting UN Security Council meetings on North Korean weapons tests.", "김선경은 국제기구 담당 외무성 부상으로, 유엔, 세계보건기구, 국제조약 회의에서 북한의 활동을 맡습니다. 북한 무기 시험을 다루는 유엔 안전보장이사회 회의를 비난하는 외무성의 공식 담화를 정기적으로 냅니다.", "金先敬は国際機関担当の外務副相です。国連、WHO、国際条約の会合における北朝鮮の対応を担っています。北朝鮮の兵器実験を扱う国連安全保障理事会の会合を非難する、外務省の公式談話を定期的に出しています。", "金先敬是负责国际组织事务的外务副相，掌管朝鲜与联合国、世界卫生组织和国际条约场合的往来。他定期发表外务省正式谈话，抨击讨论朝鲜武器试验的联合国安理会会议。"),
  "kim-song": q("Permanent Representative of the DPRK to the United Nations in New York since September 2018, serving as North Korea's primary direct diplomatic outpost in the United States. He defends ballistic missile tests and human rights practices before the UN Security Council and General Assembly.", "김성은 2018년 9월부터 뉴욕 유엔 주재 북한 대표로, 미국 안에 있는 북한의 주요 직접 외교 창구입니다. 유엔 안전보장이사회와 총회에서 탄도미사일 시험과 인권 문제를 변호합니다.", "金星は2018年9月からニューヨークの国連代表部大使で、米国にある北朝鮮の主要な直接の外交拠点です。国連安全保障理事会と総会で、弾道ミサイル実験と人権の扱いを弁護しています。", "金星自2018年9月起担任朝鲜驻纽约联合国代表，是朝鲜在美国的主要直接外交渠道。他在联合国安理会和大会上为弹道导弹试验和人权做法辩护。"),
  "kim-song-ae": q("Kim Song-ae, born Kim Sŏngp'al, was a North Korean politician who served as the first lady of North Korea during the time that the position existed, from 1963 to 1974. She was the second wife of North Korea's founder, Kim Il Sung from their marriage in 1952 until his death in 1994.", "김성애(본명 김성팔)는 북한의 정치인으로, 영부인 자리가 있던 1963년부터 1974년까지 그 자리에 있었습니다. 1952년 결혼부터 김일성이 1994년 죽을 때까지 북한 건국자 김일성의 두 번째 부인이었습니다.", "金聖愛（本名キム・ソンパル）は北朝鮮の政治家で、ファーストレディという地位があった1963年から1974年までその地位にありました。1952年の結婚から金日成が1994年に死ぬまで、建国者金日成の2番目の妻でした。", "金圣爱（本名김성팔）是朝鲜政治人物，在第一夫人这一职位存在的1963年至1974年间担任该职。从1952年结婚到金日成1994年去世，她是朝鲜建国者金日成的第二任妻子。"),
  "kim-song-hye": q("Kim Song-hye is a North Korean politician. As the head of the Secretarial Bureau of the Committee for the Peaceful Reunification of the Fatherland, she has taken part in numerous negotiations between North and South Korea.", "김성혜는 북한의 정치인입니다. 조국평화통일위원회 서기국장으로서 남북 협상에 여러 차례 참여했습니다.", "金聖恵は北朝鮮の政治家です。祖国平和統一委員会書記局長として、南北の交渉に何度も参加してきました。", "金圣惠是朝鲜政治人物。作为祖国和平统一委员会书记局局长，她多次参加朝韩谈判。"),
  "kim-tok-hun": q("Kim Tok-hun is a North Korean politician who was formerly the premier of North Korea and a full member on the Presidium of the Politburo of the Workers' Party of Korea. He is additionally a vice president of the State Affairs Commission.", "김덕훈은 북한의 정치인으로, 전에는 내각 총리였고 조선노동당 정치국 상무위원회의 정위원이었습니다. 국무위원회 부위원장이기도 합니다.", "金徳訓は北朝鮮の政治家です。以前は内閣総理であり、朝鮮労働党政治局常務委員会の正委員でした。国務委員会の副委員長でもあります。", "金德训是朝鲜政治人物，曾任内阁总理和朝鲜劳动党政治局常务委员会正式委员。他还是国务委员会副委员长。"),
  "kim-tong-gyu": q("Kim Tong-gyu was a politician of North Korea who served as Vice President of North Korea.", "김동규는 북한의 정치인으로, 부주석을 지냈습니다.", "金東奎は北朝鮮の政治家で、副主席を務めました。", "金东奎是朝鲜政治人物，曾任副主席。"),
  "kim-won-hong": q("Kim Won-hong is a North Korean politician and military general.", "김원홍은 북한의 정치인이자 군 대장입니다.", "金元弘は北朝鮮の政治家で、軍の将軍です。", "金元弘是朝鲜政治人物和军队将领。"),
  "kim-yo-jong": q("Kim Yo Jong is a North Korean politician and diplomat, and sister of WPK General Secretary Kim Jong Un. As of February 2026 she is the director of the General Affairs Department of the Workers' Party of Korea.", "김여정은 북한의 정치인이자 외교관이고, 조선노동당 총비서 김정은의 여동생입니다. 2026년 2월 현재 조선노동당 총무부장입니다.", "金与正は北朝鮮の政治家で外交官であり、朝鮮労働党総書記金正恩の妹です。2026年2月時点で、朝鮮労働党総務部長です。", "金与正是朝鲜政治人物和外交官，是朝鲜劳动党总书记金正恩的妹妹。截至2026年2月，她是朝鲜劳动党总务部部长。"),
  "kim-yong-chol": q("Kim Yong-chol is a North Korean general and politician.", "김영철은 북한의 대장급 군인이자 정치인입니다.", "金英哲は北朝鮮の将軍で、政治家です。", "金英彻是朝鲜将领和政治人物。"),
  "kim-yong-ju": q("Kim Yong-ju was a North Korean politician and the younger brother of Kim Il Sung, who ruled North Korea from 1948 to 1994. Under his brother's rule, Kim Yong-ju held key posts including Politburo member in the Workers' Party of Korea during the 1960s and early 1970s, but he fell out of favour in 1974 following a power struggle with his nephew Kim Jong Il.", "김영주는 북한의 정치인이었고, 1948년부터 1994년까지 북한을 통치한 김일성의 남동생이었습니다. 형의 통치 아래 1960년대와 1970년대 초 조선노동당 정치국 위원 등 요직을 맡았지만, 조카 김정일과의 권력 다툼 끝에 1974년 실각했습니다.", "金英柱は北朝鮮の政治家で、1948年から1994年まで北朝鮮を支配した金日成の弟でした。兄の支配下で1960年代と1970年代初めに朝鮮労働党政治局員などの要職に就きましたが、甥の金正日との権力闘争の末、1974年に失脚しました。", "金英柱是朝鲜政治人物，是1948年至1994年统治朝鲜的金日成的弟弟。在哥哥统治期间，他于1960年代和1970年代初担任朝鲜劳动党政治局委员等要职，但在与侄子金正日的权力斗争之后，于1974年失势。"),
  "ko-yong-hui": q("Ko Yong-hui, also spelled Ko Young-hee, was the mistress of North Korean supreme leader Kim Jong Il and the mother of his successor, Kim Jong Un. Within North Korea, she is only referred to by titles, such as \"The Respected Mother who is the Most Faithful and Loyal 'Subject' to the Dear Leader Comrade Supreme Commander\", \"The Mother of Pyongyang\", and \"The Mother of Great Songun Korea\".", "고용희는 영어로는 Ko Yong-hui, Ko Young-hee로도 적습니다. 북한 최고지도자 김정일의 정부였고, 후계자 김정은의 어머니입니다. 북한 안에서는 이름으로 불리지 않고, 「경애하는 최고사령관 동지에게 가장 충실하고 충성스러운 '신하'인 존경하는 어머니」, 「평양의 어머니」, 「위대한 선군조선의 어머니」 같은 칭호로만 불립니다.", "高容姫は、英語では Ko Yong-hui、Ko Young-hee とも表記されます。北朝鮮の最高指導者金正日の愛人であり、後継者金正恩の母でした。北朝鮮の中では名前では呼ばれず、「親愛なる最高司令官同志に最も忠実で忠誠な『臣下』である尊敬される母」、「平壌の母」、「偉大な先軍朝鮮の母」といった称号だけで呼ばれます。", "高英姬在英语中也写作 Ko Yong-hui 或 Ko Young-hee。她是朝鲜最高领导人金正日的情人，也是继任者金正恩的母亲。在朝鲜国内，人们不叫她的名字，只使用称号，例如「对敬爱的最高司令官同志最忠实、最忠诚的『臣民』、受尊敬的母亲」、「平壤之母」和「伟大先军朝鲜之母」。"),
  "no-kwang-chol": q("No Kwang-chol is a North Korean soldier, a four-star general, and a member of the political bureau, who served as Minister of Defence of North Korea from 2024 to 2026. He previously held the same office from 2018 to 2019.", "노광철은 북한의 군인이자 별 네 개의 대장이고 정치국 위원으로, 2024년부터 2026년까지 국방상을 지냈습니다. 2018년부터 2019년까지도 같은 자리를 맡았습니다.", "努光鉄は北朝鮮の軍人で、四つ星の将軍であり、政治局員です。2024年から2026年まで国防相を務めました。2018年から2019年にも同じ職にありました。", "努光铁是朝鲜军人、四星上将和政治局委员，2024年至2026年担任国防相。他在2018年至2019年也曾担任同一职务。"),
  "o-su-yong": q("O Su-yong is a North Korean politician. He was a Vice Chairman of the Workers' Party of Korea and the director of the Economic Affairs Department of the WPK.", "오수용은 북한의 정치인입니다. 조선노동당 부위원장과 당 경제부장을 지냈습니다.", "呉秀容は北朝鮮の政治家です。朝鮮労働党副委員長であり、党経済部長でした。", "吴秀容是朝鲜政治人物。他曾任朝鲜劳动党副委员长和党经济部部长。"),
  "pak-jong-chon": q("Pak Jong-chon is a North Korean Marshal who is a vice chairman of the Central Military Commission of the Workers' Party of Korea.", "박정천은 북한의 원수로, 조선노동당 중앙군사위원회 부위원장입니다.", "朴正天は北朝鮮の元帥で、朝鮮労働党中央軍事委員会の副委員長です。", "朴正天是朝鲜元帅，也是朝鲜劳动党中央军事委员会副委员长。"),
  "pak-jong-gun": q("Vice Premier of the Cabinet and Chairman of the State Planning Commission, holding direct control over the formulation of North Korea's central state economic plans, grain distributions, and industrial material quotas. Elevated to full Politburo membership in late 2021, he is the key architect of central economic planning targets.", "박정근은 내각 부총리이자 국가계획위원회 위원장으로, 북한의 중앙 경제계획, 식량 배분, 산업 자재 할당을 직접 통제합니다. 2021년 말 정치국 정위원으로 올랐고, 중앙 경제계획 목표를 짜는 핵심 인물입니다.", "朴鍾根は内閣副総理であり国家計画委員会委員長です。北朝鮮の中央の経済計画、食糧の配分、工業資材の割当を直接握っています。2021年末に政治局の正委員に上がり、中央の経済計画の目標を組み立てる中心人物です。", "朴钟根是内阁副总理和国家计划委员会委员长，直接掌管朝鲜中央经济计划的制定、粮食分配和工业物资配额。2021年末升为政治局正式委员，是制定中央经济计划指标的关键人物。"),
  "pak-myong-ho": q("Vice Minister of Foreign Affairs overseeing relations with the People's Republic of China, Southeast Asian nations, and regional multilateral bodies. He leads diplomatic working delegations to Beijing to coordinate trade corridors and political consultations.", "박명호는 중국, 동남아시아 국가, 지역의 다자 기구와의 관계를 담당하는 외무성 부상입니다. 무역 통로와 정치 협의를 맞추려고 베이징에 가는 외교 실무 대표단을 이끕니다.", "パク・ミョンホは、中華人民共和国、東南アジア諸国、地域の多国間機関との関係を担当する外務副相です。貿易の経路と政治協議を調整するため、北京へ向かう外交実務代表団を率いています。", "박명호是负责与中华人民共和国、东南亚国家和本地区多边机构关系的外务副相。他率领外交工作代表团前往北京，协调贸易通道和政治磋商。"),
  "pak-nam-gi": q("Pak Nam-gi or Park Nam-ki was, until as late as January 2010, Director of the Planning and Finance Department of the ruling party of North Korea. There are doubts about his date of birth, with at least two unattributed sources reporting it as 21 February 1934 or sometime in 1928 respectively.", "박남기는 영어로는 Pak Nam-gi 또는 Park Nam-ki라고도 적습니다. 늦어도 2010년 1월까지 북한 집권당의 계획재정부장이었습니다. 생일에는 의문이 있습니다. 출처를 밝히지 않은 자료가 적어도 두 건 있는데, 하나는 1934년 2월 21일, 다른 하나는 1928년 중이라고 합니다.", "朴南基は、英語では Pak Nam-gi または Park Nam-ki と表記されます。遅くとも2010年1月まで、北朝鮮の与党の計画財政部長でした。生年月日には疑問があります。出典の示されていない資料が少なくとも二つあり、一方は1934年2月21日、もう一方は1928年のいつかとしています。", "朴南基在英语中写作 Pak Nam-gi 或 Park Nam-ki。直到2010年1月，他仍是朝鲜执政党计划财政部部长。他的出生日期存疑。至少有两份未注明出处的材料，一份说是1934年2月21日，另一份说是1928年的某个时候。"),
  "pak-thae-song": q("Pak Thae-song is a North Korean politician who has served as the premier of North Korea and vice president of the State Affairs Commission since December 2024. He previously served as the chairman of the Supreme People's Assembly from January 2021 to January 2023.", "박태성은 북한의 정치인으로, 2024년 12월부터 내각 총리와 국무위원회 부위원장입니다. 그 전에는 2021년 1월부터 2023년 1월까지 최고인민회의 의장이었습니다.", "朴泰成は北朝鮮の政治家で、2024年12月から内閣総理と国務委員会副委員長を務めています。それ以前は2021年1月から2023年1月まで最高人民会議の議長でした。", "朴泰成是朝鲜政治人物，自2024年12月起担任内阁总理和国务委员会副委员长。在此之前，他于2021年1月至2023年1月担任最高人民会议议长。"),
  "pak-to-chun": q("General Pak To-chun was a politician of North Korea.", "박도춘 대장은 북한의 정치인이었습니다.", "朴道春将軍は北朝鮮の政治家でした。", "朴道春将军是朝鲜政治人物。"),
  "pang-tu-sop": q("Pang Tu-sop is a North Korean army general and politician.", "방두섭은 북한의 군 대장이자 정치인입니다.", "方斗燮は北朝鮮の軍の将軍で、政治家です。", "方斗燮是朝鲜军队将领和政治人物。"),
  "park-jin-hyok": q("Park Jin Hyok is a North Korean programmer and hacker. He is best known for his alleged involvement in some of the costliest computer intrusions in history.", "박진혁은 북한의 프로그래머이자 해커입니다. 역사상 비용이 가장 많이 든 컴퓨터 침입 일부에 연루되었다는 의혹으로 가장 잘 알려져 있습니다.", "パク・ジンヒョクは北朝鮮のプログラマでハッカーです。史上最も被害額の大きいコンピュータ侵入のいくつかに関与したとされる点で、最も知られています。", "박진혁是朝鲜程序员和黑客。他最为人知的是据称参与了历史上损失最大的一些计算机入侵。"),
  "ri-chang-dae": q("Ri Chang-dae is a North Korean politician who is serving as Minister of State Security since June 2022, replacing Jong Kyong-thaek.", "리창대는 북한의 정치인으로, 2022년 6월부터 정경택의 뒤를 이어 국가보위상으로 있습니다.", "李昌大は北朝鮮の政治家で、2022年6月から鄭京沢の後任として国家保衛相を務めています。", "李昌大是朝鲜政治人物，自2022年6月起接替郑京泽担任国家保卫相。"),
  "ri-chang-ho": q("Ri Chang-ho is a North Korean military officer and politician who serves as the Director of the Reconnaissance General Bureau of the General Staff of the Korean People's Army and as an alternate member of the 9th convocation of the Central Committee of the Workers' Party of Korea.", "리창호는 북한의 군 장교이자 정치인으로, 조선인민군 총참모부 정찰총국장이고 조선노동당 중앙위원회 제9기 후보위원입니다.", "リ・チャンホは北朝鮮の軍人で政治家です。朝鮮人民軍総参謀部偵察総局の局長であり、朝鮮労働党中央委員会第9期の候補委員です。", "리창호是朝鲜军官和政治人物，担任朝鲜人民军总参谋部侦察总局局长，也是朝鲜劳动党中央委员会第九届候补委员。"),
  "ri-chun-hee": q("Ri Chun-hee is a North Korean news anchor for Korean Central Television. She served as the network's chief presenter for decades and is known for her highly emotional and demonstrative delivery style, which has been described as passionate, aggressive, and menacing.", "리춘희는 조선중앙텔레비전의 뉴스 앵커입니다. 수십 년 동안 방송의 책임 아나운서였고, 감정이 강하고 과장된 전달로 알려져 있습니다. 그 방식은 열정적이고 공격적이며 위압적이라고 묘사되어 왔습니다.", "リ・チュニは朝鮮中央テレビのニュースキャスターです。数十年にわたり局の主任アナウンサーを務め、感情が強く誇張された話し方で知られています。その話し方は、情熱的で攻撃的、脅威的だと評されてきました。", "李春姬是朝鲜中央电视台的新闻主播。她担任该台首席播音员数十年，以情绪强烈、表现夸张的播报方式闻名。这种风格被形容为热情、咄咄逼人和带有威胁感。"),
  "ri-hi-yong": q("Ri Hi-yong is a North Korean politician. He is a member of the Politburo of the Central Committee of the Workers' Party of Korea and Chairman of the Party Committee of North Hamgyong Province.", "리히용은 북한의 정치인입니다. 조선노동당 중앙위원회 정치국 위원이고 함경북도 당위원회 위원장입니다.", "李煕用は北朝鮮の政治家です。朝鮮労働党中央委員会政治局の委員であり、咸鏡北道党委員会の委員長です。", "李熙用是朝鲜政治人物。他是朝鲜劳动党中央委员会政治局委员，也是咸镜北道党委员会委员长。"),
  "ri-il-gyu": q("Counselor for Political Affairs at the North Korean Embassy in Havana who defected with his wife and child in November 2023, making him the highest-ranking diplomat to escape since 2016. In a July 2024 interview, he revealed high-level regime corruption and Kim Jong Un's personal rage over South Korea's diplomatic normalization with Cuba.", "리일규는 아바나 주재 북한 대사관의 정무 참사관으로, 2023년 11월 아내와 아이와 함께 탈북했습니다. 2016년 이후 탈출한 외교관 가운데 가장 높은 지위입니다. 2024년 7월 인터뷰에서 정권 고위층의 부패와, 한국이 쿠바와 수교한 데 대한 김정은의 분노를 밝혔습니다.", "リ・イルギュはハバナの北朝鮮大使館で政務参事官を務め、2023年11月に妻と子どもとともに脱北しました。2016年以降に脱出できた外交官としては最高位です。2024年7月のインタビューで、体制上層の腐敗と、韓国がキューバと国交を正常化したことへの金正恩の怒りを明らかにしました。", "李日奎是朝鲜驻哈瓦那大使馆的政务参赞，2023年11月与妻子和孩子一起脱北，是2016年以来逃脱的级别最高的外交官。在2024年7月的采访中，他透露了政权高层的腐败，以及金正恩对韩国与古巴建交的愤怒。"),
  "ri-il-hwan": q("Ri Il-hwan is a North Korean politician and a member of the Political Bureau of the Central Committee of the Workers' Party of Korea. He has been the Director of the Propaganda and Agitation Department of the party since 2020.", "리일환은 북한의 정치인이자 조선노동당 중앙위원회 정치국 위원입니다. 2020년부터 당 선전선동부장입니다.", "李日煥は北朝鮮の政治家で、朝鮮労働党中央委員会政治局の委員です。2020年から党の宣伝扇動部長です。", "李日焕是朝鲜政治人物，也是朝鲜劳动党中央委员会政治局委员。他自2020年起担任党的宣传鼓动部部长。"),
  "ri-pyong-chol": q("Ri Pyong-chol is a North Korean military official and formerly a top advisor of supreme leader Kim Jong Un, who serves as Vice Chairman of the Central Military Commission and a member of the Presidium of the Politburo of the Workers' Party of Korea. He is a relative of Kim's wife, Ri Sol-ju.", "리병철은 북한의 군 당국자로, 전에는 최고지도자 김정은의 최측근 자문역이었습니다. 당중앙군사위원회 부위원장이고 조선노동당 정치국 상무위원회 위원입니다. 김정은의 부인 리설주의 친척입니다.", "李炳鉄は北朝鮮の軍の当局者で、以前は最高指導者金正恩の最上位の助言者でした。党中央軍事委員会の副委員長であり、朝鮮労働党政治局常務委員会の委員です。金正恩の妻、李雪主の親族です。", "李炳哲是朝鲜军方官员，曾是最高领导人金正恩的高级顾问。他担任党中央军事委员会副委员长和朝鲜劳动党政治局常务委员会委员。他是金正恩的妻子李雪主的亲戚。"),
  "ri-ryong-nam": q("Ri Ryong-nam is a North Korean politician serving as the DPRK's Ambassador to China since February 2021. With a background in economic affairs, Ri was a delegate to the 12th, 13th and 14th convocations of the Supreme People's Assembly, chairman of the North Korean-Syrian Friendship Association and chairman of the North Korean Football Association.", "리룡남은 북한의 정치인으로, 2021년 2월부터 주중국 대사입니다. 경제 업무 경력이 있고, 최고인민회의 제12기, 제13기, 제14기 대의원이었으며, 북-시리아 친선협회 위원장과 북한 축구협회 위원장이었습니다.", "李龍男は北朝鮮の政治家で、2021年2月から駐中国大使を務めています。経済分野の経歴があり、最高人民会議の第12期、第13期、第14期の代議員で、朝・シリア友好協会の会長と北朝鮮サッカー協会の会長でした。", "李龙男是朝鲜政治人物，自2021年2月起担任驻中国大使。他有经济事务背景，曾是最高人民会议第十二、十三、十四届代议员，也担任过朝叙友好协会会长和朝鲜足球协会会长。"),
  "ri-sol-ju": q("Ri Sol-ju is the current first lady of North Korea as the wife of Supreme Leader Kim Jong Un.", "리설주는 최고지도자 김정은의 부인으로, 현재 북한의 영부인입니다.", "李雪主は最高指導者金正恩の妻であり、現在の北朝鮮のファーストレディです。", "李雪主是最高领导人金正恩的妻子，也是朝鲜现任第一夫人。"),
  "ri-son-gwon": q("Ri Son-gwon is a North Korean politician and diplomat, best known for having served as chairman of the Committee for the Peaceful Reunification of the Fatherland prior to its dissolution in January 2024. Between January 2020 and June 2022, he served as the Minister of Foreign Affairs.", "리선권은 북한의 정치인이자 외교관입니다. 2024년 1월 해체되기 전까지 조국평화통일위원회 위원장으로 가장 잘 알려져 있습니다. 2020년 1월부터 2022년 6월까지 외무상을 지냈습니다.", "李善権は北朝鮮の政治家で外交官です。2024年1月に解散するまで祖国平和統一委員会の委員長を務めたことで最も知られています。2020年1月から2022年6月まで外相でした。", "李善权是朝鲜政治人物和外交官。他最为人知的是在祖国和平统一委员会于2024年1月解散之前担任委员长。2020年1月至2022年6月，他担任外务相。"),
  "ri-su-yong": q("Ri Su-yong, also known as Ri Chol, is a North Korean diplomat and politician, serving as the Minister of Foreign Affairs of North Korea from April 2014 until May 2016.", "리수용은 리철로도 알려져 있습니다. 북한의 외교관이자 정치인으로, 2014년 4월부터 2016년 5월까지 외무상을 지냈습니다.", "李洙墉はリ・チョルとも呼ばれます。北朝鮮の外交官で政治家であり、2014年4月から2016年5月まで外相を務めました。", "李洙墉又名리철。他是朝鲜外交官和政治人物，2014年4月至2016年5月担任外务相。"),
  "ri-tae-sop": q("Ri Thae-sop is a North Korean politician and general. He served as Minister of Social Security and from June 2022 to December as Chief of the General Staff.", "리태섭은 북한의 정치인이자 대장급 군인입니다. 사회안전상을 지냈고, 2022년 6월부터 12월까지 총참모장이었습니다.", "李泰燮は北朝鮮の政治家で将軍です。社会安全相を務め、2022年6月から12月まで総参謀長でした。", "李泰燮是朝鲜政治人物和将领。他担任过社会安全相，并于2022年6月至12月担任总参谋长。"),
  "ri-yong-gil": q("Ri Yong-gil is a North Korean military officer who is currently a vice chairman of the Central Military Commission of the Workers' Party of Korea and the Chief of the General Staff.", "리영길은 북한의 군 장교로, 현재 조선노동당 중앙군사위원회 부위원장이자 총참모장입니다.", "李永吉は北朝鮮の軍人で、現在、朝鮮労働党中央軍事委員会の副委員長であり、総参謀長です。", "李永吉是朝鲜军官，目前是朝鲜劳动党中央军事委员会副委员长和总参谋长。"),
  "ri-yong-ho": q("Ri Yong-ho is a North Korean politician and diplomat who served as the minister of foreign affairs of North Korea from 2016 to 2020.", "리용호는 북한의 정치인이자 외교관으로, 2016년부터 2020년까지 외무상을 지냈습니다.", "李容浩は北朝鮮の政治家で外交官であり、2016年から2020年まで外相を務めました。", "李容浩是朝鲜政治人物和外交官，2016年至2020年担任外务相。"),
  "ri-yong-ho-kpa": q("Vice Marshal Ri Yong-ho was a North Korean military officer who was Chief of the General Staff of the Korean People's Army from 2009 to 2012, as well as a member of the Presidium of the Workers' Party of Korea from September 2010 to July 2012.", "차수 리영호는 북한의 군 장교였습니다. 2009년부터 2012년까지 조선인민군 총참모장이었고, 2010년 9월부터 2012년 7월까지 조선노동당 상무위원회 위원이었습니다.", "次帥の李英浩は北朝鮮の軍人でした。2009年から2012年まで朝鮮人民軍の総参謀長であり、2010年9月から2012年7月まで朝鮮労働党常務委員会の委員でした。", "次帅李英浩是朝鲜军官。他于2009年至2012年担任朝鲜人民军总参谋长，并于2010年9月至2012年7月担任朝鲜劳动党常务委员会委员。"),
  "rim-kwang-il": q("Rim Kwang-il is a North Korean general and politician who served as Chief of the General Staff Department of the Korean People's Army.", "림광일은 북한의 대장급 군인이자 정치인으로, 조선인민군 총참모부장을 지냈습니다.", "林光日は北朝鮮の将軍で政治家であり、朝鮮人民軍総参謀部長を務めました。", "林光日是朝鲜将领和政治人物，曾任朝鲜人民军总参谋长。"),
  "ryu-hyun-woo": q("Ryu Hyun-woo is a former North Korean ambassador to Kuwait. He defected to South Korea in September 2019.", "류현우는 전 주쿠웨이트 북한 대사입니다. 2019년 9월 한국으로 탈북했습니다.", "リュ・ヒョヌは元駐クウェート北朝鮮大使です。2019年9月に韓国へ脱北しました。", "류현우是朝鲜前驻科威特大使。他于2019年9月脱北到韩国。"),
  "sin-hong-chol": q("Ambassador to the Russian Federation since February 2020, playing a crucial operational role in arranging reciprocal leader summits and bilateral military pact negotiations in Moscow. He oversees diplomatic cover for arms transfers and North Korean personnel deployments in Russia.", "신홍철은 2020년 2월부터 주러시아 대사입니다. 모스크바에서 정상들의 상호 방문과 양자 군사 협정 협상을 주선하는 실무에서 핵심적인 역할을 합니다. 러시아로의 무기 이전과 북한 인력 파견을 외교적으로 가리는 일도 담당합니다.", "申紅哲は2020年2月から駐ロシア大使です。モスクワで首脳の相互訪問と二国間の軍事協定の交渉を手配する実務で、中心的な役割を果たしています。ロシアへの兵器の移転と北朝鮮人員の派遣に、外交上の覆いをかける仕事を監督しています。", "申红哲自2020年2月起担任驻俄罗斯大使，在莫斯科安排领导人互访和双边军事协定谈判的实务中起关键作用。他负责为向俄罗斯转让武器和派遣朝鲜人员提供外交掩护。"),
  "sin-ryong-man": q("Vice Premier of the Cabinet and Minister of Agriculture appointed in late December 2023, tasked with solving chronic food insecurity and enforcing grain delivery quotas from collective farms. He leads state rural construction programs and irrigation revamps.", "신룡만은 2023년 12월 말에 임명된 내각 부총리이자 농업상으로, 만성적인 식량 불안을 풀고 협동농장에 곡물 납부 할당을 강제하는 일을 맡았습니다. 국가의 농촌 건설 사업과 관개 개편을 이끕니다.", "申竜満は2023年12月末に任命された内閣副総理兼農業相です。慢性的な食料不足を解消し、協同農場からの穀物供出の割当を強制する任務を負いました。国の農村建設と灌漑の立て直しを率いています。", "申龙满于2023年12月底被任命为内阁副总理兼农业相，任务是解决长期粮食不足，并强制集体农场完成粮食上交配额。他领导国家的农村建设项目和灌溉改造。"),
  "song-hye-rim": q("Song Hye-rim was a North Korean actress, best known for being the one-time favored mistress of Kim Jong Il.", "성혜림은 북한의 배우로, 김정일이 한때는 총애한 정부로 가장 잘 알려져 있습니다.", "成蕙琳は北朝鮮の女優で、金正日が一時期最も寵愛した愛人だったことで最も知られています。", "成蕙琳是朝鲜演员，最为人知的是她曾是金正日一度最受宠的情人。"),
  "thae-yong-ho": q("Thae Yong-ho, also known by his pseudonym Tae Ku-min, is a North Korean-born South Korean politician and former diplomat who served as a member of the National Assembly for the Gangnam district of Seoul. After studying abroad in Beijing, China, for a decade, he became North Korea's deputy ambassador to the United Kingdom, prior to defecting with his family to South Korea in 2016.", "태영호(가명 태구민)는 북한 태생의 한국 정치인이자 전직 외교관으로, 서울 강남 지역구 국회의원을 지냈습니다. 중국 베이징에서 10년 동안 유학한 뒤 주영국 북한 차석대사가 되었고, 2016년 가족과 함께 한국으로 탈북했습니다.", "太永浩（変名テ・グミン）は北朝鮮生まれの韓国の政治家で、元外交官です。ソウル江南の選挙区から国会議員を務めました。中国の北京で10年間学んだあと、北朝鮮の駐英国次席大使となり、2016年に家族とともに韓国へ脱北しました。", "太永浩（化名태구민）是出生在朝鲜的韩国政治人物和前外交官，曾任首尔江南选区的国会议员。他在中国北京留学十年后成为朝鲜驻英国副大使，并于2016年与家人一起脱北到韩国。"),
  "yang-hyong-sop": q("Yang Hyong-sop was a North Korean politician who served as Chairman of the Standing Committee of the Supreme People's Assembly and Chairman of the Supreme People's Assembly from 1983 to 1998. He subsequently served as Vice President of the Presidium of the SPA from 1998 to 2019.", "양형섭은 북한의 정치인으로, 1983년부터 1998년까지 최고인민회의 상임위원회 위원장과 최고인민회의 의장을 지냈습니다. 그 뒤 1998년부터 2019년까지 최고인민회의 상임위원회 부위원장이었습니다.", "楊亨燮は北朝鮮の政治家で、1983年から1998年まで最高人民会議常任委員会の委員長と最高人民会議の議長を務めました。その後、1998年から2019年まで最高人民会議常任委員会の副委員長でした。", "杨亨燮是朝鲜政治人物，1983年至1998年担任最高人民会议常任委员会委员长和最高人民会议议长。此后，他于1998年至2019年担任最高人民会议常任委员会副委员长。"),
  "yu-jin": q("Former Director of the Munitions Industry Department (2021-2022) and defense manufacturing bureaucrat who oversaw the mass fabrication of mobile missile launcher chassis and solid-fuel rocket motor casings. Sanctioned by the US Treasury in 2022 for procuring dual-use technologies for WMD programs.", "유진은 2021년부터 2022년까지 군수공업부장을 지낸 방위산업 관료로, 이동식 미사일 발사대 차체와 고체연료 로켓 모터 케이싱의 대량 제작을 감독했습니다. 2022년 대량살상무기 프로그램용 이중용도 기술을 조달한 이유로 미국 재무부의 제재를 받았습니다.", "ユ・ジンは2021年から2022年まで軍需工業部長を務めた防衛生産の官僚です。移動式ミサイル発射台の車体と、固体燃料ロケットモーターの筐体の大量製造を監督しました。2022年、大量破壊兵器計画向けの汎用技術を調達したとして米国財務省の制裁を受けました。", "유진曾于2021年至2022年担任军需工业部部长，是国防生产官员，监督移动导弹发射车底盘和固体燃料火箭发动机壳体的大批制造。2022年，美国财政部因他为大规模杀伤性武器计划采购两用技术而对他实施制裁。"),
};

export const FAMILY_NOTES: Record<string, Quad> = {
  "Anti-Japanese nationalist activist": q("Anti-Japanese nationalist activist", "항일 민족운동가", "抗日の民族運動家", "抗日民族运动人士"),
  "Assassinated in Malaysia": q("Assassinated in Malaysia", "말레이시아에서 암살됨", "マレーシアで暗殺", "在马来西亚被暗杀"),
  "Aunt, PAD Vice Director": q("Aunt, PAD Vice Director", "고모, 선전선동부 부부장", "おば、宣伝扇動部副部長", "姑母，宣传鼓动部副部长"),
  "Brother, Supreme Leader": q("Brother, Supreme Leader", "형제, 최고지도자", "兄弟、最高指導者", "兄弟，最高领导人"),
  "Consort and dominant matriarch of the current line": q("Consort and dominant matriarch of the current line", "정부이자 현재 가계의 중심이 된 어머니", "愛人であり、現在の家系の中心となった母", "情人，也是现任一脉的核心母亲"),
  "Consort, mother of Kim Jong Chol, Kim Jong Un, and Kim Yo Jong": q("Consort, mother of Kim Jong Chol, Kim Jong Un, and Kim Yo Jong", "정부, 김정철·김정은·김여정의 어머니", "愛人、金正哲・金正恩・金与正の母", "情人，金正哲、金正恩和金与正的母亲"),
  "Daughter": q("Daughter", "딸", "娘", "女儿"),
  "Daughter and prominent public heir presumptive": q("Daughter and prominent public heir presumptive", "딸, 공개 석상에서 유력한 후계자로 보임", "娘、公の場で有力な後継者とみられる", "女儿，在公开场合被视为推定继承人"),
  "Daughter with Kim Jong Suk": q("Daughter with Kim Jong Suk", "김정숙과의 사이에서 난 딸", "金正淑との間の娘", "与金正淑所生的女儿"),
  "Daughter with Kim Yong Suk": q("Daughter with Kim Yong Suk", "김영숙과의 사이에서 난 딸", "金英淑との間の娘", "与金英淑所生的女儿"),
  "Daughter, key regime leader": q("Daughter, key regime leader", "딸, 정권의 핵심 지도자", "娘、体制の中核の指導者", "女儿，政权的核心领导人"),
  "Daughter, married Jang Song Thaek": q("Daughter, married Jang Song Thaek", "딸, 장성택과 결혼", "娘、張成沢と結婚", "女儿，嫁给张成泽"),
  "Daughter, vice director of PAD": q("Daughter, vice director of PAD", "딸, 선전선동부 부부장", "娘、宣伝扇動部副部長", "女儿，宣传鼓动部副部长"),
  "Early communist activist reverenced as Mother of Korea": q("Early communist activist reverenced as Mother of Korea", "조선의 어머니로 받들여지는 초기 공산주의 활동가", "朝鮮の母としてあがめられる初期の共産主義活動家", "被尊为朝鲜之母的早期共产主义活动家"),
  "Elder son": q("Elder son", "큰아들", "上の息子", "年长的儿子"),
  "Eldest son": q("Eldest son", "장남", "長男", "长子"),
  "Eldest son and chosen successor": q("Eldest son and chosen successor", "장남이자 지명된 후계자", "長男で、選ばれた後継者", "长子，也是指定的继承人"),
  "Eldest son, born in Soviet camp near Khabarovsk": q("Eldest son, born in Soviet camp near Khabarovsk", "장남, 하바롭스크 근처 소련 수용소에서 출생", "長男、ハバロフスク近郊のソ連の収容所で出生", "长子，出生在哈巴罗夫斯克附近的苏联营地"),
  "Eldest son, bypassed and assassinated": q("Eldest son, bypassed and assassinated", "장남, 후계에서 밀려나고 암살됨", "長男、後継から外され暗殺された", "长子，被排除出继承并被暗杀"),
  "Eldest son, founder of DPRK": q("Eldest son, founder of DPRK", "장남, 북한의 건국자", "長男、北朝鮮の建国者", "长子，朝鲜的建国者"),
  "Father": q("Father", "아버지", "父", "父亲"),
  "Father, former leader": q("Father, former leader", "아버지, 전 지도자", "父、前指導者", "父亲，前领导人"),
  "Father, regime founder": q("Father, regime founder", "아버지, 정권의 창립자", "父、体制の創始者", "父亲，政权的创立者"),
  "Father, second supreme leader": q("Father, second supreme leader", "아버지, 두 번째 최고지도자", "父、第2代最高指導者", "父亲，第二位最高领导人"),
  "Father, Supreme Leader": q("Father, Supreme Leader", "아버지, 최고지도자", "父、最高指導者", "父亲，最高领导人"),
  "First Lady, married circa 2009": q("First Lady, married circa 2009", "영부인, 2009년경 결혼", "ファーストレディ、2009年ごろ結婚", "第一夫人，约2009年结婚"),
  "First major consort, mother of Kim Jong Nam": q("First major consort, mother of Kim Jong Nam", "첫 주요 정부, 김정남의 어머니", "最初の主要な愛人、金正男の母", "第一位主要情人，金正男的母亲"),
  "First wife, mother of Kim Jong Il": q("First wife, mother of Kim Jong Il", "첫 부인, 김정일의 어머니", "最初の妻、金正日の母", "第一任妻子，金正日的母亲"),
  "Fourth consort / de facto wife following Ko Yong Hui's death": q("Fourth consort / de facto wife following Ko Yong Hui's death", "네 번째 정부이자 고용희가 죽은 뒤의 사실상 아내", "4番目の愛人で、高容姫の死後の事実上の妻", "第四位情人，高英姬去世后的事实妻子"),
  "Full brother, former Supreme Leader": q("Full brother, former Supreme Leader", "친형제, 전 최고지도자", "実の兄弟、前最高指導者", "同胞兄弟，前最高领导人"),
  "Half-brother": q("Half-brother", "이복형제", "異母兄弟", "同父异母的兄弟"),
  "Half-brother and architect of his assassination": q("Half-brother and architect of his assassination", "이복형제, 암살을 설계한 사람", "異母兄弟で、暗殺を仕組んだ人物", "同父异母的兄弟，也是暗杀的策划者"),
  "Half-brother and succession rival": q("Half-brother and succession rival", "이복형제이자 후계 경쟁자", "異母兄弟で、後継のライバル", "同父异母的兄弟，也是继承权的竞争者"),
  "Half-brother, deceased": q("Half-brother, deceased", "이복형제, 사망", "異母兄弟、故人", "同父异母的兄弟，已故"),
  "Half-brother, Supreme Leader": q("Half-brother, Supreme Leader", "이복형제, 최고지도자", "異母兄弟、最高指導者", "同父异母的兄弟，最高领导人"),
  "Half-nephew, Supreme Leader": q("Half-nephew, Supreme Leader", "이복 조카, 최고지도자", "異母の甥、最高指導者", "同父异母关系上的侄子，最高领导人"),
  "Half-sister": q("Half-sister", "이복 자매", "異母姉妹", "同父异母的姐妹"),
  "Half-uncle, Supreme Leader": q("Half-uncle, Supreme Leader", "이복 삼촌, 최고지도자", "異母のおじ、最高指導者", "同父异母的叔叔，最高领导人"),
  "Husband": q("Husband", "남편", "夫", "丈夫"),
  "Husband, executed Dec 2013": q("Husband, executed Dec 2013", "남편, 2013년 12월 처형", "夫、2013年12月に処刑", "丈夫，2013年12月被处决"),
  "Husband, married in Soviet Far East": q("Husband, married in Soviet Far East", "남편, 소련 극동에서 결혼", "夫、ソ連極東で結婚", "丈夫，在苏联远东结婚"),
  "Husband, Supreme Leader": q("Husband, Supreme Leader", "남편, 최고지도자", "夫、最高指導者", "丈夫，最高领导人"),
  "Longtime personal secretary and final consort": q("Longtime personal secretary and final consort", "오랫동안의 개인 비서이자 마지막 정부", "長年の個人秘書で、最後の愛人", "长期的私人秘书，也是最后一位情人"),
  "Mother": q("Mother", "어머니", "母", "母亲"),
  "Mother, actress who died in Moscow": q("Mother, actress who died in Moscow", "어머니, 모스크바에서 죽은 배우", "母、モスクワで死んだ女優", "母亲，在莫斯科去世的演员"),
  "Mother, consort from Japan": q("Mother, consort from Japan", "어머니, 일본 출신의 정부", "母、日本出身の愛人", "母亲，来自日本的情人"),
  "Mother, First Lady": q("Mother, First Lady", "어머니, 영부인", "母、ファーストレディ", "母亲，第一夫人"),
  "Mother, revolutionary heroine": q("Mother, revolutionary heroine", "어머니, 혁명의 여성 영웅", "母、革命の女性英雄", "母亲，革命中的女英雄"),
  "Mother, second wife": q("Mother, second wife", "어머니, 두 번째 부인", "母、2番目の妻", "母亲，第二任妻子"),
  "Nephew and succession rival": q("Nephew and succession rival", "조카이자 후계 경쟁자", "甥で、後継のライバル", "侄子，也是继承权的竞争者"),
  "Nephew-in-law and executor": q("Nephew-in-law and executor", "조카사위이자 처형 집행자", "義理の甥で、処刑の執行者", "外甥女婿，也是处决的执行者"),
  "Nephew, Supreme Leader": q("Nephew, Supreme Leader", "조카, 최고지도자", "甥、最高指導者", "侄子，最高领导人"),
  "Older brother": q("Older brother", "형", "兄", "哥哥"),
  "Older brother, non-political": q("Older brother, non-political", "형, 정치에 나서지 않음", "兄、政治には関わらない", "哥哥，不从政"),
  "Older brother, regime founder": q("Older brother, regime founder", "형, 정권의 창립자", "兄、体制の創始者", "哥哥，政权的创立者"),
  "Older half-brother and victor in succession struggle": q("Older half-brother and victor in succession struggle", "이복 형이자 후계 다툼의 승자", "異母兄で、後継争いに勝った人", "同父异母的哥哥，也是继承斗争的胜者"),
  "Older half-brother, assassinated 2017": q("Older half-brother, assassinated 2017", "이복 형, 2017년 암살", "異母兄、2017年に暗殺", "同父异母的哥哥，2017年被暗杀"),
  "Older half-sister": q("Older half-sister", "이복 누나", "異母姉", "同父异母的姐姐"),
  "Partner / consort, forced into secret relationship": q("Partner / consort, forced into secret relationship", "상대이자 정부, 비밀 관계를 강요받음", "相手であり愛人、秘密の関係を強いられた", "伴侣兼情人，被迫维持秘密关系"),
  "Paternal aunt, surviving elder": q("Paternal aunt, surviving elder", "고모, 생존한 연장자", "父方のおば、存命の年長者", "姑母，仍在世的长辈"),
  "Second official wife of Kim Il Sung": q("Second official wife of Kim Il Sung", "김일성의 두 번째 공식 부인", "金日成の2番目の正式な妻", "金日成的第二位正式妻子"),
  "Second son with Kim Jong Suk; drowned in childhood": q("Second son with Kim Jong Suk; drowned in childhood", "김정숙과의 둘째 아들, 어릴 때 익사", "金正淑との次男、幼少期に溺死", "与金正淑所生的次子，童年溺水身亡"),
  "Second son, bypassed for leadership": q("Second son, bypassed for leadership", "둘째 아들, 후계에서 제외됨", "次男、指導者の後継から外された", "次子，被排除出领导继承"),
  "Second son, drowned in 1947": q("Second son, drowned in 1947", "둘째 아들, 1947년 익사", "次男、1947年に溺死", "次子，1947年溺水身亡"),
  "Second wife, sidelined during succession": q("Second wife, sidelined during succession", "두 번째 부인, 후계 과정에서 밀려남", "2番目の妻、後継の過程で脇に退けられた", "第二任妻子，在继承过程中被排挤"),
  "Sister": q("Sister", "자매", "姉妹", "姐妹"),
  "Sister, core inner circle supporter": q("Sister, core inner circle supporter", "자매, 핵심 측근으로 지지", "姉妹、中枢で支える人物", "姐妹，核心圈内的支持者"),
  "Sister, core regime gatekeeper and adviser": q("Sister, core regime gatekeeper and adviser", "자매, 정권의 핵심 문지기이자 자문", "姉妹、体制の中核の門番であり助言者", "姐妹，政权核心的守门人和顾问"),
  "Son": q("Son", "아들", "息子", "儿子"),
  "Son with Kim Song Ae; long-serving ambassador abroad": q("Son with Kim Song Ae; long-serving ambassador abroad", "김성애와의 아들, 오랫동안 해외 대사", "金聖愛との息子、長年の在外大使", "与金圣爱所生的儿子，长期担任驻外大使"),
  "Son, in protective exile": q("Son, in protective exile", "아들, 보호를 받으며 망명 중", "息子、保護下で亡命中", "儿子，处于保护性流亡"),
  "Son, raised in seclusion": q("Son, raised in seclusion", "아들, 외부와 차단된 채 자람", "息子、人目を避けて育てられた", "儿子，在与外界隔绝中长大"),
  "Son, sent into diplomatic exile": q("Son, sent into diplomatic exile", "아들, 외교관 자리로 내보내진 사실상의 유배", "息子、外交職という形で追放", "儿子，以外交职务的形式被放逐"),
  "Third son and chosen successor": q("Third son and chosen successor", "셋째 아들이자 지명된 후계자", "三男で、選ばれた後継者", "三子，也是指定的继承人"),
  "Third son, former head of OGD": q("Third son, former head of OGD", "셋째 아들, 전 조직지도부장", "三男、元組織指導部長", "三子，前组织指导部部长"),
  "Uncle-in-law, executed Dec 2013": q("Uncle-in-law, executed Dec 2013", "고모부, 2013년 12월 처형", "義理のおじ、2013年12月に処刑", "姑父，2013年12月被处决"),
  "Wife, mother of Kim Il Sung": q("Wife, mother of Kim Il Sung", "아내, 김일성의 어머니", "妻、金日成の母", "妻子，金日成的母亲"),
  "Wife, sister of Kim Jong Il": q("Wife, sister of Kim Jong Il", "아내, 김정일의 여동생", "妻、金正日の妹", "妻子，金正日的妹妹"),
  "Younger brother, former OGD director and Vice Premier": q("Younger brother, former OGD director and Vice Premier", "남동생, 전 조직지도부장이자 부총리", "弟、元組織指導部長で副総理", "弟弟，前组织指导部部长和副总理"),
  "Younger brother, Supreme Leader": q("Younger brother, Supreme Leader", "남동생, 최고지도자", "弟、最高指導者", "弟弟，最高领导人"),
  "Younger son and Supreme Leader": q("Younger son and Supreme Leader", "작은아들이자 최고지도자", "下の息子で最高指導者", "幼子，也是最高领导人"),
};

export const CAUSES: Record<string, Quad> = {
  "myocardial infarction": q("myocardial infarction", "심근경색", "心筋梗塞", "心肌梗死"),
  "frostbite": q("frostbite", "동상", "凍傷", "冻伤"),
  "Illness": q("Illness", "병", "病気", "疾病"),
  "disease": q("disease", "질병", "疾患", "疾病"),
  "Natural causes in internal exile": q("Natural causes in internal exile", "내부 유배 중의 자연사", "国内追放中の自然死", "国内流放期间的自然死亡"),
  "breast cancer": q("breast cancer", "유방암", "乳がん", "乳腺癌"),
  "poisoning": q("poisoning", "중독", "毒殺", "中毒"),
  "Execution by firing squad following special military tribunal": q("Execution by firing squad following special military tribunal", "특별군사재판 뒤 총살", "特別軍事裁判のあとの銃殺", "特别军事法庭之后被行刑队枪决"),
  "Natural causes / extreme old age (101)": q("Natural causes / extreme old age (101)", "자연사 / 101세의 고령", "自然死／101歳の高齢", "自然死亡／极度高龄（101岁）"),
  "drowning": q("drowning", "익사", "溺死", "溺水"),
  "Natural causes / old age (96)": q("Natural causes / old age (96)", "자연사 / 96세의 노환", "自然死／96歳の老衰", "自然死亡／年老（96岁）"),
  "Natural causes / old age": q("Natural causes / old age", "자연사 / 노환", "自然死／老衰", "自然死亡／年老"),
  "gunshot wound": q("gunshot wound", "총상", "銃創", "枪伤"),
  "Execution by anti-aircraft artillery (ZPU-4) for insubordination": q("Execution by anti-aircraft artillery (ZPU-4) for insubordination", "항명으로 대공포(ZPU-4)에 의한 처형", "抗命を理由とする高射機関砲（ZPU-4）による処刑", "因违抗命令被高射机枪（ZPU-4）处决"),
  "multiple organ dysfunction syndrome": q("multiple organ dysfunction syndrome", "다발성 장기부전", "多臓器不全", "多器官功能衰竭"),
};

export const RANKS: Record<string, Quad> = {
  "Taewonsu": q("Taewonsu", "대원수", "大元帥", "大元帅"),
  "Generalissimo": q("Generalissimo", "대원수", "大元帥", "大元帅"),
  "Wonsu": q("Wonsu", "원수", "元帥", "元帅"),
  "Colonel": q("Colonel", "대좌", "大佐", "上校"),
  "General of the army": q("General of the army", "대장", "大将", "大将"),
  "Ch’asu": q("Ch’asu", "차수", "次帥", "次帅"),
  "General": q("General", "장군", "将軍", "将军"),
  "Lieutenant general": q("Lieutenant general", "중장", "中将", "中将"),
};

export const PLACES: Record<string, Quad> = {
  "Antu County, Jilin, Republic of China": q("Antu County, Jilin, Republic of China", "당시 중화민국 지린성 안투현", "当時の中華民国吉林省安図県", "当时中华民国吉林省安图县"),
  "Chagang Province": q("Chagang Province", "자강도", "慈江道", "慈江道"),
  "Changnyeong County": q("Changnyeong County", "창녕군", "昌寧郡", "昌宁郡"),
  "Chongjin": q("Chongjin", "청진", "清津", "清津"),
  "Haeju": q("Haeju", "해주", "海州", "海州"),
  "Hamhung": q("Hamhung", "함흥", "咸興", "咸兴"),
  "Hoeryong": q("Hoeryong", "회령", "会寧", "会宁"),
  "Jilin, Republic of China": q("Jilin, Republic of China", "당시 중화민국의 지린", "当時の中華民国の吉林", "当时中华民国的吉林"),
  "Kang Kon Military Academy, Sunan, Pyongyang": q("Kang Kon Military Academy, Sunan, Pyongyang", "평양 순안 강건군관학교", "平壌順安の姜健軍官学校", "平壤顺安姜健军官学校"),
  "Kangdong County": q("Kangdong County", "강동군", "江東郡", "江东郡"),
  "Kanggye, Jagang Province, North Korea": q("Kanggye, Jagang Province, North Korea", "북한 자강도 강계", "北朝鮮慈江道江界", "朝鲜慈江道江界"),
  "Kangso": q("Kangso", "강서", "江西", "江西"),
  "Kangwon Province": q("Kangwon Province", "강원도", "江原道", "江原道"),
  "Kuala Lumpur International Airport, Malaysia": q("Kuala Lumpur International Airport, Malaysia", "말레이시아 쿠알라룸푸르 국제공항", "マレーシアのクアラルンプール国際空港", "马来西亚吉隆坡国际机场"),
  "Kumya County": q("Kumya County", "금야군", "金野郡", "金野郡"),
  "Kyongsong County": q("Kyongsong County", "경성군", "鏡城郡", "镜城郡"),
  "Mangyŏngdae": q("Mangyŏngdae", "만경대", "万景台", "万景台"),
  "Mangyongdae District": q("Mangyongdae District", "만경대구역", "万景台区域", "万景台区域"),
  "Ministry of State Security headquarters, Pyongyang": q("Ministry of State Security headquarters, Pyongyang", "평양 국가보위성 본부", "平壌の国家保衛省本部", "平壤国家保卫省总部"),
  "Moscow, Russian Federation": q("Moscow, Russian Federation", "러시아 연방 모스크바", "ロシア連邦モスクワ", "俄罗斯联邦莫斯科"),
  "Mount Myohyang, North Korea": q("Mount Myohyang, North Korea", "북한 묘향산", "北朝鮮の妙香山", "朝鲜妙香山"),
  "Nampo": q("Nampo", "남포", "南浦", "南浦"),
  "North Hamgyong Province": q("North Hamgyong Province", "함경북도", "咸鏡北道", "咸镜北道"),
  "North Korea": q("North Korea", "북한", "北朝鮮", "朝鲜"),
  "North Pyongan Province": q("North Pyongan Province", "평안북도", "平安北道", "平安北道"),
  "Osaka": q("Osaka", "오사카", "大阪", "大阪"),
  "Paris, France": q("Paris, France", "프랑스 파리", "フランスのパリ", "法国巴黎"),
  "Pyongyang": q("Pyongyang", "평양", "平壌", "平壤"),
  "Pyongyang, North Korea": q("Pyongyang, North Korea", "북한 평양", "北朝鮮の平壌", "朝鲜平壤"),
  "Pyongyang, North Korea (on board special armored train)": q("Pyongyang, North Korea (on board special armored train)", "북한 평양 (특별 장갑열차 안)", "北朝鮮の平壌（特別装甲列車の車内）", "朝鲜平壤（专列装甲列车上）"),
  "Rangrim County, Jagang, Korea": q("Rangrim County, Jagang, Korea", "자강도 랑림군", "慈江道狼林郡", "慈江道狼林郡"),
  "Ryanggang Province": q("Ryanggang Province", "양강도", "両江道", "两江道"),
  "Seoul, South Korea": q("Seoul, South Korea", "한국 서울", "韓国ソウル", "韩国首尔"),
  "Sinchon County": q("Sinchon County", "신천군", "信川郡", "信川郡"),
  "South Hamgyong Province": q("South Hamgyong Province", "함경남도", "咸鏡南道", "咸镜南道"),
  "South Pyongan Province": q("South Pyongan Province", "평안남도", "平安南道", "平安南道"),
  "South Pyongan, North Korea": q("South Pyongan, North Korea", "북한 평안남도", "北朝鮮平安南道", "朝鲜平安南道"),
  "Sunan District, Pyongyang, North Korea": q("Sunan District, Pyongyang, North Korea", "북한 평양 순안구역", "北朝鮮平壌の順安区域", "朝鲜平壤顺安区域"),
  "Sungho County": q("Sungho County", "승호군", "勝湖郡", "胜湖郡"),
  "Tongchon County": q("Tongchon County", "통천군", "通川郡", "通川郡"),
  "Vyatskoye": q("Vyatskoye", "뱌츠코예", "ヴャツコエ", "维亚茨科耶"),
  "Wonsan": q("Wonsan", "원산", "元山", "元山"),
};

export const CLAIMS: Record<string, Quad> = {
  "Believed to have suffered a stroke in 2008, after which he disappeared from public view for months. Also believed to have had diabetes and heart disease.": q("Believed to have suffered a stroke in 2008, after which he disappeared from public view for months. Also believed to have had diabetes and heart disease.", "2008년 뇌졸중을 겪은 것으로 보이며, 그 뒤 몇 달 동안 공개 석상에서 사라졌습니다. 당뇨와 심장병도 있었던 것으로 보입니다.", "2008年に脳卒中を起こしたとみられ、その後数カ月、公の場から姿を消しました。糖尿病と心臓病もあったとみられています。", "据信他在2008年中风，此后数月没有公开露面。据信他还患有糖尿病和心脏病。"),
  "State media said he died on 17 December 2011 of an acute myocardial infarction (heart attack) on a train trip.": q("State media said he died on 17 December 2011 of an acute myocardial infarction (heart attack) on a train trip.", "관영 매체는 2011년 12월 17일 열차 이동 중 급성 심근경색(심장마비)으로 죽었다고 보도했습니다.", "国営メディアは、2011年12月17日、列車での移動中に急性心筋梗塞（心臓発作）で死んだと伝えました。", "官方媒体称，他于2011年12月17日在乘火车途中因急性心肌梗死（心脏病发作）去世。"),
  "South Korea's NIS told lawmakers he is 'extremely obese', weighing over 140 kg and at high risk of cardiovascular disease, though he shows no difficulty with physical activity.": q("South Korea's NIS told lawmakers he is 'extremely obese', weighing over 140 kg and at high risk of cardiovascular disease, though he shows no difficulty with physical activity.", "한국 국가정보원은 국회의원들에게, 몸무게가 140kg이 넘고 심혈관 질환 위험이 높지만 신체 활동에는 어려움이 없어 보인다고 하며 '극도로 비만하다'고 전했습니다.", "韓国国家情報院は議員に対し、体重は140kgを超え心血管疾患のリスクが高い一方、身体を動かすことには困難が見られないとして、「極度の肥満」だと伝えました。", "韩国国家情报院告诉议员，他“极度肥胖”，体重超过140公斤，心血管疾病风险高，但身体活动看不出困难。"),
  "NIS: about 140 kg, with signs of high blood pressure and diabetes since his early 30s; North Korean officials were looking abroad for new medicines to treat him.": q("NIS: about 140 kg, with signs of high blood pressure and diabetes since his early 30s; North Korean officials were looking abroad for new medicines to treat him.", "국가정보원: 약 140kg이고, 30대 초부터 고혈압과 당뇨 징후가 있으며, 북한 당국자들이 치료용 새 약을 해외에서 찾고 있었습니다.", "国家情報院: 約140kgで、30代前半から高血圧と糖尿病の兆候があり、北朝鮮の当局者は治療のための新しい薬を海外に求めていました。", "国家情报院：约140公斤，30岁出头起就有高血压和糖尿病迹象；朝鲜官员正在海外寻找治疗他的新药。"),
  "NIS: estimated at about 140 kg with significant sleep disorders.": q("NIS: estimated at about 140 kg with significant sleep disorders.", "국가정보원: 약 140kg으로 추정되며 수면 장애가 뚜렷합니다.", "国家情報院: 約140kgと推定され、明らかな睡眠障害があります。", "国家情报院：估计约140公斤，并有明显的睡眠障碍。"),
  "NIS: lost about 20 kg in 2021 but showed no signs of serious illness.": q("NIS: lost about 20 kg in 2021 but showed no signs of serious illness.", "국가정보원: 2021년에 약 20kg이 줄었지만 중병의 징후는 보이지 않았습니다.", "国家情報院: 2021年に約20kg減りましたが、重い病気の兆候は見られませんでした。", "国家情报院：2021年体重下降约20公斤，但没有重病迹象。"),
  "Conducted North Korea's first underground nuclear test on October 9, 2006 at Punggye-ri.": q("Conducted North Korea's first underground nuclear test on October 9, 2006 at Punggye-ri.", "2006년 10월 9일 풍계리에서 북한의 첫 지하 핵실험을 실시했습니다.", "2006年10月9日、豊渓里で北朝鮮初の地下核実験を実施しました。", "2006年10月9日在丰溪里进行了朝鲜第一次地下核试验。"),
  "Ordered the demolition of the Inter-Korean Liaison Office in Kaesong on June 16, 2020 after issuing warnings in state media.": q("Ordered the demolition of the Inter-Korean Liaison Office in Kaesong on June 16, 2020 after issuing warnings in state media.", "관영 매체로 경고한 뒤 2020년 6월 16일 개성 남북공동연락사무소 폭파를 지시했습니다.", "国営メディアで警告したあと、2020年6月16日、開城の南北共同連絡事務所の爆破を命じました。", "在官方媒体发出警告后，于2020年6月16日下令炸毁开城的韩朝联络办公室。"),
  "Released a video proof of life in March 2017 following his evacuation from Macau by Free Joseon.": q("Released a video proof of life in March 2017 following his evacuation from Macau by Free Joseon.", "자유조선이 마카오에서 빼낸 뒤 2017년 3월 생존을 증명하는 영상을 공개했습니다.", "自由朝鮮がマカオから脱出させたあと、2017年3月に生存を示す映像を公開しました。", "自由朝鲜组织把他从澳门转移出去之后，2017年3月他发布了证明自己还活着的视频。"),
  "Sanctioned by the US Department of the Treasury in December 2018 for severe human rights violations and state censorship.": q("Sanctioned by the US Department of the Treasury in December 2018 for severe human rights violations and state censorship.", "2018년 12월 심각한 인권 침해와 국가 검열을 이유로 미국 재무부의 제재를 받았습니다.", "2018年12月、深刻な人権侵害と国家による検閲を理由に米国財務省の制裁を受けました。", "2018年12月因严重侵犯人权和国家审查被美国财政部制裁。"),
  "Sanctioned by the US Treasury in December 2018 for supervising arbitrary detention, torture, and extrajudicial killings as head of the Ministry of State Security.": q("Sanctioned by the US Treasury in December 2018 for supervising arbitrary detention, torture, and extrajudicial killings as head of the Ministry of State Security.", "2018년 12월 국가보위상으로서 자의적 구금, 고문, 초법적 살해를 감독한 이유로 미국 재무부의 제재를 받았습니다.", "2018年12月、国家保衛相として恣意的拘禁、拷問、超法規的殺害を監督したとして米国財務省の制裁を受けました。", "2018年12月因在担任国家保卫相期间监督任意拘禁、酷刑和法外杀戮，被美国财政部制裁。"),
  "Operated out of Dalian, China under the commercial cover of front company Chosun Expo Joint Venture while staging bank cyberheists.": q("Operated out of Dalian, China under the commercial cover of front company Chosun Expo Joint Venture while staging bank cyberheists.", "위장 회사 Chosun Expo Joint Venture의 상업적 엄호 아래 중국 다롄에서 활동하며 은행을 겨냥한 사이버 절도를 벌였습니다.", "フロント企業 Chosun Expo Joint Venture の商業上の覆いのもと、中国の大連を拠点に、銀行を狙ったサイバー強盗を仕掛けていました。", "以掩护公司 Chosun Expo Joint Venture 的商业身份为掩护，在中国大连活动，并实施针对银行的网络盗窃。"),
  "Negotiated the September 19, 2005 Joint Statement at the Six-Party Talks, in which North Korea pledged in principle to abandon its nuclear weapons.": q("Negotiated the September 19, 2005 Joint Statement at the Six-Party Talks, in which North Korea pledged in principle to abandon its nuclear weapons.", "6자회담의 2005년 9월 19일 공동성명을 협상했습니다. 북한은 그 성명에서 원칙적으로 핵무기를 포기하겠다고 약속했습니다.", "六者会合の2005年9月19日共同声明を交渉しました。北朝鮮はその声明で、原則として核兵器を放棄すると約束しました。", "他参与谈判了六方会谈2005年9月19日共同声明。朝鲜在声明中原则上承诺放弃核武器。"),
  "Briefed by the South Korean National Intelligence Service as having been executed by anti-aircraft gunfire on April 30, 2015 for dozing off at an event and talking back to Kim Jong Un.": q("Briefed by the South Korean National Intelligence Service as having been executed by anti-aircraft gunfire on April 30, 2015 for dozing off at an event and talking back to Kim Jong Un.", "한국 국가정보원은 2015년 4월 30일 행사 중에 졸고 김정은에게 말대꾸를 했다는 이유로 대공포에 의해 처형되었다고 브리핑했습니다.", "韓国国家情報院は、2015年4月30日、行事の最中に居眠りをし金正恩に口答えしたことを理由に高射砲で処刑されたと説明しました。", "韩国国家情报院通报称，他于2015年4月30日因在活动中打瞌睡并顶撞金正恩，被高射炮处决。"),
  "Appointed Secretary-General of the Peaceful Unification Advisory Council by South Korean President Yoon Suk Yeol in July 2024.": q("Appointed Secretary-General of the Peaceful Unification Advisory Council by South Korean President Yoon Suk Yeol in July 2024.", "2024년 7월 한국 대통령 윤석열에 의해 민주평화통일자문회의 사무총장으로 임명되었습니다.", "2024年7月、韓国大統領の尹錫悦により民主平和統一諮問会議の事務総長に任命されました。", "2024年7月被韩国总统尹锡悦任命为民主和平统一咨询会议秘书长。"),
};

function pick(table: Record<string, Quad>, key: string, lang: Lang): string {
  return table[key]?.[lang] ?? key;
}

export function roleTitle(title: string, lang: Lang): string {
  return pick(ROLE_TITLES, title, lang);
}

export function summaryOf(id: string, lang: Lang, fallback: string): string {
  return PEOPLE_SUMMARIES[id]?.[lang] ?? fallback;
}

export function statusLabel(value: string, lang: Lang): string {
  return PEOPLE_TEXT[lang].status[value] ?? value;
}

export function tagLabel(tag: string, lang: Lang): string {
  return PEOPLE_TEXT[lang].tags[tag] ?? tag;
}

export function familyNote(note: string, lang: Lang): string {
  return pick(FAMILY_NOTES, note, lang);
}

export function causeText(cause: string, lang: Lang): string {
  return pick(CAUSES, cause, lang);
}

export function rankText(rank: string, lang: Lang): string {
  return pick(RANKS, rank, lang);
}

export function placeName(place: string, lang: Lang): string {
  return pick(PLACES, place, lang);
}

export function claimText(claim: string, lang: Lang): string {
  return pick(CLAIMS, claim, lang);
}
