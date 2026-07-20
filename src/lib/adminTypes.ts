/**
 * Wire shapes for the control panel API (`/api/admin/`).
 *
 * These mirror `backend/adminapi/serializers.py` and `views.describe()`. Unlike
 * the public API, nothing here is flattened by `?locale=` — the panel edits the
 * raw per-locale columns, so an editor sets `title_uz`, `title_ru` and
 * `title_en` individually.
 */

export const LOCALES = ['uz', 'ru', 'en'] as const;
export type ContentLocale = (typeof LOCALES)[number];

/** Fields that exist once per locale. */
export const TRANSLATED_FIELDS = ['tag', 'title', 'excerpt', 'body'] as const;
export type TranslatedField = (typeof TRANSLATED_FIELDS)[number];

export const PHOTO_SIZES = ['full', 'half', 'thumb'] as const;
export type PhotoSize = (typeof PHOTO_SIZES)[number];

/** Mirrors ArticleImage.MAX_PER_ARTICLE. The server enforces it regardless. */
export const MAX_PHOTOS = 10;

/** Mirrors news/validators.py MAX_UPLOAD_BYTES. */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export const ACCEPT_IMAGES = 'image/jpeg,image/png,image/webp,image/avif,image/gif';

export type PanelUser = {
  username: string;
  name: string;
  email: string;
  isSuperuser: boolean;
  canCreate: boolean;
  canPublish: boolean;
  canDelete: boolean;
  canUploadPhotos: boolean;
};

export type PanelPhoto = {
  id: number;
  url: string;
  size: PhotoSize;
  order: number;
  alt_uz: string;
  alt_ru: string;
  alt_en: string;
};

/** Row shape for the dashboard table. */
export type PanelArticleRow = {
  id: number;
  slug: string;
  title_uz: string;
  title_ru: string;
  title_en: string;
  published_on: string;
  is_published: boolean;
  cover: string | null;
  photo_count: number;
  missing_translations: ContentLocale[];
  updated_at: string;
};

/** Full shape for the editor. */
export type PanelArticle = {
  id: number;
  slug: string;
  published_on: string;
  icon: string;
  is_published: boolean;
  tag_uz: string; tag_ru: string; tag_en: string;
  title_uz: string; title_ru: string; title_en: string;
  excerpt_uz: string; excerpt_ru: string; excerpt_en: string;
  body_uz: string; body_ru: string; body_en: string;
  images: PanelPhoto[];
  missing_translations: ContentLocale[];
  created_at: string;
  updated_at: string;
};

/** What the form edits — the article minus everything the server owns. */
export type ArticleDraft = Omit<
  PanelArticle,
  'id' | 'images' | 'missing_translations' | 'created_at' | 'updated_at'
>;

export const EMPTY_DRAFT: ArticleDraft = {
  slug: '',
  published_on: '',
  icon: '📰',
  is_published: false,
  tag_uz: '', tag_ru: '', tag_en: '',
  title_uz: '', title_ru: '', title_en: '',
  excerpt_uz: '', excerpt_ru: '', excerpt_en: '',
  body_uz: '', body_ru: '', body_en: '',
};

/**
 * Published, scheduled or draft.
 *
 * Mirrors PublishedArticleManager: live means the flag is on AND the date has
 * arrived. A future date is a scheduled post, not a mistake, so the panel says
 * so rather than showing it as published when the site does not.
 */
export function articleStatus(
  article: {is_published: boolean; published_on: string},
  today: string,
): 'published' | 'scheduled' | 'draft' {
  if (!article.is_published) return 'draft';
  return article.published_on > today ? 'scheduled' : 'published';
}
