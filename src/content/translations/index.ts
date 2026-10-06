/**
 * Which pages exist in which language, so every page can emit matching hreflang links (see pageMeta in site/seo.ts).
 * English is the source. Korean, Japanese and Chinese articles reuse the English slug; an article that exists only in one
 * language (the Japanese abductees piece) simply has no counterpart here.
 */
import { ARTICLES } from '@/content/articles';
import type { Languages } from '@/site/seo';
import { JA_ARTICLES } from './ja';
import { KO_ARTICLES } from './ko';
import { ZH_ARTICLES } from './zh';

export const HUB_PATHS = { en: '/', ko: '/ko', ja: '/ja', zh: '/zh' } as const;

/** Paths of one article in every language it has been translated into. */
export function articleLanguages(slug: string): Languages {
  return {
    ...(ARTICLES.some((a) => a.slug === slug) && { en: `/learn/${slug}` }),
    ...(KO_ARTICLES.some((a) => a.slug === slug) && { ko: `/ko/learn/${slug}` }),
    ...(JA_ARTICLES.some((a) => a.slug === slug) && { ja: `/ja/learn/${slug}` }),
    ...(ZH_ARTICLES.some((a) => a.slug === slug) && { zh: `/zh/learn/${slug}` }),
  };
}
