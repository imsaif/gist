'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

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

const MagnifyingGlassIcon = ({ className = 'h-8 w-8' }: { className?: string }) => (
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
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
    />
  </svg>
);

const UserGroupIcon = ({ className = 'h-8 w-8' }: { className?: string }) => (
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
      d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
    />
  </svg>
);

const Squares2X2Icon = ({ className = 'h-8 w-8' }: { className?: string }) => (
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
      d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
    />
  </svg>
);

const ChatBubbleLeftRightIcon = ({ className = 'h-8 w-8' }: { className?: string }) => (
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
      d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
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
    id: 'chat',
    icon: <ChatBubbleLeftRightIcon className="h-8 w-8" />,
    title: 'Chat with Gist',
    description: 'Auto-detects the right mode',
    href: '/chat',
    cta: 'Start chatting',
  },
  {
    id: 'brief',
    icon: <ClipboardDocumentIcon className="h-8 w-8" />,
    title: 'Write a Brief',
    description: 'Clarify before you build',
    href: '/brief',
    cta: 'Start',
  },
  {
    id: 'map',
    icon: <MapIcon className="h-8 w-8" />,
    title: 'Map a Flow',
    description: 'Walk through user journeys',
    href: '/map',
    cta: 'Start mapping',
  },
  {
    id: 'critique',
    icon: <MagnifyingGlassIcon className="h-8 w-8" />,
    title: 'Critique a Design',
    description: 'Get pattern-based feedback',
    href: '/critique',
    cta: 'Upload design',
  },
  {
    id: 'stakeholder',
    icon: <UserGroupIcon className="h-8 w-8" />,
    title: 'Prep for Stakeholders',
    description: 'Prepare for hard questions',
    href: '/stakeholder',
    cta: 'Start prepping',
  },
  {
    id: 'ia',
    icon: <Squares2X2Icon className="h-8 w-8" />,
    title: 'Structure IA',
    description: 'Map content & navigation',
    href: '/ia',
    cta: 'Start structuring',
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen bg-white">
      {/* Header - absolute so it doesn't affect centering */}
      <header className="absolute top-0 right-0 left-0 flex h-14 items-center justify-between px-6">
        <h1 className="text-text-primary text-xl font-semibold">Gist</h1>
        <nav className="flex items-center gap-4">
          <button className="border-border-light text-text-secondary hover:bg-bg-secondary rounded-lg border px-4 py-2 text-sm font-medium transition-colors">
            Sign in
          </button>
        </nav>
      </header>

      {/* Main content - truly centered */}
      <main className="-mt-20 flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-4xl">
          {/* Hero */}
          <div className="mb-8 text-center">
            <h2 className="text-text-primary mb-3 text-4xl font-bold">Think before you design</h2>
            <p className="text-text-secondary text-lg">
              Your design thinking partner — clarify, map, and critique before you open Figma.
            </p>
          </div>

          {/* Mode Cards - 2x3 Grid */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {MODE_CARDS.map((mode) => (
              <Link
                key={mode.id}
                href={mode.href}
                className="group border-border-light hover:border-accent-primary flex items-center gap-3 rounded-xl border-2 bg-white p-4 transition-all hover:shadow-lg"
              >
                <div className="text-accent-primary flex-shrink-0">{mode.icon}</div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-text-primary group-hover:text-accent-primary font-semibold transition-colors">
                    {mode.title}
                  </h3>
                  <p className="text-text-tertiary text-sm">{mode.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
