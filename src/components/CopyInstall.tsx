'use client';

import { useState } from 'react';

export function CopyInstall({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="bg-surface-inverse flex items-center gap-2 rounded-full py-2 pr-2 pl-5">
      <span className="shrink-0 font-mono text-[13px] text-white/35 select-none">$</span>
      <code className="min-w-0 flex-1 overflow-x-auto font-mono text-[13.5px] whitespace-nowrap text-white/90">
        {command}
      </code>
      <button
        onClick={copy}
        aria-label="Copy install command"
        className="text-surface-inverse focus-visible:ring-offset-surface-inverse shrink-0 rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}
