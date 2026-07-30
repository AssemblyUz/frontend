import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import PageHero from '@/components/PageHero';
import RevealScope from '@/components/motion/RevealScope';
import NewsCard from '@/components/NewsCard';
import {getNews} from '@/lib/news';

/**
 * Rendered per request, never prerendered.
 *
 * `next build` runs inside Docker with no API to reach, so a prerender of this
 * page cannot contain a single real article — and every deploy ships that
 * render, serving it to whoever arrives before the first background refresh
 * finishes. Measured on the live site: three of four requests after a deploy
 * returned the build's content rather than the published articles.
 *
 * The five-minute cycle on the locale layout still governs everything else. This
 * page is the one whose whole purpose is to be current, and its cost is a single
 * query to a container on the same Docker network.
 */
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'news'});
  return {title: t('title'), description: t('lead')};
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('news');
  const items = await getNews(locale);

  return (
    <>
      <PageHero title={t('title')} lead={t('lead')} />

      <div className="shell py-section-sm">
        {items.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border-base bg-card px-6 py-16 text-center text-muted">
            {t('empty')}
          </p>
        ) : (
          <RevealScope stagger={80} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <NewsCard
                key={item.slug}
                item={item}
                readMore={t('readMore')}
                reveal
              />
            ))}
          </RevealScope>
        )}
      </div>
    </>
  );
}
