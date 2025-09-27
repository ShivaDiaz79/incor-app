// components/medical-history/form-steps/PatientSelectionStep.tsx
"use client";

import { useState } from "react";
import { PatientSearchModal } from "@/components/medical-history/PatientSearchModal";
import Button from "@/components/ui/button/Button";
import type { FormData } from "../MedicalHistoryFormWizard";

interface Patient {
  id: string;
  name: string;
  lastName: string;
  secondLastName?: string;
  age: number;
  email: string;
  phone: string;
  ci: string;
  dateOfBirth: string;
  isActive: boolean;
}

interface PatientSelectionStepProps {
  data: FormData;
  errors: Record<string, string>;
  onChange: (data: Partial<FormData>) => void;
  mode: "create" | "edit";
}

export function PatientSelectionStep({
  data,
  errors,
  onChange,
  mode,
}: PatientSelectionStepProps) {
  const [showPatientSearch, setShowPatientSearch] = useState(false);

  const getPatientAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const getPatientFullName = (patient: Patient) => {
    return `${patient.name} ${patient.lastName}${
      patient.secondLastName ? ` ${patient.secondLastName}` : ""
    }`;
  };

  const handleSelectPatient = (patient: Patient) => {
    onChange({
      selectedPatient: patient,
      patientId: patient.id,
    });
    setShowPatientSearch(false);
  };

  const handleRemovePatient = () => {
    onChange({
      selectedPatient: undefined,
      patientId: "",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Seleccionar Paciente
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {mode === "create"
            ? "Seleccione el paciente para quien se creará la historia clínica."
            : "Paciente asociado a esta historia clínica."}
        </p>
      </div>

      {/* Selected Patient Display */}
      {data.selectedPatient ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900">
                <span className="text-lg font-semibold text-brand-600 dark:text-brand-400">
                  {`${data.selectedPatient.name.charAt(
                    0
                  )}${data.selectedPatient.lastName.charAt(0)}`}
                </span>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {getPatientFullName(data.selectedPatient)}
                </h4>

                <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="font-medium text-gray-500 dark:text-gray-400">
                      ID del Paciente:
                    </dt>
                    <dd className="text-gray-900 dark:text-gray-100">
                      {data.selectedPatient.id}
                    </dd>
                  </div>

                  <div>
                    <dt className="font-medium text-gray-500 dark:text-gray-400">
                      CI:
                    </dt>
                    <dd className="text-gray-900 dark:text-gray-100">
                      {data.selectedPatient.ci}
                    </dd>
                  </div>

                  <div>
                    <dt className="font-medium text-gray-500 dark:text-gray-400">
                      Edad:
                    </dt>
                    <dd className="text-gray-900 dark:text-gray-100">
                      {getPatientAge(data.selectedPatient.dateOfBirth)} años
                    </dd>
                  </div>

                  <div>
                    <dt className="font-medium text-gray-500 dark:text-gray-400">
                      Email:
                    </dt>
                    <dd className="text-gray-900 dark:text-gray-100">
                      {data.selectedPatient.email}
                    </dd>
                  </div>

                  <div>
                    <dt className="font-medium text-gray-500 dark:text-gray-400">
                      Teléfono:
                    </dt>
                    <dd className="text-gray-900 dark:text-gray-100">
                      {data.selectedPatient.phone}
                    </dd>
                  </div>

                  <div>
                    <dt className="font-medium text-gray-500 dark:text-gray-400">
                      Fecha de Nacimiento:
                    </dt>
                    <dd className="text-gray-900 dark:text-gray-100">
                      {new Date(
                        data.selectedPatient.dateOfBirth
                      ).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {mode === "create" && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPatientSearch(true)}
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
                  Cambiar
                </Button>

                <button
                  onClick={handleRemovePatient}
                  className="rounded-lg p-2 text-error-400 hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-500/10"
                  title="Remover paciente"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Patient Status */}
          <div className="mt-4 flex items-center gap-2">
            <span
              className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                data.selectedPatient.isActive
                  ? "bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200"
                  : "bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-200"
              }`}
            >
              {data.selectedPatient.isActive
                ? "Paciente Activo"
                : "Paciente Inactivo"}
            </span>

            {!data.selectedPatient.isActive && (
              <span className="text-sm text-error-600 dark:text-error-400">
                ⚠️ No se puede crear historia clínica para pacientes inactivos
              </span>
            )}
          </div>
        </div>
      ) : (
        /* Empty State - No Patient Selected */
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-600">
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

          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
            {mode === "create"
              ? "Seleccionar Paciente"
              : "Sin Paciente Asignado"}
          </h3>

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {mode === "create"
              ? "Busque y seleccione el paciente para quien se creará la historia clínica."
              : "Esta historia clínica no tiene un paciente asignado."}
          </p>

          {mode === "create" && (
            <Button onClick={() => setShowPatientSearch(true)} className="mt-4">
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
              Buscar Paciente
            </Button>
          )}
        </div>
      )}

      {/* Error Message */}
      {errors.selectedPatient && (
        <div className="rounded-lg bg-error-50 p-4 dark:bg-error-500/10">
          <div className="flex">
            <svg
              className="h-5 w-5 text-error-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="ml-3">
              <p className="text-sm text-error-800 dark:text-error-200">
                {errors.selectedPatient}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Additional Information */}
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
              Información Importante
            </h3>
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Solo se pueden crear historias clínicas para pacientes activos
                </li>
                <li>Cada paciente puede tener múltiples historias clínicas</li>
                <li>
                  Verifique que los datos del paciente sean correctos antes de
                  continuar
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Search Modal */}
      {showPatientSearch && (
        <PatientSearchModal
          isOpen={showPatientSearch}
          onClose={() => setShowPatientSearch(false)}
          onSelectPatient={handleSelectPatient}
          excludePatientIds={
            data.selectedPatient ? [data.selectedPatient.id] : []
          }
        />
      )}
    </div>
  );
}
