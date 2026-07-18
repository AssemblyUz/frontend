import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';
import {getAssociation, allAssociationIds} from '@/data/associations';

export function generateStaticParams() {
  const ids = allAssociationIds();
  return routing.locales.flatMap((locale) => ids.map((id) => ({locale, id})));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string; id: string}>;
}): Promise<Metadata> {
  const {locale, id} = await params;
  const assoc = getAssociation(id, locale);
  if (!assoc) return {};
  return {title: assoc.name, description: assoc.activity};
}

function monogram(name: string) {
  const m = name.match(/[A-Za-zА-Яа-яЁёЎўҚқҒғҲҳ0-9]/);
  return (m ? m[0] : name.charAt(0)).toUpperCase();
}

export default async function AssociationDetailPage({
  params,
}: {
  params: Promise<{locale: string; id: string}>;
}) {
  const {locale, id} = await params;
  setRequestLocale(locale);
  const assoc = getAssociation(id, locale);
  if (!assoc) notFound();

  const t = await getTranslations('associations');

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <Link
        href="/uyushmalar"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-brand"
      >
        ← {t('backToList')}
      </Link>

      <header className="mt-6 flex items-start gap-4 border-b border-border-base pb-8">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-3xl font-bold text-brand">
          {monogram(assoc.name)}
        </span>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-brand">{t('title')}</p>
          <h1 className="mt-1 text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl">
            {assoc.name}
          </h1>
        </div>
      </header>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-foreground">{t('aboutTitle')}</h2>
        <p className="mt-3 leading-relaxed text-muted">{t('about', {name: assoc.name})}</p>

        {assoc.activity && (
          <div className="mt-6 rounded-2xl border border-border-base bg-card p-5">
            <p className="text-sm font-medium text-foreground">{t('activityLabel')}</p>
            <p className="mt-1 leading-relaxed text-muted">{assoc.activity}</p>
          </div>
        )}
      </section>
    </article>
  );
}
