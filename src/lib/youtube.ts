import {connectedChannels, type MediaChannel} from '@/data/mediaChannels';

export type MediaVideo = {
  /** YouTube video ID. */
  id: string;
  title: string;
  /** ISO date the video was published. */
  published: string;
  thumbnail: string;
  /** Which media project it came from. */
  channelKey: string;
  channelName: string;
};

/** How long a channel's feed is reused before being fetched again. */
const REVALIDATE_SECONDS = 1800;
const FETCH_TIMEOUT_MS = 8000;

/** The feed carries the 15 most recent uploads — YouTube's own limit. */
function feedUrl(channelId: string): string {
  return `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`;
}

function decodeEntities(value: string): string {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
}

function tag(source: string, name: string): string | undefined {
  const match = new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`).exec(source);
  return match ? decodeEntities(match[1].trim()) : undefined;
}

/**
 * Atom feed -> videos. Parsed with regex rather than an XML library: the feed
 * shape is fixed and documented, and this keeps the dependency list empty.
 */
function parseFeed(xml: string, channel: MediaChannel): MediaVideo[] {
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];

  return entries.flatMap((entry) => {
    const id = tag(entry, 'yt:videoId');
    const title = tag(entry, 'title');
    const published = tag(entry, 'published');
    if (!id || !title || !published) return [];

    const thumbnail =
      /<media:thumbnail\s+url="([^"]+)"/.exec(entry)?.[1] ??
      `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

    return [
      {
        id,
        title,
        published,
        thumbnail,
        channelKey: channel.key,
        channelName: channel.name,
      },
    ];
  });
}

async function fetchChannel(channel: MediaChannel): Promise<MediaVideo[]> {
  const response = await fetch(feedUrl(channel.channelId), {
    next: {revalidate: REVALIDATE_SECONDS},
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return parseFeed(await response.text(), channel);
}

const SHORTS_PROBE_TIMEOUT_MS = 6000;

/**
 * Whether a video is a Short.
 *
 * The feed carries neither a duration nor a Shorts flag, so this asks YouTube
 * directly: /shorts/<id> answers 200 for a Short, and redirects with a 303 to
 * /watch for a full-length upload. `redirect: 'manual'` is what makes that
 * difference readable instead of silently followed.
 *
 * Cached indefinitely, because the answer is a fixed property of the video: it
 * costs one request per video ID ever, not one per render — which matters,
 * since the home page is `force-dynamic` and would otherwise re-ask on every
 * visit.
 *
 * A probe that fails counts the video as full-length. A momentary YouTube error
 * letting one Short through until the next fetch is a smaller fault than the
 * same error emptying the column.
 */
async function isShort(id: string): Promise<boolean> {
  try {
    const response = await fetch(`https://www.youtube.com/shorts/${id}`, {
      method: 'HEAD',
      redirect: 'manual',
      cache: 'force-cache',
      signal: AbortSignal.timeout(SHORTS_PROBE_TIMEOUT_MS),
    });
    return response.status === 200;
  } catch (reason) {
    console.error(`[youtube] could not tell whether ${id} is a Short.`, reason);
    return false;
  }
}

/** One channel's feed with that channel's own rules applied. */
async function channelVideos(channel: MediaChannel): Promise<MediaVideo[]> {
  const videos = await fetchChannel(channel);
  videos.sort((a, b) => b.published.localeCompare(a.published));

  let kept = videos;
  if (channel.longFormOnly) {
    // Probed in parallel: this is a handful of HEAD requests, and after the
    // first render they are served from the cache anyway.
    const shorts = await Promise.all(videos.map((video) => isShort(video.id)));
    kept = videos.filter((_, i) => !shorts[i]);
  }

  return channel.maxVideos === undefined ? kept : kept.slice(0, channel.maxVideos);
}

export type MediaChannelVideos = {channel: MediaChannel; videos: MediaVideo[]};

/**
 * Every connected media project with its own videos, in the order the channels
 * are declared — which is the order of the columns on the media page.
 *
 * Each channel is fetched independently: one unreachable or renamed channel
 * costs its own videos, not the whole section.
 */
export async function getMediaByChannel(): Promise<MediaChannelVideos[]> {
  const channels = connectedChannels();
  if (channels.length === 0) return [];

  const results = await Promise.allSettled(channels.map(channelVideos));

  return channels.map((channel, i) => {
    const result = results[i];
    if (result.status === 'fulfilled') return {channel, videos: result.value};

    console.error(
      `[youtube] could not load the feed for "${channel.name}" (${channel.channelId}).`,
      result.reason,
    );
    return {channel, videos: []};
  });
}

/**
 * The same videos as one list, newest first — for the home page, which shows a
 * handful across all the projects rather than a column each.
 *
 * A total failure — no channels configured, or YouTube unreachable from the
 * server — returns an empty list, so callers render their empty state instead
 * of erroring.
 */
export async function getMediaVideos(limit?: number): Promise<MediaVideo[]> {
  const groups = await getMediaByChannel();

  const seen = new Set<string>();
  const unique = groups
    .flatMap((group) => group.videos)
    .filter((video) => {
      if (seen.has(video.id)) return false;
      seen.add(video.id);
      return true;
    });

  unique.sort((a, b) => b.published.localeCompare(a.published));
  return limit ? unique.slice(0, limit) : unique;
}
