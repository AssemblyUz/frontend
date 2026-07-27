import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
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
      {/* Atmosphere: a cool glow overhead, a warm one in the far corner. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background:radial-gradient(65%_45%_at_50%_-5%,rgba(78,195,234,0.15),transparent_70%),radial-gradient(45%_45%_at_100%_100%,rgba(223,180,105,0.1),transparent_70%)]"
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

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-gate-gold/40 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-gate-gold">
              <span aria-hidden className="h-1 w-1 rounded-full bg-gate-gold" />
              {t('kicker')}
            </span>
            <h2
              id="main-gate-title"
              className="mt-5 text-3xl font-bold leading-tight tracking-tight sm:text-4xl"
            >
              {t('title')}
            </h2>
            <p className="mt-4 leading-relaxed text-gate-muted">{t('lead')}</p>
          </div>
          <Link
            href="/haqida"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gate-cyan transition-all hover:gap-2.5"
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
          <p className="text-xl font-bold tracking-tight text-gate-gold sm:text-2xl">
            {t('motto')}
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-gate-muted">{t('mottoLead')}</p>

          <nav aria-label={t('doorsLabel')} className="mt-8">
            <ul className="flex flex-wrap justify-center gap-2.5">
              {DOORS.map((door) => (
                <li key={door.key}>
                  <Link
                    href={door.href}
                    className="inline-flex rounded-xl border border-gate-line bg-gate-panel px-4 py-2.5 text-sm font-semibold text-gate-fg transition hover:border-gate-cyan/60 hover:bg-gate-panel-strong hover:text-gate-cyan"
                  >
                    {tNav(door.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
}
