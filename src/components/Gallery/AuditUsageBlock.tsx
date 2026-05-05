'use client';

import { useState } from 'react';

interface Props {
  slug: string;
}

export function AuditUsageBlock({ slug }: Props) {
  const command = `curl -O https://llmsgist.org/audited/${slug}/llms.gist`;
  const [copied, setCopied] = useState(false);

  return (
    <div className="border-border-primary bg-background-secondary rounded-2xl border p-6">
      <p className="text-ink-tertiary mb-3 text-xs font-medium tracking-wide uppercase">Usage</p>
      <div className="border-border-primary bg-background-primary flex items-center gap-2 rounded-xl border px-4 py-3 font-mono text-sm">
        <code className="text-ink-primary flex-1 truncate">{command}</code>
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(command);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="text-ink-tertiary hover:text-ink-primary text-xs"
          aria-label="Copy command"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <p className="text-ink-secondary mt-3 text-xs leading-relaxed">
        Drop this <code className="text-ink-primary">llms.gist</code> at <code>/llms.gist</code> in
        your project so coding agents and AI tools describe it correctly.
      </p>
    </div>
  );
}
