"use client";

import { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Modal from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import RHFSelect from "../form/react-hook-form/RHFSelect";
import { BookingFormValues } from "@/lib/types/booking.type";

type Option = { label: string; value: string };

export default function BookingModal({
  isOpen,
  onClose,
  showCloseButton = true,
  isFullscreen = false,
  clientOptions = [],
  medicalOptions = [],
  onSubmitLocal,
}: {
  isOpen: boolean;
  onClose: () => void;
  showCloseButton?: boolean;
  isFullscreen?: boolean;
  clientOptions?: Option[];
  medicalOptions?: Option[];
  onSubmitLocal?: (values: BookingFormValues) => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [createdCode, setCreatedCode] = useState<string | null>(null);
  const [selectKey, setSelectKey] = useState<number>(0);
  const closeTimerRef = useRef<number | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BookingFormValues>({
    defaultValues: {
      clientId: "",
      medicalId: "",
      date: "",
      area: "",
      observation: "",
      code: "",
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
    setCreatedCode(null);
    reset();
    setSelectKey((k) => k + 1);
  }

  function handleClose() {
    hardReset();
    onClose();
  }

  async function onSubmit(values: BookingFormValues) {
    setServerError(null);
    setCreatedCode(null);
    try {
      if (onSubmitLocal) onSubmitLocal(values);
      setCreatedCode(values.code || "RESERVA");
    } catch (err: unknown) {
      setServerError(
        (typeof err === "object" && err !== null && "message" in err
          ? (err as { message?: unknown }).message
              ?.toString()
              ?.replace("Firebase:", "")
              .trim()
          : undefined) || "No se pudo procesar el formulario."
      );
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={createdCode ? "Reserva creada" : "Nueva reserva"}
    >
      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white/90">
        {createdCode ? "Reserva creada" : "Nueva reserva"}
      </h3>
      <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
        {createdCode
          ? "La reserva se registró localmente. (No se enviaron datos)"
          : "Completa los datos de la reserva."}
      </p>

      {createdCode ? (
        <div className="space-y-6">
          <div className="rounded-lg border border-success-500/40 bg-success-50 px-4 py-3 dark:border-success-500/30 dark:bg-success-500/15">
            <div className="text-sm">
              <span className="font-semibold">✅ Código: {createdCode}</span>{" "}
              creado correctamente.
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                hardReset();
              }}
            >
              Crear otra
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
                <Label htmlFor="clientId">Cliente</Label>
                <Controller
                  control={control}
                  name="clientId"
                  rules={{
                    required: "Selecciona un cliente",
                    validate: (v) => v !== "" || "Selecciona un cliente",
                  }}
                  render={({ field }) => (
                    <div key={`client-${selectKey}`}>
                      <RHFSelect
                        options={clientOptions}
                        error={!!errors.clientId}
                        hint={errors.clientId?.message}
                        placeholder="Selecciona un cliente…"
                        defaultValue={field.value || ""}
                        onChange={(val) => field.onChange(val)}
                      />
                      {errors.clientId && (
                        <p className="mt-1.5 text-xs text-error-500">
                          {errors.clientId.message as string}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div>
                <Label htmlFor="medicalId">Médico</Label>
                <Controller
                  control={control}
                  name="medicalId"
                  rules={{
                    required: "Selecciona un médico",
                    validate: (v) => v !== "" || "Selecciona un médico",
                  }}
                  render={({ field }) => (
                    <div key={`medical-${selectKey}`}>
                      <RHFSelect
                        options={medicalOptions}
                        error={!!errors.medicalId}
                        hint={errors.medicalId?.message}
                        placeholder="Selecciona un médico…"
                        defaultValue={field.value || ""}
                        onChange={(val) => field.onChange(val)}
                      />
                      {errors.medicalId && (
                        <p className="mt-1.5 text-xs text-error-500">
                          {errors.medicalId.message as string}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                error={!!errors.date}
                hint={errors.date?.message}
                {...register("date", {
                  required: "Requerido",
                })}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="area">Área</Label>
                <Input
                  id="area"
                  placeholder="Cardiología"
                  autoComplete="off"
                  error={!!errors.area}
                  hint={errors.area?.message}
                  {...register("area", {
                    required: "Requerido",
                    minLength: { value: 2, message: "Mínimo 2 caracteres" },
                  })}
                />
              </div>

              <div>
                <Label htmlFor="code">Código</Label>
                <Input
                  id="code"
                  placeholder="BK-0001"
                  autoComplete="off"
                  error={!!errors.code}
                  hint={errors.code?.message}
                  {...register("code", {
                    required: "Requerido",
                    minLength: { value: 2, message: "Mínimo 2 caracteres" },
                  })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="observation">Observación</Label>
              {/* <Input
								id="observation"
								as="textarea"
								rows={3}
								placeholder="Notas adicionales…"
								error={!!errors.observation}
								hint={errors.observation?.message}
								{...register("observation")}
							/> */}
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <Button variant="outline" onClick={handleClose} type="button">
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
                Guardar
              </Button>
            </div>
          </form>
        </>
      )}
    </Modal>
  );
}
