'use client';

import { ModeSelector } from '@/components/Modes';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="flex h-14 items-center justify-between border-b border-border-light px-6">
        <h1 className="text-xl font-semibold text-text-primary">Gist</h1>
        <nav className="flex items-center gap-4">
          <button className="rounded-lg border border-border-light px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-secondary">
            Sign in
          </button>
        </nav>
      </header>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-text-primary sm:text-5xl">
            Gist
          </h2>
          <p className="text-xl text-text-secondary">
            Think before you design. Know what works.
          </p>
        </div>

        <ModeSelector />
      </main>

      {/* Footer */}
      <footer className="border-t border-border-light px-6 py-4">
        <div className="flex items-center justify-center text-sm text-text-tertiary">
          <p>Never ship UI you can't defend</p>
        </div>
      </footer>
    </div>
  );
}
