/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useMemo } from "react";
import type {
  Patient,
  CreatePatientRequest,
  UpdatePatientRequest,
  PatientFilters,
  PatientsResponse,
  PatientStats,
} from "@/types/patients";

// API Service Functions
const patientsAPI = {
  async getAll(filters?: PatientFilters): Promise<PatientsResponse> {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.gender) params.append("gender", filters.gender);
    if (filters?.civilStatus) params.append("civilStatus", filters.civilStatus);
    if (filters?.city) params.append("city", filters.city);
    if (filters?.state) params.append("state", filters.state);
    if (filters?.isActive !== undefined)
      params.append("isActive", String(filters.isActive));
    if (filters?.minAge !== undefined)
      params.append("minAge", String(filters.minAge));
    if (filters?.maxAge !== undefined)
      params.append("maxAge", String(filters.maxAge));
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.limit) params.append("limit", String(filters.limit));

    const url = `/api/patients${
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

    responseJs.data.data = responseJs.data.data.map((patient: any) => ({
      ...patient,
      dateOfBirth: new Date(patient.dateOfBirth),
      createdAt: new Date(patient.createdAt),
      updatedAt: new Date(patient.updatedAt),
    }));

    return responseJs.data;
  },

  async getById(id: string): Promise<Patient> {
    const response = await fetch(`/api/patients/${id}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const patient = await response.json();

    return {
      ...patient,
      dateOfBirth: new Date(patient.dateOfBirth),
      createdAt: new Date(patient.createdAt),
      updatedAt: new Date(patient.updatedAt),
    };
  },

  async getByCi(ci: string): Promise<Patient> {
    const response = await fetch(`/api/patients/search/ci/${ci}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const patient = await response.json();

    return {
      ...patient,
      dateOfBirth: new Date(patient.dateOfBirth),
      createdAt: new Date(patient.createdAt),
      updatedAt: new Date(patient.updatedAt),
    };
  },

  async create(data: CreatePatientRequest): Promise<Patient> {
    const response = await fetch("/api/patients", {
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

    const patient = await response.json();

    return {
      ...patient,
      dateOfBirth: new Date(patient.dateOfBirth),
      createdAt: new Date(patient.createdAt),
      updatedAt: new Date(patient.updatedAt),
    };
  },

  async update(id: string, data: UpdatePatientRequest): Promise<Patient> {
    const response = await fetch(`/api/patients/${id}`, {
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

    const patient = await response.json();

    return {
      ...patient,
      dateOfBirth: new Date(patient.dateOfBirth),
      createdAt: new Date(patient.createdAt),
      updatedAt: new Date(patient.updatedAt),
    };
  },

  async activate(id: string): Promise<Patient> {
    const response = await fetch(`/api/patients/${id}/activate`, {
      method: "PATCH",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const patient = await response.json();

    return {
      ...patient,
      dateOfBirth: new Date(patient.dateOfBirth),
      createdAt: new Date(patient.createdAt),
      updatedAt: new Date(patient.updatedAt),
    };
  },

  async deactivate(id: string): Promise<Patient> {
    const response = await fetch(`/api/patients/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const patient = await response.json();

    return {
      ...patient,
      dateOfBirth: new Date(patient.dateOfBirth),
      createdAt: new Date(patient.createdAt),
      updatedAt: new Date(patient.updatedAt),
    };
  },

  async getStats(): Promise<PatientStats> {
    const response = await fetch("/api/patients/stats");

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  },

  async getCities(): Promise<{ data: string[] }> {
    const response = await fetch("/api/patients/cities");

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  },

  async getStates(): Promise<{ data: string[] }> {
    const response = await fetch("/api/patients/states");

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  },
};

// Hook para listar pacientes con paginación y filtros
export function usePatients(initialFilters?: PatientFilters) {
  const [data, setData] = useState<PatientsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PatientFilters>(
    initialFilters || {
      page: 1,
      limit: 20,
      sortBy: "createdAt",
      sortOrder: "desc",
    }
  );

  const fetchPatients = useCallback(
    async (newFilters?: PatientFilters) => {
      try {
        setLoading(true);
        setError(null);
        const response = await patientsAPI.getAll(newFilters || filters);
        console.log(response);
        setData(response);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar pacientes"
        );
        setData(null);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  const updateFilters = useCallback(
    (newFilters: Partial<PatientFilters>) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);
      fetchPatients(updatedFilters);
    },
    [filters, fetchPatients]
  );

  const refresh = useCallback(() => {
    fetchPatients();
  }, [fetchPatients]);

  useEffect(() => {
    fetchPatients();
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
    patients: data?.data || [],
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    refresh,
  };
}

// Hook para un paciente individual
export function usePatient(id?: string) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPatient = useCallback(async (patientId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await patientsAPI.getById(patientId);
      setPatient(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar el paciente"
      );
      setPatient(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchPatient(id);
    } else {
      setPatient(null);
      setLoading(false);
    }
  }, [id, fetchPatient]);

  const refresh = useCallback(() => {
    if (id) {
      fetchPatient(id);
    }
  }, [id, fetchPatient]);

  return {
    patient,
    loading,
    error,
    refresh,
  };
}

// Hook para búsqueda por CI
export function usePatientByCi() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchByCi = useCallback(async (ci: string) => {
    if (!ci.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const data = await patientsAPI.getByCi(ci);
      setPatient(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Paciente no encontrado");
      setPatient(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setPatient(null);
    setError(null);
  }, []);

  return {
    patient,
    loading,
    error,
    searchByCi,
    clearSearch,
  };
}

// Hook para acciones CRUD
export function usePatientActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(
    async (data: CreatePatientRequest): Promise<Patient> => {
      try {
        setLoading(true);
        setError(null);
        const result = await patientsAPI.create(data);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al crear paciente";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const update = useCallback(
    async (id: string, data: UpdatePatientRequest): Promise<Patient> => {
      try {
        setLoading(true);
        setError(null);
        const result = await patientsAPI.update(id, data);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al actualizar paciente";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const activate = useCallback(async (id: string): Promise<Patient> => {
    try {
      setLoading(true);
      setError(null);
      const result = await patientsAPI.activate(id);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al activar paciente";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const deactivate = useCallback(async (id: string): Promise<Patient> => {
    try {
      setLoading(true);
      setError(null);
      const result = await patientsAPI.deactivate(id);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al desactivar paciente";
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
    loading,
    error,
    clearError,
  };
}

// Hook para estadísticas
export function usePatientStats() {
  const [stats, setStats] = useState<PatientStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await patientsAPI.getStats();
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

// Hook para opciones de filtros (ciudades, estados)
export function usePatientFilterOptions() {
  const [cities, setCities] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOptions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [citiesData, statesData] = await Promise.all([
        patientsAPI.getCities(),
        patientsAPI.getStates(),
      ]);
      setCities(citiesData.data);
      setStates(statesData.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar opciones de filtros"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  return {
    cities,
    states,
    loading,
    error,
    refresh: fetchOptions,
  };
}
