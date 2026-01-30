'use client';

import { useState, useCallback, useRef, useEffect, Suspense, ReactNode } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Message, DesignMap } from '@/types';
import { INITIAL_DESIGN_MAP, MAP_INITIAL_MESSAGES } from '@/lib/constants';
import {
  parseDesignMapUpdate,
  mergeDesignMapUpdate,
  addPatternToStep,
  isPatternInDesignMap,
  generateDesignMapMarkdown,
} from '@/lib/designMapParser';
import { DesignMapModal, DesignMapPanel } from '@/components/DesignMap';
import { Toast } from '@/components/Toast';
import { PatternCard } from '@/components/Chat/PatternCard';
import { getPatternById } from '@/lib/patterns/patterns';

// Heroicons for Mode Dropdown
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

const ScaleIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
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

// Wrapper component to handle search params with Suspense
function MapModeContent() {
  return <MapModeInner />;
}

export default function MapMode() {
  return (
    <Suspense fallback={<MapModeLoading />}>
      <MapModeContent />
    </Suspense>
  );
}

function MapModeLoading() {
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
    id: 'rationale',
    name: 'Rationale',
    icon: <ScaleIcon className="h-5 w-5" />,
    description: 'Capture decisions',
    href: '/rationale',
  },
];

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function MapModeInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(MAP_INITIAL_MESSAGES);
  const [designMap, setDesignMap] = useState<DesignMap>(INITIAL_DESIGN_MAP);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: '' });
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const [initialMessageSent, setInitialMessageSent] = useState(false);
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

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle initial message from URL query parameter
  useEffect(() => {
    const initialQuery = searchParams.get('q');
    if (initialQuery && !initialMessageSent && !isLoading) {
      setInitialMessageSent(true);
      router.replace('/map', { scroll: false });
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
    const newMessages = [...MAP_INITIAL_MESSAGES, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, mode: 'map' }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const { displayContent, designMapUpdate, identifiedPattern } = parseDesignMapUpdate(
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

      if (designMapUpdate) {
        setDesignMap((prev) => mergeDesignMapUpdate(prev, designMapUpdate));
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
          body: JSON.stringify({ messages: newMessages, mode: 'map' }),
        });

        if (!response.ok) {
          throw new Error('Failed to get response');
        }

        const data = await response.json();
        const { displayContent, designMapUpdate, identifiedPattern } = parseDesignMapUpdate(
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

        if (designMapUpdate) {
          setDesignMap((prev) => mergeDesignMapUpdate(prev, designMapUpdate));
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
    if (messages.length > 1 && !confirm('Start over? Current map will be lost.')) {
      return;
    }
    setMessages(MAP_INITIAL_MESSAGES);
    setDesignMap(INITIAL_DESIGN_MAP);
    setError(null);
    setInputValue('');
  }, [messages.length]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const handleCopyMap = useCallback(async () => {
    const markdown = generateDesignMapMarkdown(designMap);
    await navigator.clipboard.writeText(markdown);
    showToast('Map copied to clipboard');
  }, [designMap]);

  const handleDownloadMap = useCallback(() => {
    const markdown = generateDesignMapMarkdown(designMap);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `design-map-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [designMap]);

  const handleAddPatternToStep = useCallback(
    (patternId: string, reason: string, stepId?: string) => {
      // If no specific step, add to the most recent step
      const targetStepId = stepId ?? designMap.flow[designMap.flow.length - 1]?.id;
      if (targetStepId) {
        setDesignMap((prev) => addPatternToStep(prev, targetStepId, patternId, reason));
        showToast('Pattern added to step');
      }
    },
    [designMap.flow]
  );

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
                <MapIcon className="h-4 w-4" />
              </span>
              <span className="text-text-secondary">Map Mode</span>
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
                        mode.id === 'map'
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
                      {mode.id === 'map' && (
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
                            onAdd={() =>
                              handleAddPatternToStep(
                                identifiedPattern.id,
                                message.identifiedPattern!.reason,
                                message.identifiedPattern!.flowStepId
                              )
                            }
                            isAdded={isPatternInDesignMap(designMap, identifiedPattern.id)}
                            addLabel="Add to step"
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

          {/* Input area */}
          <div className="border-border-light border-t p-4">
            {error && <p className="mb-2 text-sm text-red-500">{error}</p>}
            <div className="flex gap-2">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe the next step in the flow..."
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

        {/* Right panel - Design Map */}
        <div className="bg-bg-secondary w-1/2">
          <DesignMapPanel
            map={designMap}
            onViewMap={() => setIsModalOpen(true)}
            onCopyMap={handleCopyMap}
            onDownloadMap={handleDownloadMap}
          />
        </div>
      </div>

      <DesignMapModal
        map={designMap}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCopy={() => showToast('Map copied to clipboard')}
      />

      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={() => setToast({ isVisible: false, message: '' })}
      />
    </div>
  );
}
