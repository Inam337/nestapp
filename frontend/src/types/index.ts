export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export interface AuthResponse {
  access_token: string;
}
