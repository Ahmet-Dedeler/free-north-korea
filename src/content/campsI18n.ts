/**
 * Text for /camps and /camps/[slug] in every language. English sentences stay in camps.ts (articles and the home
 * page import them). Korean, Japanese and Chinese are an overlay keyed by camp slug. For lang === 'en', callers
 * show the English already on the camp.
 *
 * Proper names that stay in English on purpose: camp.name, romanized aliases (facts.aka), source titles from the
 * data file, book title Eyes of the Tailless Animals, the NKDB volume title Prisoners in North Korea Today,
 * micro-spellings the source is comparing (Chonsan, Hoeyang, Chael-kol, Pyongang), and truncated tails of HRNK
 * notes (the source itself cuts off). Place names in JSON-LD addressRegion stay the English province string.
 */
import type { Camp } from '@/content/camps';
import type { Lang } from '@/site/seo';

export const CAMPS_PATHS = { en: '/camps', ko: '/ko/camps', ja: '/ja/camps', zh: '/zh/camps' } as const;

export const campLanguages = (slug: string) => ({
  en: `/camps/${slug}`,
  ko: `/ko/camps/${slug}`,
  ja: `/ja/camps/${slug}`,
  zh: `/zh/camps/${slug}`,
});

const PREFIXED = [/^\/camps(?=\/|$)/, /^\/counties(?=\/|$)/, /^\/places(?=\/|$)/, /^\/people(?=\/|$)/, /^\/learn(?=\/|$)/, /^\/sanctions(?=\/|$)/];

