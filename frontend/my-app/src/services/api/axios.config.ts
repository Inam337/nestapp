import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { refreshTokenFailure } from "@/store/auth/auth.slice";
import { store } from "@/store/store";

// Update the API_URL to include /api if not present
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/";

console.log("API URL:", API_URL); // Debug log

// Ensure API_URL is properly formed
const normalizedUrl = API_URL.endsWith("/") ? API_URL : `${API_URL}/`;
console.log("Normalized API URL:", normalizedUrl);

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface ApiErrorResponse {
  message?: string;
  statusCode?: number;
  error?: string;
  errors?: Array<{ message: string }>;
  detail?: string;
  [key: string]: any; // Allow additional properties
}

interface CustomError {
  message: string;
  status: number;
  data?: any;
}

interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

const axiosInstance = axios.create({
  baseURL: normalizedUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 second timeout
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Making request to:", `${config.baseURL}${config.url}`, {
      method: config.method?.toUpperCase(),
      headers: config.headers,
      data: config.data ? "Data present" : "No data",
    });
    return config;
  },
  (error: AxiosError) => {
    console.error("Request interceptor error:", error);
    return Promise.reject({
      message: "Failed to set up the request",
      status: 500,
      data: error,
    });
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log("Response received:", {
      status: response.status,
      url: response.config.url,
      dataSize: response.data ? JSON.stringify(response.data).length : 0,
    });
    return response;
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    console.error("Response error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      data: error.response?.data || "No response data",
    });

    // If there's no error object, return a generic error
    if (!error) {
      return Promise.reject({
        message: "An unknown error occurred",
        status: 500,
      });
    }

    const originalRequest = error.config as CustomAxiosRequestConfig;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Try to refresh the token only once
      if (originalRequest) {
        originalRequest._retry = true;

        try {
          // Try to get a new token
          const refreshToken = localStorage.getItem("refreshToken");

          if (!refreshToken) {
            // No refresh token available, proceed with logout
            handleLogout();
            return Promise.reject({
              message: "Session expired. Please login again.",
              status: 401,
            });
          }

          // Call refresh token endpoint
          const response = await axios.post<RefreshTokenResponse>(
            `${API_URL}/auth/refresh-token`,
            { refreshToken }
          );

          // Update tokens
          const { token, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem("token", token);
          localStorage.setItem("refreshToken", newRefreshToken);

          // Update Authorization header
          originalRequest.headers.Authorization = `Bearer ${token}`;

          // Retry the original request
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          // Refresh token failed, proceed with logout
          handleLogout();
          return Promise.reject({
            message: "Session expired. Please login again.",
            status: 401,
          });
        }
      }

      // If originalRequest is undefined (shouldn't happen normally)
      handleLogout();
      return Promise.reject({
        message: "Session expired. Please login again.",
        status: 401,
      });
    }

    // If we have a response from the server
    if (error.response) {
      // Extract more detailed error information
      const serverError = error.response.data;
      console.error("Detailed API error:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: serverError,
        url: error.config?.url,
        method: error.config?.method,
      });

      // Add special handling for 500 errors
      if (error.response.status === 500) {
        console.error("SERVER ERROR 500! Request details:", {
          url: `${error.config?.baseURL}${error.config?.url}`,
          method: error.config?.method?.toUpperCase(),
          headers: error.config?.headers,
          data: error.config?.data
            ? JSON.parse(String(error.config.data))
            : null,
          params: error.config?.params,
        });

        if (
          serverError &&
          typeof serverError === "object" &&
          "stack" in serverError
        ) {
          console.error("Server stack trace:", serverError.stack);
        }
      }

      // Format a more user-friendly error message
      let errorMessage = "Server error";

      if (typeof serverError === "string") {
        errorMessage = serverError;
      } else if (serverError && typeof serverError === "object") {
        // Try to extract error message from various common API error formats
        errorMessage =
          serverError.message ||
          serverError.error ||
          serverError.errors?.[0]?.message ||
          serverError.detail ||
          error.message ||
          "Unknown server error";
      }

      const customError: CustomError = {
        message: errorMessage,
        status: error.response.status,
        data: serverError,
      };

      return Promise.reject(customError);
    }

    // If the request was made but no response was received
    if (error.request) {
      const customError: CustomError = {
        message:
          "No response from server. Please check if the server is running.",
        status: 503,
        data: { originalError: error.message },
      };
      console.error("Network error details:", customError);
      return Promise.reject(customError);
    }

    // Something happened in setting up the request
    const customError: CustomError = {
      message: error.message || "Failed to make the request",
      status: 500,
      data: { originalError: error.toJSON() },
    };
    console.error("Request setup error details:", customError);
    return Promise.reject(customError);
  }
);

// Helper function to handle logout
function handleLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");

  // Also dispatch a logout action to update Redux state
  if (store) {
    store.dispatch(refreshTokenFailure("Session expired"));
  }

  // Redirect to login page
  window.location.href = "/auth/login";
}

export default axiosInstance;
