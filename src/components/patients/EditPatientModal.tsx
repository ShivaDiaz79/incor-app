"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import Modal from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";

import { patientsService } from "@/features/patients/service";
import type { Patient } from "@/features/patients/types";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9+\-\s()]{6,20}$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

type FormValues = {
  name: string;
  lastName: string;
  email?: string;
  phone: string;
  ci: string;
  dateOfBirth: string; // YYYY-MM-DD
  address: string;
  whatsappNumber?: string;

  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;

  medicalHistory?: string; // coma separated
  allergies?: string; // coma separated

  isActive?: boolean;
};

export default function EditPatientModal({
  isOpen,
  onClose,
  patientId,
  onSaved,
  showCloseButton = true,
  isFullscreen = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  onSaved?: (payload: { id: string }) => void;
  showCloseButton?: boolean;
  isFullscreen?: boolean;
}) {
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState<string | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      phone: "",
      ci: "",
      dateOfBirth: "",
      address: "",
      whatsappNumber: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelationship: "",
      medicalHistory: "",
      allergies: "",
      isActive: true,
    },
    mode: "onTouched",
  });

  const hardReset = useCallback(() => {
    setServerError(null);
    setPatient(null);
    setLoading(true);
    reset({
      name: "",
      lastName: "",
      email: "",
      phone: "",
      ci: "",
      dateOfBirth: "",
      address: "",
      whatsappNumber: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelationship: "",
      medicalHistory: "",
      allergies: "",
      isActive: true,
    });
  }, [reset]);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!isOpen || !patientId) return;
      setServerError(null);
      setLoading(true);
      try {
        const p = await patientsService.getById(patientId);
        if (!active) return;

        setPatient(p);

        // helpers
        const dob = p.dateOfBirth
          ? new Date(
              p.dateOfBirth.getTime() -
                p.dateOfBirth.getTimezoneOffset() * 60000
            )
              .toISOString()
              .slice(0, 10)
          : "";

        reset({
          name: p.name ?? "",
          lastName: p.lastName ?? "",
          email: p.email ?? "",
          phone: p.phone ?? "",
          ci: p.ci ?? "",
          dateOfBirth: dob,
          address: p.address ?? "",
          whatsappNumber: p.whatsappNumber ?? "",
          emergencyContactName: p.emergencyContact?.name ?? "",
          emergencyContactPhone: p.emergencyContact?.phone ?? "",
          emergencyContactRelationship: p.emergencyContact?.relationship ?? "",
          medicalHistory: (p.medicalHistory ?? []).join(", "),
          allergies: (p.allergies ?? []).join(", "),
          isActive: !!p.isActive,
        });
      } catch (e: unknown) {
        if (!active) return;
        setServerError(
          (e as Error)?.message || "No se pudo cargar el paciente."
        );
        setPatient(null);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [isOpen, patientId, reset]);

  function handleClose() {
    hardReset();
    onClose();
  }

  const toList = (v?: string) =>
    v
      ?.split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  async function onSubmit(v: FormValues) {
    setServerError(null);
    try {
      await patientsService.update(patientId, {
        name: v.name.trim(),
        lastName: v.lastName.trim(),
        email: v.email?.trim() || undefined,
        phone: v.phone.trim(),
        ci: v.ci.trim(),
        dateOfBirth: v.dateOfBirth, // YYYY-MM-DD (tu API la acepta así en update)
        address: v.address.trim(),
        whatsappNumber: v.whatsappNumber?.trim() || undefined,
        emergencyContact: {
          name: v.emergencyContactName.trim(),
          phone: v.emergencyContactPhone.trim(),
          relationship: v.emergencyContactRelationship.trim(),
        },
        medicalHistory: toList(v.medicalHistory),
        allergies: toList(v.allergies),
        isActive: typeof v.isActive === "boolean" ? v.isActive : undefined,
      });
      onSaved?.({ id: patientId });
      handleClose();
    } catch (err: unknown) {
      const msg =
        (err as Error)?.message?.replace("Firebase:", "").trim() ||
        "No se pudo guardar los cambios.";
      setServerError(msg);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Editar paciente">
      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white/90">
        Editar paciente
      </h3>
      <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
        Actualiza los datos del paciente.
      </p>

      {serverError && (
        <div className="mb-4 rounded-lg border border-error-500/40 bg-error-50 px-4 py-3 text-sm text-error-700 dark:border-error-500/30 dark:bg-error-500/15 dark:text-error-400">
          {serverError}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
          <div className="h-10 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-10 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-10 w-full animate-pulse rounded bg-slate-200" />
        </div>
      ) : !patient ? (
        <div className="text-sm text-slate-600">Paciente no encontrado.</div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* básicos */}
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="email">Email (opcional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="nombre@dominio.com"
                autoComplete="email"
                error={!!errors.email}
                hint={errors.email?.message}
                {...register("email", {
                  validate: (v) =>
                    !v || emailPattern.test(v) || "Email inválido",
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
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              <Label htmlFor="dateOfBirth">Fecha de nacimiento</Label>
              <Input
                id="dateOfBirth"
                type="date"
                placeholder="1990-05-15"
                error={!!errors.dateOfBirth}
                hint={errors.dateOfBirth?.message}
                {...register("dateOfBirth", {
                  required: "Requerido",
                  pattern: {
                    value: datePattern,
                    message: "Formato inválido (YYYY-MM-DD)",
                  },
                })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              placeholder="Av. América 123, Cochabamba"
              autoComplete="street-address"
              error={!!errors.address}
              hint={errors.address?.message}
              {...register("address", {
                required: "Requerido",
                minLength: { value: 4, message: "Mínimo 4 caracteres" },
              })}
            />
          </div>

          <div>
            <Label htmlFor="whatsappNumber">WhatsApp (opcional)</Label>
            <Input
              id="whatsappNumber"
              type="tel"
              placeholder="+591 7xx xx xxx"
              autoComplete="tel"
              error={!!errors.whatsappNumber}
              hint={errors.whatsappNumber?.message}
              {...register("whatsappNumber", {
                validate: (v) =>
                  !v || phonePattern.test(v) || "Número inválido",
              })}
            />
          </div>

          {/* contacto de emergencia */}
          <div className="mt-2 rounded-2xl border border-slate-200 p-4 dark:border-white/10">
            <h4 className="mb-3 text-sm font-medium text-slate-800 dark:text-slate-200">
              Contacto de emergencia
            </h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="emergencyContactName">Nombre</Label>
                <Input
                  id="emergencyContactName"
                  placeholder="María Gonzales"
                  error={!!errors.emergencyContactName}
                  hint={errors.emergencyContactName?.message}
                  {...register("emergencyContactName", {
                    required: "Requerido",
                    minLength: { value: 2, message: "Mínimo 2 caracteres" },
                  })}
                />
              </div>
              <div>
                <Label htmlFor="emergencyContactPhone">Teléfono</Label>
                <Input
                  id="emergencyContactPhone"
                  type="tel"
                  placeholder="+591 7xx xx xxx"
                  error={!!errors.emergencyContactPhone}
                  hint={errors.emergencyContactPhone?.message}
                  {...register("emergencyContactPhone", {
                    required: "Requerido",
                    pattern: {
                      value: phonePattern,
                      message: "Teléfono inválido",
                    },
                  })}
                />
              </div>
              <div>
                <Label htmlFor="emergencyContactRelationship">Relación</Label>
                <Input
                  id="emergencyContactRelationship"
                  placeholder="Madre / Padre / Cónyuge…"
                  error={!!errors.emergencyContactRelationship}
                  hint={errors.emergencyContactRelationship?.message}
                  {...register("emergencyContactRelationship", {
                    required: "Requerido",
                    minLength: { value: 2, message: "Mínimo 2 caracteres" },
                  })}
                />
              </div>
            </div>
          </div>

          {/* listas */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="medicalHistory">Historial médico</Label>
              <Input
                id="medicalHistory"
                placeholder="Diabetes, Hipertensión"
                hint="Separa con comas ( , )"
                {...register("medicalHistory")}
              />
            </div>
            <div>
              <Label htmlFor="allergies">Alergias</Label>
              <Input
                id="allergies"
                placeholder="Penicilina, Maní"
                hint="Separa con comas ( , )"
                {...register("allergies")}
              />
            </div>
          </div>

          {/* estado */}
          <div>
            <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                defaultChecked
                {...register("isActive")}
              />
              Paciente activo
            </label>
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
              Guardar cambios
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
