/**
 * Photographs from the Assembly's own press archive, shown in the home hero.
 *
 * Sources live outside the repo; these are cropped and compressed copies in
 * `/public/press` (360px wide WebP, ~150 KB for the whole set). Each card's
 * ratio follows its source's orientation, so the intrinsic sizes here differ per
 * photo — they are set on the `img` so nothing shifts as the images arrive.
 *
 * NOT under `/public/media`: Django owns `/media/` for uploaded article photos
 * (MEDIA_URL), and in production the proxy routes that prefix to the backend, so
 * anything Next serves from there 404s.
 *
 * Three columns, drifting alternately. Column lengths may differ — each loops
 * independently by rendering its own list twice.
 */

export type HeroPhoto = {
  /** File name in /public/press, without the extension. */
  slug: string;
  width: number;
  height: number;
};

export const heroPhotoColumns: readonly (readonly HeroPhoto[])[] = [
  [
    {slug: 'signing', width: 360, height: 225},
    {slug: 'handshake', width: 360, height: 450},
    {slug: 'delegation', width: 360, height: 360},
    {slug: 'council', width: 360, height: 225},
  ],
  [
    {slug: 'smart-city', width: 360, height: 480},
    {slug: 'briefing', width: 360, height: 360},
    {slug: 'forum', width: 360, height: 225},
  ],
  [
    {slug: 'partnership', width: 360, height: 450},
    {slug: 'expo', width: 360, height: 360},
    {slug: 'address', width: 360, height: 225},
  ],
] as const;
