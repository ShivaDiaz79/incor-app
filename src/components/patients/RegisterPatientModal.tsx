"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { patientsService } from "@/features/patients/service";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9+\-\s()]{6,20}$/;

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

type FormValues = {
	name: string;
	lastName: string;
	email?: string;
	phone: string;
	ci: string;
	dateOfBirth: string;
	address: string;
	whatsappNumber?: string;

	emergencyContactName: string;
	emergencyContactPhone: string;
	emergencyContactRelationship: string;

	medicalHistory?: string;
	allergies?: string;

	isActive?: boolean;
};

export default function RegisterPatientModal({
	isOpen,
	onClose,
	onSuccess,
	showCloseButton = true,
	isFullscreen = false,
}: {
	isOpen: boolean;
	onClose: () => void;
	onSuccess?: (data: FormValues) => void;
	showCloseButton?: boolean;
	isFullscreen?: boolean;
}) {
	const [serverError, setServerError] = useState<string | null>(null);
	const [createdName, setCreatedName] = useState<string | null>(null);
	const closeTimerRef = useRef<number | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
		watch,
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

	useEffect(() => {
		return () => {
			if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
		};
	}, []);

	function hardReset() {
		setServerError(null);
		setCreatedName(null);
		reset();
	}

	function handleClose() {
		hardReset();
		onClose();
	}

	function toList(v?: string): string[] | undefined {
		if (!v) return undefined;
		const list = v
			.split(",")
			.map((s) => s.trim())
			.filter(Boolean);
		return list.length ? list : undefined;
	}

	async function onSubmit(values: FormValues) {
		setServerError(null);
		setCreatedName(null);

		try {
			const payload = {
				name: values.name.trim(),
				lastName: values.lastName.trim(),
				email: values.email?.trim() || undefined,
				phone: values.phone.trim(),
				ci: values.ci.trim(),
				dateOfBirth: values.dateOfBirth,
				address: values.address.trim(),
				whatsappNumber: values.whatsappNumber?.trim() || undefined,
				emergencyContact: {
					name: values.emergencyContactName.trim(),
					phone: values.emergencyContactPhone.trim(),
					relationship: values.emergencyContactRelationship.trim(),
				},
				medicalHistory: toList(values.medicalHistory),
				allergies: toList(values.allergies),
				isActive: typeof values.isActive === "boolean" ? values.isActive : true,
			};

			await patientsService.create(payload);

			onSuccess?.(values);
			setCreatedName(`${values.name} ${values.lastName}`.trim());
		} catch (err: unknown) {
			const message =
				(err as Error)?.message?.replace("Firebase:", "").trim() ||
				"No se pudo registrar el paciente.";
			setServerError(message);
		}
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			className="max-w-2xl p-6 sm:p-8"
			showCloseButton={showCloseButton}
			isFullscreen={isFullscreen}
		>
			<h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white/90">
				{createdName ? "Paciente registrado" : "Registrar paciente"}
			</h3>
			<p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
				{createdName
					? "El paciente se registró correctamente. ¿Qué deseas hacer ahora?"
					: "Completa los datos del paciente."}
			</p>

			{createdName ? (
				<div className="space-y-6">
					<div className="rounded-lg border border-success-500/40 bg-success-50 px-4 py-3 dark:border-success-500/30 dark:bg-success-500/15">
						<div className="text-sm">
							<span className="font-semibold">✅ {createdName}</span> fue
							registrado correctamente.
						</div>
					</div>

					<div className="flex items-center justify-end gap-2">
						<Button variant="outline" onClick={hardReset}>
							Registrar otro
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

					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						{/* Datos básicos */}
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

						{/* Contacto de emergencia */}
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

						{/* Listas opcionales */}
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div>
								<Label htmlFor="medicalHistory">
									Historial médico (opcional)
								</Label>
								<Input
									id="medicalHistory"
									placeholder="Diabetes, Hipertensión"
									error={!!errors.medicalHistory}
									hint="Separa con comas ( , )"
									{...register("medicalHistory")}
								/>
							</div>
							<div>
								<Label htmlFor="allergies">Alergias (opcional)</Label>
								<Input
									id="allergies"
									placeholder="Penicilina, Maní"
									error={!!errors.allergies}
									hint="Separa con comas ( , )"
									{...register("allergies")}
								/>
							</div>
						</div>

						{/* Estado */}
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
								Registrar paciente
							</Button>
						</div>
					</form>
				</>
			)}
		</Modal>
	);
}
