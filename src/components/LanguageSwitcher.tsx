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
        className="flex h-9 items-center gap-1.5 rounded-lg border border-border-base bg-surface px-2.5 text-sm font-medium text-muted transition hover:border-brand hover:text-brand"
        aria-label="Language"
        aria-expanded={open}
      >
        🌐 {SHORT[locale]}
        <span className="text-xs opacity-60">▾</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-36 overflow-hidden rounded-xl border border-border-base bg-card py-1 shadow-lg z-50">
          {routing.locales.map((l) => (
            <button
              key={l}
              onClick={() => switchTo(l)}
              className={`block w-full px-4 py-2 text-left text-sm transition hover:bg-foreground/5 ${
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
