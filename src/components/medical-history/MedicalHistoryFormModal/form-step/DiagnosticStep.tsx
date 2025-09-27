// components/medical-history/form-steps/DiagnosisStep.tsx
"use client";

import { useState } from "react";
import type { FormData } from "../MedicalHistoryFormWizard";

interface DiagnosisStepProps {
  data: FormData;
  errors: Record<string, string>;
  onChange: (data: Partial<FormData>) => void;
}

export function DiagnosisStep({ data, errors, onChange }: DiagnosisStepProps) {
  const [showDoctorSignature, setShowDoctorSignature] = useState(
    !!data.doctorSignature?.doctorId
  );

  const handleDoctorSignatureChange = (field: string, value: string) => {
    const currentSignature = data.doctorSignature ?? { doctorId: "" };

    if (field === "doctorId" && !value.trim()) {
      // If doctorId is cleared, remove the entire signature
      onChange({ doctorSignature: undefined });
      setShowDoctorSignature(false);
    } else {
      onChange({
        doctorSignature: {
          ...currentSignature,
          [field]: value || undefined,
        },
      });
    }
  };

  const handleAddDoctorSignature = () => {
    setShowDoctorSignature(true);
    onChange({
      doctorSignature: {
        doctorId: data.attendingDoctorId!,
        digitalSignature: undefined,
      },
    });
  };

  const handleRemoveDoctorSignature = () => {
    setShowDoctorSignature(false);
    onChange({ doctorSignature: undefined });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Diagnóstico y Plan de Tratamiento
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Complete la información sobre el diagnóstico, exámenes solicitados y
          plan terapéutico.
        </p>
      </div>

      {/* Complementary Exams Request */}
      <div>
        <label
          htmlFor="complementaryExamsRequest"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Solicitud de Exámenes Complementarios
        </label>
        <textarea
          id="complementaryExamsRequest"
          rows={4}
          placeholder="Laboratorios, estudios de imagen, electrocardiograma, etc..."
          value={data.complementaryExamsRequest || ""}
          onChange={(e) =>
            onChange({ complementaryExamsRequest: e.target.value || undefined })
          }
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-brand-400"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Especifique los exámenes de laboratorio, imágenes o estudios
          especiales solicitados
        </p>
      </div>

      {/* Diagnosis */}
      <div>
        <label
          htmlFor="presumptiveOrDefinitiveDiagnosis"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Diagnóstico Presuntivo y/o Definitivo
        </label>
        <textarea
          id="presumptiveOrDefinitiveDiagnosis"
          rows={4}
          placeholder="Diagnóstico principal y diagnósticos diferenciales..."
          value={data.presumptiveOrDefinitiveDiagnosis || ""}
          onChange={(e) =>
            onChange({
              presumptiveOrDefinitiveDiagnosis: e.target.value || undefined,
            })
          }
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-brand-400"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Diagnóstico principal basado en los hallazgos clínicos y paraclínicos
        </p>
      </div>

      {/* Therapeutic Management Plan */}
      <div>
        <label
          htmlFor="therapeuticManagementPlan"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Plan de Manejo Terapéutico
        </label>
        <textarea
          id="therapeuticManagementPlan"
          rows={5}
          placeholder="Medicamentos, dosis, frecuencia, duración del tratamiento, medidas no farmacológicas..."
          value={data.therapeuticManagementPlan || ""}
          onChange={(e) =>
            onChange({ therapeuticManagementPlan: e.target.value || undefined })
          }
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-brand-400"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Detalle el plan de tratamiento incluyendo medicamentos, dosis, y
          medidas generales
        </p>
      </div>

      {/* Recommendations and Next Appointment */}
      <div>
        <label
          htmlFor="recommendationsNextAppointment"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Recomendaciones y Próxima Cita
        </label>
        <textarea
          id="recommendationsNextAppointment"
          rows={4}
          placeholder="Recomendaciones generales, signos de alarma, fecha de control, especialista a consultar..."
          value={data.recommendationsNextAppointment || ""}
          onChange={(e) =>
            onChange({
              recommendationsNextAppointment: e.target.value || undefined,
            })
          }
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-brand-400"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Recomendaciones para el paciente, signos de alarma y seguimiento
        </p>
      </div>

      {/* Doctor Signature Section */}
      <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Firma Médica
          </h4>

          {!showDoctorSignature ? (
            <button
              type="button"
              onClick={handleAddDoctorSignature}
              className="inline-flex items-center rounded-lg border border-brand-300 bg-white px-3 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50 dark:border-brand-600 dark:bg-gray-800 dark:text-brand-400 dark:hover:bg-brand-500/10"
            >
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Agregar Firma
            </button>
          ) : (
            <button
              type="button"
              onClick={handleRemoveDoctorSignature}
              className="inline-flex items-center rounded-lg border border-error-300 bg-white px-3 py-2 text-sm font-medium text-error-700 hover:bg-error-50 dark:border-error-600 dark:bg-gray-800 dark:text-error-400 dark:hover:bg-error-500/10"
            >
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Remover Firma
            </button>
          )}
        </div>

        {showDoctorSignature && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Doctor ID */}
              <div>
                <label
                  htmlFor="doctorId"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  ID del Doctor *
                </label>
                <input
                  type="text"
                  id="doctorId"
                  placeholder="Ej: user123"
                  value={data.doctorSignature?.doctorId || ""}
                  onChange={(e) =>
                    handleDoctorSignatureChange("doctorId", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
                  required
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  ID del doctor que firma la historia clínica
                </p>
              </div>

              {/* Digital Signature */}
              <div>
                <label
                  htmlFor="digitalSignature"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Firma Digital (Opcional)
                </label>
                <input
                  type="text"
                  id="digitalSignature"
                  placeholder="URL o hash de la firma digital"
                  value={data.doctorSignature?.digitalSignature || ""}
                  onChange={(e) =>
                    handleDoctorSignatureChange(
                      "digitalSignature",
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Enlace o identificador de la firma digital
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-500/10">
              <div className="flex">
                <svg
                  className="h-4 w-4 text-blue-400 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="ml-2">
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    La fecha y hora de firma se registrará automáticamente al
                    guardar la historia clínica.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Common Templates */}
      <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Plantillas Comunes
        </h4>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Common Exams */}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Exámenes Frecuentes
            </p>
            <div className="flex flex-wrap gap-1">
              {[
                "Hemograma completo",
                "Glicemia",
                "Creatinina",
                "Urea",
                "Perfil lipídico",
                "TSH",
                "Orina completa",
                "Radiografía de tórax",
                "Electrocardiograma",
              ].map((exam) => (
                <button
                  key={exam}
                  type="button"
                  onClick={() => {
                    const current = data.complementaryExamsRequest || "";
                    const newValue = current ? `${current}, ${exam}` : exam;
                    onChange({ complementaryExamsRequest: newValue });
                  }}
                  className="rounded-full border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  + {exam}
                </button>
              ))}
            </div>
          </div>

          {/* Common Recommendations */}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Recomendaciones Frecuentes
            </p>
            <div className="flex flex-wrap gap-1">
              {[
                "Dieta baja en sal",
                "Ejercicio regular",
                "Control en 1 semana",
                "Signos de alarma",
                "Hidratación abundante",
                "Reposo relativo",
                "Evitar automedicación",
                "Control con especialista",
              ].map((recommendation) => (
                <button
                  key={recommendation}
                  type="button"
                  onClick={() => {
                    const current = data.recommendationsNextAppointment || "";
                    const newValue = current
                      ? `${current}\n• ${recommendation}`
                      : `• ${recommendation}`;
                    onChange({ recommendationsNextAppointment: newValue });
                  }}
                  className="rounded-full border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  + {recommendation}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-500/10">
        <div className="flex">
          <svg
            className="h-5 w-5 text-yellow-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Recordatorios Importantes
            </h3>
            <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Verifique que todos los diagnósticos estén respaldados por los
                  hallazgos
                </li>
                <li>Incluya dosis específicas en el plan de tratamiento</li>
                <li>
                  Especifique claramente los signos de alarma para el paciente
                </li>
                <li>
                  La firma médica es requerida para validar la historia clínica
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
