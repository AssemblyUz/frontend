import {getLocale, getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import Logo from './Logo';
import SocialIcon from './SocialIcon';
import {getSiteInfo} from '@/lib/site';

const LINKS = [
  {href: '/uyushmalar', key: 'associations'},
  {href: '/xizmatlar', key: 'services'},
  {href: '/loyihalar', key: 'projects'},
  {href: '/yangiliklar', key: 'news'},
  {href: '/haqida', key: 'about'},
  {href: '/aloqa', key: 'contact'},
] as const;

export default async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations('footer');
  const tNav = await getTranslations('nav');
  const site = await getSiteInfo(locale);
  const year = 2026;

  return (
    <footer className="mt-16 border-t border-border-base bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Logo className="h-10 w-auto" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">{t('about')}</p>
          <div className="mt-5 flex gap-3">
            {site.socials.map((s) =>
              s.url ? (
                <a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.name}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-base text-muted transition hover:border-brand hover:text-brand"
                >
                  <SocialIcon id={s.platform} className="h-4 w-4" />
                </a>
              ) : (
                <span
                  key={s.platform}
                  title={s.name}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-dashed border-border-base text-muted/40"
                >
                  <SocialIcon id={s.platform} className="h-4 w-4" />
                </span>
              ),
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground">{t('sections')}</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {LINKS.map((l) => (
              <li key={l.key}>
                <Link href={l.href} className="text-muted transition hover:text-brand">
                  {tNav(l.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground">{t('contact')}</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            <li>{site.address}</li>
            <li>
              <a href={`mailto:${site.email}`} className="transition hover:text-brand">
                {site.email}
              </a>
            </li>
            <li>
              <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="transition hover:text-brand">
                {site.phone}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border-base">
        <div className="mx-auto max-w-6xl px-4 py-5 text-center text-xs text-muted">
          © {year} {site.name}. {t('rights')}
        </div>
      </div>
    </footer>
  );
}
