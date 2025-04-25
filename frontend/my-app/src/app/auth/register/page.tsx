"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { register, resetRegistration } from "@/store/auth/auth.slice";
import { RootState } from "@/store/store";
import { RegisterCredentials } from "@/types/user.types";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import LoginBackground from "../../../assets/bg/bg.jpg";
import Link from "next/link";

const registerSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
}

export default function Register() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [authError, setAuthError] = useState<string | null>(null);
  const { loading, error, registrationSuccess } = useSelector(
    (state: RootState) => state.auth
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (registrationSuccess) {
      dispatch(resetRegistration());
      router.push("/auth/login");
    }
  }, [registrationSuccess, router, dispatch]);

  const initialValues: RegisterFormValues = {
    name: "",
    email: "",
    password: "",
  };

  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      setAuthError(null);
      console.log("Starting registration process...");

      // Dispatch register action directly with credentials
      const registerData: RegisterCredentials = {
        name: values.name,
        email: values.email,
        password: values.password,
        role: "user", // default role
      };

      console.log("Dispatching register action to API");
      dispatch(register(registerData));
    } catch (error: any) {
      console.error("Registration error:", error);
      setAuthError(error.message || "Registration failed. Please try again.");
    }
  };

  // Prevent hydration errors by not rendering during SSR
  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create your account
            </h2>
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={registerSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="mt-8">
                <div className="">
                  <div className="mb-2">
                    <label htmlFor="name" className="sr-only">
                      Full Name
                    </label>
                    <Field
                      id="name"
                      name="name"
                      type="text"
                      className={`appearance-none relative block w-full px-3 py-2 border 
    ${errors.email && touched.email ? "border-red-500" : "border-gray-300"} 
    placeholder-gray-500 text-gray-900 rounded-md 
    focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                      placeholder="Full Name"
                    />
                    {errors.name && touched.name && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.name}
                      </div>
                    )}
                  </div>
                  <div className="mb-2">
                    <label htmlFor="email" className="sr-only">
                      Email address
                    </label>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className={`appearance-none relative block w-full px-3 py-2 border 
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
                      autoComplete="new-password"
                      className={`appearance-none relative block w-full px-3 py-2 border 
    ${errors.email && touched.email ? "border-red-500" : "border-gray-300"} 
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

                {(error || authError) && (
                  <div className="rounded-md bg-red-50 p-4 mt-4">
                    <div className="text-sm text-red-700">
                      {authError || error}
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                      loading
                        ? "bg-indigo-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    }`}
                  >
                    {loading ? "Creating account..." : "Create account"}
                  </button>
                </div>
                <div className="mt-4 text-center text-sm text-gray-600">
                  <p>
                    Already have an account?{" "}
                    <Link
                      href="/auth/login"
                      className="text-indigo-600 hover:text-indigo-500"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
                <div className="mt-4 text-sm text-gray-600 text-center">
                  <p>
                    By continuing, you agree to our{" "}
                    <Link
                      href="/terms"
                      className="text-indigo-600 hover:text-indigo-500"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-indigo-600 hover:text-indigo-500"
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

      {/* Right Column - Image */}
      <div className="hidden lg:block relative flex-1">
        <Image
          className="absolute inset-0 h-full w-full object-cover"
          src={LoginBackground}
          alt="Register background"
          fill
          priority
        />
      </div>
    </div>
  );
}
