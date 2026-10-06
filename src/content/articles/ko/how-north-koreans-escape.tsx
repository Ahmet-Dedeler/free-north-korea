import Link from 'next/link';
import { TrendingDown, UserRound, Users } from 'lucide-react';
import { ArrivalsChart, BorderMap, EscapeRoute, Stats, Tldr } from '@/components/ArticleBlocks';
import { OrgLink, PlaceLink } from '@/components/HoverLinks';
import en from '../how-north-koreans-escape';
import type { Article } from '../types';

const article: Article = {
  slug: en.slug,
  lang: 'ko',
  title: '북한 사람들은 어떻게 탈출할까? 경로, 비용, 위험',
  h1: '북한 사람들은 어떻게 탈출할까',
  description:
    '2026년 북한 탈출 방법: 중국으로 넘어가기, 동남아시아를 거치는 약 4,800km의 경로, 브로커 비용, 강제송환, 그리고 한국 도착까지.',
  teaser: '강을 건너고, 중국에서 숨고, 동남아시아까지 약 4,800km. 그리고 2025년에 왜 224명만 도착했는지.',
  updated: en.updated,
  minutes: 6,
  body: () => (
    <>
      <p className="lede">
        2025년에 한국에 도착한 북한 사람은 224명이다. 코로나 전에는 한 해 1,000명이 넘었고, 2009년에는 거의 3,000명이었다. 그럼 떠나고 싶은
        사람이 줄었을까? 아마 아니다. 국경과 중국 둘 다 훨씬 통과하기 어려워졌다.
      </p>

      <Stats
        items={[
          { icon: TrendingDown, value: '224명', label: '2025년 한국 입국', note: '통일부', tone: 'danger' },
          { icon: UserRound, value: '198명', label: '그중 여성', note: '2025년' },
          { icon: Users, value: '34,538명', label: '누적 입국', note: '2025년 말 기준' },
        ]}
      />

      <EscapeRoute lang="ko" />

      <h2 id="border">1단계: 국경 넘기</h2>
      <p>
        거의 모두가 두만강이나 압록강을 건너 중국으로 나간다. 주로 건너는 곳은 <PlaceLink slug="hyesan">혜산</PlaceLink>,{' '}
        <PlaceLink slug="musan">무산</PlaceLink>, <PlaceLink slug="hoeryong">회령</PlaceLink> 같은 국경 도시 근처다 (
        <Link href="/map">인텔 지도</Link>에도 있다).
      </p>
      <BorderMap lang="ko" />
      <p>
        2020년 이후 북한은 새 철조망을 세우고, 초소를 늘리고, 국경경비대에 사살 명령을 내렸다. 그래서 이제는 경비대에 돈을 쥐여주는 브로커가 사실상
        필수다. 가격은 몇 배로 뛰었다.
      </p>
      <p>바다로, 또는 휴전선을 직접 넘어 탈출하는 경우도 있지만 드물다. 너무 드물어서 뉴스가 되는 거다.</p>

      <h2 id="china">2단계: 중국에서 숨어 지내기</h2>
      <p>
        중국은 북한 사람을 난민이 아니라 불법 경제 이주자로 보고 돌려보낸다. 여성(2025년 224명 중 198명)은 강제 결혼이나 성매매로 인신매매되는
        경우가 많고, 서류 없이 몇 년씩 중국에서 사는 사람도 많다. 안면인식, 버스와 기차의 신분증 검사, 휴대폰 추적 때문에 이제는 그냥 이동하는
        것 자체가 정말 어렵다.
      </p>
      <p>
        잡히면 돌려보내진다. 2023년 10월 중국은 한 번의 작전으로 약 500~600명을 송환했다. 북한으로 돌아가면 심문을 받고, 남한 사람이나 기독교인과
        접촉했던 사람은 <Link href="/ko/learn/north-korea-prison-camps">수용소</Link>로 갈 수 있다.
      </p>

      <h2 id="route">3단계: 멀고 먼 길</h2>
      <p>
        보통 경로는 중국을 가로질러 남쪽으로 약 3,000마일(약 4,800km)을 내려가 동남아시아, 주로 라오스를 거쳐 태국으로 간다. 태국에서는 자수할
        수 있고 결국 한국으로 보내진다 (예전에는 몽골도 하나의 길이었다). 몇 주가 걸린다. 은신처, 버스, 밤에 하는 정글 횡단.{' '}
        <OrgLink lang="ko" id="liberty-in-north-korea">Liberty in North Korea</OrgLink> 같은 구출 단체가 비용을 대는 게 이 부분이고, 1인당 약 3,000달러다.
      </p>

      <h2 id="south-korea">4단계: 한국</h2>
      <p>
        먼저 국가정보원의 조사를 받고, 그다음 정착지원시설 하나원에서 약 3개월 동안 시장경제에서 사는 법을 배운다. 국적을 받고, 주거와 일자리에
        대한 약간의 지원을 받는다.
      </p>
      <p>
        그래도 정말 힘들다. 새로운 기술, 많이 다른 어휘 (한국어에는 영어 단어가 가득하다), 차별, 두고 온 가족.{' '}
        <OrgLink lang="ko" id="fsi">Freedom Speakers International</OrgLink>과 <OrgLink lang="ko" id="pscore">PSCORE</OrgLink> 같은 단체가 영어, 학업, 말하기를 돕는다.
      </p>

      <h2 id="numbers">숫자로 보면</h2>
      <p>막대에 마우스를 올리면 그해 숫자가 나온다. 코로나 국경 봉쇄가 사실상 모든 걸 멈췄고, 그 뒤로 제대로 회복되지 않았다:</p>
      <ArrivalsChart lang="ko" />

      <Tldr
        lang="ko"
        items={[
          '거의 모두가 강을 건너 중국으로 가서 숨었다가, 약 4,800km를 이동해 동남아시아를 거쳐 한국으로 온다.',
          '2025년에 도착한 사람은 224명뿐이다. 2009년 약 3,000명에서 줄었다. 국경과 중국의 감시가 훨씬 심해졌기 때문이다.',
          '구출 1건에 약 3,000달러. 중국에서 잡히면 북한으로 돌려보내진다.',
        ]}
      />
    </>
  ),
  faq: [
    {
      q: '매년 몇 명의 북한 사람이 탈출하나?',
      a: '통일부에 따르면 2025년에 224명이 한국에 도착했다. 코로나 이전 연간 약 1,000명, 2009년 최고치 2,914명보다 훨씬 적다.',
    },
    {
      q: '중국은 왜 탈북민을 돌려보내나?',
      a: '중국은 북한과의 협정에 따라 북한 사람을 난민이 아니라 불법 경제 이주자로 분류한다. 인권 단체와 유엔은 송환된 사람들이 고문과 구금을 당하기 때문에 이것이 강제송환 금지 원칙 위반이라고 말한다.',
    },
    {
      q: '탈북민은 어떤 경로로 오나?',
      a: '대부분 강을 건너 중국으로 가서 숨어 지내다가, 중국을 가로질러 남쪽으로 약 4,800km를 이동해 동남아시아(주로 라오스와 태국)로 가고, 그곳에서 한국으로 이송된다.',
    },
  ],
  sources: en.sources,
};

export default article;
