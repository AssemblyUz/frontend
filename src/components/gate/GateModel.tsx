import {getTranslations} from 'next-intl/server';
import {GateIndex, GateRow} from './GateShell';
import type {GateBlock, GateStep} from './types';

/**
 * One accent per FR/BR/PR/GR wing, in message order — the same hues the About
 * page uses, so a wing keeps its colour across the site. Tuned for the gate's
 * dark stage. Full class strings so Tailwind keeps them.
 */
const BLOCK_TONE = [
  {border: 'border-sky-400/35 hover:border-sky-400/70', badge: 'bg-sky-400/15 text-sky-300'},
  {
    border: 'border-emerald-400/35 hover:border-emerald-400/70',
    badge: 'bg-emerald-400/15 text-emerald-300',
  },
  {
    border: 'border-violet-400/35 hover:border-violet-400/70',
    badge: 'bg-violet-400/15 text-violet-300',
  },
  {border: 'border-amber-400/35 hover:border-amber-400/70', badge: 'bg-amber-400/15 text-amber-300'},
] as const;

/**
 * How a need travels through the Assembly: the sectoral association brings the
 * entrepreneur in, the need is identified, and a strategic project answers it —
 * then the four functional wings open the doors that project needs.
 */
export default async function GateModel() {
  const t = await getTranslations('gate');
  const steps = t.raw('modelSteps') as GateStep[];
  const blocks = t.raw('blocks') as GateBlock[];

  return (
    <>
      <GateRow label={t('modelTitle')} lead={t('modelLead')}>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="relative rounded-2xl border border-gate-line bg-gate-panel p-5"
            >
              <GateIndex value={i + 1} />
              <div className="mt-2 font-semibold text-gate-fg">{step.title}</div>
              <p className="mt-1.5 text-sm leading-relaxed text-gate-muted">{step.desc}</p>
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute -right-4 top-1/2 hidden w-4 -translate-y-1/2 text-center text-gate-gold/70 lg:block"
                >
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
      </GateRow>

      <GateRow label={t('blocksTitle')} lead={t('blocksLead')}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {blocks.map((block, i) => {
            const tone = BLOCK_TONE[i % BLOCK_TONE.length];
            return (
              <div
                key={block.code}
                className={`rounded-2xl border bg-gate-panel p-5 transition ${tone.border}`}
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-xl text-base font-bold ${tone.badge}`}
                >
                  {block.code}
                </span>
                <h4 className="mt-4 font-semibold text-gate-fg">{block.title}</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-gate-muted">{block.desc}</p>
              </div>
            );
          })}
        </div>
      </GateRow>
    </>
  );
}
