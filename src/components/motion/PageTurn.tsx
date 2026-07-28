'use client';

import {usePathname} from '@/i18n/navigation';

/** The control panel is a tool, not a book — it navigates without the flourish. */
const SKIP = ['/admin', '/kirish'];

/**
 * Turns the page like a leaf in a book on every navigation.
 *
 * The animation replays because the wrapper is keyed on the pathname: a new key
 * remounts it, which restarts the CSS animation. Only `transform` and `opacity`
 * are animated, and no fill-mode is set — once it finishes the element carries no
 * transform at all, so it stops being a containing block for anything inside.
 *
 * Reduced motion switches it off in CSS, and without JavaScript the page simply
 * appears, since the resting state is the un-animated one.
 */
export default function PageTurn({children}: {children: React.ReactNode}) {
  const pathname = usePathname();
  const skip = SKIP.some((prefix) => pathname.startsWith(prefix));

  if (skip) return <>{children}</>;

  return (
    <div key={pathname} className="page-turn relative">
      {children}
    </div>
  );
}
