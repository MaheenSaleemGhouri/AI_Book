import React, { useCallback, useEffect, useRef, useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './ChatWidget.module.css';
import type { ChatResponse, HistoryResponse, Message } from './types';

const SESSION_KEY = 'pai_chat_session_id';

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  const existing = localStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem(SESSION_KEY, id);
  return id;
}

function formatTime(iso?: string): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export default function ChatWidget(): React.ReactElement {
  const { siteConfig } = useDocusaurusContext();
  const apiUrl =
    (siteConfig.customFields?.chatApiUrl as string | undefined) ??
    'http://localhost:8000';

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialise session and fetch history on mount
  useEffect(() => {
    const sid = getOrCreateSessionId();
    setSessionId(sid);
    if (!sid) return;

    fetch(`${apiUrl}/history/${sid}`)
      .then((res) => res.json() as Promise<HistoryResponse>)
      .then((data) => {
        if (data.messages?.length) {
          setMessages(data.messages);
        }
      })
      .catch(() => {
        // Silently ignore history fetch errors on mount
      });
  }, [apiUrl]);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = {
      role: 'user',
      content: trimmed,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, message: trimmed }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = (await res.json()) as ChatResponse;
      const aiMsg: Message = {
        role: 'assistant',
        content: data.answer,
        created_at: new Date().toISOString(),
        sources: data.sources,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errMsg: Message = {
        role: 'assistant',
        content: 'Something went wrong. Please try again.',
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl, input, isLoading, sessionId]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        void sendMessage();
      }
    },
    [sendMessage],
  );

  return (
    <div className={styles.container}>
      {isOpen ? (
        <div className={styles.panel} role="dialog" aria-label="Book Assistant">
          {/* Header */}
          <div className={styles.header}>
            <p className={styles.headerTitle}>📖 Book Assistant</p>
            <button
              className={styles.closeBtn}
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className={styles.messages} role="log" aria-live="polite">
            {messages.length === 0 && !isLoading && (
              <div className={styles.emptyState}>
                Ask anything about the book content.
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`${styles.message} ${
                  msg.role === 'user' ? styles.userMessage : styles.aiMessage
                }`}
              >
                <div className={styles.messageBubble}>{msg.content}</div>
                {msg.sources && msg.sources.length > 0 && (
                  <div className={styles.sources}>
                    {msg.sources.map((src) => (
                      <span key={src} className={styles.sourceTag}>
                        {src}
                      </span>
                    ))}
                  </div>
                )}
                <span className={styles.messageTime}>
                  {formatTime(msg.created_at)}
                </span>
              </div>
            ))}
            {isLoading && (
              <div className={styles.loadingDots} aria-label="Loading">
                <span />
                <span />
                <span />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className={styles.inputArea}>
            <input
              className={styles.input}
              type="text"
              placeholder="Ask anything about the book..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              aria-label="Chat message input"
            />
            <button
              className={styles.sendBtn}
              onClick={() => void sendMessage()}
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <button
          className={styles.bubble}
          onClick={() => setIsOpen(true)}
          aria-label="Open book assistant chat"
        >
          💬
        </button>
      )}
    </div>
  );
}
