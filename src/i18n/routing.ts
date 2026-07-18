import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  // O'zbek (lotin), Rus, Ingliz tillari
  locales: ['uz', 'ru', 'en'],
  defaultLocale: 'uz',
  localePrefix: 'always',
});

export type Locale = (typeof routing.locales)[number];
