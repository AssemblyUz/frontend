'use client';

import {useRef, useState} from 'react';
import {useTranslations} from 'next-intl';
import {panelFetch, PanelError} from '@/lib/adminClient';
import {
  ACCEPT_IMAGES,
  MAX_PHOTOS,
  MAX_UPLOAD_BYTES,
  PHOTO_SIZES,
  type ContentLocale,
  type PanelPhoto,
  type PhotoSize,
} from '@/lib/adminTypes';
import ConfirmButton from './ConfirmButton';

/**
 * The article's photo gallery.
 *
 * Only available once the article exists: uploads are posted to
 * /articles/<slug>/photos/, so there is nothing to attach them to until the
 * article has a slug. The new-article form says so rather than showing a
 * dropzone that cannot work.
 */
export default function PhotoManager({
  slug,
  photos,
  onChange,
  locale,
  canEdit,
}: {
  slug: string;
  photos: PanelPhoto[];
  onChange: (photos: PanelPhoto[]) => void;
  locale: ContentLocale;
  canEdit: boolean;
}) {
  const t = useTranslations('admin.photos');
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const room = MAX_PHOTOS - photos.length;

  async function upload(files: FileList | File[]) {
    setError(null);
    const chosen = Array.from(files);
    if (chosen.length === 0) return;

    // Checked here as well as on the server so the editor is told immediately
    // rather than after a full upload round-trip. The server remains the
    // authority -- it counts stored photos too, which the browser cannot.
    if (chosen.length > room) {
      setError(t('toomany', {limit: MAX_PHOTOS, room: Math.max(room, 0)}));
      return;
    }
    const oversized = chosen.find((f) => f.size > MAX_UPLOAD_BYTES);
    if (oversized) {
      setError(t('toolarge', {name: oversized.name, limit: MAX_UPLOAD_BYTES / 1024 / 1024}));
      return;
    }

    const form = new FormData();
    for (const file of chosen) {
      form.append('images', file);
      form.append('sizes', 'full');
    }

    setBusy(true);
    try {
      const created = await panelFetch<PanelPhoto[]>(`articles/${slug}/photos/`, {
        method: 'POST',
        form,
      });
      onChange([...photos, ...created]);
    } catch (caught) {
      setError(caught instanceof PanelError ? caught.detail : t('uploadFailed'));
    } finally {
      setBusy(false);
      // Clear the input or picking the same file twice in a row does nothing.
      if (input.current) input.current.value = '';
    }
  }

  async function patch(photo: PanelPhoto, changes: Partial<PanelPhoto>) {
    // Applied locally first: a size or caption change that waited on the
    // network would feel broken while typing.
    onChange(photos.map((p) => (p.id === photo.id ? {...p, ...changes} : p)));
    try {
      await panelFetch<PanelPhoto>(`photos/${photo.id}/`, {method: 'PATCH', json: changes});
    } catch (caught) {
      setError(caught instanceof PanelError ? caught.detail : t('saveFailed'));
      onChange(photos); // roll back to what the server still holds
    }
  }

  async function remove(photo: PanelPhoto) {
    try {
      await panelFetch(`photos/${photo.id}/`, {method: 'DELETE'});
      onChange(photos.filter((p) => p.id !== photo.id));
    } catch (caught) {
      setError(caught instanceof PanelError ? caught.detail : t('deleteFailed'));
    }
  }

  /** Swap with the neighbour, then persist both new positions. */
  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= photos.length) return;

    const next = [...photos];
    [next[index], next[target]] = [next[target], next[index]];
    const reordered = next.map((p, i) => ({...p, order: i}));
    onChange(reordered);

    try {
      await Promise.all(
        reordered.map((p) =>
          panelFetch(`photos/${p.id}/`, {method: 'PATCH', json: {order: p.order}}),
        ),
      );
    } catch {
      setError(t('saveFailed'));
    }
  }

  const altKey = `alt_${locale}` as const;

  return (
    <section>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-bold text-foreground">{t('title')}</h2>
          <p className="mt-0.5 text-xs text-muted">
            {t('counter', {count: photos.length, limit: MAX_PHOTOS})}
            {photos.length > 0 && ` · ${t('firstIsCover')}`}
          </p>
        </div>
      </div>

      {canEdit && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            if (room > 0) upload(e.dataTransfer.files);
          }}
          className={`rounded-2xl border border-dashed p-6 text-center transition ${
            dragging ? 'border-brand bg-brand/5' : 'border-border-base bg-surface'
          } ${room <= 0 ? 'opacity-60' : ''}`}
        >
          <input
            ref={input}
            type="file"
            accept={ACCEPT_IMAGES}
            multiple
            disabled={busy || room <= 0}
            onChange={(e) => e.target.files && upload(e.target.files)}
            className="hidden"
            id="photo-input"
          />
          <label
            htmlFor="photo-input"
            className={`inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-brand-fg transition hover:bg-brand-strong ${
              busy || room <= 0 ? 'pointer-events-none opacity-60' : 'cursor-pointer'
            }`}
          >
            {busy ? t('uploading') : t('choose')}
          </label>
          <p className="mt-2 text-xs text-muted">
            {room > 0 ? t('hint', {room}) : t('full', {limit: MAX_PHOTOS})}
          </p>
        </div>
      )}

      {error && (
        <p
          role="alert"
          className="mt-3 rounded-xl border border-accent/30 bg-accent/10 px-3.5 py-2.5 text-sm text-accent"
        >
          {error}
        </p>
      )}

      {photos.length > 0 && (
        <ul className="mt-4 space-y-3">
          {photos.map((photo, index) => (
            <li
              key={photo.id}
              className="flex flex-col gap-3 rounded-2xl border border-border-base bg-card p-3 sm:flex-row sm:items-start"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- matches
                  Logo.tsx; no next/image host config exists for media. */}
              <img
                src={photo.url}
                alt=""
                width={128}
                height={96}
                className="h-24 w-full shrink-0 rounded-xl object-cover sm:w-32"
              />

              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  {index === 0 && (
                    <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-semibold text-brand">
                      {t('cover')}
                    </span>
                  )}
                  <div className="inline-flex rounded-lg border border-border-base p-0.5">
                    {PHOTO_SIZES.map((size) => (
                      <button
                        key={size}
                        type="button"
                        disabled={!canEdit}
                        onClick={() => patch(photo, {size: size as PhotoSize})}
                        className={`rounded px-2 py-1 text-xs font-semibold transition ${
                          photo.size === size
                            ? 'bg-brand text-brand-fg'
                            : 'text-muted hover:text-foreground'
                        }`}
                      >
                        {t(`size.${size}`)}
                      </button>
                    ))}
                  </div>
                </div>

                <input
                  type="text"
                  value={photo[altKey]}
                  disabled={!canEdit}
                  placeholder={t('altPlaceholder')}
                  onChange={(e) => patch(photo, {[altKey]: e.target.value})}
                  className="w-full rounded-lg border border-border-base bg-surface px-2.5 py-1.5 text-xs text-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
              </div>

              {canEdit && (
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label={t('moveUp')}
                    className="rounded-lg px-2 py-1.5 text-xs font-semibold text-muted transition hover:bg-background hover:text-foreground disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === photos.length - 1}
                    aria-label={t('moveDown')}
                    className="rounded-lg px-2 py-1.5 text-xs font-semibold text-muted transition hover:bg-background hover:text-foreground disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <ConfirmButton
                    onConfirm={() => remove(photo)}
                    label={t('remove')}
                    confirmLabel={t('confirmRemove')}
                    busyLabel={t('removing')}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
