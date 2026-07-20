import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  output: 'standalone',

  // Django's URLs end in a slash. Next would otherwise 308 `/api/admin/x/` to
  // `/api/admin/x` before the rewrite runs, and Django's APPEND_SLASH does not
  // redirect POST -- so every write from the panel would break while reads
  // appeared to work.
  skipTrailingSlashRedirect: true,

  async rewrites() {
    // The control panel signs in with Django's session cookie, which is
    // HttpOnly and SameSite, and the backend sets CORS_ALLOW_CREDENTIALS=False.
    // The browser therefore has to reach Django on the same origin as this app
    // or it can never send that cookie.
    //
    // Production already works that way -- Caddy routes assembly.uz/api/* to
    // Django and never reaches this rule. This exists so local development
    // behaves identically instead of failing in a way that only shows up once
    // the two services are on different ports.
    // The trailing slash on the destination is load-bearing. Next captures
    // `:path*` without one, so proxying it verbatim would hand Django
    // `/api/admin/session`, which APPEND_SLASH answers with a 301 back to the
    // same URL the browser already asked for -- a redirect loop. Every DRF
    // route here ends in a slash, so restoring it unconditionally is correct.
    const api = process.env.API_URL ?? 'http://127.0.0.1:8000';
    return [{source: '/api/admin/:path*', destination: `${api}/api/admin/:path*/`}];
  },
};

export default withNextIntl(nextConfig);
