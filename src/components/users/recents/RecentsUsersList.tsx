"use client";

import { useEffect, useMemo, useState } from "react";
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableCell,
} from "@/components/ui/table";
import { usersService } from "@/features/users/service";
import type { User } from "@/features/users/types";

function fullName(u: User) {
	const name = [u.name, u.lastName].filter(Boolean).join(" ").trim();
	return name || u.email || "Sin nombre";
}
function initials(u: User) {
	const n = fullName(u);
	const parts = n.split(" ").filter(Boolean);
	const ini = (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
	return ini.toUpperCase() || "U";
}
function formatDate(d?: Date | null) {
	if (!d) return "—";
	try {
		return d.toLocaleDateString("es-ES", {
			year: "numeric",
			month: "short",
			day: "2-digit",
		});
	} catch {
		return "—";
	}
}

const ROLE_TINT: Record<string, string> = {
	project_manager: "bg-indigo-50 text-indigo-700 ring-indigo-200",
	sales: "bg-amber-50 text-amber-700 ring-amber-200",
	technical: "bg-sky-50 text-sky-700 ring-sky-200",
	admin_finance: "bg-emerald-50 text-emerald-700 ring-emerald-200",
	legal: "bg-rose-50 text-rose-700 ring-rose-200",
	client: "bg-slate-50 text-slate-700 ring-slate-200",
};

export default function RecentUsersTable({
	limit = 5,
	className = "",
	title = "Usuarios recientes",
}: {
	limit?: number;
	className?: string;
	title?: string;
}) {
	const [items, setItems] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let alive = true;
		(async () => {
			setError(null);
			setLoading(true);
			try {
				const list = await usersService.getRecent(limit);
				if (!alive) return;
				setItems(list);
			} catch (e: unknown) {
				if (!alive) return;
				setError((e as Error)?.message || "No se pudo cargar la lista");
			} finally {
				if (alive) setLoading(false);
			}
		})();
		return () => {
			alive = false;
		};
	}, [limit]);

	const empty = useMemo(() => !loading && items.length === 0, [loading, items]);

	return (
		<div
			className={`rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 dark:bg-gray-900 ${className}`}
		>
			<div className="mb-4 flex items-center justify-between">
				<h3 className="text-base font-semibold text-slate-900">{title}</h3>
			</div>

			{error && (
				<div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
					{error}
				</div>
			)}

			<div className="overflow-x-auto">
				<Table className="divide-y divide-slate-200">
					<TableHeader>
						<TableRow className="text-left">
							<TableCell
								isHeader
								className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
							>
								Usuario
							</TableCell>
							<TableCell
								isHeader
								className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
							>
								Email
							</TableCell>
							<TableCell
								isHeader
								className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
							>
								Rol
							</TableCell>
							<TableCell
								isHeader
								className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
							>
								Creado
							</TableCell>
						</TableRow>
					</TableHeader>

					<TableBody className="divide-y divide-slate-100">
						{loading
							? Array.from({ length: 5 }).map((_, i) => (
									<TableRow key={`sk-${i}`} className="animate-pulse">
										<TableCell className="px-4 py-4">
											<div className="flex items-center gap-3">
												<div className="h-9 w-9 rounded-full bg-slate-200" />
												<div className="h-4 w-40 rounded bg-slate-200" />
											</div>
										</TableCell>
										<TableCell className="px-4 py-4">
											<div className="h-4 w-56 rounded bg-slate-200" />
										</TableCell>
										<TableCell className="px-4 py-4">
											<div className="h-5 w-32 rounded-full bg-slate-200" />
										</TableCell>
										<TableCell className="px-4 py-4">
											<div className="h-4 w-24 rounded bg-slate-200" />
										</TableCell>
									</TableRow>
							  ))
							: empty && (
									<TableRow>
										<TableCell
											className="px-4 py-6 text-sm text-slate-500"
											colSpan={4}
										>
											No hay usuarios recientes.
										</TableCell>
									</TableRow>
							  )}

						{!loading &&
							items.map((u) => (
								<TableRow key={u.id} className="hover:bg-slate-50">
									<TableCell className="px-4 py-3">
										<div className="flex items-center gap-3">
											<div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
												{initials(u)}
											</div>
											<div className="leading-tight">
												<div className="text-sm font-medium text-slate-900">
													{fullName(u)}
												</div>
											</div>
										</div>
									</TableCell>
									<TableCell className="px-4 py-3">
										<div className="text-sm text-slate-700">
											{u.email || "—"}
										</div>
									</TableCell>
									<TableCell className="px-4 py-3">
										<span
											className={`inline-flex max-w-[16rem] items-center truncate rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
												(u.roleId && ROLE_TINT[u.roleId]) ||
												"bg-slate-50 text-slate-700 ring-slate-200"
											}`}
											title={u.roleId || ""}
										>
											{u.roleId || "—"}
										</span>
									</TableCell>
									<TableCell className="px-4 py-3">
										<div className="text-sm text-slate-700">
											{formatDate(u.createdAt)}
										</div>
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
