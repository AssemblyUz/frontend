'use client';

import {useEffect, useRef, useState} from 'react';
import {Link} from '@/i18n/navigation';
import Emblem from '@/components/Emblem';
import CountUp from '@/components/motion/CountUp';
import {useReducedMotion} from '@/components/motion/useReducedMotion';
import {functionalBlocks} from '@/data/functionalBlocks';
import {GateEyebrow} from './GateShell';
import type {GateBlock} from './types';

export type GateHubLabels = {
  blocksTitle: string;
  blocksLead: string;
  blocksCta: string;
  hubValue: string;
  hubTitle: string;
  hubLead: string;
  hubCta: string;
  assocTitle: string;
  assocValue: string;
  assocUnit: string;
  assocLead: string;
  assocCta: string;
};

/** Each wing's hue, in both themes — the darker shade carries the contrast on the
 *  light gate, the lighter one on the dark. Full class strings so Tailwind keeps them. */
const WING_TONE: Record<string, {badge: string; arc: string; glow: string; text: string}> = {
  FR: {
    badge: 'bg-sky-500/12 text-sky-700 dark:bg-sky-400/15 dark:text-sky-300',
    arc: 'text-sky-600 dark:text-sky-400',
    glow: 'bg-sky-500/15 dark:bg-sky-400/25',
    text: 'text-sky-700 dark:text-sky-300',
  },
  BR: {
    badge: 'bg-emerald-500/12 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300',
    arc: 'text-emerald-600 dark:text-emerald-400',
    glow: 'bg-emerald-500/15 dark:bg-emerald-400/25',
    text: 'text-emerald-700 dark:text-emerald-300',
  },
  PR: {
    badge: 'bg-violet-500/12 text-violet-700 dark:bg-violet-400/15 dark:text-violet-300',
    arc: 'text-violet-600 dark:text-violet-400',
    glow: 'bg-violet-500/15 dark:bg-violet-400/25',
    text: 'text-violet-700 dark:text-violet-300',
  },
  GR: {
    badge: 'bg-amber-500/15 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300',
    arc: 'text-amber-600 dark:text-amber-400',
    glow: 'bg-amber-500/15 dark:bg-amber-400/25',
    text: 'text-amber-700 dark:text-amber-300',
  },
};

const FALLBACK_TONE = {
  badge: 'bg-gate-fg/8 text-gate-fg dark:bg-white/10',
  arc: 'text-gate-cyan',
  glow: 'bg-gate-cyan/20',
  text: 'text-gate-cyan',
};

const tone = (code: string) => WING_TONE[code] ?? FALLBACK_TONE;

/** Ring geometry: r=46 in a 100-unit box, so one quarter of the circumference. */
const RING_RADIUS = 46;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const ARC_LENGTH = CIRCUMFERENCE / 4 - 14;
const QUARTER = CIRCUMFERENCE / 4;

const IDLE_CYCLE_MS = 2600;
const PARALLAX_PX = 12;

/**
 * The gate's centrepiece: the four functional wings, the seal, and the
 * association network — the three ways into the Assembly.
 *
 * The seal carries one arc per wing. Hovering or focusing a wing lights its arc
 * and tints the glow behind the seal, so the composition reads as one system
 * rather than three cards. Left alone it cycles the wings slowly, and the seal
 * drifts a few pixels toward the pointer.
 *
 * Every effect is transform/opacity only, and all of it stops for visitors who
 * ask for reduced motion.
 */
