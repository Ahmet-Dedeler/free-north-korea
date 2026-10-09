import type { Confidence } from '@/entities/types';
import { REPO_URL, SITE_NAME, SITE_URL } from '@/site/config';

export const dynamic = 'force-static';

const CONFIDENCE: Confidence[] = ['confirmed', 'reported', 'rumor'];

const sourced = { type: 'string', format: 'uri', nullable: true, description: 'Page the claim was checked against.' };
const sanction = {
  type: 'object',
  properties: { list: { type: 'string', description: 'UN 1718 or an OFAC program.' }, id: { type: 'string', nullable: true }, date: { type: 'string', nullable: true }, source_url: sourced },
};

/** OpenAPI 3.0 description of the people API (src/app/api/people). Keep it in step with `Person` in src/entities/types.ts. */
const spec = {
  openapi: '3.0.3',
  info: {
    title: `${SITE_NAME} people API`,
    version: '1',
    description:
      'Read-only JSON about North Korean leaders, officials and the Kim family: roles, family links, sanctions and sourced claims. Static files, no key, CORS open. Health and physical claims carry the source they were checked against; rumors are labelled.',
    license: { name: 'Apache-2.0', url: `${REPO_URL}/blob/main/LICENSE` },
  },
  servers: [{ url: SITE_URL }],
  paths: {
    '/api/people': {
      get: {
        summary: 'Every person',
        operationId: 'listPeople',
        responses: {
          '200': {
            description: 'All people.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    updated: { type: 'string', format: 'date' },
                    count: { type: 'integer' },
                    people: { type: 'array', items: { $ref: '#/components/schemas/Person' } },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/people/{id}': {
      get: {
        summary: 'One person, with family links resolved to names',
        operationId: 'getPerson',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, example: 'kim-jong-un' }],
        responses: {
          '200': {
            description: 'The person.',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/Person' },
                    {
                      type: 'object',
                      properties: {
                        family_resolved: {
                          type: 'array',
                          items: { type: 'object', properties: { relation: { type: 'string' }, id: { type: 'string' }, name: { type: 'string' } } },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          '404': { description: 'No person with that id.' },
        },
      },
    },
  },
  components: {
    schemas: {
      Claim: {
        type: 'object',
        description: 'A sourced statement. `confidence` says how firm it is; rumors are labelled.',
        required: ['claim'],
        properties: {
          claim: { type: 'string' },
          source_name: { type: 'string' },
          source_url: sourced,
          date: { type: 'string', nullable: true },
          confidence: { type: 'string', enum: CONFIDENCE },
        },
      },
      Person: {
        type: 'object',
        required: ['id', 'name_en', 'roles', 'family', 'health', 'sanctions', 'summary', 'notable', 'tags'],
        properties: {
          id: { type: 'string', description: 'Slug, also used in /people/{id}.' },
          name_en: { type: 'string' },
          name_ko: { type: 'string', nullable: true },
          aliases: { type: 'array', items: { type: 'string' } },
          wikidata: { type: 'string', nullable: true },
          wikipedia: { type: 'string', format: 'uri', nullable: true },
          image: { type: 'object', nullable: true, description: 'Only freely licensed photos, with credit and license.' },
          born: { type: 'object', nullable: true, properties: { date: { type: 'string', nullable: true }, place: { type: 'string', nullable: true } } },
          died: {
            type: 'object',
            nullable: true,
            properties: { date: { type: 'string', nullable: true }, place: { type: 'string', nullable: true }, cause: { type: 'string', nullable: true } },
          },
          status: { type: 'object', nullable: true, properties: { value: { type: 'string' }, as_of: { type: 'string', nullable: true }, source_url: sourced } },
          gender: { type: 'string', nullable: true },
          rank: { type: 'string', nullable: true },
          roles: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                org_id: { type: 'string', nullable: true },
                start: { type: 'string', nullable: true },
                end: { type: 'string', nullable: true },
                source_url: sourced,
              },
            },
          },
          family: {
            type: 'array',
            items: { type: 'object', properties: { relation: { type: 'string' }, person_id: { type: 'string' }, note: { type: 'string', nullable: true } } },
          },
          health: { type: 'array', items: { $ref: '#/components/schemas/Claim' } },
          physical: { type: 'object', nullable: true },
          sanctions: { type: 'array', items: sanction },
          summary: { type: 'string' },
          summary_source: { type: 'string', enum: ['wikipedia', 'research'] },
          notable: { type: 'array', items: { $ref: '#/components/schemas/Claim' } },
          tags: { type: 'array', items: { type: 'string' } },
        },
      },
    },
  },
};

export function GET() {
  return new Response(JSON.stringify(spec, null, 2), {
    headers: { 'Content-Type': 'application/vnd.oai.openapi+json', 'Access-Control-Allow-Origin': '*' },
  });
}
