"use client";

import { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import RHFSelect from "../form/react-hook-form/RHFSelect";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const phonePattern = /^[0-9+\-\s()]{6,20}$/;

type FormValues = {
	name: string;
	lastName: string;
	email: string;
	phone: string;
	roleId: string;
};

export default function RegisterUserModal({
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
	const [selectKey, setSelectKey] = useState<number>(0);
	const closeTimerRef = useRef<number | null>(null);

	const {
		register,
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<FormValues>({
		defaultValues: {
			name: "",
			lastName: "",
			email: "",
			phone: "",
			roleId: "",
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
		setSelectKey((k) => k + 1);
	}

	function handleClose() {
		hardReset();
		onClose();
	}

	async function onSubmit(values: FormValues) {
		setServerError(null);
		setCreatedName(null);
		try {
			console.log("[Users] submit:", values);
			if (onSuccess) onSuccess(values);
			setCreatedName(`${values.name} ${values.lastName}`.trim());
		} catch (err: any) {
			const message =
				err?.message?.replace("Firebase:", "").trim() ||
				"No se pudo crear el usuario.";
			setServerError(message);
		}
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			className="max-w-xl p-6 sm:p-8"
			showCloseButton={showCloseButton}
			isFullscreen={isFullscreen}
		>
			<h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white/90">
				{createdName ? "Usuario creado" : "Registrar usuario"}
			</h3>
			<p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
				{createdName
					? "El usuario se creó correctamente. ¿Qué deseas hacer ahora?"
					: "Completa los datos del usuario y asigna su rol."}
			</p>

			{createdName ? (
				<div className="space-y-6">
					<div className="rounded-lg border border-success-500/40 bg-success-50 px-4 py-3 dark:border-success-500/30 dark:bg-success-500/15">
						<div className="text-sm">
							<span className="font-semibold">✅ {createdName}</span> fue creado
							correctamente.
						</div>
					</div>

					<div className="flex items-center justify-end gap-2">
						<Button
							variant="outline"
							onClick={() => {
								hardReset();
							}}
						>
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
							<Label htmlFor="roleId">Rol</Label>
							<Controller
								control={control}
								name="roleId"
								rules={{
									required: "Selecciona un rol",
									validate: (v) => v !== "" || "Selecciona un rol",
								}}
								render={({ field }) => (
									<div key={selectKey}>
										<RHFSelect
											options={[
												{ label: "Administrador", value: "admin" },
												{ label: "Editor", value: "editor" },
												{ label: "Colaborador", value: "contributor" },
											]}
											error={!!errors.roleId}
											hint={errors.roleId?.message}
											placeholder="Selecciona un rol…"
											defaultValue={field.value || ""}
											onChange={(val) => field.onChange(val)}
										/>
										{errors.roleId && (
											<p className="mt-1.5 text-xs text-error-500">
												{errors.roleId.message as string}
											</p>
										)}
									</div>
								)}
							/>
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
		</Modal>
	);
}
