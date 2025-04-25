"use client";

import { useEffect, useState } from "react";
import ChangePassword from "@/components/ChangePassword";
import MainLayout from "@/components/MainLayout";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function ChangePasswordPage() {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    setIsClient(true);
    // Redirect to login if not authenticated
    if (!token) {
      router.push("/auth/login");
    }
  }, [token, router]);

  // Prevent hydration errors by not rendering during SSR
  if (!isClient) {
    return null;
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <ChangePassword />
        </div>
      </div>
    </MainLayout>
  );
}
