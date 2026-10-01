import MissileExplorer from '@/missiles/Explorer';
import { pageMeta } from '@/site/seo';

export const metadata = pageMeta({
  title: 'North Korea Missile Tests Map (1984–2026)',
  description:
    'Every known North Korean ballistic missile and space launch test since 1984 on an interactive map: ICBMs, IRBMs, SLBMs, hypersonic glide vehicles, flight paths and outcomes.',
  path: '/missiles',
});

export default function Page() {
  return <MissileExplorer />;
}
