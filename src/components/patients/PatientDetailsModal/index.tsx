// components/patients/PatientDetailsModal.tsx
"use client";

import Button from "@/components/ui/button/Button";
import type { Patient } from "@/types/patients";
import { Gender, CivilStatus } from "@/types/patients";

interface PatientDetailsModalProps {
  isOpen: boolean;
  patient: Patient;
  onClose: () => void;
  onEdit: () => void;
}

const GENDER_LABELS: Record<Gender, string> = {
  [Gender.MALE]: "Masculino",
  [Gender.FEMALE]: "Femenino",
  [Gender.OTHER]: "Otro",
};

const CIVIL_STATUS_LABELS: Record<CivilStatus, string> = {
  [CivilStatus.SINGLE]: "Soltero/a",
  [CivilStatus.MARRIED]: "Casado/a",
  [CivilStatus.DIVORCED]: "Divorciado/a",
  [CivilStatus.WIDOWED]: "Viudo/a",
  [CivilStatus.COHABITING]: "Conviviente",
};

function formatDate(date: Date): string {
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())
  ) {
    age--;
  }

  return age;
}

function formatPhoneNumber(phone: string): string {
  if (phone.length === 8) {
    return `${phone.slice(0, 4)}-${phone.slice(4)}`;
  }
  return phone;
}

export function PatientDetailsModal({
  isOpen,
  patient,
  onClose,
  onEdit,
}: PatientDetailsModalProps) {
  if (!isOpen) return null;

  const fullName = [patient.name, patient.lastName, patient.secondLastName]
    .filter(Boolean)
    .join(" ");

  const age = calculateAge(patient.dateOfBirth);
  const mainEmergencyContact = patient.emergencyContacts.find(
    (contact) => contact.isMainContact
  );
  const secondaryContacts = patient.emergencyContacts.filter(
    (contact) => !contact.isMainContact
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto backdrop-blur-sm bg-black/30 p-4">
      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-xl dark:bg-gray-900 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-lg font-bold text-brand-700 ring-4 ring-brand-200 dark:bg-brand-500/20 dark:text-brand-300 dark:ring-brand-500/30">
              {fullName
                .split(" ")
                .map((n) => n.charAt(0))
                .slice(0, 2)
                .join("")}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {fullName}
              </h2>
              <div className="mt-1 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span>HM: {patient.medicalRecordId}</span>
                <span>•</span>
                <span>CI: {patient.ci}</span>
                <span>•</span>
                <span>{age} años</span>
                <span>•</span>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                    patient.isActive
                      ? "bg-success-50 text-success-700 ring-success-200 dark:bg-success-500/10 dark:text-success-300"
                      : "bg-gray-50 text-gray-600 ring-gray-200 dark:bg-gray-500/10 dark:text-gray-400"
                  }`}
                >
                  {patient.isActive ? "Activo" : "Inactivo"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={onEdit} variant="outline" size="sm">
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Editar
            </Button>

            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Personal Information */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                Información Personal
              </h3>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Fecha de Nacimiento
                    </label>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {formatDate(patient.dateOfBirth)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Género
                    </label>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {GENDER_LABELS[patient.gender]}
                    </p>
                  </div>
                </div>

                {patient.civilStatus && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Estado Civil
                    </label>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {CIVIL_STATUS_LABELS[patient.civilStatus]}
                    </p>
                  </div>
                )}

                {patient.nationality && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Nacionalidad
                    </label>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {patient.nationality}
                    </p>
                  </div>
                )}

                {patient.occupation && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Ocupación
                    </label>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {patient.occupation}
                    </p>
                  </div>
                )}

                {patient.preferredLanguage && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Idioma Preferido
                    </label>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {patient.preferredLanguage}
                    </p>
                  </div>
                )}

                {patient.referredBy && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Referido Por
                    </label>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {patient.referredBy}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                Información de Contacto
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Teléfono
                  </label>
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {formatPhoneNumber(patient.phone)}
                    </p>
                  </div>
                </div>

                {patient.email && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Email
                    </label>
                    <div className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        {patient.email}
                      </p>
                    </div>
                  </div>
                )}

                {patient.whatsappNumber && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      WhatsApp
                    </label>
                    <div className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                      </svg>
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        {formatPhoneNumber(patient.whatsappNumber)}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Dirección
                  </label>
                  <div className="flex items-start gap-2">
                    <svg
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        {patient.address}
                      </p>
                      {(patient.city || patient.state) && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {[patient.city, patient.state]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="lg:col-span-2">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                Contactos de Emergencia
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Main Contact */}
                {mainEmergencyContact && (
                  <div className="rounded-lg border border-success-200 bg-success-50 p-4 dark:border-success-800 dark:bg-success-500/10">
                    <div className="mb-2 flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-success-600 dark:text-success-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-xs font-medium text-success-700 dark:text-success-300">
                        CONTACTO PRINCIPAL
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {mainEmergencyContact.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {mainEmergencyContact.relationship}
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatPhoneNumber(mainEmergencyContact.phone)}
                    </p>
                  </div>
                )}

                {/* Secondary Contacts */}
                {secondaryContacts.map((contact, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
                  >
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {contact.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {contact.relationship}
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatPhoneNumber(contact.phone)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            {patient.notes && (
              <div className="lg:col-span-2">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Notas Adicionales
                </h3>
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {patient.notes}
                  </p>
                </div>
              </div>
            )}

            {/* System Information */}
            <div className="lg:col-span-2">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                Información del Sistema
              </h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Fecha de Registro
                  </label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {formatDate(patient.createdAt)}
                  </p>
                </div>

                {patient.updatedAt.getTime() !==
                  patient.createdAt.getTime() && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Última Actualización
                    </label>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {formatDate(patient.updatedAt)}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Historia Médica
                  </label>
                  <p className="text-sm font-mono text-gray-900 dark:text-gray-100">
                    {patient.medicalRecordId}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-800">
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
            <Button onClick={onEdit}>
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Editar Paciente
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
