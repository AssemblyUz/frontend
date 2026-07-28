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

/**
 * Every photo gets a fixed frame: tall enough to read, short enough to fit on
 * screen beside some text.
 *
 * Photos arrive straight from a phone, so a 4000x3000 shot rendered at the
 * column's own width stood some 700px tall — one photo filled the viewport and
 * pushed the next entirely out of view, leaving no sense of how many there were.
 *
 * The frame doubles as the layout reservation. Photo dimensions are not stored
 * server-side, so there is nothing to size the box from; one that does not
 * depend on the image cannot shift when it loads. Viewport units with a rem
 * ceiling: proportional on a laptop, not absurd on a large monitor.
 */
const FRAME: Record<ArticlePhoto['size'], string> = {
  full: 'h-[58vh] max-h-[32rem] min-h-[15rem]',
  half: 'h-[38vh] max-h-[21rem] min-h-[12rem]',
  thumb: 'h-[26vh] max-h-[14rem] min-h-[9rem]',
};

export default function ArticleGallery({photos}: {photos: ArticlePhoto[]}) {
  if (photos.length === 0) return null;

  return (
    <div className="mt-10 grid grid-cols-6 gap-4">
      {photos.map((photo) => (
        <figure key={photo.url} className={WIDTH[photo.size]}>
          <div
            className={`flex items-center justify-center overflow-hidden rounded-2xl border border-border-base bg-surface ${FRAME[photo.size]}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- matches
                Logo.tsx; no next/image host config exists for uploaded media. */}
            <img
              src={photo.url}
              alt={photo.alt}
              loading="lazy"
              // `contain`, not `cover`: a photo the editor chose to publish is
              // shown whole rather than cropped to fill the frame.
              className="h-full w-full object-contain"
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
