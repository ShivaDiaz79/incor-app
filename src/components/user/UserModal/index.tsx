// components/users/UserModal.tsx
"use client";

import { useState, useEffect } from "react";
import { useUserActions } from "@/hooks/useUsers";
import { useRoles } from "@/hooks/useRoles";
import Button from "@/components/ui/button/Button";
import Modal from "@/components/ui/modal";
import type { User, CreateUserRequest, UpdateUserRequest } from "@/types/users";
import { MEDICAL_SPECIALTIES } from "@/types/doctors";

interface UserModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  user?: User | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface UserFormData {
  email: string;
  name: string;
  lastName: string;
  phone: string;
  roleIds: string[];
  password: string;
  ci: string;
  isActive: boolean;
  firebaseUid: string;
}

interface DoctorFormData {
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
}

const initialUserData: UserFormData = {
  email: "",
  name: "",
  lastName: "",
  phone: "",
  roleIds: [],
  password: "",
  ci: "",
  isActive: true,
  firebaseUid: "",
};

const initialDoctorData: DoctorFormData = {
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
};

export function UserModal({
  isOpen,
  mode,
  user,
  onClose,
  onSuccess,
}: UserModalProps) {
  const { create, createWithDoctor, update, loading, error } = useUserActions();
  const { roles, loading: rolesLoading } = useRoles({
    limit: 100,
    isActive: true,
  });

  const [currentStep, setCurrentStep] = useState<"user" | "doctor">("user");
  const [userFormData, setUserFormData] =
    useState<UserFormData>(initialUserData);
  const [doctorFormData, setDoctorFormData] =
    useState<DoctorFormData>(initialDoctorData);
  const [userFormErrors, setUserFormErrors] = useState<Record<string, string>>(
    {}
  );
  const [doctorFormErrors, setDoctorFormErrors] = useState<
    Record<string, string>
  >({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep("user");

      if (mode === "edit" && user) {
        setUserFormData({
          email: user.email,
          name: user.name,
          lastName: user.lastName,
          phone: user.phone,
          roleIds: user.roleIds || [],
          password: "",
          ci: user.ci,
          isActive: user.isActive,
          firebaseUid: user.firebaseUid,
        });
      } else {
        setUserFormData(initialUserData);
      }

      setDoctorFormData(initialDoctorData);
      setUserFormErrors({});
      setDoctorFormErrors({});
    }
  }, [isOpen, mode, user]);

  const validateUserForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!userFormData.email) {
      errors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(userFormData.email)) {
      errors.email = "Email inválido";
    }

    if (!userFormData.name) {
      errors.name = "El nombre es requerido";
    }

    if (!userFormData.lastName) {
      errors.lastName = "El apellido es requerido";
    }

    if (!userFormData.phone) {
      errors.phone = "El teléfono es requerido";
    }

    if (!userFormData.roleIds || userFormData.roleIds.length === 0) {
      errors.roleIds = "Debe seleccionar al menos un rol";
    }

    if (mode === "create" && !userFormData.password) {
      errors.password = "La contraseña es requerida";
    } else if (userFormData.password && userFormData.password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (!userFormData.ci) {
      errors.ci = "El CI es requerido";
    }

    setUserFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateDoctorForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!doctorFormData.speciality) {
      errors.speciality = "La especialidad es requerida";
    }

    if (!doctorFormData.licenseNumber) {
      errors.licenseNumber = "El número de licencia es requerido";
    }

    if (!doctorFormData.medicalRegistration) {
      errors.medicalRegistration = "El registro médico es requerido";
    }

    if (
      doctorFormData.consultationFee &&
      isNaN(Number(doctorFormData.consultationFee))
    ) {
      errors.consultationFee = "Debe ser un número válido";
    }

    if (doctorFormData.experience && isNaN(Number(doctorFormData.experience))) {
      errors.experience = "Debe ser un número válido";
    }

    setDoctorFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUserNext = () => {
    if (!validateUserForm()) {
      return;
    }

    // Verificar si alguno de los roles seleccionados contiene "doctor" en el nombre
    const hasDoctorRole = roles.some(
      (role) =>
        userFormData.roleIds.includes(role.id) &&
        role.name.toLowerCase().includes("doctor")
    );

    if (hasDoctorRole) {
      setCurrentStep("doctor");
    } else {
      handleSubmitUser();
    }
  };

  const handleSubmitUser = async () => {
    if (!validateUserForm()) {
      return;
    }

    try {
      const submitData: CreateUserRequest | UpdateUserRequest = {
        email: userFormData.email,
        name: userFormData.name,
        lastName: userFormData.lastName,
        phone: userFormData.phone,
        roleIds: userFormData.roleIds,
        ci: userFormData.ci,
        isActive: userFormData.isActive,
        firebaseUid: userFormData.firebaseUid || undefined,
      };

      if (mode === "create" && userFormData.password) {
        (submitData as CreateUserRequest).password = userFormData.password;
      }

      if (mode === "create") {
        await create(submitData as CreateUserRequest);
      } else if (user) {
        await update(user.id, submitData as UpdateUserRequest);
      }

      onSuccess();
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  const handleSubmitUserWithDoctor = async () => {
    if (!validateUserForm() || !validateDoctorForm()) {
      return;
    }

    try {
      const userSubmitData: CreateUserRequest = {
        email: userFormData.email,
        name: userFormData.name,
        lastName: userFormData.lastName,
        phone: userFormData.phone,
        roleIds: userFormData.roleIds,
        password: userFormData.password,
        ci: userFormData.ci,
        isActive: userFormData.isActive,
        firebaseUid: userFormData.firebaseUid || undefined,
      };

      const doctorSubmitData = {
        speciality: doctorFormData.speciality,
        licenseNumber: doctorFormData.licenseNumber,
        medicalRegistration: doctorFormData.medicalRegistration,
        consultationFee: doctorFormData.consultationFee
          ? Number(doctorFormData.consultationFee)
          : undefined,
        profilePhoto: doctorFormData.profilePhoto || undefined,
        biography: doctorFormData.biography || undefined,
        languages:
          doctorFormData.languages.length > 0
            ? doctorFormData.languages
            : undefined,
        certifications:
          doctorFormData.certifications.length > 0
            ? doctorFormData.certifications
            : undefined,
        experience: doctorFormData.experience
          ? Number(doctorFormData.experience)
          : undefined,
        education:
          doctorFormData.education.length > 0
            ? doctorFormData.education
            : undefined,
        signature: doctorFormData.signature || undefined,
      };

      await createWithDoctor({
        user: userSubmitData,
        doctor: doctorSubmitData,
      });

      onSuccess();
    } catch (err) {
      console.error("Error saving user with doctor:", err);
    }
  };

  const handleArrayInputChange = (
    field: keyof DoctorFormData,
    value: string
  ) => {
    const array = value.split("\n").filter((item) => item.trim() !== "");
    setDoctorFormData((prev) => ({
      ...prev,
      [field]: array,
    }));
  };

  const handleBackToUser = () => {
    setCurrentStep("user");
  };

  if (!isOpen) return null;

  const isUserStep = currentStep === "user";
  const isDoctorStep = currentStep === "doctor";
  const isEditMode = mode === "edit";

  // Verificar si tiene roles de doctor seleccionados
  const hasDoctorRole = roles.some(
    (role) =>
      userFormData.roleIds.includes(role.id) &&
      role.name.toLowerCase().includes("doctor")
  );

  const title = isEditMode
    ? "Editar Usuario"
    : isDoctorStep
    ? "Datos del Doctor"
    : "Registrar Usuario";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="4xl">
      <div className="space-y-6">
        {/* Step Indicator for Doctor Creation */}
        {!isEditMode && hasDoctorRole && (
          <div className="flex items-center justify-center space-x-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                isUserStep
                  ? "bg-brand-500 text-white"
                  : "bg-success-500 text-white"
              }`}
            >
              {isUserStep ? "1" : "✓"}
            </div>
            <div
              className={`h-0.5 w-8 ${
                isUserStep ? "bg-gray-300" : "bg-success-500"
              }`}
            ></div>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                isDoctorStep
                  ? "bg-brand-500 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              2
            </div>
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              {isUserStep ? "Datos de Usuario" : "Datos de Doctor"}
            </span>
          </div>
        )}

        {/* User Form Step */}
        {isUserStep && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email *
              </label>
              <input
                type="email"
                value={userFormData.email}
                onChange={(e) =>
                  setUserFormData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                placeholder="usuario@ejemplo.com"
              />
              {userFormErrors.email && (
                <p className="mt-1 text-sm text-error-600">
                  {userFormErrors.email}
                </p>
              )}
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nombre *
              </label>
              <input
                type="text"
                value={userFormData.name}
                onChange={(e) =>
                  setUserFormData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                placeholder="Nombre"
              />
              {userFormErrors.name && (
                <p className="mt-1 text-sm text-error-600">
                  {userFormErrors.name}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Apellido *
              </label>
              <input
                type="text"
                value={userFormData.lastName}
                onChange={(e) =>
                  setUserFormData((prev) => ({
                    ...prev,
                    lastName: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                placeholder="Apellido"
              />
              {userFormErrors.lastName && (
                <p className="mt-1 text-sm text-error-600">
                  {userFormErrors.lastName}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Teléfono *
              </label>
              <input
                type="tel"
                value={userFormData.phone}
                onChange={(e) =>
                  setUserFormData((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                placeholder="+591 12345678"
              />
              {userFormErrors.phone && (
                <p className="mt-1 text-sm text-error-600">
                  {userFormErrors.phone}
                </p>
              )}
            </div>

            {/* CI */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Carnet de Identidad *
              </label>
              <input
                type="text"
                value={userFormData.ci}
                onChange={(e) =>
                  setUserFormData((prev) => ({ ...prev, ci: e.target.value }))
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                placeholder="12345678"
              />
              {userFormErrors.ci && (
                <p className="mt-1 text-sm text-error-600">
                  {userFormErrors.ci}
                </p>
              )}
            </div>

            {/* Roles - Updated for multiple selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Roles *
              </label>
              {rolesLoading ? (
                <div className="mt-1 h-32 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
              ) : (
                <div className="mt-1 space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3 dark:border-gray-600 dark:bg-gray-700">
                  {roles.map((role) => (
                    <label
                      key={role.id}
                      className="flex items-start gap-3 py-1"
                    >
                      <input
                        type="checkbox"
                        checked={userFormData.roleIds.includes(role.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setUserFormData((prev) => ({
                              ...prev,
                              roleIds: [...prev.roleIds, role.id],
                            }));
                          } else {
                            setUserFormData((prev) => ({
                              ...prev,
                              roleIds: prev.roleIds.filter(
                                (id) => id !== role.id
                              ),
                            }));
                          }
                        }}
                        disabled={isEditMode}
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700"
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {role.name}
                        </span>
                        {role.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {role.description}
                          </p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              )}
              {userFormErrors.roleIds && (
                <p className="mt-1 text-sm text-error-600">
                  {userFormErrors.roleIds}
                </p>
              )}
              {!isEditMode && hasDoctorRole && (
                <p className="mt-1 text-sm text-blue-600">
                  ℹ️ Siguiente paso: completar datos del doctor
                </p>
              )}
            </div>

            {/* Password */}
            {(mode === "create" || userFormData.password) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contraseña {mode === "create" ? "*" : ""}
                </label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={userFormData.password}
                    onChange={(e) =>
                      setUserFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                    placeholder={
                      mode === "edit"
                        ? "Dejar vacío para mantener actual"
                        : "Mínimo 6 caracteres"
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? (
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
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {userFormErrors.password && (
                  <p className="mt-1 text-sm text-error-600">
                    {userFormErrors.password}
                  </p>
                )}
              </div>
            )}

            {/* Firebase UID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Firebase UID
              </label>
              <input
                type="text"
                value={userFormData.firebaseUid}
                onChange={(e) =>
                  setUserFormData((prev) => ({
                    ...prev,
                    firebaseUid: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                placeholder="UID de Firebase (opcional)"
              />
            </div>

            {/* Active Status */}
            <div className="lg:col-span-2">
              <div className="flex items-center">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={userFormData.isActive}
                  onChange={(e) =>
                    setUserFormData((prev) => ({
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
                  Usuario activo (puede acceder al sistema)
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Doctor Form Step */}
        {isDoctorStep && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Specialty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Especialidad *
              </label>
              <select
                value={doctorFormData.speciality}
                onChange={(e) =>
                  setDoctorFormData((prev) => ({
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
              {doctorFormErrors.speciality && (
                <p className="mt-1 text-sm text-error-600">
                  {doctorFormErrors.speciality}
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
                value={doctorFormData.licenseNumber}
                onChange={(e) =>
                  setDoctorFormData((prev) => ({
                    ...prev,
                    licenseNumber: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                placeholder="Ej: DOC123456"
              />
              {doctorFormErrors.licenseNumber && (
                <p className="mt-1 text-sm text-error-600">
                  {doctorFormErrors.licenseNumber}
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
                value={doctorFormData.medicalRegistration}
                onChange={(e) =>
                  setDoctorFormData((prev) => ({
                    ...prev,
                    medicalRegistration: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                placeholder="Ej: MED789012"
              />
              {doctorFormErrors.medicalRegistration && (
                <p className="mt-1 text-sm text-error-600">
                  {doctorFormErrors.medicalRegistration}
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
                value={doctorFormData.consultationFee}
                onChange={(e) =>
                  setDoctorFormData((prev) => ({
                    ...prev,
                    consultationFee: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                placeholder="150"
              />
              {doctorFormErrors.consultationFee && (
                <p className="mt-1 text-sm text-error-600">
                  {doctorFormErrors.consultationFee}
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
                value={doctorFormData.experience}
                onChange={(e) =>
                  setDoctorFormData((prev) => ({
                    ...prev,
                    experience: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                placeholder="15"
              />
              {doctorFormErrors.experience && (
                <p className="mt-1 text-sm text-error-600">
                  {doctorFormErrors.experience}
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
                value={doctorFormData.profilePhoto}
                onChange={(e) =>
                  setDoctorFormData((prev) => ({
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
                value={doctorFormData.biography}
                onChange={(e) =>
                  setDoctorFormData((prev) => ({
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
                value={doctorFormData.languages.join("\n")}
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
                value={doctorFormData.certifications.join("\n")}
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
                value={doctorFormData.education.join("\n")}
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
          </div>
        )}

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
                <p className="text-sm text-error-800 dark:text-error-200">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          {isDoctorStep && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBackToUser}
              disabled={loading}
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Anterior
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>

          <Button
            type="button"
            onClick={isDoctorStep ? handleSubmitUserWithDoctor : handleUserNext}
            disabled={loading}
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
                {isDoctorStep ? "Creando..." : "Procesando..."}
              </>
            ) : (
              <>
                {isDoctorStep ? (
                  "Crear Usuario y Doctor"
                ) : isEditMode ? (
                  "Actualizar Usuario"
                ) : hasDoctorRole ? (
                  <>
                    Siguiente
                    <svg
                      className="ml-2 h-4 w-4"
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
                  </>
                ) : (
                  "Crear Usuario"
                )}
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
