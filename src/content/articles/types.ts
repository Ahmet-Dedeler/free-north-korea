import type { ReactNode } from 'react';

export interface Faq {
  q: string;
  /** Plain text: it is reused verbatim in the FAQPage JSON-LD. */
  a: string;
}

export interface Article {
  slug: string;
  /** <title>, kept under ~60 characters where possible. */
  title: string;
  h1: string;
  /** Meta description, ~150 characters. */
  description: string;
  /** One-line teaser for cards and the /learn index. */
  teaser: string;
  /** ISO date the facts were last checked. */
  updated: string;
  minutes: number;
  body: () => ReactNode;
  faq?: Faq[];
  /** Sources listed at the end of the article. */
  sources: { label: string; url: string }[];
}
