import { Permission } from "./permissions";

// types/roles.ts
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  permissionDetails?: Permission[];
  isActive: boolean;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
  permissions: string[];
  isActive?: boolean;
  isSystem?: boolean;
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  permissions?: string[];
  isActive?: boolean;
}

export interface RoleFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  isSystem?: boolean;
  includePermissions?: boolean;
  sortBy?: "name" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

export interface RolesResponse {
  data: Role[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface RoleStats {
  total: number;
  active: number;
  inactive: number;
  system: number;
  custom: number;
}

// Common status options
export const ROLE_STATUS_OPTIONS = [
  { value: true, label: "Activo" },
  { value: false, label: "Inactivo" },
] as const;

export const ROLE_TYPE_OPTIONS = [
  { value: false, label: "Personalizado" },
  { value: true, label: "Sistema" },
] as const;

export const SORT_BY_OPTIONS = [
  { value: "name", label: "Nombre" },
  { value: "createdAt", label: "Fecha de creación" },
  { value: "updatedAt", label: "Última actualización" },
] as const;

export const SORT_ORDER_OPTIONS = [
  { value: "asc", label: "Ascendente" },
  { value: "desc", label: "Descendente" },
] as const;
