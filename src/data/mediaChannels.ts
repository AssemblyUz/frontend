/**
 * The Assembly's media projects and the YouTube channel behind each one.
 *
 * Videos are pulled from each channel's public RSS feed, so a new upload appears
 * on the site by itself — see `lib/youtube.ts`. No API key or quota is involved.
 *
 * TO ADD A CHANNEL: paste its channel ID into `channelId` below. The ID is the
 * `UC…` string, not the @handle. To find it, open the channel and read the
 * `channelId` out of the page source, or use the handle form:
 *
 *   https://www.youtube.com/@handle  ->  view-source, search for "channelId"
 *
 * An entry with an empty `channelId` is skipped, so a project can sit here
 * before its channel exists. When none are configured the media section hides
 * itself and the page shows its empty state rather than an empty grid.
 */

export type MediaChannel = {
  /** Stable key — also the filter value in the URL. */
  key: string;
  /** Project name as it should appear on the site. */
  name: string;
  /** YouTube channel ID (`UC…`). Empty means "not connected yet". */
  channelId: string;
};

export const mediaChannels: readonly MediaChannel[] = [
  {key: 'reportaj-go', name: 'Reportaj GO', channelId: ''},
  {key: 'biznes-tv', name: 'Biznes TV', channelId: ''},
  {key: 'fikrat-tv', name: 'Fikrat TV', channelId: ''},
];

/** Only the channels that actually have an ID. */
export function connectedChannels(): readonly MediaChannel[] {
  return mediaChannels.filter((channel) => channel.channelId.trim() !== '');
}
