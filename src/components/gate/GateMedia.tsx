import {getTranslations} from 'next-intl/server';
import {GateRow} from './GateShell';

/**
 * AI MediaNet — the layer that carries everything the model produces outward:
 * connect, cover, analyse, enhance. It closes with the three outputs the whole
 * gate is built to deliver: result, trust, impact.
 */
export default async function GateMedia() {
  const t = await getTranslations('gate');
  const verbs = t.raw('mediaVerbs') as string[];
  const items = t.raw('mediaItems') as string[];
  const outputs = t.raw('outputs') as string[];

  return (
    <GateRow label={t('mediaLabel')} lead={t('mediaLead')}>
      <div className="rounded-2xl border border-violet-400/30 bg-gate-panel-strong p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-10">
          <div>
            <div className="text-3xl font-bold tracking-tight text-gate-fg sm:text-4xl">
              AI MediaNet
            </div>
            {/* A 2×2 grid rather than wrapping chips: the four verbs are one
                sequence, and their length differs a lot between locales. */}
            <ul className="mt-5 grid max-w-sm grid-cols-2 gap-2">
              {verbs.map((verb) => (
                <li
                  key={verb}
                  className="rounded-lg border border-violet-400/30 bg-violet-400/10 px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.14em] text-violet-200"
                >
                  {verb}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm leading-relaxed text-gate-muted">{t('mediaSummary')}</p>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2">
            {items.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-xl border border-gate-line bg-gate-panel p-4 text-sm leading-relaxed text-gate-fg/85"
              >
                <span
                  aria-hidden
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gate-cyan"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Result — Trust — Impact: what the chain above is measured by. */}
        <ul className="mt-8 grid gap-px overflow-hidden rounded-xl border border-gate-line bg-gate-line sm:grid-cols-3">
          {outputs.map((output) => (
            <li
              key={output}
              className="bg-gate-bg px-5 py-4 text-center text-sm font-bold uppercase tracking-[0.22em] text-gate-gold"
            >
              {output}
            </li>
          ))}
        </ul>
      </div>
    </GateRow>
  );
}
