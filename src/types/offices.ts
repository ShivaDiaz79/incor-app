export interface FloorBasicInfo {
  id: string;
  name: string;
  floorNumber: number;
  buildingSection?: string;
}

export interface Office {
  id: string;
  name: string;
  officeNumber: number;
  floorId: string;
  capacity: number;
  equipment?: string[];
  specialties?: string[];
  description?: string;
  isActive: boolean;
  floor?: FloorBasicInfo;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOfficeRequest {
  name: string;
  officeNumber: number;
  floorId: string;
  capacity: number;
  equipment?: string[];
  specialties?: string[];
  description?: string;
  isActive?: boolean;
}

export interface UpdateOfficeRequest {
  name?: string;
  officeNumber?: number;
  floorId?: string;
  capacity?: number;
  equipment?: string[];
  specialties?: string[];
  description?: string;
  isActive?: boolean;
}

export interface OfficeFilters {
  search?: string;
  floorId?: string;
  specialty?: string;
  minCapacity?: number;
  maxCapacity?: number;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface OfficesPagination {
  total: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}
