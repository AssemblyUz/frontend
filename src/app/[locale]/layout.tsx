import type {Metadata} from 'next';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {Inter} from 'next/font/google';
import Script from 'next/script';
import {routing} from '@/i18n/routing';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {getSiteInfo} from '@/lib/site';
import '../globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
  display: 'swap',
});

// Applied before hydration so the correct theme paints on first frame (no flash).
const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var dark = stored ? stored === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  // Organisation identity is edited in the admin under "Site settings". The
  // fetch is deduplicated with the one the footer makes on the same render.
  const site = await getSiteInfo(locale);
  return {
    title: {default: `${site.name} — ${site.tagline}`, template: `%s — ${site.short}`},
    description: site.description,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeScript}
        </Script>
        <NextIntlClientProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
