// components/medical-history/form-steps/MedicalHistoryStep.tsx
"use client";

import { useState } from "react";
import type { FormData } from "../MedicalHistoryFormWizard";

interface MedicalHistoryStepProps {
  data: FormData;
  errors: Record<string, string>;
  onChange: (data: Partial<FormData>) => void;
}

export function MedicalHistoryStep({
  data,
  errors,
  onChange,
}: MedicalHistoryStepProps) {
  const [newAllergy, setNewAllergy] = useState("");

  const handleAddAllergy = () => {
    if (newAllergy.trim()) {
      const currentAllergies = data.allergies || [];
      onChange({
        allergies: [...currentAllergies, newAllergy.trim()],
      });
      setNewAllergy("");
    }
  };

  const handleRemoveAllergy = (index: number) => {
    const currentAllergies = data.allergies || [];
    onChange({
      allergies: currentAllergies.filter((_, i) => i !== index),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddAllergy();
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Historia Médica y Antecedentes
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Complete la información sobre los antecedentes médicos del paciente y
          el motivo actual de consulta.
        </p>
      </div>

      {/* Chief Complaint */}
      <div>
        <label
          htmlFor="chiefComplaint"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Motivo de Consulta
        </label>
        <textarea
          id="chiefComplaint"
          rows={3}
          placeholder="Describa el motivo principal por el que el paciente solicita atención médica..."
          value={data.chiefComplaint || ""}
          onChange={(e) =>
            onChange({ chiefComplaint: e.target.value || undefined })
          }
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-brand-400"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Síntoma principal o razón por la cual el paciente busca atención
          médica
        </p>
      </div>

      {/* Current Illness History */}
      <div>
        <label
          htmlFor="currentIllnessHistory"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Historia de la Enfermedad Actual
        </label>
        <textarea
          id="currentIllnessHistory"
          rows={4}
          placeholder="Describa detalladamente la evolución del cuadro actual, incluyendo inicio, características, factores agravantes y atenuantes..."
          value={data.currentIllnessHistory || ""}
          onChange={(e) =>
            onChange({ currentIllnessHistory: e.target.value || undefined })
          }
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-brand-400"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Desarrollo cronológico y características de la enfermedad actual
        </p>
      </div>

      {/* Medical History Sections */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Non-pathological History */}
        <div>
          <label
            htmlFor="nonPathologicalHistory"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Antecedentes No Patológicos
          </label>
          <textarea
            id="nonPathologicalHistory"
            rows={4}
            placeholder="Hábitos: tabaquismo, alcoholismo, ejercicio, dieta, etc."
            value={data.nonPathologicalHistory || ""}
            onChange={(e) =>
              onChange({ nonPathologicalHistory: e.target.value || undefined })
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-brand-400"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Hábitos de vida, exposiciones ocupacionales, etc.
          </p>
        </div>

        {/* Clinical History */}
        <div>
          <label
            htmlFor="clinicalHistory"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Antecedentes Patológicos
          </label>
          <textarea
            id="clinicalHistory"
            rows={4}
            placeholder="Enfermedades previas, hospitalizations, medicamentos actuales..."
            value={data.clinicalHistory || ""}
            onChange={(e) =>
              onChange({ clinicalHistory: e.target.value || undefined })
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-brand-400"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Enfermedades previas, medicamentos, hospitalizaciones
          </p>
        </div>
      </div>

      {/* Surgical History */}
      <div>
        <label
          htmlFor="surgicalHistory"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Antecedentes Quirúrgicos
        </label>
        <textarea
          id="surgicalHistory"
          rows={3}
          placeholder="Cirugías previas, complicaciones, anestesias..."
          value={data.surgicalHistory || ""}
          onChange={(e) =>
            onChange({ surgicalHistory: e.target.value || undefined })
          }
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-brand-400"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Cirugías previas, procedimientos, complicaciones anestésicas
        </p>
      </div>

      {/* Allergies */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Alergias
        </label>

        {/* Add New Allergy */}
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Escriba una alergia y presione Enter"
            value={newAllergy}
            onChange={(e) => setNewAllergy(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-brand-400"
          />
          <button
            type="button"
            onClick={handleAddAllergy}
            disabled={!newAllergy.trim()}
            className="rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600 disabled:bg-gray-300 disabled:cursor-not-allowed dark:disabled:bg-gray-600"
          >
            Agregar
          </button>
        </div>

        {/* Allergies List */}
        {data.allergies && data.allergies.length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Alergias registradas:
            </p>
            <div className="flex flex-wrap gap-2">
              {data.allergies.map((allergy, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-sm text-red-800 dark:bg-red-900 dark:text-red-200"
                >
                  <span>{allergy}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAllergy(index)}
                    className="rounded-full p-1 hover:bg-red-200 dark:hover:bg-red-800"
                    title="Eliminar alergia"
                  >
                    <svg
                      className="h-3 w-3"
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
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-4 text-center dark:border-gray-600">
            <svg
              className="mx-auto h-8 w-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              No se han registrado alergias
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Agregue alergias conocidas del paciente
            </p>
          </div>
        )}

        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Registre todas las alergias conocidas (medicamentos, alimentos,
          materiales)
        </p>
      </div>

      {/* Quick Allergy Suggestions */}
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Alergias Comunes
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            "Penicilina",
            "Aspirina",
            "Ibuprofeno",
            "Mariscos",
            "Nueces",
            "Látex",
            "Sulfonamidas",
            "Contraste yodado",
            "Polen",
            "Polvo",
          ].map((commonAllergy) => (
            <button
              key={commonAllergy}
              type="button"
              onClick={() => {
                const currentAllergies = data.allergies || [];
                if (!currentAllergies.includes(commonAllergy)) {
                  onChange({
                    allergies: [...currentAllergies, commonAllergy],
                  });
                }
              }}
              disabled={data.allergies?.includes(commonAllergy)}
              className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:disabled:bg-gray-700"
            >
              + {commonAllergy}
            </button>
          ))}
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
              Información Importante
            </h3>
            <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Registre todas las alergias conocidas, incluso las leves
                </li>
                <li>Incluya reacciones adversas a medicamentos específicos</li>
                <li>Anote la severidad de las reacciones si es conocida</li>
                <li>Verifique esta información directamente con el paciente</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
