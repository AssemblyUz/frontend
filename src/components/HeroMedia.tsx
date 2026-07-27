/* eslint-disable @next/next/no-img-element */

import {heroPhotoColumns} from '@/data/heroPhotos';

/**
 * The hero's media wall: two columns of press photographs drifting in opposite
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
 */
export default function HeroMedia({badge, label}: {badge: string; label: string}) {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-8 rounded-[3rem] bg-brand/10 blur-3xl dark:bg-brand/15"
      />

      <div
        role="img"
        aria-label={label}
        className="hero-marquee hero-marquee-mask relative grid h-[22rem] grid-cols-2 gap-3 overflow-hidden sm:h-[26rem] sm:gap-4 lg:h-[34rem]"
      >
        {heroPhotoColumns.map((column, index) => (
          <div
            key={index}
            className={`flex flex-col gap-3 sm:gap-4 ${
              index % 2 === 0 ? 'hero-marquee-up' : 'hero-marquee-down'
            }`}
          >
            {[...column, ...column].map((photo, position) => (
              <figure
                key={`${photo.slug}-${position}`}
                className="group relative overflow-hidden rounded-2xl border border-border-base bg-card shadow-lg shadow-slate-900/10 dark:shadow-black/40"
              >
                <img
                  src={`/media/${photo.slug}.webp`}
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
