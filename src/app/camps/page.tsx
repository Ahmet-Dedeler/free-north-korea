import Link from 'next/link';
import { BookOpen, Lock, MapPin, ShieldAlert, Users } from 'lucide-react';
import CampCard from '@/components/CampCard';
import Locator from '@/components/Locator';
import { StatTile } from '@/components/Visual';
import { getAllCamps } from '@/content/camps';
import { pageMeta } from '@/site/seo';

export const metadata = pageMeta({
  title: 'North Korea Prison Camps: Kwanliso and Kyohwaso Guide',
  description:
    'Documented guide to North Korea’s political prison camps (kwanliso) and correctional prisons (kyohwaso): locations, estimated prisoner counts, operating status, and satellite documentation.',
  path: '/camps',
});

export default function CampsIndex() {
  const camps = getAllCamps();
  const kwanliso = camps.filter((c) => c.kind.includes('kwanliso'));
  const kyohwaso = camps.filter((c) => !c.kind.includes('kwanliso'));

  const pins = camps.map((c) => ({
    lat: c.lat,
    lon: c.lon,
    title: c.name,
    href: `/camps/${c.slug}`,
    color: c.kind.includes('kwanliso') ? '#dc2626' : '#ea580c',
    r: c.kind.includes('kwanliso') ? 8 : 6,
  }));

  return (
    <div className="wide">
      <div className="index-hero">
        <div>
          <p className="eyebrow">Human rights · Detention</p>
          <h1>North Korea’s prison camps</h1>
          <p className="lede">
            Two systems. Political prison camps (kwanliso) hold whole families without trial, many for life. Prisons (kyohwaso) hold people
            sentenced by courts for things like trading, smuggling or trying to escape.
          </p>
          <div className="tiles">
            <StatTile icon={Users} value="80–120k" label="in political prison camps" note="UN COI, 2014" tone="danger" />
            <StatTile icon={ShieldAlert} value={kwanliso.length} label="kwanliso tracked" />
            <StatTile icon={Lock} value={kyohwaso.length} label="kyohwaso tracked" />
          </div>
          <p className="dx-actions">
            <Link href="/map#camps=camp-0" className="btn primary">
              <MapPin size={15} /> Open the intel map
            </Link>
            <Link href="/learn/north-korea-prison-camps" className="btn">
              <BookOpen size={15} /> How the system works
            </Link>
          </p>
        </div>
        <figure className="index-map">
          <Locator pins={pins} label="prison camps" />
          <figcaption className="key">
            <span>
              <i style={{ background: '#dc2626' }} /> Political prison camp
            </span>
            <span>
              <i style={{ background: '#ea580c' }} /> Prison (kyohwaso)
            </span>
          </figcaption>
        </figure>
      </div>

      <section className="index-section">
        <h2>
          <ShieldAlert size={20} className="h-icon danger" /> Political prison camps <small>{kwanliso.length}</small>
        </h2>
        <p className="muted">Run by the secret police (Ministry of State Security). No trial. Three generations of a family can be sent together.</p>
        <ul className="place-cards">
          {kwanliso.map((c) => (
            <CampCard key={c.id} camp={c} />
          ))}
        </ul>
      </section>

      <section className="index-section">
        <h2>
          <Lock size={20} className="h-icon warn" /> Prisons (kyohwaso) <small>{kyohwaso.length}</small>
        </h2>
        <p className="muted">Run by the regular police (Ministry of Social Security). Fixed sentences, but hunger and forced labor kill many before release.</p>
        <ul className="place-cards">
          {kyohwaso.map((c) => (
            <CampCard key={c.id} camp={c} />
          ))}
        </ul>
      </section>
    </div>
  );
}
