import {getTranslations} from 'next-intl/server';

/**
 * A chapter opener: the chapter line, the title in the display serif, a rule,
 * and the lead paragraph with a drop cap.
 *
 * Every section page uses this, so the book feel arrives everywhere at once.
 * `chapter` is the numeral — pass the roman numeral for the section; leave it
 * out and the opener simply has no chapter line.
 */
export default async function PageHero({
  title,
  lead,
  chapter,
}: {
  title: string;
  lead: string;
  chapter?: string;
}) {
  const t = await getTranslations('book');

  // A drop cap only works on a letter. Some leads open with a figure — the
  // Russian projects page begins "20 стратегических проектов" — and ::first-letter
  // would blow up the "2" and leave the "0" behind at body size.
  const dropCap = /^\p{L}/u.test(lead.trimStart());

  return (
    <section className="relative overflow-hidden border-b border-border-base bg-surface">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand/5 to-transparent" />
      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <div className="max-w-3xl">
          {chapter && (
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-brand">
              <span>
                {t('chapter')} {chapter}
              </span>
              <span aria-hidden className="h-px w-16 bg-brand/30" />
            </p>
          )}

          <h1
            className={`text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl ${
              chapter ? 'mt-5' : ''
            }`}
          >
            {title}
          </h1>

          <div aria-hidden className="rule-double mt-7 w-24" />

          <p
            className={`mt-7 max-w-2xl text-base leading-relaxed text-muted sm:text-lg ${
              dropCap ? 'drop-cap' : ''
            }`}
          >
            {lead}
          </p>
        </div>
      </div>
    </section>
  );
}
