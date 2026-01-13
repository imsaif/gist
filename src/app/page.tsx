'use client';

import Image from 'next/image';
import Link from 'next/link';

// Heroicons (outline)
const LightBulbIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1}
    stroke="currentColor"
    className="h-14 w-14"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
    />
  </svg>
);

const PuzzlePieceIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1}
    stroke="currentColor"
    className="h-14 w-14"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z"
    />
  </svg>
);

const PaintBrushIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1}
    stroke="currentColor"
    className="h-14 w-14"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42"
    />
  </svg>
);

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
      <main className="flex flex-1 flex-col">
        <div className="bg-bg-secondary px-6 py-20 md:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-16">
            {/* Left - Text */}
            <div className="text-center md:text-left">
              <h2 className="text-text-primary mb-6 text-4xl leading-tight font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Get Clarity Before
                <br />
                You Open Figma
              </h2>
              <p className="text-text-secondary mb-8 text-lg sm:text-xl">
                A thinking partner for designers.
              </p>

              <Link
                href="/brief"
                className="bg-accent-primary hover:bg-accent-hover inline-flex items-center gap-2 rounded-xl px-8 py-4 text-lg font-semibold text-white transition-colors"
              >
                Start thinking
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Right - Illustration */}
            <div className="flex justify-center md:justify-end">
              <Image
                src="/illustrations/absurd-08.png"
                alt="Designer thinking"
                width={400}
                height={400}
                priority
              />
            </div>
          </div>
        </div>

        {/* Value props */}
        <div className="w-full py-24">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid gap-16 md:grid-cols-3">
              {/* Prop 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="text-accent-primary mb-6">
                  <LightBulbIcon />
                </div>
                <h3 className="text-text-primary mb-3 text-xl font-semibold">
                  Think before you design
                </h3>
                <p className="text-text-secondary text-base leading-relaxed">
                  Work through user flows, edge cases, and interaction patterns before you open
                  Figma.
                </p>
              </div>

              {/* Prop 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="text-accent-primary mb-6">
                  <PuzzlePieceIcon />
                </div>
                <h3 className="text-text-primary mb-3 text-xl font-semibold">Know what works</h3>
                <p className="text-text-secondary text-base leading-relaxed">
                  Surface proven UX patterns from ChatGPT, Notion AI, and Copilot.
                </p>
              </div>

              {/* Prop 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="text-accent-primary mb-6">
                  <PaintBrushIcon />
                </div>
                <h3 className="text-text-primary mb-3 text-xl font-semibold">
                  Design with intention
                </h3>
                <p className="text-text-secondary text-base leading-relaxed">
                  Skip the AI slop. Build UI you actually understand and can explain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-border-light border-t px-6 py-4">
        <div className="text-text-tertiary flex flex-col items-center justify-center gap-1 text-sm">
          <p>Never ship UI you can&apos;t defend</p>
          <p className="text-xs">
            Illustrations by{' '}
            <a
              href="https://absurd.design"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text-secondary underline"
            >
              absurd.design
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
