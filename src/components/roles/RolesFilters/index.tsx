/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import type { RoleFilters } from "@/types/roles";
import {
  ROLE_STATUS_OPTIONS,
  ROLE_TYPE_OPTIONS,
  SORT_BY_OPTIONS,
  SORT_ORDER_OPTIONS,
} from "@/types/roles";

interface RolesFiltersProps {
  filters: RoleFilters;
  onFiltersChange: (filters: Partial<RoleFilters>) => void;
  loading?: boolean;
}

export function RolesFilters({
  filters,
  onFiltersChange,
  loading = false,
}: RolesFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ search: e.target.value || undefined });
  };

  const handleFilterChange = (key: keyof RoleFilters, value: any) => {
    onFiltersChange({ [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: undefined,
      isActive: undefined,
      isSystem: undefined,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.isActive !== undefined ||
    filters.isSystem !== undefined ||
    filters.sortBy !== "createdAt" ||
    filters.sortOrder !== "desc";

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
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
            type="text"
            placeholder="Buscar roles..."
            value={filters.search || ""}
            onChange={handleSearchChange}
            disabled={loading}
            className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:bg-gray-50 disabled:text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-brand-400 dark:focus:ring-brand-400 dark:disabled:bg-gray-700"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Filters Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
              hasActiveFilters
                ? "border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-800 dark:bg-brand-500/10 dark:text-brand-300"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
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
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
              />
            </svg>
            Filtros
            {hasActiveFilters && (
              <span className="rounded-full bg-brand-500 px-1.5 py-0.5 text-xs font-semibold text-white">
                {
                  [
                    filters.search,
                    filters.isActive !== undefined,
                    filters.isSystem !== undefined,
                    filters.sortBy !== "createdAt",
                    filters.sortOrder !== "desc",
                  ].filter(Boolean).length
                }
              </span>
            )}
            <svg
              className={`h-4 w-4 transition-transform ${
                isExpanded ? "rotate-180" : ""
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
          </button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              disabled={loading}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Estado
              </label>
              <select
                value={
                  filters.isActive !== undefined ? String(filters.isActive) : ""
                }
                onChange={(e) =>
                  handleFilterChange(
                    "isActive",
                    e.target.value === ""
                      ? undefined
                      : e.target.value === "true"
                  )
                }
                disabled={loading}
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:bg-gray-50 disabled:text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-brand-400 dark:focus:ring-brand-400 dark:disabled:bg-gray-600"
              >
                <option value="">Todos los estados</option>
                {ROLE_STATUS_OPTIONS.map((option) => (
                  <option
                    key={String(option.value)}
                    value={String(option.value)}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo
              </label>
              <select
                value={
                  filters.isSystem !== undefined ? String(filters.isSystem) : ""
                }
                onChange={(e) =>
                  handleFilterChange(
                    "isSystem",
                    e.target.value === ""
                      ? undefined
                      : e.target.value === "true"
                  )
                }
                disabled={loading}
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:bg-gray-50 disabled:text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-brand-400 dark:focus:ring-brand-400 dark:disabled:bg-gray-600"
              >
                <option value="">Todos los tipos</option>
                {ROLE_TYPE_OPTIONS.map((option) => (
                  <option
                    key={String(option.value)}
                    value={String(option.value)}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ordenar por
              </label>
              <select
                value={filters.sortBy || "createdAt"}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                disabled={loading}
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:bg-gray-50 disabled:text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-brand-400 dark:focus:ring-brand-400 dark:disabled:bg-gray-600"
              >
                {SORT_BY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Orden
              </label>
              <select
                value={filters.sortOrder || "desc"}
                onChange={(e) =>
                  handleFilterChange("sortOrder", e.target.value)
                }
                disabled={loading}
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:bg-gray-50 disabled:text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-brand-400 dark:focus:ring-brand-400 dark:disabled:bg-gray-600"
              >
                {SORT_ORDER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Filtros activos:
                </span>

                {filters.search && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-2 py-1 text-xs font-medium text-brand-800 dark:bg-brand-500/20 dark:text-brand-300">
                    Búsqueda: &quot;{filters.search}&quot;
                    <button
                      onClick={() => handleFilterChange("search", undefined)}
                      className="hover:bg-brand-200 rounded-full p-0.5 dark:hover:bg-brand-400/20"
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
                )}

                {filters.isActive !== undefined && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-2 py-1 text-xs font-medium text-brand-800 dark:bg-brand-500/20 dark:text-brand-300">
                    Estado: {filters.isActive ? "Activo" : "Inactivo"}
                    <button
                      onClick={() => handleFilterChange("isActive", undefined)}
                      className="hover:bg-brand-200 rounded-full p-0.5 dark:hover:bg-brand-400/20"
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
                )}

                {filters.isSystem !== undefined && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-2 py-1 text-xs font-medium text-brand-800 dark:bg-brand-500/20 dark:text-brand-300">
                    Tipo: {filters.isSystem ? "Sistema" : "Personalizado"}
                    <button
                      onClick={() => handleFilterChange("isSystem", undefined)}
                      className="hover:bg-brand-200 rounded-full p-0.5 dark:hover:bg-brand-400/20"
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
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
