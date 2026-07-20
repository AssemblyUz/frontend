import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {panelGet} from '@/lib/adminServer';
import {articleStatus, type PanelArticleRow} from '@/lib/adminTypes';
import ArticleList from '@/components/admin/ArticleList';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations('admin');
  const rows = await panelGet<PanelArticleRow[]>('articles/');

  const today = new Date().toISOString().slice(0, 10);
  const stats = [
    {key: 'total', value: rows.length},
    {
      key: 'published',
      value: rows.filter((r) => articleStatus(r, today) === 'published').length,
    },
    {
      key: 'drafts',
      value: rows.filter((r) => articleStatus(r, today) !== 'published').length,
    },
    {key: 'gaps', value: rows.filter((r) => r.missing_translations.length > 0).length},
  ];

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
          {t('dashboard')}
        </h1>
        <Link
          href="/admin/yangi"
          className="rounded-xl bg-brand px-4 py-2.5 text-center text-sm font-semibold text-brand-fg transition hover:bg-brand-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
        >
          + {t('nav.newArticle')}
        </Link>
      </div>

      <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.key} className="rounded-2xl border border-border-base bg-card p-4">
            <div className="text-3xl font-extrabold tracking-tight text-foreground tabular-nums">
              {stat.value}
            </div>
            <div className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-muted">
              {t(`stats.${stat.key}`)}
            </div>
          </div>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-base bg-card py-20 text-center">
          <p className="text-muted">{t('noArticles')}</p>
          <Link
            href="/admin/yangi"
            className="mt-4 inline-block rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-brand-fg transition hover:bg-brand-strong"
          >
            + {t('nav.newArticle')}
          </Link>
        </div>
      ) : (
        <ArticleList rows={rows} today={today} />
      )}
    </div>
  );
}
