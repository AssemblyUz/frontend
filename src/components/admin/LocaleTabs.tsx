'use client';

import {LOCALES, type ContentLocale} from '@/lib/adminTypes';

const LABELS: Record<ContentLocale, string> = {
  uz: "O'zbekcha",
  ru: 'Русский',
  en: 'English',
};

/**
 * Switches which language's fields the form is showing.
 *
 * Every text field exists three times. Stacking all of them makes a form with
 * twelve inputs where a reader expects four, and an editor working in one
 * language has to skip past two irrelevant boxes each time. One language at a
 * time keeps the form the shape it looks like.
 *
 * The dot marks a language whose title is still empty. Without it, tabbing away
 * hides the fact that anything is missing -- and the site falls back to Uzbek
 * for blank fields, so an untranslated article looks fine on the public page
 * rather than obviously broken.
 */
export default function LocaleTabs({
  active,
  onChange,
  incomplete,
}: {
  active: ContentLocale;
  onChange: (locale: ContentLocale) => void;
  incomplete: ContentLocale[];
}) {
  return (
    <div
      role="tablist"
      aria-label="Content language"
      className="inline-flex rounded-xl border border-border-base bg-surface p-1"
    >
      {LOCALES.map((locale) => {
        const selected = locale === active;
        return (
          <button
            key={locale}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(locale)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 ${
              selected
                ? 'bg-brand text-brand-fg'
                : 'text-muted hover:bg-background hover:text-foreground'
            }`}
          >
            {LABELS[locale]}
            {incomplete.includes(locale) && (
              <span
                aria-label="incomplete"
                className={`h-1.5 w-1.5 rounded-full ${
                  selected ? 'bg-brand-fg/70' : 'bg-accent'
                }`}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
