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
  // youtube.com/@assemblyuz — "O'zbekiston Iqtisodiyot Assambleyasi".
  {key: 'assembly', name: 'Assambleya', channelId: 'UCyeiMGUb4XQbixP3QJbh7ig'},
  // youtube.com/@chaqiriquz — the Chaqiriq platform. Note there is an unrelated
  // @chaqiriq (a personal channel of programming tutorials); this is not it.
  {key: 'chaqiriq', name: 'Chaqiriq', channelId: 'UCrCE2xlfB5-oe6VcSbqgvyQ'},
  // youtube.com/@UmarovMuhtor — the Assembly's chairman. Not @muhtorumarov or
  // @muxtorumarov, which are separate empty accounts under the same name.
  {key: 'muhtor-umarov', name: 'Muhtor Umarov', channelId: 'UCd4mg44bbgWVQLfJkv3IMkg'},
];

/** Only the channels that actually have an ID. */
export function connectedChannels(): readonly MediaChannel[] {
  return mediaChannels.filter((channel) => channel.channelId.trim() !== '');
}
