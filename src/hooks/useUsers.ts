"use client";

import { useState, useCallback, useEffect } from "react";
import type {
  User,
  UserFilters,
  UsersPagination,
  CreateUserRequest,
  UpdateUserRequest,
  ChangePasswordRequest,
  UserStats,
  UserWithDoctorRequest,
} from "@/types/users";

interface UsersResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface UseUsersResult {
  users: User[];
  loading: boolean;
  error: string | null;
  pagination: UsersPagination | null;
  filters: UserFilters;
  updateFilters: (filters: Partial<UserFilters>) => void;
  refresh: () => Promise<void>;
}

export function useUsers(initialFilters: UserFilters = {}): UseUsersResult {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<UsersPagination | null>(null);
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
    ...initialFilters,
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const searchParams = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/users?${searchParams}`);

      if (!response.ok) {
        throw new Error("Error al cargar los usuarios");
      }

      const data: UsersResponse = (await response.json()).data;

      setUsers(data.data);
      setPagination({
        total: data.total,
        currentPage: data.page,
        totalPages: data.totalPages,
        hasNextPage: data.hasNextPage,
        hasPrevPage: data.hasPrevPage,
        limit: data.limit,
      });
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const updateFilters = useCallback((newFilters: Partial<UserFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const refresh = useCallback(() => fetchUsers(), [fetchUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    refresh,
  };
}

// Hook para acciones de usuarios
interface UseUserActionsResult {
  create: (user: CreateUserRequest) => Promise<User>;
  createWithDoctor: (
    data: UserWithDoctorRequest
  ) => Promise<{ user: User; doctorId?: string }>;
  update: (id: string, user: UpdateUserRequest) => Promise<User>;
  activate: (id: string) => Promise<User>;
  deactivate: (id: string) => Promise<User>;
  changePassword: (
    id: string,
    passwords: ChangePasswordRequest
  ) => Promise<void>;
  getById: (id: string) => Promise<User>;
  getStats: () => Promise<UserStats>;
  loading: boolean;
  error: string | null;
}

export function useUserActions(): UseUserActionsResult {
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
    async (user: CreateUserRequest): Promise<User> => {
      return handleRequest(() =>
        fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        })
      );
    },
    [handleRequest]
  );

  const createWithDoctor = useCallback(
    async (
      data: UserWithDoctorRequest
    ): Promise<{ user: User; doctorId?: string }> => {
      setLoading(true);
      setError(null);

      try {
        // Paso 1: Crear el usuario
        const userResponse = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data.user),
        });

        if (!userResponse.ok) {
          const errorData = await userResponse.json().catch(() => ({}));
          throw new Error(
            errorData.message || `Error ${userResponse.status} creando usuario`
          );
        }

        const userResult = await userResponse.json();

        // Extraer el usuario de la respuesta según el formato que mostraste
        const createdUser = userResult.data || userResult;

        // Paso 2: Si se proporcionan datos del doctor, crear el perfil de doctor
        if (data.doctor && createdUser.id) {
          try {
            const doctorData = {
              ...data.doctor,
              userId: createdUser.id, // Usar el ID del usuario recién creado
            };

            const doctorResponse = await fetch("/api/doctors", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(doctorData),
            });

            if (doctorResponse.ok) {
              const doctorResult = await doctorResponse.json();
              const createdDoctor = doctorResult.data || doctorResult;

              return {
                user: createdUser,
                doctorId: createdDoctor.id,
              };
            } else {
              // Si falla la creación del doctor, mostrar advertencia pero no fallar completamente
              const doctorError = await doctorResponse.json().catch(() => ({}));
              console.warn(
                "Usuario creado exitosamente, pero falló la creación del perfil de doctor:",
                doctorError
              );

              // Opcional: Podrías mostrar un mensaje de advertencia al usuario
              setError(
                "Usuario creado exitosamente, pero no se pudo crear el perfil de doctor. Puedes crearlo manualmente desde la gestión de doctores."
              );
            }
          } catch (doctorErr) {
            console.error("Error creating doctor profile:", doctorErr);
            // Usuario ya fue creado exitosamente, solo falló la creación del doctor
            setError(
              "Usuario creado exitosamente, pero no se pudo crear el perfil de doctor. Puedes crearlo manualmente desde la gestión de doctores."
            );
          }
        }

        return { user: createdUser };
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

  const update = useCallback(
    async (id: string, user: UpdateUserRequest): Promise<User> => {
      return handleRequest(() =>
        fetch(`/api/users/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        })
      );
    },
    [handleRequest]
  );

  const activate = useCallback(
    async (id: string): Promise<User> => {
      return handleRequest(() =>
        fetch(`/api/users/${id}/activate`, {
          method: "PATCH",
        })
      );
    },
    [handleRequest]
  );

  const deactivate = useCallback(
    async (id: string): Promise<User> => {
      return handleRequest(() =>
        fetch(`/api/users/${id}`, {
          method: "DELETE",
        })
      );
    },
    [handleRequest]
  );

  const changePassword = useCallback(
    async (id: string, passwords: ChangePasswordRequest): Promise<void> => {
      return handleRequest(() =>
        fetch(`/api/users/${id}/change-password`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(passwords),
        })
      );
    },
    [handleRequest]
  );

  const getById = useCallback(
    async (id: string): Promise<User> => {
      return handleRequest(() => fetch(`/api/users/${id}`));
    },
    [handleRequest]
  );

  const getStats = useCallback(async (): Promise<UserStats> => {
    return handleRequest(() => fetch("/api/users/stats"));
  }, [handleRequest]);

  return {
    create,
    createWithDoctor,
    update,
    activate,
    deactivate,
    changePassword,
    getById,
    getStats,
    loading,
    error,
  };
}
