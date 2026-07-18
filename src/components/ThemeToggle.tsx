'use client';

import {useSyncExternalStore} from 'react';
import {useTranslations} from 'next-intl';

const THEME_CHANGE_EVENT = 'assembly-theme-change';

function subscribe(callback: () => void) {
  window.addEventListener(THEME_CHANGE_EVENT, callback);
  return () => window.removeEventListener(THEME_CHANGE_EVENT, callback);
}

function getSnapshot() {
  return document.documentElement.classList.contains('dark');
}

function getServerSnapshot() {
  return false;
}

/**
 * Reads the theme that the inline no-FOUC script already applied to <html>,
 * then lets the user toggle and persist it.
 */
export default function ThemeToggle() {
  const t = useTranslations('theme');
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next = !dark;
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {
      /* storage unavailable - theme just won't persist */
    }
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }

  const label = dark ? t('toLight') : t('toDark');

  return (
    <button
      onClick={toggle}
      title={label}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-base bg-surface text-muted transition hover:border-brand hover:text-brand"
    >
      <span suppressHydrationWarning className="text-base leading-none">
        {dark ? '☀️' : '🌙'}
      </span>
    </button>
  );
}
