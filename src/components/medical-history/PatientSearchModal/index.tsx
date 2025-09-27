// components/medical-history/PatientSearchModal.tsx
"use client";

import { Fragment, useState, useEffect, useCallback } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { debounce } from "lodash";
import Button from "@/components/ui/button/Button";

// Interfaces para pacientes (asumiendo estructura similar)
interface Patient {
  id: string;
  name: string;
  lastName: string;
  secondLastName?: string;
  email: string;
  phone: string;
  ci: string;
  age: number;
  dateOfBirth: string;
  isActive: boolean;
}

interface PatientSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPatient: (patient: Patient) => void;
  excludePatientIds?: string[];
}

export function PatientSearchModal({
  isOpen,
  onClose,
  onSelectPatient,
  excludePatientIds = [],
}: PatientSearchModalProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      if (!term.trim()) {
        setPatients([]);
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

        const response = await fetch(`/api/patients?${searchParams}`);

        if (!response.ok) {
          throw new Error("Error al buscar pacientes");
        }

        const data = await response.json();

        // Filter out excluded patients
        const filteredPatients = (data.data?.data || []).filter(
          (patient: Patient) => !excludePatientIds.includes(patient.id)
        );

        setPatients(filteredPatients);
      } catch (err) {
        console.error("Error searching patients:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    }, 300),
    [excludePatientIds]
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
      setPatients([]);
      setError(null);
    }
  }, [isOpen]);

  const handleSelectPatient = (patient: Patient) => {
    onSelectPatient(patient);
    onClose();
  };

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
                    Buscar Paciente
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
                      placeholder="Buscar por nombre, CI, email..."
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
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                        Buscar pacientes
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Escribe el nombre, CI o email del paciente
                      </p>
                    </div>
                  )}

                  {searchTerm.trim() &&
                    !loading &&
                    patients.length === 0 &&
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
                          No se encontraron pacientes con &quot;{searchTerm}
                          &quot;
                        </p>
                      </div>
                    )}

                  {patients.length > 0 && (
                    <div className="space-y-2">
                      {patients.map((patient) => (
                        <button
                          key={patient.id}
                          onClick={() => handleSelectPatient(patient)}
                          className="w-full rounded-lg border border-gray-200 p-3 text-left transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900">
                              <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">
                                {`${patient.name.charAt(
                                  0
                                )}${patient.lastName.charAt(0)}`}
                              </span>
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                {getPatientFullName(patient)}
                              </p>
                              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <span>ID: {patient.id}</span>
                                <span>•</span>
                                <span>CI: {patient.ci}</span>
                                <span>•</span>
                                <span>
                                  {getPatientAge(patient.dateOfBirth)} años
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                {patient.email}
                              </p>
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
