import Link from 'next/link';
import { Footprints, HandCoins } from 'lucide-react';
import { HelpMenu, OrgActions, Stats, Tldr } from '@/components/ArticleBlocks';
import { OrgLink } from '@/components/HoverLinks';
import en from '../how-to-help-north-koreans';
import type { Article } from '../types';

const article: Article = {
  slug: en.slug,
  lang: 'ko',
  title: '2026년 북한 사람들을 돕는 방법 (실제로 효과 있는 것)',
  h1: '북한 사람들을 돕는 방법',
  description:
    '2026년에 북한 사람들을 돕는 구체적인 방법: 3,000달러 구출 후원, USB 보내기, 온라인으로 탈북민 튜터링, 기록 단체 후원, 정부 압박.',
  teaser: '비용까지 적은, 효과 있는 구체적인 방법. 구출, USB, 탈북민 튜터링, 기록, 정부 압박.',
  updated: en.updated,
  minutes: 6,
  body: () => (
    <>
      <p className="lede">
        노트북 앞에서 북한을 고칠 수는 없다. 그래도 특정한 한 사람을 꺼내고, 특정한 USB 하나를 북한 안에 넣고, 작은 기록 단체 하나를 1년 더
        버티게 할 수는 있다. 그리고 이 일을 하는 단체들은 대부분 아주 작고, 2025년은 오랜만에 최악의 자금난이었다. 그래서 적은 돈이나 시간이
        다른 대의보다 여기서 더 멀리 가는 것 같다.
      </p>

      <HelpMenu lang="ko" />

      <h2 id="rescue">구출 비용 후원 (약 3,000달러)</h2>
      <p>
        탈북하는 사람들은 대부분 먼저 중국으로 넘어간다. 거기서는 법적 신분이 없고, 잡히면 북한으로 돌려보내져 수용소나 그보다 나쁜 일을 겪는다.
        중국 북부에서 동남아시아의 안전한 곳까지는 브로커와 은신처를 거치는 약 3,000마일(약 4,800km)의 여정이다.
      </p>
      <Stats
        items={[
          { icon: HandCoins, value: '약 3,000달러', label: '구출 1건 비용', note: 'Liberty in North Korea' },
          { icon: Footprints, value: '1,400명+', label: 'LiNK가 지금까지 구출한 사람', note: 'LiNK, 2026' },
        ]}
      />
      <p>
        <OrgLink lang="ko" id="liberty-in-north-korea">Liberty in North Korea(LiNK)</OrgLink>가 이 여정 비용을 댄다. 다만 점점 어려워지고 있다. LiNK의 2025년
        보고서에 따르면 중국의 생체인식 검문소와 AI 감시 때문에 모든 경로가 더 느리고 더 비싸졌다.
      </p>
      <OrgActions lang="ko" ids={['liberty-in-north-korea', 'crossing-borders']} />

      <h2 id="information">정보 보내기</h2>
      <p>
        바깥 정보는 북한 사람들이 정부가 거짓말하고 있다는 걸 알게 되는 방법이다.{' '}
        <OrgLink lang="ko" id="flash-drives-for-freedom">Flash Drives for Freedom</OrgLink>(인권재단 HRF 운영)은 기부받은 USB를 초기화하고 영화, 한국어
        위키백과, 뉴스 등을 담아서, 협력 단체가 북한 안으로 들여보낸다. 2026년에도 운영 중이고, 기부·약정된 USB가 14만 개가 넘는다. 안 쓰는 USB
        몇 개 부치는 데 10분 정도 걸린다.
      </p>
      <p>
        라디오도 중요한데, 가장 큰 타격을 입었다. 자유아시아방송 한국어 서비스는 미국 예산이 끊긴 뒤 2025년 7월 문을 닫았고, 한국도 자체 방송을
        끝냈다. <OrgLink lang="ko" id="unification-media-group">국민통일방송(UMG)</OrgLink> 같은 단체는 여전히 방송하고 있고, 도움이 정말 필요하다.
      </p>
      <OrgActions lang="ko" ids={['flash-drives-for-freedom', 'unification-media-group']} />

      <h2 id="escapees">이미 도착한 탈북민 돕기</h2>
      <p>
        2025년 말까지 34,538명의 북한 사람이 한국에 왔다 (그해 도착한 사람은 224명, 대부분 여성). 새로 시작하는 건 어렵다. 같은 언어인데 다른
        말, 영어, 구직, 트라우마, 두고 온 가족.
      </p>
      <p>
        <OrgLink lang="ko" id="fsi">Freedom Speakers International</OrgLink>(옛 TNKR)을 통해 온라인으로 영어를 가르치거나, 서울에서{' '}
        <OrgLink lang="ko" id="pscore">PSCORE</OrgLink> 봉사를 할 수 있다. 영어를 할 줄 알고 일주일에 한 시간을 낼 수 있다면, 할 수 있는 가장 직접적인 일
        중 하나다 (그리고 돕는 사람을 실제로 알게 된다).
      </p>
      <OrgActions lang="ko" ids={['fsi', 'pscore']} />

      <h2 id="evidence">증거 남기기</h2>
      <p>
        언젠가는 아마 재판, 진실위원회, 그리고 무덤을 찾는 가족들이 있을 거다. <OrgLink lang="ko" id="nkdb">NKDB(북한인권정보센터)</OrgLink>,{' '}
        <OrgLink lang="ko" id="tjwg">TJWG(전환기정의워킹그룹)</OrgLink>, <OrgLink lang="ko" id="korea-future">Korea Future</OrgLink> 같은 단체는 지금 탈북민을
        인터뷰하고 감옥과 처형 장소를 지도로 만든다. 그 기록이 필요할 때 존재하도록. 이 중 몇 곳은 2025년에 미국 지원금을 잃었다.
      </p>
      <OrgActions lang="ko" ids={['nkdb', 'tjwg', 'korea-future']} />

      <h2 id="voice">목소리 내기</h2>
      <ul>
        <li>지역 의원에게 대북 방송 예산과 인권 단체 지원 복원을 요구하자.</li>
        <li>중국이 탈북민 강제송환을 멈추도록 압박을 요구하자 (2023년 10월 한 번에만 약 500~600명을 돌려보냈다).</li>
        <li>
          탈북민 이야기와 책을 공유하자 (<Link href="/library">도서관</Link>에 목록이 있다, 영어). 대부분 사람들의 북한 이미지는 밈이라서, 좋은 책
          추천 하나가 생각보다 큰 역할을 한다.
        </li>
      </ul>

      <h2>특별한 기술이 있다면</h2>
      <ul>
        <li>
          <b>개발자와 데이터 하는 사람:</b> 이 사이트는 오픈소스다.{' '}
          <a href="https://github.com/Ahmet-Dedeler/free-north-korea">GitHub</a>에서 데이터를 추가하고, 사실을 고치고, 도구를 만들 수 있다.
        </li>
        <li>
          <b>한국어 할 줄 아는 사람:</b> 번역은 기록 단체와 미디어 프로젝트의 영원한 병목이다.
        </li>
        <li>
          <b>작가와 크리에이터:</b> 북한에 대한 좋은 영어 콘텐츠는 이상할 정도로 드물다. "how to free North Korea"를 검색해 보면 얼마나 적은지 알 수
          있다.
        </li>
      </ul>

      <h2>조심할 것</h2>
      <p>감시 없이 정권을 통해 들어가는 지원, 그리고 실제로 뭘 하는지, 비용이 얼마인지 말 안 하는 단체. 숫자를 물어보자. 좋은 단체는 공개한다.</p>

      <Tldr
        lang="ko"
        items={[
          '가장 싼 방법: Flash Drives for Freedom에 안 쓰는 USB 보내기. 가장 직접적인 방법: 약 3,000달러면 LiNK를 통한 구출 1건.',
          '영어를 할 줄 알면, 일주일에 한 시간 탈북민 튜터링이 진짜 개인적인 도움이 된다.',
          '이 단체들은 작고 2025년에 자금을 많이 잃어서, 적은 금액도 의미가 있다.',
        ]}
      />
    </>
  ),
  faq: [
    {
      q: '탈북민 한 명을 구출하는 데 얼마가 드나?',
      a: 'Liberty in North Korea에 따르면 중국에서 안전한 곳까지 구출하는 데 약 3,000달러가 든다. 이 단체는 지금까지 1,400명 넘게 탈출을 도왔다.',
    },
    {
      q: '북한에 USB를 보낼 수 있나?',
      a: '직접은 안 되지만, 인권재단(HRF) 프로젝트인 Flash Drives for Freedom에 쓰던 USB를 우편으로 보낼 수 있다. 이들이 USB를 초기화하고 바깥 콘텐츠를 담으면 협력 단체가 북한에 들여보낸다.',
    },
    {
      q: '한국에 사는 탈북민은 몇 명인가?',
      a: '약 3만 4,500명이다. 통일부는 2025년 말까지 누적 34,538명이 입국했다고 집계했고, 그중 224명이 2025년에 왔다.',
    },
  ],
  sources: en.sources,
};

export default article;
