// components/medical-history/form-steps/PhysicalExamStep.tsx
"use client";

import type { FormData } from "../MedicalHistoryFormWizard";
import type { VitalSigns } from "@/types/medical-history";

interface PhysicalExamStepProps {
  data: FormData;
  errors: Record<string, string>;
  onChange: (data: Partial<FormData>) => void;
}

export function PhysicalExamStep({
  data,
  errors,
  onChange,
}: PhysicalExamStepProps) {
  const handleVitalSignsChange = (field: keyof VitalSigns, value: string) => {
    const numericValue = value === "" ? undefined : Number(value);

    const currentVitalSigns = data.vitalSigns || {};
    const updatedVitalSigns = {
      ...currentVitalSigns,
      [field]: numericValue,
    };

    // Remove undefined values
    Object.keys(updatedVitalSigns).forEach((key) => {
      if (updatedVitalSigns[key as keyof VitalSigns] === undefined) {
        delete updatedVitalSigns[key as keyof VitalSigns];
      }
    });

    onChange({
      vitalSigns:
        Object.keys(updatedVitalSigns).length > 0
          ? updatedVitalSigns
          : undefined,
    });
  };

  const calculateBMI = () => {
    if (data.vitalSigns?.weight && data.vitalSigns?.height) {
      const heightInMeters = data.vitalSigns.height / 100;
      const bmi = data.vitalSigns.weight / (heightInMeters * heightInMeters);
      return bmi.toFixed(1);
    }
    return null;
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Bajo peso", color: "text-blue-600" };
    if (bmi < 25) return { category: "Normal", color: "text-green-600" };
    if (bmi < 30) return { category: "Sobrepeso", color: "text-yellow-600" };
    return { category: "Obesidad", color: "text-red-600" };
  };

  const getVitalSignStatus = (field: keyof VitalSigns, value: number) => {
    switch (field) {
      case "bloodPressureSystolic":
        if (value < 90) return { status: "Baja", color: "text-blue-600" };
        if (value < 120) return { status: "Normal", color: "text-green-600" };
        if (value < 140) return { status: "Elevada", color: "text-yellow-600" };
        return { status: "Alta", color: "text-red-600" };

      case "bloodPressureDiastolic":
        if (value < 60) return { status: "Baja", color: "text-blue-600" };
        if (value < 80) return { status: "Normal", color: "text-green-600" };
        if (value < 90) return { status: "Elevada", color: "text-yellow-600" };
        return { status: "Alta", color: "text-red-600" };

      case "heartRate":
        if (value < 60)
          return { status: "Bradicardia", color: "text-blue-600" };
        if (value <= 100) return { status: "Normal", color: "text-green-600" };
        return { status: "Taquicardia", color: "text-red-600" };

      case "temperature":
        if (value < 36) return { status: "Hipotermia", color: "text-blue-600" };
        if (value <= 37.5) return { status: "Normal", color: "text-green-600" };
        if (value <= 38.5)
          return { status: "Febrícula", color: "text-yellow-600" };
        return { status: "Fiebre", color: "text-red-600" };

      default:
        return null;
    }
  };

  const bmi = calculateBMI();
  const bmiInfo = bmi ? getBMICategory(Number(bmi)) : null;

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Examen Físico
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Complete los signos vitales y hallazgos del examen físico del
          paciente.
        </p>
      </div>

      {/* Vital Signs Section */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Signos Vitales
        </h4>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Blood Pressure */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Presión Arterial (mmHg)
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Sistólica"
                  min="50"
                  max="300"
                  value={data.vitalSigns?.bloodPressureSystolic || ""}
                  onChange={(e) =>
                    handleVitalSignsChange(
                      "bloodPressureSystolic",
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
                />
                {data.vitalSigns?.bloodPressureSystolic && (
                  <p
                    className={`mt-1 text-xs ${
                      getVitalSignStatus(
                        "bloodPressureSystolic",
                        data.vitalSigns.bloodPressureSystolic
                      )?.color
                    }`}
                  >
                    {
                      getVitalSignStatus(
                        "bloodPressureSystolic",
                        data.vitalSigns.bloodPressureSystolic
                      )?.status
                    }
                  </p>
                )}
              </div>
              <span className="text-gray-500 dark:text-gray-400">/</span>
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Diastólica"
                  min="30"
                  max="200"
                  value={data.vitalSigns?.bloodPressureDiastolic || ""}
                  onChange={(e) =>
                    handleVitalSignsChange(
                      "bloodPressureDiastolic",
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
                />
                {data.vitalSigns?.bloodPressureDiastolic && (
                  <p
                    className={`mt-1 text-xs ${
                      getVitalSignStatus(
                        "bloodPressureDiastolic",
                        data.vitalSigns.bloodPressureDiastolic
                      )?.color
                    }`}
                  >
                    {
                      getVitalSignStatus(
                        "bloodPressureDiastolic",
                        data.vitalSigns.bloodPressureDiastolic
                      )?.status
                    }
                  </p>
                )}
              </div>
            </div>
            {(errors["vitalSigns.bloodPressureSystolic"] ||
              errors["vitalSigns.bloodPressureDiastolic"]) && (
              <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                {errors["vitalSigns.bloodPressureSystolic"] ||
                  errors["vitalSigns.bloodPressureDiastolic"]}
              </p>
            )}
          </div>

          {/* Heart Rate */}
          <div>
            <label
              htmlFor="heartRate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Frecuencia Cardíaca (bpm)
            </label>
            <input
              type="number"
              id="heartRate"
              placeholder="72"
              min="30"
              max="300"
              value={data.vitalSigns?.heartRate || ""}
              onChange={(e) =>
                handleVitalSignsChange("heartRate", e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
            />
            {data.vitalSigns?.heartRate && (
              <p
                className={`mt-1 text-xs ${
                  getVitalSignStatus("heartRate", data.vitalSigns.heartRate)
                    ?.color
                }`}
              >
                {
                  getVitalSignStatus("heartRate", data.vitalSigns.heartRate)
                    ?.status
                }
              </p>
            )}
            {errors["vitalSigns.heartRate"] && (
              <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                {errors["vitalSigns.heartRate"]}
              </p>
            )}
          </div>

          {/* Respiratory Rate */}
          <div>
            <label
              htmlFor="respiratoryRate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Frecuencia Respiratoria (rpm)
            </label>
            <input
              type="number"
              id="respiratoryRate"
              placeholder="16"
              min="8"
              max="60"
              value={data.vitalSigns?.respiratoryRate || ""}
              onChange={(e) =>
                handleVitalSignsChange("respiratoryRate", e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
            />
          </div>

          {/* Temperature */}
          <div>
            <label
              htmlFor="temperature"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Temperatura (°C)
            </label>
            <input
              type="number"
              id="temperature"
              placeholder="36.5"
              step="0.1"
              min="30"
              max="45"
              value={data.vitalSigns?.temperature || ""}
              onChange={(e) =>
                handleVitalSignsChange("temperature", e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
            />
            {data.vitalSigns?.temperature && (
              <p
                className={`mt-1 text-xs ${
                  getVitalSignStatus("temperature", data.vitalSigns.temperature)
                    ?.color
                }`}
              >
                {
                  getVitalSignStatus("temperature", data.vitalSigns.temperature)
                    ?.status
                }
              </p>
            )}
            {errors["vitalSigns.temperature"] && (
              <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                {errors["vitalSigns.temperature"]}
              </p>
            )}
          </div>

          {/* Weight */}
          <div>
            <label
              htmlFor="weight"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Peso (kg)
            </label>
            <input
              type="number"
              id="weight"
              placeholder="70"
              step="0.1"
              min="1"
              max="500"
              value={data.vitalSigns?.weight || ""}
              onChange={(e) => handleVitalSignsChange("weight", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
            />
          </div>

          {/* Height */}
          <div>
            <label
              htmlFor="height"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Talla (cm)
            </label>
            <input
              type="number"
              id="height"
              placeholder="170"
              min="50"
              max="250"
              value={data.vitalSigns?.height || ""}
              onChange={(e) => handleVitalSignsChange("height", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
            />
          </div>

          {/* Oxygen Saturation */}
          <div>
            <label
              htmlFor="oxygenSaturation"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Saturación O₂ (%)
            </label>
            <input
              type="number"
              id="oxygenSaturation"
              placeholder="98"
              min="70"
              max="100"
              value={data.vitalSigns?.oxygenSaturation || ""}
              onChange={(e) =>
                handleVitalSignsChange("oxygenSaturation", e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
            />
          </div>

          {/* BMI Display */}
          {bmi && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                IMC (calculado)
              </label>
              <div className="rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {bmi}
                </div>
                {bmiInfo && (
                  <div className={`text-sm ${bmiInfo.color}`}>
                    {bmiInfo.category}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Physical Examination */}
      <div className="space-y-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Examen Físico
        </h4>

        {/* General Physical Exam */}
        <div>
          <label
            htmlFor="generalPhysicalExam"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Examen Físico General
          </label>
          <textarea
            id="generalPhysicalExam"
            rows={4}
            placeholder="Estado general, consciencia, orientación, hidratación, coloración de piel y mucosas..."
            value={data.generalPhysicalExam || ""}
            onChange={(e) =>
              onChange({ generalPhysicalExam: e.target.value || undefined })
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-brand-400"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Apariencia general, estado de consciencia, hidratación, etc.
          </p>
        </div>

        {/* Segmental Physical Exam */}
        <div>
          <label
            htmlFor="segmentalPhysicalExam"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Examen Físico Segmentario
          </label>
          <textarea
            id="segmentalPhysicalExam"
            rows={6}
            placeholder="Cabeza y cuello, tórax (corazón y pulmones), abdomen, extremidades, neurológico..."
            value={data.segmentalPhysicalExam || ""}
            onChange={(e) =>
              onChange({ segmentalPhysicalExam: e.target.value || undefined })
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-brand-400"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Examen por aparatos y sistemas: cabeza, cuello, tórax, abdomen,
            extremidades, neurológico
          </p>
        </div>
      </div>

      {/* Quick Reference */}
      <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-500/10">
        <div className="flex">
          <svg
            className="h-5 w-5 text-blue-400"
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
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Valores de Referencia
            </h3>
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <strong>Presión Arterial:</strong>
                  <ul className="text-xs mt-1">
                    <li>Normal: &lt;120/80 mmHg</li>
                    <li>Elevada: 120-139/80-89 mmHg</li>
                    <li>Hipertensión: ≥140/90 mmHg</li>
                  </ul>
                </div>
                <div>
                  <strong>Frecuencia Cardíaca:</strong>
                  <ul className="text-xs mt-1">
                    <li>Normal adulto: 60-100 bpm</li>
                    <li>Bradicardia: &lt;60 bpm</li>
                    <li>Taquicardia: &gt;100 bpm</li>
                  </ul>
                </div>
                <div>
                  <strong>Temperatura:</strong>
                  <ul className="text-xs mt-1">
                    <li>Normal: 36.1-37.2°C</li>
                    <li>Febrícula: 37.3-38.0°C</li>
                    <li>Fiebre: &gt;38.0°C</li>
                  </ul>
                </div>
                <div>
                  <strong>IMC:</strong>
                  <ul className="text-xs mt-1">
                    <li>Bajo peso: &lt;18.5</li>
                    <li>Normal: 18.5-24.9</li>
                    <li>Sobrepeso: 25.0-29.9</li>
                    <li>Obesidad: ≥30.0</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
