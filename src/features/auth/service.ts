"use client";

import { AuthResponse } from "./types";

export const authService = {
	async login(payload: {
		email: string;
		password: string;
		remember?: boolean;
	}) {
		const res = await fetch("/api/auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});

		const ct = res.headers.get("content-type") || "";
		const body = ct.includes("application/json")
			? await res.json()
			: await res.text();

		if (!res.ok) {
			const msg =
				typeof body === "string"
					? body
					: body?.message || body?.error || "Error al iniciar sesión";
			throw new Error(msg);
		}

		return body as AuthResponse;
	},

	async register(payload: {
		email: string;
		name: string;
		lastName: string;
		phone: string;
		ci: string;
		password: string;
	}) {
		const res = await fetch("/api/auth/register", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});

		const ct = res.headers.get("content-type") || "";
		const body = ct.includes("application/json")
			? await res.json()
			: await res.text();

		if (!res.ok) {
			const msg =
				typeof body === "string"
					? body
					: body?.message || body?.error || "No se pudo completar el registro";
			throw new Error(msg);
		}

		return body;
	},

	async logout() {
		const res = await fetch("/api/auth/logout", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
		});

		const ct = res.headers.get("content-type") || "";
		const body = ct.includes("application/json")
			? await res.json()
			: await res.text();

		if (!res.ok) {
			const msg =
				typeof body === "string"
					? body
					: body?.message || body?.error || "No se pudo cerrar la sesión";
			throw new Error(msg);
		}

		return body;
	},
};
