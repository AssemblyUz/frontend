import {Link} from '@/i18n/navigation';
import type {LocalizedNewsItem} from '@/lib/news';

export default function NewsCard({item, readMore}: {item: LocalizedNewsItem; readMore: string}) {
  return (
    <Link
      href={`/yangiliklar/${item.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border-base bg-card transition hover:border-brand hover:shadow-lg"
    >
      {item.cover && (
        // Fixed aspect box so a card's height does not depend on the photo the
        // editor happened to upload, and the grid stays aligned.
        <div className="aspect-[16/9] overflow-hidden bg-surface">
          {/* eslint-disable-next-line @next/next/no-img-element -- matches Logo.tsx;
              the project has no next/image config for the media host. */}
          <img
            src={item.cover.url}
            alt={item.cover.alt}
            loading="lazy"
            width={640}
            height={360}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-2xl">
          {item.icon}
        </span>
        <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand">
          {item.tag}
        </span>
      </div>

      <time dateTime={item.date} className="mt-5 text-xs font-medium text-muted">
        {item.dateLabel}
      </time>

      <h3 className="mt-1.5 font-semibold leading-snug text-foreground group-hover:text-brand">
        {item.title}
      </h3>

      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{item.excerpt}</p>

      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-all group-hover:gap-2.5">
        {readMore} →
      </span>
      </div>
    </Link>
  );
}
