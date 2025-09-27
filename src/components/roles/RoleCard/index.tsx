// components/roles/RoleCard.tsx
"use client";

import type { Role } from "@/types/roles";

interface RoleCardProps {
  role: Role;
  onView: (role: Role) => void;
  onEdit: (role: Role) => void;
  onToggleActive: (role: Role) => void;
  onDelete: (role: Role) => void;
  loading?: boolean;
}

export function RoleCard({
  role,
  onView,
  onEdit,
  onToggleActive,
  onDelete,
  loading = false,
}: RoleCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900">
            <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">
              {role.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {role.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {role.description || "Sin descripción"}
            </p>
          </div>
        </div>

        <button
          onClick={() => onView(role)}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          title="Ver detalles"
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
      </div>

      {/* Status badges */}
      <div className="mb-4 flex flex-wrap gap-2">
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
            role.isSystem
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          {role.isSystem ? "Sistema" : "Personalizado"}
        </span>

        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
            role.isActive
              ? "bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200"
              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          {role.isActive ? "Activo" : "Inactivo"}
        </span>

        <span className="inline-flex rounded-full bg-brand-100 px-2 py-1 text-xs font-semibold text-brand-800 dark:bg-brand-900 dark:text-brand-200">
          {role.permissions.length} permisos
        </span>
      </div>

      {/* Permissions preview */}
      {role.permissionDetails && role.permissionDetails.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Permisos principales:
          </p>
          <div className="flex flex-wrap gap-1">
            {role.permissionDetails.slice(0, 3).map((permission) => (
              <span
                key={permission.id}
                className="inline-flex rounded px-2 py-1 text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              >
                {permission.resource}:{permission.action}
              </span>
            ))}
            {role.permissionDetails.length > 3 && (
              <span className="inline-flex rounded px-2 py-1 text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                +{role.permissionDetails.length - 3} más
              </span>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {!role.isSystem && (
          <button
            onClick={() => onEdit(role)}
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Editar
          </button>
        )}

        {!role.isSystem && (
          <button
            onClick={() => onToggleActive(role)}
            disabled={loading}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium disabled:opacity-50 ${
              role.isActive
                ? "border border-error-200 text-error-700 hover:bg-error-50 dark:border-error-800 dark:text-error-300 dark:hover:bg-error-500/10"
                : "border border-success-200 text-success-700 hover:bg-success-50 dark:border-success-800 dark:text-success-300 dark:hover:bg-success-500/10"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
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
                {role.isActive ? "Desactivando..." : "Activando..."}
              </div>
            ) : role.isActive ? (
              "Desactivar"
            ) : (
              "Activar"
            )}
          </button>
        )}

        {!role.isSystem && (
          <button
            onClick={() => onDelete(role)}
            disabled={loading}
            className="rounded-lg border border-error-200 px-3 py-2 text-sm font-medium text-error-700 hover:bg-error-50 disabled:opacity-50 dark:border-error-800 dark:text-error-300 dark:hover:bg-error-500/10"
            title="Eliminar rol"
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

      {/* Creation date */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Creado el{" "}
          {role.createdAt.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}
