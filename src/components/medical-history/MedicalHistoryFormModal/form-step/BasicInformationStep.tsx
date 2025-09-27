// components/medical-history/form-steps/BasicInformationStep.tsx
"use client";

import { useState, useEffect } from "react";
import { useMedicalHistoryActions } from "@/hooks/useMedicalHistory";
import { DoctorSearchModal } from "@/components/medical-history/DoctorSearchModal";
import {
  MedicalHistoryType,
  MEDICAL_HISTORY_TYPE_LABELS,
} from "@/types/medical-history";
import type { FormData } from "../MedicalHistoryFormWizard";

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

interface BasicInformationStepProps {
  data: FormData;
  errors: Record<string, string>;
  onChange: (data: Partial<FormData>) => void;
}

export function BasicInformationStep({
  data,
  errors,
  onChange,
}: BasicInformationStepProps) {
  const { getSpecialties, getCompanies } = useMedicalHistoryActions();
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [showDoctorSearch, setShowDoctorSearch] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showCustomSpecialty, setShowCustomSpecialty] = useState(false);
  const [showCustomCompany, setShowCustomCompany] = useState(false);

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
        console.error("Error loading options:", error);
      } finally {
        setLoadingOptions(false);
      }
    };

    loadOptions();
  }, [getSpecialties, getCompanies]);

  // Load selected doctor info if attendingDoctorId is provided (for edit mode)
  useEffect(() => {
    const loadDoctorInfo = async () => {
      if (data.attendingDoctorId && !selectedDoctor) {
        try {
          const response = await fetch(
            `/api/doctors/user/${data.attendingDoctorId}`
          );
          if (response.ok) {
            const result = await response.json();
            setSelectedDoctor(result.data);
          }
        } catch (error) {
          console.error("Error loading doctor info:", error);
        }
      }
    };

    loadDoctorInfo();
  }, [data.attendingDoctorId, selectedDoctor]);

  const handleTypeChange = (type: MedicalHistoryType) => {
    const updates: Partial<FormData> = { type };

    // Clear specialized history when type changes
    if (type !== MedicalHistoryType.GYNECO_OBSTETRICS) {
      updates.gynecoObstetricHistory = undefined;
    }
    if (type !== MedicalHistoryType.PEDIATRICS) {
      updates.pediatricHistory = undefined;
    }

    onChange(updates);
  };

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    onChange({ attendingDoctorId: doctor.userId });
    setShowDoctorSearch(false);
  };

  const handleRemoveDoctor = () => {
    setSelectedDoctor(null);
    onChange({ attendingDoctorId: undefined });
  };

  const handleSpecialtyChange = (value: string) => {
    if (value === "custom") {
      setShowCustomSpecialty(true);
      onChange({ specialty: "" });
    } else {
      setShowCustomSpecialty(false);
      onChange({ specialty: value || undefined });
    }
  };

  const handleCompanyChange = (value: string) => {
    if (value === "custom") {
      setShowCustomCompany(true);
      onChange({ company: "" });
    } else {
      setShowCustomCompany(false);
      onChange({ company: value || undefined });
    }
  };

  const getDoctorFullName = (doctor: Doctor) => {
    if (!doctor.user) return "Doctor desconocido";
    return `${doctor.user.name} ${doctor.user.lastName}`;
  };

  const getTypeDescription = (type: MedicalHistoryType) => {
    switch (type) {
      case MedicalHistoryType.GENERAL:
        return "Historia clínica general para consultas médicas estándar";
      case MedicalHistoryType.GYNECO_OBSTETRICS:
        return "Historia especializada para consultas ginecológicas y obstétricas";
      case MedicalHistoryType.PEDIATRICS:
        return "Historia especializada para pacientes pediátricos";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Información Básica
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Configure el tipo de historia clínica y la información general.
        </p>
      </div>

      {/* Type Selection */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Tipo de Historia Clínica *
        </label>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Object.values(MedicalHistoryType).map((type) => (
            <div
              key={type}
              className={`relative rounded-lg border p-4 cursor-pointer transition-all hover:border-brand-300 ${
                data.type === type
                  ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10 ring-1 ring-brand-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              onClick={() => handleTypeChange(type)}
            >
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    type="radio"
                    name="medicalHistoryType"
                    value={type}
                    checked={data.type === type}
                    onChange={() => handleTypeChange(type)}
                    className="h-4 w-4 border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                </div>
                <div className="ml-3 flex-1">
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer">
                    {MEDICAL_HISTORY_TYPE_LABELS[type]}
                  </label>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {getTypeDescription(type)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {errors.type && (
          <p className="text-sm text-error-600 dark:text-error-400">
            {errors.type}
          </p>
        )}
      </div>

      {/* Medical Information Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Specialty */}
        <div>
          <label
            htmlFor="specialty"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Especialidad Médica
          </label>
          <div className="relative">
            <select
              id="specialty"
              value={showCustomSpecialty ? "custom" : data.specialty || ""}
              onChange={(e) => handleSpecialtyChange(e.target.value)}
              disabled={loadingOptions}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:bg-gray-100 disabled:opacity-60 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-brand-400 dark:disabled:bg-gray-700"
            >
              <option value="">Seleccionar especialidad</option>
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
              <option value="custom">Otra especialidad...</option>
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
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Especialidad médica relacionada con la consulta
          </p>
        </div>

        {/* Company */}
        <div>
          <label
            htmlFor="company"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Empresa/Seguro
          </label>
          <div className="relative">
            <select
              id="company"
              value={showCustomCompany ? "custom" : data.company || ""}
              onChange={(e) => handleCompanyChange(e.target.value)}
              disabled={loadingOptions}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:bg-gray-100 disabled:opacity-60 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-brand-400 dark:disabled:bg-gray-700"
            >
              <option value="">Seleccionar empresa</option>
              {companies.map((company) => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
              <option value="custom">Otra empresa...</option>
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
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Empresa de seguro o empleador (para medicina laboral)
          </p>
        </div>
      </div>

      {/* Custom Specialty Input */}
      {showCustomSpecialty && (
        <div>
          <label
            htmlFor="customSpecialty"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Especialidad Personalizada *
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="customSpecialty"
              placeholder="Escriba la especialidad médica"
              value={data.specialty || ""}
              onChange={(e) => onChange({ specialty: e.target.value })}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-brand-400"
            />
            <button
              type="button"
              onClick={() => {
                setShowCustomSpecialty(false);
                onChange({ specialty: undefined });
              }}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Custom Company Input */}
      {showCustomCompany && (
        <div>
          <label
            htmlFor="customCompany"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Empresa Personalizada *
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="customCompany"
              placeholder="Escriba el nombre de la empresa"
              value={data.company || ""}
              onChange={(e) => onChange({ company: e.target.value })}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-brand-400"
            />
            <button
              type="button"
              onClick={() => {
                setShowCustomCompany(false);
                onChange({ company: undefined });
              }}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Doctor Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Doctor Responsable
        </label>

        {selectedDoctor ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                  <svg
                    className="h-6 w-6 text-blue-600 dark:text-blue-400"
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

                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Dr. {getDoctorFullName(selectedDoctor)}
                  </h4>
                  <div className="mt-1 space-y-1 text-xs text-gray-500 dark:text-gray-400">
                    <div>ID: {selectedDoctor.userId}</div>
                    <div>Especialidad: {selectedDoctor.speciality}</div>
                    <div>Licencia: {selectedDoctor.medicalLicense}</div>
                    <div>
                      Experiencia: {selectedDoctor.yearsOfExperience} años
                    </div>
                    {selectedDoctor.user?.email && (
                      <div>Email: {selectedDoctor.user.email}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowDoctorSearch(true)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  <svg
                    className="mr-1 h-4 w-4 inline"
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
                  Cambiar
                </button>
                <button
                  type="button"
                  onClick={handleRemoveDoctor}
                  className="rounded-lg p-1.5 text-error-400 hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-500/10"
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

            {/* Doctor Status */}
            <div className="mt-3 flex items-center gap-2">
              <span
                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                  selectedDoctor.isActive
                    ? "bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200"
                    : "bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-200"
                }`}
              >
                {selectedDoctor.isActive ? "Doctor Activo" : "Doctor Inactivo"}
              </span>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center dark:border-gray-600">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <h3 className="mt-3 text-sm font-medium text-gray-900 dark:text-gray-100">
              Seleccionar Doctor Responsable
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Busque y seleccione el doctor responsable de esta consulta médica
            </p>
            <button
              type="button"
              onClick={() => setShowDoctorSearch(true)}
              className="mt-4 inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <svg
                className="mr-2 h-4 w-4"
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
              Buscar Doctor
            </button>
          </div>
        )}

        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Doctor responsable de la atención médica (opcional pero recomendado)
        </p>
      </div>

      {/* Version */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <label
            htmlFor="version"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Versión de la Historia
          </label>
          <input
            type="number"
            id="version"
            min="1"
            value={data.version || 1}
            onChange={(e) =>
              onChange({ version: parseInt(e.target.value) || 1 })
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-brand-400"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Número de versión para control de cambios
          </p>
        </div>
      </div>

      {/* Information Panel */}
      <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-500/10">
        <div className="flex">
          <svg
            className="h-5 w-5 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Información sobre tipos de historia
            </h3>
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>General:</strong> Para consultas médicas estándar y de
                  medicina interna
                </li>
                <li>
                  <strong>Gineco-Obstétrica:</strong> Incluye campos específicos
                  para historia menstrual, embarazos, y exámenes ginecológicos
                </li>
                <li>
                  <strong>Pediátrica:</strong> Incluye campos para desarrollo
                  infantil, vacunas, y datos del nacimiento
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

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
