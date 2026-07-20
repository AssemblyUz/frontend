'use client';

import {useEffect, useRef, useState} from 'react';

/**
 * Destructive action behind a two-step inline confirm.
 *
 * Not `window.confirm`: that blocks the whole tab, cannot be styled or
 * translated, and is suppressed outright by some browsers. The armed state
 * reverts on a timer so a click left half-finished does not stay dangerous.
 */
const REVERT_MS = 4000;

export default function ConfirmButton({
  onConfirm,
  label,
  confirmLabel,
  busyLabel,
  className = '',
}: {
  onConfirm: () => Promise<void> | void;
  label: string;
  confirmLabel: string;
  busyLabel: string;
  className?: string;
}) {
  const [armed, setArmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!armed) return;
    timer.current = setTimeout(() => setArmed(false), REVERT_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [armed]);

  async function handleClick() {
    if (!armed) {
      setArmed(true);
      return;
    }
    if (timer.current) clearTimeout(timer.current);
    setBusy(true);
    try {
      await onConfirm();
    } finally {
      // The row is usually gone by now; guard anyway so a failed delete does
      // not leave a permanently spinning button.
      setBusy(false);
      setArmed(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 disabled:opacity-60 ${
        armed
          ? 'bg-accent text-brand-fg'
          : 'text-muted hover:bg-background hover:text-accent'
      } ${className}`}
    >
      {busy ? busyLabel : armed ? confirmLabel : label}
    </button>
  );
}
