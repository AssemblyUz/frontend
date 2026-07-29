import {redirect} from 'next/navigation';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import Logo from '@/components/Logo';
import {getPanelSession} from '@/lib/adminServer';
import AdminSessionProvider from '@/components/admin/AdminSessionProvider';
import AdminNav from '@/components/admin/AdminNav';
import SignOutButton from '@/components/admin/SignOutButton';

/**
 * The panel is per-user and always reflects the database as it is right now,
 * so nothing under this segment may be prerendered or cached.
 */
export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  // Guarding in the layout covers every route beneath it, and redirect()
  // throws — so no admin markup or data ever reaches an unauthenticated
  // browser, not even briefly.
  //
  // This is `redirect` from next/navigation, which is NOT locale-aware, hence
  // the hand-written prefix. Swapping in the one from @/i18n/navigation
  // without dropping the prefix would send the editor to /uz/uz/kirish.
  const user = await getPanelSession();
  if (!user) redirect(`/${locale}/kirish`);

  const t = await getTranslations('admin');

  return (
    <AdminSessionProvider user={user}>
      <div className="min-h-dvh bg-background lg:flex">
        {/* Desktop sidebar. Rendered alongside the mobile bar and switched
            purely by CSS — no breakpoint state, no drawer to get stuck open.

            It scrolls on its own once the viewport is shorter than its
            contents, so the sign-out block pinned to the bottom stays
            reachable on a laptop in a small window. */}
        <aside className="sticky top-0 hidden h-dvh w-56 shrink-0 flex-col overflow-y-auto border-r border-border-base bg-surface px-4 py-5 lg:flex xl:w-60">
          <div className="mb-6 px-1">
            <Link href="/admin" className="inline-flex items-center">
              <Logo className="h-8 w-auto" />
            </Link>
          </div>

          <span className="mb-2 px-3 text-[11px] font-bold uppercase tracking-[.12em] text-muted">
            {t('title')}
          </span>

          <AdminNav variant="side" />

          {/* mt-auto pins this block to the bottom of the flex column. */}
          <div className="mt-auto flex flex-col gap-1 border-t border-border-base pt-4">
            <div className="px-3 pb-2">
              <div className="truncate text-sm font-semibold text-foreground">{user.name}</div>
              <div className="truncate text-xs text-muted">{user.email || user.username}</div>
            </div>
            <Link
              href="/"
              className="rounded-xl px-3 py-2.5 text-sm font-semibold text-muted transition hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            >
              ← {t('backToSite')}
            </Link>
            <SignOutButton />
          </div>
        </aside>

        {/* Mobile top bar. Sticky so the panel's own navigation stays in reach
            while a long article form is being scrolled through. */}
        <header className="sticky top-0 z-30 border-b border-border-base bg-surface/95 backdrop-blur lg:hidden">
          <div className="flex items-center gap-3 px-gutter py-3">
            <Link href="/admin" className="inline-flex items-center">
              <Logo className="h-7 w-auto" />
            </Link>
            <span className="ml-auto truncate text-xs text-muted">{user.name}</span>
            <SignOutButton />
          </div>
          <div className="border-t border-border-base px-3 py-2">
            <AdminNav variant="top" />
          </div>
        </header>

        {/* min-w-0 stops a wide table or long slug from forcing the whole
            layout to scroll horizontally. */}
        <main className="min-w-0 flex-1 px-gutter pt-6 pb-safe [--pb-safe-min:1.5rem] sm:pt-8">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
    </AdminSessionProvider>
  );
}
