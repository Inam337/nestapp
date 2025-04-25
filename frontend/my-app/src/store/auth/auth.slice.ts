import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, User } from "@/types/user.types";

// Function to get initial state from localStorage
const getInitialState = (): AuthState => {
  // Check if window exists (for server-side rendering)
  if (typeof window !== "undefined") {
    try {
      const token = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken");
      const userString = localStorage.getItem("user");

      if (token && userString) {
        const user = JSON.parse(userString);
        return {
          user,
          token,
          refreshToken,
          loading: false,
          error: null,
          registrationSuccess: false,
        };
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
    }
  }

  // Default initial state if no user found in localStorage
  return {
    user: null,
    token: null,
    refreshToken: null,
    loading: false,
    error: null,
    registrationSuccess: false,
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    // Login actions
    login: (
      state,
      action: PayloadAction<{ email: string; password: string }>
    ) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string; refreshToken: string }>
    ) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Register actions
    register: (
      state,
      action: PayloadAction<{
        name: string;
        email: string;
        password: string;
        role?: string;
      }>
    ) => {
      state.loading = true;
      state.error = null;
      state.registrationSuccess = false;
    },
    registerSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string; refreshToken: string }>
    ) => {
      state.loading = false;
      state.error = null;
      state.registrationSuccess = true;
      // Don't set user and token on registration success
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.registrationSuccess = false;
    },

    // Logout actions
    logout: (state) => {
      state.loading = true;
      state.error = null;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.error = null;
      state.registrationSuccess = false;
      state.loading = false;

      // Also clear localStorage and sessionStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
      }
    },
    logoutFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Refresh token actions
    refreshToken: (state) => {
      state.loading = true;
      state.error = null;
    },
    refreshTokenSuccess: (
      state,
      action: PayloadAction<{ token: string; refreshToken: string }>
    ) => {
      state.loading = false;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.error = null;
    },
    refreshTokenFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Other actions
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    resetRegistration: (state) => {
      state.registrationSuccess = false;
    },
  },
});

export const {
  login,
  loginSuccess,
  loginFailure,
  register,
  registerSuccess,
  registerFailure,
  logout,
  logoutSuccess,
  logoutFailure,
  refreshToken,
  refreshTokenSuccess,
  refreshTokenFailure,
  setUser,
  resetRegistration,
} = authSlice.actions;

export default authSlice.reducer;
