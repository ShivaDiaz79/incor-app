export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PermissionFilters {
  page?: number;
  limit?: number;
  resource?: string;
  action?: string;
  search?: string;
}

export interface PermissionsResponse {
  data: Permission[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PermissionsByResource {
  [resource: string]: Permission[];
}

export enum PermissionAction {
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete",
}

export interface ResourcePermissions {
  resource: string;
  permissions: Permission[];
}
