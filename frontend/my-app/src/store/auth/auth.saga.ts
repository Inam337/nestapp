import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import {
  login,
  loginFailure,
  loginSuccess,
  register,
  registerFailure,
  registerSuccess,
  logout,
  logoutSuccess,
  logoutFailure,
  refreshToken,
  refreshTokenSuccess,
  refreshTokenFailure,
} from "./auth.slice";
import {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  RefreshTokenResponse,
} from "@/types/user.types";
import { AuthService } from "@/services/api/auth.service";
import { toast } from "react-toastify";

function* loginSaga(
  action: PayloadAction<LoginCredentials>
): SagaIterator<void> {
  try {
    console.log("Processing login request in saga...");

    // Make sure we have a Firebase token
    if (!action.payload.firebaseToken) {
      console.error("Firebase token missing in login request");
      throw new Error("Firebase authentication required");
    }

    console.log("Calling login API with Firebase token");
    const response: AuthResponse = yield call(
      AuthService.login,
      action.payload
    );

    console.log("Login successful, storing auth data...");

    // Store authentication data in localStorage
    localStorage.setItem("token", response.token);
    localStorage.setItem("refreshToken", response.refreshToken);
    localStorage.setItem("user", JSON.stringify(response.user));

    yield put(loginSuccess(response));
    console.log("Redux store updated with login success");

    // Using window.location.href for a full page reload which can help with state reset issues
    window.location.href = "/dashboard";
  } catch (error: any) {
    console.error("Login saga error:", error);
    yield put(loginFailure(error.message || "Login failed"));
    toast.error(error.message || "Login failed");
  }
}

function* registerSaga(
  action: PayloadAction<RegisterCredentials>
): SagaIterator<void> {
  try {
    console.log("Processing registration request...");

    // Make sure we have a Firebase token
    if (!action.payload.firebaseToken) {
      throw new Error("Firebase authentication required");
    }

    const response: AuthResponse = yield call(
      AuthService.register,
      action.payload
    );

    // Do not store authentication data after registration
    // User should log in explicitly
    console.log("Registration successful");

    yield put(registerSuccess(response));
    toast.success("Registration successful! Please login.");

    // Redirect to login page after successful registration
    window.location.href = "/auth/login";
  } catch (error: any) {
    console.error("Registration saga error:", error);
    yield put(registerFailure(error.message || "Registration failed"));
    toast.error(error.message || "Registration failed");
  }
}

function* logoutSaga(): SagaIterator<void> {
  try {
    console.log("Processing logout in saga...");

    // Call API to logout
    yield call(AuthService.logout);
    console.log("API logout successful");

    // Clear authentication data from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      console.log("Local storage cleared");
    }

    yield put(logoutSuccess());
    console.log("Logout success action dispatched");

    // Redirect to login page after logout
    window.location.href = "/auth/login";
  } catch (error: any) {
    console.error("Logout saga error:", error);
    yield put(logoutFailure(error.message || "Logout failed"));
    toast.error(error.message || "Logout failed");

    // Even if the API call fails, we still want to log the user out locally
    yield put(logoutSuccess());
    window.location.href = "/auth/login";
  }
}

function* refreshTokenSaga(): SagaIterator<void> {
  try {
    const currentRefreshToken = localStorage.getItem("refreshToken");

    if (!currentRefreshToken) {
      throw new Error("No refresh token available");
    }

    const response: RefreshTokenResponse = yield call(
      AuthService.refreshToken,
      currentRefreshToken
    );

    // Update tokens in localStorage
    localStorage.setItem("token", response.token);
    localStorage.setItem("refreshToken", response.refreshToken);

    yield put(refreshTokenSuccess(response));
  } catch (error: any) {
    yield put(refreshTokenFailure(error.message || "Token refresh failed"));

    // If refresh token fails, log the user out
    yield put(logout());
  }
}

export function* authSaga(): SagaIterator<void> {
  yield takeLatest(login.type, loginSaga);
  yield takeLatest(register.type, registerSaga);
  yield takeLatest(logout.type, logoutSaga);
  yield takeLatest(refreshToken.type, refreshTokenSaga);
}
