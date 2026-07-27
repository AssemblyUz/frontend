import {getTranslations} from 'next-intl/server';
import {GateIndex, GateRow} from './GateShell';
import type {GateStep} from './types';

/**
 * How a need travels through the Assembly: the sectoral association brings the
 * entrepreneur in, the need is identified, and a strategic project answers it.
 *
 * The four functional wings that open the doors for that project are listed in
 * the hub above (`GatePanelBlocks`), not repeated here.
 */
export default async function GateModel() {
  const t = await getTranslations('gate');
  const steps = t.raw('modelSteps') as GateStep[];

  return (
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
  );
}
