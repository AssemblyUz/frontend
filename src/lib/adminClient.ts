'use client';

/**
 * Browser-side writes for the control panel.
 *
 * Calls go to a same-origin `/api/admin/...` path so Django's HttpOnly session
 * cookie is sent automatically — in production Caddy routes it, in development
 * the rewrite in next.config.ts does.
 */

export class PanelError extends Error {
  constructor(
    readonly status: number,
    readonly detail: string,
    /** Per-field messages from DRF, keyed by field name. */
    readonly fields?: Record<string, string>,
  ) {
    super(detail);
    this.name = 'PanelError';
  }

  /** A dead session needs a different response than a validation failure. */
  get isSignedOut(): boolean {
    return this.status === 401 || this.status === 403;
  }
}

/**
 * Django rotates the CSRF token when a session starts, so it is read from the
 * cookie at call time rather than captured once — a token cached before sign-in
 * is stale immediately after it.
 */
function csrfToken(): string {
  return (
    document.cookie
      .split('; ')
      .find((c) => c.startsWith('csrftoken='))
      ?.split('=')[1] ?? ''
  );
}

type PanelRequest = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  /** Sent as JSON. Mutually exclusive with `form`. */
  json?: unknown;
  /** Sent as multipart. Content-Type is left unset so the browser adds the boundary. */
  form?: FormData;
};

export async function panelFetch<T>(
  path: string,
  {method = 'GET', json, form}: PanelRequest = {},
): Promise<T> {
  const response = await fetch(`/api/admin/${path}`, {
    method,
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      ...(json ? {'Content-Type': 'application/json'} : {}),
      ...(method === 'GET' ? {} : {'X-CSRFToken': csrfToken()}),
    },
    body: json ? JSON.stringify(json) : form,
  });

  if (response.status === 204) return undefined as T;

  if (!response.ok) {
    const data: Record<string, unknown> = await response.json().catch(() => ({}));

    if (response.status === 401 || response.status === 403) {
      throw new PanelError(
        response.status,
        typeof data.detail === 'string'
          ? data.detail
          : 'Your session has ended. Sign in again.',
      );
    }

    // DRF reports validation as {field: [messages]}. Splitting it out lets the
    // form put each message on its own input instead of collapsing everything
    // into one banner that does not say which field is wrong.
    const {detail, ...rest} = data;
    const fields = Object.entries(rest).map(
      ([key, value]) => [key, Array.isArray(value) ? value.join(' ') : String(value)] as const,
    );

    throw new PanelError(
      response.status,
      typeof detail === 'string' ? detail : 'Something went wrong. Please try again.',
      fields.length ? Object.fromEntries(fields) : undefined,
    );
  }

  return (await response.json()) as T;
}
