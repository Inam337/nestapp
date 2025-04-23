"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import MainLayout from "@/components/MainLayout";

export default function DashboardPage() {
  const router = useRouter();
  const { token, user } = useSelector((state: RootState) => state.auth);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!token || !user) {
      router.push("/auth/login");
    }
  }, [token, user, router]);

  // Only render content after the first client render
  if (!isClient) {
    return null; // Return empty during SSR to avoid hydration mismatch
  }

  // After client-side hydration, check auth
  if (!token || !user) {
    return null; // or a loading spinner
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Stats Cards */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">
              Total Products
            </h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">120</p>
            <div className="flex items-center text-green-500 text-sm mt-2">
              <span>↑ 12%</span>
              <span className="text-gray-400 ml-2">vs last month</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">
              Low Stock Items
            </h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">8</p>
            <div className="flex items-center text-red-500 text-sm mt-2">
              <span>↑ 2</span>
              <span className="text-gray-400 ml-2">items need restock</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">
              Total Categories
            </h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">15</p>
            <div className="flex items-center text-green-500 text-sm mt-2">
              <span>↑ 3</span>
              <span className="text-gray-400 ml-2">new categories</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Stock Value</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">$45,850</p>
            <div className="flex items-center text-green-500 text-sm mt-2">
              <span>↑ 8%</span>
              <span className="text-gray-400 ml-2">vs last month</span>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-lg shadow mt-6">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900">
              Recent Activity
            </h2>
            <div className="mt-4 space-y-4">
              {/* Activity Items */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg
                      className="h-5 w-5 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </span>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      New product added
                    </p>
                    <p className="text-sm text-gray-500">Wireless Keyboard</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
