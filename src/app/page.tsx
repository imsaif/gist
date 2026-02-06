'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// SVG Icon Components
const ClipboardDocumentIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
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

const MapIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
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

const MagnifyingGlassIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
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

const UserGroupIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
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

const Squares2X2Icon = ({ className = 'h-5 w-5' }: { className?: string }) => (
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

interface ModePill {
  id: string;
  label: string;
  icon: ReactNode;
  href: string;
  starterPrompts: string[];
}

const MODE_PILLS: ModePill[] = [
  {
    id: 'brief',
    label: 'Brief',
    icon: <ClipboardDocumentIcon className="h-5 w-5" />,
    href: '/brief',
    starterPrompts: [
      'Write a product brief',
      'Define feature requirements',
      "Clarify what I'm building",
      'Scope a new project',
    ],
  },
  {
    id: 'map',
    label: 'Map',
    icon: <MapIcon className="h-5 w-5" />,
    href: '/map',
    starterPrompts: [
      'Map a user onboarding flow',
      'Design a checkout journey',
      'Walk through a signup flow',
      'Map error recovery paths',
    ],
  },
  {
    id: 'critique',
    label: 'Critique',
    icon: <MagnifyingGlassIcon className="h-5 w-5" />,
    href: '/critique',
    starterPrompts: [
      'Review my landing page design',
      'Critique a mobile screen',
      'Analyze my dashboard layout',
      'Check my form design',
    ],
  },
  {
    id: 'stakeholder',
    label: 'Stakeholder',
    icon: <UserGroupIcon className="h-5 w-5" />,
    href: '/stakeholder',
    starterPrompts: [
      'Prepare for a design review',
      'Defend a UX decision',
      'Anticipate engineering pushback',
      'Brief executives on design',
    ],
  },
  {
    id: 'ia',
    label: 'IA',
    icon: <Squares2X2Icon className="h-5 w-5" />,
    href: '/ia',
    starterPrompts: [
      'Structure a SaaS app',
      'Organize a marketing site',
      'Plan content hierarchy',
      'Design navigation for a dashboard',
    ],
  },
];

const HERO_WORDS = ['Gist', 'Think'];

export default function Home() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const [activePill, setActivePill] = useState<string | null>(null);
  const [heroWordIndex, setHeroWordIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);

  // Cycle hero word every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroWordIndex((prev) => (prev + 1) % HERO_WORDS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        pillsRef.current &&
        !pillsRef.current.contains(event.target as Node)
      ) {
        setActivePill(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    router.push(`/chat?q=${encodeURIComponent(trimmed)}`);
  };

  const handlePillClick = (pillId: string) => {
    if (activePill === pillId) {
      setActivePill(null);
      setInputValue('');
    } else {
      setActivePill(pillId);
      const pill = MODE_PILLS.find((p) => p.id === pillId);
      if (pill) {
        setInputValue(`@${pill.label} `);
      }
    }
  };

  const handleStarterPromptClick = (pill: ModePill, prompt: string) => {
    setActivePill(null);
    router.push(`${pill.href}?q=${encodeURIComponent(prompt)}`);
  };

  const activeMode = MODE_PILLS.find((p) => p.id === activePill);

  return (
    <div className="hero-gradient-bg relative min-h-screen overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 right-0 left-0 z-10 flex h-14 items-center justify-between px-6">
        <h1 className="text-text-primary text-xl font-semibold">Gist</h1>
        <nav className="flex items-center gap-4">
          <button className="border-border-light text-text-secondary hover:bg-bg-secondary rounded-lg border px-4 py-2 text-sm font-medium transition-colors">
            Sign in
          </button>
        </nav>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
        <div className="w-full max-w-3xl">
          {/* Hero */}
          <div className="mb-8 text-center">
            <h2 className="text-text-primary mb-4 text-5xl font-extrabold tracking-tight md:text-6xl">
              <span className="text-accent-primary">{HERO_WORDS[heroWordIndex]}</span> before you
              design
            </h2>
            <p className="text-text-secondary mx-auto max-w-xl text-lg md:text-xl">
              Your design thinking partner. Clarify, map, and critique before you open Figma.
            </p>
          </div>

          {/* Chat input */}
          <div className="relative mb-8">
            <div className="border-border-light focus-within:border-accent-primary flex items-center rounded-2xl border-2 bg-white shadow-lg transition-colors">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder="What are you working on?"
                className="flex-1 rounded-2xl px-6 py-5 text-xl outline-none placeholder:text-slate-400"
              />
              <button
                onClick={handleSubmit}
                disabled={!inputValue.trim()}
                className="bg-accent-primary hover:bg-accent-hover disabled:bg-bg-tertiary disabled:text-text-tertiary mr-3 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                  />
                </svg>
              </button>
            </div>

            {/* Starter prompts dropdown - appears below input when pill is active */}
            {activeMode && (
              <div
                ref={dropdownRef}
                className="border-border-light absolute right-0 left-0 z-20 -mt-1 overflow-hidden rounded-b-2xl border-2 border-t-0 bg-white shadow-lg"
              >
                <div className="border-t border-slate-100 px-4 py-3">
                  <p className="text-text-tertiary mb-2 text-sm font-medium">Try asking...</p>
                  <div className="space-y-1">
                    {activeMode.starterPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => handleStarterPromptClick(activeMode, prompt)}
                        className="text-text-primary hover:bg-bg-secondary w-full rounded-xl px-4 py-3 text-left text-lg font-medium transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mode pills */}
          <div ref={pillsRef} className="flex flex-wrap justify-center gap-3">
            {MODE_PILLS.map((pill) => (
              <button
                key={pill.id}
                onClick={() => handlePillClick(pill.id)}
                className={`flex items-center gap-2.5 rounded-full border-2 px-5 py-2.5 text-base font-bold transition-colors ${
                  activePill === pill.id
                    ? 'border-accent-primary bg-accent-primary/10 text-accent-primary'
                    : 'border-border-light text-text-secondary hover:text-text-primary bg-white shadow-sm hover:border-slate-400'
                }`}
              >
                {pill.icon}
                {pill.label}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
