"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/store/auth/auth.slice";
import { RootState } from "@/store/store";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import LoginBackground from "../../../assets/bg/bg.jpg";
import Link from "next/link";
import Logo from "../../../assets/logo/logo.svg";
import { LoginCredentials } from "@/types/user.types";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

interface LoginFormValues {
  email: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error, token } = useSelector(
    (state: RootState) => state.auth
  );
  const [authError, setAuthError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Check if already logged in
    if (token) {
      router.push("/dashboard");
    }

    // Display Redux error when it exists
    if (error) {
      setAuthError(error);

      // Log the error for debugging purposes
      if (error.includes("inactive")) {
        console.log("Account inactive error detected");
      }
    }
  }, [token, router, error]);

  const initialValues: LoginFormValues = {
    email: "",
    password: "",
  };

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      setAuthError(null);
      console.log("Attempting to sign in...");

      // Dispatch login action directly with credentials
      const loginData: LoginCredentials = {
        email: values.email,
        password: values.password,
      };

      console.log("Dispatching login action to Redux");
      dispatch(login(loginData));
    } catch (error: any) {
      console.error("Login error:", error);

      // Check for inactive user message
      if (error.message) {
        console.log("server", error.message);
        setAuthError(
          "Your account is inactive. Please contact the administrator to activate your account."
        );
      } else {
        setAuthError(error.message || "An unexpected error occurred");
      }
    }
  };

  // Helper function to render error message with enhanced UI for inactive users
  const renderErrorMessage = (errorMsg: string | null) => {
    if (!errorMsg) return null;

    const isInactiveError = errorMsg.toLowerCase().includes("inactive");

    return (
      <div className="rounded-md bg-red-50 p-4 mb-4">
        <div className="text-sm text-red-700">
          <p>{errorMsg}</p>

          {isInactiveError && (
            <div className="mt-2 pt-2 border-t border-red-200">
              <p className="font-medium">Need help?</p>
              <p>
                Please contact our support team at{" "}
                <a
                  href="mailto:support@example.com"
                  className="text-blue-600 hover:underline"
                >
                  support@example.com
                </a>{" "}
                to reactivate your account.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Prevent hydration errors by not rendering during SSR
  if (!isClient) {
    return null;
  }

  return (
    <div className="flex w-full h-full flex-row">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full">
        <div className=" bg-green-100  ">
          <Image
            className="w-full flex object-cover overflow-hidden"
            src={LoginBackground}
            style={{ height: "calc(100vh)" }}
            alt="background"
          />
        </div>
        <div className="flex flex-col justify-center items-center h-full">
          <div className="flex mt-2 mb-2">
            <Image
              src={Logo}
              alt="Logo"
              className="w-full flex object-cover overflow-hidden"
            />
          </div>
          <div>
            <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="mt-8">
                <div className="">
                  <div className="mb-2">
                    <label htmlFor="email" className="sr-only">
                      Email address
                    </label>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className={`appearance-none  relative block w-full px-3 py-2 border 
    ${errors.email && touched.email ? "border-red-500" : "border-gray-300"} 
    placeholder-gray-500 text-gray-900 rounded-md 
    focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                      placeholder="Email address"
                    />
                    {errors.email && touched.email && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </div>
                    )}
                  </div>
                  <div className="mb-2">
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      className={`appearance-none  relative block w-full px-3 py-2 border 
    ${
      errors.password && touched.password ? "border-red-500" : "border-gray-300"
    } 
    placeholder-gray-500 text-gray-900 rounded-md 
    focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                      placeholder="Password"
                    />
                    {errors.password && touched.password && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.password}
                      </div>
                    )}
                  </div>
                </div>

                {/* Display auth errors */}
                {renderErrorMessage(authError || error)}

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                      loading
                        ? "bg-indigo-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    }`}
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </button>
                </div>
                <div className="footer mt-10 space-y-2 text-center text-sm text-gray-600">
                  <p>
                    If you don&apos;t have an account,{" "}
                    <Link
                      href="/auth/register"
                      className="text-blue-600 hover:underline"
                    >
                      Register
                    </Link>
                    .
                  </p>
                  <p>
                    By continuing, you agree to our{" "}
                    <Link
                      href="/terms"
                      className="text-blue-600 hover:underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-blue-600 hover:underline"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
