'use client';

import {useEffect, useState} from 'react';
import {useReducedMotion} from '@/components/motion/useReducedMotion';
import {GateIndex} from './GateShell';
import type {GatePillar} from './types';

const CYCLE_MS = 3200;

/**
 * The five pillars, with a spotlight that walks along them.
 *
 * Pointing at one takes the spotlight over, so the row answers the cursor
 * instead of ignoring it. Reduced motion stops the walk and leaves the pillars
 * evenly lit — the copy never depends on which one is highlighted.
 */
export default function GatePillars({pillars}: {pillars: GatePillar[]}) {
  const reducedMotion = useReducedMotion();
  const [cycle, setCycle] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    if (reducedMotion || pillars.length === 0) return;
    const id = setInterval(() => setCycle((c) => (c + 1) % pillars.length), CYCLE_MS);
    return () => clearInterval(id);
  }, [reducedMotion, pillars.length]);

  const active = reducedMotion ? -1 : (hovered ?? cycle);

  return (
    <ul
      /* All five abreast at every width, matching the panels above them. */
      className="grid grid-cols-5 gap-1 xs:gap-1.5 sm:gap-3"
      onPointerLeave={() => setHovered(null)}
    >
      {pillars.map((pillar, i) => {
        const isActive = active === i;
        return (
          <li
            key={pillar.word}
            data-reveal
            onPointerEnter={() => setHovered(i)}
            className={`relative overflow-hidden rounded-md border bg-gate-panel px-1 py-2 transition-all duration-500 xs:rounded-lg xs:px-2 sm:rounded-xl sm:px-4 sm:py-4 ${
              isActive
                ? 'border-gate-gold/50 bg-gate-panel-strong'
                : 'border-gate-line hover:border-gate-gold/30'
            }`}
          >
            {/* The spotlight itself: a warm wash that fades in on the active pillar. */}
            <span
              aria-hidden
              className={`pointer-events-none absolute inset-x-0 -top-10 h-24 bg-gate-gold/10 blur-2xl transition-opacity duration-700 ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`}
            />
            <span
              aria-hidden
              className={`pointer-events-none absolute bottom-0 left-0 h-px bg-gate-gold transition-transform duration-700 ease-out ${
                isActive ? 'w-full scale-x-100' : 'w-full scale-x-0'
              } origin-left`}
            />
            <GateIndex value={i + 1} tone="gold" />
            <div
              /* Sized so the longest of the five words — INVESTITSIYA, twelve
                 characters — clears a fifth of a 360px screen in one piece.
                 Below about 340px it has to hyphenate; there is no size that
                 both fits and stays readable there. */
              className={`relative mt-1 text-[0.4rem] font-bold uppercase leading-tight tracking-tight transition-colors duration-500 xs:text-[0.55rem] sm:mt-2 sm:text-sm sm:tracking-wide ${
                isActive ? 'text-gate-gold' : 'text-gate-fg'
              }`}
            >
              {pillar.word}
            </div>
            <div className="relative mt-0.5 text-[0.45rem] leading-tight text-gate-muted xs:text-[0.55rem] sm:text-xs sm:leading-normal">
              {pillar.claim}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
