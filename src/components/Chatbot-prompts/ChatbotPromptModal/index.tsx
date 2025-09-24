"use client";

import { useState, useEffect } from "react";
import { useChatbotPromptActions } from "@/hooks/useChatbotPrompts";
import Button from "@/components/ui/button/Button";
import type {
  ChatbotPrompt,
  CreateChatbotPromptRequest,
  ChatbotPromptCategory,
} from "@/types/chatbot-prompts";

interface ChatbotPromptModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  prompt?: ChatbotPrompt | null;
  onClose: () => void;
  onSuccess: () => void;
}

const CATEGORY_OPTIONS = [
  { value: "general" as ChatbotPromptCategory, label: "General" },
  { value: "appointments" as ChatbotPromptCategory, label: "Citas" },
  { value: "support" as ChatbotPromptCategory, label: "Soporte" },
  { value: "emergency" as ChatbotPromptCategory, label: "Emergencia" },
];

interface FormData {
  name: string;
  description: string;
  systemPrompt: string;
  category: ChatbotPromptCategory;
  variables: string[];
  isActive: boolean;
}

const initialFormData: FormData = {
  name: "",
  description: "",
  systemPrompt: "",
  category: "general" as ChatbotPromptCategory,
  variables: [],
  isActive: true,
};

export function ChatbotPromptModal({
  isOpen,
  mode,
  prompt,
  onClose,
  onSuccess,
}: ChatbotPromptModalProps) {
  const { create, update, loading, error } = useChatbotPromptActions();

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [variableInput, setVariableInput] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Initialize form data
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && prompt) {
        setFormData({
          name: prompt.name,
          description: prompt.description,
          systemPrompt: prompt.systemPrompt,
          category: prompt.category,
          variables: [...prompt.variables],
          isActive: prompt.isActive,
        });
      } else {
        setFormData(initialFormData);
      }
      setVariableInput("");
      setFormErrors({});
    }
  }, [isOpen, mode, prompt]);

  // Form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "El nombre es requerido";
    }

    if (!formData.description.trim()) {
      errors.description = "La descripción es requerida";
    }

    if (!formData.systemPrompt.trim()) {
      errors.systemPrompt = "El prompt del sistema es requerido";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean | ChatbotPromptCategory
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle variable management
  const addVariable = () => {
    const variable = variableInput.trim();
    if (variable && !formData.variables.includes(variable)) {
      setFormData((prev) => ({
        ...prev,
        variables: [...prev.variables, variable],
      }));
      setVariableInput("");
    }
  };

  const removeVariable = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      variables: prev.variables.filter((_, i) => i !== index),
    }));
  };

  const handleVariableKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addVariable();
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (mode === "create") {
        const requestData: CreateChatbotPromptRequest = {
          ...formData,
          createdBy: "current-user-id", // TODO: Get from auth context
        };
        await create(requestData);
      } else if (mode === "edit" && prompt) {
        await update(prompt.id, formData);
      }

      onSuccess();
    } catch (err) {
      console.error("Error saving prompt:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {mode === "create" ? "Crear Nuevo Prompt" : "Editar Prompt"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                  <p className="text-sm text-error-700 dark:text-error-300">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Name and Category Row */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:bg-gray-800 dark:text-gray-200 ${
                  formErrors.name
                    ? "border-error-300 focus:border-error-500 dark:border-error-600"
                    : "border-gray-300 focus:border-brand-500 dark:border-gray-600 dark:focus:border-brand-400"
                }`}
                placeholder="Nombre del prompt"
                disabled={loading}
              />
              {formErrors.name && (
                <p className="mt-1 text-xs text-error-600 dark:text-error-400">
                  {formErrors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categoría *
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  handleInputChange(
                    "category",
                    e.target.value as ChatbotPromptCategory
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                disabled={loading}
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:bg-gray-800 dark:text-gray-200 ${
                formErrors.description
                  ? "border-error-300 focus:border-error-500 dark:border-error-600"
                  : "border-gray-300 focus:border-brand-500 dark:border-gray-600 dark:focus:border-brand-400"
              }`}
              placeholder="Descripción del prompt"
              disabled={loading}
            />
            {formErrors.description && (
              <p className="mt-1 text-xs text-error-600 dark:text-error-400">
                {formErrors.description}
              </p>
            )}
          </div>

          {/* System Prompt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Prompt del Sistema *
            </label>
            <textarea
              value={formData.systemPrompt}
              onChange={(e) =>
                handleInputChange("systemPrompt", e.target.value)
              }
              rows={6}
              className={`w-full rounded-lg border px-3 py-2 text-sm font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:bg-gray-800 dark:text-gray-200 ${
                formErrors.systemPrompt
                  ? "border-error-300 focus:border-error-500 dark:border-error-600"
                  : "border-gray-300 focus:border-brand-500 dark:border-gray-600 dark:focus:border-brand-400"
              }`}
              placeholder="Eres un asistente médico que ayuda a los pacientes..."
              disabled={loading}
            />
            {formErrors.systemPrompt && (
              <p className="mt-1 text-xs text-error-600 dark:text-error-400">
                {formErrors.systemPrompt}
              </p>
            )}
          </div>

          {/* Variables */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Variables
            </label>
            <div className="space-y-3">
              {/* Variable Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={variableInput}
                  onChange={(e) => setVariableInput(e.target.value)}
                  onKeyPress={handleVariableKeyPress}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                  placeholder="Nombre de la variable (ej: patientName)"
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addVariable}
                  disabled={!variableInput.trim() || loading}
                  className="shrink-0"
                >
                  Agregar
                </Button>
              </div>

              {/* Variables List */}
              {formData.variables.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.variables.map((variable, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-3 py-1 text-sm text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
                    >
                      {variable}
                      <button
                        type="button"
                        onClick={() => removeVariable(index)}
                        className="ml-1 rounded-full p-0.5 hover:bg-brand-200 dark:hover:bg-brand-500/20"
                        disabled={loading}
                      >
                        <svg
                          className="h-3 w-3"
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
                    </span>
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Las variables pueden ser utilizadas en el prompt del sistema
                usando {`{variableName}`}
              </p>
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleInputChange("isActive", e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800"
              disabled={loading}
            />
            <label
              htmlFor="isActive"
              className="ml-2 text-sm text-gray-700 dark:text-gray-300"
            >
              Prompt activo
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-6 dark:border-gray-800">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" loading={loading} disabled={loading}>
              {mode === "create" ? "Crear Prompt" : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
