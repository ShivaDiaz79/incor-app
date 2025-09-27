// components/users/UserConfirmModal.tsx
"use client";

import { useEffect } from "react";
import Button from "@/components/ui/button/Button";
import type { User } from "@/types/users";

interface UserConfirmModalProps {
  isOpen: boolean;
  user: User | null;
  action: "activate" | "deactivate";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function UserConfirmModal({
  isOpen,
  user,
  action,
  loading = false,
  onConfirm,
  onCancel,
}: UserConfirmModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onCancel();
    }
  };

  if (!isOpen || !user) return null;

  const fullName = `${user.name} ${user.lastName}`;

  // Obtener nombres de roles dinámicamente
  const roleNames = user.roleDetails?.map((role) => role.name) || [];
  const roleLabels =
    roleNames.length > 0 ? roleNames.join(", ") : "Sin roles asignados";

  const isDeactivating = action === "deactivate";
  const title = isDeactivating ? "Desactivar Usuario" : "Activar Usuario";
  const message = isDeactivating
    ? `¿Estás seguro que deseas desactivar al usuario ${fullName}? Esta acción impedirá que pueda acceder al sistema.`
    : `¿Estás seguro que deseas activar al usuario ${fullName}? Podrá volver a acceder al sistema.`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
        {/* Header */}
        <div className="mb-4 flex items-center">
          <div
            className={`mr-4 flex h-12 w-12 items-center justify-center rounded-full ${
              isDeactivating
                ? "bg-error-100 dark:bg-error-500/20"
                : "bg-success-100 dark:bg-success-500/20"
            }`}
          >
            {isDeactivating ? (
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6 text-success-600 dark:text-success-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {roleLabels}
            </p>
          </div>
        </div>

        {/* Message */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
        </div>

        {/* User Info */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900">
              <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">
                {`${user.name.charAt(0)}${user.lastName.charAt(0)}`}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                {fullName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user.email} • {user.ci}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 ${
              isDeactivating
                ? "bg-error-600 hover:bg-error-700 focus:ring-error-500 dark:bg-error-600 dark:hover:bg-error-700"
                : "bg-success-600 hover:bg-success-700 focus:ring-success-500 dark:bg-success-600 dark:hover:bg-success-700"
            }`}
          >
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
                {isDeactivating ? "Desactivando..." : "Activando..."}
              </>
            ) : (
              <>{isDeactivating ? "Desactivar" : "Activar"}</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
