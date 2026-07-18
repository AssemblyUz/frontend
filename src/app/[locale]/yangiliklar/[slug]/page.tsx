import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';
import NewsCard from '@/components/NewsCard';
import {getNews, getNewsItem, allNewsSlugs} from '@/data/news';

const RELATED_COUNT = 3;

export function generateStaticParams() {
  const slugs = allNewsSlugs();
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({locale, slug})));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string; slug: string}>;
}): Promise<Metadata> {
  const {locale, slug} = await params;
  const item = getNewsItem(slug, locale);
  if (!item) return {};
  return {title: item.title, description: item.excerpt};
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{locale: string; slug: string}>;
}) {
  const {locale, slug} = await params;
  setRequestLocale(locale);
  const item = getNewsItem(slug, locale);
  if (!item) notFound();

  const t = await getTranslations('news');
  const related = getNews(locale)
    .filter((n) => n.slug !== item.slug)
    .slice(0, RELATED_COUNT);

  return (
    <>
      <article className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <Link
          href="/yangiliklar"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-brand"
        >
          ← {t('backToList')}
        </Link>

        <header className="mt-6 border-b border-border-base pb-8">
          <div className="flex items-center gap-3">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-3xl">
              {item.icon}
            </span>
            <div>
              <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand">
                {item.tag}
              </span>
              <time dateTime={item.date} className="ml-2 text-xs font-medium text-muted">
                {item.dateLabel}
              </time>
            </div>
          </div>

          <h1 className="mt-5 text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl">
            {item.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">{item.excerpt}</p>
        </header>

        <div className="mt-8 space-y-5">
          {item.body.map((paragraph, i) => (
            // Static, never-reordered array — index is a stable key here.
            <p key={i} className="leading-relaxed text-muted">
              {paragraph}
            </p>
          ))}
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-border-base bg-surface/60">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">{t('relatedTitle')}</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((n) => (
                <NewsCard key={n.slug} item={n} readMore={t('readMore')} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
