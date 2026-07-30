/**
 * Presentational primitives shared by the Main Gate rows.
 *
 * The gate paints on its own fixed dark stage (`--gate-*` in globals.css), so
 * these deliberately use the `gate-` colour scale rather than the page's
 * theme-aware `surface` / `card` / `muted` tokens.
 */

/**
 * The gate's stage: the band itself, its atmosphere and the gold hairlines that
 * frame it.
 *
 * Shared because the gate is no longer one block — the motto and the doors close
 * the home page rather than the section, and they only read correctly against
 * this background, since everything inside uses the `gate-` scale rather than the
 * page's own.
 */
export function GateBand({
  className = '',
  children,
  ...rest
}: React.ComponentPropsWithoutRef<'section'> & {className?: string}) {
  return (
    <section
      {...rest}
      className={`relative isolate overflow-hidden bg-gate-bg text-gate-fg ${className}`}
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

      {children}
    </section>
  );
}

/** A glass panel on the gate stage. */
export function GatePanel({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-2xl border border-gate-line bg-gate-panel ${className}`}>
      {children}
    </div>
  );
}

/** Small uppercase label that opens a panel. */
export function GateEyebrow({
  tone = 'gold',
  children,
}: {
  tone?: 'gold' | 'cyan';
  children: React.ReactNode;
}) {
  const color = tone === 'gold' ? 'text-gate-gold' : 'text-gate-cyan';
  return (
    // The letter-spacing is the first thing to go on a narrow column: at 0.2em
    // a three-word label wraps to four lines inside a third of a phone.
    <span
      className={`block text-[0.45rem] font-semibold uppercase leading-tight tracking-[0.06em] xs:text-[0.55rem] xs:tracking-[0.1em] sm:text-[0.7rem] sm:tracking-[0.2em] ${color}`}
    >
      {children}
    </span>
  );
}

/** One horizontal band of the gate: hairline rule, label, optional lead, content. */
export function GateRow({
  label,
  lead,
  children,
}: {
  label: string;
  lead?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10 border-t border-gate-line pt-8 sm:mt-14 sm:pt-10">
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1.5">
        <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-gate-gold">
          {label}
        </h3>
        {lead && <p className="text-sm text-gate-muted">{lead}</p>}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

/** Zero-padded step / item counter. */
export function GateIndex({value, tone = 'cyan'}: {value: number; tone?: 'gold' | 'cyan'}) {
  const color = tone === 'gold' ? 'text-gate-gold/80' : 'text-gate-cyan/80';
  return (
    <span
      className={`text-[0.5rem] font-semibold tracking-[0.1em] xs:text-[0.55rem] sm:text-[0.65rem] sm:tracking-[0.22em] ${color}`}
    >
      {String(value).padStart(2, '0')}
    </span>
  );
}
