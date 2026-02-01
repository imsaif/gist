'use client';

import { useState, useCallback, useRef, useEffect, Suspense, ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Message } from '@/types';
import { CHAT_INITIAL_MESSAGES } from '@/lib/constants';
import { Toast } from '@/components/Toast';
import { PatternCard } from '@/components/Chat/PatternCard';
import { getPatternById } from '@/lib/patterns/patterns';

// Heroicons for Mode Dropdown
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

function ChatModeContent() {
  return <ChatModeInner />;
}

export default function ChatMode() {
  return (
    <Suspense fallback={<ChatModeLoading />}>
      <ChatModeContent />
    </Suspense>
  );
}

function ChatModeLoading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-text-tertiary">Loading...</div>
    </div>
  );
}

interface Mode {
  id: string;
  name: string;
  icon: ReactNode;
  description: string;
  href: string;
}

const MODES: Mode[] = [
  {
    id: 'chat',
    name: 'Chat',
    icon: <ChatBubbleLeftRightIcon className="h-5 w-5" />,
    description: 'Auto-detects mode',
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
];

interface ModeSuggestion {
  suggestedMode: string;
  reason: string;
}

interface IdentifiedPattern {
  patternId: string;
  reason: string;
}

function parseModeSuggestion(content: string): {
  displayContent: string;
  modeSuggestion: ModeSuggestion | null;
  identifiedPattern: IdentifiedPattern | null;
} {
  let displayContent = content;
  let modeSuggestion: ModeSuggestion | null = null;
  let identifiedPattern: IdentifiedPattern | null = null;

  // Extract mode suggestion
  const modeSuggestionMatch = content.match(/<mode_suggestion>\s*([\s\S]*?)\s*<\/mode_suggestion>/);
  if (modeSuggestionMatch) {
    displayContent = displayContent.replace(modeSuggestionMatch[0], '').trim();
    try {
      modeSuggestion = JSON.parse(modeSuggestionMatch[1]);
    } catch {
      console.error('Failed to parse mode suggestion');
    }
  }

  // Extract pattern
  const patternMatch = content.match(/<pattern_identified>\s*([\s\S]*?)\s*<\/pattern_identified>/);
  if (patternMatch) {
    displayContent = displayContent.replace(patternMatch[0], '').trim();
    try {
      identifiedPattern = JSON.parse(patternMatch[1]);
    } catch {
      console.error('Failed to parse pattern');
    }
  }

  return { displayContent, modeSuggestion, identifiedPattern };
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function ChatModeInner() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(CHAT_INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [toast, setToast] = useState({ isVisible: false, message: '' });
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const [suggestedMode, setSuggestedMode] = useState<ModeSuggestion | null>(null);
  const modeDropdownRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modeDropdownRef.current && !modeDropdownRef.current.contains(event.target as Node)) {
        setIsModeDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
          body: JSON.stringify({ messages: newMessages, mode: 'chat' }),
        });

        if (!response.ok) {
          throw new Error('Failed to get response');
        }

        const data = await response.json();
        const { displayContent, modeSuggestion, identifiedPattern } = parseModeSuggestion(
          data.message
        );

        const aiMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: displayContent,
          timestamp: new Date(),
          identifiedPattern: identifiedPattern ?? undefined,
        };
        setMessages((prev) => [...prev, aiMessage]);

        if (modeSuggestion) {
          setSuggestedMode(modeSuggestion);
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
    if (messages.length > 1 && !confirm('Start over? Current conversation will be lost.')) {
      return;
    }
    setMessages(CHAT_INITIAL_MESSAGES);
    setSuggestedMode(null);
    setError(null);
    setInputValue('');
  }, [messages.length]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const handleSwitchMode = (modeId: string) => {
    const mode = MODES.find((m) => m.id === modeId);
    if (mode) {
      router.push(mode.href);
    }
  };

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

          {/* Mode Switcher Dropdown */}
          <div className="relative" ref={modeDropdownRef}>
            <button
              onClick={() => setIsModeDropdownOpen(!isModeDropdownOpen)}
              className="bg-bg-secondary hover:bg-bg-tertiary flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium transition-colors"
            >
              <span className="text-accent-primary">
                <ChatBubbleLeftRightIcon className="h-4 w-4" />
              </span>
              <span className="text-text-secondary">Chat</span>
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
                className={`text-text-tertiary transition-transform ${isModeDropdownOpen ? 'rotate-180' : ''}`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {isModeDropdownOpen && (
              <div className="border-border-light absolute top-full left-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border bg-white shadow-lg">
                <div className="p-2">
                  <p className="text-text-tertiary px-3 py-2 text-xs font-medium uppercase">
                    Switch Mode
                  </p>
                  {MODES.map((mode) => (
                    <Link
                      key={mode.id}
                      href={mode.href}
                      onClick={() => setIsModeDropdownOpen(false)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                        mode.id === 'chat'
                          ? 'bg-accent-primary/10 text-accent-primary'
                          : 'hover:bg-bg-secondary text-text-primary'
                      }`}
                    >
                      <span className="text-accent-primary">{mode.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{mode.name}</span>
                        </div>
                        <p className="text-text-tertiary text-xs">{mode.description}</p>
                      </div>
                      {mode.id === 'chat' && (
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

      {/* Main content - centered chat */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col">
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
                            onAddToBrief={() => showToast('Switch to Brief mode to add patterns')}
                            isAddedToBrief={false}
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
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Mode suggestion banner */}
          {suggestedMode && (
            <div className="border-border-light bg-accent-primary/5 border-t px-6 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-primary text-sm font-medium">
                    Switch to{' '}
                    {suggestedMode.suggestedMode.charAt(0).toUpperCase() +
                      suggestedMode.suggestedMode.slice(1)}{' '}
                    mode?
                  </p>
                  <p className="text-text-tertiary text-xs">{suggestedMode.reason}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSuggestedMode(null)}
                    className="text-text-secondary hover:text-text-primary text-sm"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => handleSwitchMode(suggestedMode.suggestedMode)}
                    className="bg-accent-primary hover:bg-accent-hover rounded-lg px-3 py-1 text-sm font-medium text-white"
                  >
                    Switch
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Input area */}
          <div className="border-border-light border-t p-4">
            {error && <p className="mb-2 text-sm text-red-500">{error}</p>}
            <div className="flex gap-2">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What are you working on?"
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
      </div>

      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={() => setToast({ isVisible: false, message: '' })}
      />
    </div>
  );
}
