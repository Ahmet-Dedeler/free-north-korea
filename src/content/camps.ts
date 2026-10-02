import { readFileSync } from 'node:fs';
import path from 'node:path';

export interface Camp {
  id: string;
  slug: string;
  aliases: string[];
  name: string;
  koreanName?: string;
  province: string;
  countyCode: string | null;
  kind: 'Political prison camp (kwanliso)' | 'Prison (kyohwaso)';
  prisoners: number | null;
  status: string;
  lat: number;
  lon: number;
  note: string;
  agency: string;
  sources: { name: string; url: string }[];
  more?: string;
  overview?: string;
}

interface CampMeta {
  slug: string;
  aliases: string[];
  koreanName: string;
  agency: string;
  overview: string;
}

const META: Record<string, CampMeta> = {
  'camp-0': {
    slug: 'kwanliso-14',
    aliases: ['camp-14', 'camp-14-kaechon', 'kaechon-internment-camp'],
    koreanName: '14호 개천 관리소',
    agency: 'Ministry of State Security (Bowibu)',
    overview:
      'Camp 14 is a "Total Control Zone" (wanjeon tongje-guyeok) political prison camp situated along the Taedong River in Kaechon, South Pyongan Province. Inmates sentenced to total control zones are never released, and multiple generations of families are held under guilt-by-association (yeonjwa-je). Former prisoner Shin Dong-hyuk gave detailed testimony of being born inside Camp 14 before escaping in 2005.',
  },
  'camp-1': {
    slug: 'kwanliso-25',
    aliases: ['camp-25', 'camp-25-chongjin', 'chongjin-concentration-camp'],
    koreanName: '25호 청진 관리소',
    agency: 'Ministry of State Security (Bowibu)',
    overview:
      'Camp 25 is located inside the urban area of Chongjin, North Hamgyong Province. Satellite imagery analyzed by HRNK and CSIS shows significant expansions of guard posts, perimeter walls, and agricultural workshops during the 2010s. Unlike mountain valley camps, Camp 25 operates within city limits and holds political prisoners performing forced manufacturing and agriculture.',
  },
  'camp-2': {
    slug: 'kwanliso-15',
    aliases: ['camp-15', 'yodok', 'camp-15-yodok', 'yodok-concentration-camp'],
    koreanName: '15호 요덕 관리소',
    agency: 'Ministry of State Security (Bowibu)',
    overview:
      'Camp 15 in Yodok County, South Hamgyong Province, is the most internationally documented North Korean political prison camp. It uniquely contained both a Total Control Zone and a "Revolutionizing Zone" (hyeokmyeonghwa guyeok) where prisoners could theoretically be released after ideological remolding. Prominent escapees Kang Chol-hwan (author of The Aquariums of Pyongyang) and An Hyuk were released from Yodok after serving sentences.',
  },
  'camp-3': {
    slug: 'kwanliso-16',
    aliases: ['camp-16', 'camp-16-hwasong', 'hwasong-concentration-camp', 'hwasong'],
    koreanName: '16호 화성 관리소',
    agency: 'Ministry of State Security (Bowibu)',
    overview:
      'Camp 16 in Hwasong County, North Hamgyong Province, covers approximately 560 square kilometers, making it the geographically largest known detention facility in North Korea. Located in high mountain valleys near the Punggye-ri nuclear test site, satellite imagery indicates active forestry, agriculture, and mining operations staffed by an estimated 20,000 political prisoners.',
  },
  'camp-4': {
    slug: 'kwanliso-22',
    aliases: ['camp-22', 'camp-22-hoeryong', 'hoeryong-concentration-camp', 'hoeryong'],
    koreanName: '22호 회령 관리소',
    agency: 'Ministry of State Security (Bowibu)',
    overview:
      'Camp 22 was a massive total control camp in Hoeryong, North Hamgyong Province, holding an estimated 50,000 prisoners across hundreds of square kilometers. Testimonies from former guard Ahn Myong-chol documented systemic torture, forced abortion, and starvation rations. Satellite surveillance confirmed the camp was shuttered around 2012, though the fate of remaining prisoners remains unknown.',
  },
  'camp-5': {
    slug: 'kwanliso-18',
    aliases: ['camp-18', 'camp-18-pukchang', 'pukchang-concentration-camp', 'pukchang'],
    koreanName: '18호 북창 관리소',
    agency: 'Ministry of Social Security (Police)',
    overview:
      'Camp 18 is located in Pukchang County, directly across the Taedong River from Camp 14. Historically operated by the regular police (Ministry of Social Security) rather than secret police, it forced tens of thousands of prisoners into dangerous coal extraction for the Pukchang thermal power plant. Former prisoner Kim Yong provided comprehensive testimony after escaping.',
  },
  'camp-6': {
    slug: 'kyohwaso-8-yongdam',
    aliases: ['kyohwaso-8', 'yongdam-kyohwaso'],
    koreanName: '8호 용담 교화소',
    agency: 'Ministry of Social Security',
    overview:
      'Kyohwaso No. 8 is a long-term correctional prison located near Yongdam in Kangwon Province. Inmates are convicted of economic crimes, unauthorized travel, or cross-border communication, and are subjected to forced labor in agriculture and quarrying under severe nutrition deficits.',
  },
  'camp-7': {
    slug: 'kyohwaso-11-chungsan',
    aliases: ['kyohwaso-11', 'chungsan-kyohwaso'],
    koreanName: '11호 증산 교화소',
    agency: 'Ministry of Social Security',
    overview:
      'Kyohwaso No. 11 in Chungsan County, South Pyongan Province, operates extensive coastal salt fields and farming brigades. Testimonies documented by the UN Commission of Inquiry describe extreme physical exhaustion, severe water contamination, and high fatality rates among prisoners assigned to salt production.',
  },
  'camp-8': {
    slug: 'kyohwaso-7-kanggye',
    aliases: ['kyohwaso-7', 'kanggye-kyohwaso'],
    koreanName: '7호 강계 교화소',
    agency: 'Ministry of Social Security',
    overview:
      'Located in the mountainous interior of Kanggye, Jagang Province, Kyohwaso No. 7 houses prisoners assigned to heavy industrial production and mining supporting defense supply infrastructure in the northern military zone.',
  },
  'camp-9': {
    slug: 'kyohwaso-2-dongrim',
    aliases: ['kyohwaso-2', 'dongrim-kyohwaso'],
    koreanName: '2호 동림 교화소',
    agency: 'Ministry of Social Security',
    overview:
      'Kyohwaso No. 2 in Dongrim County, North Pyongan Province, is a correctional labor facility near the western coast where inmates perform light industrial manufacturing, textiles, and woodcraft.',
  },
  'camp-10': {
    slug: 'kyohwaso-88-wonsan',
    aliases: ['kyohwaso-88', 'wonsan-kyohwaso'],
    koreanName: '88호 원산 교화소',
    agency: 'Ministry of Social Security',
    overview:
      'Located in the port city of Wonsan, Kangwon Province, Kyohwaso No. 88 is an active correctional labor camp supporting harbor maintenance, construction, and coastal industry.',
  },
  'camp-11': {
    slug: 'kyohwaso-9-hamhung',
    aliases: ['kyohwaso-9', 'hamhung-kyohwaso'],
    koreanName: '9호 함흥 교화소',
    agency: 'Ministry of Social Security',
    overview:
      'Kyohwaso No. 9 in Hamhung, South Hamgyong Province, is located in North Korea’s primary chemical and manufacturing hub. Inmates perform forced labor in toxic chemical processing and regional plant maintenance.',
  },
  'camp-12': {
    slug: 'sunchon-kyohwaso',
    aliases: ['kyohwaso-sunchon'],
    koreanName: '순천 교화소',
    agency: 'Ministry of Social Security',
    overview:
      'Sunchon Prison in South Pyongan Province is an operational correctional facility centered on limestone quarrying, cement production, and chemical plant labor.',
  },
  'camp-13': {
    slug: 'kyohwaso-8-sunghori',
    aliases: ['sunghori-kyohwaso'],
    koreanName: '8호 승호리 교화소',
    agency: 'Ministry of Social Security',
    overview:
      'Situated in Sungho District, east of Pyongyang, this correctional camp is situated close to the capital and has historically been used for prisoners convicted of administrative infractions and political sensitivity.',
  },
  'camp-14': {
    slug: 'facility-at-i-gol',
    aliases: ['i-gol'],
    koreanName: '이골 수용 시설',
    agency: 'Ministry of State Security',
    overview:
      'I-gol is a restricted security compound identified in South Hamgyong Province. Satellite surveillance demonstrates high-security fencing and perimeter guard towers consistent with state security detention centers.',
  },
  'camp-15': {
    slug: 'facility-at-udan',
    aliases: ['udan'],
    koreanName: '우단 수용 시설',
    agency: 'Ministry of State Security',
    overview:
      'Udan is an isolated mountain facility in North Hamgyong Province tracked by human rights analysts for suspected political detention and state security operations.',
  },
  'camp-16': {
    slug: 'choma-bong-restricted-area',
    aliases: ['choma-bong'],
    koreanName: '처마봉 통제구역',
    agency: 'Ministry of State Security',
    overview:
      'The Ch’oma-bong Restricted Area in South Pyongan Province encompasses an isolated mountain enclave restricted from general civilian entry and guarded by dedicated sentries.',
  },
  'camp-17': {
    slug: 'kyohwaso-3-sinuiju',
    aliases: ['kyohwaso-3', 'sinuiju-kyohwaso'],
    koreanName: '3호 신의주 교화소',
    agency: 'Ministry of Social Security',
    overview:
      'Located in Sinuiju, North Pyongan Province, across from Dandong, China, Kyohwaso No. 3 holds approximately 2,500 prisoners. Because of its proximity to the border, it houses many defectors intercepted along the Yalu River prior to trial.',
  },
  'camp-18': {
    slug: 'kyohwaso-1-kaechon',
    aliases: ['kyohwaso-1', 'kaechon-kyohwaso'],
    koreanName: '1호 개천 교화소',
    agency: 'Ministry of Social Security',
    overview:
      'Kyohwaso No. 1 in Kaechon holds roughly 4,000 prisoners and was documented in detail by survivor Soon Ok Lee (author of Eyes of the Tailless Animals). Prisoners work in textile and leather shoe manufacturing under rigorous production quotas.',
  },
  'camp-19': {
    slug: 'kyohwaso-4-kangdong',
    aliases: ['kyohwaso-4', 'kangdong-kyohwaso'],
    koreanName: '4호 강동 교화소',
    agency: 'Ministry of Social Security',
    overview:
      'Kyohwaso No. 4 in Kangdong County, east of Pyongyang, houses approximately 1,000 inmates engaged in glassmaking, pottery, and ceramic manufacturing under armed supervision.',
  },
  'camp-20': {
    slug: 'kyohwaso-12-chongori',
    aliases: ['kyohwaso-12', 'chongori-kyohwaso', 'chongori'],
    koreanName: '12호 전거리 교화소',
    agency: 'Ministry of Social Security',
    overview:
      'Kyohwaso No. 12 at Chongori, Hoeryong, North Hamgyong Province, is the principal prison where North Koreans forcibly repatriated from China are sent. The UN Commission of Inquiry documented severe abuses, including routine torture, fatal beatings, forced abortions, and starvation. Activist Jihyun Park survived imprisonment here before escaping a second time.',
  },
  'camp-21': {
    slug: 'kyohwaso-6-sariwon',
    aliases: ['kyohwaso-6', 'sariwon-kyohwaso'],
    koreanName: '6호 사리원 교화소',
    agency: 'Ministry of Social Security',
    overview:
      'Located in Sariwon, North Hwanghae Province, Kyohwaso No. 6 holds roughly 3,000 inmates working in cement manufacturing, agricultural farming, and masonry.',
  },
  'camp-22': {
    slug: 'kyohwaso-22-oro',
    aliases: ['kyohwaso-22', 'oro-kyohwaso'],
    koreanName: '22호 영광(오로) 교화소',
    agency: 'Ministry of Social Security',
    overview:
      'Formerly situated in Oro (now Yonggwang County), South Hamgyong Province, this correctional camp held approximately 1,100 prisoners before being phased out and consolidated into neighboring facilities.',
  },
  'camp-23': {
    slug: 'kyohwaso-77-danchon',
    aliases: ['kyohwaso-77', 'danchon-kyohwaso'],
    koreanName: '77호 단천 교화소',
    agency: 'Ministry of Social Security',
    overview:
      'Located near Danchon in South Hamgyong Province, this facility supported heavy mineral mining before being decommissioned in structural penal reorganizations.',
  },
};

