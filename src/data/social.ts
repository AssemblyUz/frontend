export type SocialId = 'telegram' | 'instagram' | 'facebook' | 'youtube';

export type Social = {
  id: SocialId;
  name: string;
  /** Real profile URL — empty means "not connected yet". */
  href: string;
};

/**
 * Fallback only. Social links are edited in the Django admin under
 * "Core → Social links" and served by `getSiteInfo()`. This list is used solely
 * when the API is unreachable, so the footer still renders.
 */
export const socials: Social[] = [
  {id: 'telegram', name: 'Telegram', href: 'https://t.me/uzassembly'},
  {id: 'instagram', name: 'Instagram', href: 'https://www.instagram.com/assemblyuz'},
  {id: 'youtube', name: 'YouTube', href: 'https://youtube.com/@assemblyuz'},
  {id: 'facebook', name: 'Facebook', href: 'https://www.facebook.com/uzchamberofficial'},
];
