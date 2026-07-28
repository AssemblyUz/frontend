import {apiGet} from './api';
import {socials as fallbackSocials, type SocialId} from '@/data/social';
import {site as fallbackSite} from '@/data/site';

export type SiteSocial = {
  platform: SocialId;
  name: string;
  /** Empty means "not connected yet" — rendered as a dimmed icon, not a link. */
  url: string;
};

export type SiteInfo = {
  name: string;
  short: string;
  tagline: string;
  description: string;
  address: string;
  email: string;
  phone: string;
  socials: SiteSocial[];
};

/** Shape of `GET /api/v1/site/`. `platform` is unconstrained until narrowed. */
type SiteResponse = Omit<SiteInfo, 'socials'> & {
  socials: {platform: string; name: string; url: string}[];
};

const KNOWN_PLATFORMS = new Set<string>(['telegram', 'instagram', 'facebook', 'youtube']);

function fallback(locale: string): SiteInfo {
  const key = locale === 'ru' || locale === 'en' ? locale : 'uz';
  return {
    ...fallbackSite[key],
    socials: fallbackSocials.map((s) => ({platform: s.id, name: s.name, url: s.href})),
  };
}

/** Drop platforms the frontend has no icon for, rather than crashing on lookup. */
function narrowSocials(socials: SiteResponse['socials']): SiteSocial[] {
  return socials
    .filter((s) => KNOWN_PLATFORMS.has(s.platform))
    .map((s) => ({platform: s.platform as SocialId, name: s.name, url: s.url}));
}

/**
 * Fill anything the API left blank from the bundled defaults.
 *
 * Site settings is a single admin row, and until someone types into it every
 * field comes back as an empty string — a successful response, so no error path
 * catches it. The site then rendered `<title> — </title>` on every page: the
 * template is "%s — {short name}", and the short name was "".
 *
 * A blank field here means an unfilled form, not a considered answer, which is
 * why it defers to the defaults. That is the opposite of an empty article list,
 * where the empty answer is the true one — nothing has been published — and must
 * not be replaced with invented posts. See lib/news.ts.
 */
function withDefaults(data: SiteResponse, locale: string): SiteInfo {
  const defaults = fallback(locale);
  const filled = (value: string, byDefault: string) => (value?.trim() ? value : byDefault);
  const socials = narrowSocials(data.socials ?? []);

  return {
    name: filled(data.name, defaults.name),
    short: filled(data.short, defaults.short),
    tagline: filled(data.tagline, defaults.tagline),
    description: filled(data.description, defaults.description),
    address: filled(data.address, defaults.address),
    email: filled(data.email, defaults.email),
    phone: filled(data.phone, defaults.phone),
    socials: socials.length ? socials : defaults.socials,
  };
}

/**
 * Organisation name, contact details and social profiles, edited in the Django
 * admin under "Site settings" and "Social links".
 *
 * If the backend is unreachable the static content is served instead, so the
 * site never 500s on a backend outage or a build that runs without the API up.
 * The failure is logged rather than swallowed.
 */
export async function getSiteInfo(locale: string): Promise<SiteInfo> {
  try {
    const data = await apiGet<SiteResponse>('site/', locale);
    return withDefaults(data, locale);
  } catch (error) {
    console.error(
      `[site] API unreachable for locale "${locale}"; serving static fallback.`,
      error,
    );
    return fallback(locale);
  }
}
