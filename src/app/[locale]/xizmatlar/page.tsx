import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import PageHero from '@/components/PageHero';

type Item = {icon: string; name: string; desc: string};

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'services'});
  return {title: t('title'), description: t('lead')};
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('services');
  const items = t.raw('items') as Item[];

  return (
    <>
      <PageHero title={t('title')} lead={t('lead')} />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <article
              key={it.name}
              className="flex gap-4 rounded-2xl border border-border-base bg-card p-6 transition hover:border-brand hover:shadow-lg"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/15 to-sky-500/15 text-2xl">
                {it.icon}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  <span className="text-muted">{String(i + 1).padStart(2, '0')}. </span>
                  {it.name}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{it.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
