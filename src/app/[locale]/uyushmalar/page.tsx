import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import PageHero from '@/components/PageHero';
import AssociationsDirectory from '@/components/AssociationsDirectory';
import {getAssociations} from '@/data/associations';

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'associations'});
  return {title: t('title'), description: t('lead')};
}

export default async function AssociationsPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('associations');

  return (
    <>
      <PageHero title={t('title')} lead={t('lead')} />
      <section className="shell py-section-sm">
        <AssociationsDirectory
          items={getAssociations(locale).map(({id, name, activity}) => ({id, name, activity}))}
          labels={{
            searchPlaceholder: t('searchPlaceholder'),
            activityLabel: t('activityLabel'),
            details: t('details'),
            noResults: t('noResults'),
            unit: t('unit'),
          }}
        />
      </section>
    </>
  );
}
