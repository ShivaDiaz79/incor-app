// components/roles/RoleDetailsModal.tsx
"use client";

import { useRole } from "@/hooks/useRoles";
import Button from "@/components/ui/button/Button";
import Modal from "@/components/ui/modal";
import type { Role } from "@/types/roles";

interface RoleDetailsModalProps {
  isOpen: boolean;
  role: Role;
  onClose: () => void;
  onEdit: () => void;
}

export function RoleDetailsModal({
  isOpen,
  role,
  onClose,
  onEdit,
}: RoleDetailsModalProps) {
  const { role: detailedRole, loading } = useRole(role.id, true);

  const currentRole = detailedRole || role;

  // Group permissions by resource
  const groupedPermissions =
    currentRole.permissionDetails?.reduce((acc, permission) => {
      if (!acc[permission.resource]) {
        acc[permission.resource] = [];
      }
      acc[permission.resource].push(permission);
      return acc;
    }, {} as Record<string, typeof currentRole.permissionDetails>) || {};

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles del Rol"
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900">
              <span className="text-xl font-bold text-brand-600 dark:text-brand-400">
                {currentRole.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {currentRole.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {currentRole.description || "Sin descripción"}
              </p>
            </div>
          </div>

          {!currentRole.isSystem && (
            <Button onClick={onEdit} className="shrink-0">
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Editar Rol
            </Button>
          )}
        </div>

        {/* Status and Metadata */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Información General
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Estado
                </span>
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                    currentRole.isActive
                      ? "bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {currentRole.isActive ? "Activo" : "Inactivo"}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Tipo
                </span>
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                    currentRole.isSystem
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {currentRole.isSystem ? "Sistema" : "Personalizado"}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total de Permisos
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {currentRole.permissions.length}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Fecha de Creación
                </span>
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  {currentRole.createdAt.toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Última Actualización
                </span>
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  {currentRole.updatedAt.toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* System Role Warning */}
          {currentRole.isSystem && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-500/10">
              <div className="flex">
                <svg
                  className="h-5 w-5 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Rol del Sistema
                  </h3>
                  <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                    Este es un rol del sistema que no puede ser editado o
                    eliminado. Fue creado automáticamente durante la
                    inicialización del sistema.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Permissions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Permisos Asignados
          </h3>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-8 w-full rounded-lg bg-gray-200 dark:bg-gray-700 mb-2"></div>
                  <div className="ml-4 space-y-2">
                    <div className="h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
                    <div className="h-6 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : Object.keys(groupedPermissions).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(groupedPermissions).map(
                ([resource, permissions]) => (
                  <div
                    key={resource}
                    className="rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                        {resource.replace(/([A-Z])/g, " $1").trim()}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {permissions.length} permisos
                      </p>
                    </div>
                    <div className="p-4">
                      <div className="grid gap-3 sm:grid-cols-2">
                        {permissions.map((permission) => (
                          <div
                            key={permission.id}
                            className="flex items-start gap-3 rounded-lg bg-white p-3 dark:bg-gray-700"
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900">
                              <svg
                                className="h-4 w-4 text-brand-600 dark:text-brand-400"
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
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {permission.action}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {permission.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
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
              <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                Sin permisos detallados
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Los detalles de los permisos no están disponibles
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
