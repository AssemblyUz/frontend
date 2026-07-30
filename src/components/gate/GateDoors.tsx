import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import RevealScope from '@/components/motion/RevealScope';
import {GateBand} from './GateShell';

/**
 * The Assembly's motto and the doors into each section — the last thing on the
 * home page, immediately above the footer.
 *
 * It used to close the Main Gate. Standing on its own at the foot of the page it
 * does the same job for the whole of it: a reader who has scrolled past
 * everything gets the statement and then somewhere to go, rather than reaching
 * the footer's small print.
 *
 * It keeps the gate's band, because everything in it is coloured from the
 * `gate-` scale — gold on navy — which has nothing behind it on the page's own
 * background.
 */

/** In the order a first-time visitor is most likely to need them — "who we are"
 *  first, as in the header, then the sections that follow from it. There is no
 *  home door, the reader already being on it.
 *
 *  Labels come from the `nav` catalogue so they never drift from the header. */
const DOORS = [
  {href: '/haqida', key: 'about'},
  {href: '/uyushmalar', key: 'associations'},
  {href: '/loyihalar', key: 'projects'},
  {href: '/xizmatlar', key: 'services'},
  {href: '/yangiliklar', key: 'news'},
  {href: '/aloqa', key: 'contact'},
] as const;

export default async function GateDoors() {
  const t = await getTranslations('gate');
  const tNav = await getTranslations('nav');

  return (
    <GateBand aria-labelledby="gate-motto">
      <div className="relative shell py-section text-center">
        <p
          id="gate-motto"
          className="text-fluid-2xl font-bold tracking-tight text-gate-gold text-balance"
        >
          {t('motto')}
        </p>
        <p className="mx-auto mt-3 max-w-2xl text-fluid-base text-gate-muted">{t('mottoLead')}</p>

        <nav aria-label={t('doorsLabel')} className="mt-8">
          <RevealScope stagger={60} className="flex flex-wrap justify-center gap-2.5">
            {DOORS.map((door) => (
              <Link
                key={door.key}
                href={door.href}
                data-reveal
                /* py-3 rather than py-2.5: these are the page's closing
                   navigation and the only place it is reached by thumb. */
                className="inline-flex rounded-xl border border-gate-line bg-gate-panel px-4 py-3 text-sm font-semibold text-gate-fg transition-all duration-300 hover:-translate-y-0.5 hover:border-gate-cyan/60 hover:bg-gate-panel-strong hover:text-gate-cyan hover:shadow-[0_8px_24px_-12px_rgba(14,116,144,0.45)] dark:hover:shadow-[0_8px_24px_-12px_rgba(78,195,234,0.6)]"
              >
                {tNav(door.key)}
              </Link>
            ))}
          </RevealScope>
        </nav>
      </div>
    </GateBand>
  );
}
