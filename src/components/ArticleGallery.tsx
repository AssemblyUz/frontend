import type {ArticlePhoto} from '@/lib/news';

/**
 * Photos attached to an article, each at the width its editor chose in the
 * admin. `full` spans the column, `half` pairs up on wide screens, `thumb`
 * sits three-up — all collapse to one column on mobile, where anything
 * narrower than full width is unreadable.
 */
const WIDTH: Record<ArticlePhoto['size'], string> = {
  full: 'col-span-6',
  half: 'col-span-6 sm:col-span-3',
  thumb: 'col-span-6 sm:col-span-2',
};

/** Intrinsic hints matching the rendered width, so the layout does not shift. */
const DIMENSIONS: Record<ArticlePhoto['size'], {width: number; height: number}> = {
  full: {width: 1280, height: 720},
  half: {width: 640, height: 480},
  thumb: {width: 420, height: 420},
};

export default function ArticleGallery({photos}: {photos: ArticlePhoto[]}) {
  if (photos.length === 0) return null;

  return (
    <div className="mt-10 grid grid-cols-6 gap-4">
      {photos.map((photo) => (
        <figure key={photo.url} className={WIDTH[photo.size]}>
          <div className="overflow-hidden rounded-2xl border border-border-base bg-surface">
            {/* eslint-disable-next-line @next/next/no-img-element -- matches
                Logo.tsx; no next/image host config exists for uploaded media. */}
            <img
              src={photo.url}
              alt={photo.alt}
              loading="lazy"
              width={DIMENSIONS[photo.size].width}
              height={DIMENSIONS[photo.size].height}
              className="h-auto w-full object-cover"
            />
          </div>
          {photo.alt && (
            <figcaption className="mt-2 text-xs leading-relaxed text-muted">
              {photo.alt}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
