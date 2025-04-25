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

    const response: AuthResponse = yield call(
      AuthService.login,
      action.payload
    );

    console.log("Login successful, checking user status...");

    // Check if user is inactive before updating the store
    if (response.user && response.user.status === false) {
      console.log("Login attempt by inactive user");
      yield put(
        loginFailure(
          "Account is inactive. Please contact the administrator to activate your account."
        )
      );
      toast.error(
        "Account is inactive. Please contact the administrator to activate your account."
      );
      return; // Exit early - don't update store with inactive user's data
    }

    console.log("User is active, updating store...");

    // Add status property to user object to match User type if not present
    yield put(
      loginSuccess({
        user: { ...response.user, status: response.user.status ?? true },
        token: response.token,
        refreshToken: response.refreshToken,
      })
    );
    console.log("Redux store updated with login success");

    // Using window.location.href for a full page reload which can help with state reset issues
    window.location.href = "/dashboard";
  } catch (error: any) {
    console.error("Login saga error:", error);

    // Check specifically for inactive user error or other specific errors
    if (error.message && error.message.includes("User is inactive")) {
      console.log("Login attempt by inactive user");
      yield put(
        loginFailure(
          "Account is inactive. Please contact the administrator to activate your account."
        )
      );
      toast.error(
        "Account is inactive. Please contact the administrator to activate your account."
      );
    } else {
      yield put(loginFailure(error.message || "Login failed"));
      toast.error(error.message || "Login failed");
    }
  }
}

function* registerSaga(
  action: PayloadAction<RegisterCredentials>
): SagaIterator<void> {
  try {
    console.log("Processing registration request...");

    const response: AuthResponse = yield call(
      AuthService.register,
      action.payload
    );

    // Do not store authentication data after registration
    // User should log in explicitly
    console.log("Registration successful");

    // Add status property to user object to match User type
    yield put(
      registerSuccess({
        user: { ...response.user, status: true },
        token: response.token,
        refreshToken: response.refreshToken,
      })
    );
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

    // Call service to clear localStorage
    yield call(AuthService.logout);
    console.log("Local storage cleared");

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
