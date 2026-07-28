import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import PageHero from '@/components/PageHero';
import {getProjectLink} from '@/data/projectLinks';

type Item = {icon: string; name: string; desc: string};

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'projects'});
  return {title: t('title'), description: t('lead')};
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('projects');
  const items = t.raw('items') as Item[];

  return (
    <>
      <PageHero title={t('title')} lead={t('lead')} />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => {
            const url = getProjectLink(it.name);
            const cardClass =
              'flex h-full flex-col rounded-2xl border border-border-base bg-card p-6 transition';
            const inner = (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-2xl">
                    {it.icon}
                  </div>
                  <span className="text-sm font-bold tabular-nums text-muted">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h2 className="mt-4 text-base font-semibold leading-snug text-foreground">
                  {it.name}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{it.desc}</p>
                <div className="mt-5">
                  {url ? (
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition group-hover:gap-2.5">
                      {t('visit')} →
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground/5 px-3 py-1 text-xs font-medium text-muted">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      {t('inDevelopment')}
                    </span>
                  )}
                </div>
              </>
            );

            return url ? (
              <a
                key={it.name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group ${cardClass} hover:-translate-y-0.5 hover:border-brand hover:shadow-lg`}
              >
                {inner}
              </a>
            ) : (
              <article key={it.name} className={cardClass}>
                {inner}
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
