import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import PageHero from '@/components/PageHero';

type Highlight = {value: string; label: string};
type ValueItem = {title: string; sub: string};
type NodeItem = {title: string; desc: string};
type Step = {title: string; desc: string};
type Block = {code: string; title: string; desc: string};
type PartnerGroup = {title: string; items: string[]};
type RoadmapStage = {period: string; title: string; desc: string};
type Kpi = {value: string; label: string};
type Result = {title: string; desc: string};

/** One accent per FR/BR/PR/GR wing, in message order. Full class strings so Tailwind keeps them. */
const BLOCK_STYLE = [
  {border: 'border-sky-500/40', text: 'text-sky-500 dark:text-sky-400', bg: 'bg-sky-500/10'},
  {border: 'border-emerald-500/40', text: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-500/10'},
  {border: 'border-violet-500/40', text: 'text-violet-500 dark:text-violet-400', bg: 'bg-violet-500/10'},
  {border: 'border-amber-500/40', text: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-500/10'},
] as const;

/** Cycled across the KPI tiles and partner groups so the rows do not read as one flat block. */
const CYCLE = [
  'text-sky-500 dark:text-sky-400',
  'text-emerald-500 dark:text-emerald-400',
  'text-amber-500 dark:text-amber-400',
  'text-violet-500 dark:text-violet-400',
  'text-rose-500 dark:text-rose-400',
  'text-brand',
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'about'});
  return {title: t('title'), description: t('lead')};
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');

  const highlights = t.raw('highlights') as Highlight[];
  const role = t.raw('role') as string[];
  const values = t.raw('values') as ValueItem[];
  const directions = t.raw('directions') as string[];
  const architecture = t.raw('architecture') as NodeItem[];
  const mechanism = t.raw('mechanism') as Step[];
  const blocks = t.raw('blocks') as Block[];
  const media = t.raw('media') as NodeItem[];
  const partners = t.raw('partners') as PartnerGroup[];
  const valueItems = t.raw('valueItems') as NodeItem[];
  const roadmap = t.raw('roadmap') as RoadmapStage[];
  const kpi = t.raw('kpi') as Kpi[];
  const results = t.raw('results') as Result[];

  return (
    <>
      <PageHero title={t('title')} lead={t('lead')} />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        {/* Who we are */}
        <section className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
          <div className="rounded-3xl border border-border-base bg-card p-6 sm:p-10">
            <span className="text-sm font-semibold uppercase tracking-wide text-brand">
              {t('introTitle')}
            </span>
            <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{t('intro')}</p>
            <p className="mt-6 text-lg font-semibold text-foreground">{t('principle')}</p>
            <p className="mt-3 leading-relaxed text-muted">{t('introNote')}</p>
          </div>

          <div className="grid gap-5">
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border-base bg-border-base">
              {highlights.map((h, i) => (
                <div key={h.label} className="bg-card px-5 py-6">
                  <div className={`text-xl font-bold tracking-tight sm:text-2xl ${CYCLE[i % CYCLE.length]}`}>
                    {h.value}
                  </div>
                  <div className="mt-1 text-xs text-muted">{h.label}</div>
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-border-base bg-card p-6 sm:p-8">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-accent">
                {t('roleTitle')}
              </h2>
              <ul className="mt-4 space-y-3">
                {role.map((r) => (
                  <li key={r} className="flex gap-3 text-sm leading-relaxed text-muted">
                    <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Mission & goal */}
        <Section title={t('missionSectionTitle')} lead={t('missionSectionLead')}>
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-border-base bg-card p-6 sm:p-8">
              <span className="text-sm font-semibold uppercase tracking-wide text-brand">
                {t('missionTitle')}
              </span>
              <p className="mt-3 leading-relaxed text-muted">{t('mission')}</p>
            </div>
            <div className="rounded-2xl border border-border-base bg-card p-6 sm:p-8">
              <span className="text-sm font-semibold uppercase tracking-wide text-accent">
                {t('goalTitle')}
              </span>
              <p className="mt-3 leading-relaxed text-muted">{t('goal')}</p>
              <p className="mt-5 border-t border-border-base pt-5 text-sm leading-relaxed text-muted">
                {t('goalNote')}
              </p>
            </div>
          </div>
        </Section>

        {/* Values */}
        <Section title={t('valuesTitle')} lead={t('valuesLead')}>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {values.map((v, i) => (
              <div key={v.title} className="rounded-2xl border border-border-base bg-card p-5 transition hover:border-brand">
                <div className={`text-sm font-bold uppercase tracking-wide ${CYCLE[i % CYCLE.length]}`}>
                  {v.title}
                </div>
                <div className="mt-1 text-sm text-muted">{v.sub}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* Priority directions */}
        <Section title={t('directionsTitle')} lead={t('directionsLead')}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {directions.map((d, i) => (
              <div
                key={d}
                className="flex items-center gap-3 rounded-2xl border border-border-base bg-card p-4 transition hover:border-brand"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-sm font-bold text-brand">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-sm font-medium text-foreground">{d}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Strategic architecture (GPPP) */}
        <Section title={t('architectureTitle')} lead={t('architectureLead')}>
          <div className="rounded-3xl border border-border-base bg-card p-6 sm:p-10">
            <div className="mx-auto max-w-md rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-500 px-6 py-8 text-center shadow-lg">
              <div className="text-2xl font-bold tracking-tight text-white">{t('coreTitle')}</div>
              <div className="mt-1 text-sm text-white/85">{t('coreSub')}</div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {architecture.map((n, i) => (
                <div key={n.title} className="rounded-2xl border border-border-base bg-surface p-5">
                  <div className={`font-semibold ${CYCLE[i % CYCLE.length]}`}>{n.title}</div>
                  <div className="mt-1 text-sm text-muted">{n.desc}</div>
                </div>
              ))}
            </div>

            <p className="mt-8 border-t border-border-base pt-6 text-center text-sm text-muted">
              {t('architectureNote')}
            </p>
          </div>
        </Section>

        {/* Working mechanism */}
        <Section title={t('mechanismTitle')} lead={t('mechanismLead')}>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mechanism.map((step, i) => (
              <li key={step.title} className="relative rounded-2xl border border-border-base bg-card p-6">
                <span className="absolute right-5 top-4 text-4xl font-bold leading-none text-brand/10">
                  {i + 1}
                </span>
                <div className="font-semibold text-foreground">{step.title}</div>
                <div className="mt-1 text-sm leading-relaxed text-muted">{step.desc}</div>
              </li>
            ))}
          </ol>

          <div className="mt-5 rounded-2xl border border-brand/30 bg-brand/5 p-6 sm:p-8">
            <span className="text-sm font-semibold uppercase tracking-wide text-brand">
              {t('formulaTitle')}
            </span>
            <p className="mt-3 leading-relaxed text-foreground">{t('formula')}</p>
          </div>
        </Section>

        {/* FR / BR / PR / GR */}
        <Section title={t('blocksTitle')} lead={t('blocksLead')}>
          <div className="grid gap-5 sm:grid-cols-2">
            {blocks.map((b, i) => {
              const style = BLOCK_STYLE[i % BLOCK_STYLE.length];
              return (
                <div
                  key={b.code}
                  className={`rounded-2xl border bg-card p-6 sm:p-8 ${style.border}`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold ${style.bg} ${style.text}`}
                    >
                      {b.code}
                    </span>
                    <h3 className="font-semibold text-foreground">{b.title}</h3>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </Section>

        {/* AI MediaNet */}
        <Section title={t('mediaTitle')} lead={t('mediaLead')}>
          <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
            <div className="rounded-3xl border border-violet-500/40 bg-card p-6 sm:p-8">
              <div className="text-3xl font-bold tracking-tight text-violet-500 dark:text-violet-400">
                AI MediaNet
              </div>
              <p className="mt-4 leading-relaxed text-accent">{t('mediaTagline')}</p>
              <p className="mt-5 border-t border-border-base pt-5 text-sm leading-relaxed text-muted">
                {t('mediaSummary')}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {media.map((m) => (
                <div key={m.title} className="rounded-2xl border border-border-base bg-card p-5">
                  <div className="font-semibold text-foreground">{m.title}</div>
                  <div className="mt-1 text-sm leading-relaxed text-muted">{m.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Partner ecosystem */}
        <Section title={t('partnersTitle')} lead={t('partnersLead')}>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {partners.map((group, i) => (
              <div key={group.title} className="rounded-2xl border border-border-base bg-card p-6">
                <h3 className="font-semibold text-foreground">{group.title}</h3>
                <div className={`mt-3 h-0.5 w-12 rounded-full bg-current ${CYCLE[i % CYCLE.length]}`} />
                <ul className="mt-4 space-y-2 text-sm text-muted">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* Value per stakeholder */}
        <Section title={t('valueTitle')} lead={t('valueLead')}>
          <div className="grid gap-5 sm:grid-cols-2">
            {valueItems.map((v, i) => (
              <div key={v.title} className="rounded-2xl border border-border-base bg-card p-6 sm:p-8">
                <h3 className={`font-semibold ${CYCLE[i % CYCLE.length]}`}>{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{v.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Roadmap & KPI */}
        <Section title={t('roadmapTitle')} lead={t('roadmapLead')}>
          <div className="grid gap-5 sm:grid-cols-3">
            {roadmap.map((stage, i) => (
              <div key={stage.period} className="rounded-2xl border border-border-base bg-card p-6 text-center">
                <div className={`text-2xl font-bold tracking-tight ${CYCLE[i % CYCLE.length]}`}>
                  {stage.period}
                </div>
                <div className="mt-3 font-semibold text-foreground">{stage.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{stage.desc}</p>
              </div>
            ))}
          </div>

          <h3 className="mt-10 text-sm font-semibold uppercase tracking-wide text-brand">
            {t('kpiTitle')}
          </h3>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {kpi.map((k, i) => (
              <div key={k.label} className="rounded-2xl border border-border-base bg-card p-5 text-center">
                <div className={`text-xl font-bold tracking-tight ${CYCLE[i % CYCLE.length]}`}>
                  {k.value}
                </div>
                <div className="mt-1 text-xs text-muted">{k.label}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* Results */}
        <Section title={t('resultsTitle')}>
          <div className="grid gap-5 sm:grid-cols-3">
            {results.map((r) => (
              <div key={r.title} className="rounded-2xl border border-border-base bg-card p-6">
                <h3 className="text-lg font-semibold text-brand">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{r.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Slogan banner */}
        <section className="mt-14 sm:mt-20">
          <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-sky-500 px-6 py-12 text-center sm:px-12">
            <p className="text-2xl font-bold text-white sm:text-3xl">{t('motto')}</p>
            <p className="mt-3 text-white/85">{t('slogan')}</p>
          </div>
        </section>
      </div>
    </>
  );
}

function Section({
  title,
  lead,
  children,
}: {
  title: string;
  lead?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-14 sm:mt-20">
      <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h2>
      {lead && <p className="mt-2 max-w-3xl text-muted">{lead}</p>}
      <div className="mt-8">{children}</div>
    </section>
  );
}
