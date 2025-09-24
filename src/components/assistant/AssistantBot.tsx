"use client";

import React, { ComponentProps, ElementType, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import TextArea from "@/components/form/input/TextArea";
import Button from "@/components/ui/button/Button";
import { useChatbot } from "@/hooks/useChatbot";
import type { ExtraProps } from "react-markdown";

interface ChatbotProps {
  welcomeMd?: string;
  placeholder?: string;
  className?: string;
  showHeader?: boolean;
}

type Components = {
  [Key in Extract<ElementType, string>]?: ElementType<
    ComponentProps<Key> & ExtraProps
  >;
};

const markdownComponents: Components = {
  a(p) {
    return (
      <a {...p} className="underline underline-offset-2 hover:opacity-80" />
    );
  },
  code({
    inline,
    children,
    ...props
  }: React.PropsWithChildren<
    { inline?: boolean } & React.HTMLAttributes<HTMLElement>
  >) {
    return inline ? (
      <code
        className="rounded bg-black/10 px-1 py-0.5 dark:bg-white/10"
        {...props}
      >
        {children}
      </code>
    ) : (
      <pre className="overflow-auto rounded-lg bg-gray-100 p-3 text-xs dark:bg-gray-800">
        <code {...props}>{children}</code>
      </pre>
    );
  },
  ul(p) {
    return <ul {...p} className="list-disc pl-5" />;
  },
  ol(p) {
    return <ol {...p} className="list-decimal pl-5" />;
  },
  blockquote(p) {
    return (
      <blockquote
        {...p}
        className="border-l-4 border-gray-300 pl-3 italic dark:border-gray-600"
      />
    );
  },
  h1(p) {
    return <h1 {...p} className="mb-1 mt-2 text-lg font-bold" />;
  },
  h2(p) {
    return <h2 {...p} className="mb-1 mt-2 text-base font-bold" />;
  },
  h3(p) {
    return <h3 {...p} className="mb-1 mt-2 text-sm font-bold" />;
  },
  table(p) {
    return (
      <div className="overflow-x-auto">
        <table {...p} className="w-full border-collapse text-left text-xs" />
      </div>
    );
  },
  th(p) {
    return <th {...p} className="border-b px-2 py-1 font-semibold" />;
  },
  td(p) {
    return <td {...p} className="border-b px-2 py-1" />;
  },
};

const AssistantBot: React.FC<ChatbotProps> = ({
  welcomeMd = "¡Hola! Soy Yoli, asistente de la clínica Incor. ¿Cuál es tu nombre?",
  placeholder = "Escribe tu mensaje…",
  className = "",
  showHeader = true,
}) => {
  const {
    messages,
    loading,
    error,
    sendMessage,
    clearConversation,
    retryLastMessage,
  } = useChatbot();

  const [input, setInput] = React.useState("");
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  const canSend = React.useMemo(
    () => input.trim().length > 0 && !loading,
    [input, loading]
  );

  const handleSend = async () => {
    const content = input.trim();
    if (!content || loading) return;

    setInput("");
    await sendMessage(content);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) {
        handleSend();
      }
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={[
        "flex h-full w-full flex-col rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900",
        className,
      ].join(" ")}
    >
      {showHeader && (
        <div className="flex items-center justify-between gap-2 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-white">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                Yoli - Asistente Incor
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                En línea • Responde en Markdown
              </p>
            </div>
          </div>

          <button
            onClick={clearConversation}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            title="Limpiar conversación"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      )}

      <div
        ref={listRef}
        className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar sm:px-4"
        aria-live="polite"
      >
        <div className="mx-auto flex w-full flex-col gap-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center py-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-500/20">
                <svg
                  className="h-6 w-6 text-brand-500 dark:text-brand-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <div className="max-w-md">
                <ReactMarkdown components={markdownComponents}>
                  {welcomeMd}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              role={message.role}
              content={message.content}
              timestamp={message.timestamp}
              loading={message.loading}
              formatTime={formatTime}
            />
          ))}

          {error && (
            <div className="flex justify-center">
              <div className="max-w-md rounded-lg bg-error-50 p-4 text-center dark:bg-error-500/10">
                <div className="flex items-center justify-center gap-2 text-error-600 dark:text-error-400">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm font-medium">Error: {error}</span>
                </div>
                <button
                  onClick={retryLastMessage}
                  className="mt-2 text-sm text-error-500 underline hover:text-error-700 dark:text-error-400 dark:hover:text-error-300"
                >
                  Reintentar último mensaje
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-gray-200 p-3 dark:border-gray-800 sm:p-4">
        <div className="mx-auto flex w-full items-end gap-2">
          <div className="flex-1">
            <TextArea
              placeholder={placeholder}
              rows={3}
              value={input}
              onChange={setInput}
              disabled={loading}
              error={false}
              hint=""
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="flex">
            <Button
              onClick={handleSend}
              loading={loading}
              disabled={!canSend}
              variant="primary"
              size="md"
              aria-label="Enviar mensaje"
            >
              {loading ? (
                <svg
                  className="h-4 w-4 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              ) : (
                "Enviar"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantBot;

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  loading?: boolean;
  formatTime: (date: Date) => string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  role,
  content,
  timestamp,
  loading = false,
  formatTime,
}) => {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex max-w-[90%] gap-2 sm:max-w-[80%] md:max-w-[70%] ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <div
          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
            isUser
              ? "bg-brand-500 text-white"
              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
          }`}
        >
          {isUser ? (
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          ) : (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
              />
            </svg>
          )}
        </div>
        <div
          className={[
            "rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isUser
              ? "bg-brand-600 text-white shadow-theme-xs rounded-br-sm"
              : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 rounded-bl-sm",
          ].join(" ")}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="flex space-x-1">
                <div className="h-2 w-2 animate-pulse rounded-full bg-gray-400"></div>
                <div className="h-2 w-2 animate-pulse rounded-full bg-gray-400 [animation-delay:0.2s]"></div>
                <div className="h-2 w-2 animate-pulse rounded-full bg-gray-400 [animation-delay:0.4s]"></div>
              </div>
              <span className="text-xs">Escribiendo...</span>
            </div>
          ) : (
            <>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown components={markdownComponents}>
                  {content}
                </ReactMarkdown>
              </div>
              <div
                className={`mt-2 text-xs opacity-70 ${
                  isUser ? "text-white/70" : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {formatTime(timestamp)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
