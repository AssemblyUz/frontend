import 'server-only';
import {cookies} from 'next/headers';
import type {PanelUser} from './adminTypes';

/**
 * Server-side reads for the control panel.
 *
 * Separate from `lib/api.ts` on purpose: that client is for anonymous public
 * content and caches for five minutes. Panel responses are per-user and must
 * never be cached or shared, so every request here forwards the caller's own
 * cookies and opts out of the Data Cache.
 */

const API_URL = process.env.API_URL ?? 'http://127.0.0.1:8000';
const TIMEOUT_MS = 6000;

export class PanelServerError extends Error {
  constructor(readonly status: number, message: string) {
    super(message);
    this.name = 'PanelServerError';
  }
}

/**
 * Replay the browser's cookies to Django.
 *
 * A Server Component's fetch does not inherit them, so without this the session
 * cookie never arrives and every panel page looks signed out.
 */
async function cookieHeader(): Promise<string> {
  const jar = await cookies();
  return jar
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');
}

export async function panelGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}/api/admin/${path}`, {
    headers: {Cookie: await cookieHeader(), Accept: 'application/json'},
    cache: 'no-store',
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new PanelServerError(
      response.status,
      `GET /api/admin/${path} returned ${response.status}`,
    );
  }
  return (await response.json()) as T;
}

/**
 * Who is signed in, or null.
 *
 * An unreachable backend is reported as "not signed in" rather than thrown: the
 * layout guard then redirects to the sign-in page, which is a comprehensible
 * dead end. Letting it throw would render an error page on the admin route and
 * leave the editor with nothing to act on. The failure is logged either way.
 */
export async function getPanelSession(): Promise<PanelUser | null> {
  try {
    const {user} = await panelGet<{user: PanelUser | null}>('session/');
    return user;
  } catch (error) {
    console.error('[panel] session lookup failed; treating as signed out.', error);
    return null;
  }
}
