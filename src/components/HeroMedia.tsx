/* eslint-disable @next/next/no-img-element */

import {heroPhotoColumns} from '@/data/heroPhotos';

/**
 * The hero's media wall: columns of press photographs drifting in alternating
 * directions, fading out at the top and bottom.
 *
 * Animated entirely in CSS — no client component, so it adds nothing to the
 * JavaScript bundle. Each column's list is rendered twice and the track travels
 * exactly half its height, which makes the loop seamless; the duplicate `img`
 * tags reuse the same files, so they cost no extra bytes.
 *
 * The collage is one image as far as assistive technology is concerned: the
 * region carries the description and the individual photos are marked
 * decorative, since no single one of them carries meaning on its own.
 *
 * Three columns from the `sm` breakpoint; the third is dropped on phones, where
 * thirds would leave the cards too small to read.
 */
const TRACK = [
  'hero-marquee-up',
  'hero-marquee-down',
  'hero-marquee-up-slow',
] as const;
export default function HeroMedia({badge, label}: {badge: string; label: string}) {
  return (
    <div className="relative">
      {/* A softer radius on phones: a 64px blur over this area is one of the
          more expensive things a mid-range device paints, and at this size the
          difference between the two is not visible. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-8 rounded-[3rem] bg-brand/10 blur-2xl dark:bg-brand/15 sm:blur-3xl"
      />

      <div
        role="img"
        aria-label={label}
        /* Every step is capped against the viewport as well as the breakpoint.
           A phone turned sideways is 844px wide and 390px tall — wide enough
           to pass `sm`, so a plain `sm:h-[26rem]` made the wall taller than the
           whole screen. The dvh cap is what actually governs there, and the rem
           value governs everywhere the window is a normal shape. `dvh` rather
           than `vh` so the browser's retracting toolbar is counted. */
        className="hero-marquee hero-marquee-mask relative grid h-[min(22rem,60dvh)] grid-cols-2 gap-2.5 overflow-hidden xs:gap-3 sm:h-[min(26rem,70dvh)] sm:grid-cols-3 lg:h-[min(30rem,78dvh)] xl:h-[min(34rem,78dvh)]"
      >
        {heroPhotoColumns.map((column, index) => (
          <div
            key={index}
            className={`flex-col gap-2.5 xs:gap-3 ${TRACK[index % TRACK.length]} ${
              index === 2 ? 'hidden sm:flex' : 'flex'
            }`}
          >
            {[...column, ...column].map((photo, position) => (
              <figure
                key={`${photo.slug}-${position}`}
                className="group relative shrink-0 overflow-hidden rounded-2xl border border-border-base bg-card shadow-lg shadow-slate-900/10 dark:shadow-black/40"
              >
                <img
                  src={`/press/${photo.slug}.webp`}
                  alt=""
                  width={photo.width}
                  height={photo.height}
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-20"
                />
              </figure>
            ))}
          </div>
        ))}
      </div>

      {/* Sits over the wall's lower edge, where the mask has faded the photos out. */}
      <span className="pointer-events-none absolute -bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-border-base bg-surface/90 px-3.5 py-1.5 text-xs font-medium text-muted shadow-sm backdrop-blur">
        <span aria-hidden className="relative flex h-1.5 w-1.5">
          <span className="hero-pulse absolute inset-0 rounded-full bg-brand" />
          <span className="relative h-1.5 w-1.5 rounded-full bg-brand" />
        </span>
        {badge}
      </span>
    </div>
  );
}
