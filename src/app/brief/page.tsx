'use client';

import { useState, useCallback, useRef, useEffect, Suspense, ReactNode } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Message, Brief } from '@/types';
import { INITIAL_BRIEF, INITIAL_MESSAGES } from '@/lib/constants';
import {
  parseBriefUpdate,
  mergeBriefUpdate,
  addPatternToBrief,
  isPatternInBrief,
} from '@/lib/briefParser';
import { BriefModal } from '@/components/Brief/BriefModal';
import { Toast } from '@/components/Toast';
import {
  DocumentCard,
  getBriefDocumentInfo,
  generateBriefMarkdown,
} from '@/components/Brief/DocumentCard';
import { PatternCard } from '@/components/Chat/PatternCard';
import { getPatternById } from '@/lib/patterns/patterns';

// Heroicons for Skill Dropdown
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

// Wrapper component to handle search params with Suspense
function BriefModeContent() {
  return <BriefModeInner />;
}

export default function BriefMode() {
  return (
    <Suspense fallback={<BriefModeLoading />}>
      <BriefModeContent />
    </Suspense>
  );
}

function BriefModeLoading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-text-tertiary">Loading...</div>
    </div>
  );
}

interface Skill {
  id: string;
  name: string;
  icon: ReactNode;
  description: string;
  href: string;
}

const ChatBubbleLeftRightIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
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

