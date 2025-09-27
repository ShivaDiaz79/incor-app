"use client";

import { useState } from "react";
import Button from "@/components/ui/button/Button";
import type { UserFilters } from "@/types/users";

interface Role {
  id: string;
  name: string;
  description?: string;
}

interface UsersFiltersProps {
  filters: UserFilters;
  onFiltersChange: (filters: Partial<UserFilters>) => void;
  loading?: boolean;
  roles?: Role[]; // Lista de roles disponibles para filtrar
}

export function UsersFilters({
  filters,
  onFiltersChange,
  loading = false,
  roles = [],
}: UsersFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({ search: searchInput.trim() || undefined });
  };

  const handleClearFilters = () => {
    setSearchInput("");
    onFiltersChange({
      search: undefined,
      roleId: undefined,
      isActive: undefined,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  };

  const hasActiveFilters = Boolean(
    filters.search || filters.roleId || filters.isActive !== undefined
  );

  return (
    <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-3">
        <div className="flex-1">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-gray-400 dark:text-gray-500"
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
              placeholder="Buscar por nombre, email, teléfono, CI..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              disabled={loading}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-brand-400 dark:focus:ring-brand-400"
            />
          </div>
        </div>
        <Button type="submit" disabled={loading} className="whitespace-nowrap">
          {loading ? (
            <>
              <svg
                className="mr-2 h-4 w-4 animate-spin"
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
              Buscando...
            </>
          ) : (
            <>
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Buscar
            </>
          )}
        </Button>
      </form>

      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <svg
            className={`mr-2 h-4 w-4 transform transition-transform ${
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
          Filtros avanzados
        </button>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-sm text-error-600 hover:text-error-700 dark:text-error-400 dark:hover:text-error-300"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 gap-4 border-t border-gray-200 pt-4 dark:border-gray-700 sm:grid-cols-2 lg:grid-cols-4">
          {/* Role Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Rol
            </label>
            <select
              value={filters.roleId || ""}
              onChange={(e) =>
                onFiltersChange({
                  roleId: e.target.value || undefined,
                })
              }
              disabled={loading}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-brand-400 dark:focus:ring-brand-400"
            >
              <option value="">Todos los roles</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Estado
            </label>
            <select
              value={
                filters.isActive === undefined
                  ? ""
                  : filters.isActive
                  ? "active"
                  : "inactive"
              }
              onChange={(e) => {
                const value = e.target.value;
                onFiltersChange({
                  isActive:
                    value === "active"
                      ? true
                      : value === "inactive"
                      ? false
                      : undefined,
                });
              }}
              disabled={loading}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-brand-400 dark:focus:ring-brand-400"
            >
              <option value="">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Ordenar por
            </label>
            <select
              value={filters.sortBy || "createdAt"}
              onChange={(e) =>
                onFiltersChange({
                  sortBy: e.target.value as UserFilters["sortBy"],
                })
              }
              disabled={loading}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-brand-400 dark:focus:ring-brand-400"
            >
              <option value="createdAt">Fecha de registro</option>
              <option value="name">Nombre</option>
              <option value="email">Email</option>
              <option value="lastLoginAt">Último acceso</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Orden
            </label>
            <select
              value={filters.sortOrder || "desc"}
              onChange={(e) =>
                onFiltersChange({
                  sortOrder: e.target.value as UserFilters["sortOrder"],
                })
              }
              disabled={loading}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-brand-400 dark:focus:ring-brand-400"
            >
              <option value="desc">Descendente</option>
              <option value="asc">Ascendente</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
