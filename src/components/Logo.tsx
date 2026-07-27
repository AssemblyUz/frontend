/* eslint-disable @next/next/no-img-element */

/**
 * Official Assembly logo — the full horizontal lockup (seal + wordmark). Uses
 * the real artwork from /public: the colour version on the light theme and the
 * white version on the dark theme (toggled purely with CSS via the `.dark`
 * class on <html>).
 *
 * Set `decorative` where the surrounding element already carries the name in
 * text — inside the home page's <h1>, for instance — so the artwork does not
 * repeat that name to assistive technology.
 *
 * `Emblem` renders the seal alone, for places that already state the name.
 */
export default function Logo({
  className = 'h-9 w-auto',
  decorative = false,
}: {
  className?: string;
  decorative?: boolean;
}) {
  const alt = decorative ? '' : 'O‘zbekiston Iqtisodiyot Assambleyasi';
  const dimensions = {width: 1667, height: 487};

  return (
    <>
      <img src="/logo.png" alt={alt} className={`${className} dark:hidden`} {...dimensions} />
      <img
        src="/logo-white.png"
        alt={alt}
        className={`${className} hidden dark:block`}
        {...dimensions}
      />
    </>
  );
}
