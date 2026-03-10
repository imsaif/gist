'use client';

import { useRef, useEffect } from 'react';
import { Message } from '@/types';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { PatternCard } from '@/components/PatternCard';
import { getPatternById } from '@/lib/patterns/patterns';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSend: (content: string) => void;
}

export function ChatDrawer({
  isOpen,
  onClose,
  messages,
  isLoading,
  error,
  inputValue,
  onInputChange,
  onSend,
}: ChatDrawerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend(inputValue);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />}

      {/* Drawer */}
      <div
        className={`bg-bg-primary border-border-light fixed top-0 right-0 z-50 flex h-full w-[440px] flex-col border-l shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="border-border-light flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-text-primary text-sm font-semibold">Chat</h3>
          <button
            onClick={onClose}
            className="text-text-tertiary hover:text-text-primary transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
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
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-msg-user-bg text-msg-user-text'
                          : 'bg-msg-ai-bg text-text-primary'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                  </div>
                  {identifiedPattern && message.identifiedPattern && (
                    <div className="mt-2 flex justify-start">
                      <div className="max-w-[85%]">
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
        </div>

        {/* Input */}
        <div className="border-border-light border-t p-4">
          {error && <p className="mb-2 text-sm text-red-500">{error}</p>}
          <div className="flex gap-2">
            <textarea
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about this gap..."
              disabled={isLoading}
              rows={1}
              className="border-border-light focus:border-accent-primary disabled:bg-bg-secondary disabled:text-text-tertiary flex-1 resize-none rounded-xl border px-3 py-2.5 text-sm transition-colors outline-none"
            />
            <button
              onClick={() => onSend(inputValue)}
              disabled={isLoading || !inputValue.trim()}
              className="bg-accent-primary hover:bg-accent-hover disabled:bg-bg-tertiary disabled:text-text-tertiary rounded-xl px-4 py-2.5 text-sm font-medium text-white transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
