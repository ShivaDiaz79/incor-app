"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import Modal from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { usersService } from "@/features/users/service";

import { ROLE_LABEL } from "@/constants/roles";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9+\-\s()]{6,20}$/;

type FormValues = {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  ci: string;
  password?: string;
};

export default function RegisterUserModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (data: FormValues) => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [createdName, setCreatedName] = useState<string | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const [showPwd, setShowPwd] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      phone: "",
      ci: "",
      password: "",
    },
    mode: "onTouched",
  });

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  function hardReset() {
    setServerError(null);
    setCreatedName(null);
    reset();
    setShowPwd(false);
  }

  function handleClose() {
    hardReset();
    onClose();
  }

  async function onSubmit(values: FormValues) {
    setServerError(null);
    setCreatedName(null);

    try {
      const payload = {
        email: values.email,
        name: values.name,
        lastName: values.lastName,
        phone: values.phone,
        roleId: "",
        ci: values.ci,
        isActive: true,
        ...(values.password ? { password: values.password } : {}),
      };

      console.log("Payload being sent:", payload); // Debug log

      await usersService.create(payload);

      if (onSuccess) onSuccess(values);
      setCreatedName(`${values.name} ${values.lastName}`.trim());
    } catch (err: unknown) {
      console.error("Error creating user:", err); // Debug log
      const message =
        (err as Error)?.message?.replace("Firebase:", "").trim() ||
        "No se pudo crear el usuario.";
      setServerError(message);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={createdName ? "Usuario creado" : "Registrar usuario"}
      maxWidth="xl"
    >
      <div className="p-6 sm:p-8">
        <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
          {createdName
            ? "El usuario se creó correctamente. ¿Qué deseas hacer ahora?"
            : "Completa los datos del usuario y asigna su rol."}
        </p>

        {createdName ? (
          <div className="space-y-6">
            <div className="rounded-lg border border-success-500/40 bg-success-50 px-4 py-3 dark:border-success-500/30 dark:bg-success-500/15">
              <div className="text-sm">
                <span className="font-semibold">✅ {createdName}</span> fue
                creado correctamente.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={hardReset}>
                Crear otro
              </Button>
              <Button onClick={handleClose}>Cerrar</Button>
            </div>
          </div>
        ) : (
          <>
            {serverError && (
              <div className="mb-4 rounded-lg border border-error-500/40 bg-error-50 px-4 py-3 text-sm text-error-700 dark:border-error-500/30 dark:bg-error-500/15 dark:text-error-400">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Nombres</Label>
                  <Input
                    id="name"
                    placeholder="Juan"
                    autoComplete="given-name"
                    error={!!errors.name}
                    hint={errors.name?.message}
                    {...register("name", {
                      required: "Requerido",
                      minLength: { value: 2, message: "Mínimo 2 caracteres" },
                    })}
                  />
                </div>

                <div>
                  <Label htmlFor="lastName">Apellidos</Label>
                  <Input
                    id="lastName"
                    placeholder="Pérez"
                    autoComplete="family-name"
                    error={!!errors.lastName}
                    hint={errors.lastName?.message}
                    {...register("lastName", {
                      required: "Requerido",
                      minLength: { value: 2, message: "Mínimo 2 caracteres" },
                    })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nombre@empresa.com"
                  autoComplete="email"
                  error={!!errors.email}
                  hint={errors.email?.message}
                  {...register("email", {
                    required: "Requerido",
                    pattern: { value: emailPattern, message: "Email inválido" },
                  })}
                />
              </div>

              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+591 7xx xx xxx"
                  autoComplete="tel"
                  error={!!errors.phone}
                  hint={errors.phone?.message}
                  {...register("phone", {
                    required: "Requerido",
                    pattern: {
                      value: phonePattern,
                      message: "Teléfono inválido",
                    },
                  })}
                />
              </div>

              <div>
                <Label htmlFor="ci">CI</Label>
                <Input
                  id="ci"
                  placeholder="12345678"
                  autoComplete="off"
                  error={!!errors.ci}
                  hint={errors.ci?.message}
                  {...register("ci", {
                    required: "Requerido",
                    minLength: { value: 5, message: "Mínimo 5 caracteres" },
                  })}
                />
              </div>

              <div>
                <Label htmlFor="password">Contraseña (opcional)</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPwd ? "text" : "password"}
                    placeholder="Mínimo 8 caracteres"
                    autoComplete="new-password"
                    error={!!errors.password}
                    hint={errors.password?.message}
                    {...register("password", {
                      minLength: {
                        value: 8,
                        message: "Debe tener al menos 8 caracteres",
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="absolute inset-y-0 right-2 my-auto rounded-md px-2 text-xs text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10"
                    aria-label={
                      showPwd ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                  >
                    {showPwd ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
                <p className="mt-1.5 text-xs text-gray-500">
                  Déjalo en blanco si prefieres que el usuario defina su
                  contraseña luego.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2">
                <Button variant="outline" type="button" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <svg
                      className="mr-2 h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
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
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                  )}
                  Crear usuario
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </Modal>
  );
}
