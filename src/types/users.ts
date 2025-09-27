import { Role } from "./roles";

export interface User {
  id: string;
  email: string;
  name: string;
  lastName: string;
  phone: string;
  roleIds: string[];
  roleDetails: Role[];
  ci: string;
  isActive: boolean;
  firebaseUid: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  fullName?: string;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  roleId?: string;
  isActive?: boolean;
  sortBy?: "name" | "email" | "createdAt" | "lastLoginAt";
  sortOrder?: "asc" | "desc";
  includeRoles?: boolean;
}

export interface UsersPagination {
  total: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

export interface CreateUserRequest {
  email: string;
  name: string;
  lastName: string;
  phone: string;
  roleIds: string[];
  password: string;
  ci: string;
  isActive?: boolean;
  firebaseUid?: string;
}

export interface UpdateUserRequest {
  email?: string;
  name?: string;
  lastName?: string;
  phone?: string;
  roleIds?: string[];
  ci?: string;
  isActive?: boolean;
  firebaseUid?: string;
  password?: string;
}

export interface ChangePasswordRequest {
  password: string;
  confirmPassword: string;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  byRole: Record<string, number>;
}

// Constantes para los role
// Para el flujo de creación con doctor
export interface UserWithDoctorRequest {
  user: CreateUserRequest;
  doctor?: {
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
  };
}
