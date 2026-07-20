import type {ContentLocale} from '@/lib/adminTypes';

type Status = 'published' | 'scheduled' | 'draft';

const STATUS_STYLE: Record<Status, string> = {
  published: 'bg-brand/10 text-brand',
  // Scheduled is deliberately distinct from published: the flag is on but the
  // site is not showing it yet, and conflating the two makes an editor think a
  // post is live when it is not.
  scheduled: 'bg-accent/15 text-accent',
  draft: 'bg-muted/15 text-muted',
};

export function StatusPill({status, label}: {status: Status; label: string}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[status]}`}
    >
      {label}
    </span>
  );
}

/**
 * Which locales an article is still missing.
 *
 * Shown because the site falls back to Uzbek for any blank field, so a missing
 * Russian title is invisible on the public page — it silently renders the
 * Uzbek one instead of looking broken.
 */
export function TranslationGaps({missing}: {missing: ContentLocale[]}) {
  if (missing.length === 0) return null;

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border-base px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
      {missing.join(' · ')}
    </span>
  );
}
