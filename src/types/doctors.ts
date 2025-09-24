// types/doctors.ts
export interface Doctor {
  id: string;
  userId: string;
  speciality: string;
  licenseNumber: string;
  medicalRegistration: string;
  consultationFee?: number;
  profilePhoto?: string;
  biography?: string;
  languages?: string[];
  certifications?: string[];
  experience?: number;
  education?: string[];
  signature?: string;
  isActive: boolean;
  user?: {
    name: string;
    lastName: string;
    email: string;
    phone: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface DoctorFilters {
  page?: number;
  limit?: number;
  search?: string;
  speciality?: string;
  isActive?: boolean;
  availableOn?: string;
  sortBy?: "createdAt" | "speciality" | "experience";
  sortOrder?: "asc" | "desc";
}

export interface DoctorsPagination {
  total: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

export interface CreateDoctorRequest {
  userId: string;
  speciality: string;
  licenseNumber: string;
  medicalRegistration: string;
  consultationFee?: number;
  profilePhoto?: string;
  biography?: string;
  languages?: string[];
  certifications?: string[];
  experience?: number;
  education?: string[];
  signature?: string;
  isActive?: boolean;
}

export interface UpdateDoctorRequest {
  speciality?: string;
  licenseNumber?: string;
  medicalRegistration?: string;
  consultationFee?: number;
  profilePhoto?: string;
  biography?: string;
  languages?: string[];
  certifications?: string[];
  experience?: number;
  education?: string[];
  signature?: string;
  isActive?: boolean;
}

export interface AvailableUser {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  ci: string;
  isActive: boolean;
}

// Constantes para las especialidades
export const MEDICAL_SPECIALTIES = [
  "General Medicine",
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Gynecology",
  "Obstetrics",
  "Orthopedics",
  "Dermatology",
  "Psychiatry",
  "Ophthalmology",
  "ENT (Ear, Nose, Throat)",
  "Urology",
  "Endocrinology",
  "Gastroenterology",
  "Pulmonology",
  "Rheumatology",
  "Oncology",
  "Emergency Medicine",
  "Anesthesiology",
  "Radiology",
  "Pathology",
] as const;

export type MedicalSpecialty = (typeof MEDICAL_SPECIALTIES)[number];
