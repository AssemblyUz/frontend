import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {functionalBlocks} from '@/data/functionalBlocks';
import {GateEyebrow} from './GateShell';
import type {GateBlock} from './types';

/** Badge tone per wing, in message order — the same hue each wing carries
 *  site-wide, tuned for the gate's dark stage. Full class strings. */
const BLOCK_TONE = [
  'bg-sky-400/15 text-sky-300',
  'bg-emerald-400/15 text-emerald-300',
  'bg-violet-400/15 text-violet-300',
  'bg-amber-400/15 text-amber-300',
] as const;

/**
 * The four functional wings, compact: code, name, and a way through to each
 * block's own page. This is the gate's only listing of them, so the rows are
 * links rather than plain text.
 */
export default async function GatePanelBlocks() {
  const t = await getTranslations('gate');
  const blocks = t.raw('blocks') as GateBlock[];

  return (
    <div className="flex flex-col rounded-2xl border border-gate-line bg-gate-panel p-6 sm:p-7">
      <GateEyebrow tone="gold">{t('blocksTitle')}</GateEyebrow>
      <p className="mt-3 text-sm leading-relaxed text-gate-muted">{t('blocksLead')}</p>

      <ul className="mt-5 space-y-2">
        {blocks.map((block, i) => {
          const target = functionalBlocks.find((fb) => fb.code === block.code);
          const tone = BLOCK_TONE[i % BLOCK_TONE.length];
          const row = (
            <>
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${tone}`}
              >
                {block.code}
              </span>
              <span className="text-sm font-medium text-gate-fg">{block.title}</span>
            </>
          );

          if (!target) {
            return (
              <li key={block.code} className="flex items-center gap-3 rounded-xl px-1 py-1">
                {row}
              </li>
            );
          }

          return (
            <li key={block.code}>
              <Link
                href={`/bloklar/${target.slug}`}
                className="flex items-center gap-3 rounded-xl border border-transparent px-1 py-1 transition hover:border-gate-line hover:bg-gate-panel-strong"
              >
                {row}
              </Link>
            </li>
          );
        })}
      </ul>

      <Link
        href="/bloklar"
        className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-gate-cyan transition-all hover:gap-2.5"
      >
        {t('blocksCta')} →
      </Link>
    </div>
  );
}
