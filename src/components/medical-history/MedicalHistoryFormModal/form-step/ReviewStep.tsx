// components/medical-history/form-steps/ReviewStep.tsx
"use client";

import {
  MEDICAL_HISTORY_TYPE_LABELS,
  MEDICAL_HISTORY_TYPE_COLORS,
  MedicalHistoryType,
} from "@/types/medical-history";
import type { FormData } from "../MedicalHistoryFormWizard";

interface ReviewStepProps {
  data: FormData;
  errors: Record<string, string>;
}

export function ReviewStep({ data, errors }: ReviewStepProps) {
  const typeLabel =
    MEDICAL_HISTORY_TYPE_LABELS[data.type as MedicalHistoryType] || data.type;
  const typeColor =
    MEDICAL_HISTORY_TYPE_COLORS[data.type as MedicalHistoryType] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";

  const getPatientFullName = () => {
    if (!data.selectedPatient) return "Paciente no seleccionado";
    const { name, lastName, secondLastName } = data.selectedPatient;
    return `${name} ${lastName}${secondLastName ? ` ${secondLastName}` : ""}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const InfoSection = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="space-y-3">
      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h4>
      <div className="space-y-2">{children}</div>
    </div>
  );

  const InfoItem = ({
    label,
    value,
    important = false,
  }: {
    label: string;
    value?: string | number | null;
    important?: boolean;
  }) => {
    if (!value) return null;
    return (
      <div
        className={`${
          important
            ? "rounded-lg border border-brand-200 bg-brand-50 p-3 dark:border-brand-700 dark:bg-brand-500/10"
            : ""
        }`}
      >
        <dt
          className={`text-sm font-medium ${
            important
              ? "text-brand-700 dark:text-brand-300"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {label}
        </dt>
        <dd
          className={`text-sm ${
            important
              ? "text-brand-900 dark:text-brand-100"
              : "text-gray-900 dark:text-gray-100"
          }`}
        >
          {value}
        </dd>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Revisar Historia Clínica
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Revise cuidadosamente toda la información antes de guardar la historia
          clínica.
        </p>
      </div>

      {/* Summary Header */}
      <div className="rounded-lg border border-gray-200 bg-gradient-to-r from-brand-50 to-blue-50 p-6 dark:border-gray-700 dark:from-brand-500/10 dark:to-blue-500/10">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {getPatientFullName()}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ID: {data.selectedPatient?.id || data.patientId}
            </p>
          </div>
          <div className="text-right">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${typeColor}`}
            >
              {typeLabel}
            </span>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Versión {data.version}
            </p>
          </div>
        </div>
      </div>

      {/* Patient Information */}
      {data.selectedPatient && (
        <InfoSection title="Información del Paciente">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoItem
              label="Nombre completo"
              value={getPatientFullName()}
              important
            />
            <InfoItem label="ID del paciente" value={data.selectedPatient.id} />
            <InfoItem label="CI" value={data.selectedPatient.ci} />
            <InfoItem label="Email" value={data.selectedPatient.email} />
            <InfoItem label="Teléfono" value={data.selectedPatient.phone} />
            <InfoItem
              label="Fecha de nacimiento"
              value={
                data.selectedPatient.dateOfBirth
                  ? formatDate(data.selectedPatient.dateOfBirth)
                  : undefined
              }
            />
          </div>
        </InfoSection>
      )}

      {/* Basic Information */}
      <InfoSection title="Información Básica">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InfoItem label="Tipo de historia" value={typeLabel} important />
          <InfoItem label="Especialidad" value={data.specialty} />
          <InfoItem label="Empresa/Seguro" value={data.company} />
          <InfoItem label="Doctor responsable" value={data.attendingDoctorId} />
        </div>
      </InfoSection>

      {/* Medical History */}
      <InfoSection title="Historia Médica">
        <InfoItem
          label="Motivo de consulta"
          value={data.chiefComplaint}
          important
        />
        <InfoItem
          label="Historia de la enfermedad actual"
          value={data.currentIllnessHistory}
        />
        <InfoItem
          label="Antecedentes no patológicos"
          value={data.nonPathologicalHistory}
        />
        <InfoItem
          label="Antecedentes patológicos"
          value={data.clinicalHistory}
        />
        <InfoItem
          label="Antecedentes quirúrgicos"
          value={data.surgicalHistory}
        />

        {data.allergies && data.allergies.length > 0 && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-700 dark:bg-red-500/10">
            <dt className="text-sm font-medium text-red-700 dark:text-red-300">
              Alergias
            </dt>
            <dd className="text-sm text-red-900 dark:text-red-100">
              <div className="flex flex-wrap gap-1">
                {data.allergies.map((allergy, index) => (
                  <span
                    key={index}
                    className="inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200"
                  >
                    {allergy}
                  </span>
                ))}
              </div>
            </dd>
          </div>
        )}
      </InfoSection>

      {/* Physical Examination */}
      <InfoSection title="Examen Físico">
        <InfoItem
          label="Examen físico general"
          value={data.generalPhysicalExam}
        />
        <InfoItem
          label="Examen físico segmentario"
          value={data.segmentalPhysicalExam}
        />

        {data.vitalSigns && (
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Signos vitales
            </dt>
            <dd className="text-sm text-gray-900 dark:text-gray-100">
              <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                {data.vitalSigns.bloodPressureSystolic &&
                  data.vitalSigns.bloodPressureDiastolic && (
                    <span>
                      PA: {data.vitalSigns.bloodPressureSystolic}/
                      {data.vitalSigns.bloodPressureDiastolic} mmHg
                    </span>
                  )}
                {data.vitalSigns.heartRate && (
                  <span>FC: {data.vitalSigns.heartRate} bpm</span>
                )}
                {data.vitalSigns.respiratoryRate && (
                  <span>FR: {data.vitalSigns.respiratoryRate} rpm</span>
                )}
                {data.vitalSigns.temperature && (
                  <span>T°: {data.vitalSigns.temperature}°C</span>
                )}
                {data.vitalSigns.weight && (
                  <span>Peso: {data.vitalSigns.weight} kg</span>
                )}
                {data.vitalSigns.height && (
                  <span>Talla: {data.vitalSigns.height} cm</span>
                )}
                {data.vitalSigns.oxygenSaturation && (
                  <span>SatO2: {data.vitalSigns.oxygenSaturation}%</span>
                )}
              </div>
            </dd>
          </div>
        )}
      </InfoSection>

      {/* Diagnosis and Treatment */}
      <InfoSection title="Diagnóstico y Tratamiento">
        <InfoItem
          label="Exámenes solicitados"
          value={data.complementaryExamsRequest}
        />
        <InfoItem
          label="Diagnóstico"
          value={data.presumptiveOrDefinitiveDiagnosis}
          important
        />
        <InfoItem
          label="Plan de tratamiento"
          value={data.therapeuticManagementPlan}
        />
        <InfoItem
          label="Recomendaciones"
          value={data.recommendationsNextAppointment}
        />
      </InfoSection>

      {/* Specialized History */}
      {data.type === MedicalHistoryType.GYNECO_OBSTETRICS &&
        data.gynecoObstetricHistory && (
          <InfoSection title="Historia Gineco-Obstétrica">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoItem
                label="Edad de menarquia"
                value={
                  data.gynecoObstetricHistory.menarcheAge
                    ? `${data.gynecoObstetricHistory.menarcheAge} años`
                    : undefined
                }
              />
              <InfoItem
                label="Última menstruación"
                value={
                  data.gynecoObstetricHistory.lastMenstrualPeriod
                    ? formatDate(
                        data.gynecoObstetricHistory.lastMenstrualPeriod
                      )
                    : undefined
                }
              />
              <InfoItem
                label="Ciclo menstrual"
                value={
                  data.gynecoObstetricHistory.menstrualCycleLength
                    ? `${data.gynecoObstetricHistory.menstrualCycleLength} días`
                    : undefined
                }
              />
              <InfoItem
                label="Método anticonceptivo"
                value={data.gynecoObstetricHistory.contraceptiveMethod}
              />
              <InfoItem
                label="Embarazos"
                value={data.gynecoObstetricHistory.pregnancies}
              />
              <InfoItem
                label="Partos"
                value={data.gynecoObstetricHistory.deliveries}
              />
              <InfoItem
                label="Abortos"
                value={data.gynecoObstetricHistory.abortions}
              />
              <InfoItem
                label="Cesáreas"
                value={data.gynecoObstetricHistory.cesareans}
              />
              <InfoItem
                label="Último Papanicolaou"
                value={
                  data.gynecoObstetricHistory.lastPapSmear
                    ? formatDate(data.gynecoObstetricHistory.lastPapSmear)
                    : undefined
                }
              />
              <InfoItem
                label="Última mamografía"
                value={
                  data.gynecoObstetricHistory.lastMammography
                    ? formatDate(data.gynecoObstetricHistory.lastMammography)
                    : undefined
                }
              />
            </div>
          </InfoSection>
        )}

      {data.type === MedicalHistoryType.PEDIATRICS && data.pediatricHistory && (
        <InfoSection title="Historia Pediátrica">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoItem
              label="Peso al nacer"
              value={
                data.pediatricHistory.birthWeight
                  ? `${data.pediatricHistory.birthWeight} g`
                  : undefined
              }
            />
            <InfoItem
              label="Talla al nacer"
              value={
                data.pediatricHistory.birthHeight
                  ? `${data.pediatricHistory.birthHeight} cm`
                  : undefined
              }
            />
            <InfoItem
              label="Edad gestacional"
              value={
                data.pediatricHistory.gestationalAge
                  ? `${data.pediatricHistory.gestationalAge} semanas`
                  : undefined
              }
            />
            <InfoItem
              label="Tipo de parto"
              value={
                data.pediatricHistory.deliveryType === "vaginal"
                  ? "Vaginal"
                  : data.pediatricHistory.deliveryType === "cesarean"
                  ? "Cesárea"
                  : undefined
              }
            />
          </div>

          {data.pediatricHistory.breastfeeding && (
            <InfoItem
              label="Lactancia materna"
              value={
                data.pediatricHistory.breastfeeding.wasBreastfed
                  ? `Sí${
                      data.pediatricHistory.breastfeeding.durationMonths
                        ? `, durante ${data.pediatricHistory.breastfeeding.durationMonths} meses`
                        : ""
                    }`
                  : "No"
              }
            />
          )}

          {data.pediatricHistory.vaccinations &&
            data.pediatricHistory.vaccinations.length > 0 && (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Vacunas
                </dt>
                <dd className="text-sm text-gray-900 dark:text-gray-100">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {data.pediatricHistory.vaccinations.map(
                      (vaccination, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{vaccination.name}</span>
                          <span className="text-gray-500">
                            {formatDate(vaccination.date)}
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
      {data.doctorSignature && (
        <InfoSection title="Firma Médica">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoItem
              label="ID del doctor"
              value={data.doctorSignature.doctorId}
              important
            />
            <InfoItem
              label="Firma digital"
              value={data.doctorSignature.digitalSignature}
            />
          </div>
          <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-500/10">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              ℹ️ La fecha y hora de firma se registrará automáticamente al
              guardar.
            </p>
          </div>
        </InfoSection>
      )}

      {/* Validation Errors */}
      {Object.keys(errors).length > 0 && (
        <div className="rounded-lg border border-error-200 bg-error-50 p-4 dark:border-error-700 dark:bg-error-500/10">
          <h4 className="text-lg font-semibold text-error-800 dark:text-error-200 mb-2">
            Errores de Validación
          </h4>
          <ul className="list-disc pl-5 space-y-1">
            {Object.entries(errors).map(([field, message]) => (
              <li
                key={field}
                className="text-sm text-error-700 dark:text-error-300"
              >
                {message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Final Confirmation */}
      <div className="rounded-lg bg-green-50 p-4 dark:bg-green-500/10">
        <div className="flex">
          <svg
            className="h-5 w-5 text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
              Listo para Guardar
            </h3>
            <div className="mt-2 text-sm text-green-700 dark:text-green-300">
              <ul className="list-disc pl-5 space-y-1">
                <li>Verifique que toda la información sea correcta</li>
                <li>
                  Una vez guardada, se incrementará automáticamente la versión
                </li>
                <li>
                  La fecha de creación/actualización se registrará
                  automáticamente
                </li>
                <li>
                  La historia clínica estará disponible para consultas futuras
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
