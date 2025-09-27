// components/users/UserDetailsModal.tsx
"use client";

import Button from "@/components/ui/button/Button";
import Modal from "@/components/ui/modal";
import type { User } from "@/types/users";

interface UserDetailsModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onEdit: () => void;
  onChangePassword: () => void;
}

export function UserDetailsModal({
  isOpen,
  user,
  onClose,
  onEdit,
  onChangePassword,
}: UserDetailsModalProps) {
  if (!isOpen || !user) return null;

  const fullName = `${user.name} ${user.lastName}`;
  const initials = `${user.name.charAt(0)}${user.lastName.charAt(0)}`;

  // Obtener nombres de roles dinámicamente
  const roleNames = user.roleDetails?.map((role) => role.name) || [];
  const roleLabels =
    roleNames.length > 0 ? roleNames.join(", ") : "Sin roles asignados";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles del Usuario"
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900">
              <span className="text-lg font-semibold text-brand-600 dark:text-brand-400">
                {initials}
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {fullName}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{user.email}</p>

              {/* Status and Roles Badges */}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                    user.isActive
                      ? "bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {user.isActive ? "Activo" : "Inactivo"}
                </span>

                {/* Dynamic Role Badges */}
                {user.roleDetails?.map((role) => (
                  <span
                    key={role.id}
                    className="inline-flex rounded-full px-2 py-1 text-xs font-medium bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200"
                  >
                    {role.name}
                  </span>
                ))}

                {/* Fallback for roleIds without details */}
                {(!user.roleDetails || user.roleDetails.length === 0) &&
                  user.roleIds?.map((roleId) => (
                    <span
                      key={roleId}
                      className="inline-flex rounded-full px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    >
                      {roleId}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={onChangePassword} variant="outline" size="sm">
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
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z"
                />
              </svg>
              Cambiar Contraseña
            </Button>

            <Button onClick={onEdit} variant="outline" size="sm">
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
              Editar
            </Button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Personal Info */}
          <div className="lg:col-span-2">
            {/* Contact Information */}
            <div className="mb-8">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                Información Personal
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                    <svg
                      className="h-4 w-4 text-gray-600 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Email
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                    <svg
                      className="h-4 w-4 text-gray-600 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Teléfono
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                    <svg
                      className="h-4 w-4 text-gray-600 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Carnet de Identidad
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user.ci}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                    <svg
                      className="h-4 w-4 text-gray-600 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Nombre Completo
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {fullName}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Role & Access Information */}
            <div className="mb-8">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                Información de Acceso
              </h3>
              <div className="space-y-4">
                {/* Roles Details */}
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Roles en el Sistema
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {roleLabels}
                      </p>

                      {/* Individual Role Details */}
                      {user.roleDetails && user.roleDetails.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {user.roleDetails.map((role) => (
                            <div
                              key={role.id}
                              className="rounded-lg bg-white p-3 dark:bg-gray-700"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {role.name}
                                  </p>
                                  {role.description && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      {role.description}
                                    </p>
                                  )}
                                </div>
                                <span className="inline-flex rounded-full px-2 py-1 text-xs font-medium bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200">
                                  {role.permissions?.length || 0} permisos
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Account Status */}
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Estado de la Cuenta
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {user.isActive
                          ? "Cuenta activa, puede acceder al sistema"
                          : "Cuenta desactivada, sin acceso al sistema"}
                      </p>
                    </div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                        user.isActive
                          ? "bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200"
                          : "bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-200"
                      }`}
                    >
                      {user.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </div>

                {/* Firebase UID */}
                {user.firebaseUid && (
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Firebase UID
                    </p>
                    <p className="mt-1 text-xs font-mono text-gray-600 dark:text-gray-400 break-all">
                      {user.firebaseUid}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - System Info & Actions */}
          <div className="lg:col-span-1">
            {/* System Information */}
            <div className="mb-8">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                Información del Sistema
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    ID del Usuario
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 font-mono text-xs break-all">
                    {user.id}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Fecha de Registro
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Última Actualización
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {new Date(user.updatedAt).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {user.lastLoginAt && (
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      Último Acceso
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {new Date(user.lastLoginAt).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                Acciones Rápidas
              </h3>
              <div className="space-y-2">
                <Button
                  onClick={onEdit}
                  variant="outline"
                  className="w-full justify-start"
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Editar Información
                </Button>

                <Button
                  onClick={onChangePassword}
                  variant="outline"
                  className="w-full justify-start"
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
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z"
                    />
                  </svg>
                  Cambiar Contraseña
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <h4 className="mb-3 font-medium text-gray-900 dark:text-gray-100">
                Resumen
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Roles:
                  </span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {user.roleDetails?.length || user.roleIds?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Estado:
                  </span>
                  <span
                    className={
                      user.isActive
                        ? "text-success-600 dark:text-success-400"
                        : "text-error-600 dark:text-error-400"
                    }
                  >
                    {user.isActive ? "Activo" : "Inactivo"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Teléfono:
                  </span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {user.phone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">CI:</span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {user.ci}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          <Button onClick={onEdit}>
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
            Editar Usuario
          </Button>
        </div>
      </div>
    </Modal>
  );
}
