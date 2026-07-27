import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import Emblem from '@/components/Emblem';
import {GateIndex} from './GateShell';
import GatePanelAssociations from './GatePanelAssociations';
import GatePanelBlocks from './GatePanelBlocks';
import type {GatePillar} from './types';

/**
 * The centre of the gate: the four functional wings and the association network
 * flanking the seal, which doubles as the door into the 20-project portfolio —
 * the three ways into the Assembly. Below them, the five pillars it rests on.
 */
export default async function GateHub() {
  const t = await getTranslations('gate');
  const pillars = t.raw('pillars') as GatePillar[];

  return (
    <div className="mt-10 grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,1fr)]">
      <GatePanelBlocks />

      {/* The seal is the portfolio door. */}
      <Link
        href="/loyihalar"
        className="group relative overflow-hidden rounded-2xl border border-gate-gold/30 bg-gate-panel-strong p-6 text-center transition hover:border-gate-gold/70 sm:p-7"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-gate-cyan/15 opacity-60 blur-3xl transition-opacity duration-300 group-hover:opacity-100"
        />
        <span className="relative mx-auto block aspect-square w-28 sm:w-32">
          <span aria-hidden className="absolute inset-[-16%] rounded-full bg-gate-cyan/10 blur-xl" />
          <span aria-hidden className="absolute inset-[-9%] rounded-full border border-gate-line" />
          <Emblem tone="white" decorative className="relative h-full w-full object-contain" />
        </span>

        <span className="relative mt-5 block text-5xl font-bold leading-none tracking-tight text-gate-fg">
          {t('hubValue')}
        </span>
        <span className="relative mt-2 block text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gate-gold">
          {t('hubTitle')}
        </span>
        <span className="relative mt-3 block text-sm leading-relaxed text-gate-muted">
          {t('hubLead')}
        </span>
        <span className="relative mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gate-cyan transition-all group-hover:gap-2.5">
          {t('hubCta')} →
        </span>
      </Link>

      <GatePanelAssociations />

      <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-5">
        {pillars.map((p, i) => (
          <li
            key={p.word}
            className="rounded-xl border border-gate-line bg-gate-panel px-4 py-4 transition hover:border-gate-gold/50"
          >
            <GateIndex value={i + 1} tone="gold" />
            <div className="mt-2 text-sm font-bold uppercase tracking-wide text-gate-fg">
              {p.word}
            </div>
            <div className="mt-0.5 text-xs text-gate-muted">{p.claim}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
