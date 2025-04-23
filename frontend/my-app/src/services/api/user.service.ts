import axios, { AxiosError } from "axios";
import {
  User,
  UserListResponse,
  UpdateUserStatusRequest,
} from "@/types/user.types";

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
        isActive: user.isActive !== undefined ? user.isActive : user.status,
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
        isActive: user.isActive !== undefined ? user.isActive : user.status,
      };
    } catch (error) {
      this.handleApiError(error, `Failed to fetch user with ID ${id}`);
    }
  }

  async updateUserStatus(id: number, isActive: boolean): Promise<User> {
    try {
      console.log(`Attempting to update user ${id} status to ${isActive}`);

      try {
        // Use the dedicated status endpoint
        const response = await axios.patch(
          `${this.baseUrl}/users/${id}/status`,
          { isActive }
        );
        console.log(`User ${id} status updated successfully`);
        return response.data;
      } catch (error) {
        // If API call fails, try local fallback
        console.warn(`API call failed, using local fallback`);

        // Check if we have the user in our local cache
        if (this.users.length > 0) {
          const userIndex = this.users.findIndex((user) => user.id === id);

          if (userIndex !== -1) {
            // Update the local cache
            const updatedUser = {
              ...this.users[userIndex],
              isActive,
              updatedAt: new Date().toISOString(),
            };

            this.users[userIndex] = updatedUser;
            console.log(
              `User ${id} status updated in local cache only`,
              updatedUser
            );

            // Return the updated user object
            return updatedUser;
          }
        }

        // If we can't find the user locally either, rethrow the original error
        throw error;
      }
    } catch (error) {
      console.error(`Error updating user status:`, error);
      this.handleApiError(
        error,
        `Failed to update status for user with ID ${id}`
      );
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
