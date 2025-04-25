"use client";

import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/api/auth.service";
import Link from "next/link";

const changePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .min(8, "New password must be at least 8 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your new password"),
});

interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword = () => {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const initialValues: ChangePasswordFormValues = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const handleSubmit = async (values: ChangePasswordFormValues) => {
    try {
      setApiError(null);
      setSuccess(null);
      setLoading(true);

      await AuthService.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      setSuccess("Password changed successfully!");

      // Reset form values
      values.currentPassword = "";
      values.newPassword = "";
      values.confirmPassword = "";
    } catch (error: any) {
      console.error("Password change error:", error);
      setApiError(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Change Password
      </h2>

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {success}
        </div>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={changePasswordSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Current Password
                </label>
                <Field
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  className={`appearance-none relative block w-full px-3 py-2 border 
                    ${
                      errors.currentPassword && touched.currentPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    } 
                    placeholder-gray-500 text-gray-900 rounded-md 
                    focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder="Enter your current password"
                />
                {errors.currentPassword && touched.currentPassword && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.currentPassword}
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  New Password
                </label>
                <Field
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  className={`appearance-none relative block w-full px-3 py-2 border 
                    ${
                      errors.newPassword && touched.newPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    } 
                    placeholder-gray-500 text-gray-900 rounded-md 
                    focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder="Enter your new password"
                />
                {errors.newPassword && touched.newPassword && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.newPassword}
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm New Password
                </label>
                <Field
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className={`appearance-none relative block w-full px-3 py-2 border 
                    ${
                      errors.confirmPassword && touched.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    } 
                    placeholder-gray-500 text-gray-900 rounded-md 
                    focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder="Confirm your new password"
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword}
                  </div>
                )}
              </div>
            </div>

            {apiError && (
              <div className="mt-4 rounded-md bg-red-50 p-3">
                <div className="text-sm text-red-700">{apiError}</div>
              </div>
            )}

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white 
                  ${
                    loading
                      ? "bg-indigo-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  }`}
              >
                {loading ? "Changing Password..." : "Change Password"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ChangePassword;
