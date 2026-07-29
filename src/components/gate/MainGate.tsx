import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import RevealScope from '@/components/motion/RevealScope';
import GateHub from './GateHub';
import GateModel from './GateModel';
import GateMedia from './GateMedia';
import GateOutcomes from './GateOutcomes';

/**
 * The Main Gate — the home page's entrance to the whole Assembly.
 *
 * It reproduces the Assembly's one-page overview as real markup: mission and
 * core purpose, the five pillars, the operating model, the FR/BR/PR/GR wings,
 * AI MediaNet, the outcomes per audience and the partner ecosystem — ending in
 * the doors into each section of the site.
 *
 * It paints on a fixed dark navy stage (`--gate-*`) in both themes, matching the
 * presentation identity and setting the section apart from the page around it.
 */

/** The doors, in the order a first-time visitor is most likely to need them.
 *  Labels come from the `nav` catalogue so they never drift from the header. */
const DOORS = [
  {href: '/uyushmalar', key: 'associations'},
  {href: '/loyihalar', key: 'projects'},
  {href: '/xizmatlar', key: 'services'},
  {href: '/yangiliklar', key: 'news'},
  {href: '/haqida', key: 'about'},
  {href: '/aloqa', key: 'contact'},
] as const;

export default async function MainGate() {
  const t = await getTranslations('gate');
  const tNav = await getTranslations('nav');

  return (
    <section
      aria-labelledby="main-gate-title"
      className="relative isolate overflow-hidden bg-gate-bg text-gate-fg"
    >
      {/* Content stays visible when JavaScript never arrives: the reveal
          animation's resting state is server-rendered. */}
      <noscript>
        <style>{`[data-reveal]{opacity:1 !important;transform:none !important}`}</style>
      </noscript>

      {/* Atmosphere: a cool glow overhead and a warm one in the far corner,
          drifting slowly, over a faint network field. */}
      <div
        aria-hidden
        className="gate-aurora pointer-events-none absolute inset-0 [background:radial-gradient(65%_45%_at_50%_-5%,rgba(14,116,144,0.1),transparent_70%),radial-gradient(45%_45%_at_100%_100%,rgba(138,95,20,0.08),transparent_70%)] dark:[background:radial-gradient(65%_45%_at_50%_-5%,rgba(78,195,234,0.16),transparent_70%),radial-gradient(45%_45%_at_100%_100%,rgba(223,180,105,0.12),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:radial-gradient(rgba(15,23,42,0.5)_1px,transparent_1px)] [background-size:44px_44px] dark:opacity-[0.18] dark:[background-image:radial-gradient(rgba(148,172,214,0.55)_1px,transparent_1px)]"
      />
      {/* Gold hairlines frame the band. On the dark theme the page behind it is
          nearly the same value, so these edges are what make it read as its own
          monument rather than a change of padding. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gate-gold/60 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gate-gold/40 to-transparent"
      />

      <div className="relative shell py-section">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-gate-gold/40 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-gate-gold">
              <span aria-hidden className="h-1 w-1 rounded-full bg-gate-gold" />
              {t('kicker')}
            </span>
            <h2
              id="main-gate-title"
              className="mt-5 text-fluid-4xl font-bold tracking-tight text-balance"
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
        <GateModel />
        <GateMedia />
        <GateOutcomes />

        {/* The doors themselves. */}
        <div className="mt-10 border-t border-gate-line pt-10 text-center sm:mt-14">
          <p className="text-fluid-2xl font-bold tracking-tight text-gate-gold text-balance">
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
                  /* py-3 rather than py-2.5: these are the section's main
                     navigation and the only place it is reached by thumb. */
                  className="inline-flex rounded-xl border border-gate-line bg-gate-panel px-4 py-3 text-sm font-semibold text-gate-fg transition-all duration-300 hover:-translate-y-0.5 hover:border-gate-cyan/60 hover:bg-gate-panel-strong hover:text-gate-cyan hover:shadow-[0_8px_24px_-12px_rgba(14,116,144,0.45)] dark:hover:shadow-[0_8px_24px_-12px_rgba(78,195,234,0.6)]"
                >
                  {tNav(door.key)}
                </Link>
              ))}
            </RevealScope>
          </nav>
        </div>
      </div>
    </section>
  );
}
