import Link from 'next/link';
import { Lock, MapPin, ShieldAlert, Users } from 'lucide-react';
import { Books, CampGrid, Compare, OrgNotes, Stats, Tldr } from '@/components/ArticleBlocks';
import { OrgLink } from '@/components/HoverLinks';
import { getAllCamps } from '@/content/camps';
import en from '../north-korea-prison-camps';
import type { Article } from '../types';

const article: Article = {
  slug: en.slug,
  lang: 'ko',
  title: '북한 정치범수용소: 어디에 있고 무슨 일이 일어나나',
  h1: '북한의 정치범수용소',
  description:
    '북한 정치범수용소(관리소)에는 약 8만~12만 명이 수감된 것으로 추정됐다(유엔, 2014). 알려진 수용소 지도, 사람들이 끌려가는 이유, 그리고 누가 기록하는지.',
  teaser: '관리소 체계: 수용소가 어디에 있는지, 왜 가족 전체가 끌려가는지, 위성사진과 생존자들이 보여주는 것.',
  updated: en.updated,
  minutes: 7,
  body: () => (
    <>
      <p className="lede">
        북한은 관리소라고 불리는 정치범수용소를 운영한다. 2014년 유엔 북한인권조사위원회는 8만~12만 명이 수감돼 있다고 추정했고, 그 안에서 일어나는
        일이 인도에 반하는 죄(절멸, 살인, 노예화, 고문, 강간, 강제 낙태)에 해당한다고 결론 내렸다. 북한은 수용소가 없다고 한다. 위성사진으로 보면
        보인다.
      </p>

      <Stats
        items={[
          { icon: Users, value: '8만~12만', label: '정치범수용소 수감자', note: '유엔 추정, 2014년', tone: 'danger' },
          { icon: MapPin, value: String(getAllCamps().length), label: '이 사이트가 추적하는 시설', note: '/camps 참고' },
        ]}
      />

      <h2>두 종류의 수용소</h2>
      <Compare
        items={[
          {
            icon: ShieldAlert,
            title: '관리소: 정치범수용소',
            tone: 'danger',
            children: (
              <p>
                국가가 적으로 부르는 사람들, 그리고 많은 경우 그 가족 전체를 위한 곳. 상당수는 아무도 풀려나지 않는 "완전통제구역"이다. 수감자들은
                굶주림 수준의 배급을 받으며 탄광, 벌목, 농사, 공장 노동을 한다.
              </p>
            ),
          },
          {
            icon: Lock,
            title: '교화소: "재교육" 감옥',
            tone: 'warn',
            children: (
              <p>
                한국 TV 시청, 허가 없는 장사, 탈북 시도 같은 죄로 유죄를 받은 사람들을 위한 곳. 형기는 끝이 있지만, 생존자들은 정치범수용소와 꽤
                비슷하게 들리는 강제노동과 사망률을 증언한다.
              </p>
            ),
          },
        ]}
      />
      <p>그 위에 단기 구금·심문 시설이 있다. 중국에서 송환된 사람들이 보통 먼저 가는 곳이다.</p>

      <h2>사람들은 어떻게 끌려가나?</h2>
      <p>
        지도자 모욕, 종교 활동, 남한 사람과의 접촉, 아니면 그냥 그런 일을 한 사람의 친척이라는 이유. 연좌제에 따라 정권은 "범죄자"의 부모, 자녀,
        형제자매까지 수용소에 보냈다. 『14호 수용소 탈출』의 주인공 신동혁은 수용소 안에서 태어났다고 말한다.
      </p>

      <h2>알려진 수용소</h2>
      <p>
        이 수용소들은 모두 대략적인 위치와 함께 <Link href="/map">인텔 지도</Link>에 있다. 상태는 위성 분석과 탈북민 증언을 바탕으로 해서, 현실보다
        몇 달에서 몇 년 늦을 수 있다 (이 점은 기억해 두자). 아래 카드는 영어다.
      </p>
      <CampGrid lang="ko" slugs={['kwanliso-14', 'kwanliso-15', 'kwanliso-16', 'kwanliso-18', 'kwanliso-22', 'kwanliso-25', 'kyohwaso-1-kaechon', 'kyohwaso-12-chongori']} />
      <p>
        추적 중인 시설 {getAllCamps().length}곳 전체는 <Link href="/camps">수용소 페이지</Link>(영어)에 있다.
      </p>
      <p>
        나아지고 있을까? 말하기 어렵다. <OrgLink lang="ko" id="tjwg">전환기정의워킹그룹(TJWG)</OrgLink> 같은 연구자들은 김정은 시대에 정치범수용소 인원은
        줄고 일반 감옥은 늘어난 징후를 본다. 하지만 유엔의 2025년 보고서는 2014년 이후 10년 동안 전체적인 탄압이 나아진 게 아니라 더 나빠졌다고
        봤다.
      </p>

      <h2>누가 기록하나</h2>
      <OrgNotes lang="ko"
        items={[
          { id: 'hrnk', note: <>개별 수용소의 위성사진 분석을 발표한다 (『숨겨진 수용소(Hidden Gulag)』 보고서가 표준 참고 자료다).</> },
          { id: 'nkdb', note: '수만 건의 증언으로 만든 인권 침해 데이터베이스와 구금시설 데이터베이스를 운영한다.' },
          { id: 'korea-future', note: '가해자 이름까지 밝히며 형벌 체계를 사건별로 기록한다.' },
          { id: 'tjwg', note: '미래의 책임 규명을 위해 처형지와 매장지를 지도로 만든다.' },
        ]}
      />

      <h2>읽을거리</h2>
      <p>
        『평양의 수족관』(강철환, 9살에 요덕에 보내졌다)과 『14호 수용소 탈출』(블레인 하든)이 가장 잘 알려진 직접 증언이다. 신동혁은 나중에
        이야기 일부를 바꿨지만, 그가 말한 핵심은 다른 증언과 일치한다. 더 많은 책은 <Link href="/library">도서관</Link>(영어)에 있다.
      </p>
      <Books titles={['The Aquariums of Pyongyang', 'Escape from Camp 14', 'Eyes of the Tailless Animals: Prison Memoirs of a North Korean Woman', 'Long Road Home: Testimony of a North Korean Camp Survivor']} />

      <Tldr
        lang="ko"
        items={[
          '유엔은 2014년 정치범수용소 수감자를 8만~12만 명으로 추정했고, 그 안의 일을 인도에 반하는 죄라고 불렀다.',
          '한 사람의 "죄" 때문에 가족 전체가, 때로는 3대가 끌려간다.',
          '수용소는 위성사진에 보이고, HRNK, NKDB, TJWG 같은 단체가 나중을 위해 기록을 남기고 있다.',
        ]}
      />
    </>
  ),
  faq: [
    {
      q: '북한 수용소에는 몇 명이 있나?',
      a: '유엔 북한인권조사위원회는 2014년 정치범수용소(관리소)에 8만~12만 명이 수감돼 있다고 추정했다. 그보다 훨씬 많은 사람이 일반 감옥과 구금시설을 거친다. 최근의 정확한 집계는 없다.',
    },
    {
      q: '북한 수용소는 아직 운영 중인가?',
      a: '그렇다. 위성사진으로 보면 14호(개천), 16호(화성), 25호(청진) 등 여러 정치범수용소가 여전히 가동 중이다. 22호(회령) 같은 일부 옛 수용소는 폐쇄됐다.',
    },
    {
      q: '왜 가족까지 수용소에 보내나?',
      a: '연좌제 때문에 정치범으로 몰린 사람의 친척도, 때로는 3대에 걸쳐 수감될 수 있다. 이 때문에 저항의 대가가 엄청나게 크다.',
    },
  ],
  sources: en.sources,
};

export default article;
