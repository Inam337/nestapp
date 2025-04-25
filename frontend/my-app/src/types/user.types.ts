export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    status?: boolean;
  };
  token: string;
  refreshToken: string;
  success?: boolean;
  message?: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  registrationSuccess: boolean;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page?: number;
  limit?: number;
}

export interface UpdateUserStatusRequest {
  isActive: boolean;
}

export interface UsersState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
  total: number;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}
