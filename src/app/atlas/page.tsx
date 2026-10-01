import AtlasExplorer from '@/atlas/AtlasExplorer';
import { pageMeta } from '@/site/seo';

export const metadata = pageMeta({
  title: 'North Korea Map: Prison Camps, Nuclear Sites, Escape Routes',
  description:
    'Interactive map of North Korea: political prison camps, Yongbyon and other nuclear sites, missile launch facilities, border crossings and the escape route to Southeast Asia.',
  path: '/atlas',
});

export default function Page() {
  return <AtlasExplorer />;
}
