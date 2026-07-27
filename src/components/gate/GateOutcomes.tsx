import {getTranslations} from 'next-intl/server';
import RevealScope from '@/components/motion/RevealScope';
import {GateRow} from './GateShell';
import type {GateOutcome, GatePartnerTier} from './types';

/** Cycled across the outcome columns and partner tiers so the rows are readable
 *  as separate groups rather than one flat band. Full class strings. */
const TIER_TONE = [
  'text-sky-300',
  'text-emerald-300',
  'text-amber-300',
  'text-violet-300',
  'text-gate-cyan',
] as const;

/**
 * What the model actually produces, per audience, and the institutions it works
 * through. These two rows close the gate: the promise, and the proof behind it.
 */
export default async function GateOutcomes() {
  const t = await getTranslations('gate');
  const outcomes = t.raw('outcomes') as GateOutcome[];
  const partners = t.raw('partners') as GatePartnerTier[];

  return (
    <>
      <GateRow label={t('outcomesTitle')} lead={t('outcomesLead')}>
        <RevealScope stagger={110} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {outcomes.map((outcome, i) => (
            <div
              key={outcome.audience}
              data-reveal
              className="rounded-2xl border border-gate-line bg-gate-panel p-5 transition-transform duration-500 hover:-translate-y-1"
            >
              <h4
                className={`text-[0.7rem] font-semibold uppercase tracking-[0.16em] ${
                  TIER_TONE[i % TIER_TONE.length]
                }`}
              >
                {outcome.audience}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {outcome.items.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-snug text-gate-fg/85">
                    <span
                      aria-hidden
                      className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gate-gold"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </RevealScope>
      </GateRow>

      <GateRow label={t('partnersTitle')} lead={t('partnersLead')}>
        <RevealScope stagger={90} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {partners.map((tier, i) => (
            <div
              key={tier.title}
              data-reveal
              className="rounded-2xl border border-gate-line bg-gate-panel p-5 transition-colors duration-500 hover:border-gate-cyan/40"
            >
              <h4 className="text-sm font-semibold text-gate-fg">{tier.title}</h4>
              <div
                className={`mt-3 h-0.5 w-10 rounded-full bg-current ${
                  TIER_TONE[i % TIER_TONE.length]
                }`}
              />
              <ul className="mt-4 space-y-1.5 text-sm text-gate-muted">
                {tier.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </RevealScope>
        <p className="mt-4 text-xs uppercase tracking-[0.14em] text-gate-muted">
          {t('partnersNote')}
        </p>
      </GateRow>
    </>
  );
}
