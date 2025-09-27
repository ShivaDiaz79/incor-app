// components/ui/DeleteConfirmModal.tsx
"use client";

import Button from "@/components/ui/button/Button";
import Modal from "@/components/ui/modal";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  variant?: "danger" | "warning";
}

export function DeleteConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  loading = false,
  variant = "danger",
}: DeleteConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} maxWidth="md">
      <div className="space-y-6">
        {/* Icon and Message */}
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full ${
              variant === "danger"
                ? "bg-error-100 dark:bg-error-500/20"
                : "bg-warning-100 dark:bg-warning-500/20"
            }`}
          >
            <svg
              className={`h-6 w-6 ${
                variant === "danger"
                  ? "text-error-600 dark:text-error-400"
                  : "text-warning-600 dark:text-warning-400"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.866-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant={variant === "danger" ? "danger" : "primary"}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
