// hooks/useDoctors.ts
"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import type {
  Doctor,
  DoctorFilters,
  DoctorsPagination,
  CreateDoctorRequest,
  UpdateDoctorRequest,
  AvailableUser,
} from "@/types/doctors";

interface DoctorsResponse {
  data: Doctor[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface UseDoctorsResult {
  doctors: Doctor[];
  loading: boolean;
  error: string | null;
  pagination: DoctorsPagination | null;
  filters: DoctorFilters;
  updateFilters: (filters: Partial<DoctorFilters>) => void;
  refresh: () => Promise<void>;
}

export function useDoctors(
  initialFilters: DoctorFilters = {}
): UseDoctorsResult {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<DoctorsPagination | null>(null);
  const [filters, setFilters] = useState<DoctorFilters>({
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
    ...initialFilters,
  });

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const searchParams = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/doctors?${searchParams}`);

      if (!response.ok) {
        throw new Error("Error al cargar los doctores");
      }

      const data: DoctorsResponse = (await response.json()).data;

      setDoctors(data.data);
      setPagination({
        total: data.total,
        currentPage: data.page,
        totalPages: data.totalPages,
        hasNextPage: data.hasNextPage,
        hasPrevPage: data.hasPrevPage,
        limit: data.limit,
      });
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const updateFilters = useCallback((newFilters: Partial<DoctorFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const refresh = useCallback(() => fetchDoctors(), [fetchDoctors]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  return {
    doctors,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    refresh,
  };
}

// Hook para acciones de doctores
interface UseDoctorActionsResult {
  create: (doctor: CreateDoctorRequest) => Promise<Doctor>;
  update: (id: string, doctor: UpdateDoctorRequest) => Promise<Doctor>;
  activate: (id: string) => Promise<Doctor>;
  deactivate: (id: string) => Promise<Doctor>;
  getById: (id: string) => Promise<Doctor>;
  loading: boolean;
  error: string | null;
}

export function useDoctorActions(): UseDoctorActionsResult {
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
    async (doctor: CreateDoctorRequest): Promise<Doctor> => {
      return handleRequest(() =>
        fetch("/api/doctors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(doctor),
        })
      );
    },
    [handleRequest]
  );

  const update = useCallback(
    async (id: string, doctor: UpdateDoctorRequest): Promise<Doctor> => {
      return handleRequest(() =>
        fetch(`/api/doctors/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(doctor),
        })
      );
    },
    [handleRequest]
  );

  const activate = useCallback(
    async (id: string): Promise<Doctor> => {
      return handleRequest(() =>
        fetch(`/api/doctors/${id}/activate`, {
          method: "PATCH",
        })
      );
    },
    [handleRequest]
  );

  const deactivate = useCallback(
    async (id: string): Promise<Doctor> => {
      return handleRequest(() =>
        fetch(`/api/doctors/${id}`, {
          method: "DELETE",
        })
      );
    },
    [handleRequest]
  );

  const getById = useCallback(
    async (id: string): Promise<Doctor> => {
      return handleRequest(() => fetch(`/api/doctors/${id}`));
    },
    [handleRequest]
  );

  return {
    create,
    update,
    activate,
    deactivate,
    getById,
    loading,
    error,
  };
}

// Hook para usuarios disponibles para ser doctores
interface UseAvailableUsersResult {
  users: AvailableUser[];
  loading: boolean;
  error: string | null;
  search: (term: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useAvailableUsers(): UseAvailableUsersResult {
  const [users, setUsers] = useState<AvailableUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async (searchTerm: string = "") => {
    try {
      setLoading(true);
      setError(null);

      const searchParams = new URLSearchParams();
      if (searchTerm) {
        searchParams.append("search", searchTerm);
      }

      const response = await fetch(
        `/api/doctors/available-users?${searchParams}`
      );

      if (!response.ok) {
        throw new Error("Error al cargar los usuarios");
      }

      const data = (await response.json()).data;
      setUsers(data.data || []);
    } catch (err) {
      console.error("Error fetching available users:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  const search = useCallback(
    async (term: string) => {
      await fetchUsers(term);
    },
    [fetchUsers]
  );

  const refresh = useCallback(async () => {
    await fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    search,
    refresh,
  };
}
