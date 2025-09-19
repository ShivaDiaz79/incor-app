"use client";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/features/auth/service";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9+\-\s()]{6,20}$/;

export default function SignUpForm() {
	const [showPassword, setShowPassword] = useState(false);

	const [name, setName] = useState("");
	const [lastName, setLastName] = useState("");

	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [ci, setCi] = useState("");
	const [password, setPassword] = useState("");

	const [loading, setLoading] = useState(false);
	const [localError, setLocalError] = useState("");

	const router = useRouter();

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLocalError("");

		if (!name.trim() || !lastName.trim()) {
			setLocalError("Por favor, completa tu nombre y apellido.");
			return;
		}
		if (!emailPattern.test(email)) {
			setLocalError("Ingresa un correo válido.");
			return;
		}
		if (!phonePattern.test(phone)) {
			setLocalError("Ingresa un teléfono válido.");
			return;
		}
		if (!ci.trim() || ci.trim().length < 5) {
			setLocalError("Ingresa un documento de identidad válido.");
			return;
		}
		if (password.length < 8) {
			setLocalError("La contraseña debe tener al menos 8 caracteres.");
			return;
		}

		try {
			setLoading(true);
			await authService.register({
				email: email.trim(),
				name: name.trim(),
				lastName: lastName.trim(),
				phone: phone.trim(),
				ci: ci.trim(),
				password,
			});

			router.replace("/signin");
		} catch (err: unknown) {
			const msg =
				(err as Error)?.message?.replace("Firebase:", "").trim() ||
				"No se pudo completar el registro.";
			setLocalError(msg);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="flex flex-col flex-1 lg:w-1/2 w-full">
			<div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
				<Link
					href="/"
					className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
				>
					<ChevronLeftIcon />
					Volver al inicio
				</Link>
			</div>

			<div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
				<div>
					<div className="mb-5 sm:mb-8">
						<h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
							Crear cuenta
						</h1>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Completa los datos para registrar tu cuenta.
						</p>
					</div>

					<form onSubmit={handleSubmit}>
						<div className="space-y-4">
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<div>
									<Label>
										Nombres <span className="text-error-500">*</span>
									</Label>
									<Input
										placeholder="Tu nombre"
										value={name}
										onChange={(e) => setName(e.target.value)}
										autoComplete="given-name"
										required
									/>
								</div>
								<div>
									<Label>
										Apellidos <span className="text-error-500">*</span>
									</Label>
									<Input
										placeholder="Tus apellidos"
										value={lastName}
										onChange={(e) => setLastName(e.target.value)}
										autoComplete="family-name"
										required
									/>
								</div>
							</div>

							<div>
								<Label>
									Correo electrónico <span className="text-error-500">*</span>
								</Label>
								<Input
									placeholder="correo@dominio.com"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									autoComplete="email"
									required
								/>
							</div>

							<div>
								<Label>
									Teléfono <span className="text-error-500">*</span>
								</Label>
								<Input
									placeholder="Número de teléfono"
									type="tel"
									value={phone}
									onChange={(e) => setPhone(e.target.value)}
									autoComplete="tel"
									required
								/>
							</div>

							<div>
								<Label>
									Documento de identidad{" "}
									<span className="text-error-500">*</span>
								</Label>
								<Input
									placeholder="Documento de identidad"
									value={ci}
									onChange={(e) => setCi(e.target.value)}
									autoComplete="off"
									required
								/>
							</div>

							<div>
								<Label>
									Contraseña <span className="text-error-500">*</span>
								</Label>
								<div className="relative">
									<Input
										type={showPassword ? "text" : "password"}
										placeholder="Crea una contraseña"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										autoComplete="new-password"
										required
									/>
									<span
										onClick={() => setShowPassword(!showPassword)}
										className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
									>
										{showPassword ? (
											<EyeIcon className="fill-gray-500 dark:fill-gray-400" />
										) : (
											<EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
										)}
									</span>
								</div>
								<p className="mt-1.5 text-xs text-gray-500">
									Mínimo 8 caracteres. Evita usar contraseñas obvias.
								</p>
							</div>

							{localError && (
								<p className="text-sm text-center text-red-500">{localError}</p>
							)}

							<div>
								<Button
									className="w-full"
									size="sm"
									disabled={loading}
									type="submit"
								>
									{loading ? "Registrando..." : "Crear cuenta"}
								</Button>
							</div>
						</div>
					</form>

					<div className="mt-5">
						<p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
							¿Ya tienes una cuenta?{" "}
							<Link
								href="/signin"
								className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
							>
								Inicia sesión
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
