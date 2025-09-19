export const ROLES = {
	ADMIN: "admin",
	DOCTOR: "doctor",
	NURSE: "nurse",
	RECEPTIONIST: "receptionist",
	CLIENT: "client",
} as const;

export const ROLE_TINT: Record<string, string> = {
	[ROLES.ADMIN]:
		"bg-slate-900/5 text-slate-900 ring-slate-900/20 dark:bg-white/5 dark:text-white dark:ring-white/20",
	[ROLES.DOCTOR]: "bg-indigo-50 text-indigo-700 ring-indigo-200",
	[ROLES.NURSE]: "bg-sky-50 text-sky-700 ring-sky-200",
	[ROLES.RECEPTIONIST]: "bg-amber-50 text-amber-700 ring-amber-200",
	[ROLES.CLIENT]: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

export const ROLE_LABEL: Record<string, string> = {
	[ROLES.ADMIN]: "Administrador",
	[ROLES.DOCTOR]: "Médico",
	[ROLES.NURSE]: "Enfermería",
	[ROLES.RECEPTIONIST]: "Recepción",
	[ROLES.CLIENT]: "Cliente",
};

export function roleLabel(id?: string) {
	if (!id) return "—";
	return ROLE_LABEL[id] ?? id;
}
