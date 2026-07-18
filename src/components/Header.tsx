'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';

const NAV = [
  {href: '/', key: 'home'},
  {href: '/uyushmalar', key: 'associations'},
  {href: '/xizmatlar', key: 'services'},
  {href: '/loyihalar', key: 'projects'},
  {href: '/yangiliklar', key: 'news'},
  {href: '/haqida', key: 'about'},
  {href: '/aloqa', key: 'contact'},
] as const;

export default function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border-base bg-surface/80 backdrop-blur supports-[backdrop-filter]:bg-surface/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center shrink-0" onClick={() => setOpen(false)}>
          <Logo className="h-8 w-auto sm:h-9" />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`rounded-lg px-2.5 py-2 text-sm font-medium transition ${
                isActive(item.href)
                  ? 'bg-brand/10 text-brand'
                  : 'text-muted hover:bg-foreground/5 hover:text-foreground'
              }`}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
          <button
            className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-border-base text-muted"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border-base bg-surface px-4 py-2 lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive(item.href)
                  ? 'bg-brand/10 text-brand'
                  : 'text-foreground hover:bg-foreground/5'
              }`}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
