import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import PageHero from '@/components/PageHero';
import ContactForm from '@/components/ContactForm';
import SocialIcon from '@/components/SocialIcon';
import {getSiteInfo} from '@/lib/site';

/**
 * Google geocodes an English address far more reliably than a transliterated
 * Uzbek one, so the map always uses the English copy regardless of the page's
 * locale. Both come from "Site settings" in the admin.
 */
function mapSrc(address: string): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=14&output=embed`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'contact'});
  return {title: t('title'), description: t('lead')};
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contact');

  const [site, siteEn] = await Promise.all([getSiteInfo(locale), getSiteInfo('en')]);

  const info = [
    {icon: '📍', title: t('addressTitle'), value: site.address, href: undefined},
    {icon: '✉️', title: t('emailTitle'), value: site.email, href: `mailto:${site.email}`},
    {
      icon: '📞',
      title: t('phoneTitle'),
      value: site.phone,
      href: `tel:${site.phone.replace(/\s/g, '')}`,
    },
  ];
  const hasSocial = site.socials.some((s) => s.url);

  return (
    <>
      <PageHero title={t('title')} lead={t('lead')} />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Left: info + socials */}
          <div>
            <div className="space-y-4">
              {info.map((it) => (
                <div
                  key={it.title}
                  className="flex items-start gap-4 rounded-2xl border border-border-base bg-card p-5"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-xl">
                    {it.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-muted">{it.title}</p>
                    {it.href ? (
                      <a
                        href={it.href}
                        className="break-words font-semibold text-foreground transition hover:text-brand"
                      >
                        {it.value}
                      </a>
                    ) : (
                      <p className="break-words font-semibold text-foreground">{it.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Socials */}
            <div className="mt-8">
              <h2 className="text-sm font-semibold text-foreground">{t('socialTitle')}</h2>
              <div className="mt-3 flex flex-wrap gap-3">
                {site.socials.map((s) =>
                  s.url ? (
                    <a
                      key={s.platform}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={s.name}
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-border-base bg-card text-muted transition hover:border-brand hover:text-brand"
                    >
                      <SocialIcon id={s.platform} />
                    </a>
                  ) : (
                    <span
                      key={s.platform}
                      title={t('socialSoon')}
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-dashed border-border-base text-muted/50"
                    >
                      <SocialIcon id={s.platform} />
                    </span>
                  ),
                )}
              </div>
              {!hasSocial && <p className="mt-2 text-xs text-muted">{t('socialSoon')}</p>}
            </div>
          </div>

          {/* Right: form */}
          <div className="rounded-2xl border border-border-base bg-card p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-foreground">{t('formTitle')}</h2>
            <div className="mt-5">
              <ContactForm
                email={site.email}
                labels={{
                  name: t('formName'),
                  email: t('formEmail'),
                  message: t('formMessage'),
                  submit: t('formSubmit'),
                  note: t('formNote'),
                }}
              />
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="mt-10">
          <h2 className="mb-3 text-sm font-semibold text-foreground">{t('mapTitle')}</h2>
          <div className="overflow-hidden rounded-2xl border border-border-base">
            <iframe
              src={mapSrc(siteEn.address)}
              title={t('mapTitle')}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-72 w-full sm:h-96"
            />
          </div>
        </div>
      </div>
    </>
  );
}
