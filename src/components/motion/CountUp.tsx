'use client';

import {useEffect, useRef, useState} from 'react';
import {useReducedMotion} from './useReducedMotion';

/** Groups thousands with a thin space — matches how the figures were written. */
function groupThousands(value: number): string {
  return value.toLocaleString('en-US').replace(/,/g, ' ');
}

const DURATION = 1500;
const EASE_OUT_CUBIC = (t: number) => 1 - (1 - t) ** 3;

/**
 * Counts up to `to` when it first scrolls into view.
 *
 * The final value is what renders on the server, so it is correct without
 * JavaScript and for reduced-motion visitors. The count only begins from the
 * observer callback, which for anything below the fold happens off-screen — so
 * the figure is never seen resetting.
 */
export default function CountUp({
  to,
  suffix = '',
  className,
}: {
  to: number;
  suffix?: string;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();
  const [current, setCurrent] = useState<number | null>(null);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reducedMotion) return;

    const node = ref.current;
    if (!node) return;

    let frame = 0;
    let start = 0;

    const step = (now: number) => {
      if (start === 0) start = now;
      const progress = Math.min((now - start) / DURATION, 1);
      setCurrent(Math.round(to * EASE_OUT_CUBIC(progress)));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        frame = requestAnimationFrame(step);
      },
      {threshold: 0.4},
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to, reducedMotion]);

  // Derived in render rather than stored, so switching reduced motion on
  // mid-count lands on the final figure instead of freezing part-way.
  const shown = reducedMotion ? to : (current ?? to);

  return (
    <span ref={ref} className={className}>
      {groupThousands(shown)}
      {suffix}
    </span>
  );
}
