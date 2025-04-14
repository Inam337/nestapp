import axios, { AxiosInstance } from "axios";
import {
  Customer,
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
} from "../types";

const API_URL = "http://localhost:3000";

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
    });

    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await this.api.post<AuthResponse>(
      "/auth/login",
      credentials
    );
    return data;
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const { data } = await this.api.post<AuthResponse>(
      "/auth/register",
      credentials
    );
    return data;
  }

  // Customer endpoints
  async getCustomers(): Promise<Customer[]> {
    const { data } = await this.api.get<Customer[]>("/customers");
    return data;
  }

  async getCustomer(id: number): Promise<Customer> {
    const { data } = await this.api.get<Customer>(`/customers/${id}`);
    return data;
  }

  async createCustomer(customer: Omit<Customer, "id">): Promise<Customer> {
    const { data } = await this.api.post<Customer>("/customers", customer);
    return data;
  }

  async updateCustomer(
    id: number,
    customer: Partial<Customer>
  ): Promise<Customer> {
    const { data } = await this.api.patch<Customer>(
      `/customers/${id}`,
      customer
    );
    return data;
  }

  async deleteCustomer(id: number): Promise<void> {
    await this.api.delete(`/customers/${id}`);
  }
}

export const apiService = new ApiService();
