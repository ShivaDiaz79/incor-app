/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  Office,
  OfficeFilters,
  OfficesPagination,
  CreateOfficeRequest,
  UpdateOfficeRequest,
} from "@/types/offices";
import { useState, useCallback, useEffect } from "react";
import { PaginatedResponse } from "@/types/doctor-schedules";

interface UseOfficesResult {
  offices: Office[];
  loading: boolean;
  error: string | null;
  pagination: OfficesPagination | null;
  filters: OfficeFilters;
  updateFilters: (filters: Partial<OfficeFilters>) => void;
  refresh: () => Promise<void>;
}

export function useOffices(
  initialFilters: OfficeFilters = {}
): UseOfficesResult {
  const [offices, setOffices] = useState<Office[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<OfficesPagination | null>(null);
  const [filters, setFilters] = useState<OfficeFilters>({
    page: 1,
    limit: 20,
    sortBy: "officeNumber",
    sortOrder: "asc",
    ...initialFilters,
  });

  const fetchOffices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const searchParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/offices?${searchParams}`);

      if (!response.ok) {
        throw new Error("Error al cargar los consultorios");
      }

      const data: PaginatedResponse<Office> = (await response.json()).data;

      setOffices(data.data);
      setPagination({
        total: data.total,
        currentPage: data.page,
        totalPages: data.totalPages,
        hasNextPage: data.hasNextPage,
        hasPrevPage: data.hasPrevPage,
        limit: data.limit,
      });
    } catch (err) {
      console.error("Error fetching offices:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const updateFilters = useCallback((newFilters: Partial<OfficeFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const refresh = useCallback(() => fetchOffices(), [fetchOffices]);

  useEffect(() => {
    fetchOffices();
  }, [fetchOffices]);

  return {
    offices,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    refresh,
  };
}

// Hook para acciones de consultorios
interface UseOfficeActionsResult {
  create: (office: CreateOfficeRequest) => Promise<Office>;
  update: (id: string, office: UpdateOfficeRequest) => Promise<Office>;
  activate: (id: string) => Promise<Office>;
  deactivate: (id: string) => Promise<Office>;
  getById: (id: string) => Promise<Office>;
  getStats: () => Promise<any>;
  getSpecialties: () => Promise<string[]>;
  getByFloor: (floorId: string) => Promise<Office[]>;
  checkAvailability: (id: string, date: string) => Promise<any>;
  loading: boolean;
  error: string | null;
}

export function useOfficeActions(): UseOfficeActionsResult {
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

        return (await response.json()).data;
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
    async (office: CreateOfficeRequest): Promise<Office> => {
      return handleRequest(() =>
        fetch("/api/offices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(office),
        })
      );
    },
    [handleRequest]
  );

  const update = useCallback(
    async (id: string, office: UpdateOfficeRequest): Promise<Office> => {
      return handleRequest(() =>
        fetch(`/api/offices/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(office),
        })
      );
    },
    [handleRequest]
  );

  const activate = useCallback(
    async (id: string): Promise<Office> => {
      return handleRequest(() =>
        fetch(`/api/offices/${id}/activate`, {
          method: "PATCH",
        })
      );
    },
    [handleRequest]
  );

  const deactivate = useCallback(
    async (id: string): Promise<Office> => {
      return handleRequest(() =>
        fetch(`/api/offices/${id}`, {
          method: "DELETE",
        })
      );
    },
    [handleRequest]
  );

  const getById = useCallback(
    async (id: string): Promise<Office> => {
      return handleRequest(() => fetch(`/api/offices/${id}`));
    },
    [handleRequest]
  );

  const getStats = useCallback(async () => {
    return handleRequest(() => fetch("/api/offices/stats"));
  }, [handleRequest]);

  const getSpecialties = useCallback(async (): Promise<string[]> => {
    return handleRequest(() => fetch("/api/offices/specialties"));
  }, [handleRequest]);

  const getByFloor = useCallback(
    async (floorId: string): Promise<Office[]> => {
      return handleRequest(() => fetch(`/api/offices/floor/${floorId}`));
    },
    [handleRequest]
  );

  const checkAvailability = useCallback(
    async (id: string, date: string) => {
      return handleRequest(() =>
        fetch(`/api/offices/${id}/availability?date=${date}`)
      );
    },
    [handleRequest]
  );

  return {
    create,
    update,
    activate,
    deactivate,
    getById,
    getStats,
    getSpecialties,
    getByFloor,
    checkAvailability,
    loading,
    error,
  };
}
