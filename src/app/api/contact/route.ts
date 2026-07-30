import {NextResponse} from 'next/server';
import {apiPost, ApiError, type FieldErrors} from '@/lib/api';

/**
 * The contact form's submit target.
 *
 * The form is a Client Component, so it cannot reach Django directly: `API_URL`
 * is a server-side variable and the backend sets `CORS_ALLOW_CREDENTIALS=False`
 * with a fixed origin list. Posting here instead keeps the request same-origin
 * — no CORS entry, no backend URL in the bundle — and behaves identically in
 * development and production, where Caddy fronts both services.
 *
 * It forwards, it does not decide: validation belongs to the serializer, which
 * is the only place that can enforce it for every client.
 */

export const runtime = 'nodejs';
/** A submission is never cached or prerendered. */
export const dynamic = 'force-dynamic';

/** Long enough for the longest allowed message, short enough to reject a flood. */
const MAX_BODY_BYTES = 12000;

type Body = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  message?: unknown;
  locale?: unknown;
  website?: unknown;
};

const asString = (value: unknown) => (typeof value === 'string' ? value : '');

export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({error: 'too_large'}, {status: 413});
  }

  let body: Body;
  try {
    body = JSON.parse(raw) as Body;
  } catch {
    return NextResponse.json({error: 'bad_request'}, {status: 400});
  }

  // Only the fields the serializer accepts are passed on, as strings. Anything
  // else a caller invents is dropped here rather than reaching Django.
  const payload = {
    name: asString(body.name),
    email: asString(body.email),
    phone: asString(body.phone),
    message: asString(body.message),
    locale: asString(body.locale),
    website: asString(body.website),
  };

  try {
    const result = await apiPost('contact/', payload);
    if (result.ok) return NextResponse.json({ok: true}, {status: 201});

    if (result.status === 400) {
      return NextResponse.json(
        {error: 'invalid', fields: (result.fields ?? {}) as FieldErrors},
        {status: 400},
      );
    }
    if (result.status === 429) {
      return NextResponse.json({error: 'throttled'}, {status: 429});
    }
    return NextResponse.json({error: 'upstream'}, {status: 502});
  } catch (cause) {
    // Unreachable backend or a timeout. The visitor gets one message either
    // way; the detail belongs in the server log, not in the response.
    console.error('[contact] could not reach the API.', cause);
    const status = cause instanceof ApiError ? 502 : 500;
    return NextResponse.json({error: 'unreachable'}, {status});
  }
}
