// components/doctors/DoctorCard.tsx
"use client";

import type { Doctor } from "@/types/doctors";

interface DoctorCardProps {
  doctor: Doctor;
  onView: (doctor: Doctor) => void;
  onEdit: (doctor: Doctor) => void;
  onToggleActive: (doctor: Doctor) => void;
  loading?: boolean;
}

export function DoctorCard({
  doctor,
  onView,
  onEdit,
  onToggleActive,
  loading = false,
}: DoctorCardProps) {
  const fullName = doctor.user
    ? `${doctor.user.name} ${doctor.user.lastName}`
    : "Nombre no disponible";

  const initials = doctor.user
    ? `${doctor.user.name.charAt(0)}${doctor.user.lastName.charAt(0)}`
    : "NA";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900">
            {doctor.profilePhoto ? (
              <img
                src={doctor.profilePhoto}
                alt={fullName}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">
                {initials}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-semibold text-gray-900 dark:text-gray-100">
              {fullName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {doctor.speciality}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Lic. {doctor.licenseNumber}
            </p>
          </div>
        </div>

        {/* Actions Menu */}
        <div className="relative">
          <div className="flex items-center gap-1">
            <button
              onClick={() => onView(doctor)}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              title="Ver detalles"
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
            </button>

            <button
              onClick={() => onEdit(doctor)}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              title="Editar"
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
            </button>

            <button
              onClick={() => onToggleActive(doctor)}
              disabled={loading}
              className={`rounded-lg p-2 disabled:opacity-50 ${
                doctor.isActive
                  ? "text-error-400 hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-500/10"
                  : "text-success-400 hover:bg-success-50 hover:text-success-600 dark:hover:bg-success-500/10"
              }`}
              title={doctor.isActive ? "Desactivar" : "Activar"}
            >
              {loading ? (
                <svg
                  className="h-4 w-4 animate-spin"
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
              ) : doctor.isActive ? (
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
              ) : (
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
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Status & Tags */}
      <div className="mb-4 flex flex-wrap gap-2">
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
            doctor.isActive
              ? "bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200"
              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          {doctor.isActive ? "Activo" : "Inactivo"}
        </span>

        {doctor.experience && (
          <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {doctor.experience} años exp.
          </span>
        )}
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm">
        {doctor.user?.email && (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <svg
              className="h-4 w-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span className="truncate">{doctor.user.email}</span>
          </div>
        )}

        {doctor.user?.phone && (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <svg
              className="h-4 w-4 shrink-0"
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
            <span>{doctor.user.phone}</span>
          </div>
        )}

        {doctor.consultationFee && (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <svg
              className="h-4 w-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
            <span>Bs. {doctor.consultationFee}</span>
          </div>
        )}

        {doctor.medicalRegistration && (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <svg
              className="h-4 w-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="truncate">Reg. {doctor.medicalRegistration}</span>
          </div>
        )}
      </div>

      {/* Languages */}
      {doctor.languages && doctor.languages.length > 0 && (
        <div className="mt-4 border-t border-gray-200 pt-3 dark:border-gray-700">
          <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
            IDIOMAS
          </p>
          <div className="flex flex-wrap gap-1">
            {doctor.languages.slice(0, 3).map((language) => (
              <span
                key={language}
                className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                {language}
              </span>
            ))}
            {doctor.languages.length > 3 && (
              <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                +{doctor.languages.length - 3}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
