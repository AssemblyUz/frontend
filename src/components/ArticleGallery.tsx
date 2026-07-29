import type {ArticlePhoto} from '@/lib/news';

/**
 * Photos attached to an article, each at the width its editor chose in the
 * admin. `full` spans the column, `half` pairs up once there is room for two,
 * `thumb` reaches three-up on a tablet — and below `xs` every size collapses to
 * one column, since a third of a 360px screen shows nothing legible.
 */
const WIDTH: Record<ArticlePhoto['size'], string> = {
  full: 'col-span-6',
  half: 'col-span-6 xs:col-span-3',
  thumb: 'col-span-6 xs:col-span-3 sm:col-span-2',
};

/**
 * Each photo sits in a frame of a fixed shape.
 *
 * Photos arrive straight from a phone, so one rendered at its own proportions
 * across the column stood some 700px tall: it filled the viewport and pushed
 * anything after it out of view, with no hint that more photos followed.
 *
 * The shapes match what cameras produce — 4:3 for the smaller widths, a wider
 * 3:2 for a photo given the whole column, capped so a lead photo cannot outgrow
 * the screen on a short window. Anything else is contained inside, not cropped.
 *
 * The frame is also the layout reservation. Photo dimensions are not stored
 * server-side, so there is nothing to size a box from; one whose shape is known
 * in advance cannot shift when the image loads. The width and height attributes
 * this replaces were fixed guesses that were wrong for every portrait photo.
 */
const FRAME: Record<ArticlePhoto['size'], string> = {
  full: 'aspect-[3/2] max-h-[58dvh]',
  half: 'aspect-[4/3]',
  thumb: 'aspect-[4/3]',
};

export default function ArticleGallery({photos}: {photos: ArticlePhoto[]}) {
  if (photos.length === 0) return null;

  return (
    <div className="mt-10 grid grid-cols-6 gap-3 sm:gap-4">
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
