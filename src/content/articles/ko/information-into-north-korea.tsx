import Link from 'next/link';
import { Channels, OrgActions, Timeline, Tldr } from '@/components/ArticleBlocks';
import { OrgLink } from '@/components/HoverLinks';
import en from '../information-into-north-korea';
import type { Article } from '../types';

const article: Article = {
  slug: en.slug,
  lang: 'ko',
  title: '북한에 바깥 정보는 어떻게 들어갈까: USB, 라디오, 풍선',
  h1: '북한에 바깥 정보는 어떻게 들어갈까',
  description:
    'USB, SD카드, 라디오, 풍선: 외국 영상이 북한 사람들에게 닿는 방법, 2025년 예산 삭감 이후 바뀐 것, 그리고 돕는 방법.',
  teaser: 'USB, SD카드, 단파 라디오, 풍선. 2025년 삭감 이후에도 통하는 것과 돕는 방법.',
  updated: en.updated,
  minutes: 6,
  body: () => (
    <>
      <p className="lede">
        북한 사람 2,600만 명 대부분은 다른 곳의 삶이 어떤지 잘 모른다. 내 생각엔 그게 어떤 미사일보다 정권을 더 오래 살려두는 것 같다. 바깥
        정보를 들여보내는 모든 통로가 그걸 조금씩 깎아내고, 이건 바깥의 평범한 사람들이 직접 도울 수 있는 유일한 영역이다.
      </p>

      <Channels lang="ko" />

      <h2 id="usb">USB와 SD카드</h2>
      <p>
        지금은 이게 주요 통로다. 많은 가정에 "노텔"(값싼 중국산 미디어 플레이어)이나 SD·마이크로SD 카드를 읽는 휴대폰이 있다. USB는 중국 국경의
        상인을 통해 화물에 숨겨져 들어오고, 그다음 복사돼서 손에서 손으로 전해진다. 마이크로SD 카드는 작고 싸고 숨기기 쉬워서 (삼킬 수도 있다)
        단체들이 그쪽으로 바꿨다.
      </p>
      <p>
        뭐가 들어 있을까? 대부분 한국 드라마와 영화, K팝, 뉴스, 한국어 위키백과, 탈북민 증언이다. 누가 설교할 필요가 없다. 서울의 평범한 저녁을
        보는 것만으로 충분하다.
      </p>
      <p>
        <OrgLink lang="ko" id="flash-drives-for-freedom">Flash Drives for Freedom</OrgLink>(인권재단 HRF)은 기부받은 USB를 모으고, 지금까지 14만 개 넘게
        기부·약정됐다고 한다. 2026년에도 운영 중이다 (멈춘 줄 아는 사람이 많다).
      </p>

      <h2 id="radio">라디오</h2>
      <p>
        공식 라디오는 국영 채널에 고정돼 있지만, 개조하거나 밀수한 라디오로는 밤에 단파와 중파 방송을 들을 수 있다. 그리고 이게 2025년에 가장
        많이 잘린 통로다. 자유아시아방송 한국어 서비스는 미국 지원금이 끊긴 뒤 2025년 7월 17일 문을 닫았고, 미국의소리(VOA)는 대폭 축소됐고, 한국의
        새 정부는 2025년 6월 자체 대북 방송과 확성기를 중단했다. 그래서{' '}
        <OrgLink lang="ko" id="unification-media-group">국민통일방송(UMG)</OrgLink> 같은 민간 방송이 이제 남은 것 중 훨씬 큰 비중을 차지한다.
      </p>

      <h2 id="balloons">풍선</h2>
      <p>
        한국의 활동가들은 수십 년 동안 전단, USB, 달러, 쌀을 담은 풍선을 휴전선 너머로 띄웠다. 2024년 북한은 수천 개의 오물 풍선으로 맞섰다.
        2025년 한국 정부는 활동가들에게 중단을 요청하고 살포 금지를 집행하기 시작했고, 대부분의 단체가 멈췄다. 풍선은 가장 눈에 띄는 방법이지만,
        아마 가장 효과적인 방법은 아니다.
      </p>

      <h2>북한 사람들이 치르는 대가</h2>
      <p>크다. 정권은 바로 이걸 막는 법을 계속 늘리고 있다:</p>
      <Timeline
        items={[
          { date: '2020년 12월', title: '반동사상문화배격법', text: '한국 영상을 보거나 갖고 있으면 5~10년 노동교화형, "엄중한" 경우 그 이상. 대량으로 퍼뜨리면 사형.', tone: 'danger' },
          { date: '2022년 8월', title: '같은 법 개정', text: '2년 뒤 더 강화됐다.' },
          { date: '2023년 1월', title: '평양문화어보호법', text: '남한식 말투(속어, 표현)를 쓰는 것을 범죄로 규정하고, 최고 사형까지 가능하다.', tone: 'danger' },
          { date: '2025년', title: '유엔 보고서가 처형을 확인', text: '외국 영상을 유포했다는 이유로 처형된 사람들이 있었다.', tone: 'danger' },
        ]}
      />
      <p>그래도 사람들은 한다. 그만큼 원한다는 뜻인 것 같다.</p>

      <h2>돕는 방법</h2>
      <OrgActions lang="ko" ids={['flash-drives-for-freedom', 'unification-media-group', 'daily-nk']} />
      <ul>
        <li>
          안 쓰는 USB나 마이크로SD 카드를 <a href="https://flashdrivesforfreedom.org/">Flash Drives for Freedom</a>에 보내자.
        </li>
        <li>
          콘텐츠를 만들고 들여보내는 단체에 기부하자 (<Link href="/organizations">단체 목록</Link>의 정보 분야, 영어).
        </li>
        <li>정부에 한국어 대북 방송 예산 복원을 요구하자.</li>
      </ul>

      <Tldr
        lang="ko"
        items={[
          '지금 주요 통로는 USB와 마이크로SD 카드다. 라디오는 2025년에 크게 잘렸고, 풍선은 대부분 멈췄다.',
          '한국 영상을 보면 5~10년 노동교화형, 대량으로 퍼뜨리면 사형까지 가능한데도 사람들은 본다.',
          '가장 쉬운 방법: 안 쓰는 USB를 Flash Drives for Freedom에 보내기.',
        ]}
      />
    </>
  ),
  faq: [
    {
      q: 'Flash Drives for Freedom은 아직 운영 중인가?',
      a: '그렇다. 인권재단(HRF)의 이 프로젝트는 2026년에도 USB를 모으고 있고, 14만 개 넘게 기부·약정됐다고 밝혔다.',
    },
    {
      q: '외국 영상을 갖고 있다가 걸린 북한 사람은 어떻게 되나?',
      a: '2020년 반동사상문화배격법에 따르면 한국 영상을 보거나 갖고 있으면 5~10년 노동교화형(엄중한 경우 그 이상)을 받을 수 있고, 대량으로 유포하면 사형까지 가능하다. 2025년 유엔 보고서는 무단 영상 유포로 인한 처형을 기록했다.',
    },
    {
      q: '대북 라디오 방송은 멈췄나?',
      a: '많이 멈췄다. 자유아시아방송 한국어 서비스는 미국 예산 삭감 후 2025년 7월 중단됐고, 한국은 2025년 6월 정부 대북 방송과 국경 확성기를 끝냈다. 일부 민간 방송은 계속되고 있다.',
    },
  ],
  sources: en.sources,
};

export default article;
