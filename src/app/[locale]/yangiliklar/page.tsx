import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import PageHero from '@/components/PageHero';
import NewsCard from '@/components/NewsCard';
import {getNews} from '@/lib/news';

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

      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        {items.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border-base bg-card px-6 py-16 text-center text-muted">
            {t('empty')}
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <NewsCard key={item.slug} item={item} readMore={t('readMore')} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
