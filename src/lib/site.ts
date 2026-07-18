import {apiGet} from './api';
import {socials as fallbackSocials, type SocialId} from '@/data/social';

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

/**
 * Last known good values, used only when the API is unreachable — a degraded
 * page then looks correct rather than empty.
 *
 * The database is the source of truth. These are deliberately NOT kept in
 * messages/*.json: next-intl serialises the whole message catalogue into every
 * page, so contact details living there would be shipped to the browser and go
 * stale the moment an editor changed them in the panel.
 */
const FALLBACK: Record<'uz' | 'ru' | 'en', Omit<SiteInfo, 'socials'>> = {
  uz: {
    name: "O'zbekiston Iqtisodiyot Assambleyasi",
    short: 'Assambleya',
    tagline: "Yangi O'zbekiston — Yangi Renessans",
    description:
      "Birlashib, barqaror iqtisodiyot, innovatsiyalar va inson kapitalini rivojlantirish orqali Yangi O'zbekistonning yangi renessansini barpo etamiz.",
    address: "Toshkent sh., Amir Temur shoh ko'chasi, 1",
    email: 'info@assembly.uz',
    phone: '+998 77 3035665',
  },
  ru: {
    name: 'Ассамблея экономики Узбекистана',
    short: 'Ассамблея',
    tagline: 'Новый Узбекистан — Новый Ренессанс',
    description:
      'Объединяясь, мы создаём новый ренессанс Нового Узбекистана через развитие устойчивой экономики, инноваций и человеческого капитала.',
    address: 'г. Ташкент, проспект Амира Темура, 1',
    email: 'info@assembly.uz',
    phone: '+998 77 3035665',
  },
  en: {
    name: 'Uzbekistan Economy Assembly',
    short: 'Assembly',
    tagline: 'New Uzbekistan — New Renaissance',
    description:
      'By uniting, we build the new renaissance of New Uzbekistan through the development of a sustainable economy, innovation and human capital.',
    address: '1 Amir Temur Avenue, Tashkent',
    email: 'info@assembly.uz',
    phone: '+998 77 3035665',
  },
};

function fallback(locale: string): SiteInfo {
  const key = locale === 'ru' || locale === 'en' ? locale : 'uz';
  return {
    ...FALLBACK[key],
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
    return {...data, socials: narrowSocials(data.socials)};
  } catch (error) {
    console.error(
      `[site] API unreachable for locale "${locale}"; serving static fallback.`,
      error,
    );
    return fallback(locale);
  }
}
