/**
 * Text for /kim-family-tree in every language the site publishes.
 *
 * English "now" lines stay in kimFamilyNow.ts (they are the cited source text). This file overlays Korean, Japanese
 * and Chinese for the same person ids. Card names stay `name_en`. Source names stay the English originals.
 *
 * Relation strings are the English labels `buildFamilyTree()` already returns. FamilyTree.tsx maps them here.
 * The apostrophe in "Father's partner" is U+2019, the same character familyTree.ts emits.
 */
import type { Lang } from '@/site/seo';
import { KIM_FAMILY_NOW } from './kimFamilyNow';

export const KIM_FAMILY_PATHS = {
  en: '/kim-family-tree',
  ko: '/ko/kim-family-tree',
  ja: '/ja/kim-family-tree',
  zh: '/zh/kim-family-tree',
} as const;

/** English pages live at the root. Korean, Japanese and Chinese live under /ko, /ja and /zh. Home is `/`. */
export function withLang(lang: Lang, path: string): string {
  if (lang === 'en') return path;
  if (path === '/') return `/${lang}`;
  return `/${lang}${path}`;
}

const FATHERS_PARTNER = 'Father\u2019s partner';

type RelKey =
  | 'Father'
  | 'Mother'
  | 'Husband'
  | 'Wife'
  | 'Son'
  | 'Daughter'
  | 'Brother'
  | 'Sister'
  | 'Half-brother'
  | 'Half-sister'
  | 'Uncle'
  | 'Aunt'
  | 'Nephew'
  | 'Niece'
  | 'In-law'
  | 'Supreme Leader'
  | typeof FATHERS_PARTNER
  | 'Relative';

function relations(text: Record<RelKey, string>): Record<string, string> {
  return text;
}

export interface KimFamilyText {
  metaTitle: string;
  metaDescription: string;
  jsonLdName: string;
  eyebrow: string;
  h1: string;
  lede: string;
  ageLabel: string;
  ageNote: string;
  /** The figure on the weight tile. Same token in every language. */
  weightValue: string;
  weightLabel: string;
  weightNote: string;
  successorLabel: string;
  successorNote: (years: number | null) => string;
  livingLabel: string;
  livingNote: (count: number) => string;
  rows: [string, string, string];
  relations: Record<string, string>;
  yearsOld: (years: number) => string;
  ageUnknown: string;
  sanctioned: string;
  noteAges: string;
  noteDead: string;
  noteMissing: string;
  noteAnd: string;
  noteTail: string;
  sources: string;
}

