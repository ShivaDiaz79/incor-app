// components/medical-history/MedicalHistoryFormWizard.tsx
"use client";

import { useState, useEffect } from "react";
import { PatientSelectionStep } from "./form-step/PatientSelectionStep";
import { BasicInformationStep } from "./form-step/BasicInformationStep";
import { MedicalHistoryStep } from "./form-step/MedicalHistoryStep";
import { PhysicalExamStep } from "./form-step/PhysicalExamStep";
import { DiagnosisStep } from "./form-step/DiagnosticStep";
import { SpecializedHistoryStep } from "./form-step/SpecializedHistoryStep";
import { ReviewStep } from "./form-step/ReviewStep";
import { useMedicalHistoryActions } from "@/hooks/useMedicalHistory";
import Button from "@/components/ui/button/Button";
import type {
  CreateMedicalHistoryRequest,
  UpdateMedicalHistoryRequest,
  MedicalHistory,
} from "@/types/medical-history";
import { MedicalHistoryType } from "@/types/medical-history";

interface Patient {
  id: string;
  name: string;
  lastName: string;
  secondLastName?: string;
  email: string;
  phone: string;
  ci: string;
  age: number;
  dateOfBirth: string;
  isActive: boolean;
}

interface MedicalHistoryFormWizardProps {
  mode: "create" | "edit";
  medicalHistory?: MedicalHistory | null;
  preselectedPatient?: Patient | null;
  onSuccess: () => void;
  onSubmitting: (submitting: boolean) => void;
  onCancel: () => void;
}

export interface FormData
  extends Omit<CreateMedicalHistoryRequest, "lastUpdatedBy"> {
  selectedPatient?: Patient;
  lastUpdatedBy: string;
}

const getStepsForType = (type: MedicalHistoryType | undefined) => {
  const baseSteps = [
    { id: "patient", title: "Paciente", description: "Seleccionar paciente" },
    {
      id: "basic",
      title: "Información Básica",
      description: "Tipo y datos generales",
    },
    {
      id: "history",
      title: "Historia Médica",
      description: "Antecedentes y motivo",
    },
    {
      id: "physical",
      title: "Examen Físico",
      description: "Signos vitales y examen",
    },
    {
      id: "diagnosis",
      title: "Diagnóstico",
      description: "Diagnóstico y tratamiento",
    },
  ];

  // Add specialized step if needed
  if (
    type === MedicalHistoryType.GYNECO_OBSTETRICS ||
    type === MedicalHistoryType.PEDIATRICS
  ) {
    baseSteps.splice(5, 0, {
      id: "specialized",
      title:
        type === MedicalHistoryType.GYNECO_OBSTETRICS
          ? "Historia Gineco-Obstétrica"
          : "Historia Pediátrica",
      description:
        type === MedicalHistoryType.GYNECO_OBSTETRICS
          ? "Datos gineco-obstétricos"
          : "Datos pediátricos",
    });
  }

  baseSteps.push({
    id: "review",
    title: "Revisar",
    description: "Confirmar información",
  });

  return baseSteps;
};

