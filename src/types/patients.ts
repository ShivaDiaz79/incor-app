// src/types/patients.ts
export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

export enum CivilStatus {
  SINGLE = "single",
  MARRIED = "married",
  DIVORCED = "divorced",
  WIDOWED = "widowed",
  COHABITING = "cohabiting",
}

export interface PatientEmergencyContact {
  name: string;
  phone: string;
  relationship: string;
  isMainContact: boolean;
}

export interface Patient {
  id: string;
  medicalRecordId: string;
  name: string;
  lastName: string;
  secondLastName?: string;
  email?: string;
  phone: string;
  ci: string;
  dateOfBirth: Date;
  gender: Gender;
  civilStatus?: CivilStatus;
  nationality?: string;
  address: string;
  city?: string;
  state?: string;
  whatsappNumber?: string;
  emergencyContacts: PatientEmergencyContact[];
  preferredLanguage?: string;
  occupation?: string;
  notes?: string;
  referredBy?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePatientRequest {
  name: string;
  lastName: string;
  secondLastName?: string;
  email?: string;
  phone: string;
  ci: string;
  dateOfBirth?: string;
  gender: Gender;
  civilStatus?: CivilStatus;
  nationality?: string;
  address: string;
  city?: string;
  state?: string;
  whatsappNumber?: string;
  emergencyContacts: PatientEmergencyContact[];
  preferredLanguage?: string;
  occupation?: string;
  notes?: string;
  referredBy?: string;
  isActive?: boolean;
}

export interface UpdatePatientRequest {
  name?: string;
  lastName?: string;
  secondLastName?: string;
  email?: string;
  phone?: string;
  ci?: string;
  dateOfBirth?: string;
  gender?: Gender;
  civilStatus?: CivilStatus;
  nationality?: string;
  address?: string;
  city?: string;
  state?: string;
  whatsappNumber?: string;
  emergencyContacts?: PatientEmergencyContact[];
  preferredLanguage?: string;
  occupation?: string;
  notes?: string;
  referredBy?: string;
  isActive?: boolean;
}

export interface PatientFilters {
  search?: string;
  gender?: Gender;
  civilStatus?: CivilStatus;
  city?: string;
  state?: string;
  isActive?: boolean;
  minAge?: number;
  maxAge?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface PatientsResponse {
  data: Patient[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  statusCode: number;
  timestamp: string;
  message: string;
}

export interface PatientStats {
  total: number;
  active: number;
  inactive: number;
  byGender: Record<string, number>;
  byAgeGroup: Record<string, number>;
  byCity: Record<string, number>;
}
