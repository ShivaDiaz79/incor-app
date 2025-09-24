"use client";

import { useChatbotPromptActions } from "@/hooks/useChatbotPrompts";
import Button from "@/components/ui/button/Button";
import type { ChatbotPrompt } from "@/types/chatbot-prompts";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  prompt: ChatbotPrompt;
  onClose: () => void;
  onSuccess: () => void;
}

export function ConfirmDeleteModal({
  isOpen,
  prompt,
  onClose,
  onSuccess,
}: ConfirmDeleteModalProps) {
  const { remove, loading, error } = useChatbotPromptActions();

  const handleDelete = async () => {
    try {
      await remove(prompt.id);
      onSuccess();
    } catch (err) {
      console.error("Error deleting prompt:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto backdrop-blur-sm bg-black/30 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl dark:bg-gray-900">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error-100 dark:bg-error-500/20">
              <svg
                className="h-6 w-6 text-error-600 dark:text-error-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.081 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Eliminar Prompt
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Esta acción no se puede deshacer
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ¿Estás seguro de que quieres eliminar el prompt{" "}
            <span className="font-medium text-gray-900 dark:text-gray-100">
              &quot;{prompt.name}&quot;
            </span>
            ? Todos los datos asociados se perderán permanentemente.
          </p>

          {/* Prompt Details */}
          <div className="mt-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">
                  Categoría:
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  {prompt.category}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">
                  Estado:
                </span>
                <span
                  className={
                    prompt.isActive
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-500"
                  }
                >
                  {prompt.isActive ? "Activo" : "Inactivo"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">
                  Variables:
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  {prompt.variables.length}
                </span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 rounded-lg border border-error-200 bg-error-50 p-3 dark:border-error-800 dark:bg-error-500/10">
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
                  <p className="text-sm text-error-700 dark:text-error-300">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 p-6 pt-4 dark:border-gray-800">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            loading={loading}
            disabled={loading}
          >
            Eliminar Prompt
          </Button>
        </div>
      </div>
    </div>
  );
}
