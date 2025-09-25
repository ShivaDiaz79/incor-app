/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback, useEffect } from "react";
import type {
  Floor,
  FloorFilters,
  FloorsPagination,
  CreateFloorRequest,
  UpdateFloorRequest,
} from "@/types/floors";
import { PaginatedResponse } from "@/types/doctor-schedules";

interface UseFloorsResult {
  floors: Floor[];
  loading: boolean;
  error: string | null;
  pagination: FloorsPagination | null;
  filters: FloorFilters;
  updateFilters: (filters: Partial<FloorFilters>) => void;
  refresh: () => Promise<void>;
}

export function useFloors(initialFilters: FloorFilters = {}): UseFloorsResult {
  const [floors, setFloors] = useState<Floor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<FloorsPagination | null>(null);
  const [filters, setFilters] = useState<FloorFilters>({
    page: 1,
    limit: 20,
    sortBy: "floorNumber",
    sortOrder: "asc",
    ...initialFilters,
  });

  const fetchFloors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const searchParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/floors?${searchParams}`);

      if (!response.ok) {
        throw new Error("Error al cargar los pisos");
      }

      const data: PaginatedResponse<Floor> = (await response.json()).data;

      setFloors(data.data);
      setPagination({
        total: data.total,
        currentPage: data.page,
        totalPages: data.totalPages,
        hasNextPage: data.hasNextPage,
        hasPrevPage: data.hasPrevPage,
        limit: data.limit,
      });
    } catch (err) {
      console.error("Error fetching floors:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const updateFilters = useCallback((newFilters: Partial<FloorFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const refresh = useCallback(() => fetchFloors(), [fetchFloors]);

  useEffect(() => {
    fetchFloors();
  }, [fetchFloors]);

  return {
    floors,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    refresh,
  };
}

// Hook para acciones de pisos
interface UseFloorActionsResult {
  create: (floor: CreateFloorRequest) => Promise<Floor>;
  update: (id: string, floor: UpdateFloorRequest) => Promise<Floor>;
  activate: (id: string) => Promise<Floor>;
  deactivate: (id: string) => Promise<Floor>;
  getById: (id: string) => Promise<Floor>;
  getStats: () => Promise<any>;
  getSections: () => Promise<string[]>;
  loading: boolean;
  error: string | null;
}

export function useFloorActions(): UseFloorActionsResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequest = useCallback(
    async <T>(requestFn: () => Promise<Response>): Promise<T> => {
      setLoading(true);
      setError(null);

      try {
        const response = await requestFn();

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Error ${response.status}`);
        }

        return await response.json();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const create = useCallback(
    async (floor: CreateFloorRequest): Promise<Floor> => {
      return handleRequest(() =>
        fetch("/api/floors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(floor),
        })
      );
    },
    [handleRequest]
  );

  const update = useCallback(
    async (id: string, floor: UpdateFloorRequest): Promise<Floor> => {
      return handleRequest(() =>
        fetch(`/api/floors/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(floor),
        })
      );
    },
    [handleRequest]
  );

  const activate = useCallback(
    async (id: string): Promise<Floor> => {
      return handleRequest(() =>
        fetch(`/api/floors/${id}/activate`, {
          method: "PATCH",
        })
      );
    },
    [handleRequest]
  );

  const deactivate = useCallback(
    async (id: string): Promise<Floor> => {
      return handleRequest(() =>
        fetch(`/api/floors/${id}`, {
          method: "DELETE",
        })
      );
    },
    [handleRequest]
  );

  const getById = useCallback(
    async (id: string): Promise<Floor> => {
      return handleRequest(() => fetch(`/api/floors/${id}`));
    },
    [handleRequest]
  );

  const getStats = useCallback(async () => {
    return handleRequest(() => fetch("/api/floors/stats"));
  }, [handleRequest]);

  const getSections = useCallback(async (): Promise<string[]> => {
    return handleRequest(() => fetch("/api/floors/sections"));
  }, [handleRequest]);

  return {
    create,
    update,
    activate,
    deactivate,
    getById,
    getStats,
    getSections,
    loading,
    error,
  };
}
