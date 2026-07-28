'use client';

import {useRef} from 'react';
import {ideaFor} from '@/data/idea';

/**
 * The hero's single call to action: the idea's name, opening the statement
 * behind it.
 *
 * Built on the native <dialog> rather than a hand-rolled overlay, which brings
 * Escape to close, a focus trap, and inertness of the page behind it without
 * reimplementing any of the three. It is display:none until opened, so no
 * conditional rendering is needed either.
 */
export default function IdeaDialog({locale, closeLabel}: {locale: string; closeLabel: string}) {
  const dialog = useRef<HTMLDialogElement>(null);
  // Title and body come from one place, so the button cannot name the idea
  // differently from the panel it opens.
  const {title, blocks} = ideaFor(locale);

  /**
   * A click on the dialog element itself landed on the backdrop: the content
   * sits in a child, so anything inside it targets that child instead. This is
   * what makes clicking outside close the panel, which readers expect and the
   * native element does not do on its own.
   */
  function closeOnBackdrop(event: React.MouseEvent<HTMLDialogElement>) {
    if (event.target === dialog.current) dialog.current?.close();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-left text-sm font-semibold text-brand-fg shadow-sm transition hover:bg-brand-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
      >
        {title}
        <span aria-hidden="true">→</span>
      </button>

      <dialog
        ref={dialog}
        onClick={closeOnBackdrop}
        aria-labelledby="idea-title"
        // `m-auto` is what centres it: a native dialog relies on `margin: auto`
        // from the UA stylesheet, and Tailwind's preflight resets every margin
        // to zero — without this the panel sits in the top-left corner.
        // The height limit belongs to the scrolling child alone, and this
        // element takes whatever height that leaves. Setting it on both put the
        // child's border-box 2px over this one's limit, so the dialog scrolled
        // as well and the panel showed two scrollbars side by side.
        className="m-auto w-[min(46rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border-base bg-card p-0 text-foreground shadow-2xl backdrop:bg-black/70"
      >
        {/* The scroll container is this child, not the dialog: a sticky header
            inside a scrolling dialog scrolls away with the rest of it. */}
        <div className="max-h-[85vh] overflow-y-auto overscroll-contain">
          <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-border-base bg-card/95 px-5 py-4 backdrop-blur sm:px-7">
            <h2 id="idea-title" className="text-lg font-bold leading-snug tracking-tight sm:text-xl">
              {title}
            </h2>
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              aria-label={closeLabel}
              className="-mr-1 shrink-0 rounded-lg p-1.5 text-xl leading-none text-muted transition hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            >
              <span aria-hidden="true">✕</span>
            </button>
          </div>

          <div className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
            {blocks.map((block, i) =>
              block.kind === 'paragraph' ? (
                // Fixed, never-reordered content — the index is a stable key.
                <p key={i} className="leading-relaxed text-muted">
                  {block.text}
                </p>
              ) : (
                <div key={i} className="space-y-2">
                  <p className="leading-relaxed text-muted">{block.lead}</p>
                  <ul className="space-y-2 pl-1">
                    {block.items.map((item) => (
                      <li key={item} className="flex gap-2.5 leading-relaxed text-muted">
                        <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
