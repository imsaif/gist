'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ReactNode } from 'react';

// Heroicons (outline) - Value Props
const LightBulbIcon = ({ className = 'h-10 w-10' }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
    />
  </svg>
);

const PuzzlePieceIcon = ({ className = 'h-10 w-10' }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z"
    />
  </svg>
);

const PaintBrushIcon = ({ className = 'h-10 w-10' }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42"
    />
  </svg>
);

// Heroicons for Mode Cards
const ClipboardDocumentIcon = ({ className = 'h-8 w-8' }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z"
    />
  </svg>
);

const MapIcon = ({ className = 'h-8 w-8' }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
    />
  </svg>
);

const ScaleIcon = ({ className = 'h-8 w-8' }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z"
    />
  </svg>
);

interface ModeCard {
  id: string;
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
  cta: string;
}

const MODE_CARDS: ModeCard[] = [
  {
    id: 'brief',
    icon: <ClipboardDocumentIcon className="h-8 w-8" />,
    title: 'Write a Brief',
    description: 'Quick clarification before you design',
    href: '/brief',
    cta: 'Start',
  },
  {
    id: 'map',
    icon: <MapIcon className="h-8 w-8" />,
    title: 'Map a Flow',
    description: 'Walk through the user journey step by step',
    href: '/map',
    cta: 'Start mapping',
  },
  {
    id: 'rationale',
    icon: <ScaleIcon className="h-8 w-8" />,
    title: 'Capture Decisions',
    description: 'Document and defend your design choices',
    href: '/rationale',
    cta: 'Start thinking',
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="border-border-light flex h-14 items-center justify-between border-b px-6">
        <h1 className="text-text-primary text-xl font-semibold">Gist</h1>
        <nav className="flex items-center gap-4">
          <button className="border-border-light text-text-secondary hover:bg-bg-secondary rounded-lg border px-4 py-2 text-sm font-medium transition-colors">
            Sign in
          </button>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex flex-1 flex-col justify-center px-6 py-12">
        <div className="mx-auto w-full max-w-5xl">
          {/* Hero */}
          <div className="mb-12 text-center">
            <h2 className="text-text-primary mb-4 text-4xl font-bold">Think before you design</h2>
            <p className="text-text-secondary mx-auto max-w-2xl text-lg">
              A thinking partner for designers. Clarify what you&apos;re building, map user
              journeys, and capture design decisions — before you open Figma.
            </p>
          </div>

          {/* Mode Cards + Illustration - Side by Side */}
          <div className="mb-16 flex flex-col items-start gap-12 lg:flex-row">
            {/* Mode Cards - Left */}
            <div className="grid flex-1 gap-4">
              {MODE_CARDS.map((mode) => (
                <Link
                  key={mode.id}
                  href={mode.href}
                  className="group border-border-light hover:border-accent-primary flex items-start gap-4 rounded-2xl border-2 bg-white p-5 transition-all hover:shadow-lg"
                >
                  <div className="text-accent-primary flex-shrink-0">{mode.icon}</div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-text-primary group-hover:text-accent-primary mb-1 text-lg font-semibold transition-colors">
                      {mode.title}
                    </h3>
                    <p className="text-text-secondary text-sm">{mode.description}</p>
                  </div>
                  <div className="text-accent-primary flex flex-shrink-0 items-center gap-1 font-medium">
                    <span className="text-sm">{mode.cta}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-transform group-hover:translate-x-1"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>

            {/* Illustration - Right */}
            <div className="hidden flex-shrink-0 items-center justify-center lg:flex">
              <Image
                src="/illustrations/absurd-08.png"
                alt="Designer thinking"
                width={320}
                height={320}
                priority
                className="opacity-80"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Value props */}
      <section className="border-border-light border-t px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-12 md:grid-cols-3">
            {/* Prop 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="text-accent-primary mb-4">
                <LightBulbIcon />
              </div>
              <h3 className="text-text-primary mb-2 text-lg font-semibold">
                Think before you design
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Work through user flows, edge cases, and interaction patterns before you open Figma.
              </p>
            </div>

            {/* Prop 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="text-accent-primary mb-4">
                <PuzzlePieceIcon />
              </div>
              <h3 className="text-text-primary mb-2 text-lg font-semibold">Know what works</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Surface proven UX patterns from ChatGPT, Notion AI, and Copilot.
              </p>
            </div>

            {/* Prop 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="text-accent-primary mb-4">
                <PaintBrushIcon />
              </div>
              <h3 className="text-text-primary mb-2 text-lg font-semibold">
                Design with intention
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Skip the AI slop. Build UI you actually understand and can explain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-border-light border-t px-6 py-4">
        <div className="text-text-tertiary flex flex-col items-center justify-center gap-1 text-sm">
          <p>Never ship UI you can&apos;t defend</p>
        </div>
      </footer>
    </div>
  );
}