const SKILLS: Skill[] = [
  {
    id: 'chat',
    name: 'Chat',
    icon: <ChatBubbleLeftRightIcon className="h-5 w-5" />,
    description: 'Auto-detects skill',
    href: '/chat',
  },
  {
    id: 'brief',
    name: 'Brief',
    icon: <ClipboardDocumentIcon className="h-5 w-5" />,
    description: 'Clarify before you build',
    href: '/brief',
  },
  {
    id: 'map',
    name: 'Map',
    icon: <MapIcon className="h-5 w-5" />,
    description: 'Map user journeys',
    href: '/map',
  },
  {
    id: 'critique',
    name: 'Critique',
    icon: <MagnifyingGlassIcon className="h-5 w-5" />,
    description: 'Get design feedback',
    href: '/critique',
  },
  {
    id: 'stakeholder',
    name: 'Stakeholder',
    icon: <UserGroupIcon className="h-5 w-5" />,
    description: 'Prep for hard questions',
    href: '/stakeholder',
  },
  {
    id: 'ia',
    name: 'IA',
    icon: <Squares2X2Icon className="h-5 w-5" />,
    description: 'Structure content',
    href: '/ia',
  },
  {
    id: 'research',
    name: 'Research',
    icon: <UsersIcon className="h-5 w-5" />,
    description: 'Understand your users',
    href: '/research',
  },
  {
    id: 'ideate',
    name: 'Ideate',
    icon: <LightBulbIcon className="h-5 w-5" />,
    description: 'Explore solution options',
    href: '/ideate',
  },
  {
    id: 'constraints',
    name: 'Constraints',
    icon: <ShieldCheckIcon className="h-5 w-5" />,
    description: 'Surface design limits',
    href: '/constraints',
  },
];

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function BriefModeInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [brief, setBrief] = useState<Brief>(INITIAL_BRIEF);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: '' });
  const [isSkillDropdownOpen, setIsSkillDropdownOpen] = useState(false);
  const [initialMessageSent, setInitialMessageSent] = useState(false);
  const skillDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (skillDropdownRef.current && !skillDropdownRef.current.contains(event.target as Node)) {
        setIsSkillDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle initial message from URL query parameter
  useEffect(() => {
    const initialQuery = searchParams.get('q');
    if (initialQuery && !initialMessageSent && !isLoading) {
      setInitialMessageSent(true);
      // Clear the URL parameter
      router.replace('/brief', { scroll: false });
      // Send the initial message
      handleSendMessageDirect(initialQuery);
    }
  }, [searchParams, initialMessageSent, isLoading, router]);

  // Direct send function that doesn't depend on state (for initial message)
  const handleSendMessageDirect = async (content: string) => {
    if (!content.trim()) return;

    setError(null);

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };
    const newMessages = [...INITIAL_MESSAGES, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const { displayContent, briefUpdate, identifiedPattern } = parseBriefUpdate(data.message);

      const aiMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: displayContent,
        timestamp: new Date(),
        identifiedPattern: identifiedPattern ?? undefined,
      };
      setMessages((prev) => [...prev, aiMessage]);

      if (briefUpdate) {
        setBrief((prev) => mergeBriefUpdate(prev, briefUpdate));
      }
    } catch (err) {
      console.error('Chat error:', err);
      setError('Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message: string) => {
    setToast({ isVisible: true, message });
  };

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      setError(null);

      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
      };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInputValue('');
      setIsLoading(true);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: newMessages }),
        });

        if (!response.ok) {
          throw new Error('Failed to get response');
        }

        const data = await response.json();
        const { displayContent, briefUpdate, identifiedPattern } = parseBriefUpdate(data.message);

        const aiMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: displayContent,
          timestamp: new Date(),
          identifiedPattern: identifiedPattern ?? undefined,
        };
        setMessages((prev) => [...prev, aiMessage]);

        if (briefUpdate) {
          setBrief((prev) => mergeBriefUpdate(prev, briefUpdate));
        }
      } catch (err) {
        console.error('Chat error:', err);
        setError('Failed to get response. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading]
  );

  const handleNewChat = useCallback(() => {
    if (messages.length > 1 && !confirm('Start over? Current brief will be lost.')) {
      return;
    }
    setMessages(INITIAL_MESSAGES);
    setBrief(INITIAL_BRIEF);
    setError(null);
    setInputValue('');
  }, [messages.length]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const isReady = brief.readyToDesign !== null;
  const hasContent = brief.goal !== null;
  const documentInfo = getBriefDocumentInfo(brief);

  const handleCopyBrief = useCallback(async () => {
    const markdown = generateBriefMarkdown(brief);
    await navigator.clipboard.writeText(markdown);
    showToast('Brief copied to clipboard');
  }, [brief]);

  const handleDownloadBrief = useCallback(() => {
    const markdown = generateBriefMarkdown(brief);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `design-brief-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [brief]);

  const handleCopyPrompt = useCallback(async () => {
    if (brief.readyToDesign?.prompt) {
      await navigator.clipboard.writeText(brief.readyToDesign.prompt);
      showToast('Prompt copied to clipboard');
    }
  }, [brief.readyToDesign]);

  const handleAddPatternToBrief = useCallback((patternId: string, reason: string) => {
    setBrief((prev) => addPatternToBrief(prev, patternId, reason));
    showToast('Pattern added to brief');
  }, []);

  const handleDownloadPrompt = useCallback(() => {
    if (brief.readyToDesign?.prompt) {
      const blob = new Blob([brief.readyToDesign.prompt], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `design-prompt-${new Date().toISOString().split('T')[0]}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [brief.readyToDesign]);

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="border-border-light flex h-14 items-center justify-between border-b px-6">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-text-primary hover:text-accent-primary text-xl font-semibold transition-colors"
          >
            Gist
          </Link>
          <span className="text-text-tertiary">/</span>

          {/* Skill Switcher Dropdown */}
          <div className="relative" ref={skillDropdownRef}>
            <button
              onClick={() => setIsSkillDropdownOpen(!isSkillDropdownOpen)}
              className="bg-bg-secondary hover:bg-bg-tertiary flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium transition-colors"
            >
              <span className="text-accent-primary">
                <ClipboardDocumentIcon className="h-4 w-4" />
              </span>
              <span className="text-text-secondary">Brief</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`text-text-tertiary transition-transform ${isSkillDropdownOpen ? 'rotate-180' : ''}`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {isSkillDropdownOpen && (
              <div className="border-border-light absolute top-full left-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border bg-white shadow-lg">
                <div className="p-2">
                  <p className="text-text-tertiary px-3 py-2 text-xs font-medium uppercase">
                    Switch Skill
                  </p>
                  {SKILLS.map((skill) => (
                    <Link
                      key={skill.id}
                      href={skill.href}
                      onClick={() => setIsSkillDropdownOpen(false)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                        skill.id === 'brief'
                          ? 'bg-accent-primary/10 text-accent-primary'
                          : 'hover:bg-bg-secondary text-text-primary'
                      }`}
                    >
                      <span className="text-accent-primary">{skill.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{skill.name}</span>
                        </div>
                        <p className="text-text-tertiary text-xs">{skill.description}</p>
                      </div>
                      {skill.id === 'brief' && (
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
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleNewChat}
            className="border-border-light text-text-secondary hover:bg-bg-secondary rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
          >
            New
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel - Conversation */}
        <div className="border-border-light flex w-1/2 flex-col border-r">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {messages.map((message) => {
                const identifiedPattern = message.identifiedPattern
                  ? getPatternById(message.identifiedPattern.patternId)
                  : null;

                return (
                  <div key={message.id}>
                    <div
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-msg-user-bg text-msg-user-text'
                            : 'bg-msg-ai-bg text-text-primary'
                        }`}
                      >
                        <p className="text-base leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>
                    </div>
                    {identifiedPattern && message.identifiedPattern && (
                      <div className="mt-2 flex justify-start">
                        <div className="max-w-[80%]">
                          <PatternCard
                            pattern={identifiedPattern}
                            reason={message.identifiedPattern.reason}
                            onAddToBrief={() =>
                              handleAddPatternToBrief(
                                identifiedPattern.id,
                                message.identifiedPattern!.reason
                              )
                            }
                            isAddedToBrief={isPatternInBrief(brief, identifiedPattern.id)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-msg-ai-bg text-text-secondary rounded-2xl px-4 py-3">
                    <span className="inline-flex gap-1">
                      <span className="animate-bounce">.</span>
                      <span className="animate-bounce [animation-delay:0.2s]">.</span>
                      <span className="animate-bounce [animation-delay:0.4s]">.</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input area */}
          <div className="border-border-light border-t p-4">
            {error && <p className="mb-2 text-sm text-red-500">{error}</p>}
            <div className="flex gap-2">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What are you trying to design?"
                disabled={isLoading}
                rows={1}
                className="border-border-light focus:border-accent-primary disabled:bg-bg-secondary disabled:text-text-tertiary flex-1 resize-none rounded-xl border px-4 py-3 text-base transition-colors outline-none"
              />
              <button
                onClick={() => handleSendMessage(inputValue)}
                disabled={isLoading || !inputValue.trim()}
                className="bg-accent-primary hover:bg-accent-hover disabled:bg-bg-tertiary disabled:text-text-tertiary rounded-xl px-6 py-3 font-medium text-white transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Right panel - Brief */}
        <div className="bg-bg-secondary flex w-1/2 flex-col">
          <div className="flex-1 overflow-y-auto p-6">
            {/* Building sections - show while not ready */}
            {!isReady && (
              <div className="mb-8 space-y-6">
                <h2 className="text-text-secondary text-sm font-semibold tracking-wide uppercase">
                  Building Brief
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2 w-2 rounded-full ${brief.goal ? 'bg-green-500' : 'bg-border-medium'}`}
                    />
                    <span
                      className={`text-sm ${brief.goal ? 'text-text-primary' : 'text-text-tertiary'}`}
                    >
                      Goal{' '}
                      {brief.goal &&
                        '— ' + brief.goal.slice(0, 50) + (brief.goal.length > 50 ? '...' : '')}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2 w-2 rounded-full ${brief.context.length > 0 ? 'bg-green-500' : 'bg-border-medium'}`}
                    />
                    <span
                      className={`text-sm ${brief.context.length > 0 ? 'text-text-primary' : 'text-text-tertiary'}`}
                    >
                      Context {brief.context.length > 0 && `— ${brief.context.length} items`}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2 w-2 rounded-full ${brief.decisions.length > 0 ? 'bg-green-500' : 'bg-border-medium'}`}
                    />
                    <span
                      className={`text-sm ${brief.decisions.length > 0 ? 'text-text-primary' : 'text-text-tertiary'}`}
                    >
                      Decisions {brief.decisions.length > 0 && `— ${brief.decisions.length} made`}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2 w-2 rounded-full ${brief.openQuestions.length > 0 ? 'bg-yellow-500' : 'bg-border-medium'}`}
                    />
                    <span
                      className={`text-sm ${brief.openQuestions.length > 0 ? 'text-text-primary' : 'text-text-tertiary'}`}
                    >
                      Open Questions{' '}
                      {brief.openQuestions.length > 0 &&
                        `— ${brief.openQuestions.length} remaining`}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2 w-2 rounded-full ${brief.patterns.length > 0 ? 'bg-blue-500' : 'bg-border-medium'}`}
                    />
                    <span
                      className={`text-sm ${brief.patterns.length > 0 ? 'text-text-primary' : 'text-text-tertiary'}`}
                    >
                      Patterns{' '}
                      {brief.patterns.length > 0 && `— ${brief.patterns.length} recommended`}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-border-medium h-2 w-2 rounded-full" />
                    <span className="text-text-tertiary text-sm">Ready to Design</span>
                  </div>
                </div>

                {/* Show patterns if any */}
                {brief.patterns.length > 0 && (
                  <div className="mt-6 space-y-2">
                    <h3 className="text-text-tertiary text-xs font-medium uppercase">
                      Recommended Patterns
                    </h3>
                    <div className="space-y-2">
                      {brief.patterns.map((p) => {
                        const pattern = getPatternById(p.patternId);
                        if (!pattern) return null;
                        return (
                          <a
                            key={p.patternId}
                            href={pattern.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border-border-light hover:border-accent-primary block rounded-lg border bg-white p-3 transition-colors"
                          >
                            <div className="text-text-primary text-sm font-medium">
                              {pattern.name}
                            </div>
                            <div className="text-text-tertiary text-xs">{pattern.oneLiner}</div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Files Section */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-text-secondary text-sm font-semibold tracking-wide uppercase">
                  Files
                </h2>
                <button
                  className="text-text-tertiary hover:bg-bg-tertiary hover:text-text-secondary flex h-6 w-6 items-center justify-center rounded transition-colors"
                  title="Add file"
                >
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
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              </div>

              {hasContent ? (
                <div className="grid grid-cols-2 gap-3">
                  <DocumentCard
                    title={documentInfo.title}
                    lineCount={documentInfo.lineCount}
                    fileType="MD"
                    onView={() => setIsModalOpen(true)}
                    onCopy={handleCopyBrief}
                    onDownload={handleDownloadBrief}
                  />
                  {isReady && (
                    <DocumentCard
                      title="design-prompt.txt"
                      lineCount={brief.readyToDesign?.prompt.split('\n').length || 5}
                      fileType="TXT"
                      onView={() => setIsModalOpen(true)}
                      onCopy={handleCopyPrompt}
                      onDownload={handleDownloadPrompt}
                    />
                  )}
                </div>
              ) : (
                <div className="border-border-light rounded-xl border-2 border-dashed p-8 text-center">
                  <p className="text-text-tertiary text-sm">
                    Documents will appear here as your brief builds
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <BriefModal
        brief={brief}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCopy={() => showToast('Brief copied to clipboard')}
      />

      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={() => setToast({ isVisible: false, message: '' })}
      />
    </div>
  );
}
