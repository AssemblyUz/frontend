'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {articleStatus, type PanelArticleRow} from '@/lib/adminTypes';
import {StatusPill, TranslationGaps} from './Badges';

type Filter = 'all' | 'published' | 'draft' | 'gaps';

export default function ArticleList({
  rows,
  today,
}: {
  rows: PanelArticleRow[];
  today: string;
}) {
  const t = useTranslations('admin');
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const filtered = rows.filter((row) => {
    const status = articleStatus(row, today);
    if (filter === 'published' && status !== 'published') return false;
    if (filter === 'draft' && status === 'published') return false;
    if (filter === 'gaps' && row.missing_translations.length === 0) return false;

    if (!query.trim()) return true;
    const needle = query.trim().toLowerCase();
    return [row.title_uz, row.title_ru, row.title_en, row.slug].some((v) =>
      v.toLowerCase().includes(needle),
    );
  });

  const FILTERS: Filter[] = ['all', 'published', 'draft', 'gaps'];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-xl border border-border-base bg-surface p-1">
          {FILTERS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 ${
                filter === key
                  ? 'bg-brand text-brand-fg'
                  : 'text-muted hover:bg-background hover:text-foreground'
              }`}
            >
              {t(`filter.${key}`)}
            </button>
          ))}
        </div>

        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('search')}
          className="ml-auto w-full rounded-xl border border-border-base bg-surface px-3.5 py-2 text-sm text-foreground placeholder:text-muted/60 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 sm:w-64"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border-base bg-card px-6 py-16 text-center text-muted">
          {t('noMatches')}
        </p>
      ) : (
        <ul className="space-y-2.5">
          {filtered.map((row) => (
            <li key={row.id}>
              <Link
                href={`/admin/${row.slug}/tahrir`}
                className="group flex items-center gap-4 rounded-2xl border border-border-base bg-card p-3 transition hover:border-brand hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
              >
                {row.cover ? (
                  /* eslint-disable-next-line @next/next/no-img-element -- matches
                     Logo.tsx; no next/image host config for media. */
                  <img
                    src={row.cover}
                    alt=""
                    width={80}
                    height={56}
                    className="h-14 w-20 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <span className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg bg-surface text-xs text-muted">
                    {t('noPhoto')}
                  </span>
                )}

                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold text-foreground group-hover:text-brand">
                    {row.title_uz || row.title_en || row.slug}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                    <time dateTime={row.published_on}>{row.published_on}</time>
                    {row.photo_count > 0 && <span>· {t('photoCount', {count: row.photo_count})}</span>}
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <StatusPill
                    status={articleStatus(row, today)}
                    label={t(`status.${articleStatus(row, today)}`)}
                  />
                  <TranslationGaps missing={row.missing_translations} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
