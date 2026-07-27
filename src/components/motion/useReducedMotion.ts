'use client';

import {useSyncExternalStore} from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void): () => void {
  const query = window.matchMedia(QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

/**
 * Whether the visitor asked for reduced motion, kept in sync if they change the
 * setting mid-visit.
 *
 * Guards the JS-driven effects — pointer parallax, counters, auto-cycling. The
 * CSS-driven ones are switched off by the `prefers-reduced-motion` block in
 * globals.css, which also covers the server-rendered first paint: the hook
 * reports `false` on the server because a media query cannot be read there.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
