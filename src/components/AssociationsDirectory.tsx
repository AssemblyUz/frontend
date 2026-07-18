'use client';

import {useMemo, useState} from 'react';
import {Link} from '@/i18n/navigation';
import type {LocalizedAssociation} from '@/data/associations';

type Labels = {
  searchPlaceholder: string;
  activityLabel: string;
  details: string;
  noResults: string;
  unit: string;
};

function monogram(name: string) {
  const m = name.match(/[A-Za-zА-Яа-яЁёЎўҚқҒғҲҳ0-9]/);
  return (m ? m[0] : name.charAt(0)).toUpperCase();
}

export default function AssociationsDirectory({
  items,
  labels,
}: {
  items: LocalizedAssociation[];
  labels: Labels;
}) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) =>
      [it.name, it.activity].filter(Boolean).some((v) => v!.toLowerCase().includes(q)),
    );
  }, [items, query]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            🔍
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className="w-full rounded-xl border border-border-base bg-card py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-brand/30"
          />
        </div>
        <span className="text-sm text-muted">
          <span className="font-semibold text-foreground">{filtered.length}</span> {labels.unit}
        </span>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-muted">{labels.noResults}</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((it) => (
            <Link
              key={it.id}
              href={`/uyushmalar/${it.id}`}
              className="group flex flex-col rounded-2xl border border-border-base bg-card p-5 transition hover:-translate-y-0.5 hover:border-brand hover:shadow-lg"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-lg font-bold text-brand">
                  {monogram(it.name)}
                </span>
                <h2 className="text-[15px] font-semibold leading-snug text-foreground group-hover:text-brand">
                  {it.name}
                </h2>
              </div>

              {it.activity && (
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">{it.activity}</p>
              )}

              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand transition group-hover:gap-2">
                {labels.details} →
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
