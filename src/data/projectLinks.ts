/**
 * Public website URL for each project, keyed by the project's name
 * (the `name` field in messages/*.json → projects.items).
 *
 * Projects are still in development: leave a project out (or empty) to show
 * the "In development" badge. When a project's site is ready, add its URL here
 * and the card will link to it automatically — nothing else needs to change.
 *
 * Example:
 *   'EDU-JOB': 'https://edujob.uz',
 */
export const projectLinks: Record<string, string> = {
  // Fill in as each project site goes live:
  // 'EDU-JOB': 'https://...',
  // 'INVEST HUB': 'https://...',
};

export function getProjectLink(name: string): string | undefined {
  const url = projectLinks[name];
  return url && url.trim() ? url : undefined;
}
