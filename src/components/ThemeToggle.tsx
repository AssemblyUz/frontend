'use client';

import {useSyncExternalStore} from 'react';
import {useTranslations} from 'next-intl';

/**
 * Watches the class on <html> itself, rather than an event this component
 * dispatches to itself.
 *
 * The class has three writers: the inline script on load, this button, and the
 * observer in the layout that re-asserts the theme after React resets <html> on
 * a language switch. Subscribing to the attribute means the button cannot fall
 * out of step with any of them — when it did, its next click toggled the wrong
 * way.
 */
function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {attributes: true, attributeFilter: ['class']});
  return () => observer.disconnect();
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
    // Read the DOM rather than trusting `dark`, so a click is always relative to
    // what is actually on screen.
    const next = !document.documentElement.classList.contains('dark');
    // Persist first: the layout's observer re-reads this the moment the class
    // changes, so writing it afterwards could have it read the old preference
    // and undo the toggle.
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {
      /* storage unavailable - theme just won't persist */
    }
    document.documentElement.classList.toggle('dark', next);
  }

  const label = dark ? t('toLight') : t('toDark');

  return (
    <button
      onClick={toggle}
      title={label}
      aria-label={label}
      className="tap flex h-9 w-9 items-center justify-center rounded-lg border border-border-base bg-surface text-muted transition hover:border-brand hover:text-brand"
    >
      <span suppressHydrationWarning className="text-base leading-none">
        {dark ? '☀️' : '🌙'}
      </span>
    </button>
  );
}
