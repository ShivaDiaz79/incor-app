/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useMemo } from "react";
import type {
  ChatbotPrompt,
  CreateChatbotPromptRequest,
  UpdateChatbotPromptRequest,
  ChatbotPromptFilters,
  ChatbotPromptsResponse,
} from "@/types/chatbot-prompts";

// API Service Functions
const chatbotPromptsAPI = {
  async getAll(
    filters?: ChatbotPromptFilters
  ): Promise<ChatbotPromptsResponse> {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.category) params.append("category", filters.category);
    if (filters?.isActive !== undefined)
      params.append("isActive", String(filters.isActive));
    if (filters?.createdBy) params.append("createdBy", filters.createdBy);
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.limit) params.append("limit", String(filters.limit));

    const url = `/api/chatbot/prompts${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const responseJson = await response.json();

    // Transform dates from strings to Date objects
    responseJson.data.data = responseJson.data.data.map((prompt: any) => ({
      ...prompt,
      createdAt: new Date(prompt.createdAt),
      updatedAt: new Date(prompt.updatedAt),
    }));

    return responseJson.data;
  },

  async getById(id: string): Promise<ChatbotPrompt> {
    const response = await fetch(`/api/chatbot/prompts/${id}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const prompt = await response.json();

    return {
      ...prompt,
      createdAt: new Date(prompt.createdAt),
      updatedAt: new Date(prompt.updatedAt),
    };
  },

  async create(data: CreateChatbotPromptRequest): Promise<ChatbotPrompt> {
    const response = await fetch("/api/chatbot/prompts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const prompt = await response.json();

    return {
      ...prompt,
      createdAt: new Date(prompt.createdAt),
      updatedAt: new Date(prompt.updatedAt),
    };
  },

  async update(
    id: string,
    data: UpdateChatbotPromptRequest
  ): Promise<ChatbotPrompt> {
    const response = await fetch(`/api/chatbot/prompts/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const prompt = await response.json();

    return {
      ...prompt,
      createdAt: new Date(prompt.createdAt),
      updatedAt: new Date(prompt.updatedAt),
    };
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`/api/chatbot/prompts/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }
  },
};

// Hook para listar prompts con paginación y filtros
export function useChatbotPrompts(initialFilters?: ChatbotPromptFilters) {
  const [data, setData] = useState<ChatbotPromptsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ChatbotPromptFilters>(
    initialFilters || {
      page: 1,
      limit: 12,
      sortBy: "updatedAt",
      sortOrder: "desc",
    }
  );

  const fetchPrompts = useCallback(
    async (newFilters?: ChatbotPromptFilters) => {
      try {
        setLoading(true);
        setError(null);
        const response = await chatbotPromptsAPI.getAll(newFilters || filters);
        setData(response);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar prompts"
        );
        setData(null);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  const updateFilters = useCallback(
    (newFilters: Partial<ChatbotPromptFilters>) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);
      fetchPrompts(updatedFilters);
    },
    [filters, fetchPrompts]
  );

  const refresh = useCallback(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  useEffect(() => {
    fetchPrompts();
  }, []);

  const pagination = useMemo(() => {
    if (!data) return null;

    return {
      currentPage: data.page,
      totalPages: data.totalPages,
      hasNextPage: data.hasNextPage,
      hasPrevPage: data.hasPrevPage,
      total: data.total,
      limit: data.limit,
    };
  }, [data]);

  return {
    prompts: data?.data || [],
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    refresh,
  };
}

// Hook para un prompt individual
export function useChatbotPrompt(id?: string) {
  const [prompt, setPrompt] = useState<ChatbotPrompt | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrompt = useCallback(async (promptId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await chatbotPromptsAPI.getById(promptId);
      setPrompt(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar el prompt"
      );
      setPrompt(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchPrompt(id);
    } else {
      setPrompt(null);
      setLoading(false);
    }
  }, [id, fetchPrompt]);

  const refresh = useCallback(() => {
    if (id) {
      fetchPrompt(id);
    }
  }, [id, fetchPrompt]);

  return {
    prompt,
    loading,
    error,
    refresh,
  };
}

// Hook para acciones CRUD
export function useChatbotPromptActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(
    async (data: CreateChatbotPromptRequest): Promise<ChatbotPrompt> => {
      try {
        setLoading(true);
        setError(null);
        const result = await chatbotPromptsAPI.create(data);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al crear prompt";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const update = useCallback(
    async (
      id: string,
      data: UpdateChatbotPromptRequest
    ): Promise<ChatbotPrompt> => {
      try {
        setLoading(true);
        setError(null);
        const result = await chatbotPromptsAPI.update(id, data);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al actualizar prompt";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const remove = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await chatbotPromptsAPI.delete(id);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al eliminar prompt";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const activate = useCallback(async (id: string): Promise<ChatbotPrompt> => {
    try {
      setLoading(true);
      setError(null);
      const result = await chatbotPromptsAPI.update(id, { isActive: true });
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al activar prompt";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const deactivate = useCallback(async (id: string): Promise<ChatbotPrompt> => {
    try {
      setLoading(true);
      setError(null);
      const result = await chatbotPromptsAPI.update(id, { isActive: false });
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al desactivar prompt";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    create,
    update,
    remove,
    activate,
    deactivate,
    loading,
    error,
    clearError,
  };
}

// Hook para búsqueda con debounce
export function useDebouncedSearch(initialValue = "", delay = 300) {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return {
    value,
    debouncedValue,
    setValue,
  };
}

// Hook para gestión de modales
export function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}
