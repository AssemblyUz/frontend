'use client';

import {useEffect, useState} from 'react';
import {useReducedMotion} from '@/components/motion/useReducedMotion';

const STEP_MS = 1900;

/**
 * Connect → Cover → Analyse → Enhance, lit one at a time.
 *
 * The four verbs are a sequence, not a list, so the highlight steps through them
 * in order. Reduced motion shows all four at equal weight.
 */
export default function GateVerbs({verbs}: {verbs: string[]}) {
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reducedMotion || verbs.length === 0) return;
    const id = setInterval(() => setStep((s) => (s + 1) % verbs.length), STEP_MS);
    return () => clearInterval(id);
  }, [reducedMotion, verbs.length]);

  return (
    <ul className="mt-5 grid max-w-sm grid-cols-2 gap-2">
      {verbs.map((verb, i) => {
        const isActive = !reducedMotion && step === i;
        return (
          <li
            key={verb}
            className={`rounded-lg border px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.14em] transition-all duration-500 ${
              isActive
                ? 'border-violet-300/60 bg-violet-400/20 text-violet-100'
                : 'border-violet-400/30 bg-violet-400/10 text-violet-200'
            }`}
          >
            {verb}
          </li>
        );
      })}
    </ul>
  );
}
