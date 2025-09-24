"use client";

import { useState, useRef } from "react";
import type { ChatbotPromptFilters } from "@/types/chatbot-prompts";

interface ChatbotPromptsFiltersProps {
  filters: ChatbotPromptFilters;
  onFiltersChange: (filters: Partial<ChatbotPromptFilters>) => void;
  loading?: boolean;
}

const CATEGORY_OPTIONS = [
  { value: "", label: "Todas las categorías" },
  { value: "general", label: "General" },
  { value: "appointments", label: "Citas" },
  { value: "support", label: "Soporte" },
  { value: "emergency", label: "Emergencia" },
];

const STATUS_OPTIONS = [
  { value: "", label: "Todos los estados" },
  { value: "true", label: "Activos" },
  { value: "false", label: "Inactivos" },
];

const SORT_OPTIONS = [
  { value: "updatedAt", label: "Última actualización" },
  { value: "createdAt", label: "Fecha de creación" },
  { value: "name", label: "Nombre" },
  { value: "category", label: "Categoría" },
];

const SORT_ORDER_OPTIONS = [
  { value: "desc", label: "Descendente" },
  { value: "asc", label: "Ascendente" },
];

export function ChatbotPromptsFilters({
  filters,
  onFiltersChange,
  loading = false,
}: ChatbotPromptsFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const [createdByInput, setCreatedByInput] = useState(filters.createdBy || "");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    const trimmedSearch = searchInput.trim();
    const trimmedCreatedBy = createdByInput.trim();

    onFiltersChange({
      search: trimmedSearch || undefined,
      createdBy: trimmedCreatedBy || undefined,
      page: 1, // Reset to first page when searching
    });
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleFilterChange = (
    key: keyof ChatbotPromptFilters,
    value: string
  ) => {
    const parsedValue =
      value === ""
        ? undefined
        : key === "isActive"
        ? value === "true"
        : key === "page" || key === "limit"
        ? parseInt(value) || undefined
        : value;

    onFiltersChange({ [key]: parsedValue });
  };

  const clearFilters = () => {
    setSearchInput("");
    setCreatedByInput("");
    onFiltersChange({
      search: undefined,
      category: undefined,
      isActive: undefined,
      createdBy: undefined,
      sortBy: "updatedAt",
      sortOrder: "desc",
      page: 1,
    });
  };

  const clearSearch = () => {
    setSearchInput("");
    setCreatedByInput("");
    onFiltersChange({
      search: undefined,
      createdBy: undefined,
      page: 1,
    });
    searchInputRef.current?.focus();
  };

  const hasActiveFilters = Boolean(
    filters.search ||
      filters.category ||
      filters.isActive !== undefined ||
      filters.createdBy
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 sm:p-6">
      {/* Main Filters Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Search with Button */}
        <div className="relative flex flex-1 sm:max-w-md">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Buscar prompts..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              disabled={loading}
              className="w-full rounded-l-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 dark:focus:border-brand-400 sm:rounded-r-none"
            />
            {searchInput && (
              <button
                onClick={() => {
                  setSearchInput("");
                  searchInputRef.current?.focus();
                }}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title="Limpiar búsqueda"
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
            )}
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="rounded-r-lg border border-l-0 border-gray-300 bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50 dark:border-gray-600"
          >
            {loading ? (
              <svg
                className="h-4 w-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              "Buscar"
            )}
          </button>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-3">
          <select
            value={filters.category || ""}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            disabled={loading}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={
              filters.isActive === undefined ? "" : String(filters.isActive)
            }
            onChange={(e) => handleFilterChange("isActive", e.target.value)}
            disabled={loading}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Advanced Filters Toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <svg
            className={`h-4 w-4 transition-transform ${
              showAdvanced ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
          Avanzado
        </button>
      </div>

      {/* Search Status */}
      {(filters.search || filters.createdBy) && (
        <div className="mt-3 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <div className="flex flex-wrap items-center gap-4">
            {filters.search && (
              <span>
                Texto:{" "}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  &quot;{filters.search}&quot;
                </span>
              </span>
            )}

            {filters.createdBy && (
              <span>
                Creado por:{" "}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {filters.createdBy}
                </span>
              </span>
            )}
          </div>
          <button
            onClick={clearSearch}
            className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            title="Limpiar búsqueda"
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
      )}

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Creator Filter */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Creado por
              </label>
              <input
                type="text"
                placeholder="ID del usuario"
                value={createdByInput}
                onChange={(e) => setCreatedByInput(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400"
              />
            </div>

            {/* Sort By */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Ordenar por
              </label>
              <select
                value={filters.sortBy || "updatedAt"}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Orden
              </label>
              <select
                value={filters.sortOrder || "desc"}
                onChange={(e) =>
                  handleFilterChange("sortOrder", e.target.value)
                }
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              >
                {SORT_ORDER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Items per page */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Por página
              </label>
              <select
                value={filters.limit || 12}
                onChange={(e) => handleFilterChange("limit", e.target.value)}
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              >
                <option value={6}>6</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={48}>48</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={clearFilters}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
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
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
