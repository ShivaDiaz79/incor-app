"use client";

import { useState } from "react";
import {
  useChatbotPrompts,
  useChatbotPromptActions,
} from "@/hooks/useChatbotPrompts";
import { ChatbotPromptCard } from "@/components/Chatbot-prompts/ChatbotPromptCard";
import { ChatbotPromptsFilters } from "@/components/Chatbot-prompts/ChatbotPromptsFilter";
import { ChatbotPromptModal } from "@/components/Chatbot-prompts/ChatbotPromptModal";
import { ConfirmDeleteModal } from "@/components/Chatbot-prompts/ConfirmDeleteModal";
import Button from "@/components/ui/button/Button";
import type {
  ChatbotPrompt,
  ChatbotPromptFilters,
} from "@/types/chatbot-prompts";

export function ChatbotPromptsList() {
  const {
    prompts,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    refresh,
  } = useChatbotPrompts({
    page: 1,
    limit: 12,
    sortBy: "updatedAt",
    sortOrder: "desc",
  });

  const {
    activate,
    deactivate,
    loading: actionLoading,
  } = useChatbotPromptActions();

  const [selectedPrompt, setSelectedPrompt] = useState<ChatbotPrompt | null>(
    null
  );
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [deletePrompt, setDeletePrompt] = useState<ChatbotPrompt | null>(null);
  const [actioningPrompt, setActioningPrompt] = useState<string | null>(null);

  // Handlers
  const handleCreate = () => {
    setSelectedPrompt(null);
    setModalMode("create");
  };

  const handleEdit = (prompt: ChatbotPrompt) => {
    setSelectedPrompt(prompt);
    setModalMode("edit");
  };

  const handleDelete = (prompt: ChatbotPrompt) => {
    setDeletePrompt(prompt);
  };

  const handleToggleActive = async (prompt: ChatbotPrompt) => {
    try {
      setActioningPrompt(prompt.id);
      if (prompt.isActive) {
        await deactivate(prompt.id);
      } else {
        await activate(prompt.id);
      }
      refresh();
    } catch (error) {
      console.error("Error toggling prompt status:", error);
    } finally {
      setActioningPrompt(null);
    }
  };

  const handleModalClose = () => {
    setSelectedPrompt(null);
    setModalMode(null);
  };

  const handleModalSuccess = () => {
    handleModalClose();
    refresh();
  };

  const handleDeleteSuccess = () => {
    setDeletePrompt(null);
    refresh();
  };

  const handleFiltersChange = (newFilters: Partial<ChatbotPromptFilters>) => {
    updateFilters({ ...newFilters, page: 1 });
  };

  const handlePageChange = (page: number) => {
    updateFilters({ page });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 sm:text-3xl">
            Prompts del Chatbot
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Gestiona los prompts del sistema de chatbot
          </p>
        </div>

        <Button onClick={handleCreate} className="w-full sm:w-auto">
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Crear Prompt
        </Button>
      </div>

      {/* Filters */}
      <ChatbotPromptsFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        loading={loading}
      />

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-error-200 bg-error-50 p-4 dark:border-error-800 dark:bg-error-500/10">
          <div className="flex">
            <svg
              className="h-5 w-5 text-error-400"
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
            <div className="ml-3">
              <h3 className="text-sm font-medium text-error-800 dark:text-error-200">
                Error al cargar los prompts
              </h3>
              <p className="mt-1 text-sm text-error-700 dark:text-error-300">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex gap-2">
                    <div className="h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                    <div className="h-5 w-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                  <div className="h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
                </div>
                <div className="h-8 w-8 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <div className="mb-4 space-y-2">
                <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <div className="h-16 w-full rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && prompts.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            No hay prompts
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {filters.search || filters.category
              ? "No se encontraron prompts que coincidan con los filtros."
              : "Comienza creando tu primer prompt del chatbot."}
          </p>
          {!filters.search && !filters.category && (
            <Button onClick={handleCreate} className="mt-4">
              Crear Primer Prompt
            </Button>
          )}
        </div>
      )}

      {/* Prompts Grid */}
      {!loading && !error && prompts.length > 0 && (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {prompts.map((prompt) => (
              <ChatbotPromptCard
                key={prompt.id}
                prompt={prompt}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleActive={handleToggleActive}
                loading={actioningPrompt === prompt.id}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Página {pagination.currentPage} de {pagination.totalPages} •{" "}
                {pagination.total} prompts
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage || loading}
                  className="text-sm"
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Anterior
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage || loading}
                  className="text-sm"
                >
                  Siguiente
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {modalMode && (
        <ChatbotPromptModal
          isOpen={!!modalMode}
          mode={modalMode}
          prompt={selectedPrompt}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}

      {deletePrompt && (
        <ConfirmDeleteModal
          isOpen={!!deletePrompt}
          prompt={deletePrompt}
          onClose={() => setDeletePrompt(null)}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
}
