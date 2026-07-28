'use server';

import {revalidatePath} from 'next/cache';
import {getPanelSession} from './adminServer';

/**
 * Drop the cached public pages after an edit in the panel.
 *
 * Without this, a published article waits out the five-minute revalidation
 * window in `[locale]/layout.tsx` before it appears — which reads as the post
 * having failed, and sent one editor back to the form to try again.
 *
 * The whole tree is purged rather than the article's own two paths. An article
 * shows up in the list, on the home page, in the "related" strip of every other
 * article, and under three locales; enumerating that is a list to get wrong,
 * and regenerating this site is cheap.
 *
 * Callers must not let a failure here surface as a failed save: the article is
 * already stored by the time this runs, and the timed cycle still picks it up.
 */
export async function revalidatePublicPages(): Promise<void> {
  // Reachable by anyone who can post to this app, so it checks the session
  // itself: an unauthenticated caller could otherwise force regeneration in a
  // loop. Silent because there is nothing here worth reporting to a stranger.
  const user = await getPanelSession();
  if (!user) return;

  revalidatePath('/', 'layout');
}
