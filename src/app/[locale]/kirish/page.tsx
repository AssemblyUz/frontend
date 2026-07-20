'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {useRouter} from '@/i18n/navigation';
import Logo from '@/components/Logo';
import {panelFetch, PanelError} from '@/lib/adminClient';

const inputCls =
  'w-full rounded-xl border border-border-base bg-surface px-3.5 py-2.5 text-sm text-foreground transition placeholder:text-muted/60 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30';
const labelCls = 'mb-1.5 block text-sm font-semibold text-foreground';

export default function LoginPage() {
  const t = useTranslations('admin.login');
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setBusy(true);

    try {
      await panelFetch('session/', {
        method: 'POST',
        json: {username: username.trim(), password},
      });
      router.replace('/admin');
      // The panel's guard runs server-side, so the tree must be refetched or
      // the redirect lands back on this page.
      router.refresh();
    } catch (caught) {
      // The backend deliberately returns one message for every cause -- wrong
      // password, unknown user, non-staff account -- so that failures cannot
      // be used to work out which usernames exist. Show it verbatim.
      setError(
        caught instanceof PanelError
          ? caught.status === 429
            ? t('throttled')
            : caught.detail
          : t('unreachable'),
      );
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo className="h-11 w-auto" />
          <h1 className="mt-5 text-xl font-extrabold tracking-tight text-foreground">
            {t('title')}
          </h1>
          <p className="mt-1.5 text-sm text-muted">{t('lead')}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border-base bg-card p-6 shadow-sm"
        >
          <div className="mb-4">
            <label htmlFor="username" className={labelCls}>
              {t('username')}
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              autoFocus
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={inputCls}
            />
          </div>

          <div className="mb-5">
            <label htmlFor="password" className={labelCls}>
              {t('password')}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls}
            />
          </div>

          {error && (
            <p
              role="alert"
              className="mb-4 rounded-xl border border-accent/30 bg-accent/10 px-3.5 py-2.5 text-sm text-accent"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-brand-fg transition hover:bg-brand-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 disabled:opacity-60"
          >
            {busy ? t('signingIn') : t('signIn')}
          </button>
        </form>
      </div>
    </main>
  );
}