export function MedicalHistoryFormWizard({
  mode,
  medicalHistory,
  preselectedPatient,
  onSuccess,
  onSubmitting,
  onCancel,
}: MedicalHistoryFormWizardProps) {
  const { create, update } = useMedicalHistoryActions();

  // Initialize form data
  const [formData, setFormData] = useState<FormData>(() => {
    if (mode === "edit" && medicalHistory) {
      return {
        ...medicalHistory,
        selectedPatient: medicalHistory.patient
          ? {
              id: medicalHistory.patient.id,
              name: medicalHistory.patient.name,
              lastName: medicalHistory.patient.lastName,
              secondLastName: medicalHistory.patient.secondLastName,
              email: medicalHistory.patient.email,
              phone: medicalHistory.patient.phone,
              ci: medicalHistory.patient.ci,
              age: medicalHistory.patient.age,
              dateOfBirth: medicalHistory.patient.dateOfBirth,
              isActive: true,
            }
          : undefined,
        lastUpdatedBy: "current-user-id", // This should come from auth context
      };
    }

    return {
      patientId: preselectedPatient?.id || "",
      selectedPatient: preselectedPatient || undefined,
      type: MedicalHistoryType.GENERAL,
      allergies: [],
      version: 1,
      lastUpdatedBy: "current-user-id", // This should come from auth context
    };
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = getStepsForType(formData.type);

  // Update parent submitting state
  useEffect(() => {
    onSubmitting(isSubmitting);
  }, [isSubmitting, onSubmitting]);

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    // Clear related errors
    Object.keys(data).forEach((key) => {
      if (errors[key]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[key];
          return newErrors;
        });
      }
    });
  };

  const validateCurrentStep = (): boolean => {
    const stepId = steps[currentStep].id;
    const newErrors: Record<string, string> = {};

    switch (stepId) {
      case "patient":
        if (!formData.selectedPatient) {
          newErrors.selectedPatient = "Debe seleccionar un paciente";
        }
        break;

      case "basic":
        if (!formData.type) {
          newErrors.type = "Debe seleccionar el tipo de historia clínica";
        }
        break;

      case "history":
        // Basic validations - could be more specific based on requirements
        break;

      case "physical":
        // Validate vital signs if provided
        if (formData.vitalSigns) {
          const { vitalSigns } = formData;
          if (
            vitalSigns.bloodPressureSystolic &&
            (vitalSigns.bloodPressureSystolic < 50 ||
              vitalSigns.bloodPressureSystolic > 300)
          ) {
            newErrors["vitalSigns.bloodPressureSystolic"] =
              "Presión sistólica debe estar entre 50 y 300";
          }
          if (
            vitalSigns.bloodPressureDiastolic &&
            (vitalSigns.bloodPressureDiastolic < 30 ||
              vitalSigns.bloodPressureDiastolic > 200)
          ) {
            newErrors["vitalSigns.bloodPressureDiastolic"] =
              "Presión diastólica debe estar entre 30 y 200";
          }
          if (
            vitalSigns.heartRate &&
            (vitalSigns.heartRate < 30 || vitalSigns.heartRate > 300)
          ) {
            newErrors["vitalSigns.heartRate"] =
              "Frecuencia cardíaca debe estar entre 30 y 300";
          }
          if (
            vitalSigns.temperature &&
            (vitalSigns.temperature < 30 || vitalSigns.temperature > 45)
          ) {
            newErrors["vitalSigns.temperature"] =
              "Temperatura debe estar entre 30 y 45";
          }
        }
        break;

      case "diagnosis":
        // Could validate required diagnosis fields
        break;

      case "specialized":
        // Validate specialized history based on type
        if (
          formData.type === MedicalHistoryType.GYNECO_OBSTETRICS &&
          formData.gynecoObstetricHistory
        ) {
          const gyneco = formData.gynecoObstetricHistory;
          if (
            gyneco.menarcheAge &&
            (gyneco.menarcheAge < 8 || gyneco.menarcheAge > 18)
          ) {
            newErrors["gynecoObstetricHistory.menarcheAge"] =
              "Edad de menarquia debe estar entre 8 y 18 años";
          }
        }
        break;

      case "review":
        // Final validation
        if (!formData.selectedPatient) {
          newErrors.selectedPatient = "Debe seleccionar un paciente";
        }
        if (!formData.type) {
          newErrors.type = "Debe seleccionar el tipo de historia clínica";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    try {
      setIsSubmitting(true);

      // Prepare data for submission
      const submitData:
        | CreateMedicalHistoryRequest
        | UpdateMedicalHistoryRequest = {
        patientId: formData.selectedPatient!.id,
        type: formData.type!,
        attendingDoctorId: formData.attendingDoctorId,
        company: formData.company,
        specialty: formData.specialty,
        chiefComplaint: formData.chiefComplaint,
        nonPathologicalHistory: formData.nonPathologicalHistory,
        allergies: formData.allergies || [],
        clinicalHistory: formData.clinicalHistory,
        surgicalHistory: formData.surgicalHistory,
        currentIllnessHistory: formData.currentIllnessHistory,
        generalPhysicalExam: formData.generalPhysicalExam,
        vitalSigns: formData.vitalSigns,
        segmentalPhysicalExam: formData.segmentalPhysicalExam,
        complementaryExamsRequest: formData.complementaryExamsRequest,
        presumptiveOrDefinitiveDiagnosis:
          formData.presumptiveOrDefinitiveDiagnosis,
        therapeuticManagementPlan: formData.therapeuticManagementPlan,
        recommendationsNextAppointment: formData.recommendationsNextAppointment,
        doctorSignature: formData.doctorSignature,
        gynecoObstetricHistory: formData.gynecoObstetricHistory,
        pediatricHistory: formData.pediatricHistory,
        version: formData.version,
        lastUpdatedBy: formData.lastUpdatedBy,
      };

      if (mode === "create") {
        await create(submitData as CreateMedicalHistoryRequest);
      } else if (medicalHistory) {
        await update(
          medicalHistory.id,
          submitData as UpdateMedicalHistoryRequest
        );
      }

      onSuccess();
    } catch (error) {
      console.error("Error submitting medical history:", error);
      setErrors({
        submit: "Error al guardar la historia clínica. Inténtelo nuevamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentStep = () => {
    const stepId = steps[currentStep].id;

    switch (stepId) {
      case "patient":
        return (
          <PatientSelectionStep
            data={formData}
            errors={errors}
            onChange={updateFormData}
            mode={mode}
          />
        );

      case "basic":
        return (
          <BasicInformationStep
            data={formData}
            errors={errors}
            onChange={updateFormData}
          />
        );

      case "history":
        return (
          <MedicalHistoryStep
            data={formData}
            errors={errors}
            onChange={updateFormData}
          />
        );

      case "physical":
        return (
          <PhysicalExamStep
            data={formData}
            errors={errors}
            onChange={updateFormData}
          />
        );

      case "diagnosis":
        return (
          <DiagnosisStep
            data={formData}
            errors={errors}
            onChange={updateFormData}
          />
        );

      case "specialized":
        return (
          <SpecializedHistoryStep
            data={formData}
            errors={errors}
            onChange={updateFormData}
          />
        );

      case "review":
        return <ReviewStep data={formData} errors={errors} />;

      default:
        return null;
    }
  };

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="border-b border-gray-200 pb-6 dark:border-gray-700">
        <nav className="flex justify-center">
          <ol className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <li key={step.id} className="flex items-center">
                <div className="flex items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                      index < currentStep
                        ? "bg-brand-500 text-white"
                        : index === currentStep
                        ? "border-2 border-brand-500 bg-white text-brand-500 dark:bg-gray-900"
                        : "border-2 border-gray-300 bg-white text-gray-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-400"
                    }`}
                  >
                    {index < currentStep ? (
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <div
                      className={`text-sm font-medium ${
                        index <= currentStep
                          ? "text-gray-900 dark:text-gray-100"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {step.description}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="ml-4 h-0.5 w-8 bg-gray-300 dark:bg-gray-600" />
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Current Step Content */}
      <div className="min-h-[500px]">{renderCurrentStep()}</div>

      {/* Error Messages */}
      {errors.submit && (
        <div className="rounded-lg bg-error-50 p-4 dark:bg-error-500/10">
          <div className="flex">
            <svg
              className="h-5 w-5 text-error-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="ml-3">
              <p className="text-sm text-error-800 dark:text-error-200">
                {errors.submit}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between border-t border-gray-200 pt-6 dark:border-gray-700">
        <Button
          variant="outline"
          onClick={isFirstStep ? onCancel : handlePrevious}
          disabled={isSubmitting}
        >
          {isFirstStep ? "Cancelar" : "Anterior"}
        </Button>

        <Button
          onClick={isLastStep ? handleSubmit : handleNext}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg
                className="mr-2 h-4 w-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
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
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Guardando...
            </>
          ) : isLastStep ? (
            mode === "create" ? (
              "Crear Historia"
            ) : (
              "Actualizar Historia"
            )
          ) : (
            "Siguiente"
          )}
        </Button>
      </div>
    </div>
  );
}
