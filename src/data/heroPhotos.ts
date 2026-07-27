/**
 * Photographs from the Assembly's own press archive, shown in the home hero.
 *
 * Sources live outside the repo; these are cropped and compressed copies in
 * `/public/media` (360px wide WebP, ~150 KB for the whole set). Each card's
 * ratio follows its source's orientation, so the intrinsic sizes here differ per
 * photo — they are set on the `img` so nothing shifts as the images arrive.
 *
 * The two columns drift in opposite directions. Keep them the same length so the
 * loop stays seamless when the list is doubled.
 */

export type HeroPhoto = {
  /** File name in /public/media, without the extension. */
  slug: string;
  width: number;
  height: number;
};

export const heroPhotoColumns: readonly (readonly HeroPhoto[])[] = [
  [
    {slug: 'signing', width: 360, height: 225},
    {slug: 'handshake', width: 360, height: 450},
    {slug: 'delegation', width: 360, height: 360},
    {slug: 'address', width: 360, height: 225},
    {slug: 'expo', width: 360, height: 360},
  ],
  [
    {slug: 'smart-city', width: 360, height: 480},
    {slug: 'partnership', width: 360, height: 450},
    {slug: 'briefing', width: 360, height: 360},
    {slug: 'forum', width: 360, height: 225},
    {slug: 'council', width: 360, height: 225},
  ],
] as const;
