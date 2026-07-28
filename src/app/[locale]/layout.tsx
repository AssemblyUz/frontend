import type {Metadata} from 'next';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {Inter, Lora} from 'next/font/google';
import Script from 'next/script';
import {routing} from '@/i18n/routing';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageTurn from '@/components/motion/PageTurn';
import {getSiteInfo} from '@/lib/site';
import '../globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
  display: 'swap',
});

/**
 * The display face. Lora is a book serif and carries Cyrillic, which the Russian
 * pages need — headings, leads and display figures are set in it, while Inter
 * keeps the interface text and small labels crisp.
 */
const lora = Lora({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  variable: '--font-serif',
  display: 'swap',
});

/**
 * Applied before hydration so the correct theme paints on the first frame.
 *
 * It then keeps watching, because React treats <html> as a host singleton and
 * resets its attributes whenever this layout remounts. That happens on every
 * language switch — the `locale` segment changes — which wiped the `dark` class
 * and threw the visitor into the light theme (and back again on the next
 * switch). The observer re-asserts the class the moment it is cleared; its
 * callback runs as a microtask, before paint, so nothing flashes.
 *
 * The theme cannot simply be rendered as a prop instead: it is only known on the
 * client, and reading it from a cookie on the server would opt every page out of
 * static generation.
 */
const themeScript = `
(function () {
  var root = document.documentElement;

  function wantsDark() {
    try {
      var stored = localStorage.getItem('theme');
      if (stored) return stored === 'dark';
    } catch (e) {}
    try {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (e) {
      return false;
    }
  }

  function apply() {
    var dark = wantsDark();
    // Only touch the class when it actually differs, so re-asserting it here
    // cannot loop with the observer below.
    if (root.classList.contains('dark') !== dark) root.classList.toggle('dark', dark);
  }

  apply();

  try {
    new MutationObserver(apply).observe(root, {
      attributes: true,
      attributeFilter: ['class'],
    });
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
    // No className on <html>. The theme lives in a `dark` class that the inline
    // script and ThemeToggle set imperatively, and React overwrites the whole
    // class attribute on any element it controls one for. Switching language
    // re-renders this layout with a new `locale`, which used to wipe `dark` and
    // throw the visitor back to the light theme. The font variable therefore
    // rides on <body>, where it still cascades to everything.
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${lora.variable} min-h-screen flex flex-col bg-background text-foreground`}
      >
        <Script id="theme-init" strategy="beforeInteractive">
          {themeScript}
        </Script>
        <NextIntlClientProvider>
          <Header />
          <main className="flex-1">
            <PageTurn>{children}</PageTurn>
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
