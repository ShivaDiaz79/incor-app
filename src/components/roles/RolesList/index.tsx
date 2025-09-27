// components/roles/RolesList.tsx
"use client";

import { useState } from "react";
import { useRoles, useRoleActions } from "@/hooks/useRoles";
import { RoleCard } from "@/components/roles/RoleCard";
import { RolesFilters } from "@/components/roles/RolesFilters";
import { RoleModal } from "@/components/roles/RoleModal";
import { RoleDetailsModal } from "@/components/roles/RoleDetailsModal";
import { DeleteConfirmModal } from "@/components/roles/DeleteConfirmModal";
import Button from "@/components/ui/button/Button";
import type { Role, RoleFilters } from "@/types/roles";

export function RolesList() {
  const { roles, loading, error, pagination, filters, updateFilters, refresh } =
    useRoles({
      page: 1,
      limit: 20,
      sortBy: "createdAt",
      sortOrder: "desc",
      includePermissions: true,
    });

  const {
    activate,
    deactivate,
    deleteRole,
    loading: actionLoading,
  } = useRoleActions();

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [detailsRole, setDetailsRole] = useState<Role | null>(null);
  const [deleteModalRole, setDeleteModalRole] = useState<Role | null>(null);
  const [actioningRole, setActioningRole] = useState<string | null>(null);

  // Handlers
  const handleCreate = () => {
    setSelectedRole(null);
    setModalMode("create");
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setModalMode("edit");
  };

  const handleView = (role: Role) => {
    setDetailsRole(role);
  };

  const handleToggleActive = async (role: Role) => {
    try {
      setActioningRole(role.id);
      if (role.isActive) {
        await deactivate(role.id);
      } else {
        await activate(role.id);
      }
      refresh();
    } catch (error) {
      console.error("Error toggling role status:", error);
    } finally {
      setActioningRole(null);
    }
  };

  const handleDelete = (role: Role) => {
    setDeleteModalRole(role);
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalRole) return;

    try {
      setActioningRole(deleteModalRole.id);
      await deleteRole(deleteModalRole.id);
      setDeleteModalRole(null);
      refresh();
    } catch (error) {
      console.error("Error deleting role:", error);
    } finally {
      setActioningRole(null);
    }
  };

  const handleModalClose = () => {
    setSelectedRole(null);
    setModalMode(null);
  };

  const handleModalSuccess = () => {
    handleModalClose();
    refresh();
  };

  const handleDetailsClose = () => {
    setDetailsRole(null);
  };

  const handleFiltersChange = (newFilters: Partial<RoleFilters>) => {
    updateFilters({ ...newFilters, page: 1 });
  };

  const handlePageChange = (page: number) => {
    updateFilters({ page });
  };

  // Render table row for desktop/tablet
  const renderTableRow = (role: Role) => (
    <tr
      key={role.id}
      className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900">
            <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">
              {role.name.charAt(0).toUpperCase()}
            </span>
          </div>

          <div>
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {role.name}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {role.description || "Sin descripción"}
            </div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="text-sm text-gray-900 dark:text-gray-100">
          {role.permissions.length} permisos
        </div>
      </td>

      <td className="px-6 py-4">
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
            role.isSystem
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          {role.isSystem ? "Sistema" : "Personalizado"}
        </span>
      </td>

      <td className="px-6 py-4">
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
            role.isActive
              ? "bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200"
              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          {role.isActive ? "Activo" : "Inactivo"}
        </span>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleView(role)}
            className="rounded p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            title="Ver detalles"
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
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>

          {!role.isSystem && (
            <button
              onClick={() => handleEdit(role)}
              className="rounded p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              title="Editar"
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
            </button>
          )}

          {!role.isSystem && (
            <button
              onClick={() => handleToggleActive(role)}
              disabled={actioningRole === role.id}
              className={`rounded p-1 ${
                role.isActive
                  ? "text-error-400 hover:text-error-600"
                  : "text-success-400 hover:text-success-600"
              } disabled:opacity-50`}
              title={role.isActive ? "Desactivar" : "Activar"}
            >
              {actioningRole === role.id ? (
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
              ) : role.isActive ? (
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
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                  />
                </svg>
              ) : (
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
              )}
            </button>
          )}

          {!role.isSystem && (
            <button
              onClick={() => handleDelete(role)}
              disabled={actioningRole === role.id}
              className="rounded p-1 text-error-400 hover:text-error-600 disabled:opacity-50"
              title="Eliminar"
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
            </button>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 sm:text-3xl">
            Roles y Permisos
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Gestiona los roles y permisos del sistema
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
          Crear Rol
        </Button>
      </div>

      {/* Filters */}
      <RolesFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        loading={loading}
      />

      {/* Stats Summary */}
      {pagination && (
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {pagination.total}
              </span>{" "}
              roles
            </span>
            <span>•</span>
            <span>
              Página{" "}
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {pagination.currentPage}
              </span>{" "}
              de{" "}
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {pagination.totalPages}
              </span>
            </span>
            {filters.search && (
              <>
                <span>•</span>
                <span>
                  Filtrando por:{" "}
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    &quot;{filters.search}&quot;
                  </span>
                </span>
              </>
            )}
          </div>
        </div>
      )}

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
                Error al cargar los roles
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
        <>
          {/* Mobile Loading - Cards */}
          <div className="block md:hidden">
            <div className="grid gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="mb-4 flex items-start gap-3">
                    <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                    <div className="flex-1">
                      <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
                      <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
                    </div>
                    <div className="h-8 w-8 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                  <div className="mb-3 flex gap-2">
                    <div className="h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                    <div className="h-5 w-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
                    <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop/Tablet Loading - Table */}
          <div className="hidden md:block">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Permisos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                          <div className="flex-1">
                            <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
                            <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <div className="h-6 w-6 rounded bg-gray-200 dark:bg-gray-700"></div>
                          <div className="h-6 w-6 rounded bg-gray-200 dark:bg-gray-700"></div>
                          <div className="h-6 w-6 rounded bg-gray-200 dark:bg-gray-700"></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Empty State */}
      {!loading && !error && roles.length === 0 && (
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
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            No hay roles
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {filters.search || filters.isActive !== undefined
              ? "No se encontraron roles que coincidan con los filtros."
              : "Comienza creando tu primer rol personalizado."}
          </p>
          {!filters.search && filters.isActive === undefined && (
            <Button onClick={handleCreate} className="mt-4">
              Crear Primer Rol
            </Button>
          )}
        </div>
      )}

      {/* Content - Responsive */}
      {!loading && !error && roles.length > 0 && (
        <>
          {/* Mobile View - Cards */}
          <div className="block md:hidden">
            <div className="grid gap-6">
              {roles.map((role: Role) => (
                <RoleCard
                  key={role.id}
                  role={role}
                  onView={handleView}
                  onEdit={handleEdit}
                  onToggleActive={handleToggleActive}
                  onDelete={handleDelete}
                  loading={actioningRole === role.id}
                />
              ))}
            </div>
          </div>

          {/* Desktop/Tablet View - Table */}
          <div className="hidden md:block">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Permisos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                  {roles.map(renderTableRow)}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Mostrando{" "}
                {Math.min(
                  (pagination.currentPage - 1) * pagination.limit + 1,
                  pagination.total
                )}{" "}
                -{" "}
                {Math.min(
                  pagination.currentPage * pagination.limit,
                  pagination.total
                )}{" "}
                de {pagination.total} roles
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

                {/* Page Numbers */}
                <div className="hidden items-center gap-1 sm:flex">
                  {Array.from({
                    length: Math.min(5, pagination.totalPages),
                  }).map((_, i) => {
                    const pageNum = Math.max(1, pagination.currentPage - 2) + i;
                    if (pageNum > pagination.totalPages) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        disabled={loading}
                        className={`h-10 w-10 rounded-lg text-sm font-medium transition-colors ${
                          pageNum === pagination.currentPage
                            ? "bg-brand-500 text-white"
                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

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
        <RoleModal
          isOpen={!!modalMode}
          mode={modalMode}
          role={selectedRole}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}

      {detailsRole && (
        <RoleDetailsModal
          isOpen={!!detailsRole}
          role={detailsRole}
          onClose={handleDetailsClose}
          onEdit={() => {
            handleDetailsClose();
            handleEdit(detailsRole);
          }}
        />
      )}

      {deleteModalRole && (
        <DeleteConfirmModal
          isOpen={!!deleteModalRole}
          title="Eliminar rol"
          message={`¿Estás seguro de que deseas eliminar el rol "${deleteModalRole.name}"? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteModalRole(null)}
          loading={actioningRole === deleteModalRole.id}
          variant="danger"
        />
      )}
    </div>
  );
}
