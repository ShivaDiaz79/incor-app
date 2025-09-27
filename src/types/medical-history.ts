// types/medical-history.ts
export enum MedicalHistoryType {
  GENERAL = "general",
  GYNECO_OBSTETRICS = "gyneco_obstetrics",
  PEDIATRICS = "pediatrics",
}

export interface VitalSigns {
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  respiratoryRate?: number;
  temperature?: number;
  weight?: number;
  height?: number;
  oxygenSaturation?: number;
}

export interface GynecoObstetricHistory {
  menarcheAge?: number;
  lastMenstrualPeriod?: string;
  menstrualCycleLength?: number;
  contraceptiveMethod?: string;
  pregnancies?: number;
  deliveries?: number;
  abortions?: number;
  cesareans?: number;
  climatericSymptoms?: boolean;
  lastPapSmear?: string;
  lastMammography?: string;
  sexuallyActive?: boolean;
  sexualPartners?: number;
}

export interface VaccinationRecord {
  name: string;
  date: string;
  dose?: string;
}

export interface BreastfeedingInfo {
  wasBreastfed: boolean;
  durationMonths?: number;
}

export interface PediatricHistory {
  birthWeight?: number;
  birthHeight?: number;
  gestationalAge?: number;
  deliveryType?: "vaginal" | "cesarean";
  complications?: string[];
  breastfeeding?: BreastfeedingInfo;
  vaccinations?: VaccinationRecord[];
  developmentalMilestones?: Record<string, string>;
}

export interface DoctorSignature {
  doctorId: string;
  signedAt?: string;
  digitalSignature?: string;
}

export interface PatientBasicInfo {
  id: string;
  name: string;
  lastName: string;
  secondLastName?: string;
  age: number;
  ci: string;
  email: string;
  phone: string;
  dateOfBirth: string;
}

export interface DoctorBasicInfo {
  userId: string;
  name: string;
  lastName: string;
  speciality: string;
}

export interface MedicalHistory {
  id: string;
  patientId: string;
  type: MedicalHistoryType;
  attendingDoctorId?: string;
  company?: string;
  specialty?: string;
  chiefComplaint?: string;
  nonPathologicalHistory?: string;
  allergies: string[];
  clinicalHistory?: string;
  surgicalHistory?: string;
  currentIllnessHistory?: string;
  generalPhysicalExam?: string;
  vitalSigns?: VitalSigns;
  segmentalPhysicalExam?: string;
  complementaryExamsRequest?: string;
  presumptiveOrDefinitiveDiagnosis?: string;
  therapeuticManagementPlan?: string;
  recommendationsNextAppointment?: string;
  doctorSignature?: DoctorSignature;
  gynecoObstetricHistory?: GynecoObstetricHistory;
  pediatricHistory?: PediatricHistory;
  version: number;
  lastUpdatedBy: string;
  isActive: boolean;
  patient?: PatientBasicInfo;
  signatureDoctor?: DoctorBasicInfo;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMedicalHistoryRequest {
  patientId: string;
  type: MedicalHistoryType;
  attendingDoctorId?: string;
  company?: string;
  specialty?: string;
  chiefComplaint?: string;
  nonPathologicalHistory?: string;
  allergies?: string[];
  clinicalHistory?: string;
  surgicalHistory?: string;
  currentIllnessHistory?: string;
  generalPhysicalExam?: string;
  vitalSigns?: VitalSigns;
  segmentalPhysicalExam?: string;
  complementaryExamsRequest?: string;
  presumptiveOrDefinitiveDiagnosis?: string;
  therapeuticManagementPlan?: string;
  recommendationsNextAppointment?: string;
  doctorSignature?: Omit<DoctorSignature, "signedAt">;
  gynecoObstetricHistory?: GynecoObstetricHistory;
  pediatricHistory?: PediatricHistory;
  version?: number;
  lastUpdatedBy: string;
}

export type UpdateMedicalHistoryRequest = Partial<CreateMedicalHistoryRequest>;

export interface MedicalHistoryFilters {
  search?: string;
  patientId?: string;
  type?: MedicalHistoryType;
  attendingDoctorId?: string;
  specialty?: string;
  company?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface MedicalHistoryPagination {
  total: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

export interface MedicalHistoryStats {
  total: number;
  active: number;
  inactive: number;
  byType: Record<string, number>;
  bySpecialty: Record<string, number>;
  recentlyCreated: number;
}

// Constantes para etiquetas y colores
export const MEDICAL_HISTORY_TYPE_LABELS: Record<MedicalHistoryType, string> = {
  [MedicalHistoryType.GENERAL]: "General",
  [MedicalHistoryType.GYNECO_OBSTETRICS]: "Gineco-Obstétrica",
  [MedicalHistoryType.PEDIATRICS]: "Pediátrica",
};

export const MEDICAL_HISTORY_TYPE_COLORS: Record<MedicalHistoryType, string> = {
  [MedicalHistoryType.GENERAL]:
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  [MedicalHistoryType.GYNECO_OBSTETRICS]:
    "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  [MedicalHistoryType.PEDIATRICS]:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
};
