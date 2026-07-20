'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {useRouter} from '@/i18n/navigation';
import {panelFetch, PanelError} from '@/lib/adminClient';
import {
  EMPTY_DRAFT,
  LOCALES,
  type ArticleDraft,
  type ContentLocale,
  type PanelArticle,
  type PanelPhoto,
} from '@/lib/adminTypes';
import {slugify} from '@/lib/slugify';
import {useAdminSession} from './AdminSessionProvider';
import LocaleTabs from './LocaleTabs';
import PhotoManager from './PhotoManager';
import ConfirmButton from './ConfirmButton';

const inputCls =
  'w-full rounded-xl border border-border-base bg-surface px-3.5 py-2.5 text-sm text-foreground transition placeholder:text-muted/60 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30';
const labelCls = 'mb-1.5 block text-sm font-semibold text-foreground';
const hintCls = 'mt-1 text-xs text-muted';
const errCls = 'mt-1 text-xs font-medium text-accent';

export default function ArticleForm({article}: {article?: PanelArticle}) {
  const t = useTranslations('admin.form');
  const router = useRouter();
  const user = useAdminSession();

  const isNew = !article;
  const [draft, setDraft] = useState<ArticleDraft>(() =>
    article
      ? {...EMPTY_DRAFT, ...article}
      : {...EMPTY_DRAFT, published_on: new Date().toISOString().slice(0, 10)},
  );
  const [photos, setPhotos] = useState<PanelPhoto[]>(article?.images ?? []);
  const [locale, setLocale] = useState<ContentLocale>('uz');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // A language counts as incomplete when its title is blank -- the same rule
  // the backend's missing_translations() uses, so the dot and the badge on the
  // dashboard never disagree.
  const incomplete = LOCALES.filter((l) => !draft[`title_${l}`].trim());

  function set<K extends keyof ArticleDraft>(key: K, value: ArticleDraft[K]) {
    setDraft((current) => ({...current, [key]: value}));
    // Clear this field's server error as soon as it is edited, so a stale
    // message does not sit under an input the editor has already fixed.
    setFieldErrors((current) => {
      if (!(key in current)) return current;
      const rest = {...current};
      delete rest[key as string];
      return rest;
    });
  }

  /** Derive the slug from the Uzbek title, but never overwrite a published one. */
  function handleTitleUz(value: string) {
    setDraft((current) => ({
      ...current,
      title_uz: value,
      slug: isNew && !current.slug.trim() ? slugify(value) : current.slug,
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});
    setBusy(true);

    try {
      const saved = await panelFetch<PanelArticle>(
        isNew ? 'articles/' : `articles/${article.slug}/`,
        {method: isNew ? 'POST' : 'PATCH', json: draft},
      );
      // Land on the edit page: a new article has no photos yet, and photos can
      // only be attached once it exists.
      router.replace(`/admin/${saved.slug}/tahrir`);
      router.refresh();
    } catch (caught) {
      if (caught instanceof PanelError) {
        setError(caught.detail);
        if (caught.fields) {
          setFieldErrors(caught.fields);
          // Jump to the language that actually holds the rejected field, or the
          // message points at an input the editor cannot see.
          const offending = LOCALES.find((l) =>
            Object.keys(caught.fields!).some((k) => k.endsWith(`_${l}`)),
          );
          if (offending) setLocale(offending);
        }
      } else {
        setError(t('saveFailed'));
      }
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!article) return;
    try {
      await panelFetch(`articles/${article.slug}/`, {method: 'DELETE'});
      router.replace('/admin');
      router.refresh();
    } catch (caught) {
      setError(caught instanceof PanelError ? caught.detail : t('deleteFailed'));
    }
  }

  const field = (name: string) => fieldErrors[name];

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <p
          role="alert"
          className="mb-5 rounded-xl border border-accent/30 bg-accent/10 px-3.5 py-2.5 text-sm text-accent"
        >
          {error}
        </p>
      )}

      {/* Settings that are the same in every language */}
      <section className="rounded-2xl border border-border-base bg-card p-5">
        <h2 className="mb-4 text-sm font-bold text-foreground">{t('settings')}</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="slug" className={labelCls}>
              {t('slug')}
            </label>
            <input
              id="slug"
              value={draft.slug}
              onChange={(e) => set('slug', e.target.value)}
              required
              className={inputCls}
            />
            <p className={hintCls}>{isNew ? t('slugHint') : t('slugWarning')}</p>
            {field('slug') && <p className={errCls}>{field('slug')}</p>}
          </div>

          <div>
            <label htmlFor="published_on" className={labelCls}>
              {t('date')}
            </label>
            <input
              id="published_on"
              type="date"
              value={draft.published_on}
              onChange={(e) => set('published_on', e.target.value)}
              required
              className={inputCls}
            />
            <p className={hintCls}>{t('dateHint')}</p>
            {field('published_on') && <p className={errCls}>{field('published_on')}</p>}
          </div>

          <div>
            <label htmlFor="icon" className={labelCls}>
              {t('icon')}
            </label>
            <input
              id="icon"
              value={draft.icon}
              onChange={(e) => set('icon', e.target.value)}
              maxLength={8}
              className={`${inputCls} text-xl`}
            />
            <p className={hintCls}>{t('iconHint')}</p>
          </div>

          <div className="flex items-end">
            <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-border-base bg-surface px-3.5 py-2.5">
              <input
                type="checkbox"
                checked={draft.is_published}
                disabled={!user.canPublish}
                onChange={(e) => set('is_published', e.target.checked)}
                className="h-4 w-4 accent-[var(--brand)]"
              />
              <span className="text-sm font-semibold text-foreground">{t('published')}</span>
            </label>
          </div>
        </div>
      </section>

      {/* Per-language content */}
      <section className="mt-5 rounded-2xl border border-border-base bg-card p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-foreground">{t('content')}</h2>
          <LocaleTabs active={locale} onChange={setLocale} incomplete={incomplete} />
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor={`title_${locale}`} className={labelCls}>
              {t('titleField')}
            </label>
            <input
              id={`title_${locale}`}
              value={draft[`title_${locale}`]}
              onChange={(e) =>
                locale === 'uz'
                  ? handleTitleUz(e.target.value)
                  : set(`title_${locale}`, e.target.value)
              }
              className={inputCls}
            />
            {field(`title_${locale}`) && <p className={errCls}>{field(`title_${locale}`)}</p>}
          </div>

          <div>
            <label htmlFor={`tag_${locale}`} className={labelCls}>
              {t('tag')}
            </label>
            <input
              id={`tag_${locale}`}
              value={draft[`tag_${locale}`]}
              onChange={(e) => set(`tag_${locale}`, e.target.value)}
              className={inputCls}
            />
          </div>

          <div>
            <label htmlFor={`excerpt_${locale}`} className={labelCls}>
              {t('excerpt')}
            </label>
            <textarea
              id={`excerpt_${locale}`}
              value={draft[`excerpt_${locale}`]}
              onChange={(e) => set(`excerpt_${locale}`, e.target.value)}
              className={`${inputCls} min-h-[80px] resize-y`}
            />
            <p className={hintCls}>{t('excerptHint')}</p>
          </div>

          <div>
            <label htmlFor={`body_${locale}`} className={labelCls}>
              {t('body')}
            </label>
            <textarea
              id={`body_${locale}`}
              value={draft[`body_${locale}`]}
              onChange={(e) => set(`body_${locale}`, e.target.value)}
              className={`${inputCls} min-h-[260px] resize-y leading-relaxed`}
            />
            <p className={hintCls}>{t('bodyHint')}</p>
          </div>
        </div>
      </section>

      {/* Photos */}
      <section className="mt-5 rounded-2xl border border-border-base bg-card p-5">
        {isNew ? (
          <>
            <h2 className="text-sm font-bold text-foreground">{t('photosTitle')}</h2>
            <p className="mt-1.5 text-sm text-muted">{t('photosAfterSave')}</p>
          </>
        ) : (
          <PhotoManager
            slug={article.slug}
            photos={photos}
            onChange={setPhotos}
            locale={locale}
            canEdit={user.canUploadPhotos}
          />
        )}
      </section>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-brand-fg transition hover:bg-brand-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 disabled:opacity-60"
        >
          {busy ? t('saving') : isNew ? t('create') : t('save')}
        </button>

        {!isNew && user.canDelete && (
          <ConfirmButton
            onConfirm={handleDelete}
            label={t('delete')}
            confirmLabel={t('confirmDelete')}
            busyLabel={t('deleting')}
            className="ml-auto"
          />
        )}
      </div>
    </form>
  );
}
