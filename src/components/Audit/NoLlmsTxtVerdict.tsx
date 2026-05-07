'use client';

import { useRouter } from 'next/navigation';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

interface NoLlmsTxtVerdictProps {
  siteUrl: string;
  checkedUrl: string;
  productName?: string;
  productDescription?: string;
  onReset: () => void;
}

// Verdict shown when the audited site has no /llms.txt. Replaces the LLM
// audit entirely with a categorical "AI tools have nothing to read" pitch.
// The 404 is itself the evidence — verifiable by the founder in five seconds.
export function NoLlmsTxtVerdict({
  siteUrl,
  checkedUrl,
  productName,
  productDescription,
  onReset,
}: NoLlmsTxtVerdictProps) {
  const router = useRouter();

  const handleRequest = () => {
    try {
      if (productName) sessionStorage.setItem('audit_product_name', productName);
      if (productDescription)
        sessionStorage.setItem('audit_product_description', productDescription);
    } catch {
      // sessionStorage may be unavailable; navigation still proceeds
    }
    router.push(`/request-private?url=${encodeURIComponent(siteUrl)}`);
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="border-border-primary bg-surface-primary rounded-2xl border p-6 md:p-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-200">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
          No llms.txt found
        </div>

        <h2 className="text-ink-primary mb-3 text-2xl font-bold tracking-tight md:text-3xl">
          AI can&rsquo;t read your product yet.
        </h2>

        <p className="text-ink-secondary mb-5 text-base leading-relaxed">
          We tried fetching{' '}
          <code className="bg-background-secondary text-ink-primary rounded px-1.5 py-0.5 text-sm font-medium">
            {checkedUrl}
          </code>{' '}
          and got a <span className="font-semibold">404</span>. AI tools that respect the{' '}
          <code className="text-ink-primary text-sm font-medium">llms.txt</code> standard get
          nothing structured about your product, so they fall back to guessing from training data
          &mdash; which goes stale, hallucinates features, and miscategorises positioning.
        </p>

        <div className="bg-background-secondary mb-5 rounded-xl p-4">
          <p className="text-ink-secondary text-sm">
            <span className="text-ink-primary font-semibold">Verify it yourself:</span> open{' '}
            <a
              href={checkedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-primary underline-offset-2 hover:underline"
            >
              {checkedUrl}
            </a>{' '}
            in a new tab. If you see a 404, AI tools see the same.
          </p>
        </div>

        <p className="text-ink-secondary mb-6 text-sm leading-relaxed">
          A <code className="text-ink-primary font-medium">llms.gist</code> file fixes this by
          giving AI tools a structured, founder-curated description of what your product is, who
          it&rsquo;s for, and what makes it different.
        </p>

        <button
          onClick={handleRequest}
          className="bg-brand-primary hover:bg-brand-hover inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-colors"
        >
          Get a custom llms.gist
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="text-ink-tertiary mt-5 flex justify-center text-xs">
        <button
          onClick={onReset}
          className="hover:text-ink-primary cursor-pointer font-medium transition-colors"
        >
          Audit a different URL
        </button>
      </div>
    </div>
  );
}
