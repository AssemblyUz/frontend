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
  const [saved, setSaved] = useState(false);
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

  /**
   * Fill an empty slug from whichever title has content, preferring Uzbek.
   *
   * It used to derive from the Uzbek title alone, so an editor writing the
   * Russian version first was left with an empty slug — and the form silently
   * refused to submit. A slug already on the article is never overwritten.
   */
  function handleTitle(target: ContentLocale, value: string) {
    setDraft((current) => {
      const next = {...current, [`title_${target}`]: value};
      if (isNew && !current.slug.trim()) {
        const derived = LOCALES.map((l) => slugify(next[`title_${l}`])).find(Boolean);
        if (derived) next.slug = derived;
      }
      return next;
    });
    setFieldErrors((current) => {
      const key = `title_${target}`;
      if (!(key in current) && !('slug' in current)) return current;
      const rest = {...current};
      delete rest[key];
      delete rest.slug;
      return rest;
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});
    setSaved(false);

    // Checked here rather than with a native `required`: the slug sits in the
    // settings column, and the browser's own validation blocks the submit with
    // a tooltip on a field the editor may not have scrolled to — which reads as
    // "the button does nothing".
    if (!draft.slug.trim()) {
      setFieldErrors({slug: t('slugRequired')});
      setError(t('slugRequired'));
      document.getElementById('slug')?.focus();
      return;
    }

    setBusy(true);

    try {
      const result = await panelFetch<PanelArticle>(
        isNew ? 'articles/' : `articles/${article.slug}/`,
        {method: isNew ? 'POST' : 'PATCH', json: draft},
      );
      // A new article moves to its edit page — photos can only be attached once
      // it exists. Editing stays put, unless the slug itself changed.
      if (isNew || result.slug !== article.slug) {
        router.replace(`/admin/${result.slug}/tahrir`);
        router.refresh();
        return; // this page is going away; leave the button disabled
      }

      // Same URL, so nothing unmounts: the button has to be handed back here.
      // Without this it stayed on "Saving…" forever after a successful edit,
      // which reads as the save having hung.
      router.refresh();
      setBusy(false);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 4000);
    } catch (caught) {
      if (caught instanceof PanelError) {
        // A validation failure gets a localised banner: PanelError's fallback
        // detail is an English string, and the specifics are already shown
        // under the individual inputs.
        setError(
          caught.isTransport
            ? t('serverError', {status: caught.status})
            : caught.fields
              ? t('checkFields')
              : caught.detail,
        );
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
              onChange={(e) => handleTitle(locale, e.target.value)}
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

        {saved && (
          <span role="status" className="text-sm font-medium text-accent">
            {t('saved')}
          </span>
        )}

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
