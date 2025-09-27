// components/medical-history/MedicalHistoryConfirmModal.tsx
"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import type { MedicalHistory } from "@/types/medical-history";
import Button from "@/components/ui/button/Button";

interface MedicalHistoryConfirmModalProps {
  isOpen: boolean;
  medicalHistory: MedicalHistory;
  action: "activate" | "deactivate";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function MedicalHistoryConfirmModal({
  isOpen,
  medicalHistory,
  action,
  loading = false,
  onConfirm,
  onCancel,
}: MedicalHistoryConfirmModalProps) {
  const getPatientFullName = () => {
    if (!medicalHistory.patient) return "Paciente desconocido";
    const { name, lastName, secondLastName } = medicalHistory.patient;
    return `${name} ${lastName}${secondLastName ? ` ${secondLastName}` : ""}`;
  };

  const isActivating = action === "activate";
  const actionText = isActivating ? "activar" : "desactivar";
  const actionTextCapitalized = isActivating ? "Activar" : "Desactivar";

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onCancel}>
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
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${
                      isActivating
                        ? "bg-success-100 dark:bg-success-500/20"
                        : "bg-error-100 dark:bg-error-500/20"
                    }`}
                  >
                    {isActivating ? (
                      <svg
                        className="h-6 w-6 text-success-600 dark:text-success-400"
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
                    ) : (
                      <svg
                        className="h-6 w-6 text-error-600 dark:text-error-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100"
                    >
                      {actionTextCapitalized} Historia Clínica
                    </Dialog.Title>

                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        ¿Estás seguro que deseas {actionText} la historia
                        clínica de{" "}
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {getPatientFullName()}
                        </span>
                        ?
                      </p>

                      <div className="mt-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex justify-between">
                            <span>ID Historia:</span>
                            <span className="font-mono">
                              {medicalHistory.id}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tipo:</span>
                            <span>{medicalHistory.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Versión:</span>
                            <span>v{medicalHistory.version}</span>
                          </div>
                        </div>
                      </div>

                      {!isActivating && (
                        <div className="mt-3 rounded-lg bg-error-50 p-3 dark:bg-error-500/10">
                          <p className="text-sm text-error-800 dark:text-error-200">
                            <strong>Advertencia:</strong> Al desactivar esta
                            historia clínica, no estará disponible para
                            consultas futuras hasta que sea reactivada.
                          </p>
                        </div>
                      )}

                      {isActivating && (
                        <div className="mt-3 rounded-lg bg-success-50 p-3 dark:bg-success-500/10">
                          <p className="text-sm text-success-800 dark:text-success-200">
                            Al activar esta historia clínica, estará disponible
                            nuevamente para consultas y actualizaciones.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3 sm:flex-row-reverse">
                  <Button
                    onClick={onConfirm}
                    disabled={loading}
                    variant={isActivating ? "primary" : "danger"}
                    className="w-full sm:w-auto"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="mr-2 h-4 w-4 animate-spin"
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
                        {isActivating ? "Activando..." : "Desactivando..."}
                      </>
                    ) : (
                      <>
                        {isActivating ? (
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
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
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
                              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                            />
                          </svg>
                        )}
                        {actionTextCapitalized}
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={onCancel}
                    disabled={loading}
                    className="w-full sm:w-auto"
                  >
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
