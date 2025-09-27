/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useEffect } from "react";
import { useMedicalHistoryActions } from "@/hooks/useMedicalHistory";
import { DoctorSearchModal } from "@/components/medical-history/DoctorSearchModal";
import type { MedicalHistoryFilters } from "@/types/medical-history";
import {
  MedicalHistoryType,
  MEDICAL_HISTORY_TYPE_LABELS,
} from "@/types/medical-history";

interface Doctor {
  id: string;
  userId: string;
  speciality: string;
  medicalLicense: string;
  yearsOfExperience: number;
  isActive: boolean;
  user?: {
    id: string;
    name: string;
    lastName: string;
    email: string;
    phone: string;
    isActive: boolean;
  };
}

interface MedicalHistoryFiltersProps {
  filters: MedicalHistoryFilters;
  onFiltersChange: (filters: Partial<MedicalHistoryFilters>) => void;
  loading?: boolean;
}

export function MedicalHistoryFilters({
  filters,
  onFiltersChange,
  loading = false,
}: MedicalHistoryFiltersProps) {
  const { getSpecialties, getCompanies } = useMedicalHistoryActions();
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [showDoctorSearch, setShowDoctorSearch] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Load options on mount
  useEffect(() => {
    const loadOptions = async () => {
      try {
        setLoadingOptions(true);
        const [specialtiesData, companiesData] = await Promise.all([
          getSpecialties(),
          getCompanies(),
        ]);
        setSpecialties(specialtiesData);
        setCompanies(companiesData);
      } catch (error) {
        console.error("Error loading filter options:", error);
      } finally {
        setLoadingOptions(false);
      }
    };

    loadOptions();
  }, [getSpecialties, getCompanies]);

  // Load selected doctor info if attendingDoctorId is provided
  useEffect(() => {
    const loadDoctorInfo = async () => {
      if (filters.attendingDoctorId && !selectedDoctor) {
        try {
          const response = await fetch(
            `/api/doctors/user/${filters.attendingDoctorId}`
          );
          if (response.ok) {
            const result = await response.json();
            setSelectedDoctor(result.data);
          }
        } catch (error) {
          console.error("Error loading doctor info:", error);
        }
      } else if (!filters.attendingDoctorId && selectedDoctor) {
        setSelectedDoctor(null);
      }
    };

    loadDoctorInfo();
  }, [filters.attendingDoctorId, selectedDoctor]);

  const handleInputChange = (key: keyof MedicalHistoryFilters, value: any) => {
    onFiltersChange({ [key]: value || undefined });
  };

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    onFiltersChange({ attendingDoctorId: doctor.userId });
    setShowDoctorSearch(false);
  };

  const handleRemoveDoctor = () => {
    setSelectedDoctor(null);
    onFiltersChange({ attendingDoctorId: undefined });
  };

  const getDoctorFullName = (doctor: Doctor) => {
    if (!doctor.user) return "Doctor desconocido";
    return `${doctor.user.name} ${doctor.user.lastName}`;
  };

  const clearFilters = () => {
    setSelectedDoctor(null);
    onFiltersChange({
      search: undefined,
      patientId: undefined,
      type: undefined,
      attendingDoctorId: undefined,
      specialty: undefined,
      company: undefined,
      isActive: undefined,
    });
  };

  const hasActiveFilters = Boolean(
    filters.search ||
      filters.patientId ||
      filters.type ||
      filters.attendingDoctorId ||
      filters.specialty ||
      filters.company ||
      filters.isActive !== undefined
  );

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.patientId) count++;
    if (filters.type) count++;
    if (filters.attendingDoctorId) count++;
    if (filters.specialty) count++;
    if (filters.company) count++;
    if (filters.isActive !== undefined) count++;
    return count;
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      {/* Header - Siempre visible */}
      <div className="flex items-center justify-between p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Filtros
          </h3>
          {hasActiveFilters && (
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-xs font-medium text-brand-800 dark:bg-brand-900 dark:text-brand-200">
              {getActiveFiltersCount()}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              disabled={loading}
              className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 disabled:opacity-50"
              title="Limpiar filtros"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span className="hidden sm:inline">Limpiar</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 disabled:opacity-50"
          >
            <span>{isExpanded ? "Ocultar" : "Mostrar"} filtros</span>
            <svg
              className={`h-4 w-4 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Búsqueda rápida - Siempre visible */}
      <div className="border-t border-gray-200 p-4 dark:border-gray-700 sm:p-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar historias médicas..."
            value={filters.search || ""}
            onChange={(e) => handleInputChange("search", e.target.value)}
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pl-11 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:bg-gray-100 disabled:opacity-60 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-brand-400 dark:disabled:bg-gray-700"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Filtros avanzados - Colapsables */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 dark:border-gray-700 sm:p-6">
          <div className="space-y-6">
            {/* Filtros básicos */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Patient ID */}
              <div>
                <label
                  htmlFor="patientId"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  ID del Paciente
                </label>
                <input
                  type="text"
                  id="patientId"
                  placeholder="Ej: F19900515GF001"
                  value={filters.patientId || ""}
                  onChange={(e) =>
                    handleInputChange("patientId", e.target.value)
                  }
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:bg-gray-100 disabled:opacity-60 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-brand-400 dark:disabled:bg-gray-700"
                />
              </div>

              {/* Type */}
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Tipo
                </label>
                <select
                  id="type"
                  value={filters.type || ""}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:bg-gray-100 disabled:opacity-60 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-brand-400 dark:disabled:bg-gray-700"
                >
                  <option value="">Todos los tipos</option>
                  {Object.entries(MEDICAL_HISTORY_TYPE_LABELS).map(
                    ([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="isActive"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Estado
                </label>
                <select
                  id="isActive"
                  value={
                    filters.isActive !== undefined
                      ? filters.isActive.toString()
                      : ""
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "isActive",
                      e.target.value === ""
                        ? undefined
                        : e.target.value === "true"
                    )
                  }
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:bg-gray-100 disabled:opacity-60 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-brand-400 dark:disabled:bg-gray-700"
                >
                  <option value="">Todos los estados</option>
                  <option value="true">Activa</option>
                  <option value="false">Inactiva</option>
                </select>
              </div>
            </div>

            {/* Specialty and Company */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Specialty */}
              <div>
                <label
                  htmlFor="specialty"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Especialidad
                </label>
                <div className="relative">
                  <select
                    id="specialty"
                    value={filters.specialty || ""}
                    onChange={(e) =>
                      handleInputChange("specialty", e.target.value)
                    }
                    disabled={loading || loadingOptions}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:bg-gray-100 disabled:opacity-60 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-brand-400 dark:disabled:bg-gray-700"
                  >
                    <option value="">Todas las especialidades</option>
                    {specialties.map((specialty) => (
                      <option key={specialty} value={specialty}>
                        {specialty}
                      </option>
                    ))}
                  </select>
                  {loadingOptions && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg
                        className="h-4 w-4 animate-spin text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Company */}
              <div>
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Empresa
                </label>
                <div className="relative">
                  <select
                    id="company"
                    value={filters.company || ""}
                    onChange={(e) =>
                      handleInputChange("company", e.target.value)
                    }
                    disabled={loading || loadingOptions}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:bg-gray-100 disabled:opacity-60 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-brand-400 dark:disabled:bg-gray-700"
                  >
                    <option value="">Todas las empresas</option>
                    {companies.map((company) => (
                      <option key={company} value={company}>
                        {company}
                      </option>
                    ))}
                  </select>
                  {loadingOptions && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg
                        className="h-4 w-4 animate-spin text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Doctor Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Doctor Responsable
              </label>

              {selectedDoctor ? (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                        <svg
                          className="h-5 w-5 text-blue-600 dark:text-blue-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          Dr. {getDoctorFullName(selectedDoctor)}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>{selectedDoctor.speciality}</span>
                          <span>•</span>
                          <span>Lic: {selectedDoctor.medicalLicense}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowDoctorSearch(true)}
                        disabled={loading}
                        className="rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        title="Cambiar doctor"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveDoctor}
                        disabled={loading}
                        className="rounded-lg p-2 text-error-400 hover:bg-error-50 hover:text-error-600 disabled:opacity-50 dark:hover:bg-error-500/10"
                        title="Remover doctor"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowDoctorSearch(true)}
                  disabled={loading}
                  className="w-full rounded-lg border-2 border-dashed border-gray-300 p-4 text-center transition-colors hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    Filtrar por doctor específico
                  </div>
                </button>
              )}
            </div>

            {/* Sort Options */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="sortBy"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Ordenar por
                </label>
                <select
                  id="sortBy"
                  value={filters.sortBy || "createdAt"}
                  onChange={(e) => handleInputChange("sortBy", e.target.value)}
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:bg-gray-100 disabled:opacity-60 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-brand-400 dark:disabled:bg-gray-700"
                >
                  <option value="createdAt">Fecha de creación</option>
                  <option value="updatedAt">Última actualización</option>
                  <option value="specialty">Especialidad</option>
                  <option value="type">Tipo</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="sortOrder"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Orden
                </label>
                <select
                  id="sortOrder"
                  value={filters.sortOrder || "desc"}
                  onChange={(e) =>
                    handleInputChange("sortOrder", e.target.value)
                  }
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:bg-gray-100 disabled:opacity-60 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-brand-400 dark:disabled:bg-gray-700"
                >
                  <option value="desc">Más reciente primero</option>
                  <option value="asc">Más antiguo primero</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Summary - Solo visible cuando hay filtros activos */}
      {hasActiveFilters && (
        <div className="border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
          <div className="flex items-start gap-2">
            <svg
              className="h-4 w-4 text-brand-500 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
              />
            </svg>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {getActiveFiltersCount()} filtro
                {getActiveFiltersCount() !== 1 ? "s" : ""} activo
                {getActiveFiltersCount() !== 1 ? "s" : ""}
              </h4>
              <div className="mt-2 flex flex-wrap gap-1">
                {filters.search && (
                  <span className="inline-flex items-center rounded-md bg-brand-100 px-2 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/50 dark:text-brand-300">
                    &quot;{filters.search}&quot;
                  </span>
                )}
                {filters.patientId && (
                  <span className="inline-flex items-center rounded-md bg-brand-100 px-2 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/50 dark:text-brand-300">
                    ID: {filters.patientId}
                  </span>
                )}
                {filters.type && (
                  <span className="inline-flex items-center rounded-md bg-brand-100 px-2 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/50 dark:text-brand-300">
                    {
                      MEDICAL_HISTORY_TYPE_LABELS[
                        filters.type as MedicalHistoryType
                      ]
                    }
                  </span>
                )}
                {selectedDoctor && (
                  <span className="inline-flex items-center rounded-md bg-brand-100 px-2 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/50 dark:text-brand-300">
                    Dr. {getDoctorFullName(selectedDoctor)}
                  </span>
                )}
                {filters.specialty && (
                  <span className="inline-flex items-center rounded-md bg-brand-100 px-2 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/50 dark:text-brand-300">
                    {filters.specialty}
                  </span>
                )}
                {filters.company && (
                  <span className="inline-flex items-center rounded-md bg-brand-100 px-2 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/50 dark:text-brand-300">
                    {filters.company}
                  </span>
                )}
                {filters.isActive !== undefined && (
                  <span className="inline-flex items-center rounded-md bg-brand-100 px-2 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/50 dark:text-brand-300">
                    {filters.isActive ? "Activa" : "Inactiva"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Doctor Search Modal */}
      <DoctorSearchModal
        isOpen={showDoctorSearch}
        onClose={() => setShowDoctorSearch(false)}
        onSelectDoctor={handleDoctorSelect}
        excludeDoctorIds={selectedDoctor ? [selectedDoctor.userId] : []}
      />
    </div>
  );
}
