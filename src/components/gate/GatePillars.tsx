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
      /* Five is only readable once each still holds a word and a claim: two up
         from `xs`, three on a tablet, the full row from `lg`. */
      className="grid gap-3 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
      onPointerLeave={() => setHovered(null)}
    >
      {pillars.map((pillar, i) => {
        const isActive = active === i;
        return (
          <li
            key={pillar.word}
            data-reveal
            onPointerEnter={() => setHovered(i)}
            className={`relative overflow-hidden rounded-xl border bg-gate-panel px-4 py-4 transition-all duration-500 ${
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
              className={`relative mt-2 text-sm font-bold uppercase tracking-wide transition-colors duration-500 ${
                isActive ? 'text-gate-gold' : 'text-gate-fg'
              }`}
            >
              {pillar.word}
            </div>
            <div className="relative mt-0.5 text-xs text-gate-muted">{pillar.claim}</div>
          </li>
        );
      })}
    </ul>
  );
}
