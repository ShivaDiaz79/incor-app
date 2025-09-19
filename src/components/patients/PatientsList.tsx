"use client";

import { useEffect, useMemo, useState } from "react";
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableCell,
} from "@/components/ui/table";
import Button from "@/components/ui/button/Button";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";

import { patientsService } from "@/features/patients/service";
import type { Patient } from "@/features/patients/types";
import EditPatientModal from "./EditPatientModal";

function fullName(p: Patient) {
	const name = [p.name, p.lastName].filter(Boolean).join(" ").trim();
	return name || p.email || "Sin nombre";
}

function initials(p: Patient) {
	const name = fullName(p);
	const parts = name.split(" ").filter(Boolean);
	const ini = (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
	return ini.toUpperCase() || "P";
}

function formatDate(d?: Date | null, withDay = true) {
	if (!d) return "—";
	try {
		return d.toLocaleDateString("es-ES", {
			year: "numeric",
			month: "short",
			day: withDay ? "2-digit" : undefined,
		});
	} catch {
		return "—";
	}
}

export default function PatientsList({
	pageSize = 10,
	className = "",
	onEdit, // si se pasa, tiene prioridad sobre el modal interno
}: {
	pageSize?: number;
	className?: string;
	onEdit?: (patientId: string) => void;
}) {
	// pagination/data
	const [page, setPage] = useState(1);
	const [items, setItems] = useState<Patient[]>([]);
	const [total, setTotal] = useState<number | undefined>(undefined);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// search
	const [search, setSearch] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");

	// per-row action loading
	const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

	// dropdown state (portal + fixed anchor)
	const [openMenuId, setOpenMenuId] = useState<string | null>(null);
	const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
	const toggleMenu = (id: string, el: HTMLElement | null) => {
		if (openMenuId === id) {
			setOpenMenuId(null);
			setAnchorRect(null);
		} else {
			setOpenMenuId(id);
			setAnchorRect(el ? el.getBoundingClientRect() : null);
		}
	};
	const closeMenu = () => {
		setOpenMenuId(null);
		setAnchorRect(null);
	};

	// modal de edición integrado
	const [editingId, setEditingId] = useState<string | null>(null);

	// debounce search
	useEffect(() => {
		const t = setTimeout(() => setDebouncedSearch(search.trim()), 250);
		return () => clearTimeout(t);
	}, [search]);

	async function fetchPage(p = page) {
		setLoading(true);
		setError(null);
		try {
			const res = await patientsService.getAll({
				page: p,
				limit: pageSize,
				search: debouncedSearch || undefined,
			});
			setItems(res.items);
			setTotal(res.total);
		} catch (e: unknown) {
			setError((e as Error)?.message || "Error al obtener pacientes");
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

	// --- actions ---
	async function handleActivate(pat: Patient) {
		setError(null);
		setActionLoadingId(pat.id);
		try {
			if (!confirm(`¿Activar al paciente "${fullName(pat)}"?`)) return;
			await patientsService.activate(pat.id);
			await fetchPage(page);
		} catch (e: unknown) {
			setError((e as Error)?.message ?? "No se pudo activar el paciente");
		} finally {
			setActionLoadingId(null);
		}
	}

	async function handleDeactivate(pat: Patient) {
		setError(null);
		setActionLoadingId(pat.id);
		try {
			if (!confirm(`¿Desactivar al paciente "${fullName(pat)}"?`)) return;
			await patientsService.remove(pat.id); // en tu API DELETE = desactivar
			await fetchPage(page);
		} catch (e: unknown) {
			setError((e as Error)?.message ?? "No se pudo desactivar el paciente");
		} finally {
			setActionLoadingId(null);
		}
	}

	async function handleAddHistory(pat: Patient) {
		const entry = window.prompt(
			"Nuevo antecedente médico para " + fullName(pat)
		);
		if (!entry) return;
		setActionLoadingId(pat.id);
		try {
			await patientsService.addMedicalHistory(pat.id, entry);
			await fetchPage(page);
		} catch (e: unknown) {
			setError((e as Error)?.message ?? "No se pudo agregar el antecedente");
		} finally {
			setActionLoadingId(null);
		}
	}

	async function handleAddAllergy(pat: Patient) {
		const entry = window.prompt("Nueva alergia para " + fullName(pat));
		if (!entry) return;
		setActionLoadingId(pat.id);
		try {
			await patientsService.addAllergy(pat.id, entry);
			await fetchPage(page);
		} catch (e: unknown) {
			setError((e as Error)?.message ?? "No se pudo agregar la alergia");
		} finally {
			setActionLoadingId(null);
		}
	}

	return (
		<div
			className={`rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 dark:bg-gray-900 ${className}`}
		>
			<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<h2 className="text-base font-semibold text-slate-900">Pacientes</h2>
				<div className="flex w-full items-center gap-2 sm:w-auto">
					<div className="relative w-full sm:w-72">
						<input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Buscar por nombre, email, CI…"
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
								Paciente
							</TableCell>
							<TableCell
								isHeader
								className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
							>
								Contacto
							</TableCell>
							<TableCell
								isHeader
								className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
							>
								CI
							</TableCell>
							<TableCell
								isHeader
								className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
							>
								Nacimiento
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
										<div className="h-4 w-24 rounded bg-slate-200" />
									</TableCell>
									<TableCell className="px-4 py-4">
										<div className="h-4 w-24 rounded bg-slate-200" />
									</TableCell>
									<TableCell className="px-4 py-4">
										<div className="h-4 w-14 rounded bg-slate-200" />
									</TableCell>
									<TableCell className="px-4 py-4">
										<div className="h-4 w-24 rounded bg-slate-200" />
									</TableCell>
									<TableCell className="px-4 py-4">
										<div className="h-8 w-8 rounded-full bg-slate-200" />
									</TableCell>
								</TableRow>
							))
						) : items.length === 0 ? (
							<TableRow>
								<TableCell
									className="px-4 py-6 text-sm text-slate-500"
									colSpan={7}
								>
									No hay pacientes para mostrar.
								</TableCell>
							</TableRow>
						) : (
							items.map((p) => {
								const rowBusy = actionLoadingId === p.id;
								return (
									<TableRow key={p.id} className="hover:bg-slate-50">
										<TableCell className="px-4 py-3">
											<div className="flex items-center gap-3">
												<div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
													{initials(p)}
												</div>
												<div className="leading-tight">
													<div className="text-sm font-medium text-slate-900">
														{fullName(p)}
													</div>
													<div className="text-xs text-slate-500">
														{p.age ? `${p.age} años` : ""}
													</div>
												</div>
											</div>
										</TableCell>

										<TableCell className="px-4 py-3">
											<div className="text-sm text-slate-700">
												{p.phone || "—"}
												{p.email ? ` · ${p.email}` : ""}
											</div>
										</TableCell>

										<TableCell className="px-4 py-3">
											<div className="text-sm text-slate-700">
												{p.ci || "—"}
											</div>
										</TableCell>

										<TableCell className="px-4 py-3">
											<div className="text-sm text-slate-700">
												{formatDate(p.dateOfBirth, false)}
											</div>
										</TableCell>

										<TableCell className="px-4 py-3">
											<span
												className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
													p.isActive
														? "bg-emerald-50 text-emerald-700 ring-emerald-200"
														: "bg-slate-50 text-slate-600 ring-slate-200"
												}`}
											>
												{p.isActive ? "Sí" : "No"}
											</span>
										</TableCell>

										<TableCell className="px-4 py-3">
											<div className="text-sm text-slate-700">
												{formatDate(p.createdAt)}
											</div>
										</TableCell>

										<TableCell className="px-4 py-3">
											<div className="relative inline-block text-left">
												<button
													type="button"
													className="dropdown-toggle inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
													onClick={(e) => toggleMenu(p.id, e.currentTarget)}
													disabled={rowBusy}
													aria-haspopup="true"
													aria-expanded={openMenuId === p.id}
													aria-label="Abrir menú de acciones"
												>
													<svg
														viewBox="0 0 24 24"
														width="18"
														height="18"
														fill="currentColor"
													>
														<circle cx="5" cy="12" r="2" />
														<circle cx="12" cy="12" r="2" />
														<circle cx="19" cy="12" r="2" />
													</svg>
												</button>

												<Dropdown
													isOpen={openMenuId === p.id}
													onClose={closeMenu}
													anchorRect={anchorRect}
													className="min-w-56"
												>
													<div className="py-1 text-sm">
														<button
															className="block w-full px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-white/10"
															onClick={() => {
																closeMenu();
																onEdit ? onEdit(p.id) : setEditingId(p.id); // <-- abre modal interno si no te pasan onEdit
															}}
															disabled={rowBusy}
														>
															✏️ Editar
														</button>

														<button
															className="block w-full px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-white/10"
															onClick={async () => {
																closeMenu();
																await handleAddHistory(p);
															}}
															disabled={rowBusy}
														>
															🩺 Agregar antecedente
														</button>

														<button
															className="block w-full px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-white/10"
															onClick={async () => {
																closeMenu();
																await handleAddAllergy(p);
															}}
															disabled={rowBusy}
														>
															🌿 Agregar alergia
														</button>

														{p.isActive ? (
															<button
																className="block w-full px-4 py-2 text-left text-rose-700 hover:bg-rose-50"
																onClick={async () => {
																	closeMenu();
																	await handleDeactivate(p);
																}}
																disabled={rowBusy}
															>
																⛔ Desactivar
															</button>
														) : (
															<button
																className="block w-full px-4 py-2 text-left text-emerald-700 hover:bg-emerald-50"
																onClick={async () => {
																	closeMenu();
																	await handleActivate(p);
																}}
																disabled={rowBusy}
															>
																✅ Activar
															</button>
														)}
													</div>
												</Dropdown>
											</div>
										</TableCell>
									</TableRow>
								);
							})
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
							• {total} paciente{total === 1 ? "" : "s"}
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

			{/* Modal de edición integrado */}
			{editingId && (
				<EditPatientModal
					isOpen={!!editingId}
					patientId={editingId}
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
