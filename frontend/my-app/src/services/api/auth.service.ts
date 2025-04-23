import axios from "axios";
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  RefreshTokenResponse,
} from "@/types/user.types";
import axiosInstance from "./axios.config";

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log("Login credentials:", {
        email: credentials.email,
        hasFirebaseToken: !!credentials.firebaseToken,
      });

      const response = await axiosInstance.post<AuthResponse>(
        "/auth/login",
        credentials
      );
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  static async register(
    credentials: RegisterCredentials
  ): Promise<AuthResponse> {
    try {
      console.log("Register request:", {
        email: credentials.email,
        name: credentials.name,
        hasFirebaseToken: !!credentials.firebaseToken,
      });

      const response = await axiosInstance.post<AuthResponse>(
        "/auth/register",
        credentials
      );
      return response.data;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  }

  static async refreshToken(
    refreshToken: string
  ): Promise<RefreshTokenResponse> {
    try {
      const response = await axiosInstance.post<RefreshTokenResponse>(
        "/auth/refresh-token",
        { refreshToken }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async logout(): Promise<void> {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      throw error;
    }
  }

  static async getCurrentUser(): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.get<AuthResponse>("/auth/me");
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const authService = new AuthService();
