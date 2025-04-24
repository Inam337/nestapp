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
  firebaseToken?: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  firebaseToken: string;
  role: string;
}

export interface AuthResponse {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  token: string;
  refreshToken: string;
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
