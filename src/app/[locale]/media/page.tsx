import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import PageHero from '@/components/PageHero';
import RevealScope from '@/components/motion/RevealScope';
import VideoCard from '@/components/VideoCard';
import {getMediaByChannel} from '@/lib/youtube';

/** The feeds are re-read on this cadence, so new uploads appear on their own. */
export const revalidate = 1800;

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'media'});
  return {title: t('title'), description: t('lead')};
}

export default async function MediaPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('media');

  const columns = await getMediaByChannel();
  const labels = {play: t('play'), watchOn: t('watchOn')};
  const total = columns.reduce((sum, column) => sum + column.videos.length, 0);

  return (
    <>
      <PageHero title={t('title')} lead={t('lead')} />

      <div className="shell py-section-sm">
        {/* The projects themselves, whether or not their channel is connected. */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-brand">
            {t('projectsTitle')}
          </h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            {columns.map(({channel, videos}) => (
              <li
                key={channel.key}
                className="flex items-baseline gap-2 rounded-xl border border-border-base bg-card px-4 py-2.5"
              >
                <span className="text-sm font-semibold text-foreground">{channel.name}</span>
                <span className="text-xs text-muted">
                  {videos.length > 0 ? t('videoCount', {count: videos.length}) : t('soon')}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-section-sm">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-fluid-3xl font-bold tracking-tight text-foreground">
                {t('latestTitle')}
              </h2>
              <p className="mt-2 max-w-2xl text-muted">{t('latestLead')}</p>
            </div>
            {total > 0 && <p className="text-sm text-muted">{t('videoCount', {count: total})}</p>}
          </div>

          {total === 0 ? (
            <p className="mt-8 rounded-2xl border border-border-base bg-surface p-6 leading-relaxed text-muted">
              {t('empty')}
            </p>
          ) : (
            /* A column per project, in the order the channels are declared, so
               each one reads as its own body of work rather than as entries in
               a single chronological feed. A channel with nothing to show is
               left out entirely — an empty column would just be a gap. */
            <RevealScope stagger={90} className="mt-8 grid gap-5 md:grid-cols-3">
              {columns
                .filter(({videos}) => videos.length > 0)
                .map(({channel, videos}) => (
                  <div key={channel.key} data-reveal className="flex flex-col gap-5">
                    {videos.map((video) => (
                      <VideoCard key={video.id} video={video} labels={labels} />
                    ))}
                  </div>
                ))}
            </RevealScope>
          )}
        </section>
      </div>
    </>
  );
}
