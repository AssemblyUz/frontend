/* eslint-disable @next/next/no-img-element */

/**
 * The Assembly seal on its own — the globe, the map of Uzbekistan and the
 * laurel — cropped from the official lockup in `/public/logo.png`.
 *
 * `Logo` renders the full horizontal lockup (seal + wordmark) and belongs in
 * the header and footer, where the name has to be spelled out. This is for
 * places that already state the name in type and only need the mark: the home
 * hero and the centre of the Main Gate.
 *
 * tone `auto`  — colour artwork on the light theme, white on the dark one.
 * tone `white` — always the white artwork, for permanently dark surfaces.
 *
 * Set `decorative` where the surrounding element already names the Assembly —
 * inside a link that carries its own text, for instance — so the mark does not
 * repeat that name into the accessible name.
 */
export default function Emblem({
  className = 'h-16 w-auto',
  tone = 'auto',
  decorative = false,
}: {
  className?: string;
  tone?: 'auto' | 'white';
  decorative?: boolean;
}) {
  const alt = decorative ? '' : 'O‘zbekiston Iqtisodiyot Assambleyasi';
  const dimensions = {width: 528, height: 487};

  if (tone === 'white') {
    return <img src="/logo-emblem-white.png" alt={alt} className={className} {...dimensions} />;
  }

  return (
    <>
      <img
        src="/logo-emblem.png"
        alt={alt}
        className={`${className} dark:hidden`}
        {...dimensions}
      />
      <img
        src="/logo-emblem-white.png"
        alt={alt}
        className={`${className} hidden dark:block`}
        {...dimensions}
      />
    </>
  );
}
