import type { Metadata } from 'next';
import { LockClosedIcon, CheckIcon } from '@heroicons/react/24/outline';
import { SiteHeader } from '@/components/Layout/SiteHeader';
import { loadResult } from '@/lib/gallery/loadResults';
import RequestForm from './RequestForm';

export const metadata: Metadata = {
  title: 'Request a private llms.gist · $39',
  description:
    'A llms.gist file tailored to your product, delivered by email. Never published in the public gallery.',
};

const INCLUDED = [
  'Custom llms.gist file written from your site + product context',
  'ChatGPT + Claude audit run against your product (the same pipeline as the public gallery)',
  'Gap report with severity and category chips',
  'Stays private. Never indexed, never added to the /audited gallery',
  'One round of revisions over email',
];

const FAQ = [
  {
    q: 'What’s the difference between this and the free public audit?',
    a: 'The free audit on the homepage runs against any URL and shows you what ChatGPT and Claude get wrong. A private llms.gist is the fix: a written file that patches the gaps for your specific product, plus a written-up report. The public-gallery results are also published; private requests never are.',
  },
  {
    q: 'How long does it take?',
    a: '2–3 business days from payment. We run the audit, draft the file, and review it before sending. Most of the time is the human review step.',
  },
  {
    q: 'What if I’m not happy with the result?',
    a: 'You get one round of revisions over email at no extra charge. If the deliverable still doesn’t match what you needed, refund within 7 days, no questions asked.',
  },
  {
    q: 'Will my product be added to the public gallery?',
    a: 'No. The /audited gallery is opt-in only and curated. Private requests stay private.',
  },
  {
    q: 'How is it delivered?',
    a: 'A llms.gist file in your inbox plus the gap report inline. Drop the file into your repo at /llms.gist or paste it into Cursor / Claude Code / ChatGPT.',
  },
];

export default async function RequestPrivatePage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; url?: string }>;
}) {
  const { ref, url } = await searchParams;
  let prefillUrl = '';
  if (ref) {
    const entry = loadResult(ref);
    if (entry) prefillUrl = entry.url;
  }
  if (!prefillUrl && url) {
    try {
      const u = new URL(url);
      if (u.protocol === 'http:' || u.protocol === 'https:') prefillUrl = u.toString();
    } catch {
      // ignore malformed URLs
    }
  }

  return (
    <div className="bg-background-primary min-h-screen">
      <SiteHeader />

      {/* Hero with grain texture */}
      <section className="bg-background-grain bg-grain px-6 pt-16 pb-12 md:px-10 md:pt-24 md:pb-16 lg:px-14">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <p className="eyebrow text-ink-tertiary mb-5">Private llms.gist · $39</p>
          <h1 className="text-ink-primary text-3xl leading-[1.1] font-bold tracking-[-0.02em] md:text-4xl lg:text-5xl">
            Make your product{' '}
            <span className="text-brand-primary font-serif italic">AI-readable</span>.
          </h1>
          <p className="text-ink-secondary mt-6 max-w-xl text-base leading-relaxed md:text-lg">
            A custom{' '}
            <code className="bg-background-secondary rounded px-1 py-0.5 text-sm font-medium">
              llms.gist
            </code>{' '}
            file that teaches ChatGPT, Claude, and Cursor what your product actually does, so they
            stop guessing and start recommending. Delivered to your inbox.
          </p>
          <div className="text-ink-tertiary mt-8 inline-flex items-center gap-2 text-xs">
            <LockClosedIcon className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Delivery by email · 2–3 business days</span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-2xl px-6 py-16 md:py-20">
        <div className="space-y-12">
          {/* Pricing + What's included */}
          <section>
            <div className="border-border-primary bg-background-secondary rounded-2xl border p-6 md:p-8">
              <div className="border-border-primary mb-6 flex items-baseline justify-between border-b pb-6">
                <div>
                  <div className="eyebrow mb-1">llms.gist</div>
                  <div className="text-ink-primary text-4xl font-extrabold tracking-tight md:text-5xl">
                    $39
                  </div>
                  <div className="text-ink-tertiary mt-1 text-sm">One-time. No subscription.</div>
                </div>
                <div className="text-ink-tertiary inline-flex items-center gap-2 text-sm">
                  <LockClosedIcon className="h-4 w-4" aria-hidden="true" />
                  Private
                </div>
              </div>
              <ul className="space-y-3">
                {INCLUDED.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckIcon
                      className="text-brand-primary mt-0.5 h-5 w-5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-ink-secondary text-base leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Form */}
          <section>
            <h2 className="text-ink-primary mb-4 text-2xl font-semibold tracking-tight">
              Tell us about your product
            </h2>
            <RequestForm prefillUrl={prefillUrl} refSlug={ref} />
          </section>

          {/* FAQ */}
          <section>
            <div className="eyebrow mb-4">FAQ</div>
            <div className="border-border-primary divide-border-primary divide-y border-t border-b">
              {FAQ.map(({ q, a }) => (
                <details key={q} className="group py-5">
                  <summary className="text-ink-primary flex cursor-pointer items-center justify-between text-base font-medium">
                    <span>{q}</span>
                    <span className="text-ink-tertiary ml-4 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="text-ink-secondary mt-3 text-base leading-relaxed">{a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </div>

      <footer className="py-12">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6">
          <span className="text-ink-tertiary text-sm">llms.gist · 2026</span>
          <span className="text-ink-tertiary text-sm">
            Questions? Email{' '}
            <a
              href="mailto:hello@llmsgist.org"
              className="text-ink-secondary hover:text-ink-primary transition-colors"
            >
              hello@llmsgist.org
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
