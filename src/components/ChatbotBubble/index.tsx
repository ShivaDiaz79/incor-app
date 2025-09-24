"use client";

import { useState, useRef, useEffect } from "react";
import { useChatbot } from "@/hooks/useChatbot";
import { ChatbotMessage } from "@/hooks/useChatbot";

interface ChatbotBubbleProps {
  className?: string;
}

export function ChatbotBubble({ className = "" }: ChatbotBubbleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    messages,
    loading,
    error,
    sendMessage,
    clearConversation,
    retryLastMessage,
  } = useChatbot();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    await sendMessage(inputMessage);
    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`relative ${className}`}>
      {/* Chat Window - Mobile (Full screen) */}
      {isOpen && (
        <>
          {/* Mobile Layout */}
          <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-gray-dark sm:hidden">
            {/* Mobile Header */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-brand-500 p-4 text-white dark:border-gray-800 safe-top">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
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
                  <h3 className="text-base font-semibold">
                    Yoli - Asistente Incor
                  </h3>
                  <p className="text-sm text-white/80">En línea</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={clearConversation}
                  className="rounded-lg p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white active:bg-white/30"
                  title="Limpiar conversación"
                >
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
                <button
                  onClick={toggleChat}
                  className="rounded-lg p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white active:bg-white/30"
                  title="Cerrar chat"
                >
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Messages */}
            <div className="flex-1 overflow-y-auto p-4 safe-bottom custom-scrollbar">
              {messages.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center text-center px-4">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-500/20">
                    <svg
                      className="h-10 w-10 text-brand-500 dark:text-brand-400"
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
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    ¡Hola! Soy Yoli
                  </h3>
                  <p className="text-base text-gray-600 dark:text-gray-400 mb-1">
                    Asistente virtual de la clínica Incor
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    ¿En qué puedo ayudarte hoy?
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {messages.map((message: ChatbotMessage) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex max-w-[85%] gap-3 ${
                        message.role === "user"
                          ? "flex-row-reverse"
                          : "flex-row"
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                          message.role === "user"
                            ? "bg-brand-500 text-white"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        {message.role === "user" ? (
                          <svg
                            className="h-5 w-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        ) : (
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
                              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                            />
                          </svg>
                        )}
                      </div>

                      {/* Message Bubble */}
                      <div
                        className={`rounded-2xl px-4 py-3 text-base leading-relaxed ${
                          message.role === "user"
                            ? "bg-brand-500 text-white rounded-br-md"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 rounded-bl-md"
                        }`}
                      >
                        {message.loading ? (
                          <div className="flex items-center gap-3">
                            <div className="flex space-x-1">
                              <div className="h-2 w-2 animate-pulse rounded-full bg-gray-400"></div>
                              <div className="h-2 w-2 animate-pulse rounded-full bg-gray-400 [animation-delay:0.2s]"></div>
                              <div className="h-2 w-2 animate-pulse rounded-full bg-gray-400 [animation-delay:0.4s]"></div>
                            </div>
                            <span className="text-sm">Escribiendo...</span>
                          </div>
                        ) : (
                          <>
                            <div className="whitespace-pre-wrap break-words">
                              {message.content}
                            </div>
                            <div
                              className={`mt-2 text-xs opacity-70 ${
                                message.role === "user"
                                  ? "text-white/70"
                                  : "text-gray-500 dark:text-gray-400"
                              }`}
                            >
                              {formatTime(message.timestamp)}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {error && (
                <div className="mt-4 rounded-xl bg-error-50 p-4 text-center dark:bg-error-500/10">
                  <p className="text-base text-error-600 dark:text-error-400 mb-2">
                    {error}
                  </p>
                  <button
                    onClick={retryLastMessage}
                    className="text-sm font-medium text-error-500 underline hover:text-error-700 dark:text-error-400 dark:hover:text-error-300"
                  >
                    Reintentar
                  </button>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Mobile Input */}
            <div className="border-t border-gray-200 p-4 safe-bottom dark:border-gray-800">
              <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 rounded-full border border-gray-300 bg-white px-4 py-3 text-base placeholder-gray-500 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 dark:focus:border-brand-400"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !inputMessage.trim()}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500 text-white transition-colors hover:bg-brand-600 active:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-brand-600 dark:hover:bg-brand-500"
                  title="Enviar mensaje"
                >
                  {loading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  ) : (
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
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="absolute bottom-16 right-0 z-50 hidden h-[32rem] w-96 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:flex">
            {/* Desktop Header */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-brand-500 p-4 text-white dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
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
                  <h3 className="text-sm font-semibold">
                    Yoli - Asistente Incor
                  </h3>
                  <p className="text-xs text-white/80">En línea</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={clearConversation}
                  className="rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
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
                <button
                  onClick={toggleChat}
                  className="rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                  title="Cerrar chat"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Desktop Messages */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {messages.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center text-center">
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
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    ¡Hola! Soy Yoli
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Asistente virtual de la clínica Incor
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    ¿En qué puedo ayudarte hoy?
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {messages.map((message: ChatbotMessage) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex max-w-[85%] gap-2 ${
                        message.role === "user"
                          ? "flex-row-reverse"
                          : "flex-row"
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${
                          message.role === "user"
                            ? "bg-brand-500 text-white"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        {message.role === "user" ? (
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
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

                      {/* Message Bubble */}
                      <div
                        className={`rounded-lg px-3 py-2 text-sm leading-relaxed ${
                          message.role === "user"
                            ? "bg-brand-500 text-white rounded-br-sm"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 rounded-bl-sm"
                        }`}
                      >
                        {message.loading ? (
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
                            <div className="whitespace-pre-wrap break-words">
                              {message.content}
                            </div>
                            <div
                              className={`mt-1 text-xs opacity-70 ${
                                message.role === "user"
                                  ? "text-white/70"
                                  : "text-gray-500 dark:text-gray-400"
                              }`}
                            >
                              {formatTime(message.timestamp)}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {error && (
                <div className="mt-4 rounded-lg bg-error-50 p-3 text-center dark:bg-error-500/10">
                  <p className="text-sm text-error-600 dark:text-error-400">
                    {error}
                  </p>
                  <button
                    onClick={retryLastMessage}
                    className="mt-1 text-xs text-error-500 underline hover:text-error-700 dark:text-error-400 dark:hover:text-error-300"
                  >
                    Reintentar
                  </button>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Desktop Input */}
            <div className="border-t border-gray-200 p-4 dark:border-gray-800">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 dark:focus:border-brand-400"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !inputMessage.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500 text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-brand-600 dark:hover:bg-brand-500"
                  title="Enviar mensaje"
                >
                  {loading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
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
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  )}
                </button>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className={`flex items-center justify-center rounded-full bg-brand-500 text-white shadow-theme-lg transition-all duration-300 hover:bg-brand-600 hover:shadow-theme-xl active:scale-95 dark:bg-brand-600 dark:hover:bg-brand-500 ${
          isOpen
            ? "h-12 w-12 rotate-180 sm:h-12 sm:w-12"
            : "h-14 w-14 sm:h-12 sm:w-12"
        }`}
        title={isOpen ? "Cerrar chat" : "Abrir chat"}
      >
        {/* Notification dot */}
        {!isOpen && messages.length > 0 && (
          <div className="absolute -top-1 -right-1 h-4 w-4 animate-pulse rounded-full bg-error-500 ring-2 ring-white dark:ring-gray-dark sm:h-3 sm:w-3"></div>
        )}

        {isOpen ? (
          <svg
            className="h-6 w-6 sm:h-5 sm:w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="h-6 w-6 sm:h-5 sm:w-5"
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
        )}
      </button>
    </div>
  );
}
