/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { MedicalHistoryType } from "@/types/medical-history";
import type { FormData } from "../MedicalHistoryFormWizard";
import type {
  GynecoObstetricHistory,
  PediatricHistory,
  VaccinationRecord,
} from "@/types/medical-history";

interface SpecializedHistoryStepProps {
  data: FormData;
  errors: Record<string, string>;
  onChange: (data: Partial<FormData>) => void;
}

export function SpecializedHistoryStep({
  data,
  errors,
  onChange,
}: SpecializedHistoryStepProps) {
  const [newVaccination, setNewVaccination] = useState<
    Partial<VaccinationRecord>
  >({
    name: "",
    date: "",
    dose: "",
  });

  const handleGynecoChange = (
    field: keyof GynecoObstetricHistory,
    value: any
  ) => {
    const currentHistory = data.gynecoObstetricHistory || {};
    onChange({
      gynecoObstetricHistory: {
        ...currentHistory,
        [field]: value === "" ? undefined : value,
      },
    });
  };

  const handlePediatricChange = (field: keyof PediatricHistory, value: any) => {
    const currentHistory = data.pediatricHistory || {};
    onChange({
      pediatricHistory: {
        ...currentHistory,
        [field]: value === "" ? undefined : value,
      },
    });
  };

  const handleBreastfeedingChange = (field: string, value: any) => {
    const currentHistory = data.pediatricHistory || {};
    const currentBreastfeeding = currentHistory.breastfeeding || {
      wasBreastfed: false,
    };

    onChange({
      pediatricHistory: {
        ...currentHistory,
        breastfeeding: {
          ...currentBreastfeeding,
          [field]: value === "" ? undefined : value,
        },
      },
    });
  };

  const handleAddVaccination = () => {
    if (newVaccination.name && newVaccination.date) {
      const currentHistory = data.pediatricHistory || {};
      const currentVaccinations = currentHistory.vaccinations || [];

      onChange({
        pediatricHistory: {
          ...currentHistory,
          vaccinations: [
            ...currentVaccinations,
            {
              name: newVaccination.name!,
              date: newVaccination.date!,
              dose: newVaccination.dose || undefined,
            },
          ],
        },
      });

      setNewVaccination({ name: "", date: "", dose: "" });
    }
  };

  const handleRemoveVaccination = (index: number) => {
    const currentHistory = data.pediatricHistory || {};
    const currentVaccinations = currentHistory.vaccinations || [];

    onChange({
      pediatricHistory: {
        ...currentHistory,
        vaccinations: currentVaccinations.filter((_, i) => i !== index),
      },
    });
  };

  const handleDevelopmentalMilestoneChange = (
    milestone: string,
    date: string
  ) => {
    const currentHistory = data.pediatricHistory || {};
    const currentMilestones = currentHistory.developmentalMilestones || {};

    if (date === "") {
      const { [milestone]: removed, ...remaining } = currentMilestones;
      onChange({
        pediatricHistory: {
          ...currentHistory,
          developmentalMilestones:
            Object.keys(remaining).length > 0 ? remaining : undefined,
        },
      });
    } else {
      onChange({
        pediatricHistory: {
          ...currentHistory,
          developmentalMilestones: {
            ...currentMilestones,
            [milestone]: date,
          },
        },
      });
    }
  };

  if (data.type === MedicalHistoryType.GYNECO_OBSTETRICS) {
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Historia Gineco-Obstétrica
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Complete la información específica sobre historia menstrual,
            reproductiva y ginecológica.
          </p>
        </div>

        {/* Menstrual History */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Historia Menstrual
          </h4>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Pregnancies */}
            <div>
              <label
                htmlFor="pregnancies"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Embarazos (G)
              </label>
              <input
                type="number"
                id="pregnancies"
                min="0"
                placeholder="0"
                value={data.gynecoObstetricHistory?.pregnancies || ""}
                onChange={(e) =>
                  handleGynecoChange(
                    "pregnancies",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
              />
            </div>

            {/* Deliveries */}
            <div>
              <label
                htmlFor="deliveries"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Partos (P)
              </label>
              <input
                type="number"
                id="deliveries"
                min="0"
                placeholder="0"
                value={data.gynecoObstetricHistory?.deliveries || ""}
                onChange={(e) =>
                  handleGynecoChange(
                    "deliveries",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
              />
            </div>

            {/* Abortions */}
            <div>
              <label
                htmlFor="abortions"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Abortos (A)
              </label>
              <input
                type="number"
                id="abortions"
                min="0"
                placeholder="0"
                value={data.gynecoObstetricHistory?.abortions || ""}
                onChange={(e) =>
                  handleGynecoChange(
                    "abortions",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
              />
            </div>

            {/* Cesareans */}
            <div>
              <label
                htmlFor="cesareans"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Cesáreas (C)
              </label>
              <input
                type="number"
                id="cesareans"
                min="0"
                placeholder="0"
                value={data.gynecoObstetricHistory?.cesareans || ""}
                onChange={(e) =>
                  handleGynecoChange(
                    "cesareans",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Sexual Health and Screening */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Salud Sexual y Tamizaje
          </h4>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Sexual Activity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sexualmente Activa
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="sexuallyActive"
                    checked={
                      data.gynecoObstetricHistory?.sexuallyActive === true
                    }
                    onChange={() => handleGynecoChange("sexuallyActive", true)}
                    className="h-4 w-4 border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="ml-2 text-sm text-gray-900 dark:text-gray-100">
                    Sí
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="sexuallyActive"
                    checked={
                      data.gynecoObstetricHistory?.sexuallyActive === false
                    }
                    onChange={() => handleGynecoChange("sexuallyActive", false)}
                    className="h-4 w-4 border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="ml-2 text-sm text-gray-900 dark:text-gray-100">
                    No
                  </span>
                </label>
              </div>
            </div>

            {/* Sexual Partners */}
            <div>
              <label
                htmlFor="sexualPartners"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Número de Parejas Sexuales
              </label>
              <input
                type="number"
                id="sexualPartners"
                min="0"
                placeholder="1"
                value={data.gynecoObstetricHistory?.sexualPartners || ""}
                onChange={(e) =>
                  handleGynecoChange(
                    "sexualPartners",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
              />
            </div>

            {/* Last Pap Smear */}
            <div>
              <label
                htmlFor="lastPapSmear"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Último Papanicolaou
              </label>
              <input
                type="date"
                id="lastPapSmear"
                value={data.gynecoObstetricHistory?.lastPapSmear || ""}
                onChange={(e) =>
                  handleGynecoChange("lastPapSmear", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            {/* Last Mammography */}
            <div>
              <label
                htmlFor="lastMammography"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Última Mamografía
              </label>
              <input
                type="date"
                id="lastMammography"
                value={data.gynecoObstetricHistory?.lastMammography || ""}
                onChange={(e) =>
                  handleGynecoChange("lastMammography", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            {/* Climacteric Symptoms */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Síntomas Climatéricos
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="climatericSymptoms"
                    checked={
                      data.gynecoObstetricHistory?.climatericSymptoms === true
                    }
                    onChange={() =>
                      handleGynecoChange("climatericSymptoms", true)
                    }
                    className="h-4 w-4 border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="ml-2 text-sm text-gray-900 dark:text-gray-100">
                    Sí
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="climatericSymptoms"
                    checked={
                      data.gynecoObstetricHistory?.climatericSymptoms === false
                    }
                    onChange={() =>
                      handleGynecoChange("climatericSymptoms", false)
                    }
                    className="h-4 w-4 border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="ml-2 text-sm text-gray-900 dark:text-gray-100">
                    No
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (data.type === MedicalHistoryType.PEDIATRICS) {
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Historia Pediátrica
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Complete la información específica sobre el nacimiento, desarrollo y
            vacunación del paciente pediátrico.
          </p>
        </div>

        {/* Birth Information */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Información del Nacimiento
          </h4>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Birth Weight */}
            <div>
              <label
                htmlFor="birthWeight"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Peso al Nacer (g)
              </label>
              <input
                type="number"
                id="birthWeight"
                min="500"
                max="6000"
                placeholder="3500"
                value={data.pediatricHistory?.birthWeight || ""}
                onChange={(e) =>
                  handlePediatricChange(
                    "birthWeight",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
              />
            </div>

            {/* Birth Height */}
            <div>
              <label
                htmlFor="birthHeight"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Talla al Nacer (cm)
              </label>
              <input
                type="number"
                id="birthHeight"
                min="30"
                max="60"
                placeholder="50"
                value={data.pediatricHistory?.birthHeight || ""}
                onChange={(e) =>
                  handlePediatricChange(
                    "birthHeight",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
              />
            </div>

            {/* Gestational Age */}
            <div>
              <label
                htmlFor="gestationalAge"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Edad Gestacional (sem)
              </label>
              <input
                type="number"
                id="gestationalAge"
                min="20"
                max="44"
                placeholder="38"
                value={data.pediatricHistory?.gestationalAge || ""}
                onChange={(e) =>
                  handlePediatricChange(
                    "gestationalAge",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
              />
            </div>

            {/* Delivery Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo de Parto
              </label>
              <select
                value={data.pediatricHistory?.deliveryType || ""}
                onChange={(e) =>
                  handlePediatricChange(
                    "deliveryType",
                    e.target.value || undefined
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">Seleccionar</option>
                <option value="vaginal">Vaginal</option>
                <option value="cesarean">Cesárea</option>
              </select>
            </div>
          </div>

          {/* Complications */}
          <div className="mt-6">
            <label
              htmlFor="complications"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Complicaciones del Parto
            </label>
            <textarea
              id="complications"
              rows={2}
              placeholder="Describa cualquier complicación durante el parto..."
              value={data.pediatricHistory?.complications?.join(", ") || ""}
              onChange={(e) => {
                const complications = e.target.value
                  .split(",")
                  .map((c) => c.trim())
                  .filter((c) => c);
                handlePediatricChange(
                  "complications",
                  complications.length > 0 ? complications : undefined
                );
              }}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Separe múltiples complicaciones con comas
            </p>
          </div>
        </div>

        {/* Breastfeeding */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Lactancia Materna
          </h4>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ¿Recibió Lactancia Materna?
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="wasBreastfed"
                    checked={
                      data.pediatricHistory?.breastfeeding?.wasBreastfed ===
                      true
                    }
                    onChange={() =>
                      handleBreastfeedingChange("wasBreastfed", true)
                    }
                    className="h-4 w-4 border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="ml-2 text-sm text-gray-900 dark:text-gray-100">
                    Sí
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="wasBreastfed"
                    checked={
                      data.pediatricHistory?.breastfeeding?.wasBreastfed ===
                      false
                    }
                    onChange={() =>
                      handleBreastfeedingChange("wasBreastfed", false)
                    }
                    className="h-4 w-4 border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="ml-2 text-sm text-gray-900 dark:text-gray-100">
                    No
                  </span>
                </label>
              </div>
            </div>

            {data.pediatricHistory?.breastfeeding?.wasBreastfed && (
              <div>
                <label
                  htmlFor="durationMonths"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Duración (meses)
                </label>
                <input
                  type="number"
                  id="durationMonths"
                  min="0"
                  max="48"
                  placeholder="6"
                  value={
                    data.pediatricHistory?.breastfeeding?.durationMonths || ""
                  }
                  onChange={(e) =>
                    handleBreastfeedingChange(
                      "durationMonths",
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
                />
              </div>
            )}
          </div>
        </div>

        {/* Vaccinations */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Esquema de Vacunación
          </h4>

          {/* Add New Vaccination */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-4">
            <div>
              <input
                type="text"
                placeholder="Nombre de la vacuna"
                value={newVaccination.name}
                onChange={(e) =>
                  setNewVaccination((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
              />
            </div>
            <div>
              <input
                type="date"
                value={newVaccination.date}
                onChange={(e) =>
                  setNewVaccination((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Dosis (opcional)"
                value={newVaccination.dose}
                onChange={(e) =>
                  setNewVaccination((prev) => ({
                    ...prev,
                    dose: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
              />
            </div>
            <div>
              <button
                type="button"
                onClick={handleAddVaccination}
                disabled={!newVaccination.name || !newVaccination.date}
                className="w-full rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600 disabled:bg-gray-300 disabled:cursor-not-allowed dark:disabled:bg-gray-600"
              >
                Agregar
              </button>
            </div>
          </div>

          {/* Vaccinations List */}
          {data.pediatricHistory?.vaccinations &&
          data.pediatricHistory.vaccinations.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Vacunas Registradas:
              </p>
              <div className="space-y-2">
                {data.pediatricHistory.vaccinations.map(
                  (vaccination, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-600 dark:bg-gray-700"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {vaccination.name}
                          {vaccination.dose && (
                            <span className="ml-2 text-sm text-gray-500">
                              ({vaccination.dose})
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(vaccination.date).toLocaleDateString(
                            "es-ES"
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveVaccination(index)}
                        className="rounded-full p-1 text-error-400 hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-500/10"
                        title="Eliminar vacuna"
                      >
                        <svg
                          className="h-4 w-4"
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
                  )
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-4 text-center dark:border-gray-600">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No se han registrado vacunas
              </p>
            </div>
          )}
        </div>

        {/* Developmental Milestones */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Hitos del Desarrollo
          </h4>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { key: "first_smile", label: "Primera sonrisa" },
              { key: "sitting", label: "Se sienta sin apoyo" },
              { key: "crawling", label: "Gatea" },
              { key: "walking", label: "Camina" },
              { key: "first_words", label: "Primeras palabras" },
              { key: "toilet_training", label: "Control de esfínteres" },
            ].map((milestone) => (
              <div key={milestone.key}>
                <label
                  htmlFor={milestone.key}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  {milestone.label}
                </label>
                <input
                  type="date"
                  id={milestone.key}
                  value={
                    data.pediatricHistory?.developmentalMilestones?.[
                      milestone.key
                    ] || ""
                  }
                  onChange={(e) =>
                    handleDevelopmentalMilestoneChange(
                      milestone.key,
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
