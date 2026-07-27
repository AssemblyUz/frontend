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
export default function RevealScope({
  stagger = 70,
  className,
  children,
}: {
  /** Milliseconds between each item. */
  stagger?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (items.length === 0) return;

    // Written as inline style rather than a class: several of these items live
    // in client components whose className changes as they animate, and React's
    // reconciliation would drop a class added from outside. It leaves `style`
    // alone on elements it does not set one on.
    const show = () =>
      items.forEach((item, i) => {
        item.style.transitionDelay = `${i * stagger}ms`;
        item.style.opacity = '1';
        item.style.transform = 'none';
      });

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      show();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        show();
        observer.disconnect(); // one-shot: revealed content stays revealed
      },
      {threshold: 0.08, rootMargin: '0px 0px -10% 0px'},
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, [stagger]);

  // `data-reveal-scope` is what arms the hidden state in CSS — see globals.css.
  return (
    <div ref={ref} data-reveal-scope className={className}>
      {children}
    </div>
  );
}
