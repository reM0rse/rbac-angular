export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  roleId?: string;
  role: string;
  permissionIds?: string[];
}

export interface Role {
  id: string;
  name: string;
  permissionIds: string[];
}

export interface Permission {
  id: string;
  name: string;
} 