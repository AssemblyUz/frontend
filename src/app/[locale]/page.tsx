import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {getAssociations} from '@/data/associations';
import {getNews} from '@/data/news';
import NewsCard from '@/components/NewsCard';

type ServiceItem = {icon: string; name: string; desc: string};
type ProjectItem = {icon: string; name: string; desc: string};
type ValueItem = {title: string; sub: string};
type BlockItem = {code: string; title: string; desc: string};

const STATS = [
  {value: '20', key: 'projects'},
  {value: '46', key: 'associations'},
  {value: '15 000+', key: 'members'},
  {value: '12', key: 'years'},
] as const;

/** One accent per FR/BR/PR/GR wing, in message order. Full class strings so Tailwind keeps them. */
const BLOCK_ACCENT = [
  'text-sky-500 dark:text-sky-400',
  'text-emerald-500 dark:text-emerald-400',
  'text-violet-500 dark:text-violet-400',
  'text-amber-500 dark:text-amber-400',
] as const;

const HOME_NEWS_COUNT = 3;

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
  const tAbout = await getTranslations('about');
  const tNews = await getTranslations('news');

  const assoc = getAssociations(locale).slice(0, 3);
  const services = (tServ.raw('items') as ServiceItem[]).slice(0, 3);
  const projects = (tProj.raw('items') as ProjectItem[]).slice(0, 3);
  const values = tAbout.raw('values') as ValueItem[];
  const blocks = tAbout.raw('blocks') as BlockItem[];
  const latestNews = getNews(locale).slice(0, HOME_NEWS_COUNT);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand/10 to-transparent" />
        <div className="pointer-events-none absolute -top-32 right-0 h-80 w-80 rounded-full bg-brand/10 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border-base bg-surface px-3 py-1 text-xs font-medium text-brand">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              {t('heroBadge')}
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
              {t('heroTitle')}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{t('heroLead')}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/uyushmalar"
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-brand-fg shadow-sm transition hover:bg-brand-strong"
              >
                {t('ctaPrimary')} →
              </Link>
              <Link
                href="/xizmatlar"
                className="inline-flex items-center gap-2 rounded-xl border border-border-base bg-surface px-5 py-3 text-sm font-semibold text-foreground transition hover:border-brand hover:text-brand"
              >
                {t('ctaSecondary')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto -mt-8 max-w-6xl px-4">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border-base bg-border-base shadow-sm lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.key} className="bg-card px-6 py-7 text-center">
              <div className="text-3xl font-bold tracking-tight text-brand sm:text-4xl">{s.value}</div>
              <div className="mt-1 text-sm text-muted">{t(`stats.${s.key}`)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* About the Assembly — condensed. Full story lives on /haqida. */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {t('aboutTitle')}
            </h2>
            <p className="mt-2 max-w-2xl text-muted">{t('aboutLead')}</p>
          </div>
          <Link
            href="/haqida"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-all hover:gap-2.5"
          >
            {t('aboutMore')} →
          </Link>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-border-base bg-card p-6 sm:p-8">
            <span className="text-sm font-semibold uppercase tracking-wide text-brand">
              {tAbout('missionTitle')}
            </span>
            <p className="mt-3 leading-relaxed text-muted">{tAbout('mission')}</p>
          </div>
          <div className="rounded-2xl border border-border-base bg-card p-6 sm:p-8">
            <span className="text-sm font-semibold uppercase tracking-wide text-accent">
              {tAbout('goalTitle')}
            </span>
            <p className="mt-3 leading-relaxed text-muted">{tAbout('goal')}</p>
          </div>
        </div>

        {/* Values */}
        <ul className="mt-5 flex flex-wrap gap-2.5">
          {values.map((v) => (
            <li
              key={v.title}
              className="flex items-baseline gap-2 rounded-xl border border-border-base bg-card px-4 py-2.5"
            >
              <span className="text-sm font-semibold text-foreground">{v.title}</span>
              <span className="text-xs text-muted">{v.sub}</span>
            </li>
          ))}
        </ul>

        {/* Four functional wings */}
        <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border-base bg-border-base lg:grid-cols-4">
          {blocks.map((b, i) => (
            <div key={b.code} className="bg-card px-5 py-6">
              <div className={`text-2xl font-bold tracking-tight ${BLOCK_ACCENT[i]}`}>{b.code}</div>
              <div className="mt-1 text-sm font-medium text-foreground">{b.title}</div>
            </div>
          ))}
        </div>
      </section>

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
              className="group rounded-2xl border border-border-base bg-card p-6 transition hover:border-brand hover:shadow-lg"
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
          <div key={it.name} className="rounded-2xl border border-border-base bg-card p-6 transition hover:border-brand hover:shadow-lg">
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
            <div key={it.name} className="rounded-2xl border border-border-base bg-card p-6 transition hover:border-brand hover:shadow-lg">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-2xl">{it.icon}</div>
              <h3 className="mt-4 font-semibold text-foreground">{it.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{it.desc}</p>
            </div>
          ))}
        </HomeSection>
      </div>

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
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-sky-500 px-6 py-14 text-center shadow-lg sm:px-12">
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <h2 className="relative text-2xl font-bold text-white sm:text-3xl">{t('ctaBannerTitle')}</h2>
          <p className="relative mx-auto mt-3 max-w-xl text-white/85">{t('ctaBannerLead')}</p>
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
    <section className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h2>
          <p className="mt-2 max-w-xl text-muted">{lead}</p>
        </div>
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-all hover:gap-2.5"
        >
          {viewAll} →
        </Link>
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  );
}
