import {
	FirestoreTS,
	ApiUser,
	GetAllParams,
	GetAllResponse,
	User,
} from "./types";

export type UserStats = {
	total: number;
	active: number;
	inactive: number;
	byRole?: Record<string, number>;
};

function unwrapStats(raw: any): any {
	if (!raw) return raw;
	if (raw?.data?.data && typeof raw.data.data === "object")
		return raw.data.data;
	if (raw?.data && typeof raw.data === "object" && !Array.isArray(raw.data))
		return raw.data;
	return raw;
}

function normalizeUserStats(raw: any): UserStats {
	const box = unwrapStats(raw) ?? {};
	const total = Number(box.total ?? box.count ?? 0);
	const active = Number(box.active ?? 0);
	const inactive =
		box.inactive != null ? Number(box.inactive) : Math.max(0, total - active);
	const byRole =
		box.byRole && typeof box.byRole === "object"
			? (box.byRole as Record<string, number>)
			: undefined;

	return { total, active, inactive, byRole };
}

type MaybeISODate = string | FirestoreTS | Date | null | undefined;

function toDate(d: MaybeISODate): Date | null | undefined {
	if (!d) return d as undefined | null;
	if (d instanceof Date) return d;
	if (typeof d === "string") {
		const dt = new Date(d);
		return isNaN(+dt) ? null : dt;
	}

	if (
		typeof d === "object" &&
		d !== null &&
		"_seconds" in d &&
		"_nanoseconds" in d
	) {
		const ms =
			(d as FirestoreTS)._seconds * 1000 +
			Math.floor((d as FirestoreTS)._nanoseconds / 1_000_000);
		return new Date(ms);
	}
	return null;
}

function mapApiUserToUser(u: ApiUser | any): User {
	return {
		id: u.id,
		email: u.email,
		name: u.name,
		lastName: u.lastName,
		phone: u.phone,
		roleId: u.roleId,
		ci: u.ci,
		isActive: Boolean(u.isActive),
		firebaseUid: u.firebaseUid,
		createdAt: toDate(u.createdAt),
		lastLoginAt: toDate(u.lastLoginAt),
		updatedAt: toDate(u.updatedAt),
	};
}

function isApiUser(x: any): x is ApiUser {
	return x && typeof x === "object" && "id" in x && "email" in x;
}

function looksPaginatedItems(x: any): x is {
	items: ApiUser[];
	total?: number;
	page?: number;
	limit?: number;
	totalPages?: number;
	hasNextPage?: boolean;
	hasPrevPage?: boolean;
} {
	return x && Array.isArray(x.items);
}

function looksEnvelope(x: any): x is {
	data: {
		data: ApiUser[];
		total?: number;
		page?: number;
		limit?: number;
		totalPages?: number;
		hasNextPage?: boolean;
		hasPrevPage?: boolean;
		statusCode?: number;
		message?: string;
		timestamp?: string;
	};
	statusCode?: number;
	message?: string;
	timestamp?: string;
} {
	return x && x.data && Array.isArray(x.data.data);
}

