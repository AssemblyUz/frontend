import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import PageHero from '@/components/PageHero';
import {
  findBlockContent,
  functionalBlocks,
  type FunctionalBlockContent,
} from '@/data/functionalBlocks';

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'blocks'});
  return {title: t('title'), description: t('lead')};
}

export default async function BlocksPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('blocks');
  const items = t.raw('items') as FunctionalBlockContent[];

  return (
    <>
      <PageHero title={t('title')} lead={t('lead')} />

      <div className="shell py-section-sm">
        <div className="grid gap-5 sm:grid-cols-2">
          {functionalBlocks.map((block) => {
            const content = findBlockContent(items, block.code);
            if (!content) return null;
            return (
              <Link
                key={block.slug}
                href={`/bloklar/${block.slug}`}
                className={`group rounded-2xl border bg-card p-5 transition hover:shadow-lg xs:p-6 sm:p-8 ${block.tone.border} ${block.tone.hoverBorder}`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold ${block.tone.badge}`}
                  >
                    {block.code}
                  </span>
                  <div>
                    <h2 className="font-semibold text-foreground">{content.name}</h2>
                    <p className={`text-sm ${block.tone.text}`}>{content.short}</p>
                  </div>
                </div>

                <p className="mt-5 leading-relaxed text-muted">{content.tagline}</p>

                <span
                  className={`mt-5 inline-flex items-center gap-1.5 py-1 text-sm font-semibold transition-all group-hover:gap-2.5 ${block.tone.text}`}
                >
                  {t('more')} →
                </span>
              </Link>
            );
          })}
        </div>

        <p className="mt-8 rounded-2xl border border-border-base bg-surface p-6 leading-relaxed text-muted">
          {t('indexNote')}
        </p>
      </div>
    </>
  );
}