export default function GateHubStage({
  blocks,
  labels,
}: {
  blocks: GateBlock[];
  labels: GateHubLabels;
}) {
  const reducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);
  const [cycle, setCycle] = useState(0);

  const sealRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef(0);

  // Idle sweep through the wings, so the seal is never inert.
  useEffect(() => {
    if (reducedMotion || blocks.length === 0) return;
    const id = setInterval(() => setCycle((c) => (c + 1) % blocks.length), IDLE_CYCLE_MS);
    return () => clearInterval(id);
  }, [reducedMotion, blocks.length]);

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  // Reduced motion drops the idle sweep entirely, so no wing is singled out
  // until the visitor points at one.
  const cycled = reducedMotion ? null : (blocks[cycle % Math.max(blocks.length, 1)]?.code ?? null);
  const activeCode = hovered ?? cycled;

  function handlePointerMove(event: React.PointerEvent<HTMLAnchorElement>) {
    if (reducedMotion || event.pointerType !== 'mouse') return;
    const seal = sealRef.current;
    // The card is the link the seal sits in; reading it back avoids putting a
    // ref on next-intl's Link.
    const card = seal?.closest('a');
    if (!card || !seal) return;

    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      seal.style.setProperty('--gate-tx', `${(x * PARALLAX_PX).toFixed(2)}px`);
      seal.style.setProperty('--gate-ty', `${(y * PARALLAX_PX).toFixed(2)}px`);
    });
  }

  function resetParallax() {
    cancelAnimationFrame(frameRef.current);
    const seal = sealRef.current;
    if (!seal) return;
    seal.style.setProperty('--gate-tx', '0px');
    seal.style.setProperty('--gate-ty', '0px');
  }

  const hubCount = Number(labels.hubValue);
  const assocCount = Number(labels.assocValue);

  return (
    /* Three abreast at every width, phones included. The gutters, padding and
       type all step down to make that fit rather than the columns collapsing —
       the composition is the point, so it is what survives the small screen. */
    <div className="mt-6 grid grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,1fr)] gap-1.5 xs:gap-2.5 sm:mt-10 sm:gap-4 lg:gap-5">
      {/* Wings */}
      <div
        data-reveal
        className="flex flex-col rounded-lg border border-gate-line bg-gate-panel p-2 xs:rounded-xl xs:p-3 sm:rounded-2xl sm:p-5 lg:p-7"
      >
        <GateEyebrow tone="gold">{labels.blocksTitle}</GateEyebrow>
        <p className="mt-2 text-[0.55rem] leading-snug text-gate-muted xs:text-[0.65rem] sm:mt-3 sm:text-sm sm:leading-relaxed">
          {labels.blocksLead}
        </p>

        <ul className="mt-2.5 space-y-0.5 sm:mt-5 sm:space-y-1.5" onPointerLeave={() => setHovered(null)}>
          {blocks.map((block) => {
            const target = functionalBlocks.find((wing) => wing.code === block.code);
            const wing = tone(block.code);
            const isActive = activeCode === block.code;

            const row = (
              <>
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-[0.5rem] font-bold transition-transform duration-300 xs:h-6 xs:w-6 xs:text-[0.6rem] sm:h-9 sm:w-9 sm:rounded-lg sm:text-xs ${
                    wing.badge
                  } ${isActive ? 'scale-110' : ''}`}
                >
                  {block.code}
                </span>
                <span
                  className={`min-w-0 text-[0.5rem] font-medium leading-tight tracking-tight transition-colors duration-300 xs:text-[0.6rem] xs:tracking-normal sm:text-sm sm:leading-normal ${
                    isActive ? wing.text : 'text-gate-fg'
                  }`}
                >
                  {block.title}
                </span>
                {/* No room for it beside a wrapped two-line title on a phone. */}
                <span
                  aria-hidden
                  className={`ml-auto hidden text-xs transition-all duration-300 sm:inline ${
                    isActive ? 'translate-x-0 opacity-100' : '-translate-x-1 opacity-0'
                  } ${wing.text}`}
                >
                  →
                </span>
              </>
            );

            if (!target) {
              return (
                <li key={block.code} className="flex items-center gap-1.5 px-1 py-1 xs:gap-2 sm:gap-3 sm:px-2 sm:py-2">
                  {row}
                </li>
              );
            }

            return (
              <li key={block.code}>
                <Link
                  href={`/bloklar/${target.slug}`}
                  onPointerEnter={() => setHovered(block.code)}
                  onFocus={() => setHovered(block.code)}
                  onBlur={() => setHovered(null)}
                  className={`flex items-center gap-1.5 rounded-md px-1 py-1 transition-colors duration-300 xs:gap-2 sm:gap-3 sm:rounded-xl sm:px-2 sm:py-2 ${
                    isActive ? 'bg-gate-panel-strong' : ''
                  }`}
                >
                  {row}
                </Link>
              </li>
            );
          })}
        </ul>

        <Link
          href="/bloklar"
          className="mt-auto inline-flex items-center gap-1 pt-3 text-[0.55rem] font-semibold text-gate-cyan transition-all xs:text-[0.65rem] sm:gap-1.5 sm:pt-5 sm:text-sm sm:hover:gap-2.5"
        >
          {labels.blocksCta} →
        </Link>
      </div>

      {/* Seal — the portfolio door */}
      <Link
        href="/loyihalar"
        onPointerMove={handlePointerMove}
        onPointerLeave={resetParallax}
        data-reveal
        className="group relative overflow-hidden rounded-lg border border-gate-gold/30 bg-gate-panel-strong p-2 text-center transition-colors duration-500 hover:border-gate-gold/70 xs:rounded-xl xs:p-3 sm:rounded-2xl sm:p-5 lg:p-7"
      >
        <span
          aria-hidden
          className={`pointer-events-none absolute left-1/2 top-4 h-20 w-20 -translate-x-1/2 rounded-full blur-2xl transition-colors duration-700 sm:top-8 sm:h-40 sm:w-40 sm:blur-3xl ${
            activeCode ? tone(activeCode).glow : 'bg-gate-cyan/15'
          }`}
        />

        <span
          ref={sealRef}
          className="gate-parallax relative mx-auto block aspect-square w-12 xs:w-16 sm:w-28 lg:w-36"
        >
          {/* One arc per wing — a single ring, set well outside the emblem's own
              circle and turning slowly, so it reads as a system around the seal
              rather than part of the artwork. */}
          <svg
            aria-hidden
            viewBox="0 0 100 100"
            className="gate-ring-spin absolute inset-[-18%] h-[136%] w-[136%] origin-center"
          >
            {blocks.map((block, i) => {
              const wing = tone(block.code);
              const isActive = activeCode === block.code;
              return (
                <circle
                  key={block.code}
                  cx="50"
                  cy="50"
                  r={RING_RADIUS}
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth={isActive ? 4.4 : 2}
                  strokeDasharray={`${ARC_LENGTH} ${CIRCUMFERENCE - ARC_LENGTH}`}
                  strokeDashoffset={-i * QUARTER}
                  // No `origin-center` here: CSS transform-origin also applies
                  // to this SVG transform attribute, and since the rotation
                  // already names its centre, the origin would be applied twice
                  // and throw the arc off the ring.
                  transform="rotate(-90 50 50)"
                  className={`transition-all duration-500 ${wing.arc} ${
                    isActive ? 'opacity-100' : 'opacity-55'
                  }`}
                />
              );
            })}
          </svg>

          <span
            aria-hidden
            className="gate-breathe absolute inset-[6%] rounded-full bg-gate-cyan/5 blur-md"
          />
          {/* `auto`, not `white`: the gate is light in the light theme, where the
              white artwork would disappear. */}
          <Emblem
            decorative
            className="relative h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.04]"
          />
        </span>

        <span className="relative mt-3 block text-lg font-bold leading-none tracking-tight text-gate-fg xs:text-2xl sm:mt-8 sm:text-fluid-4xl">
          {Number.isFinite(hubCount) ? <CountUp to={hubCount} /> : labels.hubValue}
        </span>
        <span className="relative mt-1 block text-[0.45rem] font-semibold uppercase tracking-[0.08em] text-gate-gold xs:text-[0.55rem] sm:mt-2 sm:text-[0.7rem] sm:tracking-[0.2em]">
          {labels.hubTitle}
        </span>
        <span className="relative mt-1.5 block text-[0.55rem] leading-snug text-gate-muted xs:text-[0.65rem] sm:mt-3 sm:text-sm sm:leading-relaxed">
          {labels.hubLead}
        </span>
        <span className="relative mt-2 inline-flex items-center gap-1 py-1 text-[0.55rem] font-semibold text-gate-cyan transition-all xs:text-[0.65rem] sm:mt-4 sm:gap-1.5 sm:text-sm sm:group-hover:gap-2.5">
          {labels.hubCta} →
        </span>
      </Link>

      {/* Association network */}
      <div
        data-reveal
        className="flex flex-col rounded-lg border border-gate-line bg-gate-panel p-2 xs:rounded-xl xs:p-3 sm:rounded-2xl sm:p-5 lg:p-7"
      >
        <GateEyebrow tone="cyan">{labels.assocTitle}</GateEyebrow>

        <div className="mt-2 flex flex-wrap items-baseline gap-x-1 sm:mt-4 sm:gap-2">
          <span className="text-lg font-bold leading-none tracking-tight text-gate-fg xs:text-2xl sm:text-fluid-3xl">
            {Number.isFinite(assocCount) ? <CountUp to={assocCount} /> : labels.assocValue}
          </span>
          <span className="text-[0.55rem] text-gate-muted xs:text-[0.65rem] sm:text-sm">{labels.assocUnit}</span>
        </div>

        <p className="mt-2 text-[0.55rem] leading-snug text-gate-fg/85 xs:text-[0.65rem] sm:mt-4 sm:text-sm sm:leading-relaxed">{labels.assocLead}</p>

        <Link
          href="/uyushmalar"
          className="mt-auto inline-flex items-center gap-1 pt-3 text-[0.55rem] font-semibold text-gate-cyan transition-all xs:text-[0.65rem] sm:gap-1.5 sm:pt-5 sm:text-sm sm:hover:gap-2.5"
        >
          {labels.assocCta} →
        </Link>
      </div>
    </div>
  );
}
