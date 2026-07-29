import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {getAssociations} from '@/data/associations';
import {getNews} from '@/lib/news';
import {getMediaVideos} from '@/lib/youtube';
import HeroMedia from '@/components/HeroMedia';
import IdeaDialog from '@/components/IdeaDialog';
import Logo from '@/components/Logo';
import VideoCard from '@/components/VideoCard';
import CountUp from '@/components/motion/CountUp';
import MainGate from '@/components/gate/MainGate';
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

type ServiceItem = {icon: string; name: string; desc: string};
type ProjectItem = {icon: string; name: string; desc: string};

/** Counted up on reveal, so the figures are numbers plus an optional suffix.
 *  The association figure matches the registry in `data/associations.ts`. */
const STATS = [
  {to: 20, key: 'projects'},
  {to: 50, key: 'associations'},
  {to: 15000, suffix: '+', key: 'members'},
  {to: 12, key: 'years'},
] as const;

const HOME_NEWS_COUNT = 3;
const HOME_VIDEO_COUNT = 3;

export default async function HomePage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const tServ = await getTranslations('services');
  const tProj = await getTranslations('projects');
  const tNews = await getTranslations('news');
  const tMedia = await getTranslations('media');

  const assoc = getAssociations(locale).slice(0, 3);
  const services = (tServ.raw('items') as ServiceItem[]).slice(0, 3);
  const projects = (tProj.raw('items') as ProjectItem[]).slice(0, 3);
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
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
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
            <p className="mt-6 max-w-xl text-fluid-lg text-muted sm:mt-7">{t('heroLead')}</p>
            {/* One call to action, opening the idea behind the Assembly. The two
                links this replaces went to Uyushmalar and Xizmatlar, both of
                which are in the header on every page, so nothing lost a route. */}
            <div className="mt-8">
              <IdeaDialog locale={locale} closeLabel={t('ideaClose')} />
            </div>
          </div>

          <HeroMedia badge={t('mediaBadge')} label={t('mediaLabel')} />
        </div>
      </section>

      {/* Stats */}
      {/* Four figures across from `md` — a tablet has the width for the whole
          row, and waiting for `lg` left it in the phone's 2×2 block. */}
      <section className="shell -mt-8">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border-base bg-border-base shadow-sm md:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.key}
              className="group bg-card px-3 py-5 text-center transition-colors duration-500 hover:bg-brand/5 xs:px-5 sm:px-6 sm:py-7"
            >
              <div className="text-fluid-3xl font-bold tracking-tight text-brand transition-transform duration-500 group-hover:scale-105">
                <CountUp to={s.to} suffix={'suffix' in s ? s.suffix : ''} />
              </div>
              <div className="mt-1 text-xs text-muted sm:text-sm">{t(`stats.${s.key}`)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* The Main Gate: the Assembly's whole overview, and the doors into it. */}
      <div className="mt-section">
        <MainGate />
      </div>

      {/* Associations preview */}
      <div className="bg-surface/60">
        <HomeSection
          title={t('assocTitle')}
          lead={t('assocLead')}
          href="/uyushmalar"
          viewAll={t('viewAll')}
        >
          {assoc.map((it) => (
            <Link
              key={it.id}
              href={`/uyushmalar/${it.id}`}
              className="group rounded-2xl border border-border-base bg-card p-5 transition hover:border-brand hover:shadow-lg sm:p-6"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-lg font-bold text-brand">
                {(it.name.match(/[A-Za-zА-Яа-я0-9]/)?.[0] ?? it.name[0]).toUpperCase()}
              </div>
              <h3 className="mt-4 font-semibold leading-snug text-foreground group-hover:text-brand">
                {it.name}
              </h3>
              {it.activity && <p className="mt-2 text-sm leading-relaxed text-muted">{it.activity}</p>}
            </Link>
          ))}
        </HomeSection>
      </div>

      {/* Services preview */}
      <HomeSection
        title={t('servicesTitle')}
        lead={t('servicesLead')}
        href="/xizmatlar"
        viewAll={t('viewAll')}
      >
        {services.map((it) => (
          <div key={it.name} className="rounded-2xl border border-border-base bg-card p-5 transition hover:border-brand hover:shadow-lg sm:p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/15 to-sky-500/15 text-2xl">{it.icon}</div>
            <h3 className="mt-4 font-semibold text-foreground">{it.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{it.desc}</p>
          </div>
        ))}
      </HomeSection>

      {/* Projects preview */}
      <div className="bg-surface/60">
        <HomeSection
          title={t('projectsTitle')}
          lead={t('projectsLead')}
          href="/loyihalar"
          viewAll={t('viewAll')}
        >
          {projects.map((it) => (
            <div key={it.name} className="rounded-2xl border border-border-base bg-card p-5 transition hover:border-brand hover:shadow-lg sm:p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-2xl">{it.icon}</div>
              <h3 className="mt-4 font-semibold text-foreground">{it.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{it.desc}</p>
            </div>
          ))}
        </HomeSection>
      </div>

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

      {/* News */}
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

      {/* CTA banner */}
      <section className="shell pb-section-sm">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-sky-500 px-5 py-12 text-center shadow-lg sm:px-12 sm:py-14">
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <h2 className="relative text-fluid-3xl font-bold text-white">{t('ctaBannerTitle')}</h2>
          <p className="relative mx-auto mt-3 max-w-xl text-fluid-base text-white/85">
            {t('ctaBannerLead')}
          </p>
          <a
            href="mailto:info@assembly.uz"
            className="relative mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-700 shadow-sm transition hover:bg-white/90"
          >
            {t('ctaBannerBtn')} →
          </a>
        </div>
      </section>
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
