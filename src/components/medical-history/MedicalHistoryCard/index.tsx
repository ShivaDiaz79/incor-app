// components/medical-history/MedicalHistoryCard.tsx
"use client";

import { useState } from "react";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import type { MedicalHistory } from "@/types/medical-history";
import {
  MEDICAL_HISTORY_TYPE_LABELS,
  MEDICAL_HISTORY_TYPE_COLORS,
  MedicalHistoryType,
} from "@/types/medical-history";

interface MedicalHistoryCardProps {
  medicalHistory: MedicalHistory;
  onView: (medicalHistory: MedicalHistory) => void;
  onEdit: (medicalHistory: MedicalHistory) => void;
  onToggleActive: (medicalHistory: MedicalHistory) => void;
  loading?: boolean;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function getPatientInitials(name: string, lastName: string): string {
  return `${name.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function MedicalHistoryCard({
  medicalHistory,
  onView,
  onEdit,
  onToggleActive,
  loading = false,
}: MedicalHistoryCardProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);

  const handleMenuToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setAnchorRect(rect);
    setDropdownOpen(!dropdownOpen);
  };

  const handleMenuClose = () => {
    setDropdownOpen(false);
    setAnchorRect(null);
  };

  const typeLabel =
    MEDICAL_HISTORY_TYPE_LABELS[medicalHistory.type as MedicalHistoryType] ||
    medicalHistory.type;
  const typeColor =
    MEDICAL_HISTORY_TYPE_COLORS[medicalHistory.type as MedicalHistoryType] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";

  const getPatientFullName = () => {
    if (!medicalHistory.patient) return "Paciente desconocido";
    const { name, lastName, secondLastName } = medicalHistory.patient;
    return `${name} ${lastName}${secondLastName ? ` ${secondLastName}` : ""}`;
  };

  const patientInitials = medicalHistory.patient
    ? getPatientInitials(
        medicalHistory.patient.name,
        medicalHistory.patient.lastName
      )
    : "?";

  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-4 transition-all hover:border-gray-300 hover:shadow-theme-sm dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 sm:p-6">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700 ring-2 ring-brand-200 dark:bg-brand-500/20 dark:text-brand-300 dark:ring-brand-500/30">
            {patientInitials}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
              {getPatientFullName()}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>
                ID: {medicalHistory.patient?.id || medicalHistory.patientId}
              </span>
              {medicalHistory.patient?.age && (
                <>
                  <span>•</span>
                  <span>{medicalHistory.patient.age} años</span>
                </>
              )}
              <span>•</span>
              <span>v{medicalHistory.version}</span>
            </div>
          </div>
        </div>

        {/* Actions Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={handleMenuToggle}
            disabled={loading}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Menú de acciones"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="5" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
            </svg>
          </button>

          <Dropdown
            isOpen={dropdownOpen}
            onClose={handleMenuClose}
            anchorRect={anchorRect}
            className="min-w-48"
          >
            <div className="py-1">
              <button
                onClick={() => {
                  handleMenuClose();
                  onView(medicalHistory);
                }}
                className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                disabled={loading}
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                Ver Detalles
              </button>

              <button
                onClick={() => {
                  handleMenuClose();
                  onEdit(medicalHistory);
                }}
                className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                disabled={loading}
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Editar
              </button>

              <div className="my-1 h-px bg-gray-100 dark:bg-gray-800" />

              <button
                onClick={() => {
                  handleMenuClose();
                  onToggleActive(medicalHistory);
                }}
                className={`flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  medicalHistory.isActive
                    ? "text-orange-700 dark:text-orange-300"
                    : "text-success-700 dark:text-success-300"
                }`}
                disabled={loading}
              >
                {medicalHistory.isActive ? (
                  <>
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
                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                      />
                    </svg>
                    Desactivar
                  </>
                ) : (
                  <>
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Activar
                  </>
                )}
              </button>
            </div>
          </Dropdown>
        </div>
      </div>

      {/* Status and Type Badges */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${typeColor}`}
        >
          {typeLabel}
        </span>

        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
            medicalHistory.isActive
              ? "bg-success-50 text-success-700 ring-success-200 dark:bg-success-500/10 dark:text-success-300"
              : "bg-gray-50 text-gray-600 ring-gray-200 dark:bg-gray-500/10 dark:text-gray-400"
          }`}
        >
          {medicalHistory.isActive ? "Activa" : "Inactiva"}
        </span>
      </div>

      {/* Medical Information */}
      <div className="mb-4 space-y-3">
        {/* Chief Complaint */}
        {medicalHistory.chiefComplaint && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
              Motivo de consulta
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {medicalHistory.chiefComplaint}
            </p>
          </div>
        )}

        {/* Diagnosis */}
        {medicalHistory.presumptiveOrDefinitiveDiagnosis && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
              Diagnóstico
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {medicalHistory.presumptiveOrDefinitiveDiagnosis}
            </p>
          </div>
        )}
      </div>

      {/* Additional Information */}
      {(medicalHistory.specialty ||
        medicalHistory.company ||
        medicalHistory.signatureDoctor) && (
        <div className="mb-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
            Información adicional
          </p>
          <div className="space-y-1 text-sm">
            {medicalHistory.specialty && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <svg
                  className="h-4 w-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <span>
                  <span className="font-medium">Especialidad:</span>{" "}
                  {medicalHistory.specialty}
                </span>
              </div>
            )}

            {medicalHistory.company && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <svg
                  className="h-4 w-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <span>
                  <span className="font-medium">Empresa:</span>{" "}
                  {medicalHistory.company}
                </span>
              </div>
            )}

            {medicalHistory.signatureDoctor && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <svg
                  className="h-4 w-4 flex-shrink-0"
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
                <span>
                  <span className="font-medium">Doctor:</span>{" "}
                  {medicalHistory.signatureDoctor.name}{" "}
                  {medicalHistory.signatureDoctor.lastName}
                  {medicalHistory.signatureDoctor.speciality && (
                    <span className="text-xs">
                      {" "}
                      ({medicalHistory.signatureDoctor.speciality})
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <span>Creada: {formatDate(medicalHistory.createdAt)}</span>
        </div>

        <span>Actualizada: {formatDate(medicalHistory.updatedAt)}</span>
      </div>
    </div>
  );
}
