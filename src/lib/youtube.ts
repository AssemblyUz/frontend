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

/**
 * The latest videos across every connected media project, newest first.
 *
 * Each channel is fetched independently: one unreachable or renamed channel
 * costs its own videos, not the whole section. A total failure — no channels
 * configured, or YouTube unreachable from the server — returns an empty list, so
 * callers render their empty state instead of erroring.
 */
export async function getMediaVideos(limit?: number): Promise<MediaVideo[]> {
  const channels = connectedChannels();
  if (channels.length === 0) return [];

  const results = await Promise.allSettled(channels.map(fetchChannel));

  const videos: MediaVideo[] = [];
  results.forEach((result, i) => {
    if (result.status === 'fulfilled') {
      videos.push(...result.value);
    } else {
      console.error(
        `[youtube] could not load the feed for "${channels[i].name}" (${channels[i].channelId}).`,
        result.reason,
      );
    }
  });

  const seen = new Set<string>();
  const unique = videos.filter((video) => {
    if (seen.has(video.id)) return false;
    seen.add(video.id);
    return true;
  });

  unique.sort((a, b) => b.published.localeCompare(a.published));
  return limit ? unique.slice(0, limit) : unique;
}
