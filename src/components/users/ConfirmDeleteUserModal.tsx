"use client";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { usersService } from "@/features/users/service";

export default function ConfirmDeleteUserModal({
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
	const [confirmText, setConfirmText] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [done, setDone] = useState(false);
	const [loading, setLoading] = useState(false);

	async function onConfirm() {
		if (confirmText !== "ELIMINAR") {
			setError('Escribe "ELIMINAR" para confirmar');
			return;
		}
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

	// reset básico al cerrar
	function handleClose() {
		setConfirmText("");
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
			<p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
				Esta acción es permanente para{" "}
				<span className="font-semibold">{userName || userId}</span>.
			</p>

			{done ? (
				<div className="space-y-6">
					<div className="rounded-lg border border-success-500/40 bg-success-50 px-4 py-3 text-sm dark:border-success-500/30 dark:bg-success-500/15">
						✅ Usuario eliminado.
					</div>
					<div className="flex justify-end">
						<Button onClick={handleClose}>Cerrar</Button>
					</div>
				</div>
			) : (
				<>
					{error && (
						<div className="mb-4 rounded-lg border border-error-500/40 bg-error-50 px-4 py-3 text-sm text-error-700 dark:border-error-500/30 dark:bg-error-500/15 dark:text-error-400">
							{error}
						</div>
					)}

					<div className="space-y-3">
						<Label htmlFor="confirm">Para confirmar, escribe ELIMINAR</Label>
						<Input
							id="confirm"
							placeholder="ELIMINAR"
							value={confirmText}
							onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
							error={!!error && confirmText !== "ELIMINAR"}
						/>
					</div>

					<div className="mt-6 flex items-center justify-end gap-2">
						<Button variant="outline" onClick={handleClose}>
							Cancelar
						</Button>
						<Button
							onClick={onConfirm}
							disabled={loading}
							// tu Button solo tiene primary/outline, así que meto estilo "peligro" vía className
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
