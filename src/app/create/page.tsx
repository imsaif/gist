'use client';

import { useState, useCallback, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Message } from '@/types';
import { GistDesignFile, FeatureProgress, BeforeAfterItem, EntryState } from '@/types/file';
import {
  INITIAL_GIST_FILE,
  CREATE_INITIAL_MESSAGES_NEW,
  CREATE_INITIAL_MESSAGES_EXISTING,
} from '@/lib/createPrompt';
import { parseFileResponse, mergeFileUpdate, calculateFeatureProgress } from '@/lib/fileParser';
import { generateGistDesignMarkdown } from '@/lib/export/markdown';
import { generateDeveloperBrief } from '@/lib/export/developerBrief';
import { FileContainer } from '@/components/Create';
import { PatternCard } from '@/components/PatternCard';
import { Toast } from '@/components/Toast';
import { getPatternById } from '@/lib/patterns/patterns';

// ============================================
// Page Component
// ============================================

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function CreateModeContent() {
  return <CreateModeInner />;
}

export default function CreateMode() {
  return (
    <Suspense fallback={<CreateModeLoading />}>
      <CreateModeContent />
    </Suspense>
  );
}

function CreateModeLoading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-text-tertiary">Loading...</div>
    </div>
  );
}

function CreateModeInner() {
  // Session state
  const [entryState, setEntryState] = useState<EntryState | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [file, setFile] = useState<GistDesignFile>(INITIAL_GIST_FILE);
  const [currentFeatureId, setCurrentFeatureId] = useState<string | null>(null);
  const [featureProgress, setFeatureProgress] = useState<FeatureProgress[]>([]);
  const [beforeAfter, setBeforeAfter] = useState<BeforeAfterItem[]>([]);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [toast, setToast] = useState({ isVisible: false, message: '' });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const showToast = (message: string) => {
    setToast({ isVisible: true, message });
  };

  // Select entry state and initialize messages
  const handleSelectEntryState = (state: EntryState) => {
    setEntryState(state);
    const initialMessages =
      state === 'building-new' ? CREATE_INITIAL_MESSAGES_NEW : CREATE_INITIAL_MESSAGES_EXISTING;
    setMessages(initialMessages);
  };

  // Send message
  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading || !entryState) return;

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
          body: JSON.stringify({
            messages: newMessages,
            skill: 'create',
            fileState: file,
            currentFeatureId,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get response');
        }

        const data = await response.json();
        const { displayContent, fileUpdate, beforeAfterUpdate, identifiedPattern } =
          parseFileResponse(data.message);

        const aiMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: displayContent,
          timestamp: new Date(),
          identifiedPattern: identifiedPattern ?? undefined,
        };
        setMessages((prev) => [...prev, aiMessage]);

        // Merge file update
        if (fileUpdate) {
          setFile((prev) => {
            const updated = mergeFileUpdate(prev, fileUpdate);

            // Track current feature
            if (fileUpdate.featureId) {
              setCurrentFeatureId(fileUpdate.featureId);
            }

            // Recalculate progress for all features
            const progress = updated.features.map(calculateFeatureProgress);
            setFeatureProgress(progress);

            return updated;
          });
        }

        // Accumulate before/after items
        if (beforeAfterUpdate?.items) {
          setBeforeAfter((prev) => [...prev, ...beforeAfterUpdate.items]);
        }
      } catch (err) {
        console.error('Chat error:', err);
        setError('Failed to get response. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, entryState, file, currentFeatureId]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const handleNewChat = useCallback(() => {
    if (messages.length > 1 && !confirm('Start over? Current file will be lost.')) {
      return;
    }
    setEntryState(null);
    setMessages([]);
    setFile(INITIAL_GIST_FILE);
    setCurrentFeatureId(null);
    setFeatureProgress([]);
    setBeforeAfter([]);
    setError(null);
    setInputValue('');
  }, [messages.length]);

  // Export handlers
  const handleDownload = useCallback(() => {
    const markdown = generateGistDesignMarkdown(file);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(file.product.name || 'untitled').toLowerCase().replace(/\s+/g, '-')}.gist.design`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('File downloaded');
  }, [file]);

  const handleCopyMarkdown = useCallback(async () => {
    const markdown = generateGistDesignMarkdown(file);
    await navigator.clipboard.writeText(markdown);
    showToast('Markdown copied to clipboard');
  }, [file]);

  const handleCopyBrief = useCallback(async () => {
    const brief = generateDeveloperBrief(file, beforeAfter);
    await navigator.clipboard.writeText(brief);
    showToast('Developer brief copied to clipboard');
  }, [file, beforeAfter]);

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
          <span className="bg-bg-secondary flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="text-accent-primary h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
            <span className="text-text-secondary">Create</span>
          </span>
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
        <div className="border-border-light flex w-2/5 flex-col border-r">
          <div className="flex-1 overflow-y-auto p-6">
            {/* Entry state selection */}
            {!entryState ? (
              <div className="flex h-full flex-col items-center justify-center">
                <h2 className="text-text-primary mb-2 text-lg font-semibold">
                  Create a gist.design file
                </h2>
                <p className="text-text-secondary mb-8 max-w-sm text-center text-sm">
                  Make your design decisions readable to AI coding tools and LLMs.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleSelectEntryState('building-new')}
                    className="border-border-light hover:border-accent-primary hover:bg-accent-primary/5 flex w-48 flex-col items-center gap-2 rounded-xl border p-6 text-center transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="text-accent-primary h-8 w-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                    <span className="text-text-primary text-sm font-medium">Building new</span>
                    <span className="text-text-tertiary text-xs">
                      Starting a new product or feature
                    </span>
                  </button>
                  <button
                    onClick={() => handleSelectEntryState('existing-product')}
                    className="border-border-light hover:border-accent-primary hover:bg-accent-primary/5 flex w-48 flex-col items-center gap-2 rounded-xl border p-6 text-center transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="text-accent-primary h-8 w-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                      />
                    </svg>
                    <span className="text-text-primary text-sm font-medium">Existing product</span>
                    <span className="text-text-tertiary text-xs">
                      Document decisions already made
                    </span>
                  </button>
                </div>
              </div>
            ) : (
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
            )}
          </div>

          {/* Input area */}
          {entryState && (
            <div className="border-border-light border-t p-4">
              {error && <p className="mb-2 text-sm text-red-500">{error}</p>}
              <div className="flex gap-2">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your product or feature..."
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
          )}
        </div>

        {/* Right panel - File Preview */}
        <div className="bg-bg-secondary flex w-3/5 flex-col">
          <FileContainer
            file={file}
            currentFeatureId={currentFeatureId}
            featureProgress={featureProgress}
            beforeAfter={beforeAfter}
            onDownload={handleDownload}
            onCopyMarkdown={handleCopyMarkdown}
            onCopyBrief={handleCopyBrief}
          />
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
