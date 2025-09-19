import {
	Patient,
	PatientCreateDto,
	PatientDto,
	PatientStats,
	PatientUpdateDto,
} from "./types";

export interface GetAllParams {
	page?: number;
	limit?: number;
	search?: string;
	isActive?: boolean;
}

export interface GetAllResponse {
	items: Patient[];
	total?: number;
	page?: number;
	limit?: number;
}

function toDateSafe(s?: string | null): Date | null {
	if (!s) return null;
	const d = new Date(s);
	return isNaN(+d) ? null : d;
}

function isApiPatient(x: any): x is PatientDto {
	return (
		x && typeof x === "object" && "id" in x && "name" in x && "lastName" in x
	);
}

function mapApiPatientToPatient(p: PatientDto | any): Patient {
	return {
		id: p.id,
		name: p.name,
		lastName: p.lastName,
		email: p.email,
		phone: p.phone,
		ci: p.ci,
		dateOfBirth: toDateSafe(p.dateOfBirth),
		address: p.address,
		whatsappNumber: p.whatsappNumber,
		emergencyContact: p.emergencyContact,
		medicalHistory: Array.isArray(p.medicalHistory) ? p.medicalHistory : [],
		allergies: Array.isArray(p.allergies) ? p.allergies : [],
		isActive: Boolean(p.isActive),
		createdAt: toDateSafe(p.createdAt),
		updatedAt: toDateSafe(p.updatedAt),
		fullName: p.fullName ?? `${p.name ?? ""} ${p.lastName ?? ""}`.trim(),
		age: typeof p.age === "number" ? p.age : (undefined as unknown as number),
	};
}

function looksPaginatedItems(x: any): x is {
	items: PatientDto[];
	total?: number;
	page?: number;
	limit?: number;
} {
	return x && Array.isArray(x.items);
}

function looksEnvelope(x: any): x is {
	data: {
		data: PatientDto[];
		total?: number;
		page?: number;
		limit?: number;
	};
} {
	return x && x.data && Array.isArray(x.data.data);
}