export const KIM_FAMILY_TEXT: Record<Lang, KimFamilyText> = {
  en: {
    metaTitle: 'Kim Family Tree 2026: Who Is Who Around Kim Jong Un Now',
    metaDescription:
      'Kim Jong Un\u2019s family today: his daughter and named successor Kim Ju Ae, sister Kim Yo Jong, wife Ri Sol Ju, siblings, aunt and uncle. Ages, current roles and status, each with a source.',
    jsonLdName: 'Kim family of North Korea',
    eyebrow: 'People',
    h1: 'The Kim family now',
    lede: 'Who is who around Kim Jong Un today: how old they are, what they do, and who is next in line. Hover a person to see their closest relatives.',
    ageLabel: 'Kim Jong Un\u2019s age',
    ageNote: 'Supreme Leader since 2011',
    weightValue: '140+ kg',
    weightLabel: 'his weight, per South Korean intelligence',
    weightNote: 'High heart disease risk (NIS, Sept 2026)',
    successorLabel: 'named successor',
    successorNote: (years) => `About ${years} years old (NIS, Feb 2026)`,
    livingLabel: 'living family members shown',
    livingNote: (count) => `${count} under sanctions`,
    rows: ['His father\u2019s generation', 'Kim Jong Un and his siblings', 'The next generation'],
    relations: relations({
      Father: 'Father',
      Mother: 'Mother',
      Husband: 'Husband',
      Wife: 'Wife',
      Son: 'Son',
      Daughter: 'Daughter',
      Brother: 'Brother',
      Sister: 'Sister',
      'Half-brother': 'Half-brother',
      'Half-sister': 'Half-sister',
      Uncle: 'Uncle',
      Aunt: 'Aunt',
      Nephew: 'Nephew',
      Niece: 'Niece',
      'In-law': 'In-law',
      'Supreme Leader': 'Supreme Leader',
      'Father\u2019s partner': 'Father\u2019s partner',
      Relative: 'Relative',
    }),
    yearsOld: (years) => `${years} years old`,
    ageUnknown: 'Age unknown',
    sanctioned: 'Sanctioned',
    noteAges: 'Ages are worked out from reported birth dates, many of which North Korea never confirmed.',
    noteDead: 'People who died are only shown where they link living relatives.',
    noteMissing: 'Missing someone? The data lives in',
    noteAnd: ' and ',
    noteTail: '; open an issue or a pull request.',
    sources: 'Sources',
  },
  ko: {
    metaTitle: '2026 김씨 가계도: 지금 Kim Jong Un 주변, 누가 누구인가',
    metaDescription:
      '오늘의 Kim Jong Un 가족입니다. 딸이자 지명된 후계자 Kim Ju Ae, 여동생 Kim Yo Jong, 아내 Ri Sol Ju, 형제자매, 고모와 삼촌. 나이, 현재 역할, 상태를 각각 출처와 함께 적습니다.',
    jsonLdName: '북한의 김씨 일가',
    eyebrow: '인물',
    h1: '지금의 김씨 일가',
    lede: '오늘 Kim Jong Un 주변에 누가 있는지, 나이와 하는 일, 누가 뒤를 잇는지를 보여 줍니다. 사람에 마우스를 올리면 가장 가까운 친척이 보입니다.',
    ageLabel: 'Kim Jong Un의 나이',
    ageNote: '2011년부터 최고지도자',
    weightValue: '140+ kg',
    weightLabel: '체중, 한국 정보기관 기준',
    weightNote: '심장 질환 위험이 높음 (NIS, 2026년 9월)',
    successorLabel: '지명된 후계자',
    successorNote: (years) => `약 ${years}세 (NIS, 2026년 2월)`,
    livingLabel: '표시된 생존 가족',
    livingNote: (count) => `제재 대상 ${count}명`,
    rows: ['아버지 세대', 'Kim Jong Un과 그의 형제자매', '다음 세대'],
    relations: relations({
      Father: '아버지',
      Mother: '어머니',
      Husband: '남편',
      Wife: '아내',
      Son: '아들',
      Daughter: '딸',
      Brother: '형제',
      Sister: '자매',
      'Half-brother': '이복형제',
      'Half-sister': '이복자매',
      Uncle: '삼촌',
      Aunt: '고모',
      Nephew: '조카',
      Niece: '조카딸',
      'In-law': '인척',
      'Supreme Leader': '최고지도자',
      'Father\u2019s partner': '아버지의 동반자',
      Relative: '친척',
    }),
    yearsOld: (years) => `${years}세`,
    ageUnknown: '나이 미상',
    sanctioned: '제재 대상',
    noteAges: '나이는 보도된 출생 날짜로 계산하며, 그중 상당수는 북한이 확인한 적이 없습니다.',
    noteDead: '사망한 사람은 살아 있는 친척을 잇는 경우에만 표시합니다.',
    noteMissing: '빠진 사람이 있습니까? 데이터는',
    noteAnd: '과 ',
    noteTail: '에 있습니다. 이슈나 pull request를 열어 주세요.',
    sources: '출처',
  },
  ja: {
    metaTitle: '2026年の金一族：今のKim Jong Unの周辺、誰が誰か',
    metaDescription:
      '今日のKim Jong Unの家族です。娘で指名された後継者のKim Ju Ae、妹のKim Yo Jong、妻のRi Sol Ju、兄弟姉妹、叔母と叔父。年齢、現在の役割と状態を、それぞれ出典つきで示します。',
    jsonLdName: '北朝鮮の金一族',
    eyebrow: '人物',
    h1: '今の金一族',
    lede: '今日のKim Jong Unの周辺について、誰がいるか、何歳か、何をしているか、次は誰かを示します。人にカーソルを合わせると、最も近い親族が表示されます。',
    ageLabel: 'Kim Jong Unの年齢',
    ageNote: '2011年から最高指導者',
    weightValue: '140+ kg',
    weightLabel: '体重、韓国の情報機関による',
    weightNote: '心臓病のリスクが高い（NIS、2026年9月）',
    successorLabel: '指名された後継者',
    successorNote: (years) => `約${years}歳（NIS、2026年2月）`,
    livingLabel: '表示している存命の家族',
    livingNote: (count) => `制裁対象 ${count}人`,
    rows: ['父の世代', 'Kim Jong Unと兄弟姉妹', '次の世代'],
    relations: relations({
      Father: '父',
      Mother: '母',
      Husband: '夫',
      Wife: '妻',
      Son: '息子',
      Daughter: '娘',
      Brother: '兄弟',
      Sister: '姉妹',
      'Half-brother': '異母兄弟',
      'Half-sister': '異母姉妹',
      Uncle: '叔父',
      Aunt: '叔母',
      Nephew: '甥',
      Niece: '姪',
      'In-law': '姻戚',
      'Supreme Leader': '最高指導者',
      'Father\u2019s partner': '父のパートナー',
      Relative: '親族',
    }),
    yearsOld: (years) => `${years}歳`,
    ageUnknown: '年齢不詳',
    sanctioned: '制裁対象',
    noteAges: '年齢は報じられた生年月日から計算しています。その多くは北朝鮮が確認していません。',
    noteDead: '亡くなった人は、存命の親族をつなぐ場合だけ表示します。',
    noteMissing: '誰か足りませんか。データは',
    noteAnd: 'と',
    noteTail: 'にあります。issueかpull requestを開いてください。',
    sources: '出典',
  },
  zh: {
    metaTitle: '2026年金氏家族：如今Kim Jong Un身边，谁是谁',
    metaDescription:
      '今天的Kim Jong Un家族：女儿、被指定的接班人Kim Ju Ae，妹妹Kim Yo Jong，妻子Ri Sol Ju，兄弟姐妹，姑姑和叔叔。年龄、当前职务和状况，每一项都有来源。',
    jsonLdName: '朝鲜金氏家族',
    eyebrow: '人物',
    h1: '如今的金氏家族',
    lede: '说明今天Kim Jong Un身边是谁、多大年纪、在做什么、下一位是谁。把鼠标悬停在一个人身上，可以看到关系最近的亲属。',
    ageLabel: 'Kim Jong Un的年龄',
    ageNote: '2011年起担任最高领导人',
    weightValue: '140+ kg',
    weightLabel: '体重，据韩国情报机构',
    weightNote: '心脏病风险高（NIS，2026年9月）',
    successorLabel: '被指定的接班人',
    successorNote: (years) => `约${years}岁（NIS，2026年2月）`,
    livingLabel: '图中在世的家人',
    livingNote: (count) => `${count}人受制裁`,
    rows: ['父亲那一代', 'Kim Jong Un与兄弟姐妹', '下一代'],
    relations: relations({
      Father: '父亲',
      Mother: '母亲',
      Husband: '丈夫',
      Wife: '妻子',
      Son: '儿子',
      Daughter: '女儿',
      Brother: '兄弟',
      Sister: '姐妹',
      'Half-brother': '同父异母兄弟',
      'Half-sister': '同父异母姐妹',
      Uncle: '叔叔',
      Aunt: '姑姑',
      Nephew: '侄子',
      Niece: '侄女',
      'In-law': '姻亲',
      'Supreme Leader': '最高领导人',
      'Father\u2019s partner': '父亲的伴侣',
      Relative: '亲属',
    }),
    yearsOld: (years) => `${years}岁`,
    ageUnknown: '年龄不详',
    sanctioned: '受制裁',
    noteAges: '年龄按报道的出生日期推算，其中许多日期朝鲜从未确认。',
    noteDead: '去世的人只在连接在世亲属时才显示。',
    noteMissing: '少了谁？数据在',
    noteAnd: '和',
    noteTail: '。请开一个 issue 或 pull request。',
    sources: '来源',
  },
};

