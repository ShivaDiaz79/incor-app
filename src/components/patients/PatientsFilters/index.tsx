// components/patients/PatientsFilters.tsx
"use client";

import { useState, useRef } from "react";
import { usePatientFilterOptions } from "@/hooks/usePatients";
import type { PatientFilters } from "@/types/patients";

interface PatientsFiltersProps {
  filters: PatientFilters;
  onFiltersChange: (filters: Partial<PatientFilters>) => void;
  loading?: boolean;
}

const GENDER_OPTIONS = [
  { value: "", label: "Todos los géneros" },
  { value: "male", label: "Masculino" },
  { value: "female", label: "Femenino" },
  { value: "other", label: "Otro" },
];

const CIVIL_STATUS_OPTIONS = [
  { value: "", label: "Todos los estados civiles" },
  { value: "single", label: "Soltero/a" },
  { value: "married", label: "Casado/a" },
  { value: "divorced", label: "Divorciado/a" },
  { value: "widowed", label: "Viudo/a" },
  { value: "cohabiting", label: "Conviviente" },
];

const STATUS_OPTIONS = [
  { value: "", label: "Todos los estados" },
  { value: "true", label: "Activos" },
  { value: "false", label: "Inactivos" },
];

const SORT_OPTIONS = [
  { value: "createdAt", label: "Fecha de registro" },
  { value: "name", label: "Nombre" },
  { value: "lastName", label: "Apellido" },
  { value: "dateOfBirth", label: "Fecha de nacimiento" },
  { value: "city", label: "Ciudad" },
];

const SORT_ORDER_OPTIONS = [
  { value: "desc", label: "Descendente" },
  { value: "asc", label: "Ascendente" },
];

export function PatientsFilters({
  filters,
  onFiltersChange,
  loading = false,
}: PatientsFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { cities, states } = usePatientFilterOptions();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    const trimmedSearch = searchInput.trim();
    onFiltersChange({
      search: trimmedSearch || undefined,
      page: 1, // Reset to first page when searching
    });
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleFilterChange = (key: keyof PatientFilters, value: string) => {
    const parsedValue =
      value === ""
        ? undefined
        : key === "isActive"
        ? value === "true"
        : key === "minAge" ||
          key === "maxAge" ||
          key === "page" ||
          key === "limit"
        ? parseInt(value) || undefined
        : value;

    onFiltersChange({ [key]: parsedValue });
  };

  const clearFilters = () => {
    setSearchInput("");
    onFiltersChange({
      search: undefined,
      gender: undefined,
      civilStatus: undefined,
      city: undefined,
      state: undefined,
      isActive: undefined,
      minAge: undefined,
      maxAge: undefined,
      sortBy: "createdAt",
      sortOrder: "desc",
      page: 1,
    });
  };

  const clearSearch = () => {
    setSearchInput("");
    onFiltersChange({ search: undefined, page: 1 });
    searchInputRef.current?.focus();
  };

  const hasActiveFilters = Boolean(
    filters.search ||
      filters.gender ||
      filters.civilStatus ||
      filters.city ||
      filters.state ||
      filters.isActive !== undefined ||
      filters.minAge !== undefined ||
      filters.maxAge !== undefined
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
              placeholder="Buscar por nombre, CI, email, teléfono..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              disabled={loading}
              className="w-full rounded-l-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 dark:focus:border-brand-400 sm:rounded-r-none"
            />
            {searchInput && (
              <button
                onClick={clearSearch}
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
            value={filters.gender || ""}
            onChange={(e) => handleFilterChange("gender", e.target.value)}
            disabled={loading}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
          >
            {GENDER_OPTIONS.map((option) => (
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
      {filters.search && (
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
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
          <span>
            Buscando:{" "}
            <span className="font-medium text-gray-900 dark:text-gray-100">
              &quot;{filters.search}&quot;
            </span>
          </span>
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {/* Civil Status */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Estado Civil
              </label>
              <select
                value={filters.civilStatus || ""}
                onChange={(e) =>
                  handleFilterChange("civilStatus", e.target.value)
                }
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              >
                {CIVIL_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {cities && (
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                  Ciudad
                </label>
                <select
                  value={filters.city || ""}
                  onChange={(e) => handleFilterChange("city", e.target.value)}
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                >
                  <option value="">Todas las ciudades</option>
                  {cities?.map((city: string) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* State */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Departamento
              </label>
              <select
                value={filters.state || ""}
                onChange={(e) => handleFilterChange("state", e.target.value)}
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              >
                <option value="">Todos los departamentos</option>
                {states.map((state: string) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* Age Range 
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Edad Mínima
              </label>
              <input
                type="number"
                min="0"
                max="120"
                value={filters.minAge || ""}
                onChange={(e) => handleFilterChange("minAge", e.target.value)}
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400"
                placeholder="0"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Edad Máxima
              </label>
              <input
                type="number"
                min="0"
                max="120"
                value={filters.maxAge || ""}
                onChange={(e) => handleFilterChange("maxAge", e.target.value)}
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400"
                placeholder="120"
              />
            </div>
            */}

            {/* Sort By */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Ordenar por
              </label>
              <select
                value={filters.sortBy || "createdAt"}
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
                value={filters.limit || 20}
                onChange={(e) => handleFilterChange("limit", e.target.value)}
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
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
