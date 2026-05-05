'use client';

import { useState } from 'react';

interface Props {
  chatgptText: string | null;
  claudeText: string | null;
  llmsGistMarkdown: string;
}

type Tab = 'chatgpt' | 'claude' | 'gist';

export function AuditPreviewTabs({ chatgptText, claudeText, llmsGistMarkdown }: Props) {
  const [tab, setTab] = useState<Tab>('chatgpt');

  return (
    <section className="border-border-primary overflow-hidden rounded-2xl border">
      <header className="border-border-primary bg-background-secondary flex items-center justify-between gap-2 border-b px-3 py-2">
        <p className="eyebrow text-ink-tertiary px-2">Preview</p>
        <div className="flex items-center gap-1">
          <TabButton label="ChatGPT" active={tab === 'chatgpt'} onClick={() => setTab('chatgpt')} />
          <TabButton label="Claude" active={tab === 'claude'} onClick={() => setTab('claude')} />
          <TabButton label="llms.gist" active={tab === 'gist'} onClick={() => setTab('gist')} />
        </div>
      </header>

      <div className="bg-background-primary">
        {tab === 'chatgpt' && <EvidencePane label="ChatGPT" text={chatgptText} />}
        {tab === 'claude' && <EvidencePane label="Claude" text={claudeText} />}
        {tab === 'gist' && (
          <pre className="text-ink-primary max-h-[420px] overflow-auto p-6 font-mono text-xs leading-relaxed whitespace-pre-wrap">
            {llmsGistMarkdown}
          </pre>
        )}
      </div>
    </section>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? 'bg-background-primary text-ink-primary border-border-primary border'
          : 'text-ink-secondary hover:text-ink-primary'
      }`}
    >
      {label}
    </button>
  );
}

function EvidencePane({ label, text }: { label: string; text: string | null }) {
  if (!text) {
    return <p className="text-ink-tertiary p-6 text-sm italic">No {label} response captured.</p>;
  }
  return (
    <blockquote className="text-ink-primary border-brand-primary mx-6 my-6 border-l-2 pl-5 text-base leading-relaxed">
      &ldquo;{text}&rdquo;
      <footer className="text-ink-tertiary mt-3 text-xs not-italic">
        — what {label} said when asked to describe the product.
      </footer>
    </blockquote>
  );
}
