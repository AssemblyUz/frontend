import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import ArticleForm from '@/components/admin/ArticleForm';

export const dynamic = 'force-dynamic';

export default async function NewArticlePage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('admin');

  return (
    <div>
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-brand"
      >
        ← {t('backToDashboard')}
      </Link>
      <h1 className="mb-6 mt-4 text-2xl font-extrabold tracking-tight text-foreground">
        {t('newArticle')}
      </h1>
      <ArticleForm />
    </div>
  );
}
