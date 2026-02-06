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

const UsersIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
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
      d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
    />
  </svg>
);

const LightBulbIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
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
      d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
    />
  </svg>
);

const ShieldCheckIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
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
      d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
    />
  </svg>
);

interface SkillPill {
  id: string;
  label: string;
  icon: ReactNode;
  href: string;
  starterPrompts: string[];
}

const SKILL_PILLS: SkillPill[] = [
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
  {
    id: 'research',
    label: 'Research',
    icon: <UsersIcon className="h-5 w-5" />,
    href: '/research',
    starterPrompts: [
      'Understand my users better',
      'Identify pain points for a feature',
      'Plan user research methods',
      'Create a user research canvas',
    ],
  },
  {
    id: 'ideate',
    label: 'Ideate',
    icon: <LightBulbIcon className="h-5 w-5" />,
    href: '/ideate',
    starterPrompts: [
      'Explore solution approaches',
      'Generate ideas for a feature',
      'Compare design approaches',
      'Find the best solution path',
    ],
  },
  {
    id: 'constraints',
    label: 'Constraints',
    icon: <ShieldCheckIcon className="h-5 w-5" />,
    href: '/constraints',
    starterPrompts: [
      'Surface project constraints',
      'Map technical limitations',
      'Identify design boundaries',
      'Turn constraints into opportunities',
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
      const pill = SKILL_PILLS.find((p) => p.id === pillId);
      if (pill) {
        setInputValue(`@${pill.label} `);
      }
    }
  };

  const handleStarterPromptClick = (pill: SkillPill, prompt: string) => {
    setActivePill(null);
    router.push(`${pill.href}?q=${encodeURIComponent(prompt)}`);
  };

  const activeSkill = SKILL_PILLS.find((p) => p.id === activePill);

  const SKILLS = [
    {
      icon: <ClipboardDocumentIcon className="h-5 w-5" />,
      title: 'Brief',
      description: "Clarify what you're building before you open Figma.",
    },
    {
      icon: <MapIcon className="h-5 w-5" />,
      title: 'Map',
      description: 'Walk through user journeys step-by-step with states and edge cases.',
    },
    {
      icon: <MagnifyingGlassIcon className="h-5 w-5" />,
      title: 'Critique',
      description: 'Get honest, structured feedback on your designs.',
    },
    {
      icon: <UserGroupIcon className="h-5 w-5" />,
      title: 'Stakeholder Prep',
      description: 'Anticipate tough questions and defend your decisions.',
    },
    {
      icon: <Squares2X2Icon className="h-5 w-5" />,
      title: 'Information Architecture',
      description: 'Structure content and plan navigation that makes sense.',
    },
    {
      icon: <UsersIcon className="h-5 w-5" />,
      title: 'Research',
      description: 'Understand your users deeply before defining solutions.',
    },
    {
      icon: <LightBulbIcon className="h-5 w-5" />,
      title: 'Ideate',
      description: 'Generate multiple approaches before committing to one.',
    },
    {
      icon: <ShieldCheckIcon className="h-5 w-5" />,
      title: 'Constraints',
      description: 'Surface hard limits and design within them intentionally.',
    },
  ];

  const COMPARISONS = [
    {
      label: 'What you get',
      chatgpt: 'Paragraphs of advice you have to organize yourself',
      uiGen: 'Screens without the thinking behind them',
      gist: 'Structured artifacts like briefs, maps, and IA trees that evolve as you talk',
    },
    {
      label: 'How it works',
      chatgpt: 'Open-ended chat where you drive the structure',
      uiGen: 'Describe a screen, get a layout',
      gist: 'Guided phases walk you through design methodology step by step',
    },
    {
      label: 'Design awareness',
      chatgpt: 'General knowledge, no design framework',
      uiGen: 'Visual patterns, no design rationale',
      gist: '28 built-in AI/UX patterns with rationale tracking and detection',
    },
  ];

  return (
    <div className="hero-gradient-bg relative min-h-screen overflow-x-clip">
      {/* Full-page grid background — fades in toward the bottom */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(212,212,216,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(212,212,216,0.4) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'linear-gradient(to bottom, transparent 40%, black 70%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 40%, black 70%)',
        }}
      />
      {/* Radial fade — softens grid edges */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, white 80%)',
          maskImage: 'linear-gradient(to bottom, transparent 40%, black 70%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 40%, black 70%)',
        }}
      />
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
      <main className="relative z-10 flex min-h-screen flex-col items-center px-6 pt-20 md:px-10 md:pt-24">
        <div className="w-full max-w-3xl">
          {/* Hero */}
          <div className="mb-8 text-center">
            <h2 className="text-text-primary mb-4 text-4xl font-extrabold tracking-tight md:text-5xl">
              <span className="text-accent-primary">{HERO_WORDS[heroWordIndex]}</span> before you
              design
            </h2>
            <p className="text-text-secondary mx-auto max-w-2xl text-base md:text-lg">
              Your design thinking partner. Clarify, map, and critique before you open Figma.
            </p>
          </div>

          {/* Chat input */}
          <div className="relative mb-6">
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
                className="flex-1 rounded-2xl px-6 py-4 text-lg outline-none placeholder:text-slate-400"
              />
              <button
                onClick={handleSubmit}
                disabled={!inputValue.trim()}
                className="bg-accent-primary hover:bg-accent-hover disabled:bg-bg-tertiary disabled:text-text-tertiary mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-white transition-colors"
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
            {activeSkill && (
              <div
                ref={dropdownRef}
                className="border-border-light absolute right-0 left-0 z-20 -mt-1 overflow-hidden rounded-b-2xl border-2 border-t-0 bg-white shadow-lg"
              >
                <div className="border-t border-slate-100 px-4 py-3">
                  <p className="text-text-tertiary mb-2 text-sm font-medium">Try asking...</p>
                  <div className="space-y-1">
                    {activeSkill.starterPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => handleStarterPromptClick(activeSkill, prompt)}
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

          {/* Skill pills */}
          <div ref={pillsRef} className="flex flex-wrap justify-center gap-3">
            {SKILL_PILLS.map((pill) => (
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

        {/* Skills section */}
        <div
          className="relative mt-24 w-full max-w-6xl rounded-2xl bg-white/50 p-8 backdrop-blur-sm md:mt-32 md:p-12"
          style={{
            boxShadow: '0 0 50px 15px rgba(186,210,255,0.2), 0 0 100px 30px rgba(216,191,255,0.12)',
          }}
        >
          <div className="mb-14">
            <p className="mb-3 text-xs font-semibold tracking-widest text-slate-500 uppercase">
              Gist Design Skills
            </p>
            <h3 className="text-text-primary mb-5 text-3xl font-extrabold tracking-tight md:text-4xl">
              Get to know Gist
            </h3>
            <div className="mb-5 h-px w-full bg-gradient-to-r from-slate-200 via-slate-300 to-transparent" />
            <p className="max-w-xl text-base text-slate-600 md:text-lg">
              One partner, many design skills. Tell Gist what you&apos;re working on and it
              activates the right skill automatically.
            </p>
          </div>

          <div className="mb-10">
            <p className="mb-5 text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Why Gist
            </p>

            {/* Desktop: 4-column table */}
            <div className="hidden md:block">
              <div className="grid grid-cols-4 gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200">
                {/* Header row */}
                <div className="bg-white p-4" />
                <div className="bg-white p-4">
                  <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                    ChatGPT / Claude
                  </p>
                </div>
                <div className="bg-white p-4">
                  <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                    UI Generators
                  </p>
                </div>
                <div className="border-accent-primary border-t-2 bg-slate-50 p-4">
                  <p className="text-accent-primary text-xs font-semibold tracking-wider uppercase">
                    Gist
                  </p>
                </div>

                {/* Data rows */}
                {COMPARISONS.map((row) => (
                  <>
                    <div key={`${row.label}-label`} className="bg-white p-4">
                      <p className="text-text-primary text-sm font-bold">{row.label}</p>
                    </div>
                    <div key={`${row.label}-chatgpt`} className="bg-white p-4">
                      <p className="text-sm leading-relaxed text-slate-500">{row.chatgpt}</p>
                    </div>
                    <div key={`${row.label}-uigen`} className="bg-white p-4">
                      <p className="text-sm leading-relaxed text-slate-500">{row.uiGen}</p>
                    </div>
                    <div key={`${row.label}-gist`} className="bg-slate-50 p-4">
                      <p className="text-text-primary text-sm leading-relaxed font-medium">
                        {row.gist}
                      </p>
                    </div>
                  </>
                ))}
              </div>
            </div>

            {/* Mobile: stacked cards */}
            <div className="space-y-4 md:hidden">
              {COMPARISONS.map((row) => (
                <div
                  key={row.label}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                >
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="text-text-primary text-sm font-bold">{row.label}</p>
                  </div>
                  <div className="space-y-3 px-4 py-3">
                    <div>
                      <p className="mb-0.5 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                        ChatGPT / Claude
                      </p>
                      <p className="text-sm leading-relaxed text-slate-500">{row.chatgpt}</p>
                    </div>
                    <div>
                      <p className="mb-0.5 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                        UI Generators
                      </p>
                      <p className="text-sm leading-relaxed text-slate-500">{row.uiGen}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 px-3 py-2">
                      <p className="text-accent-primary mb-0.5 text-xs font-semibold tracking-wider uppercase">
                        Gist
                      </p>
                      <p className="text-text-primary text-sm leading-relaxed font-medium">
                        {row.gist}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-20">
            <p className="mb-5 text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Design Skills
            </p>
            <div className="grid grid-cols-2 gap-x-10 gap-y-12 md:grid-cols-4 lg:grid-cols-4">
              {SKILLS.map((skill) => (
                <div key={skill.title} className="group">
                  <div className="border-border-light bg-bg-primary mb-4 flex h-11 w-11 items-center justify-center rounded-xl border shadow-sm transition-colors group-hover:border-slate-300">
                    <span className="text-slate-700">{skill.icon}</span>
                  </div>
                  <h4 className="text-text-primary mb-1.5 text-sm font-bold">{skill.title}</h4>
                  <p className="text-sm leading-relaxed text-slate-600">{skill.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
