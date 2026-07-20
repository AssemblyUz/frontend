/**
 * Low-level client for the Django API.
 *
 * Only ever called from Server Components, so `API_URL` stays a server-side
 * variable — it is never exposed to the browser and needs no CORS entry.
 */

/**
 * Overridden in production. The default matches `manage.py runserver`.
 *
 * In production a missing `API_URL` must not quietly fall through to localhost:
 * every request would fail, every page would render its static fallback, and
 * the site would serve stale content indefinitely while still returning 200 —
 * so no health check or alert would ever fire. Fail loudly instead.
 *
 * Checked at call time rather than module scope: `next build` runs with
 * NODE_ENV=production and no API_URL, and must still be able to prerender
 * pages from their fallbacks.
 */
const API_URL = process.env.API_URL ?? 'http://127.0.0.1:8000';

function assertConfigured(): void {
  if (process.env.NODE_ENV === 'production' && !process.env.API_URL) {
    throw new ApiError(
      'API_URL is not set. Refusing to fall back to localhost in production — ' +
        'the site would serve stale content while still returning 200.',
    );
  }
}

/**
 * How long a fetched page stays cached before Next.js revalidates it.
 * Five minutes: an editor's change appears without a deploy, and the site still
 * serves static HTML for almost every request.
 */
export const REVALIDATE_SECONDS = 300;

/** Fail fast rather than hang a page render when the backend is unreachable. */
const TIMEOUT_MS = 4000;

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * GET a resource for one locale. Throws `ApiError` on any non-2xx response,
 * timeout, or network failure — callers decide whether to degrade or fail.
 */
export async function apiGet<T>(path: string, locale: string): Promise<T> {
  assertConfigured();
  const url = `${API_URL}/api/v1/${path}?locale=${encodeURIComponent(locale)}`;

  let response: Response;
  try {
    response = await fetch(url, {
      next: {revalidate: REVALIDATE_SECONDS},
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (cause) {
    throw new ApiError(`GET ${url} failed: ${(cause as Error).message}`);
  }

  if (!response.ok) {
    throw new ApiError(`GET ${url} returned ${response.status}`, response.status);
  }

  return (await response.json()) as T;
}
