// hooks/usePermissions.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useMemo } from "react";
import type {
  PermissionFilters,
  PermissionsResponse,
  PermissionsByResource,
} from "@/types/permissions";

// API Service Functions for Permissions
const permissionsAPI = {
  async getAll(filters?: PermissionFilters): Promise<PermissionsResponse> {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.resource) params.append("resource", filters.resource);
    if (filters?.action) params.append("action", filters.action);
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.limit) params.append("limit", String(filters.limit));

    const url = `/api/permissions${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const responseJs = await response.json();

    responseJs.data.data = responseJs.data.data.map((permission: any) => ({
      ...permission,
      createdAt: new Date(permission.createdAt),
      updatedAt: new Date(permission.updatedAt),
    }));

    return responseJs.data;
  },

  async getByResource(): Promise<PermissionsByResource> {
    const response = await fetch("/api/permissions/by-resource");

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = (await response.json()).data;

    // Transform dates in the grouped permissions
    const transformed: PermissionsByResource = {};
    for (const [resource, permissions] of Object.entries(data)) {
      transformed[resource] = (permissions as any[]).map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
      }));
    }

    return transformed;
  },
};

// Hook para listar permisos
export function usePermissions(initialFilters?: PermissionFilters) {
  const [data, setData] = useState<PermissionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PermissionFilters>(
    initialFilters || {
      page: 1,
      limit: 1000, // Get all permissions for role assignment
    }
  );

  const fetchPermissions = useCallback(
    async (newFilters?: PermissionFilters) => {
      try {
        setLoading(true);
        setError(null);
        const response = await permissionsAPI.getAll(newFilters || filters);
        setData(response);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar permisos"
        );
        setData(null);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  const updateFilters = useCallback(
    (newFilters: Partial<PermissionFilters>) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);
      fetchPermissions(updatedFilters);
    },
    [filters, fetchPermissions]
  );

  useEffect(() => {
    fetchPermissions();
  }, []);

  const refresh = useCallback(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  return {
    permissions: data?.data || [],
    loading,
    error,
    filters,
    updateFilters,
    refresh,
  };
}

// Hook para permisos agrupados por recurso
export function usePermissionsByResource() {
  const [data, setData] = useState<PermissionsByResource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPermissionsByResource = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await permissionsAPI.getByResource();
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar permisos");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPermissionsByResource();
  }, [fetchPermissionsByResource]);

  const refresh = useCallback(() => {
    fetchPermissionsByResource();
  }, [fetchPermissionsByResource]);

  // Convert to array format for easier use in components
  const permissionsArray = useMemo(() => {
    if (!data) return [];

    return Object.entries(data).map(([resource, permissions]) => ({
      resource,
      permissions,
    }));
  }, [data]);

  return {
    permissionsByResource: data,
    permissionsArray,
    loading,
    error,
    refresh,
  };
}
