import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import PageHero from '@/components/PageHero';
import VideoCard from '@/components/VideoCard';
import {mediaChannels} from '@/data/mediaChannels';
import {getMediaVideos} from '@/lib/youtube';

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

  const videos = await getMediaVideos();
  const labels = {play: t('play'), watchOn: t('watchOn')};

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
            {mediaChannels.map((channel) => {
              const count = videos.filter((v) => v.channelKey === channel.key).length;
              return (
                <li
                  key={channel.key}
                  className="flex items-baseline gap-2 rounded-xl border border-border-base bg-card px-4 py-2.5"
                >
                  <span className="text-sm font-semibold text-foreground">{channel.name}</span>
                  <span className="text-xs text-muted">
                    {count > 0 ? t('videoCount', {count}) : t('soon')}
                  </span>
                </li>
              );
            })}
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
            {videos.length > 0 && (
              <p className="text-sm text-muted">{t('videoCount', {count: videos.length})}</p>
            )}
          </div>

          {videos.length === 0 ? (
            <p className="mt-8 rounded-2xl border border-border-base bg-surface p-6 leading-relaxed text-muted">
              {t('empty')}
            </p>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} labels={labels} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
