import MapExplorer from '@/map/Explorer';
import { pageMeta } from '@/site/seo';

export const metadata = pageMeta({
  title: 'North Korea Map: Prison Camps, Detention Sites, Missile Bases',
  description:
    'Interactive intel map of North Korea: political prison camps, 190+ detention and secret police facilities, missile bases, markets, population and 3,600 documented human rights abuses by county.',
  path: '/map',
});

export default function Page() {
  return <MapExplorer />;
}
