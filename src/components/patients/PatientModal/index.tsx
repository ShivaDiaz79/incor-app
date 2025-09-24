// components/patients/PatientModal.tsx
"use client";

import { useState, useEffect } from "react";
import { usePatientActions } from "@/hooks/usePatients";
import Button from "@/components/ui/button/Button";
import type {
  Patient,
  CreatePatientRequest,
  PatientEmergencyContact,
} from "@/types/patients";
import { Gender, CivilStatus } from "@/types/patients";

interface PatientModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  patient?: Patient | null;
  onClose: () => void;
  onSuccess: () => void;
}

const GENDER_OPTIONS = [
  { value: Gender.MALE, label: "Masculino" },
  { value: Gender.FEMALE, label: "Femenino" },
  { value: Gender.OTHER, label: "Otro" },
];

const CIVIL_STATUS_OPTIONS = [
  { value: CivilStatus.SINGLE, label: "Soltero/a" },
  { value: CivilStatus.MARRIED, label: "Casado/a" },
  { value: CivilStatus.DIVORCED, label: "Divorciado/a" },
  { value: CivilStatus.WIDOWED, label: "Viudo/a" },
  { value: CivilStatus.COHABITING, label: "Conviviente" },
];

interface FormData {
  name: string;
  lastName: string;
  secondLastName: string;
  email: string;
  phone: string;
  ci: string;
  dateOfBirth: string;
  gender: Gender;
  civilStatus: CivilStatus | "";
  nationality: string;
  address: string;
  city: string;
  state: string;
  whatsappNumber: string;
  emergencyContacts: PatientEmergencyContact[];
  preferredLanguage: string;
  occupation: string;
  notes: string;
  referredBy: string;
  isActive: boolean;
}

const initialFormData: FormData = {
  name: "",
  lastName: "",
  secondLastName: "",
  email: "",
  phone: "",
  ci: "",
  dateOfBirth: "",
  gender: Gender.MALE,
  civilStatus: "",
  nationality: "Boliviana",
  address: "",
  city: "",
  state: "",
  whatsappNumber: "",
  emergencyContacts: [
    { name: "", phone: "", relationship: "", isMainContact: true },
  ],
  preferredLanguage: "Español",
  occupation: "",
  notes: "",
  referredBy: "",
  isActive: true,
};

