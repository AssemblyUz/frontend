'use client';

import {useState} from 'react';

type Labels = {
  name: string;
  email: string;
  message: string;
  submit: string;
  note: string;
};

export default function ContactForm({email, labels}: {email: string; labels: Labels}) {
  const [values, setValues] = useState({name: '', email: '', message: ''});

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const subject = encodeURIComponent(`Assembly — ${values.name || labels.name}`);
    const body = encodeURIComponent(
      `${values.message}\n\n— ${values.name}${values.email ? ` (${values.email})` : ''}`,
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  }

  const field =
    'w-full rounded-xl border border-border-base bg-card px-4 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-brand/30';

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        type="text"
        required
        placeholder={labels.name}
        value={values.name}
        onChange={(e) => setValues((v) => ({...v, name: e.target.value}))}
        className={field}
      />
      <input
        type="email"
        required
        placeholder={labels.email}
        value={values.email}
        onChange={(e) => setValues((v) => ({...v, email: e.target.value}))}
        className={field}
      />
      <textarea
        required
        rows={5}
        placeholder={labels.message}
        value={values.message}
        onChange={(e) => setValues((v) => ({...v, message: e.target.value}))}
        className={`${field} resize-y`}
      />
      <button
        type="submit"
        className="w-full rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-brand-fg transition hover:bg-brand-strong sm:w-auto"
      >
        {labels.submit} →
      </button>
      <p className="text-xs text-muted">{labels.note}</p>
    </form>
  );
}
