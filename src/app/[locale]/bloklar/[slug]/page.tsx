import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';
import {
  findBlockContent,
  functionalBlocks,
  getFunctionalBlock,
  type FunctionalBlockContent,
} from '@/data/functionalBlocks';

type ProjectItem = {icon: string; name: string; desc: string};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    functionalBlocks.map((block) => ({locale, slug: block.slug})),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string; slug: string}>;
}): Promise<Metadata> {
  const {locale, slug} = await params;
  const block = getFunctionalBlock(slug);
  if (!block) return {};

  const t = await getTranslations({locale, namespace: 'blocks'});
  const content = findBlockContent(t.raw('items') as FunctionalBlockContent[], block.code);
  if (!content) return {};

  return {title: `${block.code} — ${content.name}`, description: content.tagline};
}

export default async function FunctionalBlockPage({
  params,
}: {
  params: Promise<{locale: string; slug: string}>;
}) {
  const {locale, slug} = await params;
  setRequestLocale(locale);

  const block = getFunctionalBlock(slug);
  if (!block) notFound();

  const t = await getTranslations('blocks');
  const tProj = await getTranslations('projects');
  const items = t.raw('items') as FunctionalBlockContent[];
  const content = findBlockContent(items, block.code);
  if (!content) notFound();

  const allProjects = tProj.raw('items') as ProjectItem[];
  const projects = block.projectIndexes
    .map((index) => allProjects[index])
    .filter((project): project is ProjectItem => Boolean(project));

  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden border-b border-border-base">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand/10 to-transparent" />
        <div className="relative shell py-section-sm">
          <Link
            href="/bloklar"
            className="inline-flex items-center gap-1.5 py-1 text-sm font-medium text-muted transition hover:text-brand"
          >
            ← {t('backToList')}
          </Link>

          <div className="mt-7 flex flex-wrap items-center gap-5">
            <span
              className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold ${block.tone.badge}`}
            >
              {block.code}
            </span>
            <div>
              <h1 className="text-fluid-3xl font-bold leading-tight tracking-tight text-foreground">
                {content.name}
              </h1>
              <p className={`mt-1 font-medium ${block.tone.text}`}>{content.short}</p>
            </div>
          </div>

          <p className="mt-6 max-w-3xl text-fluid-lg text-muted">
            {content.lead}
          </p>
        </div>
      </section>

      <div className="shell py-section-sm">
        {/* What it does / who it works with */}
        <div className="grid gap-5 lg:grid-cols-2">
          <Panel title={t('roleTitle')} rule={block.tone.rule}>
            <ul className="space-y-3.5">
              {content.role.map((line) => (
                <li key={line} className="flex gap-3 leading-relaxed text-muted">
                  <span
                    aria-hidden
                    className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${block.tone.rule}`}
                  />
                  {line}
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title={t('partnersTitle')} rule={block.tone.rule}>
            <ul className="space-y-3">
              {content.partners.map((partner) => (
                <li
                  key={partner}
                  className="rounded-xl border border-border-base bg-surface px-4 py-3 text-sm leading-relaxed text-foreground"
                >
                  {partner}
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        {/* Related projects */}
        <section className="mt-section-sm">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-fluid-3xl font-bold tracking-tight text-foreground">
                {t('projectsTitle')}
              </h2>
              <p className="mt-2 max-w-2xl text-muted">{t('projectsNote')}</p>
            </div>
            <Link
              href="/loyihalar"
              className="inline-flex items-center gap-1.5 py-1 text-sm font-semibold text-brand transition-all hover:gap-2.5"
            >
              {t('allProjects')} →
            </Link>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.name}
                className="rounded-2xl border border-border-base bg-card p-6 transition hover:border-brand hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-2xl">
                  {project.icon}
                </div>
                <h3 className="mt-4 font-semibold text-foreground">{project.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{project.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Outcomes */}
        <section className="mt-section-sm">
          <h2 className="text-fluid-3xl font-bold tracking-tight text-foreground">
            {t('outcomesTitle')}
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {content.outcomes.map((outcome, i) => (
              <li
                key={outcome}
                className="flex items-baseline gap-3 rounded-2xl border border-border-base bg-card p-5"
              >
                <span className={`text-sm font-bold ${block.tone.text}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-medium leading-snug text-foreground">{outcome}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Siblings — the four blocks double as navigation between these pages. */}
        <section className="mt-section-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-brand">
            {t('siblingsTitle')}
          </h2>
          <nav aria-label={t('siblingsTitle')} className="mt-4">
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {functionalBlocks.map((sibling) => {
                const siblingContent = findBlockContent(items, sibling.code);
                if (!siblingContent) return null;
                const isCurrent = sibling.slug === block.slug;
                return (
                  <li key={sibling.slug}>
                    <Link
                      href={`/bloklar/${sibling.slug}`}
                      aria-current={isCurrent ? 'page' : undefined}
                      className={`flex h-full items-center gap-3 rounded-2xl border bg-card p-4 transition ${
                        isCurrent
                          ? `${sibling.tone.border} shadow-sm`
                          : `border-border-base ${sibling.tone.hoverBorder}`
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${sibling.tone.badge}`}
                      >
                        {sibling.code}
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-foreground">
                          {siblingContent.name}
                        </span>
                        <span className="block text-xs text-muted">{siblingContent.short}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </section>

        {/* CTA */}
        <section className="mt-section-sm">
          <div className="rounded-3xl border border-border-base bg-surface p-6 text-center xs:p-8 sm:p-10">
            <h2 className="text-fluid-2xl font-bold tracking-tight text-foreground">
              {t('ctaTitle', {code: block.code})}
            </h2>
            <p className="mx-auto mt-3 max-w-xl leading-relaxed text-muted">{t('ctaLead')}</p>
            <Link
              href="/aloqa"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-brand-fg shadow-sm transition hover:bg-brand-strong"
            >
              {t('ctaBtn')} →
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

function Panel({
  title,
  rule,
  children,
}: {
  title: string;
  rule: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border-base bg-card p-5 xs:p-6 sm:p-8">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className={`mt-3 h-0.5 w-12 rounded-full ${rule}`} />
      <div className="mt-6">{children}</div>
    </section>
  );
}
