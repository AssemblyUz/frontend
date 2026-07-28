import {apiGet, ApiError} from './api';
import {formatNewsDate, type LocalizedNewsItem} from '@/data/news';

export type {LocalizedNewsItem};

/**
 * Shape of `GET /api/v1/news/` and `GET /api/v1/news/{slug}/`.
 *
 * The API already resolves the locale server-side (`?locale=`), so every
 * translatable field arrives as a plain string. `dateLabel` is the one field
 * the backend does not send — it is derived here via `formatNewsDate`.
 */
/** How wide a photo renders, chosen per photo by the editor. */
export type PhotoSize = 'full' | 'half' | 'thumb';

export type ArticlePhoto = {
  /** Absolute when MEDIA_BASE_URL is configured, relative in local dev. */
  url: string;
  size: PhotoSize;
  alt: string;
};

type ArticleResponse = {
  slug: string;
  date: string;
  icon: string;
  tag: string;
  title: string;
  excerpt: string;
  /** First photo, or null. Present on both endpoints. */
  cover?: ArticlePhoto | null;
  /** Absent on the list endpoint, which serialises the card shape only. */
  body?: string[];
  images?: ArticlePhoto[];
};

function localize(article: ArticleResponse, locale: string): LocalizedNewsItem {
  return {
    slug: article.slug,
    date: article.date,
    dateLabel: formatNewsDate(article.date, locale),
    icon: article.icon,
    tag: article.tag,
    title: article.title,
    excerpt: article.excerpt,
    body: article.body ?? [],
    cover: article.cover ?? null,
    images: article.images ?? [],
  };
}

/**
 * The API returns published posts newest-first already. Sorting again here
 * keeps the contract identical to the static path regardless of what the
 * backend's `Meta.ordering` becomes later.
 */
function newestFirst(items: LocalizedNewsItem[]): LocalizedNewsItem[] {
  return [...items].sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * All published posts for a locale, newest first.
 *
 * An unreachable API yields no posts, so `/yangiliklar` shows its empty state.
 * It deliberately does NOT fall back to the seed posts in `data/news.ts` the
 * way `lib/site.ts` falls back for site details, and the difference matters:
 * those are invented articles with invented dates. Serving them presents
 * fiction as this organisation's news, and it hides a real outage behind a page
 * that looks fine — an editor who had just published something reasonably read
 * it as their post having disappeared.
 *
 * A missing address degrades to a stale address. A missing article list must not
 * degrade to a fabricated one.
 */
export async function getNews(locale: string): Promise<LocalizedNewsItem[]> {
  try {
    const data = await apiGet<ArticleResponse[]>('news/', locale);
    return newestFirst(data.map((article) => localize(article, locale)));
  } catch (error) {
    console.error(`[news] API unreachable for locale "${locale}"; serving no posts.`, error);
    return [];
  }
}

/**
 * A single published post, or undefined when the slug is unknown.
 *
 * Only a 404 means undefined: the post is unpublished, future-dated or gone.
 * Any other failure is rethrown rather than reported as a missing post, because
 * the caller turns undefined into a 404 page — which would tell a reader, and a
 * search engine, that a live article no longer exists because the backend
 * happened to be restarting. An error page is the honest answer to an outage.
 */
export async function getNewsItem(
  slug: string,
  locale: string,
): Promise<LocalizedNewsItem | undefined> {
  try {
    const data = await apiGet<ArticleResponse>(`news/${encodeURIComponent(slug)}/`, locale);
    return localize(data, locale);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return undefined;
    }
    console.error(`[news] could not load "${slug}" (${locale}).`, error);
    throw error;
  }
}
