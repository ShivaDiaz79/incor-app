// components/medical-history/MedicalHistoryDetailsModal.tsx
"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import type { MedicalHistory } from "@/types/medical-history";
import {
  MEDICAL_HISTORY_TYPE_LABELS,
  MEDICAL_HISTORY_TYPE_COLORS,
  MedicalHistoryType,
} from "@/types/medical-history";
import Button from "@/components/ui/button/Button";

interface MedicalHistoryDetailsModalProps {
  isOpen: boolean;
  medicalHistory: MedicalHistory;
  onClose: () => void;
  onEdit: () => void;
}

export function MedicalHistoryDetailsModal({
  isOpen,
  medicalHistory,
  onClose,
  onEdit,
}: MedicalHistoryDetailsModalProps) {
  const typeLabel =
    MEDICAL_HISTORY_TYPE_LABELS[medicalHistory.type as MedicalHistoryType] ||
    medicalHistory.type;
  const typeColor =
    MEDICAL_HISTORY_TYPE_COLORS[medicalHistory.type as MedicalHistoryType] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateOnly = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPatientFullName = () => {
    if (!medicalHistory.patient) return "Paciente desconocido";
    const { name, lastName, secondLastName } = medicalHistory.patient;
    return `${name} ${lastName}${secondLastName ? ` ${secondLastName}` : ""}`;
  };

  const InfoSection = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );

  const InfoItem = ({
    label,
    value,
  }: {
    label: string;
    value?: string | number | null;
  }) => {
    if (!value) return null;
    return (
      <div>
        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {label}
        </dt>
        <dd className="text-sm text-gray-900 dark:text-gray-100">{value}</dd>
      </div>
    );
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 dark:bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-900">
                {/* Header */}
                <div className="mb-6 flex items-start justify-between">
                  <div className="flex-1">
                    <Dialog.Title
                      as="h2"
                      className="text-xl font-semibold leading-6 text-gray-900 dark:text-gray-100"
                    >
                      Historia Clínica - {getPatientFullName()}
                    </Dialog.Title>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      ID: {medicalHistory.id} • Versión {medicalHistory.version}
                    </p>

                    {/* Badges */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${typeColor}`}
                      >
                        {typeLabel}
                      </span>

                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          medicalHistory.isActive
                            ? "bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {medicalHistory.isActive ? "Activa" : "Inactiva"}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                  >
                    <svg
                      className="h-6 w-6"
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

                {/* Content */}
                <div className="max-h-[70vh] space-y-6 overflow-y-auto">
                  {/* Patient Information */}
                  <InfoSection title="Información del Paciente">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <InfoItem
                        label="Nombre completo"
                        value={getPatientFullName()}
                      />
                      <InfoItem
                        label="ID del paciente"
                        value={medicalHistory.patientId}
                      />
                      <InfoItem
                        label="Edad"
                        value={
                          medicalHistory.patient?.age
                            ? `${medicalHistory.patient.age} años`
                            : undefined
                        }
                      />
                    </div>
                  </InfoSection>

                  {/* Medical Information */}
                  <InfoSection title="Información Médica">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <InfoItem
                        label="Especialidad"
                        value={medicalHistory.specialty}
                      />
                      <InfoItem
                        label="Empresa"
                        value={medicalHistory.company}
                      />
                      <InfoItem
                        label="Doctor responsable"
                        value={medicalHistory.attendingDoctorId}
                      />
                    </div>
                  </InfoSection>

                  {/* Chief Complaint and History */}
                  <InfoSection title="Motivo de Consulta e Historia">
                    <InfoItem
                      label="Motivo de consulta"
                      value={medicalHistory.chiefComplaint}
                    />
                    <InfoItem
                      label="Historia de la enfermedad actual"
                      value={medicalHistory.currentIllnessHistory}
                    />
                    <InfoItem
                      label="Antecedentes no patológicos"
                      value={medicalHistory.nonPathologicalHistory}
                    />
                    <InfoItem
                      label="Antecedentes clínicos"
                      value={medicalHistory.clinicalHistory}
                    />
                    <InfoItem
                      label="Antecedentes quirúrgicos"
                      value={medicalHistory.surgicalHistory}
                    />

                    {medicalHistory.allergies &&
                      medicalHistory.allergies.length > 0 && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Alergias
                          </dt>
                          <dd className="text-sm text-gray-900 dark:text-gray-100">
                            <div className="flex flex-wrap gap-1">
                              {medicalHistory.allergies.map(
                                (allergy, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200"
                                  >
                                    {allergy}
                                  </span>
                                )
                              )}
                            </div>
                          </dd>
                        </div>
                      )}
                  </InfoSection>

                  {/* Physical Examination */}
                  <InfoSection title="Examen Físico">
                    <InfoItem
                      label="Examen físico general"
                      value={medicalHistory.generalPhysicalExam}
                    />
                    <InfoItem
                      label="Examen físico segmentario"
                      value={medicalHistory.segmentalPhysicalExam}
                    />

                    {medicalHistory.vitalSigns && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Signos vitales
                        </dt>
                        <dd className="text-sm text-gray-900 dark:text-gray-100">
                          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                            {medicalHistory.vitalSigns.bloodPressureSystolic &&
                              medicalHistory.vitalSigns
                                .bloodPressureDiastolic && (
                                <span>
                                  PA:{" "}
                                  {
                                    medicalHistory.vitalSigns
                                      .bloodPressureSystolic
                                  }
                                  /
                                  {
                                    medicalHistory.vitalSigns
                                      .bloodPressureDiastolic
                                  }{" "}
                                  mmHg
                                </span>
                              )}
                            {medicalHistory.vitalSigns.heartRate && (
                              <span>
                                FC: {medicalHistory.vitalSigns.heartRate} bpm
                              </span>
                            )}
                            {medicalHistory.vitalSigns.respiratoryRate && (
                              <span>
                                FR: {medicalHistory.vitalSigns.respiratoryRate}{" "}
                                rpm
                              </span>
                            )}
                            {medicalHistory.vitalSigns.temperature && (
                              <span>
                                T°: {medicalHistory.vitalSigns.temperature}°C
                              </span>
                            )}
                            {medicalHistory.vitalSigns.weight && (
                              <span>
                                Peso: {medicalHistory.vitalSigns.weight} kg
                              </span>
                            )}
                            {medicalHistory.vitalSigns.height && (
                              <span>
                                Talla: {medicalHistory.vitalSigns.height} cm
                              </span>
                            )}
                            {medicalHistory.vitalSigns.oxygenSaturation && (
                              <span>
                                SatO2:{" "}
                                {medicalHistory.vitalSigns.oxygenSaturation}%
                              </span>
                            )}
                          </div>
                        </dd>
                      </div>
                    )}
                  </InfoSection>

                  {/* Diagnosis and Treatment */}
                  <InfoSection title="Diagnóstico y Tratamiento">
                    <InfoItem
                      label="Solicitud de exámenes complementarios"
                      value={medicalHistory.complementaryExamsRequest}
                    />
                    <InfoItem
                      label="Diagnóstico presuntivo/definitivo"
                      value={medicalHistory.presumptiveOrDefinitiveDiagnosis}
                    />
                    <InfoItem
                      label="Plan de manejo terapéutico"
                      value={medicalHistory.therapeuticManagementPlan}
                    />
                    <InfoItem
                      label="Recomendaciones/próxima cita"
                      value={medicalHistory.recommendationsNextAppointment}
                    />
                  </InfoSection>

                  {/* Gyneco-Obstetric History */}
                  {medicalHistory.gynecoObstetricHistory && (
                    <InfoSection title="Historia Gineco-Obstétrica">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <InfoItem
                          label="Edad de menarquia"
                          value={
                            medicalHistory.gynecoObstetricHistory.menarcheAge
                              ? `${medicalHistory.gynecoObstetricHistory.menarcheAge} años`
                              : undefined
                          }
                        />
                        <InfoItem
                          label="Última menstruación"
                          value={
                            medicalHistory.gynecoObstetricHistory
                              .lastMenstrualPeriod
                              ? formatDateOnly(
                                  medicalHistory.gynecoObstetricHistory
                                    .lastMenstrualPeriod
                                )
                              : undefined
                          }
                        />
                        <InfoItem
                          label="Ciclo menstrual"
                          value={
                            medicalHistory.gynecoObstetricHistory
                              .menstrualCycleLength
                              ? `${medicalHistory.gynecoObstetricHistory.menstrualCycleLength} días`
                              : undefined
                          }
                        />
                        <InfoItem
                          label="Método anticonceptivo"
                          value={
                            medicalHistory.gynecoObstetricHistory
                              .contraceptiveMethod
                          }
                        />
                        <InfoItem
                          label="Embarazos"
                          value={
                            medicalHistory.gynecoObstetricHistory.pregnancies
                          }
                        />
                        <InfoItem
                          label="Partos"
                          value={
                            medicalHistory.gynecoObstetricHistory.deliveries
                          }
                        />
                        <InfoItem
                          label="Abortos"
                          value={
                            medicalHistory.gynecoObstetricHistory.abortions
                          }
                        />
                        <InfoItem
                          label="Cesáreas"
                          value={
                            medicalHistory.gynecoObstetricHistory.cesareans
                          }
                        />
                        <InfoItem
                          label="Síntomas climatéricos"
                          value={
                            medicalHistory.gynecoObstetricHistory
                              .climatericSymptoms
                              ? "Sí"
                              : "No"
                          }
                        />
                        <InfoItem
                          label="Último Papanicolaou"
                          value={
                            medicalHistory.gynecoObstetricHistory.lastPapSmear
                              ? formatDateOnly(
                                  medicalHistory.gynecoObstetricHistory
                                    .lastPapSmear
                                )
                              : undefined
                          }
                        />
                        <InfoItem
                          label="Última mamografía"
                          value={
                            medicalHistory.gynecoObstetricHistory
                              .lastMammography
                              ? formatDateOnly(
                                  medicalHistory.gynecoObstetricHistory
                                    .lastMammography
                                )
                              : undefined
                          }
                        />
                        <InfoItem
                          label="Sexualmente activa"
                          value={
                            medicalHistory.gynecoObstetricHistory.sexuallyActive
                              ? "Sí"
                              : "No"
                          }
                        />
                        <InfoItem
                          label="Parejas sexuales"
                          value={
                            medicalHistory.gynecoObstetricHistory.sexualPartners
                          }
                        />
                      </div>
                    </InfoSection>
                  )}

                  {/* Pediatric History */}
                  {medicalHistory.pediatricHistory && (
                    <InfoSection title="Historia Pediátrica">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <InfoItem
                          label="Peso al nacer"
                          value={
                            medicalHistory.pediatricHistory.birthWeight
                              ? `${medicalHistory.pediatricHistory.birthWeight} g`
                              : undefined
                          }
                        />
                        <InfoItem
                          label="Talla al nacer"
                          value={
                            medicalHistory.pediatricHistory.birthHeight
                              ? `${medicalHistory.pediatricHistory.birthHeight} cm`
                              : undefined
                          }
                        />
                        <InfoItem
                          label="Edad gestacional"
                          value={
                            medicalHistory.pediatricHistory.gestationalAge
                              ? `${medicalHistory.pediatricHistory.gestationalAge} semanas`
                              : undefined
                          }
                        />
                        <InfoItem
                          label="Tipo de parto"
                          value={
                            medicalHistory.pediatricHistory.deliveryType ===
                            "vaginal"
                              ? "Vaginal"
                              : medicalHistory.pediatricHistory.deliveryType ===
                                "cesarean"
                              ? "Cesárea"
                              : undefined
                          }
                        />
                      </div>

                      {medicalHistory.pediatricHistory.complications &&
                        medicalHistory.pediatricHistory.complications.length >
                          0 && (
                          <div>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Complicaciones
                            </dt>
                            <dd className="text-sm text-gray-900 dark:text-gray-100">
                              {medicalHistory.pediatricHistory.complications.join(
                                ", "
                              )}
                            </dd>
                          </div>
                        )}

                      {medicalHistory.pediatricHistory.breastfeeding && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Lactancia materna
                          </dt>
                          <dd className="text-sm text-gray-900 dark:text-gray-100">
                            {medicalHistory.pediatricHistory.breastfeeding
                              .wasBreastfed
                              ? `Sí${
                                  medicalHistory.pediatricHistory.breastfeeding
                                    .durationMonths
                                    ? `, durante ${medicalHistory.pediatricHistory.breastfeeding.durationMonths} meses`
                                    : ""
                                }`
                              : "No"}
                          </dd>
                        </div>
                      )}

                      {medicalHistory.pediatricHistory.vaccinations &&
                        medicalHistory.pediatricHistory.vaccinations.length >
                          0 && (
                          <div>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Vacunas
                            </dt>
                            <dd className="text-sm text-gray-900 dark:text-gray-100">
                              <div className="space-y-1">
                                {medicalHistory.pediatricHistory.vaccinations.map(
                                  (vaccination, index) => (
                                    <div
                                      key={index}
                                      className="flex justify-between"
                                    >
                                      <span>{vaccination.name}</span>
                                      <span className="text-gray-500">
                                        {formatDateOnly(vaccination.date)}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            </dd>
                          </div>
                        )}
                    </InfoSection>
                  )}

                  {/* Doctor Signature */}
                  {medicalHistory.doctorSignature && (
                    <InfoSection title="Firma Médica">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <InfoItem
                          label="Doctor"
                          value={
                            medicalHistory.signatureDoctor
                              ? `${medicalHistory.signatureDoctor.name} ${medicalHistory.signatureDoctor.lastName}`
                              : medicalHistory.doctorSignature.doctorId
                          }
                        />
                        <InfoItem
                          label="Especialidad"
                          value={medicalHistory.signatureDoctor?.speciality}
                        />
                        <InfoItem
                          label="Fecha de firma"
                          value={
                            medicalHistory.doctorSignature.signedAt
                              ? formatDate(
                                  medicalHistory.doctorSignature.signedAt
                                )
                              : undefined
                          }
                        />
                      </div>
                    </InfoSection>
                  )}

                  {/* Audit Information */}
                  <InfoSection title="Información de Auditoría">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <InfoItem
                        label="Creada por"
                        value={medicalHistory.lastUpdatedBy}
                      />
                      <InfoItem
                        label="Fecha de creación"
                        value={formatDate(medicalHistory.createdAt)}
                      />
                      <InfoItem
                        label="Última actualización"
                        value={formatDate(medicalHistory.updatedAt)}
                      />
                      <InfoItem
                        label="Versión"
                        value={medicalHistory.version}
                      />
                    </div>
                  </InfoSection>
                </div>

                {/* Footer */}
                <div className="mt-6 flex justify-end gap-3">
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
                    Editar
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
