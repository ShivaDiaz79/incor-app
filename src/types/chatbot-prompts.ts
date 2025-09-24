// src/types/chatbot-prompts.ts
export enum ChatbotPromptCategory {
  GENERAL = "general",
  APPOINTMENTS = "appointments",
  SUPPORT = "support",
  EMERGENCY = "emergency",
}

export interface ChatbotPrompt {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  category: ChatbotPromptCategory;
  variables: string[];
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateChatbotPromptRequest {
  name: string;
  description: string;
  systemPrompt: string;
  category: ChatbotPromptCategory;
  variables: string[];
  createdBy: string;
  isActive?: boolean;
}

export interface UpdateChatbotPromptRequest {
  name?: string;
  description?: string;
  systemPrompt?: string;
  category?: ChatbotPromptCategory;
  variables?: string[];
  isActive?: boolean;
}

export interface ChatbotPromptFilters {
  search?: string;
  category?: ChatbotPromptCategory;
  isActive?: boolean;
  createdBy?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface ChatbotPromptsResponse {
  data: ChatbotPrompt[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  statusCode: number;
  timestamp: string;
  message: string;
}
