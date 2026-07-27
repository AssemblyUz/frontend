import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {GateEyebrow} from './GateShell';

/**
 * The sectoral association network — where every entrepreneur enters the
 * Assembly, and the first link in the operating model shown below.
 */
export default async function GatePanelAssociations() {
  const t = await getTranslations('gate');

  return (
    <div className="flex flex-col rounded-2xl border border-gate-line bg-gate-panel p-6 sm:p-7">
      <GateEyebrow tone="cyan">{t('assocTitle')}</GateEyebrow>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-bold leading-none tracking-tight text-gate-fg sm:text-4xl">
          {t('assocValue')}
        </span>
        <span className="text-sm text-gate-muted">{t('assocUnit')}</span>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-gate-fg/85">{t('assocLead')}</p>

      <Link
        href="/uyushmalar"
        className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-gate-cyan transition-all hover:gap-2.5"
      >
        {t('assocCta')} →
      </Link>
    </div>
  );
}
