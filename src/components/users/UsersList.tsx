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
import Button from "@/components/ui/button/Button";
import ConfirmDeleteUserModal from "./ConfirmDeleteUserModal";
import EditUserModal from "./EditUserModal";

function fullName(u: User) {
	const name = [u.name, u.lastName].filter(Boolean).join(" ").trim();
	return name || u.email || "Sin nombre";
}

function initials(u: User) {
	const name = fullName(u);
	const parts = name.split(" ").filter(Boolean);
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

export default function UsersList({
	pageSize = 10,
	className = "",
	onEdit,
}: {
	pageSize?: number;
	className?: string;
	onEdit?: (userId: string) => void;
}) {
	const [page, setPage] = useState(1);
	const [items, setItems] = useState<User[]>([]);
	const [total, setTotal] = useState<number | undefined>(undefined);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [search, setSearch] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");

	const [delUser, setDelUser] = useState<User | null>(null);
	const [editingId, setEditingId] = useState<string | null>(null);

	useEffect(() => {
		const t = setTimeout(() => setDebouncedSearch(search.trim()), 250);
		return () => clearTimeout(t);
	}, [search]);

	async function fetchPage(p = page) {
		setLoading(true);
		setError(null);
		try {
			const res = await usersService.getAll({
				page: p,
				limit: pageSize,
				search: debouncedSearch || undefined,
			});
			setItems(res.items);
			setTotal(res.total);
		} catch (e: unknown) {
			setError((e as Error)?.message || "Error al obtener usuarios");
			setItems([]);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		fetchPage(1);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearch, pageSize]);

	useEffect(() => {
		fetchPage(page);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page]);

	const totalPages = useMemo(() => {
		if (!total) return undefined;
		return Math.max(1, Math.ceil(total / pageSize));
	}, [total, pageSize]);

	const hasNext = useMemo(() => {
		if (typeof totalPages === "number") return page < totalPages;
		return items.length === pageSize;
	}, [page, totalPages, items.length, pageSize]);

	function nextPage() {
		if (hasNext) setPage((p) => p + 1);
	}
	function prevPage() {
		if (page > 1) setPage((p) => p - 1);
	}

	return (
		<div
			className={`rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 dark:bg-gray-900 ${className}`}
		>
			<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<h2 className="text-base font-semibold text-slate-900">Usuarios</h2>
				<div className="flex w-full items-center gap-2 sm:w-auto">
					<div className="relative w-full sm:w-72">
						<input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Buscar por nombre, email o rol…"
							className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
						/>
						<svg
							className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-slate-400"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path d="M10 4a6 6 0 104.47 10.03l4.4 4.4a1 1 0 001.42-1.42l-4.4-4.4A6 6 0 0010 4zm0 2a4 4 0 110 8 4 4 0 010-8z" />
						</svg>
					</div>
				</div>
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
								Activo
							</TableCell>
							<TableCell
								isHeader
								className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
							>
								Creado
							</TableCell>
							<TableCell
								isHeader
								className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
							>
								Acciones
							</TableCell>
						</TableRow>
					</TableHeader>

					<TableBody className="divide-y divide-slate-100">
						{loading ? (
							Array.from({ length: 5 }).map((_, i) => (
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
										<div className="h-5 w-40 rounded-full bg-slate-200" />
									</TableCell>
									<TableCell className="px-4 py-4">
										<div className="h-4 w-14 rounded bg-slate-200" />
									</TableCell>
									<TableCell className="px-4 py-4">
										<div className="h-4 w-24 rounded bg-slate-200" />
									</TableCell>
									<TableCell className="px-4 py-4">
										<div className="h-8 w-16 rounded bg-slate-200" />
									</TableCell>
								</TableRow>
							))
						) : items.length === 0 ? (
							<TableRow>
								<TableCell
									className="px-4 py-6 text-sm text-slate-500"
									colSpan={6}
								>
									No hay usuarios para mostrar.
								</TableCell>
							</TableRow>
						) : (
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
											className={`inline-flex max-w-[22rem] items-center truncate rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
												(u.roleId && ROLE_TINT[u.roleId]) ||
												"bg-slate-50 text-slate-700 ring-slate-200"
											}`}
											title={u.roleId || ""}
										>
											{u.roleId || "—"}
										</span>
									</TableCell>
									<TableCell className="px-4 py-3">
										<span
											className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
												u.isActive
													? "bg-emerald-50 text-emerald-700 ring-emerald-200"
													: "bg-slate-50 text-slate-600 ring-slate-200"
											}`}
										>
											{u.isActive ? "Sí" : "No"}
										</span>
									</TableCell>
									<TableCell className="px-4 py-3">
										<div className="text-sm text-slate-700">
											{formatDate(u.createdAt)}
										</div>
									</TableCell>
									<TableCell className="px-4 py-3">
										<div className="flex items-center gap-2">
											<Button
												variant="outline"
												onClick={() =>
													onEdit ? onEdit(u.id) : setEditingId(u.id)
												}
												className="text-xs"
											>
												Editar
											</Button>
											<Button
												onClick={() => setDelUser(u)}
												className="text-xs !bg-rose-600 hover:!bg-rose-500 text-white"
											>
												Eliminar
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			<div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
				<div className="text-xs text-slate-500">
					Página <span className="font-medium">{page}</span>
					{typeof totalPages === "number" && (
						<>
							{" "}
							de <span className="font-medium">{totalPages}</span>
						</>
					)}
					{typeof total === "number" && (
						<>
							{" "}
							• {total} usuario{total === 1 ? "" : "s"}
						</>
					)}
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						onClick={prevPage}
						disabled={page === 1 || loading}
						className="text-xs"
					>
						Anterior
					</Button>
					<Button
						variant="outline"
						onClick={nextPage}
						disabled={!hasNext || loading}
						className="text-xs"
					>
						Siguiente
					</Button>
				</div>
			</div>

			{delUser && (
				<ConfirmDeleteUserModal
					isOpen={!!delUser}
					onClose={() => setDelUser(null)}
					userId={delUser.id}
					userName={fullName(delUser)}
					onDeleted={async () => {
						await fetchPage(page);
						setDelUser(null);
					}}
				/>
			)}

			{editingId && (
				<EditUserModal
					isOpen={!!editingId}
					userId={editingId}
					onClose={() => setEditingId(null)}
					onSaved={async () => {
						await fetchPage(page);
						setEditingId(null);
					}}
				/>
			)}
		</div>
	);
}
