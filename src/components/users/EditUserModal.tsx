"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";

import { usersService } from "@/features/users/service";
import type { User } from "@/features/users/types";

import { ROLES } from "@/constants/roles";

const ROLE_OPTIONS = Object.entries(ROLES).map(([key, value]) => ({
	value,
	label: key.charAt(0) + key.slice(1).toLowerCase(),
}));

type FormValues = {
	name: string;
	lastName: string;
	email: string;
	roleId: string | "";
};

export default function EditUserModal({
	isOpen,
	onClose,
	userId,
	onSaved,
	showCloseButton = true,
	isFullscreen = false,
}: {
	isOpen: boolean;
	onClose: () => void;
	userId: string;
	onSaved?: (updated: { id: string }) => void;
	showCloseButton?: boolean;
	isFullscreen?: boolean;
}) {
	const [loading, setLoading] = useState(true);
	const [serverError, setServerError] = useState<string | null>(null);
	const [user, setUser] = useState<User | null>(null);

	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>({
		defaultValues: {
			name: "",
			lastName: "",
			email: "",
			roleId: "",
		},
		mode: "onTouched",
	});

	useEffect(() => {
		let active = true;
		async function load() {
			setServerError(null);
			setLoading(true);
			try {
				const u = await usersService.getById(userId);
				if (!active) return;
				setUser(u);
				if (u) {
					reset({
						name: u.name ?? "",
						lastName: u.lastName ?? "",
						email: u.email ?? "",
						roleId: u.roleId ?? "",
					});
				}
			} catch (e: unknown) {
				if (!active) return;
				setServerError(
					(e as Error)?.message || "No se pudo cargar el usuario."
				);
			} finally {
				if (active) setLoading(false);
			}
		}
		if (isOpen && userId) load();
		return () => {
			active = false;
		};
	}, [isOpen, userId, reset]);

	async function onSubmit(v: FormValues) {
		setServerError(null);
		try {
			await usersService.update(userId, {
				name: v.name.trim(),
				lastName: v.lastName.trim(),
				roleId: v.roleId as string,
			});
			onSaved?.({ id: userId });
			onClose();
		} catch (err: unknown) {
			const msg =
				(err as Error)?.message?.replace("Firebase:", "").trim() ||
				"No se pudo guardar los cambios.";
			setServerError(msg);
		}
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			className="max-w-xl p-6 sm:p-8"
			showCloseButton={showCloseButton}
			isFullscreen={isFullscreen}
		>
			<h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white/90">
				Editar usuario
			</h3>
			<p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
				Actualiza los datos del usuario.
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
			) : !user ? (
				<div className="text-sm text-slate-600">Usuario no encontrado.</div>
			) : (
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
							disabled
							{...register("email")}
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
								<>
									<Select
										options={ROLE_OPTIONS}
										placeholder="Selecciona un rol…"
										defaultValue={field.value || ""}
										onChange={(val) => field.onChange(val as string)}
									/>
									{errors.roleId && (
										<p className="mt-1.5 text-xs text-error-500">
											{errors.roleId.message as string}
										</p>
									)}
								</>
							)}
						/>
					</div>

					<div className="mt-6 flex items-center justify-end gap-2">
						<Button variant="outline" type="button" onClick={onClose}>
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
