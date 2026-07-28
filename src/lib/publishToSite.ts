import {revalidatePublicPages} from './revalidatePublic';

/**
 * Push a panel change out to the public pages, tolerating failure.
 *
 * Deliberately swallows its error. By the time this runs the change is already
 * stored, so letting it throw would turn a successful save into a visible
 * failure and invite the editor to submit again. The worst case without it is
 * the five-minute revalidation cycle picking the change up on its own — a wait,
 * not a loss.
 */
export async function publishToSite(): Promise<void> {
  try {
    await revalidatePublicPages();
  } catch (error) {
    console.error('[panel] could not refresh the public pages immediately.', error);
  }
}
