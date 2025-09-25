export interface Floor {
  id: string;
  name: string;
  floorNumber: number;
  buildingSection?: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFloorRequest {
  name: string;
  floorNumber: number;
  buildingSection?: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateFloorRequest {
  name?: string;
  floorNumber?: number;
  buildingSection?: string;
  description?: string;
  isActive?: boolean;
}

export interface FloorFilters {
  search?: string;
  buildingSection?: string;
  floorNumber?: number;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface FloorsPagination {
  total: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}
