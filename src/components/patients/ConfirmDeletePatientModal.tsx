"use client";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { usersService } from "@/features/users/service";

export default function ConfirmDeletePatientModal({
	isOpen,
	onClose,
	userId,
	userName,
	onDeleted,
}: {
	isOpen: boolean;
	onClose: () => void;
	userId: string;
	userName?: string | null;
	onDeleted?: () => void;
}) {
	const [error, setError] = useState<string | null>(null);
	const [done, setDone] = useState(false);
	const [loading, setLoading] = useState(false);

	async function onConfirm() {
		try {
			setLoading(true);
			setError(null);
			await usersService.remove(userId);
			setDone(true);
			onDeleted?.();
		} catch (e: unknown) {
			setError((e as Error)?.message ?? "No se pudo eliminar el usuario");
		} finally {
			setLoading(false);
		}
	}

	function handleClose() {
		setError(null);
		setDone(false);
		setLoading(false);
		onClose();
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			className="max-w-md p-6 sm:p-8"
		>
			<h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white/90">
				Eliminar usuario
			</h3>

			{done ? (
				<>
					<p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
						✅ El usuario{" "}
						<span className="font-semibold">{userName || userId}</span> fue
						eliminado correctamente.
					</p>
					<div className="flex justify-end">
						<Button onClick={handleClose}>Cerrar</Button>
					</div>
				</>
			) : (
				<>
					<p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
						¿Seguro que deseas{" "}
						<span className="font-semibold text-rose-600">eliminar</span> al
						usuario <span className="font-semibold">{userName || userId}</span>?
						Esta acción no se puede deshacer.
					</p>

					{error && (
						<div className="mb-4 rounded-lg border border-error-500/40 bg-error-50 px-4 py-3 text-sm text-error-700 dark:border-error-500/30 dark:bg-error-500/15 dark:text-error-400">
							{error}
						</div>
					)}

					<div className="mt-6 flex items-center justify-end gap-2">
						<Button variant="outline" onClick={handleClose}>
							Cancelar
						</Button>
						<Button
							onClick={onConfirm}
							disabled={loading}
							className="!bg-rose-600 hover:!bg-rose-500 text-white"
						>
							{loading && (
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
							Eliminar
						</Button>
					</div>
				</>
			)}
		</Modal>
	);
}
