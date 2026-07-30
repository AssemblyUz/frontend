'use client';

import {useState} from 'react';

type Labels = {
  name: string;
  email: string;
  phone: string;
  message: string;
  submit: string;
  sending: string;
  note: string;
  sent: string;
  needContact: string;
  failed: string;
  throttled: string;
};

type Status = 'idle' | 'sending' | 'sent';

const EMPTY = {name: '', email: '', phone: '', message: '', website: ''};

/**
 * The contact form.
 *
 * It posts to the site, which sends the mail — it no longer hands off to a
 * `mailto:`. That hand-off needed a configured mail client, which a phone
 * browser often has not got, and when it failed it did so silently: the button
 * appeared to do nothing and the message was gone. Every submission is now
 * stored in the panel before the notification is attempted, so a mail outage
 * costs a notification rather than the message.
 *
 * Email and phone are each optional but one is required — a reply has to go
 * somewhere. The server owns that rule; this only renders the outcome, so the
 * two cannot drift apart.
 */
export default function ContactForm({locale, labels}: {locale: string; labels: Labels}) {
  const [values, setValues] = useState(EMPTY);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  const set = (field: keyof typeof EMPTY, value: string) =>
    setValues((current) => ({...current, [field]: value}));

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending') return;

    setStatus('sending');
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...values, locale}),
      });

      if (response.ok) {
        setValues(EMPTY);
        setStatus('sent');
        return;
      }

      // A 400 is nearly always the one rule the inputs cannot express on their
      // own: neither email nor phone. Anything else is a server-side problem
      // the visitor can only retry.
      setError(
        response.status === 400
          ? labels.needContact
          : response.status === 429
            ? labels.throttled
            : labels.failed,
      );
      setStatus('idle');
    } catch {
      setError(labels.failed);
      setStatus('idle');
    }
  }

  const field =
    'w-full rounded-xl border border-border-base bg-card px-4 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-brand/30 disabled:opacity-60';

  if (status === 'sent') {
    return (
      <p
        role="status"
        className="rounded-xl border border-brand/30 bg-brand/5 px-4 py-5 text-sm leading-relaxed text-foreground"
      >
        {labels.sent}
      </p>
    );
  }

  const busy = status === 'sending';

  return (
    <form onSubmit={onSubmit} className="relative space-y-4">
      <input
        type="text"
        required
        disabled={busy}
        autoComplete="name"
        placeholder={labels.name}
        value={values.name}
        onChange={(e) => set('name', e.target.value)}
        className={field}
      />
      {/* Neither of these is required on its own; the server insists on one. */}
      <input
        type="email"
        disabled={busy}
        autoComplete="email"
        placeholder={labels.email}
        value={values.email}
        onChange={(e) => set('email', e.target.value)}
        className={field}
      />
      <input
        type="tel"
        disabled={busy}
        autoComplete="tel"
        inputMode="tel"
        placeholder={labels.phone}
        value={values.phone}
        onChange={(e) => set('phone', e.target.value)}
        className={field}
      />
      <textarea
        required
        rows={5}
        disabled={busy}
        minLength={10}
        placeholder={labels.message}
        value={values.message}
        onChange={(e) => set('message', e.target.value)}
        className={`${field} resize-y`}
      />

      {/* Honeypot: off screen and out of the tab order, so only a bot fills it.
          `aria-hidden` keeps it from being announced, and the server drops any
          submission that arrives with a value here. */}
      <div aria-hidden className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
        <label>
          Website
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values.website}
            onChange={(e) => set('website', e.target.value)}
          />
        </label>
      </div>

      {error && (
        <p role="alert" className="text-sm leading-relaxed text-accent">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-brand-fg transition hover:bg-brand-strong disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {busy ? labels.sending : `${labels.submit} →`}
      </button>
      <p className="text-xs text-muted">{labels.note}</p>
    </form>
  );
}
