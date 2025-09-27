// components/roles/RoleModal.tsx
"use client";

import { useState, useEffect } from "react";
import { useRoleActions } from "@/hooks/useRoles";
import { usePermissionsByResource } from "@/hooks/usePermissions";
import Button from "@/components/ui/button/Button";
import Modal from "@/components/ui/modal";
import type { Role, CreateRoleRequest, UpdateRoleRequest } from "@/types/roles";
import type { Permission } from "@/types/permissions";

interface RoleModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  role?: Role | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function RoleModal({
  isOpen,
  mode,
  role,
  onClose,
  onSuccess,
}: RoleModalProps) {
  const { create, update, loading, error, clearError } = useRoleActions();
  const { permissionsArray, loading: permissionsLoading } =
    usePermissionsByResource();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [expandedResources, setExpandedResources] = useState<Set<string>>(
    new Set()
  );

  // Initialize form data
  useEffect(() => {
    if (mode === "edit" && role) {
      setFormData({
        name: role.name,
        description: role.description || "",
        permissions: role.permissions,
        isActive: role.isActive,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        permissions: [],
        isActive: true,
      });
    }
    setErrors({});
    clearError();
  }, [mode, role, clearError]);

  // Auto-expand resources that have selected permissions
  useEffect(() => {
    if (formData.permissions.length > 0 && permissionsArray.length > 0) {
      const resourcesToExpand = new Set<string>();

      permissionsArray.forEach(({ resource, permissions }) => {
        const hasSelectedPermissions = permissions.some((p) =>
          formData.permissions.includes(p.id)
        );
        if (hasSelectedPermissions) {
          resourcesToExpand.add(resource);
        }
      });

      setExpandedResources(resourcesToExpand);
    }
  }, [formData.permissions, permissionsArray]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres";
    }

    if (formData.permissions.length === 0) {
      newErrors.permissions = "Debe seleccionar al menos un permiso";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const roleData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        permissions: formData.permissions,
        isActive: formData.isActive,
      };

      if (mode === "create") {
        await create(roleData as CreateRoleRequest);
      } else if (role) {
        await update(role.id, roleData as UpdateRoleRequest);
      }

      onSuccess();
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handlePermissionToggle = (permissionId: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((id) => id !== permissionId)
        : [...prev.permissions, permissionId],
    }));
  };

  const handleResourceToggle = (resource: string) => {
    setExpandedResources((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(resource)) {
        newSet.delete(resource);
      } else {
        newSet.add(resource);
      }
      return newSet;
    });
  };

  const handleSelectAllResource = (resourcePermissions: Permission[]) => {
    const resourcePermissionIds = resourcePermissions.map((p) => p.id);
    const allSelected = resourcePermissionIds.every((id) =>
      formData.permissions.includes(id)
    );

    setFormData((prev) => ({
      ...prev,
      permissions: allSelected
        ? prev.permissions.filter((id) => !resourcePermissionIds.includes(id))
        : [...new Set([...prev.permissions, ...resourcePermissionIds])],
    }));
  };

  const getResourceSelectionState = (resourcePermissions: Permission[]) => {
    const selectedCount = resourcePermissions.filter((p) =>
      formData.permissions.includes(p.id)
    ).length;

    if (selectedCount === 0) return "none";
    if (selectedCount === resourcePermissions.length) return "all";
    return "partial";
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "create" ? "Crear Rol" : "Editar Rol"}
      maxWidth="4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Información Básica
            </h3>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre <span className="text-error-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                disabled={loading || (mode === "edit" && role?.isSystem)}
                className={`block w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 disabled:bg-gray-50 disabled:text-gray-500 dark:disabled:bg-gray-700 ${
                  errors.name
                    ? "border-error-300 focus:border-error-500 focus:ring-error-500"
                    : "border-gray-300 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-brand-400 dark:focus:ring-brand-400"
                }`}
                placeholder="Ej: Médico General"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                disabled={loading}
                rows={3}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:bg-gray-50 disabled:text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-brand-400 dark:focus:ring-brand-400 dark:disabled:bg-gray-700"
                placeholder="Descripción del rol y sus responsabilidades..."
              />
            </div>

            {/* Status */}
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }))
                  }
                  disabled={loading}
                  className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Rol activo
                </span>
              </label>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Los roles inactivos no pueden ser asignados a usuarios
              </p>
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Permisos <span className="text-error-500">*</span>
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Selecciona los permisos que tendrá este rol
              </p>
            </div>

            {errors.permissions && (
              <div className="rounded-lg border border-error-200 bg-error-50 p-3 dark:border-error-800 dark:bg-error-500/10">
                <p className="text-sm text-error-600 dark:text-error-400">
                  {errors.permissions}
                </p>
              </div>
            )}

            {permissionsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-10 w-full rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="max-h-96 space-y-2 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                {permissionsArray.map(({ resource, permissions }) => {
                  const isExpanded = expandedResources.has(resource);
                  const selectionState = getResourceSelectionState(permissions);

                  return (
                    <div
                      key={resource}
                      className="rounded-lg border border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700"
                    >
                      {/* Resource Header */}
                      <div
                        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600"
                        onClick={() => handleResourceToggle(resource)}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectAllResource(permissions);
                            }}
                            className="relative"
                          >
                            <input
                              type="checkbox"
                              checked={selectionState === "all"}
                              ref={(el) => {
                                if (el)
                                  el.indeterminate =
                                    selectionState === "partial";
                              }}
                              onChange={() => {}} // Controlled by button click
                              className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-500 dark:bg-gray-600"
                            />
                          </button>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                              {resource.replace(/([A-Z])/g, " $1").trim()}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {permissions.length} permisos disponibles
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {selectionState !== "none" && (
                            <span className="rounded-full bg-brand-100 px-2 py-1 text-xs font-medium text-brand-800 dark:bg-brand-500/20 dark:text-brand-300">
                              {
                                permissions.filter((p) =>
                                  formData.permissions.includes(p.id)
                                ).length
                              }{" "}
                              seleccionados
                            </span>
                          )}
                          <svg
                            className={`h-4 w-4 text-gray-500 transition-transform ${
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
                        </div>
                      </div>

                      {/* Resource Permissions */}
                      {isExpanded && (
                        <div className="border-t border-gray-200 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-600">
                          <div className="grid gap-2 sm:grid-cols-2">
                            {permissions.map((permission) => (
                              <label
                                key={permission.id}
                                className="flex items-start gap-2 rounded p-2 hover:bg-white dark:hover:bg-gray-700"
                              >
                                <input
                                  type="checkbox"
                                  checked={formData.permissions.includes(
                                    permission.id
                                  )}
                                  onChange={() =>
                                    handlePermissionToggle(permission.id)
                                  }
                                  disabled={loading}
                                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 disabled:opacity-50 dark:border-gray-500 dark:bg-gray-600"
                                />
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {permission.action}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {permission.description}
                                  </p>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

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
                  Error al {mode === "create" ? "crear" : "actualizar"} el rol
                </h3>
                <p className="mt-1 text-sm text-error-700 dark:text-error-300">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" loading={loading} disabled={permissionsLoading}>
            {mode === "create" ? "Crear Rol" : "Actualizar Rol"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
