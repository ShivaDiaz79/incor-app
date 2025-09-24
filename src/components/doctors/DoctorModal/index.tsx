// components/doctors/DoctorModal.tsx
"use client";

import { useState, useEffect } from "react";
import { useDoctorActions, useAvailableUsers } from "@/hooks/useDoctors";
import Button from "@/components/ui/button/Button";
import type {
  Doctor,
  CreateDoctorRequest,
  UpdateDoctorRequest,
} from "@/types/doctors";
import { MEDICAL_SPECIALTIES } from "@/types/doctors";

interface DoctorModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  doctor?: Doctor | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  userId: string;
  speciality: string;
  licenseNumber: string;
  medicalRegistration: string;
  consultationFee: string;
  profilePhoto: string;
  biography: string;
  languages: string[];
  certifications: string[];
  experience: string;
  education: string[];
  signature: string;
  isActive: boolean;
}

const initialFormData: FormData = {
  userId: "",
  speciality: "",
  licenseNumber: "",
  medicalRegistration: "",
  consultationFee: "",
  profilePhoto: "",
  biography: "",
  languages: [],
  certifications: [],
  experience: "",
  education: [],
  signature: "",
  isActive: true,
};

export function DoctorModal({
  isOpen,
  mode,
  doctor,
  onClose,
  onSuccess,
}: DoctorModalProps) {
  const { create, update, loading, error } = useDoctorActions();
  const {
    users,
    loading: usersLoading,
    search: searchUsers,
  } = useAvailableUsers();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [userSearch, setUserSearch] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (mode === "edit" && doctor) {
        setFormData({
          userId: doctor.userId,
          speciality: doctor.speciality,
          licenseNumber: doctor.licenseNumber,
          medicalRegistration: doctor.medicalRegistration,
          consultationFee: doctor.consultationFee?.toString() || "",
          profilePhoto: doctor.profilePhoto || "",
          biography: doctor.biography || "",
          languages: doctor.languages || [],
          certifications: doctor.certifications || [],
          experience: doctor.experience?.toString() || "",
          education: doctor.education || [],
          signature: doctor.signature || "",
          isActive: doctor.isActive,
        });
      } else {
        setFormData(initialFormData);
      }
      setFormErrors({});
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, mode, doctor]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (mode === "create" && !formData.userId) {
      errors.userId = "Selecciona un usuario";
    }
    if (!formData.speciality) {
      errors.speciality = "La especialidad es requerida";
    }
    if (!formData.licenseNumber) {
      errors.licenseNumber = "El número de licencia es requerido";
    }
    if (!formData.medicalRegistration) {
      errors.medicalRegistration = "El registro médico es requerido";
    }
    if (formData.consultationFee && isNaN(Number(formData.consultationFee))) {
      errors.consultationFee = "Debe ser un número válido";
    }
    if (formData.experience && isNaN(Number(formData.experience))) {
      errors.experience = "Debe ser un número válido";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const submitData = {
        ...formData,
        consultationFee: formData.consultationFee
          ? Number(formData.consultationFee)
          : undefined,
        experience: formData.experience
          ? Number(formData.experience)
          : undefined,
        languages:
          formData.languages.length > 0 ? formData.languages : undefined,
        certifications:
          formData.certifications.length > 0
            ? formData.certifications
            : undefined,
        education:
          formData.education.length > 0 ? formData.education : undefined,
        profilePhoto: formData.profilePhoto || undefined,
        biography: formData.biography || undefined,
        signature: formData.signature || undefined,
      };

      if (mode === "create") {
        await create(submitData as CreateDoctorRequest);
      } else if (doctor) {
        const { userId, ...updateData } = submitData;
        await update(doctor.id, updateData as UpdateDoctorRequest);
      }

      onSuccess();
    } catch (err) {
      console.error("Error saving doctor:", err);
    }
  };

  const handleArrayInputChange = (field: keyof FormData, value: string) => {
    const array = value.split("\n").filter((item) => item.trim() !== "");
    setFormData((prev) => ({
      ...prev,
      [field]: array,
    }));
  };

  const handleUserSearch = (searchTerm: string) => {
    setUserSearch(searchTerm);
    if (searchTerm.length >= 2) {
      searchUsers(searchTerm);
    }
  };

  if (!isOpen) return null;

  const title = mode === "create" ? "Registrar Doctor" : "Editar Doctor";
  const selectedUser = users.find((user) => user.id === formData.userId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-xl dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
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

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* User Selection - Only for create mode */}
            {mode === "create" && (
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Usuario *
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    placeholder="Buscar usuario por nombre, email..."
                    value={userSearch}
                    onChange={(e) => handleUserSearch(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-brand-400 dark:focus:ring-brand-400"
                  />

                  {userSearch.length >= 2 && (
                    <div className="mt-2 max-h-40 overflow-y-auto rounded-lg border border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800">
                      {usersLoading ? (
                        <div className="p-3 text-center text-sm text-gray-500">
                          Buscando usuarios...
                        </div>
                      ) : users.length > 0 ? (
                        users.map((user) => (
                          <button
                            key={user.id}
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                userId: user.id,
                              }));
                              setUserSearch(`${user.name} ${user.lastName}`);
                            }}
                            className={`w-full p-3 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${
                              formData.userId === user.id
                                ? "bg-brand-50 dark:bg-brand-900"
                                : ""
                            }`}
                          >
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                              {user.name} {user.lastName}
                            </div>
                            <div className="text-gray-500 dark:text-gray-400">
                              {user.email} • {user.ci}
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="p-3 text-center text-sm text-gray-500">
                          No se encontraron usuarios
                        </div>
                      )}
                    </div>
                  )}

                  {selectedUser && (
                    <div className="mt-2 rounded-lg border border-brand-200 bg-brand-50 p-3 dark:border-brand-800 dark:bg-brand-900">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Usuario seleccionado: {selectedUser.name}{" "}
                        {selectedUser.lastName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {selectedUser.email} • {selectedUser.ci}
                      </div>
                    </div>
                  )}
                </div>
                {formErrors.userId && (
                  <p className="mt-1 text-sm text-error-600">
                    {formErrors.userId}
                  </p>
                )}
              </div>
            )}

            {/* Edit mode - Show current user */}
            {mode === "edit" && doctor?.user && (
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Usuario
                </label>
                <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {doctor.user.name} {doctor.user.lastName}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {doctor.user.email} • {doctor.user.phone}
                  </div>
                </div>
              </div>
            )}

            {/* Specialty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Especialidad *
              </label>
              <select
                value={formData.speciality}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    speciality: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">Seleccionar especialidad</option>
                {MEDICAL_SPECIALTIES.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
              {formErrors.speciality && (
                <p className="mt-1 text-sm text-error-600">
                  {formErrors.speciality}
                </p>
              )}
            </div>

            {/* License Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Número de Licencia *
              </label>
              <input
                type="text"
                value={formData.licenseNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    licenseNumber: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                placeholder="Ej: DOC123456"
              />
              {formErrors.licenseNumber && (
                <p className="mt-1 text-sm text-error-600">
                  {formErrors.licenseNumber}
                </p>
              )}
            </div>

            {/* Medical Registration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Registro Médico *
              </label>
              <input
                type="text"
                value={formData.medicalRegistration}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    medicalRegistration: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                placeholder="Ej: MED789012"
              />
              {formErrors.medicalRegistration && (
                <p className="mt-1 text-sm text-error-600">
                  {formErrors.medicalRegistration}
                </p>
              )}
            </div>

            {/* Consultation Fee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tarifa de Consulta (Bs.)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.consultationFee}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    consultationFee: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                placeholder="150"
              />
              {formErrors.consultationFee && (
                <p className="mt-1 text-sm text-error-600">
                  {formErrors.consultationFee}
                </p>
              )}
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Años de Experiencia
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={formData.experience}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    experience: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                placeholder="15"
              />
              {formErrors.experience && (
                <p className="mt-1 text-sm text-error-600">
                  {formErrors.experience}
                </p>
              )}
            </div>

            {/* Profile Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                URL Foto de Perfil
              </label>
              <input
                type="url"
                value={formData.profilePhoto}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    profilePhoto: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                placeholder="https://ejemplo.com/foto.jpg"
              />
            </div>

            {/* Biography */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Biografía Profesional
              </label>
              <textarea
                rows={3}
                value={formData.biography}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    biography: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                placeholder="Descripción profesional del doctor..."
              />
            </div>

            {/* Languages */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Idiomas
              </label>
              <textarea
                rows={2}
                value={formData.languages.join("\n")}
                onChange={(e) =>
                  handleArrayInputChange("languages", e.target.value)
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                placeholder="Español&#10;Inglés&#10;Francés"
              />
              <p className="mt-1 text-xs text-gray-500">Un idioma por línea</p>
            </div>

            {/* Certifications */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Certificaciones
              </label>
              <textarea
                rows={2}
                value={formData.certifications.join("\n")}
                onChange={(e) =>
                  handleArrayInputChange("certifications", e.target.value)
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                placeholder="Certificación en Cardiología&#10;CPR Certificado"
              />
              <p className="mt-1 text-xs text-gray-500">
                Una certificación por línea
              </p>
            </div>

            {/* Education */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Educación
              </label>
              <textarea
                rows={3}
                value={formData.education.join("\n")}
                onChange={(e) =>
                  handleArrayInputChange("education", e.target.value)
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                placeholder="MD de Universidad Central&#10;Residencia en Hospital Nacional&#10;Especialización en Cardiología"
              />
              <p className="mt-1 text-xs text-gray-500">
                Una institución o título por línea
              </p>
            </div>

            {/* Status */}
            <div className="lg:col-span-2">
              <div className="flex items-center">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-brand-400"
                />
                <label
                  htmlFor="isActive"
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  Doctor activo (puede realizar consultas)
                </label>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 rounded-lg border border-error-200 bg-error-50 p-4 dark:border-error-800 dark:bg-error-500/10">
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
                  <p className="text-sm text-error-800 dark:text-error-200">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
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
                  {mode === "create" ? "Creando..." : "Actualizando..."}
                </>
              ) : (
                <>{mode === "create" ? "Crear Doctor" : "Actualizar Doctor"}</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
