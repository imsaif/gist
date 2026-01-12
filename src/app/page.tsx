'use client';

import { ModeSelector } from '@/components/Modes';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-border-light flex h-14 items-center justify-between border-b px-6">
        <h1 className="text-text-primary text-xl font-semibold">Gist</h1>
        <nav className="flex items-center gap-4">
          <button className="border-border-light text-text-secondary hover:bg-bg-secondary rounded-lg border px-4 py-2 text-sm font-medium transition-colors">
            Sign in
          </button>
        </nav>
      </header>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
        <div className="mb-12 text-center">
          <h2 className="text-text-primary mb-4 text-4xl font-bold sm:text-5xl">Gist</h2>
          <p className="text-text-secondary text-xl">Think before you design. Know what works.</p>
        </div>

        <ModeSelector />
      </main>

      {/* Footer */}
      <footer className="border-border-light border-t px-6 py-4">
        <div className="text-text-tertiary flex items-center justify-center text-sm">
          <p>Never ship UI you can&apos;t defend</p>
        </div>
      </footer>
    </div>
  );
}
