/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  DoctorSchedule,
  DoctorScheduleFilters,
  DoctorSchedulesPagination,
  CreateDoctorScheduleRequest,
  UpdateDoctorScheduleRequest,
} from "@/types/doctor-schedules";
import { PaginatedResponse } from "@/types/doctor-schedules";
import { useState, useCallback, useEffect } from "react";

interface UseDoctorSchedulesResult {
  schedules: DoctorSchedule[];
  loading: boolean;
  error: string | null;
  pagination: DoctorSchedulesPagination | null;
  filters: DoctorScheduleFilters;
  updateFilters: (filters: Partial<DoctorScheduleFilters>) => void;
  refresh: () => Promise<void>;
}

export function useDoctorSchedules(
  initialFilters: DoctorScheduleFilters = {}
): UseDoctorSchedulesResult {
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] =
    useState<DoctorSchedulesPagination | null>(null);
  const [filters, setFilters] = useState<DoctorScheduleFilters>({
    page: 1,
    limit: 20,
    sortBy: "effectiveFrom",
    sortOrder: "desc",
    ...initialFilters,
  });

  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const searchParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/doctor-schedules?${searchParams}`);

      if (!response.ok) {
        throw new Error("Error al cargar los horarios");
      }

      const data: PaginatedResponse<DoctorSchedule> = (await response.json())
        .data;

      setSchedules(data.data);
      setPagination({
        total: data.total,
        currentPage: data.page,
        totalPages: data.totalPages,
        hasNextPage: data.hasNextPage,
        hasPrevPage: data.hasPrevPage,
        limit: data.limit,
      });
    } catch (err) {
      console.error("Error fetching doctor schedules:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const updateFilters = useCallback(
    (newFilters: Partial<DoctorScheduleFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    []
  );

  const refresh = useCallback(() => fetchSchedules(), [fetchSchedules]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  return {
    schedules,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    refresh,
  };
}

// Hook para acciones de horarios
interface UseDoctorScheduleActionsResult {
  create: (schedule: CreateDoctorScheduleRequest) => Promise<DoctorSchedule>;
  update: (
    id: string,
    schedule: UpdateDoctorScheduleRequest
  ) => Promise<DoctorSchedule>;
  activate: (id: string) => Promise<DoctorSchedule>;
  deactivate: (id: string) => Promise<DoctorSchedule>;
  getById: (id: string) => Promise<DoctorSchedule>;
  getByDoctorUserId: (doctorUserId: string) => Promise<DoctorSchedule[]>;
  getScheduleForDate: (
    doctorUserId: string,
    date: string,
    officeId?: string
  ) => Promise<any>;
  getByOfficeId: (officeId: string, date?: string) => Promise<any>;
  getStats: () => Promise<any>;
  loading: boolean;
  error: string | null;
}

export function useDoctorScheduleActions(): UseDoctorScheduleActionsResult {
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
    async (schedule: CreateDoctorScheduleRequest): Promise<DoctorSchedule> => {
      return handleRequest(() =>
        fetch("/api/doctor-schedules", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(schedule),
        })
      );
    },
    [handleRequest]
  );

  const update = useCallback(
    async (
      id: string,
      schedule: UpdateDoctorScheduleRequest
    ): Promise<DoctorSchedule> => {
      return handleRequest(() =>
        fetch(`/api/doctor-schedules/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(schedule),
        })
      );
    },
    [handleRequest]
  );

  const activate = useCallback(
    async (id: string): Promise<DoctorSchedule> => {
      return handleRequest(() =>
        fetch(`/api/doctor-schedules/${id}/activate`, {
          method: "PATCH",
        })
      );
    },
    [handleRequest]
  );

  const deactivate = useCallback(
    async (id: string): Promise<DoctorSchedule> => {
      return handleRequest(() =>
        fetch(`/api/doctor-schedules/${id}`, {
          method: "DELETE",
        })
      );
    },
    [handleRequest]
  );

  const getById = useCallback(
    async (id: string): Promise<DoctorSchedule> => {
      return handleRequest(() => fetch(`/api/doctor-schedules/${id}`));
    },
    [handleRequest]
  );

  const getByDoctorUserId = useCallback(
    async (doctorUserId: string): Promise<DoctorSchedule[]> => {
      return handleRequest(() =>
        fetch(`/api/doctor-schedules/doctor/${doctorUserId}`)
      );
    },
    [handleRequest]
  );

  const getScheduleForDate = useCallback(
    async (doctorUserId: string, date: string, officeId?: string) => {
      const params = new URLSearchParams();
      if (officeId) params.append("officeId", officeId);

      return handleRequest(() =>
        fetch(
          `/api/doctor-schedules/doctor/${doctorUserId}/date/${date}?${params}`
        )
      );
    },
    [handleRequest]
  );

  const getByOfficeId = useCallback(
    async (officeId: string, date?: string) => {
      const params = new URLSearchParams();
      if (date) params.append("date", date);

      return handleRequest(() =>
        fetch(`/api/doctor-schedules/office/${officeId}?${params}`)
      );
    },
    [handleRequest]
  );

  const getStats = useCallback(async () => {
    return handleRequest(() => fetch("/api/doctor-schedules/stats/summary"));
  }, [handleRequest]);

  return {
    create,
    update,
    activate,
    deactivate,
    getById,
    getByDoctorUserId,
    getScheduleForDate,
    getByOfficeId,
    getStats,
    loading,
    error,
  };
}