export const usersService = {
	async getAll(params: GetAllParams = {}): Promise<GetAllResponse> {
		const qs = new URLSearchParams();
		if (params.page != null) qs.set("page", String(params.page));
		if (params.limit != null) qs.set("limit", String(params.limit));
		if (params.search) qs.set("search", params.search);
		if (params.roleId) qs.set("roleId", params.roleId);
		if (typeof params.isActive === "boolean")
			qs.set("isActive", String(params.isActive));

		const url = `/api/users${qs.toString() ? `?${qs}` : ""}`;

		const res = await fetch(url, {
			headers: { "Content-Type": "application/json" },
		});
		const contentType = res.headers.get("content-type") || "";
		const raw = contentType.includes("application/json")
			? await res.json()
			: await res.text();

		if (!res.ok) {
			const msg =
				typeof raw === "string"
					? raw
					: raw?.error || "Error al obtener usuarios";
			throw new Error(msg);
		}

		if (Array.isArray(raw)) {
			return { items: raw.map(mapApiUserToUser) };
		}

		if (looksPaginatedItems(raw)) {
			const { items, total, page, limit } = raw;
			return {
				items: items.map(mapApiUserToUser),
				total,
				page,
				limit,
			};
		}

		if (looksEnvelope(raw)) {
			const box = raw.data;
			const items = box.data.map(mapApiUserToUser);
			return {
				items,
				total: box.total,
				page: box.page,
				limit: box.limit,
			};
		}

		if (raw?.data && Array.isArray(raw.data)) {
			return {
				items: raw.data.map(mapApiUserToUser),
				total: raw.total,
				page: raw.page,
				limit: raw.limit,
			};
		}

		return { items: [] };
	},

	async getById(id: string): Promise<User> {
		const res = await fetch(`/api/users/${id}`, {
			headers: { "Content-Type": "application/json" },
		});
		const contentType = res.headers.get("content-type") || "";
		const raw = contentType.includes("application/json")
			? await res.json()
			: await res.text();

		if (!res.ok) {
			const msg =
				typeof raw === "string"
					? raw
					: raw?.error || "Error al obtener usuario";
			throw new Error(msg);
		}

		if (isApiUser(raw)) return mapApiUserToUser(raw);
		const maybe = raw?.item ?? raw?.data ?? raw;
		if (isApiUser(maybe)) return mapApiUserToUser(maybe);

		throw new Error("Respuesta inesperada al obtener usuario");
	},

	async create(payload: {
		email: string;
		name: string;
		lastName: string;
		phone: string;
		roleId: string;
		ci: string;
		isActive?: boolean;
		firebaseUid?: string;
		password?: string;
	}): Promise<User> {
		const res = await fetch(`/api/users`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});
		const contentType = res.headers.get("content-type") || "";
		const raw = contentType.includes("application/json")
			? await res.json()
			: await res.text();

		if (!res.ok) {
			const msg =
				typeof raw === "string" ? raw : raw?.error || "Error al crear usuario";
			throw new Error(msg);
		}

		const maybe = raw?.item ?? raw?.data ?? raw;
		if (isApiUser(maybe)) return mapApiUserToUser(maybe);

		throw new Error("Respuesta inesperada al crear usuario");
	},

	async update(
		id: string,
		patch: Partial<{
			email: string;
			name: string;
			lastName: string;
			phone: string;
			roleId: string;
			ci: string;
			isActive: boolean;
			firebaseUid: string;
			password: string;
		}>
	): Promise<User> {
		const res = await fetch(`/api/users/${id}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(patch),
		});
		const contentType = res.headers.get("content-type") || "";
		const raw = contentType.includes("application/json")
			? await res.json()
			: await res.text();

		if (!res.ok) {
			const msg =
				typeof raw === "string"
					? raw
					: raw?.error || "Error al actualizar usuario";
			throw new Error(msg);
		}

		const maybe = raw?.item ?? raw?.data ?? raw;
		if (isApiUser(maybe)) return mapApiUserToUser(maybe);

		throw new Error("Respuesta inesperada al actualizar usuario");
	},

	async remove(id: string): Promise<{ success: boolean; message?: string }> {
		const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
		const contentType = res.headers.get("content-type") || "";
		const raw = contentType.includes("application/json")
			? await res.json()
			: await res.text();

		if (!res.ok) {
			const msg =
				typeof raw === "string"
					? raw
					: raw?.error || "Error al eliminar usuario";
			throw new Error(msg);
		}

		if (typeof raw === "string") return { success: true, message: raw };
		if (raw && typeof raw === "object") {
			const success =
				typeof raw.success === "boolean"
					? raw.success
					: Boolean(raw.deleted ?? raw.ok ?? true);
			const message =
				raw.message ??
				raw.error ??
				(success ? "Usuario eliminado" : "No se pudo eliminar");
			return { success, message };
		}

		return { success: true };
	},

	async activate(id: string, body?: Record<string, unknown>): Promise<User> {
		const hasBody = body && Object.keys(body).length > 0;
		const res = await fetch(`/api/users/${id}/activate`, {
			method: "PATCH",
			headers: {
				...(hasBody ? { "Content-Type": "application/json" } : {}),
			},
			...(hasBody ? { body: JSON.stringify(body) } : {}),
		});
		const contentType = res.headers.get("content-type") || "";
		const raw = contentType.includes("application/json")
			? await res.json()
			: await res.text();

		if (!res.ok) {
			const msg =
				typeof raw === "string"
					? raw
					: raw?.error || "Error al activar usuario";
			throw new Error(msg);
		}

		const maybe = (raw?.item ?? raw?.data ?? raw) as unknown;
		if (isApiUser(maybe)) return mapApiUserToUser(maybe);
		throw new Error("Respuesta inesperada al activar usuario");
	},

	async bulkDeactivate(payload: { ids: string[]; reason?: string }): Promise<{
		success: boolean;
		affected?: number;
		details?: any;
		message?: string;
	}> {
		const res = await fetch(`/api/users/bulk-deactivate`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});
		const contentType = res.headers.get("content-type") || "";
		const raw = contentType.includes("application/json")
			? await res.json()
			: await res.text();

		if (!res.ok) {
			const msg =
				typeof raw === "string"
					? raw
					: raw?.error || "Error al desactivar usuarios";
			throw new Error(msg);
		}

		if (typeof raw === "string") {
			return { success: true, message: raw };
		}

		const affected =
			raw?.affected ??
			raw?.count ??
			raw?.modifiedCount ??
			raw?.updated ??
			raw?.deactivated;

		const success = typeof raw?.success === "boolean" ? raw.success : true;

		return {
			success,
			affected: typeof affected === "number" ? affected : undefined,
			details: raw,
			message: raw?.message,
		};
	},

	async changePassword(
		id: string,
		payload: { password: string; oldPassword?: string }
	): Promise<{ success: boolean; message?: string }> {
		const res = await fetch(`/api/users/${id}/change-password`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});
		const contentType = res.headers.get("content-type") || "";
		const raw = contentType.includes("application/json")
			? await res.json()
			: await res.text();

		if (!res.ok) {
			const msg =
				typeof raw === "string"
					? raw
					: raw?.error || "Error al cambiar contraseña";
			throw new Error(msg);
		}

		if (typeof raw === "string") return { success: true, message: raw };
		if (raw && typeof raw === "object") {
			const success = typeof raw.success === "boolean" ? raw.success : true;
			const message = raw.message ?? "Contraseña actualizada";
			return { success, message };
		}

		return { success: true };
	},

	async getStats(): Promise<UserStats> {
		const res = await fetch(`/api/users/stats`, {
			headers: { "Content-Type": "application/json" },
		});

		const contentType = res.headers.get("content-type") || "";
		const raw = contentType.includes("application/json")
			? await res.json()
			: await res.text();

		if (!res.ok) {
			const msg =
				typeof raw === "string"
					? raw
					: raw?.error || "Error al obtener estadísticas de usuarios";
			throw new Error(msg);
		}

		return normalizeUserStats(raw);
	},

	async getRecent(limit = 5): Promise<User[]> {
		const qs = new URLSearchParams();
		if (limit) qs.set("limit", String(limit));

		const res = await fetch(
			`/api/users/recent${qs.toString() ? `?${qs}` : ""}`,
			{
				headers: { "Content-Type": "application/json" },
			}
		);

		const contentType = res.headers.get("content-type") || "";
		const raw = contentType.includes("application/json")
			? await res.json()
			: await res.text();

		if (!res.ok) {
			const msg =
				typeof raw === "string"
					? raw
					: raw?.error || "Error al obtener usuarios recientes";
			throw new Error(msg);
		}

		const list =
			(Array.isArray(raw) && raw) ||
			(Array.isArray(raw?.data) && raw.data) ||
			(Array.isArray(raw?.items) && raw.items) ||
			(Array.isArray(raw?.data?.data) && raw.data.data) ||
			[];

		return list.map(mapApiUserToUser);
	},
};
