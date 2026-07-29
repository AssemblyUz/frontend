'use client';

/* eslint-disable @next/next/no-img-element */

import {useState} from 'react';
import type {MediaVideo} from '@/lib/youtube';

/**
 * A video as a thumbnail that becomes a player when clicked.
 *
 * Nothing from YouTube loads until then: a page of embedded players would pull
 * their script and cookies for every card, which is both slow and more tracking
 * than a visitor asked for. The iframe uses the nocookie host and only appears
 * after the click.
 */
export default function VideoCard({
  video,
  labels,
}: {
  video: MediaVideo;
  labels: {play: string; watchOn: string};
}) {
  const [playing, setPlaying] = useState(false);

  const published = new Date(video.published);
  const date = Number.isNaN(published.getTime())
    ? null
    : published.toISOString().slice(0, 10).split('-').reverse().join('.');

  return (
    <article className="group overflow-hidden rounded-2xl border border-border-base bg-card transition hover:border-brand hover:shadow-lg">
      <div className="relative aspect-video bg-foreground/5">
        {playing ? (
          <iframe
            // autoplay is intentional: the visitor just asked for this video.
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`${labels.play}: ${video.title}`}
            className="absolute inset-0 h-full w-full cursor-pointer"
          >
            <img
              src={video.thumbnail}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent"
            />
            <span
              aria-hidden
              className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 pl-1 text-xl text-slate-900 shadow-lg transition group-hover:scale-110 group-hover:bg-white"
            >
              ▶
            </span>
          </button>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-muted">
          <span className="font-semibold text-brand">{video.channelName}</span>
          {date && (
            <>
              <span aria-hidden>•</span>
              <time dateTime={video.published}>{date}</time>
            </>
          )}
        </div>
        <h3 className="mt-2 font-semibold leading-snug text-foreground">{video.title}</h3>
        <a
          href={`https://www.youtube.com/watch?v=${video.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 py-1 text-sm font-medium text-muted transition-all hover:gap-2.5 hover:text-brand"
        >
          {labels.watchOn} ↗
        </a>
      </div>
    </article>
  );
}