export const patientsService = {
	async getAll(params: GetAllParams = {}): Promise<GetAllResponse> {
		const qs = new URLSearchParams();
		if (params.page != null) qs.set("page", String(params.page));
		if (params.limit != null) qs.set("limit", String(params.limit));
		if (params.search) qs.set("search", params.search);
		if (typeof params.isActive === "boolean")
			qs.set("isActive", String(params.isActive));

		const url = `/api/patients${qs.toString() ? `?${qs}` : ""}`;
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
					: raw?.error || "Error al obtener pacientes";
			throw new Error(msg);
		}

		if (Array.isArray(raw)) {
			return { items: raw.map(mapApiPatientToPatient) };
		}

		if (looksPaginatedItems(raw)) {
			const { items, total, page, limit } = raw;
			return {
				items: items.map(mapApiPatientToPatient),
				total,
				page,
				limit,
			};
		}

		if (looksEnvelope(raw)) {
			const box = raw.data;
			const items = box.data.map(mapApiPatientToPatient);
			return {
				items,
				total: box.total,
				page: box.page,
				limit: box.limit,
			};
		}

		if (raw?.data && Array.isArray(raw.data)) {
			return {
				items: raw.data.map(mapApiPatientToPatient),
				total: raw.total,
				page: raw.page,
				limit: raw.limit,
			};
		}

		return { items: [] };
	},

	async getStats(): Promise<PatientStats> {
		const res = await fetch(`/api/patients/stats`, {
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
					: raw?.error || "Error al obtener estadísticas";
			throw new Error(msg);
		}

		const data: PatientStats =
			(raw?.data as PatientStats) ?? (raw as PatientStats);

		if (!data || typeof data.total !== "number" || !data.ageRanges) {
			throw new Error("Respuesta inesperada en /patients/stats");
		}

		return data;
	},

	async getById(id: string): Promise<Patient> {
		const res = await fetch(`/api/patients/${id}`, {
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
					: raw?.error || "Error al obtener paciente";
			throw new Error(msg);
		}

		if (isApiPatient(raw)) return mapApiPatientToPatient(raw);
		const maybe = raw?.item ?? raw?.data ?? raw;
		if (isApiPatient(maybe)) return mapApiPatientToPatient(maybe);

		throw new Error("Respuesta inesperada al obtener paciente");
	},

	async create(payload: PatientCreateDto): Promise<Patient> {
		const res = await fetch(`/api/patients`, {
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
				typeof raw === "string" ? raw : raw?.error || "Error al crear paciente";
			throw new Error(msg);
		}

		const maybe = raw?.item ?? raw?.data ?? raw;
		if (isApiPatient(maybe)) return mapApiPatientToPatient(maybe);

		throw new Error("Respuesta inesperada al crear paciente");
	},

	async update(id: string, patch: PatientUpdateDto): Promise<Patient> {
		const res = await fetch(`/api/patients/${id}`, {
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
					: raw?.error || "Error al actualizar paciente";
			throw new Error(msg);
		}

		const maybe = raw?.item ?? raw?.data ?? raw;
		if (isApiPatient(maybe)) return mapApiPatientToPatient(maybe);

		throw new Error("Respuesta inesperada al actualizar paciente");
	},

	async remove(id: string): Promise<{ success: boolean; message?: string }> {
		const res = await fetch(`/api/patients/${id}`, { method: "DELETE" });
		const contentType = res.headers.get("content-type") || "";
		const raw = contentType.includes("application/json")
			? await res.json()
			: await res.text();

		if (!res.ok) {
			const msg =
				typeof raw === "string"
					? raw
					: raw?.error || "Error al desactivar paciente";
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
				(success ? "Paciente desactivado" : "No se pudo desactivar");
			return { success, message };
		}

		return { success: true };
	},

	async activate(id: string, body?: Record<string, unknown>): Promise<Patient> {
		const hasBody = body && Object.keys(body).length > 0;
		const res = await fetch(`/api/patients/${id}/activate`, {
			method: "PATCH",
			headers: { ...(hasBody ? { "Content-Type": "application/json" } : {}) },
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
					: raw?.error || "Error al activar paciente";
			throw new Error(msg);
		}

		const maybe = raw?.item ?? raw?.data ?? raw;
		if (isApiPatient(maybe)) return mapApiPatientToPatient(maybe);

		throw new Error("Respuesta inesperada al activar paciente");
	},

	async addMedicalHistory(
		id: string,
		entry: string
	): Promise<Patient | { success: boolean; message?: string }> {
		const res = await fetch(`/api/patients/${id}/medical-history`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ entry }),
		});
		const contentType = res.headers.get("content-type") || "";
		const raw = contentType.includes("application/json")
			? await res.json()
			: await res.text();

		if (!res.ok) {
			const msg =
				typeof raw === "string"
					? raw
					: raw?.error || "Error al agregar antecedente";
			throw new Error(msg);
		}

		const maybe = raw?.item ?? raw?.data ?? raw;
		if (isApiPatient(maybe)) return mapApiPatientToPatient(maybe);

		if (typeof raw === "string") return { success: true, message: raw };
		if (raw && typeof raw === "object") {
			const success = typeof raw.success === "boolean" ? raw.success : true;
			return { success, message: raw.message };
		}

		return { success: true };
	},

	async addAllergy(
		id: string,
		allergy: string
	): Promise<Patient | { success: boolean; message?: string }> {
		const res = await fetch(`/api/patients/${id}/allergies`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ allergy }),
		});
		const contentType = res.headers.get("content-type") || "";
		const raw = contentType.includes("application/json")
			? await res.json()
			: await res.text();

		if (!res.ok) {
			const msg =
				typeof raw === "string"
					? raw
					: raw?.error || "Error al agregar alergia";
			throw new Error(msg);
		}

		const maybe = raw?.item ?? raw?.data ?? raw;
		if (isApiPatient(maybe)) return mapApiPatientToPatient(maybe);

		if (typeof raw === "string") return { success: true, message: raw };
		if (raw && typeof raw === "object") {
			const success = typeof raw.success === "boolean" ? raw.success : true;
			return { success, message: raw.message };
		}

		return { success: true };
	},
};
