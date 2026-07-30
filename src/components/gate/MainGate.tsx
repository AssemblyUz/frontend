import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import GateHub from './GateHub';
import GateOutcomes from './GateOutcomes';
import {GateBand} from './GateShell';

/**
 * The Main Gate — the Assembly's structure, as one band on the home page.
 *
 * It reproduces the Assembly's one-page overview as real markup: the
 * FR/BR/PR/GR wings and the association network flanking the seal, the five
 * pillars beneath them, and the partner ecosystem.
 *
 * The motto and the doors used to close it; they now close the page instead —
 * see `GateDoors`.
 *
 * It paints on a fixed dark navy stage (`--gate-*`) in both themes, matching the
 * presentation identity and setting the section apart from the page around it.
 */
export default async function MainGate() {
  const t = await getTranslations('gate');

  return (
    <GateBand aria-labelledby="main-gate-title">
      <div className="relative shell py-section">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div className="max-w-3xl">
            <h2
              id="main-gate-title"
              className="text-fluid-4xl font-bold tracking-tight text-balance"
            >
              {t('title')}
            </h2>
            <p className="mt-4 text-fluid-base text-gate-muted">{t('lead')}</p>
          </div>
          <Link
            href="/haqida"
            className="inline-flex items-center gap-1.5 py-1 text-sm font-semibold text-gate-cyan transition-all hover:gap-2.5"
          >
            {t('more')} →
          </Link>
        </div>

        <GateHub />
        <GateOutcomes />
      </div>
    </GateBand>
  );
}
