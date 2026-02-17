'use client';

import { useState } from 'react';

interface VerifyPromptProps {
  url: string;
  gistDesignMarkdown: string;
}

export function VerifyPrompt({ url, gistDesignMarkdown }: VerifyPromptProps) {
  const [copied, setCopied] = useState(false);

  const prompt = `I have a gist.design file for the product at ${url}. Using this context, describe what the product does, how it works, what makes it different, and who it's for.

Here is the gist.design file:

${gistDesignMarkdown}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border-border-light bg-bg-primary rounded-xl border p-5">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-text-primary text-sm font-semibold">Manual verification prompt</h4>
        <button
          onClick={handleCopy}
          className="text-accent-primary hover:text-accent-hover text-sm font-medium transition-colors"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <p className="text-text-tertiary mb-3 text-xs">
        Paste this prompt into ChatGPT, Claude, or Perplexity to see how they describe your product
        with the gist.design file as context.
      </p>
      <pre className="bg-bg-secondary text-text-secondary max-h-32 overflow-y-auto rounded-lg p-3 text-xs">
        {prompt.slice(0, 200)}...
      </pre>
    </div>
  );
}
