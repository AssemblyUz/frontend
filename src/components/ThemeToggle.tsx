'use client';

import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';

/**
 * Reads the theme that the inline no-FOUC script (see layout) already applied
 * to <html>, then lets the user toggle and persist it.
 */
export default function ThemeToggle() {
  const t = useTranslations('theme');
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
    setMounted(true);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    const root = document.documentElement;
    root.classList.toggle('dark', next);
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {
      /* storage unavailable — theme just won't persist */
    }
  }

  const label = dark ? t('toLight') : t('toDark');

  return (
    <button
      onClick={toggle}
      title={label}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-base bg-surface text-muted transition hover:border-brand hover:text-brand"
    >
      {/* Render a stable icon until mounted to avoid hydration mismatch */}
      <span suppressHydrationWarning className="text-base leading-none">
        {mounted ? (dark ? '☀️' : '🌙') : '🌙'}
      </span>
    </button>
  );
}
