"use client";

import { useState } from "react";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { ChatbotPromptCategory } from "@/types/chatbot-prompts";
import type { ChatbotPrompt } from "@/types/chatbot-prompts";

interface ChatbotPromptCardProps {
  prompt: ChatbotPrompt;
  onEdit: (prompt: ChatbotPrompt) => void;
  onDelete: (prompt: ChatbotPrompt) => void;
  onToggleActive: (prompt: ChatbotPrompt) => void;
  loading?: boolean;
}

const CATEGORY_STYLES: Record<ChatbotPromptCategory, string> = {
  [ChatbotPromptCategory.GENERAL]:
    "bg-gray-50 text-gray-700 ring-gray-200 dark:bg-gray-500/10 dark:text-gray-300",
  [ChatbotPromptCategory.APPOINTMENTS]:
    "bg-blue-light-50 text-blue-light-700 ring-blue-light-200 dark:bg-blue-light-500/10 dark:text-blue-light-300",
  [ChatbotPromptCategory.SUPPORT]:
    "bg-success-50 text-success-700 ring-success-200 dark:bg-success-500/10 dark:text-success-300",
  [ChatbotPromptCategory.EMERGENCY]:
    "bg-error-50 text-error-700 ring-error-200 dark:bg-error-500/10 dark:text-error-300",
};

const CATEGORY_LABELS: Record<ChatbotPromptCategory, string> = {
  [ChatbotPromptCategory.GENERAL]: "General",
  [ChatbotPromptCategory.APPOINTMENTS]: "Citas",
  [ChatbotPromptCategory.SUPPORT]: "Soporte",
  [ChatbotPromptCategory.EMERGENCY]: "Emergencia",
};

function formatDate(date: Date): string {
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function ChatbotPromptCard({
  prompt,
  onEdit,
  onDelete,
  onToggleActive,
  loading = false,
}: ChatbotPromptCardProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);

  const handleMenuToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setAnchorRect(rect);
    setDropdownOpen(!dropdownOpen);
  };

  const handleMenuClose = () => {
    setDropdownOpen(false);
    setAnchorRect(null);
  };

  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-4 transition-all hover:border-gray-300 hover:shadow-theme-sm dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 sm:p-6">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                CATEGORY_STYLES[prompt.category]
              }`}
            >
              {CATEGORY_LABELS[prompt.category]}
            </span>

            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                prompt.isActive
                  ? "bg-success-50 text-success-700 ring-success-200 dark:bg-success-500/10 dark:text-success-300"
                  : "bg-gray-50 text-gray-600 ring-gray-200 dark:bg-gray-500/10 dark:text-gray-400"
              }`}
            >
              {prompt.isActive ? "Activo" : "Inactivo"}
            </span>
          </div>

          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
            {prompt.name}
          </h3>
        </div>

        {/* Actions Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={handleMenuToggle}
            disabled={loading}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Menú de acciones"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="5" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
            </svg>
          </button>

          <Dropdown
            isOpen={dropdownOpen}
            onClose={handleMenuClose}
            anchorRect={anchorRect}
            className="min-w-48"
          >
            <div className="py-1">
              <button
                onClick={() => {
                  handleMenuClose();
                  onEdit(prompt);
                }}
                className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                disabled={loading}
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Editar
              </button>

              <button
                onClick={() => {
                  handleMenuClose();
                  onToggleActive(prompt);
                }}
                className={`flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  prompt.isActive
                    ? "text-orange-700 dark:text-orange-300"
                    : "text-success-700 dark:text-success-300"
                }`}
                disabled={loading}
              >
                {prompt.isActive ? (
                  <>
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
                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636"
                      />
                    </svg>
                    Desactivar
                  </>
                ) : (
                  <>
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Activar
                  </>
                )}
              </button>

              <div className="my-1 h-px bg-gray-100 dark:bg-gray-800" />

              <button
                onClick={() => {
                  handleMenuClose();
                  onDelete(prompt);
                }}
                className="flex w-full items-center gap-3 px-4 py-2 text-sm text-error-700 hover:bg-error-50 dark:text-error-300 dark:hover:bg-error-500/10"
                disabled={loading}
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
                Eliminar
              </button>
            </div>
          </Dropdown>
        </div>
      </div>

      {/* Description */}
      <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        {truncateText(prompt.description, 120)}
      </p>

      {/* System Prompt Preview */}
      <div className="mb-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
          Prompt del Sistema
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300 font-mono leading-relaxed">
          {truncateText(prompt.systemPrompt, 100)}
        </p>
      </div>

      {/* Variables */}
      {prompt.variables.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
            Variables ({prompt.variables.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {prompt.variables.slice(0, 3).map((variable) => (
              <span
                key={variable}
                className="inline-flex items-center rounded px-2 py-1 text-xs bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
              >
                {variable}
              </span>
            ))}
            {prompt.variables.length > 3 && (
              <span className="inline-flex items-center rounded px-2 py-1 text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                +{prompt.variables.length - 3} más
              </span>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-3">
          <span>Por: {prompt.createdBy}</span>
          <span>•</span>
          <span>{formatDate(prompt.createdAt)}</span>
        </div>

        {prompt.updatedAt.getTime() !== prompt.createdAt.getTime() && (
          <span>Editado: {formatDate(prompt.updatedAt)}</span>
        )}
      </div>
    </div>
  );
}