/** Korean, Japanese and Chinese overlays for KIM_FAMILY_NOW. English is read from that file, not copied here. */
const NOW_I18N: Record<string, Record<Exclude<Lang, 'en'>, string>> = {
  'kim-jong-un': {
    ko: '2011년부터 최고지도자입니다. NIS, 2026년 9월: 140kg 초과, 심장 위험이 높습니다.',
    ja: '2011年から最高指導者です。NIS、2026年9月：140kg超、心臓のリスクが高いとしています。',
    zh: '2011年起担任最高领导人。NIS，2026年9月：超过140公斤，心脏风险高。',
  },
  'kim-ju-ae': {
    ko: '지명된 후계자입니다. 한국의 NIS가 2026년 2월에 그렇게 밝혔습니다.',
    ja: '指名された後継者です。韓国のNISが2026年2月に明らかにしました。',
    zh: '被指定为接班人。韩国的NIS于2026年2月如此表示。',
  },
  'kim-yo-jong': {
    ko: '2026년 2월부터 당 총무부를 맡고 있습니다. 정치국 후보위원입니다.',
    ja: '2026年2月から党の総務部を率いています。政治局候補委員です。',
    zh: '2026年2月起负责党的总务部。政治局候补委员。',
  },
  'ri-sol-ju': {
    ko: '영부인입니다. Kim Jong Un과 국가 행사에 함께 나옵니다.',
    ja: 'ファーストレディです。Kim Jong Unと国家行事に同席します。',
    zh: '第一夫人。与Kim Jong Un一同出席国家活动。',
  },
  'kim-jong-chol': {
    ko: '정치적 역할은 없습니다. 공개 석상에 거의 나타나지 않습니다.',
    ja: '政治的な役割はありません。公の場にはほとんど姿を見せません。',
    zh: '没有政治职务。很少公开露面。',
  },
  'kim-sol-song': {
    ko: '당 선전 분야에서 막후 일을 합니다.',
    ja: '党の宣伝で舞台裏の仕事をしています。',
    zh: '从事党的宣传方面的幕后工作。',
  },
  'kim-han-sol': {
    ko: '2017년 아버지가 살해된 뒤 해외에서 숨어 지냅니다.',
    ja: '2017年に父が殺害されてから、国外に身を隠しています。',
    zh: '2017年父亲被杀害后，一直在国外藏匿。',
  },
  'kim-kyong-hui': {
    ko: '2020년부터 다시 공개 석상에 나옵니다. 남편은 2013년에 처형되었습니다.',
    ja: '2020年から再び公の場に出ています。夫は2013年に処刑されました。',
    zh: '2020年起重新公开露面。丈夫于2013年被处决。',
  },
  'kim-pyong-il': {
    ko: '은퇴한 외교관입니다. 40년을 해외에서 지낸 뒤 2019년부터 본국에 있습니다.',
    ja: '引退した外交官です。40年間海外で過ごしたあと、2019年から帰国しています。',
    zh: '已退休的外交官。在国外40年后，2019年起回国。',
  },
  'kim-ok': {
    ko: '2011년 이후 모습을 보이지 않습니다. 숙청되었다는 보도가 있습니다.',
    ja: '2011年以降、姿を見せていません。粛清されたと報じられています。',
    zh: '2011年起不再露面。据报道已被清洗。',
  },
  'kim-jong-il': {
    ko: '2011년에 사망했습니다. Kim Jong Un의 아버지입니다.',
    ja: '2011年に死去しました。Kim Jong Unの父です。',
    zh: '2011年去世。Kim Jong Un的父亲。',
  },
  'kim-jong-nam': {
    ko: '2017년 쿠알라룸푸르 공항에서 VX 신경작용제로 살해되었습니다.',
    ja: '2017年、クアラルンプール空港でVX神経剤により殺害されました。',
    zh: '2017年在吉隆坡机场被VX神经毒剂杀害。',
  },
};

/** The one-line status for a card. English comes from kimFamilyNow.ts. Other languages overlay that text. */
export function kimFamilyNowText(lang: Lang, id: string): string | undefined {
  const line = KIM_FAMILY_NOW[id];
  if (!line) return undefined;
  if (lang === 'en') return line.text;
  return NOW_I18N[id]?.[lang] ?? line.text;
}
