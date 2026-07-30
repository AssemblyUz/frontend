import {getTranslations} from 'next-intl/server';
import RevealScope from '@/components/motion/RevealScope';
import {GateRow} from './GateShell';
import type {GatePartnerTier} from './types';

/** Cycled across the partner tiers so the row reads as separate groups rather
 *  than one flat band. Full class strings. */
const TIER_TONE = [
  'text-sky-700 dark:text-sky-300',
  'text-emerald-700 dark:text-emerald-300',
  'text-amber-700 dark:text-amber-300',
  'text-violet-700 dark:text-violet-300',
  'text-gate-cyan',
] as const;

/**
 * The institutions the model works through — the proof behind it, and the row
 * that closes the gate.
 *
 * The per-audience outcomes used to open this component. They set out what the
 * Assembly produces for each stakeholder, which the About page already covers at
 * length under "Natija: davlat, biznes, investor va jamiyat uchun qiymat".
 */
export default async function GateOutcomes() {
  const t = await getTranslations('gate');
  const partners = t.raw('partners') as GatePartnerTier[];

  return (
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
  );
}
