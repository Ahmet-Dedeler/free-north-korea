import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ARTICLES, articleBySlug } from '@/content/articles';
import { Ext } from '@/components/Ext';
import { formatDate } from '@/missiles/meta';
import { SITE_NAME, SITE_URL } from '@/site/config';
import { absolute, jsonLd, pageMeta } from '@/site/seo';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => ARTICLES.map((a) => ({ slug: a.slug }));

export async function generateMetadata({ params }: Params) {
  const a = articleBySlug((await params).slug);
  if (!a) return {};
  return pageMeta({ title: a.title, description: a.description, path: `/learn/${a.slug}`, type: 'article' });
}

export default async function ArticlePage({ params }: Params) {
  const a = articleBySlug((await params).slug);
  if (!a) notFound();
  const url = absolute(`/learn/${a.slug}`);
  const others = ARTICLES.filter((x) => x.slug !== a.slug).slice(0, 3);

  const ld = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: a.h1,
      description: a.description,
      dateModified: a.updated,
      mainEntityOfPage: url,
      author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Learn', item: absolute('/learn') },
        { '@type': 'ListItem', position: 2, name: a.h1, item: url },
      ],
    },
    ...(a.faq?.length
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: a.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
          },
        ]
      : []),
  ];

  return (
    <article className="prose">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />
      <p className="eyebrow">
        <Link href="/learn">Learn</Link> · {a.minutes} min read · Updated {formatDate(a.updated)}
      </p>
      <h1>{a.h1}</h1>
      {a.body()}

      {a.faq && (
        <>
          <h2>Quick answers</h2>
          <dl className="faq">
            {a.faq.map((f) => (
              <div key={f.q}>
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>
        </>
      )}

      <aside className="act-box">
        <b>Want to do something about it?</b>
        <p>Fund a rescue, send information in, or support the people documenting abuses. It takes ten minutes to start.</p>
        <Link className="btn primary" href="/act">
          See what you can do
        </Link>
      </aside>

      <h2>Sources</h2>
      <ul className="sources">
        {a.sources.map((s) => (
          <li key={s.url}>
            <Ext href={s.url}>{s.label}</Ext>
          </li>
        ))}
      </ul>

      <h2>Keep reading</h2>
      <ul className="article-list">
        {others.map((o) => (
          <li key={o.slug}>
            <a href={`/learn/${o.slug}`}>
              <b>{o.h1}</b>
              <span>{o.teaser}</span>
            </a>
          </li>
        ))}
      </ul>
    </article>
  );
}
