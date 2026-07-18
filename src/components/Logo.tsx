/* eslint-disable @next/next/no-img-element */

/**
 * Official Assembly logo. Uses the real artwork from /public:
 * the colour version on the light theme and the white version on the dark
 * theme (toggled purely with CSS via the `.dark` class on <html>).
 */
export default function Logo({className = 'h-9 w-auto'}: {className?: string}) {
  const alt = 'O‘zbekiston Iqtisodiyot Assambleyasi';
  return (
    <>
      <img src="/logo.png" alt={alt} className={`${className} dark:hidden`} />
      <img src="/logo-white.png" alt={alt} className={`${className} hidden dark:block`} />
    </>
  );
}
