'use client';

import { useState } from 'react';
import { ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface Props {
  prefillUrl?: string;
  refSlug?: string;
}

const STACK_OPTIONS = [
  'Next.js / React',
  'Vue / Nuxt',
  'Svelte / SvelteKit',
  'Astro',
  'Plain HTML / static site',
  'Webflow / Framer / Wix',
  'WordPress',
  'Other / not sure',
];

export default function RequestForm({ prefillUrl = '', refSlug }: Props) {
  const [url, setUrl] = useState(prefillUrl);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [stack, setStack] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const canSubmit =
    url.trim() && email.trim() && name.trim() && description.trim() && agreed && !submitting;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/request-private', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, email, name, description, stack, refSlug }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="border-border-primary bg-background-secondary rounded-2xl border p-8">
        <div className="flex items-start gap-4">
          <CheckCircleIcon
            className="text-brand-primary h-8 w-8 flex-shrink-0"
            aria-hidden="true"
          />
          <div>
            <h3 className="text-ink-primary mb-2 text-xl font-semibold">Request received</h3>
            <p className="text-ink-secondary text-base leading-relaxed">
              Thanks. We&rsquo;ve got your request for <strong>{name}</strong>. We&rsquo;ll email{' '}
              <strong>{email}</strong> a Stripe payment link within 1 business day to confirm and
              start the work. Delivery is 2–3 business days from payment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-border-primary bg-background-secondary space-y-5 rounded-2xl border p-6 md:p-8"
    >
      <div>
        <label htmlFor="url" className="text-ink-primary mb-1.5 block text-sm font-medium">
          Website URL <span className="text-brand-primary">*</span>
        </label>
        <input
          id="url"
          type="url"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="border-border-primary bg-background-primary text-ink-primary placeholder:text-ink-tertiary focus:border-border-focus focus:ring-ring-focus w-full rounded-xl border px-4 py-2.5 text-base transition-colors focus:ring-2 focus:outline-none"
        />
        <p className="text-ink-tertiary mt-1.5 text-sm">
          The product whose llms.gist you want us to write.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="email" className="text-ink-primary mb-1.5 block text-sm font-medium">
            Email <span className="text-brand-primary">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@domain.com"
            className="border-border-primary bg-background-primary text-ink-primary placeholder:text-ink-tertiary focus:border-border-focus focus:ring-ring-focus w-full rounded-xl border px-4 py-2.5 text-base transition-colors focus:ring-2 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="name" className="text-ink-primary mb-1.5 block text-sm font-medium">
            Product name <span className="text-brand-primary">*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Acme"
            className="border-border-primary bg-background-primary text-ink-primary placeholder:text-ink-tertiary focus:border-border-focus focus:ring-ring-focus w-full rounded-xl border px-4 py-2.5 text-base transition-colors focus:ring-2 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="text-ink-primary mb-1.5 block text-sm font-medium">
          One-line description <span className="text-brand-primary">*</span>
        </label>
        <input
          id="description"
          type="text"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What does it do, in one sentence?"
          className="border-border-primary bg-background-primary text-ink-primary placeholder:text-ink-tertiary focus:border-border-focus focus:ring-ring-focus w-full rounded-xl border px-4 py-2.5 text-base transition-colors focus:ring-2 focus:outline-none"
        />
        <p className="text-ink-tertiary mt-1.5 text-sm">
          How you&rsquo;d describe the product to a stranger. Used as ground truth when we audit AI
          responses.
        </p>
      </div>

      <div>
        <label htmlFor="stack" className="text-ink-primary mb-1.5 block text-sm font-medium">
          How are you building it?{' '}
          <span className="text-ink-tertiary text-sm font-normal">(optional)</span>
        </label>
        <select
          id="stack"
          value={stack}
          onChange={(e) => setStack(e.target.value)}
          className="border-border-primary bg-background-primary text-ink-primary focus:border-border-focus focus:ring-ring-focus w-full rounded-xl border px-4 py-2.5 text-base transition-colors focus:ring-2 focus:outline-none"
        >
          <option value="">Select your current stack…</option>
          {STACK_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="border-border-primary text-brand-primary focus:ring-ring-focus mt-0.5 h-4 w-4 rounded"
        />
        <span className="text-ink-secondary leading-relaxed">
          I understand the llms.gist file will be delivered by email within 2–3 business days of
          payment, and stays private. Never published to the public gallery.
        </span>
      </label>

      {error && (
        <div className="border-status-error/30 bg-status-error/5 text-status-error rounded-xl border px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={!canSubmit}
          className="bg-brand-primary hover:bg-brand-hover inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-base font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Sending…' : 'Request private llms.gist ($39)'}
          {!submitting && <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />}
        </button>
        <span className="text-ink-tertiary text-sm">
          We&rsquo;ll email you a Stripe payment link to confirm.
        </span>
      </div>
    </form>
  );
}
