import axios, { AxiosError } from "axios";
import { User } from "@/types/user.types";

export class UserService {
  private baseUrl = "http://localhost:3000";
  private users: User[] = []; // Local cache of users for fallback functionality

  async getUsers(): Promise<{ users: User[]; total: number }> {
    try {
      const response = await axios.get(`${this.baseUrl}/users`);
      console.log("Users data from API:", response.data);

      // Store users in our local cache for fallback functionality
      this.users = Array.isArray(response.data) ? response.data : [];

      // Transform the response data to ensure isActive is available
      // (backend returns status, frontend uses isActive)
      this.users = this.users.map((user) => ({
        ...user,
      }));

      return {
        users: this.users,
        total: this.users.length,
      };
    } catch (error) {
      this.handleApiError(error, "Failed to fetch users from API");
    }
  }

  async getUserById(id: number): Promise<User> {
    try {
      const response = await axios.get(`${this.baseUrl}/users/${id}`);
      const user = response.data;

      // Ensure isActive is available (backend returns status, frontend uses isActive)
      return {
        ...user,
      };
    } catch (error) {
      this.handleApiError(error, `Failed to fetch user with ID ${id}`);
    }
  }

  private handleApiError(error: unknown, defaultMessage: string): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        // Server responded with an error status code
        const status = axiosError.response.status;
        const data = axiosError.response.data as any;
        const errorMessage =
          data?.message || data?.error || JSON.stringify(data);

        // Log the full error details for debugging
        console.error(`API Error (${status}):`, {
          url: axiosError.config?.url,
          method: axiosError.config?.method,
          data: axiosError.config?.data,
          error: data,
        });

        throw new Error(`API Error (${status}): ${errorMessage}`);
      } else if (axiosError.request) {
        // Request was made but no response was received
        throw new Error(
          `Network Error: Unable to connect to API server at ${this.baseUrl}. Please check if the server is running.`
        );
      } else {
        // Error in setting up the request
        throw new Error(`Request Error: ${axiosError.message}`);
      }
    }

    // For non-Axios errors
    throw new Error(
      `${defaultMessage}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export default UserService;
