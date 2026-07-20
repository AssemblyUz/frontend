import {notFound} from 'next/navigation';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {panelGet, PanelServerError} from '@/lib/adminServer';
import type {PanelArticle} from '@/lib/adminTypes';
import ArticleForm from '@/components/admin/ArticleForm';

export const dynamic = 'force-dynamic';

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{locale: string; slug: string}>;
}) {
  const {locale, slug} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('admin');

  let article: PanelArticle;
  try {
    article = await panelGet<PanelArticle>(`articles/${encodeURIComponent(slug)}/`);
  } catch (error) {
    // A deleted or mistyped slug is a 404, not a crash. Anything else is a
    // real fault and should surface as one rather than being disguised.
    if (error instanceof PanelServerError && error.status === 404) notFound();
    throw error;
  }

  return (
    <div>
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-brand"
      >
        ← {t('backToDashboard')}
      </Link>

      <div className="mb-6 mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
          {t('editArticle')}
        </h1>
        <Link
          href={`/yangiliklar/${article.slug}`}
          className="text-sm font-semibold text-brand transition hover:underline"
        >
          {t('viewOnSite')} →
        </Link>
      </div>

      <ArticleForm article={article} />
    </div>
  );
}
