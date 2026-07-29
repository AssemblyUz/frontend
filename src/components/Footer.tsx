import {getLocale, getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import Logo from './Logo';
import SocialIcon from './SocialIcon';
import {getSiteInfo} from '@/lib/site';

/** Same order as the header and the gate's doors: "who we are" leads. */
const LINKS = [
  {href: '/haqida', key: 'about'},
  {href: '/uyushmalar', key: 'associations'},
  {href: '/xizmatlar', key: 'services'},
  {href: '/loyihalar', key: 'projects'},
  {href: '/bloklar', key: 'blocks'},
  {href: '/media', key: 'media'},
  {href: '/yangiliklar', key: 'news'},
  {href: '/aloqa', key: 'contact'},
] as const;

export default async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations('footer');
  const tNav = await getTranslations('nav');
  const site = await getSiteInfo(locale);
  const year = 2026;

  return (
    <footer className="mt-section border-t border-border-base bg-surface">
      <div className="shell grid gap-8 py-section-sm sm:grid-cols-2 sm:gap-10 lg:grid-cols-4">
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
                  className="tap flex h-9 w-9 items-center justify-center rounded-lg border border-border-base text-muted transition hover:border-brand hover:text-brand"
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
          {/* A 14px line of text is a 17px-tall tap target, and eight of them
              stacked 10px apart is the hardest thing on the site to hit with a
              thumb. Where the pointer is coarse the rows get real height and
              the gap between them shrinks to keep the block much the same
              size; a mouse sees the original spacing. */}
          <ul className="mt-4 space-y-2.5 text-sm pointer-coarse:space-y-0.5">
            {LINKS.map((l) => (
              <li key={l.key}>
                <Link
                  href={l.href}
                  className="inline-block text-muted transition hover:text-brand pointer-coarse:py-1.5"
                >
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
              <a
                href={`mailto:${site.email}`}
                className="inline-block break-all transition hover:text-brand pointer-coarse:py-1"
              >
                {site.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${site.phone.replace(/\s/g, '')}`}
                className="inline-block transition hover:text-brand pointer-coarse:py-1"
              >
                {site.phone}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border-base">
        {/* pb-safe clears the home indicator on gesture-navigation phones,
            where a plain padding put this line under the system bar. */}
        <div className="shell pb-safe pt-5 text-center text-xs text-muted">
          © {year} {site.name}. {t('rights')}
        </div>
      </div>
    </footer>
  );
}
