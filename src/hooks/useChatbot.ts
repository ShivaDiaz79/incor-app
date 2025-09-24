// src/hooks/useChatbot.ts
import { useState, useCallback, useRef } from "react";

export interface ChatMessage {
  role: "user" | "assistant";
  content: Array<{
    type: "text";
    text: string;
  }>;
}

export interface ChatRequest {
  message: string;
  conversationHistory?: ChatMessage[];
}

// Tipado correcto basado en la respuesta real
export interface ChatResponse {
  data: {
    response: string;
    timestamp: string;
    metadata: {
      processingTime: number;
      promptCategory: string;
    };
  };
  statusCode: number;
  timestamp: string;
  message: string;
}

export interface ChatbotMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  loading?: boolean;
}

// Send message to chatbot API
async function sendChatMessage(data: ChatRequest): Promise<ChatResponse> {
  try {
    const response = await fetch("/api/chatbot/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw error;
  }
}

// Helper function to format conversation history
function formatConversationHistory(
  messages: Array<{ role: "user" | "assistant"; text: string }>
): ChatMessage[] {
  return messages.map((msg) => ({
    role: msg.role,
    content: [
      {
        type: "text" as const,
        text: msg.text,
      },
    ],
  }));
}

export function useChatbot() {
  const [messages, setMessages] = useState<ChatbotMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messageIdCounter = useRef(0);

  // Generate unique message ID
  const generateMessageId = () => `msg-${++messageIdCounter.current}`;

  // Add a new message to the conversation
  const addMessage = useCallback(
    (role: "user" | "assistant", content: string, loading = false) => {
      const newMessage: ChatbotMessage = {
        id: generateMessageId(),
        role,
        content,
        timestamp: new Date(),
        loading,
      };

      setMessages((prev) => [...prev, newMessage]);
      return newMessage.id;
    },
    []
  );

  // Update a specific message
  const updateMessage = useCallback(
    (messageId: string, updates: Partial<ChatbotMessage>) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, ...updates } : msg))
      );
    },
    []
  );

  // Send a message to the chatbot
  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || loading) return;

      setLoading(true);
      setError(null);

      // Add user message
      addMessage("user", message);

      // Add loading assistant message
      const assistantMessageId = addMessage("assistant", "", true);

      try {
        // Prepare conversation history (exclude the loading message)
        const conversationHistory = formatConversationHistory(
          messages.map((msg) => ({ role: msg.role, text: msg.content }))
        );

        // Send request to chatbot
        const response = await sendChatMessage({
          message,
          conversationHistory:
            conversationHistory.length > 0 ? conversationHistory : undefined,
        });

        // Extract the actual response from the API structure
        const botMessage =
          response.data?.response || "Lo siento, no pude procesar tu mensaje.";

        // Update the loading message with the response
        updateMessage(assistantMessageId, {
          content: botMessage,
          loading: false,
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error enviando mensaje";
        setError(errorMessage);

        // Update loading message to show error
        updateMessage(assistantMessageId, {
          content: `Error: ${errorMessage}`,
          loading: false,
        });
      } finally {
        setLoading(false);
      }
    },
    [loading, messages, addMessage, updateMessage]
  );

  // Clear conversation
  const clearConversation = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  // Retry last message
  const retryLastMessage = useCallback(async () => {
    if (messages.length < 2) return;

    const lastUserMessage = [...messages]
      .reverse()
      .find((msg) => msg.role === "user");
    if (!lastUserMessage) return;

    // Remove the last assistant message (error message)
    setMessages((prev) => prev.slice(0, -1));

    // Resend the last user message
    await sendMessage(lastUserMessage.content);
  }, [messages, sendMessage]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearConversation,
    retryLastMessage,
    isReady: !loading,
  };
}
