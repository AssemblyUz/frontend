'use client';

import {useLocale} from 'next-intl';
import {useParams} from 'next/navigation';
import {usePathname, useRouter} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';
import {useState, useRef, useEffect} from 'react';

const LABELS: Record<string, string> = {uz: "O'zbek", ru: 'Русский', en: 'English'};
const SHORT: Record<string, string> = {uz: 'UZ', ru: 'RU', en: 'EN'};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  function switchTo(next: string) {
    setOpen(false);
    // @ts-expect-error -- params carry through dynamic route segments
    router.replace({pathname, params}, {locale: next});
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="tap flex h-9 items-center gap-1.5 rounded-lg border border-border-base bg-surface px-2 text-sm font-medium text-muted transition hover:border-brand hover:text-brand sm:px-2.5"
        aria-label="Language"
        aria-expanded={open}
      >
        {/* Drawn, for the same reason as the theme toggle: 🌐 came in the
            platform's own colours and ignored the button's, and ▾ sat a couple
            of pixels off the baseline. Both take `currentColor` now. */}
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          {/* The meridians: one ellipse is enough to read as a globe. */}
          <path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18Z" />
        </svg>
        {SHORT[locale]}
        <svg
          viewBox="0 0 24 24"
          className={`h-3.5 w-3.5 shrink-0 opacity-60 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-36 overflow-hidden rounded-xl border border-border-base bg-card py-1 shadow-lg z-50">
          {routing.locales.map((l) => (
            <button
              key={l}
              onClick={() => switchTo(l)}
              className={`block w-full px-4 py-3 text-left text-sm transition hover:bg-foreground/5 ${
                l === locale ? 'font-semibold text-brand' : 'text-foreground'
              }`}
            >
              {LABELS[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
