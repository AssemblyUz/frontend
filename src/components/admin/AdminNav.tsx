'use client';

import {useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/navigation';
import {useAdminSession} from './AdminSessionProvider';

type NavKey = 'dashboard' | 'newArticle';

const ITEMS: {
  key: NavKey;
  href: string;
  /** Permission flag that must be true for this item to appear. */
  needs?: 'canCreate';
  icon: React.ReactNode;
}[] = [
  {
    key: 'dashboard',
    href: '/admin',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </svg>
    ),
  },
  {
    key: 'newArticle',
    href: '/admin/yangi',
    needs: 'canCreate',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
  },
];

export default function AdminNav({variant}: {variant: 'side' | 'top'}) {
  const t = useTranslations('admin.nav');
  const pathname = usePathname();
  const user = useAdminSession();

  function isActive(href: string): boolean {
    // /admin is only active on itself, or it would light up on every child.
    if (href === '/admin') return pathname === '/admin';
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const items = ITEMS.filter((item) => !item.needs || user[item.needs]);
  const state = (active: boolean) =>
    active
      ? 'bg-brand text-brand-fg'
      : 'text-muted hover:bg-background hover:text-foreground';

  const focus =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40';

  if (variant === 'top') {
    return (
      <nav aria-label={t('label')} className="flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            aria-current={isActive(item.href) ? 'page' : undefined}
            className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold transition ${focus} ${state(isActive(item.href))}`}
          >
            {item.icon}
            {t(item.key)}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav aria-label={t('label')} className="flex flex-col gap-1">
      {items.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          aria-current={isActive(item.href) ? 'page' : undefined}
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${focus} ${state(isActive(item.href))}`}
        >
          {item.icon}
          {t(item.key)}
        </Link>
      ))}
    </nav>
  );
}
