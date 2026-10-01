import { PEOPLE } from '@/entities';

export const dynamic = 'force-static';

/** Every person in the entity graph, as JSON. For researchers, NGOs and AI agents. */
export function GET() {
  return Response.json({ updated: new Date().toISOString().slice(0, 10), count: PEOPLE.length, people: PEOPLE });
}
