/**
 * Last known good organisation details, used only when the API is unreachable.
 *
 * Django owns these now — they are edited in the admin under "Site settings".
 * This is the same degraded-mode role `data/social.ts` and `data/news.ts` play:
 * a backend outage renders a stale page rather than an empty one.
 *
 * Deliberately NOT in messages/*.json: next-intl serialises the whole message
 * catalogue into every page, so contact details living there would be shipped
 * to the browser and go stale the moment an editor changed them in the panel.
 *
 * `backend/seed/export_frontend_data.mjs` reads this module to build the
 * initial database content, so it is also the migration source of truth.
 */

export type SiteDetails = {
  name: string;
  short: string;
  tagline: string;
  description: string;
  address: string;
  email: string;
  phone: string;
};

export const site: Record<'uz' | 'ru' | 'en', SiteDetails> = {
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
