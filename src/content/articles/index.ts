import howFreed from './how-can-north-korea-be-freed';
import isPossible from './is-it-possible-to-free-north-korea';
import howToHelp from './how-to-help-north-koreans';
import camps from './north-korea-prison-camps';
import info from './information-into-north-korea';
import escape from './how-north-koreans-escape';
import type { Article } from './types';

/** All articles, in the order they appear on /learn. Add new ones here; routes and the sitemap pick them up. */
export const ARTICLES: Article[] = [howFreed, isPossible, howToHelp, escape, camps, info];

export const articleBySlug = (slug: string) => ARTICLES.find((a) => a.slug === slug);