export function PatientModal({
  isOpen,
  mode,
  patient,
  onClose,
  onSuccess,
}: PatientModalProps) {
  const { create, update, loading, error } = usePatientActions();

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(0);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const steps = [
    {
      title: "Información Personal",
      fields: [
        "name",
        "lastName",
        "secondLastName",
        "ci",
        "dateOfBirth",
        "gender",
      ],
    },
    {
      title: "Contacto",
      fields: ["phone", "email", "whatsappNumber", "address", "city", "state"],
    },
    { title: "Contactos de Emergencia", fields: ["emergencyContacts"] },
    {
      title: "Información Adicional",
      fields: [
        "civilStatus",
        "nationality",
        "occupation",
        "preferredLanguage",
        "notes",
        "referredBy",
      ],
    },
  ];

  // Initialize form data
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && patient) {
        setFormData({
          name: patient.name,
          lastName: patient.lastName,
          secondLastName: patient.secondLastName || "",
          email: patient.email || "",
          phone: patient.phone,
          ci: patient.ci,
          dateOfBirth: patient.dateOfBirth.toISOString().split("T")[0],
          gender: patient.gender,
          civilStatus: patient.civilStatus || "",
          nationality: patient.nationality || "",
          address: patient.address,
          city: patient.city || "",
          state: patient.state || "",
          whatsappNumber: patient.whatsappNumber || "",
          emergencyContacts:
            patient.emergencyContacts.length > 0
              ? patient.emergencyContacts
              : [
                  {
                    name: "",
                    phone: "",
                    relationship: "",
                    isMainContact: true,
                  },
                ],
          preferredLanguage: patient.preferredLanguage || "",
          occupation: patient.occupation || "",
          notes: patient.notes || "",
          referredBy: patient.referredBy || "",
          isActive: patient.isActive,
        });
      } else {
        setFormData(initialFormData);
      }
      setCurrentStep(0);
      setFormErrors({});
    }
  }, [isOpen, mode, patient]);

  // Form validation
  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};
    const stepFields = steps[step].fields;

    stepFields.forEach((field) => {
      if (field === "emergencyContacts") {
        if (formData.emergencyContacts.length === 0) {
          errors[field] = "Debe agregar al menos un contacto de emergencia";
        } else {
          const mainContacts = formData.emergencyContacts.filter(
            (contact) => contact.isMainContact
          );
          if (mainContacts.length === 0) {
            errors[field] = "Debe marcar un contacto como principal";
          } else if (mainContacts.length > 1) {
            errors[field] = "Solo puede haber un contacto principal";
          }
        }
        return;
      }

      const value = formData[field as keyof FormData];
      const requiredFields = [
        "name",
        "lastName",
        "ci",
        "phone",
        "address",
        "gender",
      ];

      if (
        requiredFields.includes(field) &&
        (!value || (typeof value === "string" && !value.trim()))
      ) {
        errors[field] = `El campo ${getFieldLabel(field)} es requerido`;
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getFieldLabel = (field: string): string => {
    const labels: Record<string, string> = {
      name: "Nombre",
      lastName: "Apellido paterno",
      ci: "CI",
      phone: "Teléfono",
      address: "Dirección",
      gender: "Género",
      emergencyContacts: "Contactos de emergencia",
    };
    return labels[field] || field;
  };

  // Handle form input changes
  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean | Gender | CivilStatus | PatientEmergencyContact[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Emergency contact management
  const addEmergencyContact = () => {
    setFormData((prev) => ({
      ...prev,
      emergencyContacts: [
        ...prev.emergencyContacts,
        { name: "", phone: "", relationship: "", isMainContact: false },
      ],
    }));
  };

  const removeEmergencyContact = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index),
    }));
  };

  const updateEmergencyContact = (
    index: number,
    field: keyof PatientEmergencyContact,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.map((contact, i) =>
        i === index
          ? { ...contact, [field]: value }
          : field === "isMainContact" && value
          ? { ...contact, isMainContact: false }
          : contact
      ),
    }));
  };

  // Navigation
  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(currentStep)) return;

    try {
      const requestData: CreatePatientRequest = {
        ...formData,
        civilStatus: formData.civilStatus || undefined,
        secondLastName: formData.secondLastName || undefined,
        email: formData.email || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        whatsappNumber: formData.whatsappNumber || undefined,
        nationality: formData.nationality || undefined,
        preferredLanguage: formData.preferredLanguage || undefined,
        occupation: formData.occupation || undefined,
        notes: formData.notes || undefined,
        referredBy: formData.referredBy || undefined,
      };

      if (mode === "create") {
        await create(requestData);
      } else if (mode === "edit" && patient) {
        await update(patient.id, requestData);
      }

      onSuccess();
    } catch (err) {
      console.error("Error saving patient:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto backdrop-blur-sm bg-black/30 p-4">
      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-xl dark:bg-gray-900 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-800">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {mode === "create"
                ? "Registrar Nuevo Paciente"
                : "Editar Paciente"}
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Paso {currentStep + 1} de {steps.length}:{" "}
              {steps[currentStep].title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
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

        {/* Progress Steps */}
        <div className="px-6 pt-4">
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center ${
                  index < steps.length - 1 ? "flex-1" : ""
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                    index === currentStep
                      ? "bg-brand-500 text-white"
                      : index < currentStep
                      ? "bg-success-500 text-white"
                      : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                  }`}
                >
                  {index < currentStep ? (
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
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 ${
                      index < currentStep
                        ? "bg-success-500"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="rounded-lg border border-error-200 bg-error-50 p-4 dark:border-error-800 dark:bg-error-500/10">
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
                    <p className="text-sm text-error-700 dark:text-error-300">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Personal Information */}
            {currentStep === 0 && (
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:bg-gray-800 dark:text-gray-200 ${
                      formErrors.name
                        ? "border-error-300 focus:border-error-500 dark:border-error-600"
                        : "border-gray-300 focus:border-brand-500 dark:border-gray-600 dark:focus:border-brand-400"
                    }`}
                    disabled={loading}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-xs text-error-600 dark:text-error-400">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Apellido Paterno *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:bg-gray-800 dark:text-gray-200 ${
                      formErrors.lastName
                        ? "border-error-300 focus:border-error-500 dark:border-error-600"
                        : "border-gray-300 focus:border-brand-500 dark:border-gray-600 dark:focus:border-brand-400"
                    }`}
                    disabled={loading}
                  />
                  {formErrors.lastName && (
                    <p className="mt-1 text-xs text-error-600 dark:text-error-400">
                      {formErrors.lastName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Apellido Materno
                  </label>
                  <input
                    type="text"
                    value={formData.secondLastName}
                    onChange={(e) =>
                      handleInputChange("secondLastName", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-brand-400"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    CI (Cédula de Identidad) *
                  </label>
                  <input
                    type="text"
                    value={formData.ci}
                    onChange={(e) => handleInputChange("ci", e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:bg-gray-800 dark:text-gray-200 ${
                      formErrors.ci
                        ? "border-error-300 focus:border-error-500 dark:border-error-600"
                        : "border-gray-300 focus:border-brand-500 dark:border-gray-600 dark:focus:border-brand-400"
                    }`}
                    disabled={loading}
                  />
                  {formErrors.ci && (
                    <p className="mt-1 text-xs text-error-600 dark:text-error-400">
                      {formErrors.ci}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-brand-400"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Género *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      handleInputChange("gender", e.target.value as Gender)
                    }
                    className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:bg-gray-800 dark:text-gray-200 ${
                      formErrors.gender
                        ? "border-error-300 focus:border-error-500 dark:border-error-600"
                        : "border-gray-300 focus:border-brand-500 dark:border-gray-600 dark:focus:border-brand-400"
                    }`}
                    disabled={loading}
                  >
                    {GENDER_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {formErrors.gender && (
                    <p className="mt-1 text-xs text-error-600 dark:text-error-400">
                      {formErrors.gender}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Contact Information */}
            {currentStep === 1 && (
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:bg-gray-800 dark:text-gray-200 ${
                      formErrors.phone
                        ? "border-error-300 focus:border-error-500 dark:border-error-600"
                        : "border-gray-300 focus:border-brand-500 dark:border-gray-600 dark:focus:border-brand-400"
                    }`}
                    placeholder="+591 12345678"
                    disabled={loading}
                  />
                  {formErrors.phone && (
                    <p className="mt-1 text-xs text-error-600 dark:text-error-400">
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-brand-400"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={formData.whatsappNumber}
                    onChange={(e) =>
                      handleInputChange("whatsappNumber", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-brand-400"
                    placeholder="+591 98765432"
                    disabled={loading}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Dirección *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:bg-gray-800 dark:text-gray-200 ${
                      formErrors.address
                        ? "border-error-300 focus:border-error-500 dark:border-error-600"
                        : "border-gray-300 focus:border-brand-500 dark:border-gray-600 dark:focus:border-brand-400"
                    }`}
                    placeholder="Av. Heroínas 123, Zona Central"
                    disabled={loading}
                  />
                  {formErrors.address && (
                    <p className="mt-1 text-xs text-error-600 dark:text-error-400">
                      {formErrors.address}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-brand-400"
                    placeholder="Cochabamba"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Departamento
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-brand-400"
                    placeholder="Cochabamba"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Emergency Contacts */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Contactos de Emergencia
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addEmergencyContact}
                    disabled={loading}
                    size="sm"
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Agregar Contacto
                  </Button>
                </div>

                {formErrors.emergencyContacts && (
                  <div className="rounded-lg bg-error-50 p-3 dark:bg-error-500/10">
                    <p className="text-sm text-error-600 dark:text-error-400">
                      {formErrors.emergencyContacts}
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  {formData.emergencyContacts.map((contact, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-gray-200 p-4 dark:border-gray-800"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                          Contacto {index + 1}
                        </h4>
                        {formData.emergencyContacts.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeEmergencyContact(index)}
                            className="text-error-600 hover:text-error-800 dark:text-error-400"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        )}
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Nombre Completo
                          </label>
                          <input
                            type="text"
                            value={contact.name}
                            onChange={(e) =>
                              updateEmergencyContact(
                                index,
                                "name",
                                e.target.value
                              )
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-brand-400"
                            disabled={loading}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Teléfono
                          </label>
                          <input
                            type="tel"
                            value={contact.phone}
                            onChange={(e) =>
                              updateEmergencyContact(
                                index,
                                "phone",
                                e.target.value
                              )
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-brand-400"
                            disabled={loading}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Parentesco
                          </label>
                          <input
                            type="text"
                            value={contact.relationship}
                            onChange={(e) =>
                              updateEmergencyContact(
                                index,
                                "relationship",
                                e.target.value
                              )
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-brand-400"
                            placeholder="Madre, Padre, Hermano/a, etc."
                            disabled={loading}
                          />
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`main-contact-${index}`}
                            checked={contact.isMainContact}
                            onChange={(e) =>
                              updateEmergencyContact(
                                index,
                                "isMainContact",
                                e.target.checked
                              )
                            }
                            className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800"
                            disabled={loading}
                          />
                          <label
                            htmlFor={`main-contact-${index}`}
                            className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                          >
                            Contacto Principal
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Additional Information */}
            {currentStep === 3 && (
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Estado Civil
                  </label>
                  <select
                    value={formData.civilStatus}
                    onChange={(e) =>
                      handleInputChange(
                        "civilStatus",
                        e.target.value as CivilStatus
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-brand-400"
                    disabled={loading}
                  >
                    <option value="">Seleccionar estado civil</option>
                    {CIVIL_STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nacionalidad
                  </label>
                  <input
                    type="text"
                    value={formData.nationality}
                    onChange={(e) =>
                      handleInputChange("nationality", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-brand-400"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ocupación
                  </label>
                  <input
                    type="text"
                    value={formData.occupation}
                    onChange={(e) =>
                      handleInputChange("occupation", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-brand-400"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Idioma Preferido
                  </label>
                  <input
                    type="text"
                    value={formData.preferredLanguage}
                    onChange={(e) =>
                      handleInputChange("preferredLanguage", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-brand-400"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Referido Por
                  </label>
                  <input
                    type="text"
                    value={formData.referredBy}
                    onChange={(e) =>
                      handleInputChange("referredBy", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-brand-400"
                    placeholder="Dr. García, Familiar, etc."
                    disabled={loading}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notas Adicionales
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-brand-400"
                    placeholder="Notas generales sobre el paciente (no médicas)"
                    disabled={loading}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      handleInputChange("isActive", e.target.checked)
                    }
                    className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800"
                    disabled={loading}
                  />
                  <label
                    htmlFor="isActive"
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    Paciente activo
                  </label>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 dark:border-gray-800">
          <div className="flex gap-3">
            {currentStep > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={loading}
              >
                Anterior
              </Button>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button type="button" onClick={nextStep} disabled={loading}>
                Siguiente
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                loading={loading}
                disabled={loading}
              >
                {mode === "create" ? "Registrar Paciente" : "Guardar Cambios"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
