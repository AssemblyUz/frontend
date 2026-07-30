'use client';

import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';

/** Order is what the bar renders, left to right — "who we are" comes straight
 *  after home, before the sections that follow from it. */
const NAV = [
  {href: '/', key: 'home'},
  {href: '/haqida', key: 'about'},
  {href: '/uyushmalar', key: 'associations'},
  {href: '/xizmatlar', key: 'services'},
  {href: '/loyihalar', key: 'projects'},
  {href: '/yangiliklar', key: 'news'},
  {href: '/aloqa', key: 'contact'},
] as const;

export default function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  /**
   * Closing on the link's own click covers a tap, but not the browser's back
   * button or a language switch — both change the route with the panel still
   * hanging open over the new page.
   *
   * Adjusted during render rather than in an effect: React re-runs this
   * component immediately, before the browser paints, so the panel is never
   * shown open on the new route. An effect would close it one frame late, and
   * would be a cascading render besides.
   */
  const [renderedPath, setRenderedPath] = useState(pathname);
  if (renderedPath !== pathname) {
    setRenderedPath(pathname);
    setOpen(false);
  }

  // The panel is not modal, so nothing else is listening for Escape; without
  // this a keyboard user has to tab back to the toggle to dismiss it.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border-base bg-surface/80 backdrop-blur supports-[backdrop-filter]:bg-surface/70">
      <div className="shell flex items-center justify-between gap-3 py-2.5 sm:gap-4 sm:py-3">
        <Link href="/" className="flex shrink-0 items-center" onClick={() => setOpen(false)}>
          <Logo className="h-7 w-auto xs:h-8 sm:h-9" />
        </Link>

        {/* The full bar needs room for seven labels; Uzbek's are the longest and
            stop fitting below `lg`, so everything narrower uses the panel. */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={`rounded-lg px-2 py-2 text-sm font-medium transition xl:px-2.5 ${
                isActive(item.href)
                  ? 'bg-brand/10 text-brand'
                  : 'text-muted hover:bg-foreground/5 hover:text-foreground'
              }`}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        {/* gap-2 is the floor, not a preference: `tap` grows these 36px buttons
            to a 44px target, and a narrower gap would let one button's target
            overhang its neighbour. */}
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
          <button
            type="button"
            className="tap flex h-9 w-9 items-center justify-center rounded-lg border border-border-base text-muted transition hover:border-brand hover:text-brand lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {/* Drawn to match the two buttons beside it. ☰ and ✕ are font
                glyphs, so their weight and size came from whatever the platform
                picked rather than from the icon set. */}
            <svg
              viewBox="0 0 24 24"
              className="h-[18px] w-[18px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          /* Capped and scrollable: with the bar sticky, a phone held sideways
             has barely 250px left, and an uncapped panel put the last links
             below the fold with no way to reach them. `dvh` rather than `vh`
             so the browser's own collapsing toolbar is accounted for. */
          className="max-h-[calc(100dvh-3.5rem)] overflow-y-auto overscroll-contain border-t border-border-base bg-surface px-gutter pt-2 pb-safe lg:hidden"
        >
          {/* One column on a phone, two once there is width for them — a
              seven-item stack is otherwise most of a small screen. */}
          <ul className="grid gap-0.5 xs:grid-cols-2">
            {NAV.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={`block rounded-lg px-3 py-3 text-sm font-medium transition ${
                    isActive(item.href)
                      ? 'bg-brand/10 text-brand'
                      : 'text-foreground hover:bg-foreground/5'
                  }`}
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
