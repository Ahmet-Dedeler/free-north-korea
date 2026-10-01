/**
 * Entity graph: people and organizations that run (or fight) the North Korean state, linked to each other.
 * Data lives in data/entities/*.json (built from docs/research/leadership.json by scripts/build-entities.ts).
 * Every factual claim carries its own source so readers (and machines) can check it.
 */

export type Confidence = 'confirmed' | 'reported' | 'rumor';

export interface Claim {
  claim: string;
  source_name?: string;
  source_url?: string;
  date?: string | null;
  confidence?: Confidence;
}

export interface NumberClaim {
  value: number;
  source_name?: string;
  source_url?: string;
  date?: string | null;
  confidence?: Confidence;
}

export type Relation =
  | 'father'
  | 'mother'
  | 'spouse'
  | 'child'
  | 'sibling'
  | 'half-sibling'
  | 'uncle'
  | 'aunt'
  | 'niece'
  | 'nephew'
  | 'in-law';

export interface Image {
  src: string; // local path under /public
  credit: string;
  license?: string;
  sourceUrl: string;
}

export interface Person {
  id: string;
  name_en: string;
  name_ko?: string | null;
  aliases?: string[];
  wikidata?: string | null;
  wikipedia?: string | null;
  image?: Image | null;
  born?: { date?: string | null; place?: string | null } | null;
  died?: { date?: string | null; place?: string | null; cause?: string | null } | null;
  status?: { value: string; as_of?: string | null; source_url?: string | null } | null;
  gender?: string | null;
  rank?: string | null;
  roles: { title: string; org_id?: string | null; start?: string | null; end?: string | null; source_url?: string | null }[];
  family: { relation: Relation; person_id: string; note?: string | null }[];
  health: Claim[];
  physical?: { height_cm?: NumberClaim | null; weight_kg?: NumberClaim | null } | null;
  sanctions: { list: string; id?: string | null; date?: string | null; source_url?: string | null }[];
  summary: string;
  summary_source?: 'wikipedia' | 'research';
  notable: Claim[];
  tags: string[];
}

export interface Org {
  id: string;
  name_en: string;
  name_ko?: string | null;
  type?: string | null;
  parent_org_id?: string | null;
  head_person_id?: string | null;
  summary: string;
  sanctions: { list: string; id?: string | null; date?: string | null; source_url?: string | null }[];
  source_urls: string[];
}