/** Prefix the pages in this translation set. /map and /missiles stay where they are. */
export function hrefFor(lang: Lang, path: string): string {
  if (lang === 'en' || path.startsWith('/map') || path.startsWith('/missiles')) return path;
  if (path === '/') return `/${lang}`;
  const base = path.split(/[?#]/)[0];
  if (!PREFIXED.some((re) => re.test(base))) return path;
  return `/${lang}${path}`;
}

type L3 = 'ko' | 'ja' | 'zh';
type Trio = Record<L3, string>;

export type CampFields = {
  status: string;
  /** What the index card shows when the camp is not closed. Drops the "(per HRNK)" aside. */
  statusCard: string;
  note: string;
  overview: string;
  summary: string;
  /** Full kind, used in the meta description and the share-card kicker. */
  kind: string;
  /** Header tag on the dossier. */
  kindTag: string;
  /** Short kind on nearby cards. */
  kindShort: string;
  province: string;
};

type Chrome = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  lede: string;
  statPrisonersValue: string;
  statPrisoners: string;
  statPrisonersNote: string;
  statKwanliso: string;
  statKyohwaso: string;
  openMap: string;
  howSystem: string;
  mapLabel: string;
  legendKwanliso: string;
  legendKyohwaso: string;
  kwanlisoTitle: string;
  kwanlisoBlurb: string;
  kyohwasoTitle: string;
  kyohwasoBlurb: string;
  crumb: string;
  kindKwanliso: string;
  kindKyohwaso: string;
  kindTagKwanliso: string;
  kindTagKyohwaso: string;
  kindShortKwanliso: string;
  kindShortKyohwaso: string;
  prisoners: string;
  prisonersEstimate: string;
  prisonersUnknown: string;
  closed: string;
  active: string;
  runBy: string;
  openOnMap: string;
  county: (name: string) => string;
  howCamps: string;
  whoHeld: string;
  forcedLabor: string;
  documented: string;
  aka: string;
  extraOne: string;
  extraMany: (n: number) => string;
  crimesTitle: string;
  crimesBody: string;
  whyTitle: string;
  whyBody: string;
  /** Same order as COI_CRIMES in Visual.tsx. */
  crimes: string[];
  /** Same order as KYOHWASO_OFFENCES in Visual.tsx. */
  offences: string[];
  sources: string;
  hrnkReport: (year?: string) => string;
  coiSource: string;
  otherIn: (province: string) => string;
  evidenceAria: string;
  evidenceImagery: string;
  evidenceReports: string;
  evidenceTestimony: string;
  ogKickerFallback: string;
  ogTitleFallback: string;
  dossierTitle: (name: string) => string;
  dossierDescription: (name: string, kind: string, status: string, province: string, note: string) => string;
};

const OP: Trio = { ko: '운영 중', ja: '稼働中', zh: '仍在运营' };
const OP_HRNK: Trio = { ko: '운영 중 (HRNK 기준)', ja: '稼働中（HRNKによる）', zh: '仍在运营（据HRNK）' };
const EXPANDED: Trio = { ko: '운영 중, 2010년대에 확장', ja: '稼働中、2010年代に拡張', zh: '仍在运营，2010年代有扩建' };
const CLOSED_DISPUTED: Trio = {
  ko: '폐쇄 또는 축소로 보고됐으나 이견이 있음',
  ja: '閉鎖または縮小との報告があるが、見解は分かれている',
  zh: '据报已关闭或缩小，仍有争议',
};
const CLOSED_2012: Trio = { ko: '2012년경 폐쇄', ja: '2012年頃に閉鎖', zh: '约2012年关闭' };
const CLOSED_MERGED: Trio = { ko: '폐쇄 또는 통합으로 보고됨', ja: '閉鎖または統合との報告', zh: '据报已关闭或被合并' };
const REPORTED_CLOSED: Trio = { ko: '폐쇄로 보고됨', ja: '閉鎖との報告', zh: '据报已关闭' };
const NO_SUMMARY: Trio = { ko: '', ja: '', zh: '' };

const j = (...parts: Trio[]): Trio => ({
  ko: parts.map((p) => p.ko).filter(Boolean).join(' '),
  ja: parts.map((p) => p.ja).filter(Boolean).join(''),
  zh: parts.map((p) => p.zh).filter(Boolean).join(''),
});

const UNKNOWN: Trio = {
  ko: '수감자 유형: 알 수 없음. 노동 유형: 알 수 없음.',
  ja: '収容者の類型: 不明。労働の類型: 不明。',
  zh: '囚犯类型：不详。劳动类型：不详。',
};
const NOT_CONFIRMED: Trio = {
  ko: '이 장소는 HRNK 수감자 증언으로 확인되지 않았습니다.',
  ja: 'この場所はHRNKの収容者証言では確認されていません。',
  zh: '这一地点未经HRNK的囚犯证词确认。',
};
const LISTED: Trio = {
  ko: 'NKDB와 KINU 보고서에 등재돼 있습니다.',
  ja: 'NKDBとKINUの報告書に記載されています。',
  zh: '它被列入NKDB和KINU的报告。',
};
const LISTED_BEFORE: Trio = {
  ko: '이전에 NKDB와 KINU 보고서에 등재됐습니다.',
  ja: '以前にNKDBとKINUの報告書に記載されています。',
  zh: '它此前被列入NKDB和KINU的报告。',
};
const NO_MORE: Trio = {
  ko: '현재 운영 상태에 대한 추가 정보는 없습니다.',
  ja: '現在の稼働状況について、これ以上の情報はありません。',
  zh: '没有关于它目前运营状态的进一步信息。',
};
const NOT_YET: Trio = {
  ko: '이 장소는 아직 확인되지 않았습니다.',
  ja: 'この場所はまだ確認されていません。',
  zh: '这一地点尚未得到确认。',
};
const NOT_CONFIRMED_NGO: Trio = {
  ko: '이 장소는 HRNK 수감자 증언으로 확인되지 않았고, NGO 보고서에도 등재되지 않았습니다. 다만 위성사진은 기록이 잘 된 다른 교화소와 모습이 비슷합니다.',
  ja: 'この場所はHRNKの収容者証言では確認されておらず、NGOの報告書にも記載されていません。ただし衛星画像は、記録の多い他の教化所と外見が似ています。',
  zh: '这一地点未经HRNK的囚犯证词确认，也没有被列入非政府组织的报告。不过卫星图像看起来和其他记录较全的教化所很像。',
};

const report = (year: string, url: string): Trio => ({
  ko: `자세한 분석은 ${year}년 HRNK 보고서에 있습니다. ${url}`,
  ja: `詳しい分析は${year}年のHRNK報告書にあります。${url}`,
  zh: `详细分析见${year}年的HRNK报告：${url}`,
});

const URL_11 = 'https://www.hrnk.org/uploads/pdfs/Hawk_The_Parallel_Gulag_Web.pdf';
const URL_SUNGHO = 'https://www.hrnk.org/uploads/pdfs/Bermudez_Pokchongni_FINALFINAL_Web.pdf';
const URL_CHOMA = 'https://www.hrnk.org/uploads/pdfs/ASA_HRNK_Chmbg_201603_FINAL.pdf';
const URL_KANGDONG = 'https://www.hrnk.org/uploads/pdfs/Bermudez_Kangdong_FINALFINAL.pdf';

const PROVINCE: Record<string, Trio> = {
  'South Pyongan Province': { ko: '평안남도', ja: '平安南道', zh: '平安南道' },
  'North Hamgyong Province': { ko: '함경북도', ja: '咸鏡北道', zh: '咸镜北道' },
  'South Hamgyong Province': { ko: '함경남도', ja: '咸鏡南道', zh: '咸镜南道' },
  'Kangwon Province': { ko: '강원도', ja: '江原道', zh: '江原道' },
  'Chagang Province': { ko: '자강도', ja: '慈江道', zh: '慈江道' },
  'North Pyongan Province': { ko: '평안북도', ja: '平安北道', zh: '平安北道' },
  Pyongyang: { ko: '평양', ja: '平壌', zh: '平壤' },
  'Pyongyang City': { ko: '평양시', ja: '平壌市', zh: '平壤市' },
  'North Hwanghae Province': { ko: '황해북도', ja: '黄海北道', zh: '黄海北道' },
};

const LABOR: Record<string, Trio> = {
  Farming: { ko: '농사', ja: '農作業', zh: '农耕' },
  Construction: { ko: '건설', ja: '建設', zh: '建筑' },
  Manufacturing: { ko: '제조', ja: '製造', zh: '制造' },
  Sewing: { ko: '봉제', ja: '縫製', zh: '缝纫' },
  'Gold mining': { ko: '금 채굴', ja: '金の採掘', zh: '采金' },
  'Coal mining': { ko: '석탄 채굴', ja: '石炭の採掘', zh: '采煤' },
  Mining: { ko: '채굴', ja: '採掘', zh: '采矿' },
  'Agricultural production': { ko: '농업 생산', ja: '農業生産', zh: '农业生产' },
  'Rock and gold mining': { ko: '암석·금 채굴', ja: '岩石と金の採掘', zh: '采石和采金' },
  'Prison uniform manufacturing': { ko: '수용복 제조', ja: '囚人服の製造', zh: '囚服制作' },
  'Limestone and cement production': { ko: '석회석·시멘트 생산', ja: '石灰石とセメントの生産', zh: '石灰石和水泥生产' },
  'Clothing and Shoe factory': { ko: '의류·신발 공장', ja: '衣類・靴工場', zh: '服装和制鞋厂' },
  'Model detention facility': { ko: '모범 구금시설', ja: 'モデル拘禁施設', zh: '示范拘留设施' },
};

const PRISONERS: Record<string, Trio> = {
  Men: { ko: '남성', ja: '男性', zh: '男性' },
  Women: { ko: '여성', ja: '女性', zh: '女性' },
  'Border crossers': { ko: '국경을 넘은 사람', ja: '国境を越えた人', zh: '越境者' },
  'Political prisoners': { ko: '정치범', ja: '政治犯', zh: '政治犯' },
  'Criminal offenders': { ko: '형사범', ja: '刑事犯', zh: '刑事犯' },
  'Civilian and military offenders': { ko: '민간·군인 범죄자', ja: '民間人と軍人の犯罪者', zh: '平民和军人罪犯' },
  'Short term prisoners': { ko: '단기 수감자', ja: '短期の収容者', zh: '短期囚犯' },
  'Genuine criminal offenders': { ko: '일반 형사범', ja: '通常の刑事犯', zh: '普通刑事犯' },
  'Forcibly repatriated women': { ko: '강제 송환된 여성', ja: '強制送還された女性', zh: '被强制遣返的女性' },
};

const AGENCY: Record<L3, Record<string, { value: string; note?: string }>> = {
  ko: {
    'Ministry of State Security (Bowibu)': { value: '국가보위성', note: '보위부' },
    'Ministry of State Security': { value: '국가보위성' },
    'Ministry of Social Security (Police)': { value: '사회안전성', note: '경찰' },
    'Ministry of Social Security': { value: '사회안전성' },
  },
  ja: {
    'Ministry of State Security (Bowibu)': { value: '国家保衛省', note: '保衛部' },
    'Ministry of State Security': { value: '国家保衛省' },
    'Ministry of Social Security (Police)': { value: '社会安全省', note: '警察' },
    'Ministry of Social Security': { value: '社会安全省' },
  },
  zh: {
    'Ministry of State Security (Bowibu)': { value: '国家保卫省', note: '保卫部' },
    'Ministry of State Security': { value: '国家保卫省' },
    'Ministry of Social Security (Police)': { value: '社会安全省', note: '警察' },
    'Ministry of Social Security': { value: '社会安全省' },
  },
};

type CampCopy = { status: Trio; statusCard: Trio; note: Trio; overview: Trio; summary: Trio };

const note14: Trio = {
  ko: '수감자가 풀려나지 않는 완전통제구역입니다. 신동혁(『14호 수용소 탈출』)은 여기서 태어났다고 말합니다.',
  ja: '収容者が釈放されない完全統制区域です。申東赫（シン・ドンヒョク、『北朝鮮 14号管理所からの脱出』）は、ここで生まれたと言っています。',
  zh: '这是完全控制区，关进去的人不会被释放。申东赫（《逃出14号劳改营》）说他出生在这里。',
};
const note25: Trio = {
  ko: '청진 가장자리에 있는 정치범수용소입니다. 2010년대 위성사진에서 초소와 건물이 새로 생겼습니다.',
  ja: '清津の外れにある政治犯収容所です。2010年代の衛星画像では、新しい監視哨と建物が確認されました。',
  zh: '位于清津市区边缘的政治犯收容所。2010年代的卫星图像显示，这里新建了岗亭和房屋。',
};
const note15: Trio = {
  ko: '일부 수감자가 풀려난 "혁명화구역"이 있었습니다. 초기 수용소 증언이 대부분 여기서 나온 이유입니다. 강철환(『평양의 수족관』)은 어린 시절 여기에 수감됐습니다.',
  ja: '一部の収容者が釈放された「革命化区域」がありました。初期の収容所証言の多くがここから出ているのはそのためです。姜哲煥（『平壌の水槽』）は子どものころここに収容されていました。',
  zh: '这里有过“革命化区”，一部分囚犯从那里获释，所以早期关于收容所的证词大多来自这里。姜哲焕（《平壤的水族馆》）小时候被关在这里。',
};
const note16: Trio = {
  ko: '알려진 정치범수용소 가운데 가장 큽니다. 풍계리 핵실험장에서 몇 km 떨어져 있습니다. 수감자는 수만 명으로 추정됩니다.',
  ja: '知られている政治犯収容所の中で最大です。豊渓里の核実験場から数kmの場所にあります。収容者は数万人と推定されています。',
  zh: '已知最大的政治犯收容所，距丰溪里核试验场几公里。估计关押着数万人。',
};
const note22: Trio = {
  ko: '한때는 가장 큰 수용소 중 하나였습니다. 2012년경에 폐쇄됐습니다. 수감자들이 어떻게 됐는지는 알려져 있지 않습니다.',
  ja: 'かつては最大級の収容所の一つでした。2012年頃に閉鎖されました。収容者がどうなったのかは分かっていません。',
  zh: '曾经是最大的收容所之一。约在2012年关闭。里面的囚犯后来怎样，没有人知道。',
};
const note18: Trio = {
  ko: '14호 관리소와 강을 사이에 둔 광산 수용소입니다. 2000년대에 폐쇄되거나 통합됐다는 보고가 있지만, 일부는 아직 쓰일 수 있습니다.',
  ja: '14号管理所と川を挟んで向かい合う鉱山の収容所です。2000年代に閉鎖または統合されたとの報告がありますが、一部は今も使われている可能性があります。',
  zh: '与14号管理所隔河相望的矿山收容所。有报告说它在2000年代关闭或被合并，不过部分区域可能仍在使用。',
};
const note1: Trio = {
  ko: '범죄로 유죄 판결을 받은 사람을 위한 재교육 교화소입니다. 생존자들은 강제노동과 높은 사망률을 말합니다.',
  ja: '犯罪で有罪となった人のための再教育刑務所です。生存者は強制労働と高い死亡率を語っています。',
  zh: '关押被判有罪者的再教育监狱。幸存者描述了强迫劳动和很高的死亡率。',
};
const note12: Trio = {
  ko: '탈북했다가 중국에서 강제로 돌려보내진 사람이 많이 수감돼 있습니다. 증언은 굶주림과 학대, 특히 여성에 대한 학대를 전합니다.',
  ja: '脱出後に中国から強制的に送り返された人を多く収容しています。証言は飢餓と虐待、とくに女性への虐待を伝えています。',
  zh: '这里关着许多逃出后被中国强制遣返的人。证词描述了饥饿和虐待，尤其是对妇女的虐待。',
};

const summaryYongdam: Trio = {
  ko: 'NKDB와 KINU는 모두 강원도 천내군에 번호 없는 교화소로 용담을 언급합니다. 2011년 NKDB 자료집 『Prisoners in North Korea Today』는 Pyongang의 Seungho 지역에 "Prison No. 8"이 있다고 적습니다.',
  ja: 'NKDBとKINUはどちらも、江原道・川内郡にある番号のない教化所として龍潭（Yongdam）に言及しています。2011年のNKDB資料集『Prisoners in North Korea Today』は、PyongangのSeungho地域に「Prison No. 8」を記載しています。',
  zh: 'NKDB和KINU都把龙潭（Yongdam）列为江原道川内郡一处没有编号的教化所。2011年NKDB资料集《Prisoners in North Korea Today》记载，Pyongang的Seungho地区有一处“Prison No. 8”。',
};
const summaryHamhung: Trio = {
  ko: '2011년 NKDB 보고서는 9호 교화소 함흥 남성 교화소를 함흥시 Hoesang 구역 Hoeyang에 두고, 함흥 여성 교화소는 Songwon 마을(Sungwon으로도 표기), 함흥시 Hoesang 구역에 있다고 적습니다.',
  ja: '2011年のNKDB報告書は、9号教化所の咸興男子刑務所を咸興市Hoesang区域のHoeyangに置き、咸興女子刑務所はSongwon村（Sungwonとも表記）、咸興市Hoesang区域にあるとしています。',
  zh: '2011年NKDB报告把9号教化所咸兴男监标在咸兴市Hoesang区域的Hoeyang，把咸兴女监标在Songwon村（也写作Sungwon），咸兴市Hoesang区域。',
};
const summaryKangdong: Trio = {
  ko: '4호 교화소(강동)는 평양 동쪽 외곽, 평안남도와 가까운 Chael-kol에 있습니다.',
  ja: '4号教化所（江東）は、平壌の東の外れ、平安南道に近いChael-kolにあります。',
  zh: '江东4号教化所位于平壤东郊、靠近平安南道的Chael-kol。',
};
const summarySariwon: Trio = {
  ko: '6호 교화소(사리원)는 북한 밖에서 일찍 알려진 수용소 중 하나입니다. 국제앰네스티가 Ali Lameda와 Jacques Sedillot의 석방에 관여했기 때문입니다. 두 사람은 각각 베네수엘라와 프랑스 공산당의 성실한 당원이었습니다.',
  ja: '6号教化所（沙里院）は、北朝鮮の外で早くから広く知られた収容所の一つです。アムネスティ・インターナショナルがAli LamedaとJacques Sedillotの釈放に関わったためです。二人はそれぞれベネズエラとフランスの共産党で、党員として問題のない立場にいました。',
  zh: '沙里院6号教化所是朝鲜境外较早广为人知的监狱之一，因为国际特赦组织参与了Ali Lameda和Jacques Sedillot的释放。两人分别是委内瑞拉共产党和法国共产党中信誉良好的党员。',
};
const summaryOro: Trio = {
  ko: '22호 교화소(오로)는 2008년경에 폐쇄된 것으로 보입니다.',
  ja: '22号教化所（Oro）は2008年頃に閉鎖されたと考えられています。',
  zh: '据信Oro的22号教化所约在2008年关闭。',
};
const summaryDanchon: Trio = {
  ko: '77호 교화소(단천)는 1997년경에 폐쇄된 것으로 보입니다. 다만 여기서 확인된 장소들은 가동 중인 것으로 보입니다.',
  ja: '77号教化所（端川）は1997年頃に閉鎖されたと考えられています。ただし、ここで特定された場所は稼働しているように見えます。',
  zh: '据信端川77号教化所约在1997年关闭。不过，这里标出的地点看起来仍在运转。',
};

const CAMP_COPY: Record<string, CampCopy> = {
  'kwanliso-14': {
    status: OP,
    statusCard: OP,
    note: note14,
    summary: note14,
    overview: {
      ko: '14호 관리소는 평안남도 개천의 대동강변에 있는 "완전통제구역"(wanjeon tongje-guyeok) 정치범수용소입니다. 완전통제구역으로 보내진 사람은 풀려나지 않으며, 연좌제로 한 가족의 여러 세대가 함께 수감됩니다. 전 수감자 신동혁은 14호 안에서 태어났고, 2005년에 탈출하기까지를 자세히 증언했습니다.',
      ja: '14号管理所は、平安南道・价川の大同江沿いにある「完全統制区域」（wanjeon tongje-guyeok）の政治犯収容所です。完全統制区域に送られた人は釈放されず、連座制（yeonjwa-je）で一家の何世代も一緒に収容されます。元収容者の申東赫（シン・ドンヒョク）は、14号の中で生まれ、2005年に脱出するまでのことを詳しく証言しています。',
      zh: '14号管理所是位于平安南道价川、大同江畔的“完全控制区”（wanjeon tongje-guyeok）政治犯收容所。被送进完全控制区的人不会获释，一家人的几代人会因连坐制（yeonjwa-je）被关在一起。前囚犯申东赫详细讲述了自己出生在14号、并于2005年逃出的经历。',
    },
  },
  'kwanliso-25': {
    status: EXPANDED,
    statusCard: EXPANDED,
    note: note25,
    summary: note25,
    overview: {
      ko: '25호 관리소는 함경북도 청진 시가지 안에 있습니다. HRNK와 CSIS가 분석한 위성사진은 2010년대에 초소, 외곽 담, 농사 작업장이 크게 늘었음을 보여줍니다. 산골 수용소와 달리 25호는 시 경계 안에서 운영되며, 정치범이 강제 제조와 농사에 동원됩니다.',
      ja: '25号管理所は咸鏡北道・清津の市街地の中にあります。HRNKとCSISが分析した衛星画像では、2010年代に監視哨、外周の壁、農業作業場が大きく拡張されています。山あいの収容所とは違い、25号は市域の中で運営され、政治犯が強制的な製造と農業に従事しています。',
      zh: '25号管理所位于咸镜北道清津的城区里。HRNK和CSIS分析的卫星图像显示，2010年代岗亭、围墙和农作工棚明显扩建。和山谷里的收容所不同，25号在城市范围内运转，政治犯被强迫从事制造和农活。',
    },
  },
  'kwanliso-15': {
    status: CLOSED_DISPUTED,
    statusCard: CLOSED_DISPUTED,
    note: note15,
    summary: note15,
    overview: {
      ko: '함경남도 요덕군의 15호 관리소는 국제적으로 가장 많이 기록된 북한 정치범수용소입니다. 완전통제구역과, 사상 교화 뒤 이론상 풀려날 수 있는 "혁명화구역"(hyeokmyeonghwa guyeok)을 함께 둔 점이 특징입니다. 잘 알려진 탈북민 강철환(『평양의 수족관』의 저자)과 안혁은 형기를 마친 뒤 요덕에서 풀려났습니다.',
      ja: '咸鏡南道・耀徳郡の15号管理所は、国際的に最も記録の多い北朝鮮の政治犯収容所です。完全統制区域と、思想教育のあと理論上は釈放され得る「革命化区域」（hyeokmyeonghwa guyeok）の両方を持っていた点が他と違います。よく知られた脱出者の姜哲煥（『平壌の水槽』の著者）とアン・ヒョクは、刑期のあと耀徳から釈放されました。',
      zh: '咸镜南道耀德郡的15号管理所，是国际上记录最多的朝鲜政治犯收容所。它同时设有完全控制区和“革命化区”（hyeokmyeonghwa guyeok），后一区的囚犯在思想改造之后理论上可以获释。知名脱北者姜哲焕（《平壤的水族馆》的作者）和安赫服刑后从耀德获释。',
    },
  },
  'kwanliso-16': {
    status: OP,
    statusCard: OP,
    note: note16,
    summary: note16,
    overview: {
      ko: '함경북도 화성군의 16호 관리소는 약 560제곱킬로미터로, 알려진 북한 구금시설 가운데 면적이 가장 넓습니다. 풍계리 핵실험장 근처의 높은 산골에 있으며, 위성사진은 정치범 약 20,000명이 벌목, 농사, 채굴에 동원되고 있음을 보여줍니다.',
      ja: '咸鏡北道・化城郡の16号管理所は約560平方キロメートルで、知られている北朝鮮の拘禁施設の中で面積が最大です。豊渓里の核実験場に近い高い山あいにあり、衛星画像では推定20,000人の政治犯が伐採、農業、採掘に従事していることが示されています。',
      zh: '咸镜北道化城郡的16号管理所占地约560平方公里，是已知面积最大的朝鲜拘禁设施。它位于丰溪里核试验场附近的高山山谷里，卫星图像显示约20,000名政治犯在从事伐木、农耕和采矿。',
    },
  },
  'kwanliso-22': {
    status: CLOSED_2012,
    statusCard: CLOSED_2012,
    note: note22,
    summary: note22,
    overview: {
      ko: '22호 관리소는 함경북도 회령의 대규모 완전통제 수용소로, 수백 제곱킬로미터에 약 50,000명이 수감된 것으로 추정됐습니다. 전 경비원 안명철의 증언은 조직적인 고문, 강제 낙태, 굶주림 수준의 배급을 기록했습니다. 위성 감시는 수용소가 2012년경 문을 닫았음을 확인했지만, 남은 수감자의 행방은 알려지지 않았습니다.',
      ja: '22号管理所は咸鏡北道・会寧にあった巨大な完全統制収容所で、数百平方キロメートルに推定50,000人が収容されていました。元警備員の安明哲の証言は、組織的な拷問、強制中絶、飢餓レベルの配給を記録しています。衛星監視は、収容所が2012年頃に閉鎖されたことを確認していますが、残っていた収容者の行方は分かっていません。',
      zh: '22号管理所曾是咸镜北道会宁的大型完全控制收容所，数百平方公里内估计关押着50,000人。前看守安明哲的证词记录了系统性酷刑、强迫堕胎和饥饿口粮。卫星监测确认该所约在2012年关闭，但当时还在里面的囚犯下落不明。',
    },
  },
  'kwanliso-18': {
    status: CLOSED_MERGED,
    statusCard: CLOSED_MERGED,
    note: note18,
    summary: note18,
    overview: {
      ko: '18호 관리소는 평안남도 북창군에 있으며, 대동강을 사이에 두고 14호 맞은편에 있습니다. 비밀경찰이 아니라 일반 경찰(사회안전성)이 운영했고, 수만 명의 수감자를 북창화력발전소용 위험한 석탄 채굴에 동원했습니다. 전 수감자 김용은 탈출한 뒤 자세한 증언을 남겼습니다.',
      ja: '18号管理所は平安南道・北倉郡にあり、大同江を挟んで14号の向かいにあります。秘密警察ではなく一般警察（社会安全省）が運営し、数万人の収容者を北倉火力発電所のための危険な石炭採掘に従事させました。元収容者のキム・ヨンは脱出後、詳しい証言を残しています。',
      zh: '18号管理所位于平安南道北仓郡，在大同江对岸，正对14号。它历史上由普通警察（社会安全省）而不是秘密警察管理，强迫数万名囚犯为北仓火电厂从事危险的采煤。前囚犯金勇脱逃后留下了详细证词。',
    },
  },
  'kyohwaso-8-yongdam': {
    status: OP_HRNK,
    statusCard: OP,
    note: j(UNKNOWN, NOT_CONFIRMED, summaryYongdam, NO_MORE),
    summary: summaryYongdam,
    overview: {
      ko: '8호 교화소는 강원도 용담 근처의 장기 교화소입니다. 수감자는 경제 범죄, 무단 여행, 국경을 넘는 연락으로 유죄 판결을 받으며, 영양이 크게 부족한 상태에서 농사와 채석 강제노동을 합니다.',
      ja: '8号教化所は、江原道・龍潭の近くにある長期の矯正刑務所です。収容者は経済犯罪、無許可の旅行、国境を越える連絡で有罪となっており、深刻な栄養不足のなかで農業と採石の強制労働をさせられています。',
      zh: '8号教化所是江原道龙潭附近的长期矫正监狱。囚犯因经济犯罪、未经批准出行或跨境联络被定罪，并在严重营养不足的情况下被迫从事农耕和采石。',
    },
  },
  'kyohwaso-11-chungsan': {
    status: OP_HRNK,
    statusCard: OP,
    note: j(
      {
        ko: '11호 교화소(증산)는 Chonsan, Jungsan, Jeungsan으로도 표기됩니다. 500.',
        ja: '11号教化所（甑山）はChonsan、Jungsan、Jeungsanとも表記されます。500。',
        zh: '11号教化所（甑山）也写作Chonsan、Jungsan、Jeungsan。500。',
      },
      {
        ko: '수감자 유형: 남성, 여성, 국경을 넘은 사람, 정치범. 노동 유형: 농사, 건설, 제조.',
        ja: '収容者の類型: 男性、女性、国境を越えた人、政治犯。労働の類型: 農作業、建設、製造。',
        zh: '囚犯类型：男性、女性、越境者、政治犯。劳动类型：农耕、建筑、制造。',
      },
      report('2017', URL_11),
    ),
    summary: NO_SUMMARY,
    overview: {
      ko: '평안남도 증산군의 11호 교화소는 넓은 해안 염전과 농사 작업반을 운영합니다. 유엔 북한인권조사위원회가 기록한 증언은, 소금 생산에 배치된 수감자에게 극심한 체력 소진, 심각한 수질 오염, 높은 사망률이 있었다고 전합니다.',
      ja: '平安南道・甑山郡の11号教化所は、広い海岸の塩田と農業作業班を運営しています。国連調査委員会が記録した証言は、塩の生産に割り当てられた収容者に極度の肉体消耗、深刻な水質汚染、高い死亡率があったと伝えています。',
      zh: '平安南道甑山郡的11号教化所经营大片沿海盐田和农业作业班。联合国调查委员会记录的证词描述，被派去产盐的囚犯极度衰竭、饮用水严重污染、死亡率很高。',
    },
  },
  'kyohwaso-7-kanggye': {
    status: OP_HRNK,
    statusCard: OP,
    note: j(
      {
        ko: '7호 교화소(강계)는 Kangkye, Ganggye로도 표기됩니다.',
        ja: '7号教化所（江界）はKangkye、Ganggyeとも表記されます。',
        zh: '江界7号教化所也写作Kangkye、Ganggye。',
      },
      UNKNOWN,
      NOT_CONFIRMED,
      LISTED,
      NO_MORE,
    ),
    summary: NO_SUMMARY,
    overview: {
      ko: '자강도 강계의 산간 내륙에 있는 7호 교화소는, 북부 군사 지역의 방산 보급 시설을 뒷받침하는 중공업 생산과 채굴에 수감자를 배치합니다.',
      ja: '慈江道・江界の山間部にある7号教化所は、北部の軍事地域にある防衛補給施設を支える重工業生産と採掘に収容者を配置しています。',
      zh: '慈江道江界山区腹地的7号教化所关押的囚犯，被派去从事重工业生产和采矿，为北部军事区的国防补给设施服务。',
    },
  },
  'kyohwaso-2-dongrim': {
    status: OP_HRNK,
    statusCard: OP,
    note: j(UNKNOWN, NOT_CONFIRMED, {
      ko: '2011년과 2016년 NKDB 보고서, 2014년과 2016년 KINU 보고서에 등재돼 있습니다.',
      ja: '2011年と2016年のNKDB報告書、2014年と2016年のKINU報告書に記載されています。',
      zh: '它被列入2011年和2016年的NKDB报告，以及2014年和2016年的KINU报告。',
    }, NO_MORE, {
      ko: '이 수용소와 연결된 두 번째 장소인 Obong Workers\' District는 39° 52’5.42”N 124° 44’59.35”E에 있습니다.',
      ja: 'この収容所に結び付く二つ目の場所、Obong Workers\' Districtは39° 52’5.42”N 124° 44’59.35”Eにあります。',
      zh: '与该营相关的第二处地点Obong Workers\' District位于39° 52’5.42”N 124° 44’59.35”E。',
    }),
    summary: NO_SUMMARY,
    overview: {
      ko: '평안북도 동림군의 2호 교화소는 서해안에 가까운 교화 노동 시설로, 수감자는 경공업 제조, 섬유, 목공일을 합니다.',
      ja: '平安北道・東林郡の2号教化所は、西海岸に近い矯正労働施設で、収容者は軽工業の製造、繊維、木工に従事しています。',
      zh: '平安北道东林郡的2号教化所是靠近西海岸的矫正劳动设施，囚犯从事轻工业制造、纺织和木工。',
    },
  },
  'kyohwaso-88-wonsan': {
    status: OP_HRNK,
    statusCard: OP,
    note: j(UNKNOWN, NOT_CONFIRMED, LISTED_BEFORE, NO_MORE, {
      ko: '이 수용소와 연결된 두 번째 장소는 Chuksan-ri, 39° 11’57.43”N 127° 20’45.07”E에 있습니다.',
      ja: 'この収容所に結び付く二つ目の場所はChuksan-ri、39° 11’57.43”N 127° 20’45.07”Eにあります。',
      zh: '与该营相关的第二处地点在Chuksan-ri，39° 11’57.43”N 127° 20’45.07”E。',
    }),
    summary: NO_SUMMARY,
    overview: {
      ko: '강원도 항구 도시 원산에 있는 88호 교화소는 가동 중인 교화 노동 수용소로, 항만 유지, 건설, 연안 산업에 동원됩니다.',
      ja: '江原道の港湾都市・元山にある88号教化所は、稼働中の矯正労働収容所で、港の維持、建設、沿岸産業を支えています。',
      zh: '江原道港口城市元山的88号教化所是仍在运转的矫正劳动营，承担港口维护、建筑和沿海产业。',
    },
  },
  'kyohwaso-9-hamhung': {
    status: OP_HRNK,
    statusCard: OP,
    note: j(
      { ko: 'Hamheung으로도 표기됩니다.', ja: 'Hamheungとも表記されます。', zh: '也写作Hamheung。' },
      summaryHamhung,
      { ko: '500.', ja: '500。', zh: '500。' },
      {
        ko: '수감자 유형: 남성, 여성, 정치범, 강제 송환된 여성. 노동 유형: 봉제, 농사, 금 채굴.',
        ja: '収容者の類型: 男性、女性、政治犯、強制送還された女性。労働の類型: 縫製、農作業、金の採掘。',
        zh: '囚犯类型：男性、女性、政治犯、被强制遣返的女性。劳动类型：缝纫、农耕、采金。',
      },
      {
        ko: '이 수용소와 연결된 두 번째 장소인 함흥 여성 교화소는 Sungwon-ri, 40° 3에 있습니다.',
        ja: 'この収容所に結び付く二つ目の場所、咸興女子刑務所はSungwon-ri、40° 3にあります。',
        zh: '与该营相关的第二处地点、咸兴女监位于Sungwon-ri，40° 3。',
      },
    ),
    summary: summaryHamhung,
    overview: {
      ko: '함경남도 함흥의 9호 교화소는 북한의 주요 화학·제조 거점에 있습니다. 수감자는 유독 화학 공정과 지역 공장 유지보수 강제노동을 합니다.',
      ja: '咸鏡南道・咸興の9号教化所は、北朝鮮の主要な化学・製造の拠点にあります。収容者は有毒な化学処理と、地域の工場の保守で強制労働をさせられています。',
      zh: '咸镜南道咸兴的9号教化所位于朝鲜主要的化工和制造业中心。囚犯被迫从事有毒化工处理和当地工厂的维护。',
    },
  },
  'sunchon-kyohwaso': {
    status: OP_HRNK,
    statusCard: OP,
    note: j(
      {
        ko: '순천 교화소는 Sukchon Kyo-hwa-so로도 불립니다.',
        ja: '順川教化所はSukchon Kyo-hwa-soとも呼ばれます。',
        zh: '顺川教化所有时也叫Sukchon Kyo-hwa-so。',
      },
      {
        ko: '수감자 유형: 알 수 없음. 노동 유형: 금 채굴.',
        ja: '収容者の類型: 不明。労働の類型: 金の採掘。',
        zh: '囚犯类型：不详。劳动类型：采金。',
      },
      NOT_CONFIRMED,
      LISTED,
      NO_MORE,
    ),
    summary: NO_SUMMARY,
    overview: {
      ko: '평안남도의 순천 교화소는 석회석 채석, 시멘트 생산, 화학 공장 노동을 중심으로 운영되는 교화 시설입니다.',
      ja: '平安南道の順川教化所は、石灰石の採石、セメント生産、化学工場の労働を中心に運営されている矯正施設です。',
      zh: '平安南道的顺川教化所是一处仍在运转的矫正设施，以石灰石开采、水泥生产和化工厂劳动为主。',
    },
  },
  'kyohwaso-8-sunghori': {
    status: OP_HRNK,
    statusCard: OP,
    note: j(
      {
        ko: '수감자 유형: 알 수 없음. 노동 유형: 석탄 채굴.',
        ja: '収容者の類型: 不明。労働の類型: 石炭の採掘。',
        zh: '囚犯类型：不详。劳动类型：采煤。',
      },
      NOT_CONFIRMED,
      LISTED_BEFORE,
      NO_MORE,
      report('2019', URL_SUNGHO),
    ),
    summary: NO_SUMMARY,
    overview: {
      ko: '평양 동쪽 승호구역에 있어 수도에서 가깝습니다. 행정 위반과 정치적으로 민감한 사안으로 유죄 판결을 받은 사람들을 수용해 온 교화소입니다.',
      ja: '平壌の東、勝湖区域にあり、首都に近い矯正収容所です。行政上の違反や政治的に敏感な事案で有罪となった人を収容してきました。',
      zh: '这座矫正营在平壤以东的胜湖区域，离首都很近。它历来关押因行政违法和政治敏感问题被定罪的人。',
    },
  },
  'facility-at-i-gol': {
    status: OP_HRNK,
    statusCard: OP,
    note: j(UNKNOWN, NOT_CONFIRMED_NGO, NO_MORE),
    summary: NO_SUMMARY,
    overview: {
      ko: '이골은 함경남도에서 확인된 통제 보안 시설입니다. 위성 감시는 국가보위 구금시설과 맞는 높은 보안 울타리와 외곽 감시탑을 보여줍니다.',
      ja: 'イゴル（I-gol）は、咸鏡南道で確認された制限付きの保安施設です。衛星監視では、国家保衛の拘禁施設と一致する高い保安柵と外周の監視塔が見られます。',
      zh: 'I-gol是在咸镜南道确认的一处受限安保设施。卫星监测显示，这里有高安保围栏和周边岗楼，形态与国家保卫部门的拘留设施一致。',
    },
  },
  'facility-at-udan': {
    status: OP_HRNK,
    statusCard: OP,
    note: j(UNKNOWN, NOT_CONFIRMED_NGO, NO_MORE),
    summary: NO_SUMMARY,
    overview: {
      ko: '우단은 함경북도의 외딴 산악 시설로, 인권 분석가들이 정치적 구금과 국가보위 활동이 의심된다며 추적합니다.',
      ja: 'ウダン（Udan）は咸鏡北道の孤立した山中の施設で、人権の分析者は政治的拘禁と国家保衛の活動が疑われるとして追跡しています。',
      zh: 'Udan是咸镜北道一处孤立的山地设施，人权分析人员因怀疑这里有政治拘押和国家保卫部门的活动而持续追踪。',
    },
  },
  'choma-bong-restricted-area': {
    status: OP_HRNK,
    statusCard: OP,
    note: j(
      {
        ko: '수감자 유형: 알 수 없음. 노동 유형: 채굴, 농업 생산.',
        ja: '収容者の類型: 不明。労働の類型: 採掘、農業生産。',
        zh: '囚犯类型：不详。劳动类型：采矿、农业生产。',
      },
      report('2016', URL_CHOMA),
    ),
    summary: NO_SUMMARY,
    overview: {
      ko: '평안남도의 처마봉 통제구역은 일반 주민의 출입이 제한되고 전담 초병이 지키는 외딴 산악 구역입니다.',
      ja: '平安南道のCh’oma-bong統制区域は、一般住民の立ち入りが制限され、専任の哨兵が警備する孤立した山中の一画です。',
      zh: '平安南道的Ch’oma-bong限制区是一块孤立的山地飞地，普通居民不得进入，由专设哨兵看守。',
    },
  },
  'kyohwaso-3-sinuiju': {
    status: OP_HRNK,
    statusCard: OP,
    note: j(
      {
        ko: '수감자 유형: 남성, 형사범, 정치범, 기타 (uknown). 노동 유형: 암석·금 채굴, 수용복 제조.',
        ja: '収容者の類型: 男性、刑事犯、政治犯、その他（uknown）。労働の類型: 岩石と金の採掘、囚人服の製造。',
        zh: '囚犯类型：男性、刑事犯、政治犯、其他（uknown）。劳动类型：采石和采金、囚服制作。',
      },
      NOT_YET,
      LISTED,
      NO_MORE,
    ),
    summary: NO_SUMMARY,
    overview: {
      ko: '평안북도 신의주, 중국 단둥 맞은편에 있는 3호 교화소의 수감자는 약 2,500명입니다. 국경과 가까워, 재판 전에 압록강변에서 붙잡힌 탈북민이 많습니다.',
      ja: '平安北道・新義州、中国の丹東の向かいにある3号教化所の収容者は約2,500人です。国境に近いため、裁判の前に鴨緑江沿いで拘束された脱出者を多く収容しています。',
      zh: '3号教化所位于平安北道新义州，隔江对着中国丹东，关押约2,500人。因为靠近边境，这里关着许多在审判前于鸭绿江一带被截住的脱北者。',
    },
  },
  'kyohwaso-1-kaechon': {
    status: OP,
    statusCard: OP,
    note: note1,
    summary: note1,
    overview: {
      ko: '개천의 1호 교화소에는 약 4,000명이 수감돼 있으며, 생존자 이순옥(『Eyes of the Tailless Animals』의 저자)이 자세히 기록했습니다. 수감자는 엄격한 생산 할당 아래 섬유와 가죽 신발을 만듭니다.',
      ja: '价川の1号教化所には約4,000人が収容されており、生存者の李順玉（『Eyes of the Tailless Animals』の著者）が詳しく記録しています。収容者は厳しい生産ノルマのもとで繊維と革靴を作ります。',
      zh: '价川1号教化所关押约4,000人，幸存者李顺玉（《Eyes of the Tailless Animals》的作者）做了详细记录。囚犯在严格的生产定额下制作纺织品和皮鞋。',
    },
  },
  'kyohwaso-4-kangdong': {
    status: OP_HRNK,
    statusCard: OP,
    note: j(
      { ko: 'Gangdong으로도 표기됩니다.', ja: 'Gangdongとも表記されます。', zh: '也写作Gangdong。' },
      summaryKangdong,
      { ko: '4,000까지.', ja: '4,000まで。', zh: '至4,000。' },
      {
        ko: '수감자 유형: 남성, 민간·군인 범죄자, 정치범. 노동 유형: 석회석·시멘트 생산.',
        ja: '収容者の類型: 男性、民間人と軍人の犯罪者、政治犯。労働の類型: 石灰石とセメントの生産。',
        zh: '囚犯类型：男性、平民和军人罪犯、政治犯。劳动类型：石灰石和水泥生产。',
      },
      report('2019', URL_KANGDONG),
    ),
    summary: summaryKangdong,
    overview: {
      ko: '평양 동쪽 강동군의 4호 교화소에는 약 1,000명이 수감돼 있으며, 무장 감시 아래 유리, 도자기, 요업 제품을 만듭니다.',
      ja: '平壌の東、江東郡の4号教化所には約1,000人が収容され、武装した監視のもとでガラス、陶磁器、セラミックの製造に従事しています。',
      zh: '平壤以东江东郡的4号教化所关押约1,000人，他们在武装看管下从事玻璃、陶器和陶瓷制造。',
    },
  },
  'kyohwaso-12-chongori': {
    status: OP,
    statusCard: OP,
    note: note12,
    summary: note12,
    overview: {
      ko: '함경북도 회령 전거리의 12호 교화소는 중국에서 강제 송환된 북한 사람이 주로 보내지는 교화소입니다. 유엔 북한인권조사위원회는 일상적인 고문, 죽음에 이르는 구타, 강제 낙태, 굶주림을 포함한 심한 학대를 기록했습니다. 활동가 박지현은 여기에 수감됐다가 살아남았고, 두 번째로 탈출했습니다.',
      ja: '咸鏡北道・会寧の全巨里にある12号教化所は、中国から強制送還された北朝鮮の人が主に送られる刑務所です。国連調査委員会は、日常的な拷問、死に至る殴打、強制中絶、飢餓を含む深刻な虐待を記録しています。活動家の朴智賢（パク・ジヒョン）はここで収容を生き延び、二度目の脱出を果たしました。',
      zh: '咸镜北道会宁全巨里的12号教化所，是被中国强制遣返的朝鲜人主要被送去的监狱。联合国调查委员会记录了严重虐待，包括日常酷刑、致命殴打、强迫堕胎和饥饿。活动人士朴智贤曾被关在这里，活了下来，并第二次逃出。',
    },
  },
  'kyohwaso-6-sariwon': {
    status: OP_HRNK,
    statusCard: OP,
    note: j(
      { ko: '4,000까지.', ja: '4,000まで。', zh: '至4,000。' },
      {
        ko: '수감자 유형: 남성, 정치범. 노동 유형: 의류·신발 공장, 농사, "모범 구금시설".',
        ja: '収容者の類型: 男性、政治犯。労働の類型: 衣類・靴工場、農作業、「モデル拘禁施設」。',
        zh: '囚犯类型：男性、政治犯。劳动类型：服装和制鞋厂、农耕、“示范拘留设施”。',
      },
      summarySariwon,
      {
        ko: '1967년, 둘 다 Pyongyan으로 초빙',
        ja: '1967年、二人ともPyongyanに招聘',
        zh: '1967年，两人都被招聘到Pyongyan',
      },
    ),
    summary: summarySariwon,
    overview: {
      ko: '황해북도 사리원의 6호 교화소에는 약 3,000명이 수감돼 있으며, 시멘트 제조, 농사, 석공일에 종사합니다.',
      ja: '黄海北道・沙里院の6号教化所には約3,000人が収容され、セメント製造、農業、石工に従事しています。',
      zh: '黄海北道沙里院的6号教化所关押约3,000人，从事水泥制造、农耕和砌筑。',
    },
  },
  'kyohwaso-22-oro': {
    status: REPORTED_CLOSED,
    statusCard: REPORTED_CLOSED,
    note: j(
      summaryOro,
      {
        ko: '수감자 유형: 남성, 여성, 정치범, 단기 수감자. 노동 유형: 건설.',
        ja: '収容者の類型: 男性、女性、政治犯、短期の収容者。労働の類型: 建設。',
        zh: '囚犯类型：男性、女性、政治犯、短期囚犯。劳动类型：建筑。',
      },
      NOT_YET,
      {
        ko: 'NKDB와 KINU 보고서에 등재돼 있고, 수감자 증언에서도 확인됩니다.',
        ja: 'NKDBとKINUの報告書に記載されており、収容者の証言でも確認されています。',
        zh: '它被列入NKDB和KINU的报告，囚犯证词里也提到了它。',
      },
      NO_MORE,
      {
        ko: '이 수용소와 연결된 두 번째 장소는 Pungho-ri, 40° 1’19.71”N 127° 25’55.91”E에 있습니다. 이 수용소와 연결된 세 번째 장소는 t',
        ja: 'この収容所に結び付く二つ目の場所はPungho-ri、40° 1’19.71”N 127° 25’55.91”Eにあります。この収容所に結び付く三つ目の場所は t',
        zh: '与该营相关的第二处地点在Pungho-ri，40° 1’19.71”N 127° 25’55.91”E。与该营相关的第三处地点是 t',
      },
    ),
    summary: summaryOro,
    overview: {
      ko: '함경남도 오로(지금의 영광군)에 있던 이 교화소는 인근 시설로 통합되며 단계적으로 없어지기 전에 약 1,100명을 수용했습니다.',
      ja: '咸鏡南道のOro（現在の栄光郡）にあったこの矯正収容所は、近隣の施設に統合されて段階的に廃止される前、約1,100人を収容していました。',
      zh: '这座矫正营原先位于咸镜南道Oro（现为荣光郡），在逐步撤销并并入邻近设施之前，关押约1,100人。',
    },
  },
  'kyohwaso-77-danchon': {
    status: REPORTED_CLOSED,
    statusCard: REPORTED_CLOSED,
    note: j(
      summaryDanchon,
      {
        ko: '수감자 유형: 남성, 정치범, 일반 형사범, 국경을 넘은 사람. 노동 유형: 금 채굴.',
        ja: '収容者の類型: 男性、政治犯、通常の刑事犯、国境を越えた人。労働の類型: 金の採掘。',
        zh: '囚犯类型：男性、政治犯、普通刑事犯、越境者。劳动类型：采金。',
      },
      NOT_YET,
      {
        ko: 'NKDB 보고서에 등재돼 있고, 수감자 증언에서도 확인됩니다.',
        ja: 'NKDBの報告書に記載されており、収容者の証言でも確認されています。',
        zh: '它被列入NKDB的报告，囚犯证词里也提到了它。',
      },
      NO_MORE,
      {
        ko: '이 수용소와 연결된 두 번째 장소는 Sa에 있습니다.',
        ja: 'この収容所に結び付く二つ目の場所はSaにあります。',
        zh: '与该营相关的第二处地点在Sa。',
      },
    ),
    summary: summaryDanchon,
    overview: {
      ko: '함경남도 단천 근처에 있었으며, 형벌 체계를 다시 짜는 과정에서 폐지되기 전에 대규모 광물 채굴을 맡았습니다.',
      ja: '咸鏡南道・端川の近くにあり、刑罰制度の再編で廃止される前は、大規模な鉱物採掘を担っていました。',
      zh: '位于咸镜南道端川附近。在刑罚体系调整中被撤销之前，这座设施承担大规模矿产开采。',
    },
  },
};

function englishFields(camp: Camp): CampFields {
  const kwanliso = camp.kind.includes('kwanliso');
  return {
    status: camp.status,
    statusCard: camp.status.replace(/\s*\(per HRNK\)/, ''),
    note: camp.note,
    overview: camp.overview ?? '',
    summary: camp.facts.summary,
    kind: camp.kind,
    kindTag: kwanliso ? 'Political prison camp · kwanliso' : 'Prison · kyohwaso',
    kindShort: kwanliso ? 'Political prison camp' : 'Prison',
    province: camp.province,
  };
}

export function laborLabel(lang: Lang, tag: string): string {
  if (lang === 'en') return tag;
  return LABOR[tag]?.[lang] ?? tag;
}

export function prisonerLabel(lang: Lang, tag: string): string {
  if (lang === 'en') return tag;
  return PRISONERS[tag]?.[lang] ?? tag;
}

export function agencyBits(lang: Lang, agency: string): { value: string; note?: string } {
  if (lang === 'en') {
    return {
      value: agency.replace(/\s*\(.*\)/, '').replace('Ministry of ', ''),
      note: agency.match(/\((.*)\)/)?.[1],
    };
  }
  return AGENCY[lang][agency] ?? { value: agency };
}

export const CAMPS_TEXT: Record<Lang, Chrome> = {
  en: {
    metaTitle: 'North Korea Prison Camps: Kwanliso and Kyohwaso Guide',
    metaDescription:
      'Documented guide to North Korea’s political prison camps (kwanliso) and correctional prisons (kyohwaso): locations, estimated prisoner counts, operating status, and satellite documentation.',
    eyebrow: 'Human rights · Detention',
    h1: 'North Korea’s prison camps',
    lede: 'Two systems. Political prison camps (kwanliso) hold whole families without trial, many for life. Prisons (kyohwaso) hold people sentenced by courts for things like trading, smuggling or trying to escape.',
    statPrisonersValue: '80–120k',
    statPrisoners: 'in political prison camps',
    statPrisonersNote: 'UN COI, 2014',
    statKwanliso: 'kwanliso tracked',
    statKyohwaso: 'kyohwaso tracked',
    openMap: 'Open the intel map',
    howSystem: 'How the system works',
    mapLabel: 'prison camps',
    legendKwanliso: 'Political prison camp',
    legendKyohwaso: 'Prison (kyohwaso)',
    kwanlisoTitle: 'Political prison camps',
    kwanlisoBlurb: 'Run by the secret police (Ministry of State Security). No trial. Three generations of a family can be sent together.',
    kyohwasoTitle: 'Prisons (kyohwaso)',
    kyohwasoBlurb: 'Run by the regular police (Ministry of Social Security). Fixed sentences, but hunger and forced labor kill many before release.',
    crumb: 'Prison camps',
    kindKwanliso: 'Political prison camp (kwanliso)',
    kindKyohwaso: 'Prison (kyohwaso)',
    kindTagKwanliso: 'Political prison camp · kwanliso',
    kindTagKyohwaso: 'Prison · kyohwaso',
    kindShortKwanliso: 'Political prison camp',
    kindShortKyohwaso: 'Prison',
    prisoners: 'prisoners',
    prisonersEstimate: 'HRNK estimate',
    prisonersUnknown: 'no published estimate',
    closed: 'Closed',
    active: 'Active',
    runBy: 'run by',
    openOnMap: 'Open on the intel map',
    county: (name) => `${name} county`,
    howCamps: 'How the camp system works',
    whoHeld: 'Who is held here',
    forcedLabor: 'Forced labor',
    documented: 'How well documented',
    aka: 'Also known as',
    extraOne: 'HRNK ties one more site to this facility.',
    extraMany: (n) => `HRNK ties ${n} more sites to this facility.`,
    crimesTitle: 'Crimes against humanity',
    crimesBody:
      'Whole families are sent to kwanliso without trial under guilt by association (yeonjwa-je). The 2014 UN Commission of Inquiry found these crimes in the political prison camps:',
    whyTitle: 'Why people end up here',
    whyBody:
      'Kyohwaso hold people sentenced through the regular courts. Sentences are set in years, but hunger, beatings and heavy labor kill many before release. Common charges:',
    crimes: ['Extermination', 'Murder', 'Enslavement', 'Torture', 'Imprisonment', 'Rape', 'Forced abortion', 'Persecution', 'Enforced disappearance'],
    offences: ['Illegal trading', 'Smuggling across the border', 'Watching foreign media', 'Trying to escape to China'],
    sources: 'Sources',
    hrnkReport: (year) => `HRNK satellite report${year ? ` (${year})` : ''}`,
    coiSource: 'UN Commission of Inquiry (2014)',
    otherIn: (province) => `Other facilities in ${province}`,
    evidenceAria: 'How well documented this site is',
    evidenceImagery: 'Satellite imagery',
    evidenceReports: 'Listed by NKDB / KINU',
    evidenceTestimony: 'Survivor testimony',
    ogKickerFallback: 'Prison camp',
    ogTitleFallback: 'North Korea prison camps',
    dossierTitle: (name) => `${name}: North Korea Prison Camp Dossier`,
    dossierDescription: (name, kind, status, province, note) => `${name} (${kind}): ${status}. Located in ${province}. ${note}`,
  },
  ko: {
    metaTitle: '북한 수용소: 관리소와 교화소 안내',
    metaDescription: '북한 정치범수용소(관리소)와 교화소의 위치, 추정 수감자 수, 운영 상태, 위성 기록을 정리한 안내입니다.',
    eyebrow: '인권 · 구금',
    h1: '북한의 수용소',
    lede: '두 체계입니다. 정치범수용소(관리소)는 가족 전체를 재판 없이 가둡니다. 많은 사람이 종신입니다. 교화소는 장사, 밀수, 탈북 시도 같은 일로 법원에서 형을 받은 사람을 가둡니다.',
    statPrisonersValue: '8만~12만',
    statPrisoners: '정치범수용소 수감자',
    statPrisonersNote: '유엔 조사위원회, 2014',
    statKwanliso: '추적 중인 관리소',
    statKyohwaso: '추적 중인 교화소',
    openMap: '인텔 지도 열기',
    howSystem: '체계 설명',
    mapLabel: '수용소',
    legendKwanliso: '정치범수용소',
    legendKyohwaso: '교화소',
    kwanlisoTitle: '정치범수용소',
    kwanlisoBlurb: '비밀경찰(국가보위성)이 운영합니다. 재판이 없습니다. 한 가족의 3대가 함께 보내질 수 있습니다.',
    kyohwasoTitle: '교화소',
    kyohwasoBlurb: '일반 경찰(사회안전성)이 운영합니다. 형기는 정해져 있지만, 굶주림과 강제노동으로 출소 전에 죽는 사람이 많습니다.',
    crumb: '수용소',
    kindKwanliso: '정치범수용소 (관리소)',
    kindKyohwaso: '교화소',
    kindTagKwanliso: '정치범수용소 · 관리소',
    kindTagKyohwaso: '교화소',
    kindShortKwanliso: '정치범수용소',
    kindShortKyohwaso: '교화소',
    prisoners: '수감자',
    prisonersEstimate: 'HRNK 추정',
    prisonersUnknown: '발표된 추정치 없음',
    closed: '폐쇄',
    active: '가동',
    runBy: '운영',
    openOnMap: '인텔 지도에서 보기',
    county: (name) => `${name} 군`,
    howCamps: '수용소 체계 설명',
    whoHeld: '수감된 사람',
    forcedLabor: '강제노동',
    documented: '기록의 정도',
    aka: '다른 이름',
    extraOne: 'HRNK는 이 시설과 연결된 장소를 하나 더 짚습니다.',
    extraMany: (n) => `HRNK는 이 시설과 연결된 장소를 ${n}곳 더 짚습니다.`,
    crimesTitle: '인도에 반하는 죄',
    crimesBody: '가족 전체가 재판 없이 연좌제로 관리소에 보내집니다. 2014년 유엔 북한인권조사위원회는 정치범수용소에서 다음 범죄가 이뤄진다고 밝혔습니다.',
    whyTitle: '사람들이 여기 오게 되는 이유',
    whyBody: '교화소에는 일반 법원에서 형을 선고받은 사람이 수감됩니다. 형기는 햇수로 정해지지만, 굶주림과 구타와 힘든 노동으로 출소 전에 죽는 사람이 많습니다. 흔한 혐의는 다음과 같습니다.',
    crimes: ['절멸', '살인', '노예화', '고문', '감금', '강간', '강제 낙태', '박해', '강제실종'],
    offences: ['불법 장사', '국경 밀수', '외국 영상 시청', '중국으로의 탈북 시도'],
    sources: '출처',
    hrnkReport: (year) => `HRNK 위성 보고서${year ? ` (${year})` : ''}`,
    coiSource: '유엔 북한인권조사위원회 (2014)',
    otherIn: (province) => `${province}의 다른 시설`,
    evidenceAria: '이 장소의 기록이 얼마나 확실한가',
    evidenceImagery: '위성사진',
    evidenceReports: 'NKDB·KINU 등재',
    evidenceTestimony: '생존자 증언',
    ogKickerFallback: '수용소',
    ogTitleFallback: '북한 수용소',
    dossierTitle: (name) => `${name}: 북한 수용소 자료`,
    dossierDescription: (name, kind, status, province, note) => `${name} (${kind}): ${status}. ${province}에 있습니다. ${note}`,
  },
  ja: {
    metaTitle: '北朝鮮の収容所：管理所と教化所の案内',
    metaDescription: '北朝鮮の政治犯収容所（管理所）と矯正刑務所（教化所）について、位置、推定収容者数、稼働状況、衛星画像による記録をまとめた案内です。',
    eyebrow: '人権 · 拘禁',
    h1: '北朝鮮の収容所',
    lede: '二つの仕組みです。政治犯収容所（管理所）は、家族全員を裁判なしに収容します。多くの人が終身です。教化所は、商売や密輸、脱出の試みといったことで、裁判所から刑を言い渡された人を収容します。',
    statPrisonersValue: '8万〜12万',
    statPrisoners: '政治犯収容所の収容者',
    statPrisonersNote: '国連調査委員会、2014年',
    statKwanliso: '追跡中の管理所',
    statKyohwaso: '追跡中の教化所',
    openMap: 'インテルマップを開く',
    howSystem: 'この仕組み',
    mapLabel: '収容所',
    legendKwanliso: '政治犯収容所',
    legendKyohwaso: '刑務所（教化所）',
    kwanlisoTitle: '政治犯収容所',
    kwanlisoBlurb: '秘密警察（国家保衛省）が運営します。裁判はありません。一家の3代が一緒に送られることがあります。',
    kyohwasoTitle: '刑務所（教化所）',
    kyohwasoBlurb: '一般警察（社会安全省）が運営します。刑期は決まっていますが、飢えと強制労働で釈放前に亡くなる人が多くいます。',
    crumb: '収容所',
    kindKwanliso: '政治犯収容所（管理所）',
    kindKyohwaso: '刑務所（教化所）',
    kindTagKwanliso: '政治犯収容所 · 管理所',
    kindTagKyohwaso: '刑務所 · 教化所',
    kindShortKwanliso: '政治犯収容所',
    kindShortKyohwaso: '刑務所',
    prisoners: '収容者',
    prisonersEstimate: 'HRNKの推定',
    prisonersUnknown: '公表された推定はない',
    closed: '閉鎖',
    active: '稼働',
    runBy: '運営',
    openOnMap: 'インテルマップで開く',
    county: (name) => `${name}郡`,
    howCamps: '収容所の仕組み',
    whoHeld: 'ここに収容されている人',
    forcedLabor: '強制労働',
    documented: '記録はどの程度確かですか',
    aka: '別名',
    extraOne: 'HRNKは、この施設に結び付く場所をもう1か所挙げています。',
    extraMany: (n) => `HRNKは、この施設に結び付く場所をあと${n}か所挙げています。`,
    crimesTitle: '人道に対する罪',
    crimesBody: '家族全員が、裁判なしに連座制（yeonjwa-je）で管理所へ送られます。2014年の国連調査委員会は、政治犯収容所で次の犯罪が行われていると認定しました。',
    whyTitle: 'なぜここに送られるのか',
    whyBody: '教化所には、通常の裁判所で刑を言い渡された人が収容されます。刑期は年単位で決まりますが、飢え、殴打、重い労働で釈放前に亡くなる人が多くいます。よくある容疑は次のとおりです。',
    crimes: ['絶滅', '殺人', '奴隷化', '拷問', '監禁', '強姦', '強制中絶', '迫害', '強制失踪'],
    offences: ['違法な商売', '国境を越える密輸', '外国メディアの視聴', '中国への脱出の試み'],
    sources: '出典',
    hrnkReport: (year) => `HRNK衛星報告書${year ? `（${year}年）` : ''}`,
    coiSource: '国連調査委員会（2014年）',
    otherIn: (province) => `${province}の他の施設`,
    evidenceAria: 'この場所の記録がどの程度確かですか',
    evidenceImagery: '衛星画像',
    evidenceReports: 'NKDB・KINUへの記載',
    evidenceTestimony: '生存者の証言',
    ogKickerFallback: '収容所',
    ogTitleFallback: '北朝鮮の収容所',
    dossierTitle: (name) => `${name}: 北朝鮮収容所の資料`,
    dossierDescription: (name, kind, status, province, note) => `${name}（${kind}）: ${status}。${province}にあります。${note}`,
  },
  zh: {
    metaTitle: '朝鲜收容所：管理所与教化所指南',
    metaDescription: '关于朝鲜政治犯收容所（管理所）和教化所（矫正监狱）的地点、估计在押人数、运营状态和卫星记录的说明。',
    eyebrow: '人权 · 拘禁',
    h1: '朝鲜的收容所',
    lede: '两套体系。政治犯收容所（管理所）不经审判关押整家人，其中许多人是终身监禁。教化所关押的是被法院判刑的人，比如因为做买卖、走私或试图出逃。',
    statPrisonersValue: '8万~12万',
    statPrisoners: '关押在政治犯收容所的人',
    statPrisonersNote: '联合国调查委员会，2014年',
    statKwanliso: '在追踪的管理所',
    statKyohwaso: '在追踪的教化所',
    openMap: '打开情报地图',
    howSystem: '这套体系如何运作',
    mapLabel: '收容所',
    legendKwanliso: '政治犯收容所',
    legendKyohwaso: '监狱（教化所）',
    kwanlisoTitle: '政治犯收容所',
    kwanlisoBlurb: '由秘密警察（国家保卫省）管理。没有审判。一家人可以三代一起被送进去。',
    kyohwasoTitle: '监狱（教化所）',
    kyohwasoBlurb: '由普通警察（社会安全省）管理。刑期是固定的，但饥饿和强迫劳动让许多人在释放前死去。',
    crumb: '收容所',
    kindKwanliso: '政治犯收容所（管理所）',
    kindKyohwaso: '监狱（教化所）',
    kindTagKwanliso: '政治犯收容所 · 管理所',
    kindTagKyohwaso: '监狱 · 教化所',
    kindShortKwanliso: '政治犯收容所',
    kindShortKyohwaso: '监狱',
    prisoners: '在押人数',
    prisonersEstimate: 'HRNK估计',
    prisonersUnknown: '没有公布的估计',
    closed: '关闭',
    active: '在营',
    runBy: '主管',
    openOnMap: '在情报地图上打开',
    county: (name) => `${name}县`,
    howCamps: '收容所体系如何运作',
    whoHeld: '关押的是什么人',
    forcedLabor: '强迫劳动',
    documented: '记录有多扎实',
    aka: '又名',
    extraOne: 'HRNK还把另一处地点和这处设施连在一起。',
    extraMany: (n) => `HRNK还把另外${n}处地点和这处设施连在一起。`,
    crimesTitle: '危害人类罪',
    crimesBody: '全家会在没有审判的情况下，按连坐制（yeonjwa-je）被送进管理所。2014年联合国调查委员会认定，政治犯收容所里有下列罪行：',
    whyTitle: '人们为什么会被关到这里',
    whyBody: '教化所关押的是普通法院判刑的人。刑期按年计算，但饥饿、殴打和繁重劳动让许多人在释放前死去。常见罪名：',
    crimes: ['灭绝', '谋杀', '奴役', '酷刑', '监禁', '强奸', '强迫堕胎', '迫害', '强迫失踪'],
    offences: ['非法买卖', '越境走私', '收看外国媒体', '试图逃往中国'],
    sources: '来源',
    hrnkReport: (year) => `HRNK卫星报告${year ? `（${year}年）` : ''}`,
    coiSource: '联合国调查委员会（2014年）',
    otherIn: (province) => `${province}的其他设施`,
    evidenceAria: '这个地点的记录有多扎实',
    evidenceImagery: '卫星图像',
    evidenceReports: '列入NKDB / KINU名录',
    evidenceTestimony: '幸存者证词',
    ogKickerFallback: '收容所',
    ogTitleFallback: '朝鲜收容所',
    dossierTitle: (name) => `${name}: 朝鲜收容所档案`,
    dossierDescription: (name, kind, status, province, note) => `${name}（${kind}）：${status}。位于${province}。${note}`,
  },
};

export function campFields(lang: Lang, camp: Camp): CampFields {
  if (lang === 'en') return englishFields(camp);
  const t = CAMPS_TEXT[lang];
  const row = CAMP_COPY[camp.slug];
  if (!row) return englishFields(camp);
  const kwanliso = camp.kind.includes('kwanliso');
  return {
    status: row.status[lang],
    statusCard: row.statusCard[lang],
    note: row.note[lang],
    overview: row.overview[lang],
    summary: row.summary[lang],
    kind: kwanliso ? t.kindKwanliso : t.kindKyohwaso,
    kindTag: kwanliso ? t.kindTagKwanliso : t.kindTagKyohwaso,
    kindShort: kwanliso ? t.kindShortKwanliso : t.kindShortKyohwaso,
    province: PROVINCE[camp.province]?.[lang] ?? camp.province,
  };
}

export function campMetaTitle(lang: Lang, name: string): string {
  return CAMPS_TEXT[lang].dossierTitle(name);
}

export function campMetaDescription(lang: Lang, camp: Camp): string {
  const f = campFields(lang, camp);
  return CAMPS_TEXT[lang].dossierDescription(camp.name, f.kind, f.status, f.province, f.note);
}

export function campOg(lang: Lang, camp: Camp | undefined): { kicker: string; title: string; sub?: string } {
  const t = CAMPS_TEXT[lang];
  if (!camp) return { kicker: t.ogKickerFallback, title: t.ogTitleFallback };
  const f = campFields(lang, camp);
  return { kicker: f.kind, title: camp.name, sub: `${f.province} · ${f.status}` };
}
