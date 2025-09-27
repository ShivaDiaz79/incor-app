// hooks/useMedicalHistory.ts
"use client";

import { useState, useCallback, useEffect } from "react";
import type {
  MedicalHistory,
  MedicalHistoryFilters,
  MedicalHistoryPagination,
  CreateMedicalHistoryRequest,
  UpdateMedicalHistoryRequest,
  MedicalHistoryStats,
} from "@/types/medical-history";
import { PaginatedResponse } from "@/types/doctor-schedules";

interface UseMedicalHistoriesResult {
  medicalHistories: MedicalHistory[];
  loading: boolean;
  error: string | null;
  pagination: MedicalHistoryPagination | null;
  filters: MedicalHistoryFilters;
  updateFilters: (filters: Partial<MedicalHistoryFilters>) => void;
  refresh: () => Promise<void>;
}

export function useMedicalHistories(
  initialFilters: MedicalHistoryFilters = {}
): UseMedicalHistoriesResult {
  const [medicalHistories, setMedicalHistories] = useState<MedicalHistory[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<MedicalHistoryPagination | null>(
    null
  );
  const [filters, setFilters] = useState<MedicalHistoryFilters>({
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
    ...initialFilters,
  });

  const fetchMedicalHistories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const searchParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/medical-history?${searchParams}`);

      if (!response.ok) {
        throw new Error("Error al cargar las historias clínicas");
      }

      const data: PaginatedResponse<MedicalHistory> = (await response.json())
        .data;

      setMedicalHistories(data.data);
      setPagination({
        total: data.total,
        currentPage: data.page,
        totalPages: data.totalPages,
        hasNextPage: data.hasNextPage,
        hasPrevPage: data.hasPrevPage,
        limit: data.limit,
      });
    } catch (err) {
      console.error("Error fetching medical histories:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const updateFilters = useCallback(
    (newFilters: Partial<MedicalHistoryFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    []
  );

  const refresh = useCallback(
    () => fetchMedicalHistories(),
    [fetchMedicalHistories]
  );

  useEffect(() => {
    fetchMedicalHistories();
  }, [fetchMedicalHistories]);

  return {
    medicalHistories,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    refresh,
  };
}

// Hook para acciones de historias clínicas
interface UseMedicalHistoryActionsResult {
  create: (
    medicalHistory: CreateMedicalHistoryRequest
  ) => Promise<MedicalHistory>;
  update: (
    id: string,
    medicalHistory: UpdateMedicalHistoryRequest
  ) => Promise<MedicalHistory>;
  activate: (id: string) => Promise<MedicalHistory>;
  deactivate: (id: string) => Promise<MedicalHistory>;
  getById: (id: string) => Promise<MedicalHistory>;
  getByPatientId: (patientId: string) => Promise<MedicalHistory>;
  getStats: () => Promise<MedicalHistoryStats>;
  getSpecialties: () => Promise<string[]>;
  getCompanies: () => Promise<string[]>;
  loading: boolean;
  error: string | null;
}

export function useMedicalHistoryActions(): UseMedicalHistoryActionsResult {
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

        const result = await response.json();
        return result.data || result;
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
    async (
      medicalHistory: CreateMedicalHistoryRequest
    ): Promise<MedicalHistory> => {
      return handleRequest(() =>
        fetch("/api/medical-history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(medicalHistory),
        })
      );
    },
    [handleRequest]
  );

  const update = useCallback(
    async (
      id: string,
      medicalHistory: UpdateMedicalHistoryRequest
    ): Promise<MedicalHistory> => {
      return handleRequest(() =>
        fetch(`/api/medical-history/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(medicalHistory),
        })
      );
    },
    [handleRequest]
  );

  const activate = useCallback(
    async (id: string): Promise<MedicalHistory> => {
      return handleRequest(() =>
        fetch(`/api/medical-history/${id}/activate`, {
          method: "PATCH",
        })
      );
    },
    [handleRequest]
  );

  const deactivate = useCallback(
    async (id: string): Promise<MedicalHistory> => {
      return handleRequest(() =>
        fetch(`/api/medical-history/${id}`, {
          method: "DELETE",
        })
      );
    },
    [handleRequest]
  );

  const getById = useCallback(
    async (id: string): Promise<MedicalHistory> => {
      return handleRequest(() => fetch(`/api/medical-history/${id}`));
    },
    [handleRequest]
  );

  const getByPatientId = useCallback(
    async (patientId: string): Promise<MedicalHistory> => {
      return handleRequest(() =>
        fetch(`/api/medical-history/patient/${patientId}`)
      );
    },
    [handleRequest]
  );

  const getStats = useCallback(async (): Promise<MedicalHistoryStats> => {
    return handleRequest(() => fetch("/api/medical-history/stats"));
  }, [handleRequest]);

  const getSpecialties = useCallback(async (): Promise<string[]> => {
    return handleRequest(() => fetch("/api/medical-history/specialties"));
  }, [handleRequest]);

  const getCompanies = useCallback(async (): Promise<string[]> => {
    return handleRequest(() => fetch("/api/medical-history/companies"));
  }, [handleRequest]);

  return {
    create,
    update,
    activate,
    deactivate,
    getById,
    getByPatientId,
    getStats,
    getSpecialties,
    getCompanies,
    loading,
    error,
  };
}
