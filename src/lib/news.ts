import {apiGet, ApiError} from './api';
import {
  formatNewsDate,
  getNews as staticNews,
  getNewsItem as staticNewsItem,
  type LocalizedNewsItem,
} from '@/data/news';

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
 * Falls back to the seed posts in `data/news.ts` when the API is unreachable,
 * matching how `lib/site.ts` degrades: a backend outage renders a stale page
 * rather than an empty one. The failure is logged, never swallowed silently.
 *
 * Note this fallback covers an *unreachable* API only. An API that responds
 * with an empty list is a legitimate answer — no posts published yet — and is
 * passed through so `/yangiliklar` shows its empty state.
 */
export async function getNews(locale: string): Promise<LocalizedNewsItem[]> {
  try {
    const data = await apiGet<ArticleResponse[]>('news/', locale);
    return newestFirst(data.map((article) => localize(article, locale)));
  } catch (error) {
    console.error(
      `[news] API unreachable for locale "${locale}"; serving static fallback.`,
      error,
    );
    return staticNews(locale);
  }
}

/**
 * A single published post, or undefined when the slug is unknown.
 *
 * A 404 is a real answer — the post is unpublished, future-dated or gone — so
 * it must not fall through to the static seed data, or a deleted post would
 * stay reachable forever. Only a transport failure degrades to the fallback.
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
    console.error(
      `[news] API unreachable for "${slug}" (${locale}); serving static fallback.`,
      error,
    );
    return staticNewsItem(slug, locale);
  }
}
