// hooks/useRoles.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useMemo } from "react";
import type {
  Role,
  CreateRoleRequest,
  UpdateRoleRequest,
  RoleFilters,
  RolesResponse,
  RoleStats,
} from "@/types/roles";

// API Service Functions for Roles
const rolesAPI = {
  async getAll(filters?: RoleFilters): Promise<RolesResponse> {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.isActive !== undefined)
      params.append("isActive", String(filters.isActive));
    if (filters?.isSystem !== undefined)
      params.append("isSystem", String(filters.isSystem));
    if (filters?.includePermissions !== undefined)
      params.append("includePermissions", String(filters.includePermissions));
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.limit) params.append("limit", String(filters.limit));

    const url = `/api/roles${params.toString() ? `?${params.toString()}` : ""}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const responseJs = await response.json();

    responseJs.data.data = responseJs.data.data.map((role: any) => ({
      ...role,
      createdAt: new Date(role.createdAt),
      updatedAt: new Date(role.updatedAt),
      permissionDetails: role.permissionDetails?.map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
      })),
    }));

    return responseJs.data;
  },

  async getById(id: string, includePermissions = false): Promise<Role> {
    const params = new URLSearchParams();
    if (includePermissions) params.append("includePermissions", "true");

    const url = `/api/roles/${id}${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const role = (await response.json()).data;

    return {
      ...role,
      createdAt: new Date(role.createdAt),
      updatedAt: new Date(role.updatedAt),
      permissionDetails: role.permissionDetails?.map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
      })),
    };
  },

  async create(data: CreateRoleRequest): Promise<Role> {
    const response = await fetch("/api/roles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const role = await response.json();

    return {
      ...role,
      createdAt: new Date(role.createdAt),
      updatedAt: new Date(role.updatedAt),
    };
  },

  async update(id: string, data: UpdateRoleRequest): Promise<Role> {
    const response = await fetch(`/api/roles/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const role = await response.json();

    return {
      ...role,
      createdAt: new Date(role.createdAt),
      updatedAt: new Date(role.updatedAt),
    };
  },

  async activate(id: string): Promise<Role> {
    const response = await fetch(`/api/roles/${id}/activate`, {
      method: "PATCH",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const role = await response.json();

    return {
      ...role,
      createdAt: new Date(role.createdAt),
      updatedAt: new Date(role.updatedAt),
    };
  },

  async deactivate(id: string): Promise<Role> {
    const response = await fetch(`/api/roles/${id}/deactivate`, {
      method: "PATCH",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const role = await response.json();

    return {
      ...role,
      createdAt: new Date(role.createdAt),
      updatedAt: new Date(role.updatedAt),
    };
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`/api/roles/${id}`, {
      method: "DELETE",
    });

    if (!response.ok && response.status !== 204) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }
  },

  async getStats(): Promise<RoleStats> {
    const response = await fetch("/api/roles/stats");

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  },
};

// Hook para listar roles con paginación y filtros
export function useRoles(initialFilters?: RoleFilters) {
  const [data, setData] = useState<RolesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<RoleFilters>(
    initialFilters || {
      page: 1,
      limit: 20,
      sortBy: "createdAt",
      sortOrder: "desc",
    }
  );

  const fetchRoles = useCallback(
    async (newFilters?: RoleFilters) => {
      try {
        setLoading(true);
        setError(null);
        const response = await rolesAPI.getAll(newFilters || filters);
        setData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar roles");
        setData(null);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  const updateFilters = useCallback(
    (newFilters: Partial<RoleFilters>) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);
      fetchRoles(updatedFilters);
    },
    [filters, fetchRoles]
  );

  const refresh = useCallback(() => {
    fetchRoles();
  }, [fetchRoles]);

  useEffect(() => {
    fetchRoles();
  }, []);

  const pagination = useMemo(() => {
    if (!data) return null;

    return {
      currentPage: data.page,
      totalPages: data.totalPages,
      hasNextPage: data.hasNextPage,
      hasPrevPage: data.hasPrevPage,
      total: data.total,
      limit: data.limit,
    };
  }, [data]);

  return {
    roles: data?.data || [],
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    refresh,
  };
}

// Hook para un rol individual
export function useRole(id?: string, includePermissions = false) {
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRole = useCallback(
    async (roleId: string) => {
      try {
        setLoading(true);
        setError(null);
        const data = await rolesAPI.getById(roleId, includePermissions);
        setRole(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar el rol");
        setRole(null);
      } finally {
        setLoading(false);
      }
    },
    [includePermissions]
  );

  useEffect(() => {
    if (id) {
      fetchRole(id);
    } else {
      setRole(null);
      setLoading(false);
    }
  }, [id, fetchRole]);

  const refresh = useCallback(() => {
    if (id) {
      fetchRole(id);
    }
  }, [id, fetchRole]);

  return {
    role,
    loading,
    error,
    refresh,
  };
}

// Hook para acciones CRUD de roles
export function useRoleActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (data: CreateRoleRequest): Promise<Role> => {
    try {
      setLoading(true);
      setError(null);
      const result = await rolesAPI.create(data);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al crear rol";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(
    async (id: string, data: UpdateRoleRequest): Promise<Role> => {
      try {
        setLoading(true);
        setError(null);
        const result = await rolesAPI.update(id, data);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al actualizar rol";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const activate = useCallback(async (id: string): Promise<Role> => {
    try {
      setLoading(true);
      setError(null);
      const result = await rolesAPI.activate(id);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al activar rol";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const deactivate = useCallback(async (id: string): Promise<Role> => {
    try {
      setLoading(true);
      setError(null);
      const result = await rolesAPI.deactivate(id);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al desactivar rol";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteRole = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await rolesAPI.delete(id);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al eliminar rol";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    create,
    update,
    activate,
    deactivate,
    deleteRole,
    loading,
    error,
    clearError,
  };
}

// Hook para estadísticas de roles
export function useRoleStats() {
  const [stats, setStats] = useState<RoleStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await rolesAPI.getStats();
      setStats(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar estadísticas"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const refresh = useCallback(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refresh,
  };
}
