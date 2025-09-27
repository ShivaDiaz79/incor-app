// components/medical-history/DoctorSearchModal.tsx
"use client";

import { Fragment, useState, useEffect, useCallback } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { debounce } from "lodash";
import Button from "@/components/ui/button/Button";

// Interface para doctores (basada en el hook que proporcionaste)
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

interface DoctorSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDoctor: (doctor: Doctor) => void;
  excludeDoctorIds?: string[];
}

export function DoctorSearchModal({
  isOpen,
  onClose,
  onSelectDoctor,
  excludeDoctorIds = [],
}: DoctorSearchModalProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      if (!term.trim()) {
        setDoctors([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const searchParams = new URLSearchParams({
          search: term,
          limit: "20",
          isActive: "true",
        });

        const response = await fetch(`/api/doctors?${searchParams}`);

        if (!response.ok) {
          throw new Error("Error al buscar doctores");
        }

        const data = await response.json();

        // Filter out excluded doctors
        const filteredDoctors = (data.data?.data || []).filter(
          (doctor: Doctor) => !excludeDoctorIds.includes(doctor.userId)
        );

        setDoctors(filteredDoctors);
      } catch (err) {
        console.error("Error searching doctors:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    }, 300),
    [excludeDoctorIds]
  );

  // Effect to trigger search when searchTerm changes
  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      setDoctors([]);
      setError(null);
    }
  }, [isOpen]);

  const handleSelectDoctor = (doctor: Doctor) => {
    onSelectDoctor(doctor);
    onClose();
  };

  const getDoctorFullName = (doctor: Doctor) => {
    if (!doctor.user) return "Doctor desconocido";
    return `${doctor.user.name} ${doctor.user.lastName}`;
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 dark:bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-900">
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100"
                  >
                    Buscar Doctor
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
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

                {/* Search Input */}
                <div className="mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar por nombre, especialidad, licencia..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pl-10 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-brand-400"
                      autoFocus
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
                    {loading && (
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

                {/* Error Message */}
                {error && (
                  <div className="mb-4 rounded-lg bg-error-50 p-3 dark:bg-error-500/10">
                    <p className="text-sm text-error-800 dark:text-error-200">
                      {error}
                    </p>
                  </div>
                )}

                {/* Results */}
                <div className="max-h-96 overflow-y-auto">
                  {!searchTerm.trim() && (
                    <div className="py-8 text-center">
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
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                        Buscar doctores
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Escribe el nombre, especialidad o licencia del doctor
                      </p>
                    </div>
                  )}

                  {searchTerm.trim() &&
                    !loading &&
                    doctors.length === 0 &&
                    !error && (
                      <div className="py-8 text-center">
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
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                          Sin resultados
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          No se encontraron doctores con &quot;{searchTerm}
                          &quot;
                        </p>
                      </div>
                    )}

                  {doctors.length > 0 && (
                    <div className="space-y-2">
                      {doctors.map((doctor) => (
                        <button
                          key={doctor.id}
                          onClick={() => handleSelectDoctor(doctor)}
                          className="w-full rounded-lg border border-gray-200 p-3 text-left transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
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
                              <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                Dr. {getDoctorFullName(doctor)}
                              </p>
                              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <span>ID: {doctor.userId}</span>
                                <span>•</span>
                                <span>{doctor.speciality}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <span>Licencia: {doctor.medicalLicense}</span>
                                <span>•</span>
                                <span>
                                  {doctor.yearsOfExperience} años exp.
                                </span>
                              </div>
                              {doctor.user?.email && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                  {doctor.user.email}
                                </p>
                              )}
                            </div>

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
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-6 flex justify-end">
                  <Button variant="outline" onClick={onClose}>
                    Cancelar
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
