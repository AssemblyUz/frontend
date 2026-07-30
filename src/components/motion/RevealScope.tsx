'use client';

import {useEffect, useRef} from 'react';

/**
 * Reveals its `[data-reveal]` descendants, staggered, when the group scrolls
 * into view.
 *
 * The observer sits on the group rather than on each item so the children need
 * no wrapper element — important where they are grid or flex items, since an
 * extra div would break the layout. Mark the items with `data-reveal` in the
 * server component and wrap the section in this.
 *
 * Reduced motion reveals everything immediately, and the transition itself is
 * disabled in CSS, so nothing animates.
 */
/**
 * The longest the whole cascade may take to start its last item.
 *
 * `stagger` is chosen for a row of four or five cards. The associations
 * directory has fifty, and at 50ms each the last one began 2.5s after the first
 * — with the transition on top, content that had already arrived took three and
 * a half seconds to finish appearing. Past this point the per-item delay is
 * compressed to fit, so a long list ripples instead of queueing.
 */
const MAX_CASCADE_MS = 500;

export default function RevealScope({
  stagger = 70,
  className,
  children,
}: {
  /** Milliseconds between each item, compressed if the group is large. */
  stagger?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const items = () => Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));

    // Written as inline style rather than a class: several of these items live
    // in client components whose className changes as they animate, and React's
    // reconciliation would drop a class added from outside. It leaves `style`
    // alone on elements it does not set one on.
    const reveal = (item: HTMLElement, delay: number) => {
      item.style.transitionDelay = `${delay}ms`;
      item.style.opacity = '1';
      item.style.transform = 'none';
    };

    const show = () => {
      const group = items();
      const step = Math.min(stagger, MAX_CASCADE_MS / Math.max(group.length - 1, 1));
      group.forEach((item, i) => reveal(item, i * step));
    };

    /**
     * Once the group has been revealed, anything React renders into it later is
     * new markup with no inline style — and the CSS that arms the hidden state
     * applies to it, so it would arrive invisible. The associations directory
     * does exactly that: filtering as you type replaces the whole grid.
     *
     * New items are shown with no delay. They appear in answer to something the
     * reader just did, so staggering them in would read as lag, not as polish.
     */
    let shown = false;
    const watchForNewItems = () => {
      const mutations = new MutationObserver(() => {
        if (!shown) return;
        for (const item of items()) {
          if (item.style.opacity !== '1') reveal(item, 0);
        }
      });
      mutations.observe(root, {childList: true, subtree: true});
      return mutations;
    };

    const showOnce = () => {
      show();
      shown = true;
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      showOnce();
      const mutations = watchForNewItems();
      return () => mutations.disconnect();
    }

    const mutations = watchForNewItems();

    // An empty group still needs the observer: the items may only arrive later.
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        showOnce();
        observer.disconnect(); // one-shot: revealed content stays revealed
      },
      {threshold: 0.08, rootMargin: '0px 0px -10% 0px'},
    );

    observer.observe(root);
    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, [stagger]);

  // `data-reveal-scope` is what arms the hidden state in CSS — see globals.css.
  return (
    <div ref={ref} data-reveal-scope className={className}>
      {children}
    </div>
  );
}
