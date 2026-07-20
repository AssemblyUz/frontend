'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {useRouter} from '@/i18n/navigation';
import {panelFetch} from '@/lib/adminClient';

export default function SignOutButton() {
  const t = useTranslations('admin');
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function signOut() {
    setBusy(true);
    try {
      await panelFetch('session/', {method: 'DELETE'});
    } catch {
      // Already signed out, or the backend is unreachable. Either way the
      // useful next step is the sign-in page, so fall through rather than
      // stranding the editor on a panel they can no longer write from.
    }
    // replace(), not push(): the panel must not be reachable via Back.
    router.replace('/kirish');
    // The layout guard runs on the server, so the tree has to be re-fetched
    // for the redirect to actually take effect.
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={busy}
      className="rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-muted transition hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 disabled:opacity-60"
    >
      {busy ? t('signingOut') : t('signOut')}
    </button>
  );
}
