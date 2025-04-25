import axios from "axios";
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  RefreshTokenResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from "@/types/user.types";
import axiosInstance from "./axios.config";

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log("Login request initiated for:", credentials.email);

      const response = await axiosInstance.post<AuthResponse>(
        "auth/login",
        credentials
      );

      // Check if response includes a user with inactive status
      if (response.data?.user?.status === false) {
        console.warn("Login attempt by inactive user:", credentials.email);
        // We'll let the saga handle this, but we won't store the tokens
      } else {
        // Store tokens and user data in localStorage only for active users
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("refreshToken", response.data.refreshToken);
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...response.data.user,
              // Ensure status is included
              status: response.data.user.status ?? true,
            })
          );
        }
      }

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
      console.log("Register request initiated for:", credentials.email);

      const response = await axiosInstance.post<AuthResponse>(
        "auth/register",
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
        "auth/refresh-token",
        { refreshToken }
      );

      // Update tokens in localStorage
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async logout(): Promise<void> {
    try {
      // For JWT, we just need to clear the local storage
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      sessionStorage.clear();

      // Optional: Call a server-side logout endpoint if needed
      // await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }

  static async getCurrentUser(): Promise<AuthResponse> {
    try {
      // For JWT, we can get the user from localStorage
      const userJson = localStorage.getItem("user");
      if (!userJson) {
        throw new Error("User not found in local storage");
      }

      const user = JSON.parse(userJson);
      const token = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!token || !refreshToken) {
        throw new Error("Authentication tokens not found");
      }

      return {
        user,
        token,
        refreshToken,
        success: true,
        message: "User retrieved from local storage",
      };
    } catch (error) {
      console.error("Get current user error:", error);
      throw error;
    }
  }

  static async changePassword(
    data: ChangePasswordRequest
  ): Promise<ChangePasswordResponse> {
    try {
      console.log("Change password request initiated");

      // Get the token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required. Please log in again.");
      }

      const response = await axiosInstance.post<ChangePasswordResponse>(
        "auth/change-password",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Password changed successfully");
      return response.data;
    } catch (error) {
      console.error("Change password error:", error);
      throw error;
    }
  }
}

export const authService = new AuthService();
