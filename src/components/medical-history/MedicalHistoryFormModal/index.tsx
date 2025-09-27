// components/medical-history/MedicalHistoryFormModal.tsx
"use client";

import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { MedicalHistoryFormWizard } from "./MedicalHistoryFormWizard";
import type { MedicalHistory } from "@/types/medical-history";

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

interface MedicalHistoryFormModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  medicalHistory?: MedicalHistory | null;
  preselectedPatient?: Patient | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function MedicalHistoryFormModal({
  isOpen,
  mode,
  medicalHistory,
  preselectedPatient,
  onClose,
  onSuccess,
}: MedicalHistoryFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const title =
    mode === "create" ? "Nueva Historia Clínica" : "Editar Historia Clínica";

  // Reset submitting state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSuccess = () => {
    setIsSubmitting(false);
    onSuccess();
  };

  const handleSubmitting = (submitting: boolean) => {
    setIsSubmitting(submitting);
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
              <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all dark:bg-gray-900">
                {/* Header */}
                <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <Dialog.Title
                      as="h2"
                      className="text-xl font-semibold leading-6 text-gray-900 dark:text-gray-100"
                    >
                      {title}
                    </Dialog.Title>

                    <button
                      onClick={onClose}
                      disabled={isSubmitting}
                      className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                    >
                      <svg
                        className="h-6 w-6"
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

                  {/* Subtitle */}
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {mode === "create"
                      ? "Complete los datos para crear una nueva historia clínica"
                      : "Modifique los datos de la historia clínica"}
                  </p>
                </div>

                {/* Form Content */}
                <div className="p-6">
                  <MedicalHistoryFormWizard
                    mode={mode}
                    medicalHistory={medicalHistory}
                    preselectedPatient={preselectedPatient}
                    onSuccess={handleSuccess}
                    onSubmitting={handleSubmitting}
                    onCancel={onClose}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
