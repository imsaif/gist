'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Message, Brief } from '@/types';
import { INITIAL_BRIEF, INITIAL_MESSAGES } from '@/lib/constants';
import { parseBriefUpdate, mergeBriefUpdate } from '@/lib/briefParser';
import { BriefModal } from '@/components/Brief/BriefModal';
import { Toast } from '@/components/Toast';
import {
  DocumentCard,
  getBriefDocumentInfo,
  generateBriefMarkdown,
} from '@/components/Brief/DocumentCard';

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export default function BriefMode() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [brief, setBrief] = useState<Brief>(INITIAL_BRIEF);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: '' });

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
        const { displayContent, briefUpdate } = parseBriefUpdate(data.message);

        const aiMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: displayContent,
          timestamp: new Date(),
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
          <span className="bg-bg-secondary text-text-secondary rounded-full px-3 py-1 text-sm font-medium">
            Brief Mode
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleNewChat}
            className="border-border-light text-text-secondary hover:bg-bg-secondary rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
          >
            New Brief
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel - Conversation */}
        <div className="border-border-light flex w-1/2 flex-col border-r">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
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
              ))}
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
                    <div className="bg-border-medium h-2 w-2 rounded-full" />
                    <span className="text-text-tertiary text-sm">Ready to Design</span>
                  </div>
                </div>
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
