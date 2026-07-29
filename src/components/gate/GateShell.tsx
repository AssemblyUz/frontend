/**
 * Presentational primitives shared by the Main Gate rows.
 *
 * The gate paints on its own fixed dark stage (`--gate-*` in globals.css), so
 * these deliberately use the `gate-` colour scale rather than the page's
 * theme-aware `surface` / `card` / `muted` tokens.
 */

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
