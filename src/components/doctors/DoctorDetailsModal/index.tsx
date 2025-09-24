// components/doctors/DoctorDetailsModal.tsx
"use client";

import { useEffect } from "react";
import Button from "@/components/ui/button/Button";
import type { Doctor } from "@/types/doctors";

interface DoctorDetailsModalProps {
  isOpen: boolean;
  doctor: Doctor | null;
  onClose: () => void;
  onEdit: () => void;
}

export function DoctorDetailsModal({
  isOpen,
  doctor,
  onClose,
  onEdit,
}: DoctorDetailsModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen || !doctor) return null;

  const fullName = doctor.user
    ? `${doctor.user.name} ${doctor.user.lastName}`
    : "Nombre no disponible";

  const initials = doctor.user
    ? `${doctor.user.name.charAt(0)}${doctor.user.lastName.charAt(0)}`
    : "NA";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-xl dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900">
              {doctor.profilePhoto ? (
                <img
                  src={doctor.profilePhoto}
                  alt={fullName}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <span className="text-lg font-semibold text-brand-600 dark:text-brand-400">
                  {initials}
                </span>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {fullName}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {doctor.speciality}
              </p>
              <div className="mt-1 flex items-center gap-2">
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
                    {doctor.experience} años de experiencia
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={onEdit} variant="outline" size="sm">
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Editar
            </Button>

            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            >
              <svg
                className="h-5 w-5"
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

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Column - Basic Info */}
            <div className="lg:col-span-2">
              {/* Contact Information */}
              <div className="mb-8">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Información de Contacto
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {doctor.user?.email && (
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                        <svg
                          className="h-4 w-4 text-gray-600 dark:text-gray-400"
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
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Email
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {doctor.user.email}
                        </p>
                      </div>
                    </div>
                  )}

                  {doctor.user?.phone && (
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                        <svg
                          className="h-4 w-4 text-gray-600 dark:text-gray-400"
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
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Teléfono
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {doctor.user.phone}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Professional Information */}
              <div className="mb-8">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Información Profesional
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                      <svg
                        className="h-4 w-4 text-gray-600 dark:text-gray-400"
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
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Número de Licencia
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {doctor.licenseNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                      <svg
                        className="h-4 w-4 text-gray-600 dark:text-gray-400"
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
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Registro Médico
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {doctor.medicalRegistration}
                      </p>
                    </div>
                  </div>

                  {doctor.consultationFee && (
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                        <svg
                          className="h-4 w-4 text-gray-600 dark:text-gray-400"
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
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Tarifa de Consulta
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Bs. {doctor.consultationFee}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Biography */}
              {doctor.biography && (
                <div className="mb-8">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Biografía Profesional
                  </h3>
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                    <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                      {doctor.biography}
                    </p>
                  </div>
                </div>
              )}

              {/* Education */}
              {doctor.education && doctor.education.length > 0 && (
                <div className="mb-8">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Educación
                  </h3>
                  <div className="space-y-3">
                    {doctor.education.map((edu, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800"
                      >
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900">
                          <svg
                            className="h-3 w-3 text-brand-600 dark:text-brand-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {edu}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {doctor.certifications && doctor.certifications.length > 0 && (
                <div className="mb-8">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Certificaciones
                  </h3>
                  <div className="space-y-3">
                    {doctor.certifications.map((cert, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800"
                      >
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                          <svg
                            className="h-3 w-3 text-green-600 dark:text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {cert}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Additional Info */}
            <div className="lg:col-span-1">
              {/* Languages */}
              {doctor.languages && doctor.languages.length > 0 && (
                <div className="mb-8">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Idiomas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {doctor.languages.map((language) => (
                      <span
                        key={language}
                        className="rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* System Info */}
              <div className="mb-8">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Información del Sistema
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      ID del Doctor
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {doctor.id}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      Fecha de Registro
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {new Date(doctor.createdAt).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      Última Actualización
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {new Date(doctor.updatedAt).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                <h4 className="mb-3 font-medium text-gray-900 dark:text-gray-100">
                  Resumen
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Especialidad:
                    </span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {doctor.speciality}
                    </span>
                  </div>
                  {doctor.experience && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Experiencia:
                      </span>
                      <span className="text-gray-900 dark:text-gray-100">
                        {doctor.experience} años
                      </span>
                    </div>
                  )}
                  {doctor.consultationFee && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Tarifa:
                      </span>
                      <span className="text-gray-900 dark:text-gray-100">
                        Bs. {doctor.consultationFee}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Estado:
                    </span>
                    <span
                      className={
                        doctor.isActive
                          ? "text-success-600 dark:text-success-400"
                          : "text-gray-600 dark:text-gray-400"
                      }
                    >
                      {doctor.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 dark:border-gray-700">
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
            <Button onClick={onEdit}>
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Editar Doctor
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