let cachedCamps: Camp[] | null = null;

export function getAllCamps(): Camp[] {
  if (cachedCamps) return cachedCamps;
  const filePath = path.join(process.cwd(), 'public/layers/camps.geojson');
  const raw = JSON.parse(readFileSync(filePath, 'utf8'));

  cachedCamps = raw.features.map((f: any) => {
    const p = f.properties;
    const [lon, lat] = f.geometry.coordinates;
    const meta = META[p.id] ?? {
      slug: p.id,
      aliases: [],
      koreanName: '',
      agency: p.kind.includes('kwanliso') ? 'Ministry of State Security' : 'Ministry of Social Security',
      overview: p.note ?? '',
    };
    let sources: { name: string; url: string }[] = [];
    try {
      sources = typeof p.sources === 'string' ? JSON.parse(p.sources) : p.sources ?? [];
    } catch {
      sources = [];
    }

    return {
      id: p.id,
      slug: meta.slug,
      aliases: meta.aliases,
      name: p.name,
      koreanName: meta.koreanName,
      province: p.province ?? '',
      countyCode: p.county ?? null,
      kind: p.kind,
      prisoners: p.prisoners ?? null,
      status: p.status,
      lat,
      lon,
      note: p.note ?? '',
      agency: meta.agency,
      sources,
      more: p.more,
      overview: meta.overview,
    };
  });

  return cachedCamps!;
}

export function getCampBySlug(slug: string): Camp | undefined {
  const camps = getAllCamps();
  const lower = slug.toLowerCase();
  return camps.find((c) => c.slug === lower || c.id === lower || c.aliases.map((a) => a.toLowerCase()).includes(lower));
}

export function getAllCampSlugs(): string[] {
  const camps = getAllCamps();
  const slugs: string[] = [];
  for (const c of camps) {
    slugs.push(c.slug);
    for (const a of c.aliases) {
      if (!slugs.includes(a)) slugs.push(a);
    }
  }
  return slugs;
}
