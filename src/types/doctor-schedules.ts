export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface DoctorScheduleSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  appointmentDuration: number;
  maxAppointments?: number;
}

export interface DoctorOfficeSchedule {
  officeId: string;
  dayOfWeek: DayOfWeek;
  slots: DoctorScheduleSlot[];
}

export interface DoctorBasicInfo {
  name: string;
  lastName: string;
  speciality: string;
}

export interface DoctorSchedule {
  id: string;
  doctorUserId: string;
  schedules: DoctorOfficeSchedule[];
  effectiveFrom: Date;
  effectiveTo?: Date;
  isActive: boolean;
  notes?: string;
  doctor?: DoctorBasicInfo;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDoctorScheduleRequest {
  doctorUserId: string;
  schedules: DoctorOfficeSchedule[];
  effectiveFrom: string;
  effectiveTo?: string;
  notes?: string;
  isActive?: boolean;
}

export interface UpdateDoctorScheduleRequest {
  doctorUserId?: string;
  schedules?: DoctorOfficeSchedule[];
  effectiveFrom?: string;
  effectiveTo?: string;
  notes?: string;
  isActive?: boolean;
}

export interface DoctorScheduleFilters {
  doctorUserId?: string;
  officeId?: string;
  dayOfWeek?: DayOfWeek;
  effectiveOn?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface DoctorSchedulesPagination {
  total: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

// types/common.ts
export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode: number;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
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
