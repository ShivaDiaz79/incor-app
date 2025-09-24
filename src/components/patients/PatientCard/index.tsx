// components/patients/PatientCard.tsx
"use client";

import { useState } from "react";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import type { Patient } from "@/types/patients";
import { Gender, CivilStatus } from "@/types/patients";
import { PatientEmergencyContact } from "@/types/patients";

interface PatientCardProps {
  patient: Patient;
  onView: (patient: Patient) => void;
  onEdit: (patient: Patient) => void;
  onToggleActive: (patient: Patient) => void;
  loading?: boolean;
}

const GENDER_STYLES: Record<Gender, string> = {
  [Gender.MALE]:
    "bg-blue-light-50 text-blue-light-700 ring-blue-light-200 dark:bg-blue-light-500/10 dark:text-blue-light-300",
  [Gender.FEMALE]:
    "bg-theme-pink-500/10 text-theme-pink-500 ring-theme-pink-200 dark:bg-theme-pink-500/20 dark:text-theme-pink-400",
  [Gender.OTHER]:
    "bg-theme-purple-500/10 text-theme-purple-500 ring-theme-purple-200 dark:bg-theme-purple-500/20 dark:text-theme-purple-400",
};

const GENDER_LABELS: Record<Gender, string> = {
  [Gender.MALE]: "Masculino",
  [Gender.FEMALE]: "Femenino",
  [Gender.OTHER]: "Otro",
};

const CIVIL_STATUS_LABELS: Record<CivilStatus, string> = {
  [CivilStatus.SINGLE]: "Soltero/a",
  [CivilStatus.MARRIED]: "Casado/a",
  [CivilStatus.DIVORCED]: "Divorciado/a",
  [CivilStatus.WIDOWED]: "Viudo/a",
  [CivilStatus.COHABITING]: "Conviviente",
};

function formatDate(date: Date): string {
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())
  ) {
    age--;
  }

  return age;
}

function getInitials(name: string, lastName: string): string {
  return `${name.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function formatPhoneNumber(phone: string): string {
  if (phone.length === 8) {
    return `${phone.slice(0, 4)}-${phone.slice(4)}`;
  }
  return phone;
}

export function PatientCard({
  patient,
  onView,
  onEdit,
  onToggleActive,
  loading = false,
}: PatientCardProps) {
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

  const fullName = [patient.name, patient.lastName, patient.secondLastName]
    .filter(Boolean)
    .join(" ");

  const age = calculateAge(patient.dateOfBirth ?? new Date());
  const mainEmergencyContact = patient.emergencyContacts?.find(
    (contact: PatientEmergencyContact) => contact.isMainContact
  );

  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-4 transition-all hover:border-gray-300 hover:shadow-theme-sm dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 sm:p-6">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700 ring-2 ring-brand-200 dark:bg-brand-500/20 dark:text-brand-300 dark:ring-brand-500/30">
            {getInitials(patient.name, patient.lastName)}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
              {fullName}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>HM: {patient.medicalRecordId}</span>
              <span>•</span>
              <span>CI: {patient.ci}</span>
              <span>•</span>
              <span>{age} años</span>
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
                  onView(patient);
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
                  onEdit(patient);
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
                  onToggleActive(patient);
                }}
                className={`flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  patient.isActive
                    ? "text-orange-700 dark:text-orange-300"
                    : "text-success-700 dark:text-success-300"
                }`}
                disabled={loading}
              >
                {patient.isActive ? (
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
                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636"
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

      {/* Status and Gender Badges */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
            GENDER_STYLES[patient.gender]
          }`}
        >
          {GENDER_LABELS[patient.gender]}
        </span>

        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
            patient.isActive
              ? "bg-success-50 text-success-700 ring-success-200 dark:bg-success-500/10 dark:text-success-300"
              : "bg-gray-50 text-gray-600 ring-gray-200 dark:bg-gray-500/10 dark:text-gray-400"
          }`}
        >
          {patient.isActive ? "Activo" : "Inactivo"}
        </span>

        {patient.civilStatus && (
          <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:ring-gray-500/20">
            {CIVIL_STATUS_LABELS[patient.civilStatus]}
          </span>
        )}
      </div>

      {/* Contact Information */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
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
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          <span>{formatPhoneNumber(patient.phone)}</span>
        </div>

        {patient.email && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
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
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span className="truncate">{patient.email}</span>
          </div>
        )}

        {(patient.city || patient.state) && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
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
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>
              {[patient.city, patient.state].filter(Boolean).join(", ")}
            </span>
          </div>
        )}
      </div>

      {/* Emergency Contact */}
      {mainEmergencyContact && (
        <div className="mb-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Contacto de Emergencia
          </p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {mainEmergencyContact.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {mainEmergencyContact.relationship}
              </p>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {formatPhoneNumber(mainEmergencyContact.phone)}
            </span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <span>Registrado: {formatDate(patient.createdAt)}</span>
        </div>

        {patient.updatedAt.getTime() !== patient.createdAt.getTime() && (
          <span>Actualizado: {formatDate(patient.updatedAt)}</span>
        )}
      </div>
    </div>
  );
}
