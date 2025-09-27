// components/doctors/DoctorCard.tsx
"use client";

import { useState } from "react";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import type { Doctor } from "@/types/doctors";

interface DoctorCardProps {
  doctor: Doctor;
  onView: (doctor: Doctor) => void;
  onEdit: (doctor: Doctor) => void;
  onToggleActive: (doctor: Doctor) => void;
  loading?: boolean;
}

function formatDate(date: Date): string {
  const fecha = new Date(date);
  return fecha.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
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

export function DoctorCard({
  doctor,
  onView,
  onEdit,
  onToggleActive,
  loading = false,
}: DoctorCardProps) {
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

  const fullName = doctor.user
    ? `${doctor.user.name} ${doctor.user.lastName}`
    : "Nombre no disponible";

  const initials = doctor.user
    ? getInitials(doctor.user.name, doctor.user.lastName)
    : "NA";

  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-4 transition-all hover:border-gray-300 hover:shadow-theme-sm dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 sm:p-6">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700 ring-2 ring-brand-200 dark:bg-brand-500/20 dark:text-brand-300 dark:ring-brand-500/30">
            {doctor.profilePhoto ? (
              <img
                src={doctor.profilePhoto}
                alt={fullName}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
              {fullName}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>{doctor.speciality}</span>
              {doctor.licenseNumber && (
                <>
                  <span>•</span>
                  <span>Lic. {doctor.licenseNumber}</span>
                </>
              )}
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
                  onView(doctor);
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
                  onEdit(doctor);
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
                  onToggleActive(doctor);
                }}
                className={`flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  doctor.isActive
                    ? "text-orange-700 dark:text-orange-300"
                    : "text-success-700 dark:text-success-300"
                }`}
                disabled={loading}
              >
                {doctor.isActive ? (
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

      {/* Status and Experience Badges */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
            doctor.isActive
              ? "bg-success-50 text-success-700 ring-success-200 dark:bg-success-500/10 dark:text-success-300"
              : "bg-gray-50 text-gray-600 ring-gray-200 dark:bg-gray-500/10 dark:text-gray-400"
          }`}
        >
          {doctor.isActive ? "Activo" : "Inactivo"}
        </span>

        {doctor.experience && (
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-500/20">
            {doctor.experience} años exp.
          </span>
        )}
      </div>

      {/* Contact Information */}
      <div className="mb-4 space-y-2">
        {doctor.user?.phone && (
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
            <span>{formatPhoneNumber(doctor.user.phone)}</span>
          </div>
        )}

        {doctor.user?.email && (
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
            <span className="truncate">{doctor.user.email}</span>
          </div>
        )}

        {doctor.consultationFee && (
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
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
            <span>Bs. {doctor.consultationFee}</span>
          </div>
        )}

        {doctor.medicalRegistration && (
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="truncate">Reg. {doctor.medicalRegistration}</span>
          </div>
        )}
      </div>

      {/* Languages Section */}
      {doctor.languages && doctor.languages.length > 0 && (
        <div className="mb-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
            Idiomas
          </p>
          <div className="flex flex-wrap gap-1">
            {doctor.languages.slice(0, 3).map((language) => (
              <span
                key={language}
                className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              >
                {language}
              </span>
            ))}
            {doctor.languages.length > 3 && (
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                +{doctor.languages.length - 3} más
              </span>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <span>Registrado: {formatDate(doctor.createdAt)}</span>
        </div>

        {doctor.updatedAt &&
          new Date(doctor.updatedAt).getTime() !==
            new Date(doctor.createdAt).getTime() && (
            <span>Actualizado: {formatDate(doctor.updatedAt)}</span>
          )}
      </div>
    </div>
  );
}
