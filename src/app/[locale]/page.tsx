import {getTranslations, setRequestLocale} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {Link} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';
import {getNews} from '@/lib/news';
import {getMediaVideos} from '@/lib/youtube';
import HeroMedia from '@/components/HeroMedia';
import IdeaDialog from '@/components/IdeaDialog';
import Logo from '@/components/Logo';
import VideoCard from '@/components/VideoCard';
import MainGate from '@/components/gate/MainGate';
import GateDoors from '@/components/gate/GateDoors';
import NewsCard from '@/components/NewsCard';

/**
 * Rendered per request, for the same reason as `/yangiliklar`: this page carries
 * the latest articles, and a build that cannot reach the API produces a version
 * with none of them — which every deploy then serves until a background refresh
 * replaces it. See that page for the measurement.
 *
 * The YouTube feed keeps its own half-hour cache, so this does not mean polling
 * YouTube on every visit.
 */
export const dynamic = 'force-dynamic';

const HOME_NEWS_COUNT = 3;
const HOME_VIDEO_COUNT = 3;

export default async function HomePage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  // The layout guards this too, but a page renders in parallel with the layout
  // above it rather than after it -- so the layout's `notFound()` cannot stop
  // the fetch below from having already gone out. `/[locale]` matches any single
  // root segment, and this page is `force-dynamic`, so without this every junk
  // path a scanner tries was an uncached article query against Django.
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const t = await getTranslations('home');
  const tNews = await getTranslations('news');
  const tMedia = await getTranslations('media');

  const latestNews = (await getNews(locale)).slice(0, HOME_NEWS_COUNT);
  const latestVideos = await getMediaVideos(HOME_VIDEO_COUNT);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand/10 to-transparent" />
        <div className="pointer-events-none absolute -top-32 right-0 h-80 w-80 rounded-full bg-brand/10 blur-3xl" />
        <div className="relative shell grid gap-10 py-section md:gap-12 lg:grid-cols-2 lg:items-center lg:gap-14">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border-base bg-surface px-3 py-1 text-xs font-medium text-brand">
              <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
              {t('heroBadge')}
            </span>
            {/* The organisation's own lockup stands in for the name in type. The
                heading keeps its localised text for assistive technology and
                search engines, so the artwork itself is marked decorative.

                The lockup is the page's largest element, so its width is capped
                against the viewport as well as the column: on a 320px phone the
                `max-w-xs` alone still left it touching both gutters. */}
            <h1 className="mt-6 sm:mt-7">
              <span className="sr-only">{t('heroTitle')}</span>
              <Logo
                decorative
                className="h-auto w-full max-w-[min(20rem,88%)] sm:max-w-sm lg:max-w-md"
              />
            </h1>
            {/* One call to action, opening the idea behind the Assembly. The two
                links this replaces went to Uyushmalar and Xizmatlar, both of
                which are in the header on every page, so nothing lost a route.

                It follows the lockup directly: the standfirst that used to sit
                between them said the same thing as the statement this button
                opens, at less length and with no way to read the rest.

                The kicker above the button is what names the idea as one — the
                button alone gave the idea's title with nothing to say that a
                statement sat behind it. */}
            <div className="mt-7 sm:mt-8">
              <IdeaDialog
                locale={locale}
                kicker={t('ideaKicker')}
                closeLabel={t('ideaClose')}
              />
            </div>
          </div>

          <HeroMedia badge={t('mediaBadge')} label={t('mediaLabel')} />
        </div>
      </section>

      {/* The Main Gate: the Assembly's structure in one band. Its panels carry
          the figures — 20 projects, 50 associations — that the stats strip above
          it used to repeat, and the wings link through to each block, which is
          what the association, service and project previews here used to do at
          three times the length. */}
      <MainGate />

      {/* News before the media strip: an article is the newer of the two — the
          YouTube feed is re-read on a half-hour cycle and often unchanged for
          weeks — so it is what a returning reader is here for. */}
      {latestNews.length > 0 && (
        <HomeSection
          title={t('newsTitle')}
          lead={t('newsLead')}
          href="/yangiliklar"
          viewAll={t('viewAll')}
        >
          {latestNews.map((item) => (
            <NewsCard key={item.slug} item={item} readMore={tNews('readMore')} />
          ))}
        </HomeSection>
      )}

      {/* Media projects — hidden until at least one channel is connected. */}
      {latestVideos.length > 0 && (
        <HomeSection
          title={t('mediaProjectsTitle')}
          lead={t('mediaProjectsLead')}
          href="/media"
          viewAll={t('viewAll')}
        >
          {latestVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              labels={{play: tMedia('play'), watchOn: tMedia('watchOn')}}
            />
          ))}
        </HomeSection>
      )}

      {/* CTA banner */}
      <section className="shell pb-section-sm">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 to-cyan-500 px-5 py-12 text-center shadow-lg sm:px-12 sm:py-14">
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <h2 className="relative text-fluid-3xl font-bold text-white">{t('ctaBannerTitle')}</h2>
          <p className="relative mx-auto mt-3 max-w-xl text-fluid-base text-white/85">
            {t('ctaBannerLead')}
          </p>
          {/* To the contact page, not a mailto. The banner asks the reader to
              register an association or become a partner, which is a form and a
              map and a set of numbers — not one email. It also drops a
              hardcoded address that Site settings already owns. */}
          <Link
            href="/aloqa"
            className="relative mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-teal-700 shadow-sm transition hover:bg-white/90"
          >
            {t('ctaBannerBtn')} →
          </Link>
        </div>
      </section>

      {/* The motto and the doors, closing the page. They used to close the Main
          Gate; down here they close everything above them, and a reader who has
          scrolled the whole page is given somewhere to go rather than the
          footer's small print. */}
      <GateDoors />
    </>
  );
}

function HomeSection({
  title,
  lead,
  href,
  viewAll,
  children,
}: {
  title: string;
  lead: string;
  href: string;
  viewAll: string;
  children: React.ReactNode;
}) {
  return (
    <section className="shell py-section">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div>
          <h2 className="text-fluid-3xl font-bold tracking-tight text-foreground">{title}</h2>
          <p className="mt-2 max-w-xl text-fluid-base text-muted">{lead}</p>
        </div>
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 py-1 text-sm font-semibold text-brand transition-all hover:gap-2.5"
        >
          {viewAll} →
        </Link>
      </div>
      {/* Two across on a tablet, three from `lg`. Three at 768px would leave
          each card about 225px wide, which is narrower than these read at. */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">{children}</div>
    </section>
  );
}
